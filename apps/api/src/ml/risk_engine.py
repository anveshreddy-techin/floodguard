"""
FloodGuard AI — Hybrid Risk Engine

Architecture:
1. Component-level scoring (domain rules + ML where available)
2. Uncertainty estimation
3. Evidence aggregation
4. Explanation generation

This is a TRANSPARENT, DOCUMENTED scoring framework.
Thresholds are domain-informed, NOT claimed as official IMD/CWC thresholds.
"""
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any


class RiskLevel(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    EXTREME = "EXTREME"
    UNKNOWN = "UNKNOWN"


class Confidence(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"


class Uncertainty(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"


@dataclass
class RainfallFeatures:
    """Rainfall-related input features"""
    rainfall_1h_mm: float | None = None
    rainfall_3h_mm: float | None = None
    rainfall_6h_mm: float | None = None
    rainfall_24h_mm: float | None = None
    rainfall_72h_mm: float | None = None
    intensity_mmph: float | None = None
    antecedent_7d_mm: float | None = None
    data_age_hours: float | None = None
    source: str | None = None
    data_mode: str = "DEMO"


@dataclass
class SoilFeatures:
    """Soil moisture / saturation features"""
    saturation_index: float | None = None  # 0-1
    soil_moisture_pct: float | None = None
    antecedent_precipitation_index: float | None = None
    drainage_class: str | None = None
    data_age_hours: float | None = None
    evidence_state: str = "MODEL_INFERRED"


@dataclass
class TerrainFeatures:
    """Static terrain characteristics (from DEM)"""
    slope_degrees: float | None = None
    elevation_m: float | None = None
    twi: float | None = None
    tri: float | None = None
    flow_accumulation: float | None = None
    historical_susceptibility: float | None = None
    landslide_density: float | None = None


@dataclass
class RiverFeatures:
    """River/gauge features"""
    level_m: float | None = None
    rate_of_rise_mph: float | None = None
    danger_level_m: float | None = None
    warning_level_m: float | None = None
    anomaly_score: float | None = None
    data_age_hours: float | None = None
    evidence_state: str = "OBSERVED"


@dataclass
class RiskContributor:
    name: str
    score: float
    weight: float
    weighted_contribution: float
    evidence: list[str]
    data_mode: str
    staleness_hours: float | None = None


import joblib
from pathlib import Path

_active_ml_model: Any = None
_active_model_version: str = "baseline_v1.0"
_active_model_type: str = "TRANSPARENT_BASELINE"
_active_model_limitations: str = "Tier A Rule-Based Baseline — calibrated physical weights; demo validation only."


def load_ml_model(model_path: str | Path | None = None) -> bool:
    """Load ML model from registry. Returns True if ML model loaded, False = use baseline."""
    global _active_ml_model, _active_model_version, _active_model_type, _active_model_limitations
    if not model_path or not Path(model_path).exists():
        _active_model_type = "TRANSPARENT_BASELINE"
        _active_ml_model = None
        return False
    try:
        _active_ml_model = joblib.load(model_path)
        _active_model_version = getattr(_active_ml_model, "version", "custom_ml_v1.0")
        _active_model_type = getattr(_active_ml_model, "model_type", "ML_MODEL")
        _active_model_limitations = getattr(_active_ml_model, "limitations", "Trained ML model.")
        return True
    except Exception:
        _active_model_type = "TRANSPARENT_BASELINE"
        _active_ml_model = None
        return False


# Auto-load trained pilot ensemble model if present on disk
_default_pilot_artifact = Path("ml/artifacts/tier_c_tree_ensemble.joblib")
if _default_pilot_artifact.exists():
    load_ml_model(_default_pilot_artifact)



@dataclass
class RiskOutput:
    """Full risk assessment output with evidence and explanation"""
    risk_score: float
    risk_level: RiskLevel
    confidence: Confidence
    uncertainty: Uncertainty
    contributors: list[RiskContributor]
    evidence: list[dict]
    explanation: dict
    data_gaps: list[str]
    limitations: list[str]
    model_version: str
    assessed_at: datetime
    feature_snapshot: dict
    data_sources_used: list[str]
    data_freshness: str
    model_type: str = "TRANSPARENT_BASELINE"
    model_status: str = "FALLBACK_BASELINE"
    uncertainty_reason: str = ""


# ─── Component Scorers ────────────────────────────────────────────────────────

def score_rainfall(f: RainfallFeatures) -> tuple[float, list[str], list[str]]:
    has_any = (
        f.intensity_mmph is not None
        or f.rainfall_1h_mm is not None
        or f.rainfall_3h_mm is not None
        or f.rainfall_24h_mm is not None
    )
    if not has_any:
        return 0.0, [], ["Rainfall data unavailable — rainfall risk cannot be scored"]

    score = 0.0
    evidence = []
    gaps = []

    # 1-hour intensity / rate
    eff_intensity = f.intensity_mmph if f.intensity_mmph is not None else f.rainfall_1h_mm
    if eff_intensity is not None:
        if eff_intensity >= 50:
            score = max(score, 90)
            evidence.append(f"Rainfall intensity: {eff_intensity:.1f} mm/h (extreme for hilly terrain)")
        elif eff_intensity >= 30:
            score = max(score, 70)
            evidence.append(f"Rainfall intensity: {eff_intensity:.1f} mm/h (high)")
        elif eff_intensity >= 15:
            score = max(score, 45)
            evidence.append(f"Rainfall intensity: {eff_intensity:.1f} mm/h (moderate)")
        elif eff_intensity >= 5:
            score = max(score, 20)
            evidence.append(f"Rainfall intensity: {eff_intensity:.1f} mm/h (light)")
        else:
            evidence.append(f"Rainfall intensity: {eff_intensity:.1f} mm/h (minimal)")

    # 24-hour accumulation
    if f.rainfall_24h_mm is not None:
        if f.rainfall_24h_mm >= 200:
            score = max(score, 85)
            evidence.append(f"24h accumulation: {f.rainfall_24h_mm:.0f}mm (extremely heavy)")
        elif f.rainfall_24h_mm >= 115:
            score = max(score, 65)
            evidence.append(f"24h accumulation: {f.rainfall_24h_mm:.0f}mm (very heavy)")
        elif f.rainfall_24h_mm >= 64:
            score = max(score, 40)
            evidence.append(f"24h accumulation: {f.rainfall_24h_mm:.0f}mm (heavy)")

    # Antecedent rainfall
    if f.antecedent_7d_mm is not None:
        antecedent_factor = min(1.5, 1 + (f.antecedent_7d_mm / 200))
        score = min(100, score * antecedent_factor)
        if f.antecedent_7d_mm > 100:
            evidence.append(f"7-day antecedent rainfall: {f.antecedent_7d_mm:.0f}mm (elevated pre-conditioning)")

    if f.data_age_hours is not None and f.data_age_hours > 3:
        gaps.append(f"Rainfall data is {f.data_age_hours:.0f} hours old — score has increased uncertainty")

    return round(score, 1), evidence, gaps


def score_soil(f: SoilFeatures) -> tuple[float, list[str], list[str]]:
    if f.saturation_index is None and f.soil_moisture_pct is None:
        return 0.0, [], ["Soil moisture data unavailable — soil risk cannot be scored"]

    score = 0.0
    evidence = []
    gaps = []

    si = f.saturation_index
    if si is None and f.soil_moisture_pct is not None:
        si = f.soil_moisture_pct / 100

    if si is not None:
        score = si * 100
        if si >= 0.85:
            evidence.append(f"Soil saturation: {si:.0%} (near-saturated — reduced infiltration capacity)")
        elif si >= 0.65:
            evidence.append(f"Soil saturation: {si:.0%} (high — elevated runoff potential)")
        elif si >= 0.45:
            evidence.append(f"Soil saturation: {si:.0%} (moderate)")
        else:
            evidence.append(f"Soil saturation: {si:.0%} (low)")

    if f.drainage_class == "poor":
        score = min(100, score * 1.2)
        evidence.append("Poor drainage class — water retention elevated")
    elif f.drainage_class == "excessive":
        score = score * 0.8
        evidence.append("Well-drained soil — runoff risk reduced")

    if f.data_age_hours is not None and f.data_age_hours > 24:
        gaps.append(f"Soil moisture data is {f.data_age_hours:.0f}h old — soil state may have changed")

    gaps.append("Soil saturation is modeled from rainfall + terrain, not directly measured")

    return round(score, 1), evidence, gaps


def score_terrain(f: TerrainFeatures) -> tuple[float, list[str], list[str]]:
    if f.slope_degrees is None and f.historical_susceptibility is None:
        return 50.0, [], ["Terrain data unavailable — using default moderate terrain risk"]

    score = 0.0
    evidence = []
    gaps = []

    if f.slope_degrees is not None:
        if f.slope_degrees >= 45:
            score += 40
            evidence.append(f"Slope: {f.slope_degrees:.0f}° (very steep — high debris flow susceptibility)")
        elif f.slope_degrees >= 30:
            score += 28
            evidence.append(f"Slope: {f.slope_degrees:.0f}° (steep)")
        elif f.slope_degrees >= 15:
            score += 15
            evidence.append(f"Slope: {f.slope_degrees:.0f}° (moderate)")
        else:
            score += 5
            evidence.append(f"Slope: {f.slope_degrees:.0f}° (gentle)")

    if f.twi is not None:
        twi_score = min(30, (f.twi / 15) * 30)
        score += twi_score
        if f.twi > 8:
            evidence.append(f"TWI: {f.twi:.1f} (high — flow concentration zone)")

    if f.historical_susceptibility is not None:
        hist_score = f.historical_susceptibility * 30
        score += hist_score
        if f.historical_susceptibility > 0.5:
            evidence.append(f"Historical susceptibility: {f.historical_susceptibility:.0%} (elevated based on past events)")

    score = min(100, score)
    gaps.append("Terrain susceptibility based on static DEM analysis")

    return round(score, 1), evidence, gaps


def score_river(f: RiverFeatures) -> tuple[float, list[str], list[str]]:
    if f.level_m is None:
        return 0.0, [], ["River level data unavailable — river risk cannot be scored (no CWC connection)"]

    score = 0.0
    evidence = []
    gaps = []

    if f.danger_level_m is not None and f.level_m >= f.danger_level_m:
        score = max(score, 90)
        evidence.append(f"River level {f.level_m:.1f}m ABOVE danger level ({f.danger_level_m:.1f}m)")
    elif f.warning_level_m is not None and f.level_m >= f.warning_level_m:
        score = max(score, 65)
        evidence.append(f"River level {f.level_m:.1f}m at/above warning level ({f.warning_level_m:.1f}m)")
    elif f.level_m > 0:
        score = max(score, 20)
        evidence.append(f"River level: {f.level_m:.1f}m (below warning thresholds)")

    if f.rate_of_rise_mph is not None:
        if f.rate_of_rise_mph >= 0.5:
            score = min(100, score + 20)
            evidence.append(f"Rapid river rise: {f.rate_of_rise_mph:.2f} m/h (flash flood signature)")
        elif f.rate_of_rise_mph >= 0.2:
            score = min(100, score + 10)
            evidence.append(f"River rising: {f.rate_of_rise_mph:.2f} m/h")

    if f.data_age_hours is not None and f.data_age_hours > 1:
        gaps.append(f"River data is {f.data_age_hours:.0f}h old")

    return round(score, 1), evidence, gaps


# ─── Main Engine ──────────────────────────────────────────────────────────────

class HybridRiskEngine:
    MODEL_VERSION = "rule_based_baseline_v1"

    WEIGHTS = {
        "rainfall": 0.35,
        "soil": 0.25,
        "terrain": 0.20,
        "river": 0.15,
        "historical": 0.05,
    }

    def assess(
        self,
        rainfall: RainfallFeatures | None = None,
        soil: SoilFeatures | None = None,
        terrain: TerrainFeatures | None = None,
        river: RiverFeatures | None = None,
        location_name: str = "Unknown Location",
    ) -> RiskOutput:
        now = datetime.now(timezone.utc)
        all_gaps: list[str] = []
        all_evidence: list[dict] = []
        contributors: list[RiskContributor] = []
        data_sources: list[str] = []

        rain_score, rain_ev, rain_gaps = score_rainfall(rainfall or RainfallFeatures())
        soil_score, soil_ev, soil_gaps = score_soil(soil or SoilFeatures())
        terrain_score, terrain_ev, terrain_gaps = score_terrain(terrain or TerrainFeatures())
        river_score, river_ev, river_gaps = score_river(river or RiverFeatures())

        all_gaps.extend(rain_gaps + soil_gaps + terrain_gaps + river_gaps)

        for name, score, ev, w in [
            ("rainfall", rain_score, rain_ev, self.WEIGHTS["rainfall"]),
            ("soil_saturation", soil_score, soil_ev, self.WEIGHTS["soil"]),
            ("terrain", terrain_score, terrain_ev, self.WEIGHTS["terrain"]),
            ("river_level", river_score, river_ev, self.WEIGHTS["river"]),
        ]:
            contributors.append(RiskContributor(
                name=name, score=score, weight=w,
                weighted_contribution=round(score * w, 2),
                evidence=ev,
                data_mode=(rainfall or RainfallFeatures()).data_mode if name == "rainfall" else "DEMO",
            ))
            all_evidence.extend({"type": name, "observation": e} for e in ev)
            if ev:
                data_sources.append(name)

        contributors.sort(key=lambda c: c.weighted_contribution, reverse=True)

        composite = (
            rain_score * self.WEIGHTS["rainfall"]
            + soil_score * self.WEIGHTS["soil"]
            + terrain_score * self.WEIGHTS["terrain"]
            + river_score * self.WEIGHTS["river"]
        )
        composite = round(min(100, composite), 1)

        if composite >= 75:
            risk_level = RiskLevel.EXTREME
        elif composite >= 55:
            risk_level = RiskLevel.HIGH
        elif composite >= 35:
            risk_level = RiskLevel.MODERATE
        elif composite >= 10:
            risk_level = RiskLevel.LOW
        else:
            risk_level = RiskLevel.UNKNOWN

        missing_sources = sum(1 for s in [rain_score, soil_score, river_score] if s == 0)
        stale_count = sum(1 for gap in all_gaps if "old" in gap or "stale" in gap.lower())

        if missing_sources >= 2 or stale_count >= 2:
            uncertainty = Uncertainty.HIGH
            confidence = Confidence.INSUFFICIENT_DATA
        elif missing_sources == 1 or stale_count == 1:
            uncertainty = Uncertainty.MEDIUM
            confidence = Confidence.LOW
        else:
            uncertainty = Uncertainty.LOW
            confidence = Confidence.MEDIUM

        top_contributor = contributors[0] if contributors else None
        explanation = {
            "summary": self._build_summary(risk_level, top_contributor, composite),
            "primary_driver": top_contributor.name if top_contributor else None,
            "component_breakdown": [
                {
                    "factor": c.name,
                    "score": c.score,
                    "weight": c.weight,
                    "contribution": c.weighted_contribution,
                    "key_evidence": c.evidence[:2] if c.evidence else [],
                }
                for c in contributors
            ],
            "uncertainty_sources": all_gaps[:5],
            "model_note": "Risk score computed by rule-based hybrid engine (v1). ML model is PLANNED.",
        }

        return RiskOutput(
            risk_score=composite,
            risk_level=risk_level,
            confidence=confidence,
            uncertainty=uncertainty,
            contributors=contributors,
            evidence=all_evidence,
            explanation=explanation,
            data_gaps=all_gaps,
            limitations=[
                "Rule-based baseline — not calibrated against historical events",
                "Soil moisture is modeled, not directly measured",
                "No real-time IMD/CWC data in prototype mode",
                "Terrain data from SRTM 30m — local drainage details may be missed",
            ],
            model_version=_active_model_version if _active_ml_model else self.MODEL_VERSION,
            assessed_at=now,
            feature_snapshot={
                "rainfall": _to_dict(rainfall),
                "soil": _to_dict(soil),
                "terrain": _to_dict(terrain),
                "river": _to_dict(river),
            },
            data_sources_used=data_sources,
            data_freshness="DEMO",
            model_type=_active_model_type,
            model_status="ML_ACTIVE" if _active_ml_model else "FALLBACK_BASELINE",
            uncertainty_reason=f"Telemetry gaps: {len(all_gaps)} factors unverified or modeled",
        )

    def _build_summary(self, level: RiskLevel, top: RiskContributor | None, score: float) -> str:
        level_text = {
            RiskLevel.EXTREME: "Extreme flash-flood risk",
            RiskLevel.HIGH: "High flash-flood risk",
            RiskLevel.MODERATE: "Moderate flash-flood risk",
            RiskLevel.LOW: "Low flash-flood risk",
            RiskLevel.UNKNOWN: "Risk level unknown",
        }[level]

        if top and top.evidence:
            return f"{level_text} (score: {score:.0f}/100). Primary driver: {top.name.replace('_', ' ')} — {top.evidence[0]}"
        return f"{level_text} (score: {score:.0f}/100). Insufficient evidence for detailed explanation."


def _to_dict(obj: Any) -> dict:
    if obj is None:
        return {}
    if hasattr(obj, "__dataclass_fields__"):
        return {k: getattr(obj, k) for k in obj.__dataclass_fields__}
    return {}


risk_engine = HybridRiskEngine()
