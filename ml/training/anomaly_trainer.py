"""
FloodGuard AI — Tier D: Unsupervised Anomaly Screening
Isolation Forest for rapid detection of sensor malfunction, river blockages, or sudden surge anomalies.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest


@dataclass
class AnomalyModel:
    version: str
    feature_names: list[str]
    model: IsolationForest
    contamination: float
    model_type: str = "ISOLATION_FOREST"
    limitations: str = "Tier D Unsupervised Anomaly Screener. Outputs anomaly likelihood score; does not classify disaster types."

    def score_samples(self, X: pd.DataFrame | np.ndarray) -> np.ndarray:
        if isinstance(X, pd.DataFrame):
            X_mat = X[self.feature_names].fillna(0.0).values
        else:
            X_mat = np.nan_to_num(X)
        # Higher score = more normal; lower = more anomalous
        raw_scores = self.model.decision_function(X_mat)
        # Normalize into anomaly probability [0, 1] where 1 is highly anomalous
        anomaly_scores = 1.0 / (1.0 + np.exp(raw_scores * 5.0))
        return anomaly_scores

    def predict(self, X: pd.DataFrame | np.ndarray) -> list[str]:
        scores = self.score_samples(X)
        labels = []
        for s in scores:
            if s > 0.75:
                labels.append("ANOMALY")
            elif s > 0.50:
                labels.append("POSSIBLE_ANOMALY")
            else:
                labels.append("NORMAL")
        return labels

    def save(self, path: str | Path) -> None:
        p = Path(path)
        p.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self, p)

    @classmethod
    def load(cls, path: str | Path) -> AnomalyModel:
        return joblib.load(path)


class AnomalyTrainer:
    """Trainer for Tier D anomaly detection models."""

    def train(
        self,
        X_normal: pd.DataFrame | np.ndarray,
        feature_names: list[str] | None = None,
        contamination: float = 0.05,
        version: str = "1.0.0-anomaly-demo",
    ) -> AnomalyModel:
        if isinstance(X_normal, pd.DataFrame):
            f_names = feature_names or list(X_normal.columns)
            X_mat = X_normal[f_names].fillna(0.0).values
        else:
            f_names = feature_names or [f"f_{i}" for i in range(X_normal.shape[1])]
            X_mat = np.nan_to_num(X_normal)

        iso = IsolationForest(
            contamination=contamination,
            random_state=42,
            n_estimators=100,
        )
        if len(X_mat) > 0:
            iso.fit(X_mat)

        return AnomalyModel(
            version=version,
            feature_names=f_names,
            model=iso,
            contamination=contamination,
            model_type="ISOLATION_FOREST",
        )
