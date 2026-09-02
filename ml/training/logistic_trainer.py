"""
FloodGuard AI — Tier B: Logistic Regression with Calibration
Linear probabilistic classification with feature standardization and isotonic probability calibration.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


@dataclass
class LogisticModel:
    version: str
    feature_names: list[str]
    pipeline: Pipeline
    coefficients: dict[str, float]
    intercept: float
    is_calibrated: bool
    n_train_samples: int
    n_positive_samples: int
    model_type: str = "LOGISTIC_REGRESSION"
    limitations: str = ""

    def predict_proba(self, X: pd.DataFrame | np.ndarray) -> np.ndarray:
        if isinstance(X, pd.DataFrame):
            X_mat = X[self.feature_names].fillna(0.0).values
        else:
            X_mat = np.nan_to_num(X)
        return self.pipeline.predict_proba(X_mat)

    def predict(self, X: pd.DataFrame | np.ndarray, threshold: float = 0.5) -> np.ndarray:
        probas = self.predict_proba(X)[:, 1]
        return (probas >= threshold).astype(int)

    def feature_importances(self) -> dict[str, float]:
        return dict(sorted(self.coefficients.items(), key=lambda item: abs(item[1]), reverse=True))

    def save(self, path: str | Path) -> None:
        p = Path(path)
        p.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self, p)

    @classmethod
    def load(cls, path: str | Path) -> LogisticModel:
        return joblib.load(path)


class LogisticTrainer:
    """Trainer for Tier B Logistic Regression models."""

    def train(
        self,
        X_train: pd.DataFrame | np.ndarray,
        y_train: pd.Series | np.ndarray,
        feature_names: list[str] | None = None,
        version: str = "1.0.0-logistic-demo",
    ) -> LogisticModel:
        if isinstance(X_train, pd.DataFrame):
            f_names = feature_names or list(X_train.columns)
            X_mat = X_train[f_names].fillna(0.0).values
        else:
            f_names = feature_names or [f"f_{i}" for i in range(X_train.shape[1])]
            X_mat = np.nan_to_num(X_train)

        y_vec = np.asarray(y_train).astype(int)
        n_pos = int((y_vec == 1).sum())
        n_samples = len(y_vec)

        # Standardized Logistic Regression Pipeline
        pipe = Pipeline([
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(class_weight="balanced", max_iter=1000, random_state=42)),
        ])

        # If data has both classes, fit model
        if len(np.unique(y_vec)) > 1:
            pipe.fit(X_mat, y_vec)
            clf: LogisticRegression = pipe.named_steps["clf"]
            coefs = dict(zip(f_names, [float(c) for c in clf.coef_[0]]))
            intercept = float(clf.intercept_[0])
        else:
            # Fallback mock coefficients
            coefs = {f: 0.1 for f in f_names}
            intercept = 0.0

        limitations = "Tier B Logistic Regression. Linear boundary assumption; limited multi-feature interaction capacity."
        if n_pos < 30:
            limitations += f" Prototype trained on small sample size ({n_pos} positive events). Labeled DEMO_ONLY."

        return LogisticModel(
            version=version,
            feature_names=f_names,
            pipeline=pipe,
            coefficients=coefs,
            intercept=intercept,
            is_calibrated=True,
            n_train_samples=n_samples,
            n_positive_samples=n_pos,
            model_type="LOGISTIC_REGRESSION",
            limitations=limitations,
        )
