"""
FloodGuard AI — Drift Monitor
Calculates Population Stability Index (PSI) and feature distribution drift for hydrometeorology telemetry.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np


@dataclass
class DriftReport:
    overall_status: str  # NO_DRIFT, MODERATE_DRIFT, HIGH_DRIFT
    prediction_psi: float
    feature_psi_values: dict[str, float]
    drifted_features: list[str]
    recommendation: str


class DriftMonitor:
    """Monitors live vs baseline feature distributions to detect seasonal shifts or sensor degradation."""

    def compute_psi(
        self,
        reference: np.ndarray,
        current: np.ndarray,
        bins: int = 10,
    ) -> float:
        """
        Population Stability Index:
        PSI = sum((Actual% - Expected%) * ln(Actual% / Expected%))
        PSI < 0.10 -> No significant shift
        0.10 <= PSI < 0.25 -> Moderate drift, monitor closely
        PSI >= 0.25 -> Severe drift, model retraining recommended
        """
        ref_clean = reference[~np.isnan(reference)]
        cur_clean = current[~np.isnan(current)]

        if len(ref_clean) < 10 or len(cur_clean) < 10:
            return 0.0

        # Bin edges from reference distribution
        percentiles = np.linspace(0, 100, bins + 1)
        bin_edges = np.percentile(ref_clean, percentiles)
        bin_edges[0] -= 1e-5
        bin_edges[-1] += 1e-5

        # Frequencies
        ref_counts, _ = np.histogram(ref_clean, bins=bin_edges)
        cur_counts, _ = np.histogram(cur_clean, bins=bin_edges)

        # Proportions with Laplace smoothing
        eps = 1e-4
        ref_pct = (ref_counts + eps) / (len(ref_clean) + eps * bins)
        cur_pct = (cur_counts + eps) / (len(cur_clean) + eps * bins)

        psi_val = np.sum((cur_pct - ref_pct) * np.log(cur_pct / ref_pct))
        return float(round(max(0.0, psi_val), 4))

    def monitor_features(
        self,
        reference_matrix: np.ndarray,
        current_matrix: np.ndarray,
        feature_names: list[str],
    ) -> DriftReport:
        feature_psi: dict[str, float] = {}
        drifted: list[str] = []

        for i, feat in enumerate(feature_names):
            if i < reference_matrix.shape[1] and i < current_matrix.shape[1]:
                psi = self.compute_psi(reference_matrix[:, i], current_matrix[:, i])
                feature_psi[feat] = psi
                if psi >= 0.25:
                    drifted.append(feat)

        pred_psi = 0.05  # baseline demo prediction shift
        if len(drifted) > 2:
            status = "HIGH_DRIFT"
            rec = "Multiple core hydrology features show severe distribution shift. Validate sensor calibrations or trigger model fine-tuning."
        elif len(drifted) > 0:
            status = "MODERATE_DRIFT"
            rec = f"Features {drifted} show moderate drift. Continue monitoring against ground observations."
        else:
            status = "NO_DRIFT"
            rec = "Telemetry distributions are stable and aligned with training baseline."

        return DriftReport(
            overall_status=status,
            prediction_psi=pred_psi,
            feature_psi_values=feature_psi,
            drifted_features=drifted,
            recommendation=rec,
        )
