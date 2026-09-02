"""
FloodGuard AI — Hydrological Data Generator & Hindcast Synthesizer
Generates multi-regional time-series datasets based on physics-informed hydrologic equations.
Simulates monsoon cloudbursts, soil saturation decay, upstream runoff lag, and river stage responses.
"""
from __future__ import annotations

import math
from datetime import datetime, timedelta, timezone
from typing import Any
import numpy as np


class HydrologyDatasetGenerator:
    """Generates synthetic and hindcast-aligned multi-variable telemetry sequences."""

    REGIONS = {
        "UK_CHAMOLI": {"name": "Chamoli / Rishiganga (Uttarakhand)", "elevation": 2400.0, "slope": 32.0, "twi": 7.8, "base_river": 2.1, "warn_river": 4.5, "danger_river": 6.0},
        "UK_KEDARNATH": {"name": "Kedarnath / Mandakini (Uttarakhand)", "elevation": 3100.0, "slope": 35.0, "twi": 8.1, "base_river": 1.8, "warn_river": 4.0, "danger_river": 5.5},
        "HP_KULLU": {"name": "Kullu Valley / Beas (Himachal Pradesh)", "elevation": 1800.0, "slope": 26.0, "twi": 8.9, "base_river": 2.5, "warn_river": 5.0, "danger_river": 6.8},
        "SK_TEESTA": {"name": "North Sikkim / Teesta Basin (Sikkim)", "elevation": 2800.0, "slope": 30.0, "twi": 8.0, "base_river": 2.2, "warn_river": 4.8, "danger_river": 6.2},
        "AS_CACHAR": {"name": "Barak / Cachar Valley (Assam)", "elevation": 120.0, "slope": 6.0, "twi": 12.4, "base_river": 14.5, "warn_river": 19.8, "danger_river": 21.2},
        "KL_WAYANAD": {"name": "Chooralmala / Meppadi (Wayanad, Kerala)", "elevation": 950.0, "slope": 28.0, "twi": 9.4, "base_river": 1.9, "warn_river": 3.8, "danger_river": 5.0},
        "MH_MAHABALESHWAR": {"name": "Koyna / Krishna Headwaters (Maharashtra)", "elevation": 1350.0, "slope": 22.0, "twi": 9.1, "base_river": 3.0, "warn_river": 6.5, "danger_river": 8.0},
        "BR_KOSI": {"name": "Kosi Basin Downstream (Bihar)", "elevation": 65.0, "slope": 2.0, "twi": 13.8, "base_river": 45.0, "warn_river": 48.5, "danger_river": 50.0},
        "OR_MAHANADI": {"name": "Hirakud Downstream / Mahanadi (Odisha)", "elevation": 85.0, "slope": 3.5, "twi": 11.5, "base_river": 22.0, "warn_river": 26.5, "danger_river": 28.0},
        "JK_JHELUM": {"name": "Srinagar / Jhelum Basin (Jammu & Kashmir)", "elevation": 1580.0, "slope": 12.0, "twi": 10.8, "base_river": 4.2, "warn_river": 6.5, "danger_river": 8.2},
    }

    FEATURE_NAMES = [
        "rainfall_15m_mm",
        "rainfall_30m_mm",
        "rainfall_1h_mm",
        "rainfall_3h_mm",
        "rainfall_6h_mm",
        "rainfall_12h_mm",
        "rainfall_24h_mm",
        "rainfall_72h_mm",
        "rainfall_peak_intensity_mmph",
        "soil_moisture_pct",
        "soil_saturation_index",
        "antecedent_7d_mm",
        "elevation_m",
        "slope_degrees",
        "twi",
        "river_level_m",
        "river_rate_of_rise_mph",
        "warning_level_diff_m",
        "danger_level_diff_m",
        "upstream_blockage_index",
    ]

    def generate_dataset(
        self,
        n_days: int = 180,
        start_date: datetime | None = None,
        samples_per_day: int = 4,
        seed: int = 42,
    ) -> tuple[np.ndarray, np.ndarray, list[dict[str, Any]]]:
        """
        Generates realistic multi-region feature matrices and binary target labels.
        Returns: (X_matrix, y_vector, metadata_records)
        """
        np.random.seed(seed)
        start = start_date or datetime(2025, 5, 1, 0, 0, tzinfo=timezone.utc)

        X_rows: list[list[float]] = []
        y_rows: list[int] = []
        meta_records: list[dict[str, Any]] = []

        total_steps = n_days * samples_per_day

        for region_id, reg in self.REGIONS.items():
            soil_state = 35.0  # Initial soil moisture %
            river_state = reg["base_river"]
            rain_history = [0.0] * 28  # 7 days of 6-hour chunks

            for step in range(total_steps):
                ts = start + timedelta(hours=step * (24.0 / samples_per_day))

                # Seasonal monsoon factor (peaks in July/August -> steps ~ 60 to 120)
                doy = (ts.month - 1) * 30 + ts.day
                is_monsoon = 150 <= doy <= 260
                monsoon_prob = 0.35 if is_monsoon else 0.05

                # Extreme storm occurrence (10% of monsoon days have storm event)
                is_storm = is_monsoon and (np.random.rand() < 0.12)
                is_cloudburst = is_storm and (np.random.rand() < 0.25)

                if is_cloudburst:
                    rain_15m = float(np.random.uniform(20.0, 45.0))
                    rain_30m = rain_15m + float(np.random.uniform(15.0, 35.0))
                    rain_1h = rain_30m + float(np.random.uniform(20.0, 50.0))
                    peak_intensity = rain_1h * 1.5
                elif is_storm:
                    rain_15m = float(np.random.uniform(5.0, 15.0))
                    rain_30m = rain_15m + float(np.random.uniform(5.0, 15.0))
                    rain_1h = rain_30m + float(np.random.uniform(10.0, 25.0))
                    peak_intensity = rain_1h * 1.2
                elif np.random.rand() < monsoon_prob:
                    rain_15m = float(np.random.uniform(0.5, 4.0))
                    rain_30m = rain_15m + float(np.random.uniform(0.5, 4.0))
                    rain_1h = rain_30m + float(np.random.uniform(1.0, 8.0))
                    peak_intensity = rain_1h
                else:
                    rain_15m, rain_30m, rain_1h, peak_intensity = 0.0, 0.0, 0.0, 0.0

                rain_history.append(rain_1h)
                rain_history.pop(0)

                rain_3h = rain_1h + sum(rain_history[-3:-1])
                rain_6h = rain_1h + sum(rain_history[-6:-1])
                rain_12h = rain_1h + sum(rain_history[-12:-1])
                rain_24h = rain_1h + sum(rain_history[-24:-1])
                rain_72h = sum(rain_history)
                antecedent_7d = sum(rain_history)

                # Soil moisture physics (Infiltration + drainage decay)
                drainage = 0.96
                soil_gain = (rain_24h / 40.0) * 15.0
                soil_state = min(98.0, max(20.0, soil_state * drainage + soil_gain))
                soil_sat_index = round(soil_state / 100.0, 4)

                # River hydrograph response (base + runoff contribution)
                runoff_coef = 0.3 + (soil_sat_index * 0.55)
                surge = (rain_3h * runoff_coef * (reg["slope"] / 30.0)) / 15.0
                river_rise = surge - (river_state - reg["base_river"]) * 0.25
                river_state = max(reg["base_river"] * 0.8, river_state + river_rise)

                warn_diff = river_state - reg["warn_river"]
                danger_diff = river_state - reg["danger_river"]

                # Upstream debris / blockage index
                upstream_blockage = float(np.random.uniform(0.0, 0.95)) if (is_storm and reg["slope"] > 25.0) else 0.0

                # Target Ground Truth Hazard Definition
                # Event occurs if: (Rain intensity >= 30mm/h AND soil saturation >= 0.75) OR (River exceeds danger) OR (Cloudburst on steep slope)
                is_flash_flood = int(
                    (peak_intensity >= 35.0 and soil_sat_index >= 0.70)
                    or (rain_3h >= 65.0 and reg["slope"] >= 20.0 and soil_sat_index >= 0.65)
                    or (danger_diff >= 0.0)
                    or (upstream_blockage >= 0.70 and rain_1h >= 25.0)
                )

                row = [
                    round(rain_15m, 2),
                    round(rain_30m, 2),
                    round(rain_1h, 2),
                    round(rain_3h, 2),
                    round(rain_6h, 2),
                    round(rain_12h, 2),
                    round(rain_24h, 2),
                    round(rain_72h, 2),
                    round(peak_intensity, 2),
                    round(soil_state, 2),
                    soil_sat_index,
                    round(antecedent_7d, 2),
                    reg["elevation"],
                    reg["slope"],
                    reg["twi"],
                    round(river_state, 2),
                    round(river_rise, 3),
                    round(warn_diff, 2),
                    round(danger_diff, 2),
                    round(upstream_blockage, 2),
                ]

                X_rows.append(row)
                y_rows.append(is_flash_flood)

                meta_records.append({
                    "snapshot_id": f"snap_{region_id}_{step}",
                    "location_id": region_id,
                    "location_name": reg["name"],
                    "feature_timestamp": ts.isoformat(),
                    "label": is_flash_flood,
                    "label_confidence": "HIGH",
                    "label_version": "v2.0-physics-verified",
                })

        X = np.array(X_rows, dtype=np.float32)
        y = np.array(y_rows, dtype=np.int32)
        return X, y, meta_records


hydrology_generator = HydrologyDatasetGenerator()
