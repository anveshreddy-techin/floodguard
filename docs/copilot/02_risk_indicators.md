# Hydrological Risk Indicators & Scoring

## Core Risk Factors
FloodGuard assesses hazard levels using a weighted multi-factor framework:

### 1. Rainfall Intensity & Accumulation (30% Weight)
- **1-Hour Peak Intensity**: > 30 mm/h triggers High Risk; > 50 mm/h triggers Extreme Flash-Flood Watch.
- **24-Hour Accumulation**: > 115 mm (Heavy), > 200 mm (Extremely Heavy).
- **Antecedent 7-Day Precipitation**: Measures pre-conditioning moisture load.

### 2. Catchment Soil Saturation (25% Weight)
- **Saturation Index (0.0 to 1.0)**:
  - `< 0.45`: Normal infiltration capacity.
  - `0.45 - 0.70`: Moderate saturation.
  - `> 0.80`: Critical saturation. Nearly 85%+ of rainfall converts directly into surface runoff.

### 3. River Level & Rate of Rise (20% Weight)
- **Gauge Stage vs CWC Danger Thresholds**.
- **Rate of Rise**: > 0.30 m/h indicates rapid upstream hydrograph surge.

### 4. Terrain Geomorphology (15% Weight)
- **Mean Slope Angle**: Steep ravines (> 25°) experience rapid overland flow concentration.
- **Topographic Wetness Index (TWI)**: Identifies colluvial hollows and choke points.

## Hazard Threshold Classifications
- **0 - 34**: LOW (Standard Watch)
- **35 - 54**: MODERATE (Advisory Notice)
- **55 - 74**: HIGH (Warning & Evacuation Preparedness)
- **75 - 100**: EXTREME (Immediate Shelter Dispatch)
