# Model Card: Tier C Random Forest Ensemble

## Overview
- **Version**: `2.0.0-tree-ensemble`
- **Model Type**: `RANDOM_FOREST`
- **Target Hazard**: `FLASH_FLOOD_30MIN`
- **Region**: `Pan-India Hilly Basins`

## Evaluation Metrics (Out-of-Time Holdout)
| Metric | Value | Target Guidance |
|---|---|---|
| **PR-AUC** | `1.0000` | > 0.70 |
| **Critical Success Index (CSI)** | `1.0000` | > 0.40 |
| **Probability of Detection (POD)** | `1.0000` | > 0.75 |
| **False Alarm Ratio (FAR)** | `0.0000` | < 0.35 |
| **Brier Score (Calibration)** | `0.0003` | < 0.15 |
| **Inference Latency** | `0.65 ms` | < 100 ms |

## Data & Sample Sizing
- Test Samples: `9` (Positive: `3`, `33.33%`)
- Statistical Reliability: `PRELIMINARY / DEMO`

## Limitations & Operational Warnings
> Evaluation on test split. High uncertainty: small positive sample count (n=3 < 15).
