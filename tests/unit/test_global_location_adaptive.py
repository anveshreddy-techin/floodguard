"""
Unit tests for Global Location-Adaptive Intelligence:
- Resolving arbitrary latitude/longitude coordinates to geographic hierarchy
- LocationDataProfile, LocationFeatureProfile, LocationCoverageScore, LocationPredictionEligibility
- Distinction between COMPUTATIONALLY_SUPPORTED, DATA_SUPPORTED, PREDICTION_ELIGIBLE, and VALIDATED_LOCATION
- Returning DATA_GAP structures instead of inventing missing values
- Provenance tracking per feature
- Uncertainty reporting and limitations
"""
import pytest
from fastapi.testclient import TestClient
from apps.api.src.main import app

client = TestClient(app)


def test_global_coordinate_resolution_arbitrary_coords():
    """Test that ANY valid coordinates resolve without hardcoded demo fallback."""
    # Arbitrary coordinate in Himachal Pradesh (e.g. Parvati Valley 31.98, 77.35)
    res = client.get("/api/v1/locations/resolve?lat=31.98&lon=77.35")
    assert res.status_code == 200
    data = res.json()
    assert "coordinates" in data
    assert data["coordinates"]["latitude"] == 31.98
    assert data["coordinates"]["longitude"] == 77.35
    assert "hierarchy" in data
    assert data["hierarchy"]["state"] == "Himachal Pradesh"
    assert "regional_model_selected" in data
    assert "location_data_profile" in data
    assert "location_feature_profile" in data
    assert "location_coverage_score" in data
    assert "location_prediction_eligibility" in data


def test_location_status_hierarchy_distinction():
    """
    Test distinction between:
    - COMPUTATIONALLY_SUPPORTED_LOCATION
    - DATA_SUPPORTED_LOCATION
    - PREDICTION_ELIGIBLE_LOCATION
    - VALIDATED_LOCATION
    """
    # 1. Valid coordinates in uncalibrated location (e.g. 19.5, 74.0 - Western Ghats slope)
    res = client.get("/api/v1/locations/resolve?lat=19.5&lon=74.0")
    assert res.status_code == 200
    eligibility = res.json()["location_prediction_eligibility"]
    statuses = eligibility["statuses"]
    assert "COMPUTATIONALLY_SUPPORTED_LOCATION" in statuses
    # Uncalibrated location must NOT claim VALIDATED_LOCATION
    assert "VALIDATED_LOCATION" not in statuses
    assert eligibility["is_validated"] is False

    # 2. Historical benchmark location (Chamoli: 30.485, 79.692)
    res_bench = client.get("/api/v1/locations/resolve?lat=30.485&lon=79.692")
    assert res_bench.status_code == 200
    bench_eligibility = res_bench.json()["location_prediction_eligibility"]
    assert "VALIDATED_LOCATION" in bench_eligibility["statuses"]
    assert bench_eligibility["is_validated"] is True


def test_data_gap_structure_when_source_unavailable():
    """
    Test that unavailable sources return DATA_GAP with exact fields:
    missing_variable, location, time_period, required_source, prediction_impact, recommended_action
    """
    res = client.get("/api/v1/locations/resolve?lat=25.5&lon=91.5")
    assert res.status_code == 200
    data = res.json()
    data_profile = data["location_data_profile"]
    assert "data_gaps" in data_profile
    assert len(data_profile["data_gaps"]) > 0

    gap = data_profile["data_gaps"][0]
    assert "missing_variable" in gap
    assert "location" in gap
    assert "time_period" in gap
    assert "required_source" in gap
    assert "prediction_impact" in gap
    assert "recommended_action" in gap


def test_feature_level_provenance():
    """Test that feature profiles contain granular per-feature provenance tracking."""
    res = client.get("/api/v1/locations/resolve?lat=30.485&lon=79.692")
    assert res.status_code == 200
    feat_profile = res.json()["location_feature_profile"]
    assert "features" in feat_profile
    assert "feature_provenance" in feat_profile
    prov = feat_profile["feature_provenance"]
    assert "rainfall" in prov
    assert "soil_moisture" in prov
    assert "hydrology" in prov
    assert "terrain" in prov
    assert "source" in prov["rainfall"]
    assert "data_mode" in prov["rainfall"]


def test_predict_live_arbitrary_coordinates():
    """Test that NDRF predict/live handles arbitrary coordinates without crashing."""
    res = client.post("/api/v1/ndrf/predict/live", json={"latitude": 32.25, "longitude": 76.32})
    assert res.status_code == 200
    data = res.json()
    assert "location_prediction_eligibility" in data
    assert "location_coverage_score" in data
    assert "feature_completeness_pct" in data
    assert data["coordinates"]["latitude"] == 32.25
    assert data["coordinates"]["longitude"] == 76.32
