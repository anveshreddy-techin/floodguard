"""
Unit tests for FloodGuard AI V9 Engines:
- HistoricalHindcastEngine (5 events, strict replay, available_at lock)
- UserExposureEngine (distance, proximity, guidance level)
- HazardAwareRouteEngine (candidate labels, blockage detection)
"""
import pytest
from apps.api.src.services.hindcast_engine import HistoricalHindcastEngine
from apps.api.src.services.exposure_engine import UserExposureEngine
from apps.api.src.services.route_engine import HazardAwareRouteEngine


def test_hindcast_catalog_has_all_five_events():
    engine = HistoricalHindcastEngine()
    events = engine.list_events()
    event_ids = [e["event_id"] for e in events]
    assert "2013_uttarakhand_kedarnath" in event_ids
    assert "2021_chamoli_rishiganga" in event_ids
    assert "2021_nepal_melamchi" in event_ids
    assert "2023_nepal_events" in event_ids
    assert "2026_nepal_bhote_koshi" in event_ids
    assert len(events) == 5


def test_hindcast_strict_replay_locks_future_data():
    engine = HistoricalHindcastEngine()
    run = engine.run_hindcast(event_id="2021_chamoli_rishiganga", mode="STRICT_REPLAY")
    assert run["label"] == "RETROSPECTIVE_HINDCAST"
    assert len(run["steps"]) == 5
    # In STRICT_REPLAY, data_locked_out must contain items
    assert len(run["steps"][0]["data_locked_out"]) > 0
    assert run["scorecard"]["detection"] is True


def test_exposure_engine_proximity_escalation():
    engine = UserExposureEngine()
    # At hazard center (0 km away)
    inside = engine.evaluate_exposure(lat=30.5050, lon=79.1550)
    assert inside.exposure_status == "INSIDE_EXTREME_RISK_AREA"
    assert inside.risk_level == "EXTREME"
    assert inside.guidance_level >= 3

    # Far away (5 km away)
    outside = engine.evaluate_exposure(lat=30.5500, lon=79.1550)
    assert outside.exposure_status == "OUTSIDE_RISK_AREA"
    assert outside.risk_level == "LOW"
    assert outside.guidance_level == 0


def test_route_engine_candidate_labels_never_say_safe():
    exposure_eng = UserExposureEngine()
    route_eng = HazardAwareRouteEngine()

    exp = exposure_eng.evaluate_exposure(lat=30.5050, lon=79.1550)
    routes = route_eng.get_candidate_routes(exp, sensor_failure_active=False)

    for r in routes:
        assert r.label in ["CANDIDATE_ROUTE", "LOWER_EXPOSURE_CANDIDATE", "ROUTE_SAFETY_NOT_VERIFIED", "BLOCKED"]
        assert r.label != "SAFE_ROUTE"  # Strict rule §24

    # Degraded sensor condition
    degraded_routes = route_eng.get_candidate_routes(exp, sensor_failure_active=True)
    unverified = [r for r in degraded_routes if r.label == "ROUTE_SAFETY_NOT_VERIFIED"]
    assert len(unverified) >= 1
