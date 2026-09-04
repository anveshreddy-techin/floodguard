"""
FloodGuard AI — Unit Tests for Dynamic Location Profiling,
Data & Validation Sufficiency Determination, and Uncertainty-Aware Risk Estimation
Thesis: "FloodGuard dynamically builds a location-specific multi-source hazard profile
and determines whether sufficient real data and model validation exist before issuing
an uncertainty-aware flash-flood risk estimate."
"""
from __future__ import annotations

import pytest
from unittest.mock import patch
import numpy as np

from apps.api.src.services.global_location_service import global_location_service
from apps.api.src.routers.ndrf_prediction import _run_tree_ensemble_inference


@pytest.mark.asyncio
async def test_dynamic_location_profile_and_sufficiency():
    """Verify that Chamoli generates a complete profile with sufficient real data and validation."""
    profile = await global_location_service.build_location_intelligence_profile(
        latitude=30.485,
        longitude=79.692,
    )

    # 1. Profile structure
    assert "hierarchy" in profile
    assert "regional_model_selected" in profile
    assert "location_data_profile" in profile
    assert "location_feature_profile" in profile
    assert "location_readiness" in profile
    assert "risk_inference" in profile

    # 2. Sufficiency determination
    readiness = profile["location_readiness"]
    assert readiness["sufficient_real_data_exists"] is True
    assert readiness["sufficient_model_validation_exists"] is True
    assert readiness["prediction_withheld"] is False

    # 3. Uncertainty-aware estimate
    inference = profile["risk_inference"]
    assert inference["status"] == "ESTIMATE_ISSUED"
    assert inference["is_prediction_eligible"] is True
    assert "risk_score_point" in inference
    assert "confidence_interval_90" in inference
    assert len(inference["confidence_interval_90"]) == 2
    assert inference["confidence_interval_90"][0] <= inference["risk_score_point"] <= inference["confidence_interval_90"][1]
    assert inference["conservative_upper_bound"] >= inference["risk_score_point"]
    assert inference["uncertainty_margin"] > 0.0
    assert "decision_guidance" in inference


@pytest.mark.asyncio
async def test_insufficient_real_data_withholds_prediction():
    """Verify that when real rainfall data is absent, the system withholds prediction."""
    # Simulate data outage where environmental provider returns empty weather
    with patch.object(
        global_location_service,
        "fetch_environmental_data",
        return_value={"weather": {}, "hydrology": {}},
    ):
        profile = await global_location_service.build_location_intelligence_profile(
            latitude=30.485,
            longitude=79.692,
        )

        readiness = profile["location_readiness"]
        assert readiness["sufficient_real_data_exists"] is False
        assert readiness["prediction_withheld"] is True

        inference = profile["risk_inference"]
        assert inference["status"] == "PREDICTION_WITHHELD"
        assert inference["is_prediction_eligible"] is False
        assert inference["risk_score_point"] is None
        assert inference["confidence_interval_90"] is None
        assert inference["alert_stage"] == "WITHHELD"
        assert "Essential rainfall" in inference["reason"] or "missing" in inference["reason"].lower()
        assert len(inference["missing_critical_data"]) > 0
        assert "required_action" in inference


@pytest.mark.asyncio
async def test_unvalidated_and_ood_widens_uncertainty_interval():
    """Verify that Out-of-Distribution coordinates have elevated uncertainty margins."""
    # Chamoli (In-distribution, validated)
    p_chamoli = await global_location_service.build_location_intelligence_profile(30.485, 79.692)
    # Jaisalmer (Out-of-distribution flat plain, unvalidated)
    p_jaisalmer = await global_location_service.build_location_intelligence_profile(26.9, 70.9)

    margin_chamoli = p_chamoli["risk_inference"]["uncertainty_margin"]
    margin_jaisalmer = p_jaisalmer["risk_inference"]["uncertainty_margin"]

    assert p_jaisalmer["location_readiness"]["sufficient_model_validation_exists"] is False
    assert p_jaisalmer["location_readiness"]["out_of_distribution_score"] > 50.0
    # OOD location must exhibit wider uncertainty margin than trained mountain basin
    assert margin_jaisalmer > margin_chamoli
    assert p_jaisalmer["risk_inference"]["epistemic_uncertainty_score"] > p_chamoli["risk_inference"]["epistemic_uncertainty_score"]


def test_tree_ensemble_empirical_variance():
    """Verify that ML Tree Ensemble evaluates individual decision trees for empirical variance."""
    sample_features = {
        "rainfall_15m_mm": 10.0,
        "rainfall_30m_mm": 20.0,
        "rainfall_1h_mm": 40.0,
        "rainfall_3h_mm": 60.0,
        "rainfall_6h_mm": 80.0,
        "rainfall_12h_mm": 90.0,
        "rainfall_24h_mm": 120.0,
        "rainfall_72h_mm": 150.0,
        "rainfall_peak_intensity_mmph": 40.0,
        "soil_moisture_pct": 85.0,
        "soil_saturation_index": 0.85,
        "antecedent_7d_mm": 200.0,
        "elevation_m": 2200.0,
        "slope_degrees": 32.0,
        "twi": 6.5,
        "factor_of_safety_fos": 1.1,
        "landslide_susceptibility_index": 0.85,
        "historical_landslides_count": 8.0,
        "river_level_m": 3.8,
        "river_rate_of_rise_mph": 0.45,
        "warning_level_diff_m": -0.2,
        "danger_level_diff_m": -1.2,
        "upstream_blockage_index": 0.1,
        "geophone_debris_vibration_db": 35.0,
        "culvert_backpressure_ratio": 0.3,
    }

    ml_prob, meta = _run_tree_ensemble_inference(sample_features)

    assert meta["model_loaded"] is True
    assert "tree_std" in meta
    assert "tree_variance" in meta
    assert "p10_probability" in meta
    assert "p90_probability" in meta
    assert meta["estimators_count"] == 100
    assert 0.0 <= meta["tree_std"] <= 1.0
    assert meta["p10_probability"] <= meta["p90_probability"]
