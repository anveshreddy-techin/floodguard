"""
Unit tests for 100% Real-World Operational Capabilities:
- GloFAS live satellite river discharge integration
- OASIS CAP v1.2 XML emergency alert generation
- ESP32 hardware telemetry firmware generator
- Live satellite multi-source fusion prediction
- Dynamic A* topological hazard route calculation
"""
import pytest
from fastapi.testclient import TestClient
from apps.api.src.main import app

client = TestClient(app)

def test_cap_xml_feed_standard():
    res = client.get("/api/v1/alerts/cap.xml")
    assert res.status_code == 200
    assert "application/xml" in res.headers.get("content-type", "")
    assert "<feed" in res.text
    assert "urn:oasis:names:tc:emergency:cap:1.2" in res.text
    assert "<alert" in res.text
    assert "<identifier>" in res.text
    assert "<info>" in res.text

def test_esp32_arduino_firmware_generator():
    res = client.get("/api/v1/iot/firmware/node-chamoli-test-01/arduino?secret=test_sec_123")
    assert res.status_code == 200
    assert "text/x-c++src" in res.headers.get("content-type", "")
    assert "node-chamoli-test-01" in res.text
    assert "test_sec_123" in res.text
    assert "computeHMAC" in res.text
    assert "mbedtls_md_hmac" in res.text
    assert "esp_deep_sleep_start" in res.text

def test_dynamic_evacuation_routing_blocked_detection():
    # Route intersecting the flood hazard center (30.485, 79.692)
    res = client.post("/api/v1/safety/route/dynamic?origin_lat=30.480&origin_lon=79.690&dest_lat=30.490&dest_lon=79.694&hazard_lat=30.485&hazard_lon=79.692")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    route = data["route"]
    assert route["status"] == "BLOCKED"
    assert route["hazard_overlap"] is True
    assert len(route["waypoints"]) > 0

def test_dynamic_evacuation_routing_safe_candidate():
    # Route well away from the hazard
    res = client.post("/api/v1/safety/route/dynamic?origin_lat=30.520&origin_lon=79.720&dest_lat=30.540&dest_lon=79.740&hazard_lat=30.485&hazard_lon=79.692")
    assert res.status_code == 200
    data = res.json()
    route = data["route"]
    assert route["status"] in ("LOWER_EXPOSURE_CANDIDATE", "CANDIDATE_ROUTE")
    assert route["hazard_overlap"] is False

@pytest.mark.asyncio
async def test_cwc_coords_glofas_hydrology():
    from apps.api.src.providers.cwc_adapter import CWCAdapter
    cwc = CWCAdapter()
    res = await cwc.fetch_by_coords(30.485, 79.692)
    assert res["status"] == "SUCCESS"
    assert res["data_mode"] == "LIVE"
    assert res["discharge_cumecs"] > 0
    assert res["water_level_m"] > 0
    assert "Copernicus" in res["note"]

def test_ndrf_predict_live_fusion():
    res = client.post("/api/v1/ndrf/predict/live", json={"village_id": "uk-chamoli-raini"})
    assert res.status_code == 200
    data = res.json()
    assert data["data_mode"] == "LIVE"
    assert data["village"] == "Raini Village"
    assert data["state"] == "Uttarakhand"
    assert "risk_score" in data
    assert "factor_of_safety_fos" in data
    assert "live_telemetry_values" in data
    assert len(data["live_sources_used"]) >= 4
