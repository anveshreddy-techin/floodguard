"""
Unit tests for deterministic demo data generator.
Proves data reproducibility, scenario transitions, and strict mode labeling.
"""
from apps.api.src.simulation.demo_generator import DeterministicDemoGenerator, Scenario


def test_deterministic_reproducibility():
    gen1 = DeterministicDemoGenerator(seed=2026)
    gen2 = DeterministicDemoGenerator(seed=2026)

    series1 = gen1.generate_rainfall_timeseries(Scenario.RAIN_ESCALATION, hours=24)
    series2 = gen2.generate_rainfall_timeseries(Scenario.RAIN_ESCALATION, hours=24)

    assert len(series1) == 24
    assert len(series2) == 24
    for r1, r2 in zip(series1, series2):
        assert r1["rainfall_mm"] == r2["rainfall_mm"]
        assert r1["data_mode"] == "DEMO"
        assert r1["source"] == "deterministic_simulator"


def test_scenario_progression():
    gen = DeterministicDemoGenerator(seed=42)
    rainfall_series = gen.generate_rainfall_timeseries(Scenario.RAIN_ESCALATION, hours=24)
    
    # In rain escalation scenario, late-stage rain should exceed early-stage rain
    early_rain = sum(r["rainfall_mm"] for r in rainfall_series[:6])
    late_rain = sum(r["rainfall_mm"] for r in rainfall_series[-6:])
    assert late_rain > early_rain


def test_river_surge_scenario():
    gen = DeterministicDemoGenerator(seed=42)
    river_series = gen.generate_river_timeseries(Scenario.RIVER_RISE, hours=48)
    
    peak_level = max(r["level_m"] for r in river_series)
    initial_level = river_series[0]["level_m"]
    assert peak_level > initial_level
    assert any(r["level_m"] >= r["warning_level_m"] for r in river_series)
