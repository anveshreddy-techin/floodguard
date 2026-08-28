"""
FloodGuard AI — Deterministic Demo Data Generator

IMPORTANT:
- All synthetic records contain data_mode=DEMO
- All synthetic records contain source=deterministic_simulator
- Simulation data NEVER appears as LIVE
- Generator is seeded for reproducibility

Scenarios:
- NORMAL: Baseline conditions
- RAIN_ESCALATION: Rainfall intensifying
- SOIL_SATURATION: Soil becoming saturated
- RIVER_RISE: River level rising
- SENSOR_FAILURE: Sensor network degrading
- NETWORK_FAILURE: Communication loss
"""
import hashlib
import json
import math
import random
from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Generator


class Scenario(str, Enum):
    NORMAL = "NORMAL"
    RAIN_ESCALATION = "RAIN_ESCALATION"
    SOIL_SATURATION = "SOIL_SATURATION"
    RIVER_RISE = "RIVER_RISE"
    SENSOR_FAILURE = "SENSOR_FAILURE"
    NETWORK_FAILURE = "NETWORK_FAILURE"


DEMO_METADATA = {
    "data_mode": "DEMO",
    "source": "deterministic_simulator",
    "evidence_state": "SIMULATED",
    "disclaimer": "This is synthetic demo data. Not real observations.",
}


class DeterministicDemoGenerator:
    """
    Generates internally consistent, time-ordered, spatially consistent demo data.
    All output is labeled DEMO / SIMULATION.
    Seed controls full reproducibility.
    """

    # Demo locations (fictional villages in a hilly region — NOT real operational data)
    DEMO_LOCATIONS = [
        {
            "id": "demo-village-001", "name": "Chandpur Village", "district": "Demo District",
            "state": "Demo State", "elevation_m": 1240, "lat": 30.2, "lon": 78.8,
            "watershed": "demo-watershed-upper",
            "population": 850, "slope_degrees": 28,
        },
        {
            "id": "demo-village-002", "name": "Ramgarh Village", "district": "Demo District",
            "state": "Demo State", "elevation_m": 980, "lat": 30.18, "lon": 78.82,
            "watershed": "demo-watershed-upper",
            "population": 1200, "slope_degrees": 22,
        },
        {
            "id": "demo-village-003", "name": "Sunderbans Nagar", "district": "Demo District",
            "state": "Demo State", "elevation_m": 720, "lat": 30.15, "lon": 78.85,
            "watershed": "demo-watershed-lower",
            "population": 3400, "slope_degrees": 12,
        },
    ]

    DEMO_SENSORS = [
        {"device_id": "demo-aws-001", "name": "AWS Upper Catchment", "type": "rainfall",
         "lat": 30.22, "lon": 78.78, "elevation_m": 1450},
        {"device_id": "demo-aws-002", "name": "AWS Mid Slope", "type": "rainfall",
         "lat": 30.19, "lon": 78.83, "elevation_m": 1050},
        {"device_id": "demo-wl-001", "name": "River Gauge Station", "type": "water_level",
         "lat": 30.14, "lon": 78.87, "elevation_m": 650},
        {"device_id": "demo-sm-001", "name": "Soil Sensor Upper", "type": "soil_moisture",
         "lat": 30.21, "lon": 78.79, "elevation_m": 1300},
    ]

    def __init__(self, seed: int = 42):
        self.seed = seed
        self.rng = random.Random(seed)

    def _deterministic_noise(self, base: float, amplitude: float, t: int) -> float:
        """Generate smooth, deterministic noise using trigonometric functions."""
        return base + amplitude * math.sin(t * 0.3 + self.seed * 0.1)

    def generate_rainfall_timeseries(
        self,
        scenario: Scenario,
        hours: int = 72,
        location_id: str = "demo-village-001",
    ) -> list[dict]:
        """
        Generate a rainfall timeseries for a scenario.
        All records carry data_mode=DEMO.
        """
        records = []
        now = datetime.now(timezone.utc)
        start = now - timedelta(hours=hours)

        for t in range(hours):
            ts = start + timedelta(hours=t)
            rainfall_mm = self._scenario_rainfall(scenario, t, hours)

            records.append({
                **DEMO_METADATA,
                "scenario": scenario.value,
                "scenario_id": f"demo_{scenario.value.lower()}_{self.seed}",
                "seed": self.seed,
                "generated_at": now.isoformat(),
                "observed_at": ts.isoformat(),
                "location_id": location_id,
                "rainfall_mm": round(max(0, rainfall_mm), 2),
                "duration_hours": 1.0,
                "intensity_mmph": round(max(0, rainfall_mm), 2),
                "quality_flag": "VALID",
            })

        return records

    def _scenario_rainfall(self, scenario: Scenario, t: int, total: int) -> float:
        """Compute rainfall for hour t in a scenario."""
        if scenario == Scenario.NORMAL:
            return self._deterministic_noise(5, 3, t)
        elif scenario == Scenario.RAIN_ESCALATION:
            # Gradually increases to extreme
            progress = t / total
            base = 5 + progress * 60
            return self._deterministic_noise(base, 5, t)
        elif scenario == Scenario.SOIL_SATURATION:
            # Moderate steady rain for long period
            return self._deterministic_noise(15, 5, t)
        elif scenario == Scenario.RIVER_RISE:
            # Burst at mid-point
            if t < total * 0.4:
                return self._deterministic_noise(10, 3, t)
            elif t < total * 0.6:
                return self._deterministic_noise(45, 10, t)
            else:
                return self._deterministic_noise(8, 3, t)
        elif scenario in (Scenario.SENSOR_FAILURE, Scenario.NETWORK_FAILURE):
            return self._deterministic_noise(12, 5, t)
        return 5.0

    def generate_river_timeseries(
        self, scenario: Scenario, hours: int = 72
    ) -> list[dict]:
        """Generate river level timeseries."""
        records = []
        now = datetime.now(timezone.utc)
        start = now - timedelta(hours=hours)
        base_level = 2.5

        for t in range(hours):
            ts = start + timedelta(hours=t)
            level = self._scenario_river_level(scenario, t, hours, base_level)

            records.append({
                **DEMO_METADATA,
                "scenario": scenario.value,
                "seed": self.seed,
                "generated_at": now.isoformat(),
                "observed_at": ts.isoformat(),
                "station_code": "demo-wl-001",
                "level_m": round(max(0, level), 3),
                "warning_level_m": 4.5,
                "danger_level_m": 6.0,
                "rate_of_rise_mph": round(
                    (level - self._scenario_river_level(scenario, max(0, t-1), hours, base_level)) if t > 0 else 0,
                    4
                ),
            })
        return records

    def _scenario_river_level(self, scenario: Scenario, t: int, total: int, base: float) -> float:
        if scenario == Scenario.NORMAL:
            return base + self._deterministic_noise(0, 0.2, t)
        elif scenario == Scenario.RIVER_RISE:
            if t < total * 0.4:
                return base
            elif t < total * 0.65:
                progress = (t - total * 0.4) / (total * 0.25)
                return base + progress * 5.0
            else:
                decline = (t - total * 0.65) / (total * 0.35)
                return max(base, (base + 5.0) - decline * 3.0)
        elif scenario == Scenario.RAIN_ESCALATION:
            progress = t / total
            return base + progress * 3.5
        else:
            return base + self._deterministic_noise(0.5, 0.3, t)

    def generate_soil_moisture(
        self, scenario: Scenario, hours: int = 72
    ) -> list[dict]:
        """Generate soil moisture evolution."""
        records = []
        now = datetime.now(timezone.utc)
        start = now - timedelta(hours=hours)

        for t in range(hours):
            ts = start + timedelta(hours=t)
            saturation = self._scenario_soil(scenario, t, hours)

            records.append({
                **DEMO_METADATA,
                "scenario": scenario.value,
                "seed": self.seed,
                "generated_at": now.isoformat(),
                "observed_at": ts.isoformat(),
                "location_id": "demo-village-001",
                "saturation_index": round(min(1.0, max(0.0, saturation)), 3),
                "soil_moisture_pct": round(min(100, max(0, saturation * 100)), 1),
                "evidence_state": "MODEL_INFERRED",
            })
        return records

    def _scenario_soil(self, scenario: Scenario, t: int, total: int) -> float:
        if scenario == Scenario.NORMAL:
            return 0.35 + self._deterministic_noise(0, 0.05, t)
        elif scenario == Scenario.SOIL_SATURATION:
            # Slowly approaches saturation
            return 0.4 + (t / total) * 0.55
        elif scenario == Scenario.RAIN_ESCALATION:
            return 0.45 + (t / total) * 0.40
        elif scenario == Scenario.RIVER_RISE:
            if t < total * 0.4:
                return 0.55 + self._deterministic_noise(0, 0.05, t)
            return 0.75 + self._deterministic_noise(0, 0.05, t)
        return 0.4

    def generate_complete_scenario(self, scenario: Scenario = Scenario.RAIN_ESCALATION) -> dict:
        """Generate a complete, internally consistent scenario dataset."""
        return {
            "scenario": scenario.value,
            "seed": self.seed,
            "data_mode": "DEMO",
            "source": "deterministic_simulator",
            "disclaimer": "All data is synthetic. Not real observations.",
            "locations": self.DEMO_LOCATIONS,
            "sensors": self.DEMO_SENSORS,
            "rainfall": self.generate_rainfall_timeseries(scenario),
            "river_levels": self.generate_river_timeseries(scenario),
            "soil_moisture": self.generate_soil_moisture(scenario),
        }


# Singleton with default seed (Finals Demo seed)
FINALS_SEED = 2026
demo_generator = DeterministicDemoGenerator(seed=FINALS_SEED)
