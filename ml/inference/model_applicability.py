"""
FloodGuard AI — Model Applicability & Out-of-Distribution (OOD) Engine
Enforces the fundamental scientific principle:
"Can compute a prediction" does NOT mean "prediction is scientifically validated."

Evaluates every location against training distribution, geographic training coverage,
validation coverage, feature completeness, and out-of-distribution risks.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple


class ModelApplicabilityState(str, Enum):
    MODEL_VALIDATED_FOR_LOCATION = "MODEL_VALIDATED_FOR_LOCATION"
    MODEL_SUPPORTED_WITH_LIMITED_VALIDATION = "MODEL_SUPPORTED_WITH_LIMITED_VALIDATION"
    MODEL_OUT_OF_DISTRIBUTION = "MODEL_OUT_OF_DISTRIBUTION"
    MODEL_NOT_ELIGIBLE = "MODEL_NOT_ELIGIBLE"


@dataclass
class LocationReadinessReport:
    location_id: str
    coordinates: Tuple[float, float]
    state: ModelApplicabilityState
    data_coverage_pct: float
    feature_completeness_pct: float
    training_coverage_pct: float
    validation_coverage_pct: float
    model_applicability_pct: float
    out_of_distribution_score: float  # 0.0 (in-dist) to 100.0 (extreme OOD)
    uncertainty: str  # LOW, MEDIUM, HIGH, EXTREME
    prediction_eligibility: str  # ELIGIBLE, DOWNGRADED_WITH_UNCERTAINTY, WITHHELD
    ood_reasons: List[str]
    limitations: List[str]
    prediction_withheld: bool

    def to_dict(self) -> Dict[str, Any]:
        return {
            "location_id": self.location_id,
            "coordinates": list(self.coordinates),
            "state": self.state.value if hasattr(self.state, "value") else str(self.state),
            "data_coverage_pct": self.data_coverage_pct,
            "feature_completeness_pct": self.feature_completeness_pct,
            "training_coverage_pct": self.training_coverage_pct,
            "validation_coverage_pct": self.validation_coverage_pct,
            "model_applicability_pct": self.model_applicability_pct,
            "out_of_distribution_score": self.out_of_distribution_score,
            "uncertainty_score": 10.0 if self.uncertainty == "LOW" else (35.0 if self.uncertainty == "MEDIUM" else 75.0),
            "uncertainty": self.uncertainty,
            "prediction_eligibility": self.prediction_eligibility,
            "ood_reasons": self.ood_reasons,
            "limitations": self.limitations,
            "prediction_withheld": self.prediction_withheld,
        }


class ModelApplicabilityEngine:
    """
    Evaluates whether a target location's feature vector and geographic context
    lie within the model's domain of validity or are Out-Of-Distribution (OOD).
    """

    # Basins with verified training samples
    TRAINED_BASINS = [
        "Alaknanda Basin",
        "Mandakini Basin",
        "Dhauliganga Basin",
        "Beas Basin",
        "Satluj Basin",
        "Teesta Basin",
        "Chaliyar Basin",
        "Barak Basin",
        "Brahmaputra Basin",
        "Mahanadi Basin",
        "Godavari Basin",
    ]

    # Basins with formal ground-truth benchmark validation
    VALIDATED_BASINS = [
        "Alaknanda Basin",
        "Mandakini Basin",
        "Chaliyar Basin",
        "Beas Basin",
        "Teesta Basin",
    ]

    # Physical training envelope bounds for Tier C Tree Ensemble
    FEATURE_ENVELOPE = {
        "elevation_m": (150.0, 4600.0),
        "slope_degrees": (3.0, 52.0),
        "rainfall_peak_intensity_mmph": (0.0, 160.0),
        "rainfall_3h_mm": (0.0, 220.0),
        "soil_moisture_pct": (5.0, 100.0),
        "factor_of_safety_fos": (0.25, 4.5),
        "river_level_m": (0.2, 18.0),
    }

    def evaluate_location_applicability(
        self,
        latitude: float,
        longitude: float,
        features: Dict[str, Any],
        basin_name: str = "",
        state_name: str = "",
        location_id: str = "custom",
    ) -> LocationReadinessReport:
        ood_reasons: List[str] = []
        limitations: List[str] = []

        # 1. Feature Completeness
        core_features = ["rainfall_3h_mm", "slope_degrees", "soil_saturation_index", "elevation_m"]
        present_core = sum(1 for k in core_features if features.get(k) is not None)
        completeness_pct = round((present_core / len(core_features)) * 100.0, 1)

        # 2. Data Coverage Score
        tracked_keys = list(self.FEATURE_ENVELOPE.keys())
        present_tracked = sum(1 for k in tracked_keys if features.get(k) is not None)
        coverage_pct = round((present_tracked / len(tracked_keys)) * 100.0, 1)

        # 3. Geographic Training & Validation Coverage
        in_trained_basin = any(b.lower() in basin_name.lower() or basin_name.lower() in b.lower() for b in self.TRAINED_BASINS)
        in_validated_basin = any(b.lower() in basin_name.lower() or basin_name.lower() in b.lower() for b in self.VALIDATED_BASINS)

        # Indian hill regions bounding approximation
        is_hilly_indian_zone = (
            ("uttarakhand" in state_name.lower())
            or ("himachal" in state_name.lower())
            or ("jammu" in state_name.lower())
            or ("sikkim" in state_name.lower())
            or ("kerala" in state_name.lower())
            or ("meghalaya" in state_name.lower())
            or ("assam" in state_name.lower())
            or ("arunachal" in state_name.lower())
        )

        if in_trained_basin:
            training_cov_pct = 95.0
        elif is_hilly_indian_zone:
            training_cov_pct = 65.0
            limitations.append(f"Model trained on neighboring basins; transfer to {basin_name or 'target basin'} uncalibrated.")
        else:
            training_cov_pct = 25.0
            ood_reasons.append("Geographic region outside training watershed portfolio.")

        if in_validated_basin:
            validation_cov_pct = 90.0
        elif is_hilly_indian_zone:
            validation_cov_pct = 40.0
            limitations.append("No local gauge ground-truth benchmark records in this specific catchment.")
        else:
            validation_cov_pct = 10.0

        # 4. Out-of-Distribution (OOD) Distance
        ood_penalties = 0.0
        for feat, (min_val, max_val) in self.FEATURE_ENVELOPE.items():
            val = features.get(feat)
            if val is not None:
                try:
                    fval = float(val)
                    if fval < min_val:
                        ratio = (min_val - fval) / max(1.0, min_val)
                        ood_penalties += min(35.0, ratio * 40.0)
                        ood_reasons.append(f"{feat}={fval} below training minimum ({min_val})")
                    elif fval > max_val:
                        ratio = (fval - max_val) / max(1.0, max_val)
                        ood_penalties += min(45.0, ratio * 50.0)
                        ood_reasons.append(f"{feat}={fval} exceeds training envelope maximum ({max_val})")
                except (ValueError, TypeError):
                    pass

        # Geographic OOD penalty
        if not is_hilly_indian_zone and not in_trained_basin:
            ood_penalties += 45.0

        ood_score = round(min(100.0, max(0.0, ood_penalties)), 1)
        model_applicability_pct = round(max(0.0, 100.0 - ood_score), 1)

        # 5. Determine State, Uncertainty & Eligibility
        prediction_withheld = False
        if completeness_pct < 50.0 or features.get("rainfall_3h_mm") is None:
            state = ModelApplicabilityState.MODEL_NOT_ELIGIBLE
            uncertainty = "EXTREME"
            eligibility = "WITHHELD"
            prediction_withheld = True
            limitations.append("Essential driving trigger inputs missing. Prediction withheld per safety protocols.")
        elif ood_score >= 65.0:
            state = ModelApplicabilityState.MODEL_OUT_OF_DISTRIBUTION
            uncertainty = "HIGH"
            eligibility = "DOWNGRADED_WITH_UNCERTAINTY"
            limitations.append("Model is operating Out-of-Distribution. Confidence scores are downgraded.")
        elif in_validated_basin and completeness_pct >= 85.0 and ood_score < 25.0:
            state = ModelApplicabilityState.MODEL_VALIDATED_FOR_LOCATION
            uncertainty = "LOW"
            eligibility = "ELIGIBLE"
        else:
            state = ModelApplicabilityState.MODEL_SUPPORTED_WITH_LIMITED_VALIDATION
            uncertainty = "MEDIUM"
            eligibility = "ELIGIBLE"
            limitations.append("Computational prediction supported, but uncalibrated against prospective field telemetry.")

        return LocationReadinessReport(
            location_id=location_id,
            coordinates=(round(latitude, 4), round(longitude, 4)),
            state=state,
            data_coverage_pct=coverage_pct,
            feature_completeness_pct=completeness_pct,
            training_coverage_pct=training_cov_pct,
            validation_coverage_pct=validation_cov_pct,
            model_applicability_pct=model_applicability_pct,
            out_of_distribution_score=ood_score,
            uncertainty=uncertainty,
            prediction_eligibility=eligibility,
            ood_reasons=ood_reasons,
            limitations=limitations,
            prediction_withheld=prediction_withheld,
        )


model_applicability_engine = ModelApplicabilityEngine()
