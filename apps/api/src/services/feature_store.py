"""
FloodGuard AI — Feature Store Service
Builds reproducible FeatureSnapshot vectors from raw observations.
STRICT leakage prevention: features at time T use ONLY data with observed_at <= T.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone, timedelta
from typing import Any

from ..core.logging import get_logger

logger = get_logger(__name__)

# Static terrain data (demo values — replaced by real GIS layer in REAL_PILOT mode)
_DEMO_TERRAIN: dict[str, dict[str, float]] = {
    "default": {
        "elevation_m": 1200.0,
        "slope_degrees": 22.0,
        "twi": 8.5,
        "flow_accumulation": 1500.0,
        "aspect_degrees": 200.0,
    }
}


class FeatureStoreService:
    """
    Builds FeatureSnapshot vectors for ML inference and training.

    All features for timestamp T are computed from observations with observed_at <= T.
    This is a hard invariant — violation constitutes future leakage.
    """

    def build_snapshot_from_observations(
        self,
        location_id: str,
        feature_timestamp: datetime,
        observations: list[dict[str, Any]],
        terrain_meta: dict[str, float] | None = None,
        data_mode: str = "DEMO",
        trace_id: str | None = None,
    ) -> dict[str, Any]:
        """
        Build a complete feature payload from a list of observation dicts.

        Observations must have: variable_name, value, unit, observed_at (ISO str).
        Only observations with observed_at <= feature_timestamp are included (leakage prevention).

        Returns a feature_payload dict suitable for storage in FeatureSnapshot.feature_payload.
        """
        trace_id = trace_id or str(uuid.uuid4())

        # ── LEAKAGE PREVENTION ─────────────────────────────────────────────────
        cutoff = feature_timestamp
        eligible = [
            obs for obs in observations
            if self._parse_dt(obs.get("observed_at", "")) <= cutoff
        ]
        if len(eligible) < len(observations):
            dropped = len(observations) - len(eligible)
            logger.warning(
                "feature_store_leakage_prevention",
                dropped=dropped,
                location_id=location_id,
                cutoff=cutoff.isoformat(),
            )
        # ──────────────────────────────────────────────────────────────────────

        # Group by variable
        by_var: dict[str, list[float]] = {}
        for obs in eligible:
            var = obs.get("variable_name", "")
            val = obs.get("value")
            if val is not None and var:
                by_var.setdefault(var, []).append(float(val))

        def latest(var: str) -> float | None:
            return by_var[var][-1] if var in by_var and by_var[var] else None

        def aggregate(var: str, hours: int) -> float | None:
            """Sum of values for a variable within the last N hours."""
            cutoff_h = cutoff - timedelta(hours=hours)
            vals = [
                float(obs["value"])
                for obs in eligible
                if obs.get("variable_name") == var
                and self._parse_dt(obs.get("observed_at", "")) >= cutoff_h
                and obs.get("value") is not None
            ]
            return sum(vals) if vals else None

        terrain = terrain_meta or _DEMO_TERRAIN.get("default", {})

        # ── Rainfall features ─────────────────────────────────────────────────
        rainfall_features = {
            "rainfall_15m_mm": aggregate("rainfall_mm", 0.25),
            "rainfall_30m_mm": aggregate("rainfall_mm", 0.5),
            "rainfall_1h_mm": aggregate("rainfall_mm", 1),
            "rainfall_3h_mm": aggregate("rainfall_mm", 3),
            "rainfall_6h_mm": aggregate("rainfall_mm", 6),
            "rainfall_12h_mm": aggregate("rainfall_mm", 12),
            "rainfall_24h_mm": aggregate("rainfall_mm", 24),
            "rainfall_72h_mm": aggregate("rainfall_mm", 72),
            "rainfall_peak_intensity_mmph": latest("rainfall_intensity_mmph"),
        }

        # ── Soil/antecedent features ───────────────────────────────────────────
        soil_features = {
            "soil_moisture_pct": latest("soil_moisture_pct"),
            "soil_saturation_index": latest("soil_saturation_index"),
            "antecedent_7d_mm": aggregate("rainfall_mm", 168),
        }

        # ── Terrain features (static) ─────────────────────────────────────────
        terrain_features = {
            "elevation_m": terrain.get("elevation_m"),
            "slope_degrees": terrain.get("slope_degrees"),
            "twi": terrain.get("twi"),
            "flow_accumulation": terrain.get("flow_accumulation"),
            "aspect_degrees": terrain.get("aspect_degrees"),
        }

        # ── Hydrology features ────────────────────────────────────────────────
        river_level = latest("river_level_m")
        warning_level = 4.5  # Demo value — real value from DataSource
        danger_level = 6.0
        hydrology_features = {
            "river_level_m": river_level,
            "river_rate_of_rise_mph": latest("river_rate_of_rise_mph"),
            "warning_level_diff_m": (river_level - warning_level) if river_level is not None else None,
            "danger_level_diff_m": (river_level - danger_level) if river_level is not None else None,
        }

        # ── Data quality features ──────────────────────────────────────────────
        total = len(eligible)
        missing_count = sum(1 for obs in eligible if obs.get("value") is None)
        missing_fraction = missing_count / total if total > 0 else 1.0

        quality_features = {
            "obs_count_1h": len([
                o for o in eligible
                if self._parse_dt(o.get("observed_at", "")) >= cutoff - timedelta(hours=1)
            ]),
            "missing_fraction": missing_fraction,
            "has_rainfall_source": "rainfall_mm" in by_var,
            "has_river_source": "river_level_m" in by_var,
            "has_soil_source": "soil_moisture_pct" in by_var,
        }

        feature_payload = {
            **rainfall_features,
            **soil_features,
            **terrain_features,
            **hydrology_features,
            **quality_features,
            "_meta": {
                "feature_version": "v1.0",
                "data_mode": data_mode,
                "leakage_check": "PASSED",
                "cutoff_at": cutoff.isoformat(),
                "obs_eligible": len(eligible),
                "trace_id": trace_id,
            },
        }

        return feature_payload

    def _parse_dt(self, s: str) -> datetime:
        """Parse ISO timestamp string to datetime. Returns epoch on failure."""
        if not s:
            return datetime.fromtimestamp(0, tz=timezone.utc)
        try:
            dt = datetime.fromisoformat(s)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except (ValueError, TypeError):
            return datetime.fromtimestamp(0, tz=timezone.utc)

    def compute_missing_fraction(self, feature_payload: dict[str, Any]) -> float:
        """Return fraction of feature values that are None."""
        meta_keys = {"_meta"}
        values = [v for k, v in feature_payload.items() if k not in meta_keys]
        if not values:
            return 1.0
        return sum(1 for v in values if v is None) / len(values)
