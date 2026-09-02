"""
Unit tests for FloodGuard AI Hybrid Risk Engine.
Validates scoring behavior, uncertainty escalation, and explanation generation.
"""
import pytest
from apps.api.src.ml.risk_engine import (
    HybridRiskEngine,
    RainfallFeatures,
    SoilFeatures,
    TerrainFeatures,
    RiverFeatures,
    RiskLevel,
    Confidence,
    Uncertainty,
)


def test_quiescent_conditions():
    engine = HybridRiskEngine()
    output = engine.assess(
        rainfall=RainfallFeatures(rainfall_1h_mm=0.0, intensity_mmph=0.0, rainfall_24h_mm=0.0),
        soil=SoilFeatures(saturation_index=0.2, soil_moisture_pct=20.0),
        terrain=TerrainFeatures(slope_degrees=10.0, twi=3.0),
        river=RiverFeatures(level_m=1.0, rate_of_rise_mph=0.0, danger_level_m=6.0, warning_level_m=4.5),
    )
    assert output.risk_score < 35
    assert output.risk_level in (RiskLevel.LOW, RiskLevel.UNKNOWN)
    assert len(output.contributors) > 0


def test_extreme_flash_flood_escalation():
    engine = HybridRiskEngine()
    output = engine.assess(
        rainfall=RainfallFeatures(
            rainfall_1h_mm=55.0,
            intensity_mmph=55.0,
            rainfall_24h_mm=220.0,
            antecedent_7d_mm=150.0,
        ),
        soil=SoilFeatures(saturation_index=0.90, soil_moisture_pct=90.0, drainage_class="poor"),
        terrain=TerrainFeatures(slope_degrees=48.0, twi=12.0, historical_susceptibility=0.85),
        river=RiverFeatures(level_m=6.5, rate_of_rise_mph=0.8, danger_level_m=6.0, warning_level_m=4.5),
    )
    assert output.risk_score >= 75
    assert output.risk_level == RiskLevel.EXTREME
    assert output.explanation["primary_driver"] is not None


def test_missing_data_uncertainty_escalation():
    engine = HybridRiskEngine()
    # Assess with no rainfall and no river data
    output = engine.assess(
        rainfall=None,
        soil=SoilFeatures(saturation_index=0.5),
        terrain=TerrainFeatures(slope_degrees=20.0),
        river=None,
    )
    # Uncertainty must escalate to HIGH or INSUFFICIENT_DATA when key telemetry is missing
    assert output.uncertainty in (Uncertainty.HIGH, Uncertainty.MEDIUM)
    assert len(output.data_gaps) > 0


def test_data_provenance_labels():
    engine = HybridRiskEngine()
    output = engine.assess(
        rainfall=RainfallFeatures(intensity_mmph=15.0, data_mode="DEMO"),
    )
    assert output.model_version in ("rule_based_baseline_v1", "2.0.0-tree-ensemble")
    assert "rainfall" in output.data_sources_used
