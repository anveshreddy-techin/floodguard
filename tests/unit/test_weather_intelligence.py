"""
FloodGuard AI — Weather & Community Intelligence Unit Tests
Tests weather condition mapping, rainfall intensity classification,
current/hourly/daily endpoints, source comparisons, alert recommendations,
and community report verification workflows.
"""
import pytest
from fastapi.testclient import TestClient

from apps.api.src.main import app
from apps.api.src.models.weather import (
    WeatherConditionCode,
    RainfallIntensityClass,
    VerificationStatus,
)
from apps.api.src.providers.weather_provider import (
    map_wmo_code_to_condition,
    classify_rainfall_intensity,
)

client = TestClient(app)


def test_wmo_code_mapping():
    """Verify that WMO standard codes map accurately to normalized condition codes."""
    assert map_wmo_code_to_condition(0) == WeatherConditionCode.CLEAR_SUNNY
    assert map_wmo_code_to_condition(1) == WeatherConditionCode.CLEAR_SUNNY
    assert map_wmo_code_to_condition(2) == WeatherConditionCode.PARTLY_CLOUDY
    assert map_wmo_code_to_condition(3) == WeatherConditionCode.CLOUDY
    assert map_wmo_code_to_condition(45) == WeatherConditionCode.HAZE_FOG
    assert map_wmo_code_to_condition(61) == WeatherConditionCode.LIGHT_RAIN
    assert map_wmo_code_to_condition(63) == WeatherConditionCode.MODERATE_RAIN
    assert map_wmo_code_to_condition(65) == WeatherConditionCode.HEAVY_RAIN
    assert map_wmo_code_to_condition(82) == WeatherConditionCode.VERY_HEAVY_RAIN
    assert map_wmo_code_to_condition(95) == WeatherConditionCode.THUNDERSTORM
    assert map_wmo_code_to_condition(99) == WeatherConditionCode.HAZARDOUS_THUNDERSTORM
    assert map_wmo_code_to_condition(None) == WeatherConditionCode.UNKNOWN


def test_rainfall_intensity_classification():
    """Verify prototype rainfall classification thresholds."""
    assert classify_rainfall_intensity(0.0) == RainfallIntensityClass.NO_RAIN
    assert classify_rainfall_intensity(1.2) == RainfallIntensityClass.LIGHT_RAIN
    assert classify_rainfall_intensity(5.0) == RainfallIntensityClass.MODERATE_RAIN
    assert classify_rainfall_intensity(12.0) == RainfallIntensityClass.HEAVY_RAIN
    assert classify_rainfall_intensity(22.0) == RainfallIntensityClass.VERY_HEAVY_RAIN
    assert classify_rainfall_intensity(45.0) == RainfallIntensityClass.EXTREME_RAIN
    assert classify_rainfall_intensity(None) == RainfallIntensityClass.UNKNOWN


def test_current_weather_api():
    """Verify GET /api/v1/weather/current response schema and honesty."""
    resp = client.get("/api/v1/weather/current?lat=30.485&lon=79.692&mode=DEMO&state=Uttarakhand&district=Chamoli")
    assert resp.status_code == 200
    data = resp.json()
    assert "location" in data
    assert "conditions" in data
    assert "precipitation" in data
    assert "source" in data
    assert data["source"]["data_mode"] in ("DEMO", "LIVE", "SIMULATION")
    assert data["location"]["state"] == "Uttarakhand"
    assert data["location"]["district"] == "Chamoli"


def test_hourly_forecast_api():
    """Verify GET /api/v1/weather/hourly returns list of hourly forecast items."""
    resp = client.get("/api/v1/weather/hourly?lat=30.485&lon=79.692&hours=24&mode=DEMO")
    assert resp.status_code == 200
    data = resp.json()
    assert "hours" in data
    assert len(data["hours"]) == 24
    first_hour = data["hours"][0]
    assert "precipitation_mm" in first_hour
    assert "temperature_c" in first_hour
    assert "accumulated_precipitation_mm" in first_hour


def test_daily_forecast_api():
    """Verify GET /api/v1/weather/daily returns 7-day projection."""
    resp = client.get("/api/v1/weather/daily?lat=30.485&lon=79.692&days=7&mode=DEMO")
    assert resp.status_code == 200
    data = resp.json()
    assert "days" in data
    assert len(data["days"]) == 7
    first_day = data["days"][0]
    assert "temperature_min_c" in first_day
    assert "temperature_max_c" in first_day
    assert "total_precipitation_mm" in first_day


def test_weather_alerts_api():
    """Verify GET /api/v1/weather/alerts returns multi-hazard recommendations."""
    resp = client.get("/api/v1/weather/alerts?lat=30.485&lon=79.692&mode=DEMO")
    assert resp.status_code == 200
    data = resp.json()
    assert "alerts" in data
    assert "total_active" in data
    if data["total_active"] > 0:
        alert = data["alerts"][0]
        assert "category" in alert
        assert "recommendation_text" in alert
        assert "official_status" in alert


def test_weather_sources_api():
    """Verify GET /api/v1/weather/sources compares IMD, Open-Meteo, IoT, and Fusion."""
    resp = client.get("/api/v1/weather/sources?lat=30.485&lon=79.692")
    assert resp.status_code == 200
    data = resp.json()
    assert "sources" in data
    provider_ids = [s["provider_id"] for s in data["sources"]]
    assert "open_meteo" in provider_ids
    assert "imd_weather" in provider_ids
    assert "iot_rain_gauge" in provider_ids
    assert "floodguard_fusion" in provider_ids


def test_community_reports_workflow():
    """Verify submitting, listing, and operator verification of community reports."""
    # 1. Submit report
    payload = {
        "location": {
            "latitude": 30.485,
            "longitude": 79.692,
            "state": "Uttarakhand",
            "district": "Chamoli",
            "location_name": "Test Gully"
        },
        "report_type": "HEAVY_RAINFALL",
        "description": "Intense cloudburst rainfall starting near mountain ridge.",
        "severity": "HIGH",
        "language": "en",
        "is_anonymous": True
    }
    submit_resp = client.post("/api/v1/community/reports", json=payload)
    assert submit_resp.status_code == 201
    created = submit_resp.json()
    assert created["verification_status"] == VerificationStatus.UNVERIFIED.value
    report_id = created["report_id"]

    # 2. List reports
    list_resp = client.get("/api/v1/community/reports?state=Uttarakhand")
    assert list_resp.status_code == 200
    reports = list_resp.json()
    assert any(r["report_id"] == report_id for r in reports)

    # 3. Verify report by operator
    verify_payload = {
        "status": "CORROBORATED",
        "operator_notes": "Nearby AWS station confirms 42mm in 2 hours.",
        "operator_id": "operator-chamoli-01"
    }
    verify_resp = client.post(f"/api/v1/community/reports/{report_id}/verify", json=verify_payload)
    assert verify_resp.status_code == 200
    verified = verify_resp.json()
    assert verified["verification_status"] == "CORROBORATED"
    assert verified["reviewed_by"] == "operator-chamoli-01"
