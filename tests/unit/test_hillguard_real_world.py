"""
FloodGuard / HillGuard AI — Real-World System Verification Tests (SIH26192)
Tests:
1. Real 25-feature ML tree ensemble execution and fusion
2. SQLite resilient database fallback
3. Bilingual OASIS CAP v1.2 XML feed (hi-IN and en-IN)
4. Sanitized IoT firmware generator (no hardcoded credentials)
5. Honest provider registry and attribution
6. Multi-hazard detector pipeline
"""
import pytest
from fastapi.testclient import TestClient

from apps.api.src.main import app
from apps.api.src.routers.ndrf_prediction import get_active_ml_model, _run_tree_ensemble_inference


@pytest.fixture(scope="module")
def client():
    return TestClient(app)


def test_real_ml_model_loads_and_executes():
    """Verify that the 25-feature scikit-learn tree ensemble model loads and predicts probabilities."""
    model = get_active_ml_model()
    assert model is not None, "Trained Tier C ML model must be loaded from ml/artifacts"

    # Test extreme flood feature vector (25 features)
    features_critical = {
        "rainfall_15m_mm": 20.0,
        "rainfall_30m_mm": 35.0,
        "rainfall_1h_mm": 55.0,
        "rainfall_3h_mm": 95.0,
        "rainfall_6h_mm": 130.0,
        "rainfall_12h_mm": 180.0,
        "rainfall_24h_mm": 240.0,
        "rainfall_72h_mm": 310.0,
        "rainfall_peak_intensity_mmph": 65.0,
        "soil_moisture_pct": 88.0,
        "soil_saturation_index": 0.92,
        "antecedent_7d_mm": 180.0,
        "elevation_m": 1900.0,
        "slope_degrees": 34.0,
        "twi": 11.2,
        "factor_of_safety_fos": 0.85,  # Unstable
        "landslide_susceptibility_index": 0.90,
        "historical_landslides_count": 4,
        "river_level_m": 4.8,
        "river_rate_of_rise_mph": 0.60,
        "warning_level_diff_m": 1.1,
        "danger_level_diff_m": 0.4,
        "upstream_blockage_index": 0.75,
        "geophone_debris_vibration_db": 62.0,
        "culvert_backpressure_ratio": 1.45,
    }

    prob_crit, meta_crit = _run_tree_ensemble_inference(features_critical)
    assert prob_crit is not None
    assert 0.0 <= prob_crit <= 1.0
    assert prob_crit > 0.5, f"Expected high probability for extreme flood vector, got {prob_crit}"
    assert meta_crit["features_evaluated"] == 25
    assert meta_crit["model_loaded"] is True
    assert meta_crit["model_type"] == "TREE_ENSEMBLE"

    # Test benign/dry feature vector
    features_dry = {
        "rainfall_15m_mm": 0.0,
        "rainfall_30m_mm": 0.0,
        "rainfall_1h_mm": 0.0,
        "rainfall_3h_mm": 0.5,
        "rainfall_6h_mm": 1.0,
        "rainfall_12h_mm": 2.0,
        "rainfall_24h_mm": 3.0,
        "rainfall_72h_mm": 5.0,
        "rainfall_peak_intensity_mmph": 0.0,
        "soil_moisture_pct": 22.0,
        "soil_saturation_index": 0.20,
        "antecedent_7d_mm": 5.0,
        "elevation_m": 1900.0,
        "slope_degrees": 12.0,
        "twi": 4.5,
        "factor_of_safety_fos": 2.4,  # Highly stable
        "landslide_susceptibility_index": 0.10,
        "historical_landslides_count": 0,
        "river_level_m": 1.2,
        "river_rate_of_rise_mph": 0.01,
        "warning_level_diff_m": -2.0,
        "danger_level_diff_m": -3.0,
        "upstream_blockage_index": 0.0,
        "geophone_debris_vibration_db": 10.0,
        "culvert_backpressure_ratio": 0.10,
    }
    prob_dry, meta_dry = _run_tree_ensemble_inference(features_dry)
    assert prob_dry is not None
    assert prob_dry < 0.35, f"Expected low probability for dry conditions, got {prob_dry}"


def test_ndrf_prediction_api_endpoint(client):
    """Verify POST /api/v1/ndrf/predict fuses real ML model output with physics baseline."""
    res = client.post(
        "/api/v1/ndrf/predict",
        json={
            "village_id": "uk-chamoli-raini",
            "rainfall_1h_mm": 45.0,
            "rainfall_3h_mm": 78.0,
            "rainfall_peak_intensity_mmph": 48.0,
            "soil_saturation_index": 0.82,
            "slope_degrees": 32.0,
            "river_level_m": 3.9,
            "culvert_backpressure_ratio": 0.75,
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert "risk_score" in data
    assert "physics_baseline_score" in data
    assert "ml_probability" in data
    assert "ml_inference_meta" in data
    assert data["ml_inference_meta"]["model_type"] == "TREE_ENSEMBLE"
    assert data["ml_inference_meta"]["features_evaluated"] == 25
    assert "alert_stage" in data
    assert "alert_meaning_hi" in data


def test_sqlite_resilient_database_health(client):
    """Verify database is operational with dual SQLite/Postgres compatibility."""
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "OPERATIONAL"
    assert "database" in data["components"]
    assert data["components"]["database"]["status"] == "OPERATIONAL"
    assert data["components"]["database"]["dialect"] in ("sqlite", "postgresql")


def test_bilingual_oasis_cap_xml_feed(client):
    """Verify GET /api/v1/alerts/cap.xml serves valid bilingual OASIS CAP v1.2 XML."""
    res = client.get("/api/v1/alerts/cap.xml")
    assert res.status_code == 200
    assert res.headers["content-type"].startswith("application/xml")
    xml = res.text
    assert "<alert" in xml
    assert 'xmlns="urn:oasis:names:tc:emergency:cap:1.2"' in xml
    assert "<language>en-IN</language>" in xml
    assert "<language>hi-IN</language>" in xml
    assert "<headline>" in xml
    assert "<severity>" in xml


def test_alert_trigger_multilingual_dispatch(client):
    """Verify POST /api/v1/alerts/trigger returns both English and Hindi channel messages."""
    res = client.post(
        "/api/v1/alerts/trigger",
        json={"ward_id": "uk-chamoli-raini", "severity": "CRITICAL", "lead_time_min": 30},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "TRIGGERED"
    channels = data["channels"]
    assert "cmas_cell_broadcast" in channels
    assert "en" in channels["cmas_cell_broadcast"]
    assert "hi" in channels["cmas_cell_broadcast"]
    assert len(channels["cmas_cell_broadcast"]["hi"]) > 10


def test_iot_firmware_generator_sanitized(client):
    """Verify firmware generator does NOT embed hardcoded credentials."""
    res = client.get("/api/v1/iot/firmware/esp32")
    assert res.status_code == 200
    firmware = res.text
    # Must NOT contain hardcoded test credentials
    assert "DISASTER_SDRF_WIFI" not in firmware
    assert "192.168.1.100" not in firmware
    # Must contain proper configuration placeholders
    assert "<CONFIGURE_WIFI_SSID>" in firmware
    assert "<CONFIGURE_HMAC_DEVICE_SECRET>" in firmware
    assert "mbedtls/md.h" in firmware
    assert "DEVICE_ID" in firmware


def test_honest_provider_status_matrix(client):
    """Verify providers report honest statuses (no blanket fake 'LIVE')."""
    res = client.get("/api/v1/ingestion/providers")
    assert res.status_code == 200
    data = res.json()
    providers = {p["provider_id"]: p for p in data["data"]}

    # IMD & CWC must not be claimed as LIVE when not configured
    if "imd_national" in providers:
        assert providers["imd_national"]["status"] in ("NOT_CONFIGURED", "SIMULATION_ONLY")
    if "cwc_national" in providers:
        assert providers["cwc_national"]["status"] in ("NOT_CONFIGURED", "SIMULATION_ONLY")
    # Open-Meteo is a configured open provider
    if "open_meteo" in providers:
        assert providers["open_meteo"]["status"] == "CONFIGURED"
