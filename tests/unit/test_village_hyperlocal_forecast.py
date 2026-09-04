"""
Unit Tests for FloodGuard AI — Hyper-Local Village & Ward Level Prediction Engine
Verifies:
1. 5 Multi-Source Data Pillars (Rainfall, Soil Moisture, Slope Stability, Landslides, IoT)
2. Hyper-Local Ward Level Risk Breakdown and Evacuation Priority
3. Actionable Lead Time & High-Ground Shelters
4. Uncertainty-Aware Bounds & Precautionary Upper Bound Safety Scores
5. Location ID and UI Alias Resolution
"""
import pytest
from fastapi.testclient import TestClient

from apps.api.src.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_village_forecast_5_pillars_present(client):
    """Verify GET /api/v1/ndrf/villages/{village_id}/forecast returns all 5 multi-source pillars."""
    res = client.get("/api/v1/ndrf/villages/uk-chamoli-raini/forecast")
    assert res.status_code == 200
    data = res.json()

    assert "multi_source_pillars" in data
    pillars = data["multi_source_pillars"]
    assert len(pillars) == 5

    # Pillar 1: Rainfall Observation & QPE
    p1 = pillars["pillar_1_rainfall"]
    assert p1["pillar_id"] == "PILLAR_1_RAINFALL"
    assert "rainfall_15m_mm" in p1
    assert "rainfall_1h_mm" in p1
    assert "rainfall_3h_mm" in p1
    assert "rainfall_24h_mm" in p1
    assert "rainfall_peak_intensity_mmph" in p1
    assert "cloudburst_threshold_exceeded" in p1
    assert "IMD" in p1["source"]

    # Pillar 2: Soil Moisture & Saturation
    p2 = pillars["pillar_2_soil_moisture"]
    assert p2["pillar_id"] == "PILLAR_2_SOIL_MOISTURE"
    assert "volumetric_moisture_pct" in p2
    assert "soil_saturation_index" in p2
    assert 0.0 <= p2["soil_saturation_index"] <= 1.0
    assert "TDR" in p2["sensor_technology"]

    # Pillar 3: Slope Stability Models
    p3 = pillars["pillar_3_slope_stability"]
    assert p3["pillar_id"] == "PILLAR_3_SLOPE_STABILITY"
    assert "factor_of_safety_fos" in p3
    assert "topographic_wetness_index_twi" in p3
    assert "slope_degrees" in p3
    assert p3["stability_status"] in ("POTENTIALLY_UNSTABLE", "MARGINALLY_STABLE", "STABLE")

    # Pillar 4: Historical Landslide Inventories
    p4 = pillars["pillar_4_landslide_inventory"]
    assert p4["pillar_id"] == "PILLAR_4_LANDSLIDE_INVENTORY"
    assert "gsi_susceptibility_index" in p4
    assert "historical_events_in_basin" in p4
    assert "GSI" in p4["inventory_authority"]

    # Pillar 5: Real-Time IoT Inputs
    p5 = pillars["pillar_5_iot_telemetry"]
    assert p5["pillar_id"] == "PILLAR_5_IOT_INPUTS"
    assert "river_level_m" in p5
    assert "river_rate_of_rise_mph" in p5
    assert "geophone_debris_vibration_db" in p5
    assert "culvert_backpressure_ratio" in p5
    assert "LoRaWAN" in p5["mesh_network_status"]


def test_village_forecast_hyperlocal_wards(client):
    """Verify granular ward-level predictions with distinct risk and evacuation priorities."""
    res = client.get("/api/v1/ndrf/villages/uk-chamoli-raini/forecast")
    assert res.status_code == 200
    data = res.json()

    assert "hyper_local_wards" in data
    wards = data["hyper_local_wards"]
    assert len(wards) == 4

    for w in wards:
        assert "ward_id" in w
        assert "name" in w
        assert "elevation_m" in w
        assert "slope_degrees" in w
        assert "distance_to_river_m" in w
        assert "factor_of_safety_fos" in w
        assert "risk_score" in w
        assert "alert_stage" in w
        assert "actionable_lead_time_minutes" in w
        assert "evacuation_priority" in w
        assert "designated_shelter" in w
        assert "evacuation_trail" in w

    # Riverfront ward should have higher or equal risk than ridge ward
    riverfront = next(w for w in wards if "Riverfront" in w["name"])
    ridge = next(w for w in wards if "Ridge" in w["name"])
    assert riverfront["risk_score"] > ridge["risk_score"]
    assert "IMMEDIATE" in riverfront["evacuation_priority"]


def test_village_forecast_actionable_lead_time_and_evacuation(client):
    """Verify actionable lead time and high-ground shelters are returned."""
    res = client.get("/api/v1/ndrf/villages/kl-wayanad-meppadi/forecast")
    assert res.status_code == 200
    data = res.json()

    # Actionable Lead Time
    assert "actionable_lead_time" in data
    alt = data["actionable_lead_time"]
    assert alt["lead_time_minutes"] > 0
    assert alt["surge_wave_velocity_m_s"] > 0
    assert alt["upstream_distance_km"] > 0

    # Evacuation Guidance
    assert "evacuation_guidance" in data
    eg = data["evacuation_guidance"]
    assert "shelters" in eg
    assert "primary" in eg["shelters"]
    assert eg["shelters"]["primary"]["capacity"] > 0
    assert len(eg["designated_trails"]) >= 2
    assert eg["ndrf_deployment"]["national_helpline"] == "1078 (Disaster Helpline)"


def test_village_forecast_uncertainty_bounds(client):
    """Verify uncertainty-aware bounds and conservative life-safety upper bounds."""
    res = client.get("/api/v1/ndrf/villages/uk-kedarnath-town/forecast")
    assert res.status_code == 200
    data = res.json()

    assert "uncertainty_aware_estimation" in data
    unc = data["uncertainty_aware_estimation"]
    assert "point_risk_score" in unc
    assert "uncertainty_margin" in unc
    assert "ci_90" in unc
    assert len(unc["ci_90"]) == 2
    assert unc["ci_90"][0] <= unc["point_risk_score"] <= unc["ci_90"][1]
    assert unc["conservative_upper_bound"] == unc["ci_90"][1]
    assert "decision_rule" in unc


def test_village_alias_resolution(client):
    """Verify location IDs from UI map seamlessly resolve to official village records."""
    aliases = [
        ("loc-uk-chamoli", "Raini Village"),
        ("loc-uk-kedarnath", "Kedarnath Township"),
        ("loc-hp-kullu", "Bhuntar Township"),
        ("loc-kl-wayanad", "Meppadi Ward"),
        ("loc-sk-gangtok", "Singtam Ward"),
    ]
    for alias_id, expected_name_part in aliases:
        res = client.get(f"/api/v1/ndrf/villages/{alias_id}/forecast")
        assert res.status_code == 200
        data = res.json()
        assert expected_name_part in data["village"]
        assert len(data["multi_source_pillars"]) == 5
        assert len(data["hyper_local_wards"]) >= 3
