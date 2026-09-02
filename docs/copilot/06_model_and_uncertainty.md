# Machine Learning Architecture & Uncertainty Management

## Model Hierarchy Tiers
- **Tier A: Transparent Weighted Baseline**: Always-available, deterministic rule-based framework with zero black-box parameters.
- **Tier B: Calibrated Logistic Regression**: Standardized linear probabilities with isotonic calibration.
- **Tier C: Non-Linear Tree Ensembles**: Random Forest and HistGradientBoosting for multi-feature interaction capture.
- **Tier D: Unsupervised Anomaly Screening**: Isolation Forest for detecting sensor failure or sudden hydrological departures.

## Uncertainty Decomposition
Uncertainty levels (LOW, MEDIUM, HIGH, INSUFFICIENT_DATA) are triggered dynamically by:
1. **Telemetry Age**: Data older than 60 minutes is marked STALE.
2. **Sensor Missingness**: Missing soil or river gauges elevate uncertainty to MEDIUM or HIGH.
3. **Provider Discrepancy**: Significant disagreement between radar estimates and gauge readings.
