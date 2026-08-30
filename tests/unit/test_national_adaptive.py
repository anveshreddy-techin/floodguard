"""
FloodGuard AI — National Adaptive Platform & Multi-Hazard Detector Tests
Verifies BaseProvider contracts, truthfulness rules, regional model routing,
hazard detectors, and uncertainty escalation.
"""
import pytest
from apps.api.src.providers.base import ProviderStatus, DataMode
from apps.api.src.providers.imd_adapter import imd_adapter
from apps.api.src.providers.cwc_adapter import cwc_adapter
from apps.api.src.core.regional_config import (
    get_region_for_coordinates,
    get_model_config_for_region,
    HazardRegion,
)
from apps.api.src.services.hazard_detectors import (
    RainfallExtremeDetector,
    CatchmentSaturationDetector,
    RiverAnomalyDetector,
    LandslideDetector,
    GlacialLakeScreeningDetector,
    DownstreamPropagationDetector,
)


@pytest.mark.asyncio
async def test_imd_adapter_reports_not_configured_without_fake_live():
    """Verify IMD adapter never claims LIVE status when credentials are missing."""
    health = await imd_adapter.health_check()
    assert health.status == ProviderStatus.NOT_CONFIGURED
    assert health.data_mode == DataMode.DEMO
    assert "MoU" in health.note or "whitelisting" in health.note


@pytest.mark.asyncio
async def test_cwc_adapter_reports_not_configured_truthfully():
    """Verify CWC adapter reports honest NOT_CONFIGURED status."""
    health = await cwc_adapter.health_check()
    assert health.status == ProviderStatus.NOT_CONFIGURED
    assert health.data_mode == DataMode.DEMO


def test_regional_routing_by_coordinates():
    """Verify coordinate lookup correctly routes to the 8 national hazard regions."""
    # Northern Himalayan (Uttarakhand - 30.5, 79.5)
    himalayan = get_region_for_coordinates(30.5, 79.5)
    assert himalayan == HazardRegion.HIMALAYAN_NORTH

    # Northeast Hills (Assam/Meghalaya - 25.5, 91.8)
    northeast = get_region_for_coordinates(25.5, 91.8)
    assert northeast == HazardRegion.NORTHEAST_HILLS

    # Western Ghats (Kerala - 11.5, 76.1)
    western_ghats = get_region_for_coordinates(11.5, 76.1)
    assert western_ghats == HazardRegion.WESTERN_GHATS


def test_regional_model_config_thresholds():
    """Verify regional model configuration retrieves valid thresholds and limitations."""
    config = get_model_config_for_region(HazardRegion.HIMALAYAN_NORTH)
    assert "thresholds" in config
    assert "rainfall_critical_mm_3h" in config["thresholds"]
    assert len(config["known_limitations"]) > 0


def test_rainfall_extreme_detector_logic():
    """Verify RainfallExtremeDetector flags extreme rainfall above threshold."""
    detector = RainfallExtremeDetector()
    
    # Missing data
    insufficient = detector.detect({})
    assert insufficient["status"] == "INSUFFICIENT_DATA"

    # Extreme threshold (≥ 100mm/3h)
    extreme = detector.detect({"rainfall_3h_mm": 110.0})
    assert extreme["status"] == "EXTREME"
    assert len(extreme["evidence"]) > 0

    # Normal (< 65mm/3h)
    normal = detector.detect({"rainfall_3h_mm": 35.0})
    assert normal["status"] == "NORMAL"


def test_catchment_saturation_detector():
    """Verify soil moisture threshold trigger."""
    detector = CatchmentSaturationDetector()
    saturated = detector.detect({"soil_moisture_pct": 94.0})
    assert saturated["status"] == "SATURATED"


def test_river_anomaly_detector_statutory_thresholds():
    """Verify statutory CWC danger levels are respected in anomaly evaluation."""
    detector = RiverAnomalyDetector()
    above_danger = detector.detect({
        "water_level_m": 5.4,
        "warning_level_m": 4.5,
        "danger_level_m": 5.0,
    })
    assert above_danger["status"] == "ABOVE_DANGER"


def test_glacial_lake_screening_never_claims_ml_probability():
    """Verify GLOF detector performs screening only without claiming fake ML probability."""
    detector = GlacialLakeScreeningDetector()
    res = detector.detect({"lake_area_km2": 1.4, "sar_area_change_pct": 28.0})
    assert res["status"] == "ANOMALY_DETECTED"
    # Ensure limitations explicitly clarify ML classifier not trained
    assert any("GLOF ML classifier NOT trained" in lim for lim in res["limitations"])


def test_downstream_propagation_travel_time():
    """Verify wave travel time calculation."""
    detector = DownstreamPropagationDetector()
    res = detector.detect({
        "channel_length_to_next_settlement_km": 15.0,
        "estimated_wave_speed_m_s": 5.0,
    })
    assert res["status"] == "PROPAGATION_ESTIMATE"
    assert res["estimated_travel_time_min"] == 50.0  # 15,000m / 5m/s = 3000s = 50 min
