"""
FloodGuard AI — API Endpoint Verification Test
Hits live FastAPI endpoints to verify status codes, schemas, data_mode tags,
and honest provider integration reporting.
"""
from fastapi.testclient import TestClient
from apps.api.src.main import app

client = TestClient(app)


def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert "data_mode" in data
    assert data["transparency"]["no_fabricated_live_data"] is True


def test_system_version_sih_metadata():
    res = client.get("/api/v1/system/version")
    assert res.status_code == 200
    data = res.json()
    assert data["problem_id"] == "SIH26192"
    assert data["sih_theme"] == "Disaster Management"


def test_ingestion_providers_registry():
    res = client.get("/api/v1/ingestion/providers")
    assert res.status_code == 200
    data = res.json()
    assert "providers" in data
    providers = data["providers"]
    # Check IMD provider is listed as NOT_CONFIGURED
    imd = next(p for p in providers if p["provider_id"] == "imd_national")
    assert imd["status"] == "NOT_CONFIGURED"
    assert imd["data_mode"] == "DEMO"


def test_ingestion_jobs_list():
    res = client.get("/api/v1/ingestion/jobs")
    assert res.status_code == 200
    data = res.json()
    assert "jobs" in data
    assert len(data["jobs"]) > 0


def test_provider_health_check_endpoint():
    res = client.get("/api/v1/ingestion/providers/cwc_national/health")
    assert res.status_code == 200
    data = res.json()
    assert data["provider_id"] == "cwc_national"
    assert data["status"] == "NOT_CONFIGURED"


def test_locations_list():
    res = client.get("/api/v1/locations")
    assert res.status_code in [200, 404] # if locations router exists
