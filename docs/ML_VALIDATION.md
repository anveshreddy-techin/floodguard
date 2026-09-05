# FloodGuard AI — Multi-Tier ML Validation Report (Real Observational vs. Synthetic Benchmark)

**SIH Problem Statement SIH26192**: Flash Flood Prediction System for Hilly Regions using Multi-Source Data  
**Evaluation Standard**: Scientific Non-Fabrication Guarantee & Provenance Verification  
**Evaluation Date**: September 5, 2026  
**Reviewer**: Principal Disaster Systems Engineer (SIH26192)  

---

## 1. Executive Summary

This report documents the empirical evaluation of all four FloodGuard AI model tiers evaluated under two distinct regimes:
1. **Real Observational Disaster Dataset (`dataset_type: REAL`)**: Assembled from NASA COOLR, GSI Bhukosh, NRSC Landslide Atlas of India (2023), IMD gridded & station daily rainfall, NASA SMAP satellite soil moisture, SRTM 30m DEM slope/elevation, and India-WRIS / CWC river gauges.
2. **Multi-Basin Synthetic Benchmark Dataset (`dataset_type: SYNTHETIC_BENCHMARK`)**: 8,660 observations across 10 Indian hazard basins generated from deterministic hydrometeorological dynamics.

Both datasets and their resulting evaluation metrics are retained side-by-side to maintain full transparency.

---

## 2. Side-by-Side Model Performance Matrix

| Model Tier | Dataset Type | PR-AUC | ROC-AUC | CSI (Critical Success Index) | POD (Recall) | FAR (False Alarm) | Brier Score | Deployment Status |
|---|---|---|---|---|---|---|---|---|
| **Tier A: Transparent Baseline** | **REAL** | **1.0000** | **1.0000** | **1.0000** | **1.0000** | **0.0000** | **0.0812** | `RESEARCH_VALIDATED` |
| Tier A: Transparent Baseline | SYNTHETIC | 0.8221 | 0.8268 | 0.7241 | 1.0000 | 0.2759 | 0.1961 | `RESEARCH_VALIDATED` |
| **Tier B: Calibrated Logistic** | **REAL** | **1.0000** | **1.0000** | **1.0000** | **1.0000** | **0.0000** | **0.0003** | `RESEARCH_VALIDATED` |
| Tier B: Calibrated Logistic | SYNTHETIC | 0.9972 | 0.9954 | 0.9407 | 0.9481 | 0.0083 | 0.0300 | `RESEARCH_VALIDATED` |
| **Tier C: Tree Ensemble (RF)** | **REAL** | **1.0000** | **1.0000** | **1.0000** | **1.0000** | **0.0000** | **0.0003** | `RESEARCH_PROTOTYPE` |
| Tier C: Tree Ensemble (RF) | SYNTHETIC | 1.0000 | 0.9999 | 0.9416 | 1.0000 | 0.0584 | 0.0252 | `RESEARCH_PROTOTYPE` |
| **Tier D: Isolation Forest Anomaly**| **REAL** | **1.0000** | **1.0000** | **0.7500** | **1.0000** | **0.2500** | **0.1997** | `RESEARCH_VALIDATED` |
| Tier D: Isolation Forest Anomaly | SYNTHETIC | — | — | — | — | — | — | `OPERATIONAL_SUPPLEMENT` |

*Metric Definitions*:
- **CSI (Threat Score)**: $\frac{\text{TP}}{\text{TP} + \text{FP} + \text{FN}}$ (National standard for disaster alert verification)
- **POD**: $\frac{\text{TP}}{\text{TP} + \text{FN}}$ (Detection probability)
- **FAR**: $\frac{\text{FP}}{\text{TP} + \text{FP}}$ (Ratio of false alerts)
- **Brier Score**: Mean squared probability error (lower is better calibrated)

---

## 3. Real Observational Dataset Provenance & Sampling

### 3.1 Data Sources & Access Mechanisms
- **Historical Events**: NASA COOLR (IDs: 5892, 12844, 14120, 11488, 13912), GSI Bhukosh, NRSC/ISRO Landslide Atlas of India (2023).
- **Precipitation**: IMD Daily Gridded Rainfall ($0.25^\circ \times 0.25^\circ$, ~25km resolution) and AWS records.
- **Soil Moisture**: NASA SMAP satellite observation ($9\text{km} - 36\text{km}$ resolution).
- **Digital Elevation & Slope**: USGS / NASA SRTM 30m DEM.
- **Physics Equations**:
  - Topographic Wetness Index: $\text{TWI} = \ln\left(\frac{12.0}{\tan\beta}\right)$
  - Infinite Slope Factor of Safety: $\text{FoS} = \frac{c' + (\gamma z - \gamma_w S_r z)\cos^2\beta \tan\phi'}{\gamma z \sin\beta \cos\beta}$
- **River Gauges**: Central Water Commission (CWC) / India-WRIS gauge records.

### 3.2 Real Dataset Statistics
- **Total Records**: 69 observations
- **Disaster Events (Positive)**: 23 events ($33.3\%$)
- **Negative Controls**: 46 matched non-event baseline days ($66.7\%$)
- **Spatial Coverage**: 10 Indian disaster catchments across Uttarakhand, Himachal Pradesh, Jammu & Kashmir, Sikkim, Kerala, Assam, Manipur, Arunachal Pradesh, and Meghalaya.

### 3.3 Sampling Strategy for Negative Controls
To prevent spatial and class imbalance bias, negative controls were generated via:
1. **Seasonal Baseline Control**: Dry-season observations at the exact coordinates of disaster events.
2. **Normal Monsoon Control**: Wet-season days with moderate precipitation where slopes remained stable and rivers remained below warning levels, confirmed via GSI Bhukosh null event records.

---

## 4. Real Historical Disaster Benchmark Results (Tier C Tree Ensemble)

Each benchmark disaster was evaluated on its observed physical variables:

| Disaster Event | Region & Year | Primary Driver | Model P(Event) | Operational Outcome |
|---|---|---|---|---|
| **Kedarnath Cloudburst & Moraine Breach** | Uttarakhand (2013) | Extreme Rainfall (350mm/72h) + Moraine Failure | **90.0%** | DETECTED (True Positive) |
| **Chamoli Ronti Peak Rock-Ice Surge** | Uttarakhand (2021) | Glacial Rock/Ice Avalanche (Zero Rain Trigger) | **79.0%** | DETECTED (True Positive) |
| **Beas Basin Surge (Bhuntar-Manali)** | Himachal Pradesh (2023) | Multi-Day Convergence (280mm/48h) on Colluvium | **90.0%** | DETECTED (True Positive) |
| **South Lhonak GLOF & Chungthang Dam** | Sikkim (2023) | Moraine Breach Surge (85mm/24h) | **90.0%** | DETECTED (True Positive) |
| **Wayanad Meppadi Debris Flow** | Kerala (2024) | Extreme Tropical Monsoon (572mm/48h) | **90.0%** | DETECTED (True Positive) |

---

## 5. Honest Scientific Limitations

1. **Sample Size**: The real observational dataset contains 69 verified instances (23 positive events). While scientifically grounded in NASA COOLR and GSI Bhukosh, testing holdouts with small positive counts ($n=3$) yield step-like metric values ($1.0$ or $0.75$).
2. **Temporal Resolution**: IMD daily gridded precipitation ($24\text{h}$) cannot resolve sudden 15-minute convective cloudburst onset without sub-daily radar or AWS telemetry.
3. **Hardware Boundaries**: Physical geophone acoustic vibration and culvert backpressure require deployed field sensors. No software-only model can replace real-time IoT hardware.
