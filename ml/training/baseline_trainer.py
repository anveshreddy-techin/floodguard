"""
FloodGuard AI — Tier A: Transparent Weighted Rule-Based Baseline
Always available, explainable, and zero-hallucination baseline.
Clearly labeled as Tier A Rule-Based Baseline (NOT a black-box ML model).
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import joblib
import numpy as np
try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False
    pd = None


@dataclass
class BaselineModel:
    version: str
    weights: dict[str, float]
    thresholds: dict[str, float]
    model_type: str = "TRANSPARENT_BASELINE"
    created_at: str = ""
    limitations: str = "Tier A Rule-Based Baseline. Transparent weighted scoring."

    def predict_proba(self, X: pd.DataFrame | np.ndarray) -> np.ndarray:
        """Calculate normalized hazard score in range [0, 1]."""
        if isinstance(X, np.ndarray):
            # Assume ordered features
            scores = np.mean(X, axis=1) if X.ndim > 1 else np.array([float(X)])
            return np.clip(scores / 100.0, 0.0, 1.0)

        scores = np.zeros(len(X))
        total_weight = sum(self.weights.values()) or 1.0

        for feat, weight in self.weights.items():
            if feat in X.columns:
                vals = X[feat].fillna(0.0).values
                # Standard physical normalization scale per feature
                if "rainfall" in feat:
                    norm_val = np.clip(vals / 50.0, 0.0, 1.0)
                elif "saturation" in feat or "moisture" in feat:
                    norm_val = np.clip(vals / 100.0, 0.0, 1.0)
                elif "slope" in feat:
                    norm_val = np.clip(vals / 45.0, 0.0, 1.0)
                elif "rise" in feat or "level" in feat:
                    norm_val = np.clip(vals / 5.0, 0.0, 1.0)
                else:
                    norm_val = np.clip(vals / 10.0, 0.0, 1.0)

                scores += norm_val * (weight / total_weight)

        # Output probabilities as Nx2 array (class 0, class 1)
        prob_1 = np.clip(scores, 0.0, 1.0)
        prob_0 = 1.0 - prob_1
        return np.column_stack([prob_0, prob_1])

    def predict(self, X: pd.DataFrame | np.ndarray, threshold: float = 0.5) -> np.ndarray:
        probas = self.predict_proba(X)[:, 1]
        return (probas >= threshold).astype(int)

    def explain(self, X_single: dict[str, float]) -> dict[str, Any]:
        """Explain feature contributions for a single observation."""
        contributions = {}
        total_weight = sum(self.weights.values()) or 1.0
        total_score = 0.0

        for feat, weight in self.weights.items():
            val = X_single.get(feat, 0.0)
            if "rainfall" in feat:
                norm_val = min(1.0, val / 50.0)
            elif "saturation" in feat or "moisture" in feat:
                norm_val = min(1.0, val / 100.0)
            elif "slope" in feat:
                norm_val = min(1.0, val / 45.0)
            elif "rise" in feat or "level" in feat:
                norm_val = min(1.0, val / 5.0)
            else:
                norm_val = min(1.0, val / 10.0)

            pts = norm_val * (weight / total_weight) * 100.0
            total_score += pts
            contributions[feat] = {
                "observed_value": val,
                "weight_fraction": round(weight / total_weight, 3),
                "score_contribution_pts": round(pts, 2),
            }

        return {
            "composite_score": round(total_score, 2),
            "contributions": contributions,
            "rule_version": self.version,
            "model_type": self.model_type,
        }

    def save(self, path: str | Path) -> None:
        p = Path(path)
        p.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self, p)

    @classmethod
    def load(cls, path: str | Path) -> BaselineModel:
        return joblib.load(path)


class BaselineTrainer:
    """Trainer and evaluator for Tier A baseline models."""

    DEFAULT_WEIGHTS = {
        "rainfall_1h_mm": 0.30,
        "soil_saturation_index": 0.25,
        "river_rate_of_rise_mph": 0.20,
        "slope_degrees": 0.10,
        "antecedent_7d_mm": 0.15,
    }

    DEFAULT_THRESHOLDS = {
        "LOW": 0.25,
        "MODERATE": 0.45,
        "HIGH": 0.65,
        "EXTREME": 0.82,
    }

    def train(
        self,
        features_df: pd.DataFrame | None = None,
        labels_df: pd.DataFrame | None = None,
        config: dict[str, Any] | None = None,
        version: str = "1.0.0-baseline",
    ) -> BaselineModel:
        cfg = config or {}
        weights = cfg.get("weights", self.DEFAULT_WEIGHTS)
        thresholds = cfg.get("thresholds", self.DEFAULT_THRESHOLDS)

        model = BaselineModel(
            version=version,
            weights=weights,
            thresholds=thresholds,
            model_type="TRANSPARENT_BASELINE",
            created_at=datetime.now(timezone.utc).isoformat(),
            limitations="Tier A Rule-Based Baseline. Calibrated on physical thresholds; zero black-box parameters.",
        )
        return model
