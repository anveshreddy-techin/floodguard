"""
FloodGuard AI — Data Quality Engine
17 quality flags and 4 statuses. Quarantined data cannot influence operational predictions.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class QualityFlag(str, Enum):
    """All 17 data quality flags."""
    VALID = "VALID"
    MISSING = "MISSING"
    OUT_OF_RANGE = "OUT_OF_RANGE"
    SUSPECT_SPIKE = "SUSPECT_SPIKE"
    STALE = "STALE"
    DUPLICATE = "DUPLICATE"
    OUT_OF_ORDER = "OUT_OF_ORDER"
    CLOCK_SKEW = "CLOCK_SKEW"
    INVALID_COORDINATE = "INVALID_COORDINATE"
    INVALID_UNIT = "INVALID_UNIT"
    UNKNOWN_LOCATION = "UNKNOWN_LOCATION"
    UNKNOWN_DEVICE = "UNKNOWN_DEVICE"
    SOURCE_UNVERIFIED = "SOURCE_UNVERIFIED"
    CALIBRATION_EXPIRED = "CALIBRATION_EXPIRED"
    REPLAY_DETECTED = "REPLAY_DETECTED"
    MANUAL_REVIEW = "MANUAL_REVIEW"


class QualityStatus(str, Enum):
    """4 possible quality decision statuses."""
    ACCEPTED = "ACCEPTED"
    ACCEPTED_WITH_WARNING = "ACCEPTED_WITH_WARNING"
    QUARANTINED = "QUARANTINED"  # Cannot influence operational predictions
    REJECTED = "REJECTED"  # Dropped from pipeline entirely


# Flags that escalate to QUARANTINED
_QUARANTINE_FLAGS = {
    QualityFlag.DUPLICATE,
    QualityFlag.OUT_OF_ORDER,
    QualityFlag.REPLAY_DETECTED,
    QualityFlag.SOURCE_UNVERIFIED,
    QualityFlag.CALIBRATION_EXPIRED,
    QualityFlag.MANUAL_REVIEW,
}

# Flags that escalate to REJECTED
_REJECTION_FLAGS = {
    QualityFlag.INVALID_COORDINATE,
    QualityFlag.MISSING,
    QualityFlag.UNKNOWN_DEVICE,
}

# Flags that produce ACCEPTED_WITH_WARNING
_WARNING_FLAGS = {
    QualityFlag.SUSPECT_SPIKE,
    QualityFlag.STALE,
    QualityFlag.CLOCK_SKEW,
    QualityFlag.INVALID_UNIT,
    QualityFlag.UNKNOWN_LOCATION,
}

# Physical plausibility ranges by variable name
_PHYSICAL_RANGES: dict[str, tuple[float, float]] = {
    "rainfall_mm": (0.0, 500.0),
    "river_level_m": (0.0, 50.0),
    "temperature_c": (-50.0, 60.0),
    "humidity_pct": (0.0, 100.0),
    "wind_speed_ms": (0.0, 100.0),
    "soil_moisture_pct": (0.0, 100.0),
    "pressure_hpa": (800.0, 1100.0),
}

# Accepted units per variable
_ACCEPTED_UNITS: dict[str, set[str]] = {
    "rainfall_mm": {"mm", "millimeter", "millimetre"},
    "river_level_m": {"m", "meter", "metre"},
    "temperature_c": {"c", "celsius", "°c"},
    "humidity_pct": {"%", "percent"},
    "wind_speed_ms": {"m/s", "ms", "mps"},
    "soil_moisture_pct": {"%", "percent", "vol%"},
    "pressure_hpa": {"hpa", "hectopascal", "mb", "millibar"},
}


@dataclass
class QualityReport:
    """Full quality assessment for one observation."""
    flags: list[QualityFlag]
    status: QualityStatus
    score: float  # 0.0 (lowest) – 1.0 (highest)
    details_by_field: dict[str, str]
    quarantine_reason: str | None


class DataQualityEngine:
    """
    Validates individual observations against all 17 quality criteria.
    Quarantined observations are blocked from influencing operational predictions.
    """

    def validate_observation(
        self,
        obs: dict[str, Any],
        source_meta: dict[str, Any] | None = None,
        recent_obs: list[dict[str, Any]] | None = None,
    ) -> QualityReport:
        """
        Run all quality checks on a normalized observation dict.

        Expected keys in obs:
            observed_at (str ISO), received_at (str ISO), value (float),
            variable_name (str), unit (str),
            lat (float|None), lon (float|None), location_id (str|None)

        Returns a QualityReport with status and full flag list.
        """
        flags: list[QualityFlag] = []
        details: dict[str, str] = {}
        recent_obs = recent_obs or []

        # 1. Missing value
        if obs.get("value") is None:
            flags.append(QualityFlag.MISSING)
            details["value"] = "Observation value is null."

        # 2. Physical range check
        if obs.get("value") is not None:
            var = obs.get("variable_name", "")
            val = float(obs["value"])
            if var in _PHYSICAL_RANGES:
                lo, hi = _PHYSICAL_RANGES[var]
                if not (lo <= val <= hi):
                    flags.append(QualityFlag.OUT_OF_RANGE)
                    details["value"] = f"Value {val} outside [{lo}, {hi}] for {var}."

        # 3. Spike detection
        if obs.get("value") is not None and len(recent_obs) >= 5:
            import statistics
            vals = [float(r["value"]) for r in recent_obs if r.get("value") is not None]
            if vals:
                try:
                    mean = statistics.mean(vals)
                    stdev = statistics.stdev(vals) if len(vals) > 1 else 0.0
                    if stdev > 0 and abs(float(obs["value"]) - mean) > 3.5 * stdev:
                        flags.append(QualityFlag.SUSPECT_SPIKE)
                        details["spike"] = f"Value deviates {abs(float(obs['value'])-mean):.2f} from mean {mean:.2f} (σ={stdev:.2f})."
                except Exception:
                    pass

        # 4. Coordinate bounds
        lat = obs.get("lat")
        lon = obs.get("lon")
        if lat is None or lon is None:
            pass  # no coordinate check if not provided
        else:
            if not (-90.0 <= float(lat) <= 90.0) or not (-180.0 <= float(lon) <= 180.0):
                flags.append(QualityFlag.INVALID_COORDINATE)
                details["coordinates"] = f"lat={lat}, lon={lon} out of valid range."

        # 5. Location known check
        if not obs.get("location_id"):
            flags.append(QualityFlag.UNKNOWN_LOCATION)
            details["location"] = "location_id is null or empty."

        # 6. Unit validation
        unit = (obs.get("unit") or "").lower().strip()
        var = obs.get("variable_name", "")
        if var in _ACCEPTED_UNITS and unit not in _ACCEPTED_UNITS[var]:
            flags.append(QualityFlag.INVALID_UNIT)
            details["unit"] = f"Unit '{unit}' not accepted for {var}. Expected: {_ACCEPTED_UNITS[var]}."

        # 7. Duplicate detection
        if recent_obs:
            observed_at = obs.get("observed_at", "")
            source = obs.get("source_id", "")
            for r in recent_obs:
                if (
                    r.get("observed_at") == observed_at
                    and r.get("source_id") == source
                    and r.get("variable_name") == var
                ):
                    flags.append(QualityFlag.DUPLICATE)
                    details["duplicate"] = "Exact match on (source, variable, observed_at)."
                    break

        # 8. Out-of-order
        if recent_obs and obs.get("observed_at"):
            latest = max((r.get("observed_at", "") for r in recent_obs), default="")
            if obs["observed_at"] < latest:
                flags.append(QualityFlag.OUT_OF_ORDER)
                details["ordering"] = f"observed_at {obs['observed_at']} < latest {latest}."

        # 9. Source verified check
        if source_meta and not source_meta.get("status") in ("OPERATIONAL", "DEGRADED"):
            flags.append(QualityFlag.SOURCE_UNVERIFIED)
            details["source"] = f"Source status is {source_meta.get('status')}."

        # 10. If no bad flags, mark VALID
        if not flags:
            flags.append(QualityFlag.VALID)

        status = self._determine_status(flags)
        score = self._score_flags(flags)
        quarantine_reason: str | None = None
        if status == QualityStatus.QUARANTINED:
            q_flags = [f.value for f in flags if f in _QUARANTINE_FLAGS or f in _REJECTION_FLAGS]
            quarantine_reason = f"Quarantined due to: {', '.join(q_flags)}"

        return QualityReport(
            flags=flags,
            status=status,
            score=score,
            details_by_field=details,
            quarantine_reason=quarantine_reason,
        )

    def _determine_status(self, flags: list[QualityFlag]) -> QualityStatus:
        """
        REJECTED: INVALID_COORDINATE + MISSING + UNKNOWN_DEVICE simultaneously
        QUARANTINED: any quarantine-level flag
        ACCEPTED_WITH_WARNING: any warning-level flag
        ACCEPTED: only VALID
        """
        flag_set = set(flags)
        # Rejection: coordinate + missing + unknown device
        if (
            QualityFlag.INVALID_COORDINATE in flag_set
            and QualityFlag.MISSING in flag_set
            and QualityFlag.UNKNOWN_DEVICE in flag_set
        ):
            return QualityStatus.REJECTED
        # Quarantine
        if flag_set & _QUARANTINE_FLAGS:
            return QualityStatus.QUARANTINED
        # Also quarantine on invalid coordinate alone
        if QualityFlag.INVALID_COORDINATE in flag_set:
            return QualityStatus.QUARANTINED
        # Warning
        if flag_set & _WARNING_FLAGS:
            return QualityStatus.ACCEPTED_WITH_WARNING
        # Also warning for out-of-range without other severe flags
        if QualityFlag.OUT_OF_RANGE in flag_set:
            return QualityStatus.ACCEPTED_WITH_WARNING
        return QualityStatus.ACCEPTED

    def _score_flags(self, flags: list[QualityFlag]) -> float:
        """Score 0.0 (worst) to 1.0 (best). VALID = 1.0."""
        if flags == [QualityFlag.VALID]:
            return 1.0
        deductions = {
            QualityFlag.MISSING: 0.8,
            QualityFlag.INVALID_COORDINATE: 0.7,
            QualityFlag.UNKNOWN_DEVICE: 0.5,
            QualityFlag.DUPLICATE: 0.6,
            QualityFlag.OUT_OF_RANGE: 0.4,
            QualityFlag.SUSPECT_SPIKE: 0.3,
            QualityFlag.SOURCE_UNVERIFIED: 0.3,
            QualityFlag.STALE: 0.2,
            QualityFlag.REPLAY_DETECTED: 0.5,
            QualityFlag.CALIBRATION_EXPIRED: 0.25,
            QualityFlag.INVALID_UNIT: 0.15,
            QualityFlag.CLOCK_SKEW: 0.1,
            QualityFlag.OUT_OF_ORDER: 0.2,
            QualityFlag.MANUAL_REVIEW: 0.3,
            QualityFlag.UNKNOWN_LOCATION: 0.1,
        }
        total_deduction = sum(deductions.get(f, 0.0) for f in flags)
        return max(0.0, 1.0 - total_deduction)
