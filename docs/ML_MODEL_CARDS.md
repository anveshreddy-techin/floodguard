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
| **Critical Success Index (CSI)** | `0.9955` | > 0.40 |
| **Probability of Detection (POD)** | `0.9989` | > 0.75 |
| **False Alarm Ratio (FAR)** | `0.0034` | < 0.35 |
| **Brier Score (Calibration)** | `0.0240` | < 0.15 |
| **Inference Latency** | `0.01 ms` | < 100 ms |

## Data & Sample Sizing
- Test Samples: `1440` (Positive: `887`, `61.6%`)
- Statistical Reliability: `RELIABLE`

## Limitations & Operational Warnings
> Evaluation on test split.
