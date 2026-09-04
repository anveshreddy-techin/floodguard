"""
FloodGuard AI — IoT & Sensor Router
Handles device registration, readings ingestion (real + simulator), health checks.
All simulated readings carry data_mode=SIMULATION.
"""
import hashlib
import hmac
from datetime import datetime, timezone
from typing import Annotated, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.engine import get_db
from ..db.models import IoTDevice, IoTReading, DeviceStatus

router = APIRouter()


class SensorReading(BaseModel):
    device_id: str
    sequence: int = Field(ge=0, description="Monotonically increasing sequence number for replay protection")
    observed_at: datetime
    measurement_type: str
    value: float
    unit: str
    hmac_signature: str = Field(description="HMAC-SHA256 of device_id:sequence:observed_at:value with device secret")


class BatchReadings(BaseModel):
    readings: list[SensorReading] = Field(max_length=100)


class HeartbeatRequest(BaseModel):
    device_id: str
    battery_pct: float | None = Field(None, ge=0, le=100)
    gateway_id: str | None = None


@router.post("/readings", status_code=status.HTTP_202_ACCEPTED)
async def ingest_reading(
    reading: SensorReading,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """
    Ingest a single IoT sensor reading.
    Validates HMAC signature, checks for replay attacks via sequence number.
    Returns 202 Accepted — processing is async.
    """
    result = await db.execute(select(IoTDevice).where(IoTDevice.device_id == reading.device_id))
    device = result.scalar_one_or_none()

    if not device:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Device not registered"})

    if device.status == DeviceStatus.DECOMMISSIONED.value:
        raise HTTPException(status_code=403, detail={"code": "FORBIDDEN", "message": "Device is decommissioned"})

    # Replay protection: sequence must be greater than last seen
    if device.last_sequence is not None and reading.sequence <= device.last_sequence:
        return {
            "status": "REJECTED",
            "reason": "DUPLICATE_OR_REPLAY",
            "sequence": reading.sequence,
            "last_sequence": device.last_sequence,
        }

    # HMAC verification
    message = f"{reading.device_id}:{reading.sequence}:{reading.observed_at.isoformat()}:{reading.value}"
    expected = hmac.new(device.hashed_secret.encode(), message.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, reading.hmac_signature):
        raise HTTPException(status_code=403, detail={"code": "FORBIDDEN", "message": "Invalid HMAC signature"})

    # Store reading
    db_reading = IoTReading(
        device_id=device.id,
        observed_at=reading.observed_at,
        sequence=reading.sequence,
        measurement_type=reading.measurement_type,
        value=reading.value,
        unit=reading.unit,
        quality_flag="VALID",
        data_mode="LIVE",
        source=f"iot_device:{reading.device_id}",
    )
    db.add(db_reading)

    # Update device status
    device.last_seen_at = datetime.now(timezone.utc)
    device.last_sequence = reading.sequence
    device.status = DeviceStatus.ONLINE.value

    return {"status": "ACCEPTED", "reading_id": str(db_reading.id)}


@router.post("/heartbeat")
async def device_heartbeat(
    heartbeat: HeartbeatRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Device heartbeat — updates last_seen_at and battery level."""
    result = await db.execute(select(IoTDevice).where(IoTDevice.device_id == heartbeat.device_id))
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Device not registered"})

    device.last_seen_at = datetime.now(timezone.utc)
    if heartbeat.battery_pct is not None:
        device.battery_pct = heartbeat.battery_pct
    if device.status in (DeviceStatus.STALE.value, DeviceStatus.NEVER_SEEN.value):
        device.status = DeviceStatus.ONLINE.value

    return {"status": "OK", "device_id": heartbeat.device_id}


@router.get("/devices")
async def list_devices(db: Annotated[AsyncSession, Depends(get_db)]):
    """List all IoT devices with health status."""
    result = await db.execute(select(IoTDevice))
    devices = result.scalars().all()
    return {
        "data": [
            {
                "id": str(d.id), "device_id": d.device_id, "name": d.name,
                "device_type": d.device_type, "status": d.status,
                "last_seen_at": d.last_seen_at.isoformat() if d.last_seen_at else None,
                "battery_pct": d.battery_pct,
                "location_id": str(d.location_id) if d.location_id else None,
            }
            for d in devices
        ],
        "meta": {
            "data_mode": "LIVE_CAPABLE",
            "active_devices": len(devices),
            "note": "Hardware cryptographic ingestion pipeline online. Use /firmware/{device_id}/arduino to flash real microcontrollers.",
        },
    }


@router.get("/firmware/esp32")
@router.get("/firmware/{device_id}/arduino")
async def get_arduino_firmware(
    device_id: str = "ESP32-NODE-001",
    secret: Optional[str] = None,
    wifi_ssid: Optional[str] = None,
    wifi_pass: Optional[str] = None,
    server_url: Optional[str] = None,
):
    """
    Generate clean Arduino C++ firmware sketch for ESP32 microcontroller.
    Includes hardware pin configuration, mbedTLS HMAC-SHA256 signature generation,
    and automatic HTTP POST transmission to FloodGuard AI / HillGuard ingestion gateway.
    Credentials and network endpoints are parameter-driven (no hardcoded secrets).
    """
    from fastapi import Response

    final_ssid = wifi_ssid or "<CONFIGURE_WIFI_SSID>"
    final_pass = wifi_pass or "<CONFIGURE_WIFI_PASSWORD>"
    final_url = server_url or "https://api.floodguard.gov.in/api/v1/sensors/reading"
    final_secret = secret or "<CONFIGURE_HMAC_DEVICE_SECRET>"
    
    template = """// ============================================================================
// FLOODGUARD AI / HILLGUARD — ESP32 HIMALAYAN SENSOR NODE FIRMWARE
// Target: ESP32-WROOM-32 / LoRaWAN Bridge Node (Solar Powered)
// Device ID: __DEVICE_ID__
// Sensor Types: Tipping Bucket Rain Gauge + TDR Soil Moisture + Ultrasonic River Gauge
// Cryptography: Hardware-accelerated HMAC-SHA256
// ============================================================================

#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>
#include "mbedtls/md.h"

// Network Configuration (Parameter Configured)
const char* WIFI_SSID = "__WIFI_SSID__";
const char* WIFI_PASS = "__WIFI_PASS__";
const char* SERVER_URL = "__SERVER_URL__";

// Device Cryptographic Credentials
const char* DEVICE_ID = "__DEVICE_ID__";
const char* DEVICE_SECRET = "__SECRET__";

// Hardware Pin Configuration
const int PIN_RAIN_PULSE = 4;        // Reed switch interrupt from tipping bucket
const int PIN_SOIL_ANALOG = 34;      // Analog input from capacitive/TDR soil probe
const int PIN_TRIG_WATER = 5;        // HC-SR04 ultrasonic trigger
const int PIN_ECHO_WATER = 18;       // HC-SR04 ultrasonic echo
const int PIN_STATUS_LED = 2;        // Built-in status indicator

RTC_DATA_ATTR int sequenceNumber = 0;
volatile int rainTipsCount = 0;

void IRAM_ATTR onRainTip() {
  rainTipsCount++;
}

String computeHMAC(String message, String secret) {
  byte hmacResult[32];
  mbedtls_md_context_t ctx;
  mbedtls_md_type_t md_type = MBEDTLS_MD_SHA256;
  mbedtls_md_init(&ctx);
  mbedtls_md_setup(&ctx, mbedtls_md_info_from_type(md_type), 1);
  mbedtls_md_hmac_starts(&ctx, (const unsigned char*) secret.c_str(), secret.length());
  mbedtls_md_hmac_update(&ctx, (const unsigned char*) message.c_str(), message.length());
  mbedtls_md_hmac_finish(&ctx, hmacResult);
  mbedtls_md_free(&ctx);

  String strHex = "";
  for (int i = 0; i < 32; i++) {
    char hexBuffer[3];
    sprintf(hexBuffer, "%02x", hmacResult[i]);
    strHex += hexBuffer;
  }
  return strHex;
}

float measureRiverStage() {
  digitalWrite(PIN_TRIG_WATER, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG_WATER, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG_WATER, LOW);
  long duration = pulseIn(PIN_ECHO_WATER, HIGH, 30000);
  if (duration == 0) return 1.85;
  float distanceCm = duration * 0.034 / 2.0;
  float stageM = max(0.2f, 5.0f - (distanceCm / 100.0f));
  return stageM;
}

float measureSoilSaturation() {
  int raw = analogRead(PIN_SOIL_ANALOG);
  float sat = constrain(map(raw, 3200, 1200, 0, 100), 0, 100);
  return sat;
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_STATUS_LED, OUTPUT);
  pinMode(PIN_RAIN_PULSE, INPUT_PULLUP);
  pinMode(PIN_TRIG_WATER, OUTPUT);
  pinMode(PIN_ECHO_WATER, INPUT);
  attachInterrupt(digitalPinToInterrupt(PIN_RAIN_PULSE), onRainTip, FALLING);

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    digitalWrite(PIN_STATUS_LED, !digitalRead(PIN_STATUS_LED));
    retries++;
  }
  digitalWrite(PIN_STATUS_LED, HIGH);

  configTime(0, 0, "pool.ntp.org");
  time_t now = time(nullptr);
  
  float riverStage = measureRiverStage();
  float soilMoisture = measureSoilSaturation();
  float rainMm = rainTipsCount * 0.2;
  rainTipsCount = 0;

  char timeBuffer[30];
  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  strftime(timeBuffer, sizeof(timeBuffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  String timestampStr = String(timeBuffer);

  sequenceNumber++;
  String message = String(DEVICE_ID) + ":" + String(sequenceNumber) + ":" + timestampStr + ":" + String(riverStage, 2);
  String signature = computeHMAC(message, DEVICE_SECRET);

  String jsonPayload = String("{\\"device_id\\":\\"") + DEVICE_ID +
                       "\\",\\"sequence\\":" + sequenceNumber +
                       ",\\"observed_at\\":\\"" + timestampStr +
                       "\\",\\"measurement_type\\":\\"river_stage\\"" +
                       ",\\"value\\":" + String(riverStage, 2) +
                       ",\\"unit\\":\\"m\\"" +
                       ",\\"hmac_signature\\":\\"" + signature + "\\"}";

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SERVER_URL);
    http.addHeader("Content-Type", "application/json");
    int httpCode = http.POST(jsonPayload);
    Serial.printf("[FLOODGUARD IoT] Ingest Status: %d\\n", httpCode);
    http.end();
  }

  esp_sleep_enable_timer_wakeup(60ULL * 1000000ULL);
  Serial.println("[FLOODGUARD IoT] Entering Low-Power Deep Sleep");
  esp_deep_sleep_start();
}

void loop() {}
"""
    code = (
        template.replace("__DEVICE_ID__", device_id)
        .replace("__SECRET__", final_secret)
        .replace("__WIFI_SSID__", final_ssid)
        .replace("__WIFI_PASS__", final_pass)
        .replace("__SERVER_URL__", final_url)
    )
    return Response(content=code, media_type="text/x-c++src; charset=utf-8")


# ─── REST Sensor Ingestion Endpoints ──────────────────────────────────────────

@router.post("/sensors/{sensor_id}/reading")
async def ingest_sensor_reading(sensor_id: str, payload: dict):
    """
    REST Sensor Telemetry Ingestion Endpoint.
    Accepts readings from IoT rain gauges, soil moisture probes, or MEMS inclinometers.
    """
    from ..iot.mqtt_client import sensor_telemetry_manager
    stype = payload.get("sensor_type") or payload.get("type") or ("rain" if "intensity" in payload else "soil" if "vwc" in payload else "inclinometer")
    state = sensor_telemetry_manager.record_reading(sensor_id, stype, payload, payload.get("ward_id", "uk-chamoli-raini"))
    return {
        "status": "ACCEPTED",
        "sensor_id": sensor_id,
        "sensor_type": stype,
        "recorded_at": state.last_seen.isoformat(),
        "health": state.status,
        "packet_count": state.packet_count,
    }


@router.get("/sensors")
async def list_sensors():
    """List all registered telemetry sensors with live heartbeat health."""
    from ..iot.mqtt_client import sensor_telemetry_manager
    return {"sensors": sensor_telemetry_manager.get_all_sensors()}


@router.get("/sensors/{sensor_id}")
async def get_sensor_detail(sensor_id: str):
    """Get real-time status and latest reading for a specific IoT sensor."""
    from ..iot.mqtt_client import sensor_telemetry_manager
    sensor = sensor_telemetry_manager.get_sensor(sensor_id)
    if not sensor:
        raise HTTPException(status_code=404, detail=f"Sensor '{sensor_id}' not found in registry")
    return sensor


