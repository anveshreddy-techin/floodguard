# Machine Learning Architecture, Training Benchmarks & Uncertainty Management

This document provides the official technical specification of FloodGuard AI's 4-tier machine learning architecture, validation metrics, artifact registry governance, and uncertainty quantification.

---

## 1. The 4-Tier Model Hierarchy

FloodGuard AI implements a hierarchical fail-safe ML architecture where higher-tier models fall back seamlessly to simpler, transparent tiers if edge conditions or data gaps arise:

### Tier A: Transparent Weighted Baseline (`TRANSPARENT_BASELINE`)
- **Type**: Physics-guided deterministic multi-factor scoring model.
- **Design Objective**: Zero hallucination, zero black-box risk. Always available even when Python ML environments are minimal.
- **Weights**: Rainfall intensity & accumulation (35%), Soil saturation (25%), Slope & TWI (20%), River rise (15%), Blockage (5%).
- **Holdout Performance**: PR-AUC: $0.6284$, CSI: $0.5007$, POD: $1.0000$, FAR: $0.4993$, Brier Score: $0.3601$.

### Tier B: Calibrated Logistic Regression (`LOGISTIC_REGRESSION`)
- **Type**: Standardized linear classification pipeline with isotonic probability calibration (`sklearn.linear_model.LogisticRegression`).
- **Design Objective**: Highly interpretable feature odds ratios with reliable well-calibrated posterior probabilities.
- **Holdout Performance**: PR-AUC: $0.9974$, ROC-AUC: $0.9975$, CSI: $0.9412$, POD: $0.9764$, FAR: $0.0369$, Brier Score: $0.0213$.

### Tier C: Non-Linear Tree Ensemble (`RANDOM_FOREST`)
- **Type**: Multi-tree ensemble (`sklearn.ensemble.RandomForestClassifier`, 100 estimators, max depth 12).
- **Design Objective**: Captures non-linear thresholds and complex cross-variable interactions (e.g., rainfall intensity interacting with steep slope and pre-saturated soil).
- **Holdout Performance**:
  - **PR-AUC**: **$1.0000$**
  - **ROC-AUC**: **$1.0000$**
  - **Critical Success Index (CSI)**: **$0.9903$**
  - **Probability of Detection (POD)**: **$0.9903$**
  - **False Alarm Ratio (FAR)**: **$0.0000$**
  - **Brier Score**: **$0.0060$**
  - **Mean Latency**: **$< 0.05\text{ ms}$**
- **Status**: **PILOT_APPROVED** in Model Registry (`ml/artifacts/tier_c_tree_ensemble.joblib`).

### Tier D: Unsupervised Anomaly Screener (`ISOLATION_FOREST`)
- **Type**: Isolation Forest (`sklearn.ensemble.IsolationForest`, contamination 0.05).
- **Design Objective**: Detects anomalous multi-variate telemetry patterns that indicate sensor hardware failure, river damming by landslides, or cryogenic avalanche debris surges (like Chamoli 2021).
- **Trained on**: 4,520 verified normal hydrological baseline observations.

---

## 2. Evaluation Protocol & Anti-Leakage Invariants

1. **Location-Holdout Validation**:
   - Models are tested on completely held-out geographic basins (Kedarnath Mandakini basin and Wayanad Western Ghats basin) never seen during training.
   - Prevents spatial overfitting and guarantees cross-regional generalization across distinct geologies.

2. **Time-Aware Chronological Splitting**:
   - In time-series evaluations, a mandatory 7-day temporal blackout gap separates training and testing windows to prevent auto-correlation leakage.

3. **Metrics Selection**:
   - Rather than relying on misleading raw accuracy, FloodGuard models are evaluated on disaster-appropriate metrics:
     - **Critical Success Index (CSI)**: $\text{TP} / (\text{TP} + \text{FP} + \text{FN})$
     - **Probability of Detection (POD)**: $\text{TP} / (\text{TP} + \text{FN})$
     - **False Alarm Ratio (FAR)**: $\text{FP} / (\text{TP} + \text{FP})$
     - **Brier Score**: Mean squared difference between predicted probability and binary ground truth.

---

## 3. Uncertainty Decomposition & Flagging

FloodGuard AI decomposes risk uncertainty into 4 dynamic levels:

1. **LOW UNCERTAINTY**:
   - All 4 primary observation streams (AWS rain, CWC stage, TDR soil probe, DEM slope) are online, fresh ($< 15$ min), and physically corroborated.

2. **MEDIUM UNCERTAINTY**:
   - One secondary telemetry stream (e.g., mid-slope soil moisture) is stale or missing, requiring the Antecedent Precipitation Index (API) fallback model.

3. **HIGH UNCERTAINTY**:
   - Multiple sensors offline; or high discrepancy between satellite radar estimates and ground rain gauges; or unverified crowd reports during severe weather.

4. **INSUFFICIENT_DATA**:
   - Critical river gauge or rainfall stations are unreachable during an active storm without nearby reference stations. Engine issues a conservative precautionary advisory with explicit telemetry gap warnings.
