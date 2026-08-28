"""
FloodGuard AI — IoT & Sensor Router
Handles device registration, readings ingestion (real + simulator), health checks.
All simulated readings carry data_mode=SIMULATION.
"""
import hashlib
import hmac
from datetime import datetime, timezone
from typing import Annotated
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
            "data_mode": "DEMO",
            "note": "IoT simulator active. No real devices connected in prototype.",
        },
    }
