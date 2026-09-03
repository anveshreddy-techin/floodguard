# SIH26192 — Flash Flood Prediction System for Hilly Regions (Ministry of Home Affairs / NDRF)

## 1. Official Problem Statement

- **Problem Statement ID**: SIH26192
- **Organization**: Ministry of Home Affairs (MHA)
- **Department**: National Disaster Response Force (NDRF), DM Division
- **Theme**: Disaster Management
- **Title**: Flash Flood Prediction System for Hilly Regions using Multi-Source Data

### Background

Hilly states in India are highly vulnerable to landslides and flash floods, which often occur with very short warning times. These sudden events result in significant loss of lives and property, and current early warning mechanisms are inadequate for hyper-local prediction and timely evacuation.

### Expected Solution

A comprehensive flash flood prediction system that:
- Integrates rainfall, soil moisture, slope stability, and historical disaster data
- Utilizes IoT sensors for real-time telemetry
- Provides hyper-local forecasts at the village or ward level
- Generates sufficient lead time (30–180 minutes) for NDRF evacuation deployment

---

## 2. The Five Required Data Sources (NDRF Multi-Source Pillars)

### Source 1: Rainfall Data (IMD AWS / GPM / NWP)

- **IMD Automatic Weather Stations (AWS)**: 1,400+ stations, 5-minute reporting cadence
- **TRMM/GPM Satellite**: NASA Global Precipitation Measurement, 0.1° gridded, 30-min latency
- **NWP (Numerical Weather Prediction)**: IMD WRF model, 3-km resolution for Western Ghats and Himalayas
- **Key Features**: `rainfall_3h_mm`, `rainfall_24h_mm`, `rainfall_peak_intensity_mmph`, `antecedent_rainfall_7d_mm`
- **Threshold**: Cloudburst defined as >100 mm/h sustained for ≥30 minutes (IMD definition)

### Source 2: Soil Moisture Sensors (TDR / API / MODIS)

- **Capacitive TDR Probes**: In-situ measurement at 15, 30, 60 cm depths
- **Antecedent Precipitation Index (API)**: 7-day weighted cumulative rainfall proxy for soil saturation
- **MODIS SMAP**: NASA satellite soil moisture (L3 product, 9-km resolution)
- **Key Features**: `soil_moisture_volumetric_pct`, `soil_saturation_index` (0.0–1.0)
- **Critical Threshold**: Saturation index > 0.85 indicates near-zero additional infiltration capacity

### Source 3: Slope Stability Models (Infinite Slope FoS + TWI)

- **Infinite Slope Factor of Safety (FoS)**:
  ```
  FoS = (c' + (γz - γw·hw)·cos²β·tanφ') / (γz·sinβ·cosβ)
  ```
  Where:
  - c' = effective cohesion (≈8 kPa for colluvium)
  - γ = bulk unit weight (≈19 kN/m³)
  - γw = unit weight of water (9.81 kN/m³)
  - z = failure plane depth (≈2 m)
  - hw = piezometric head (= saturation_index × z)
  - β = slope angle (degrees converted to radians)
  - φ' = effective friction angle (≈32° for colluvium)
- **Failure Criterion**: FoS < 1.0 → slope failure imminent; 1.0–1.3 → near critical; > 1.3 → stable
- **Topographic Wetness Index (TWI)**: `TWI = ln(a / tanβ)`, where a = upslope contributing area per unit contour width. High TWI → saturation accumulation zone
- **Key Features**: `factor_of_safety_fos`, `topographic_wetness_index`, `slope_degrees`

### Source 4: Historical Landslide Inventories (GSI / NRSC)

- **GSI Bhukosh Portal**: Geological Survey of India's landslide inventory with susceptibility zonation maps
- **NRSC National Landslide Atlas**: ISRO's satellite-derived atlas covering all Himalayan and Western Ghats states
- **NIDM/NDMA Historical Event Registry**: Casualties, property damage, return periods
- **Key Events Used for Calibration**:
  - 2013 Kedarnath: Multi-day cloudburst, Chorabari moraine breach, 5,000+ fatalities
  - 2021 Chamoli GLOF: Rock-ice avalanche on Ronti Peak, instant Rishiganga+Dhauliganga surge
  - 2024 Wayanad: July 30, 3-day monsoon saturation, Mundakkai+Chooralmala multi-slope failure, 400+ deaths
- **Key Features**: `landslide_susceptibility_index` (0–1), `historical_landslides_count`

### Source 5: Real-Time IoT Inputs (Radar + Geophone + Culvert)

- **Tipping Bucket AWS**: High-frequency rainfall at catchment head
- **TDR Soil Probes**: Real-time soil moisture at 3 depths
- **MEMS Geophones**: Acoustic vibration sensors detecting debris flow onset (threshold: >55 dB sustained)
- **Ultrasonic River Gauges**: Stage level + rate of rise with sub-minute reporting
- **Culvert Pressure Sensors**: Backpressure ratio indicating blockage by debris
- **Communication**: LoRaWAN / NB-IoT gateway → MQTT broker → API ingest
- **Key Features**: `geophone_debris_vibration_db`, `culvert_backpressure_ratio`, `river_rate_of_rise_mph`

---

## 3. Physics Equations and Formulas

### Infinite Slope Factor of Safety
```
FoS = (c' + (γz - γw·hw)·cos²β·tanφ') / (γz·sinβ·cosβ)
```
Failure when FoS < 1.0. Near-critical when 1.0 ≤ FoS < 1.3. Stable when FoS ≥ 1.3.

### Topographic Wetness Index
```
TWI = ln(a / tanβ)
```
Higher TWI indicates zones where water accumulates, increasing saturation and instability risk.

### Actionable Lead Time Formula
```
T_lead = max(15, min(180, D_choke / V_surge × 60 − T_dissem))
```
- D_choke = gap between current river level and danger level (meters)
- V_surge = river stage rise rate (m/h)
- T_dissem = 12 minutes (broadcast dissemination delay)
- Minimum actionable lead time for NDRF deployment: 30 minutes

### Composite 5-Source Risk Score (0–100)
```
R1 = min(100, peak_intensity × 0.8 + (20 if cloudburst))
R2 = min(100, saturation × 90)
R3 = min(100, max(0, (2 − FoS) / 1.5 × 100))
R4 = min(100, susceptibility × 100)
R5 = min(100, rise_rate × 60 + max(0, geophone − 35) × 1.2 + max(0, culvert − 0.8) × 30)
Score = min(100, (0.25·R1 + 0.20·R2 + 0.20·R3 + 0.15·R4 + 0.20·R5) × slope_amplifier)
```

---

## 4. Alert Stages (NDRF DM Division Protocol)

| Stage | Score Range | Meaning | NDRF Operational Directive |
|-------|-----------|---------|---------------------------|
| GREEN | < 35 | No Immediate Threat | Monitoring continues. Pre-position light QRT. |
| YELLOW | 35–55 | Watch Advisory | Alert local SDRFs. Village-level pre-evacuation briefing. |
| ORANGE | 55–75 | High Probability Warning | Mobilize NDRF Battalion QRT. Issue official evacuation advisory for low-lying wards. |
| RED | ≥ 75 | Imminent Flash Flood Event | Immediate compulsory evacuation. Deploy full NDRF Battalion. Isolate watercourse. |

---

## 5. ML Model Architecture (FloodGuard 4-Tier System)

### Training Summary
- **Dataset**: 7,200 synthetic physics-informed observations across 10 Indian hilly basins
- **Feature Schema**: 25 features across 5 NDRF multi-source pillars
- **Split**: Location holdout — UK_KEDARNATH + KL_WAYANAD held out for testing
- **Training Basins**: UK_CHAMOLI, HP_KULLU, SK_TEESTA, AS_CACHAR, MH_MAHABALESHWAR, BR_KOSI, OR_MAHANADI, JK_JHELUM

### Model Results

| Tier | Model | PR-AUC | ROC-AUC | CSI | POD | FAR | Brier | Status |
|------|-------|--------|---------|-----|-----|-----|-------|--------|
| A | Transparent Weighted Baseline | 0.8221 | 0.8268 | 0.7241 | 1.0000 | 0.2759 | 0.1961 | OPERATIONAL |
| B | Calibrated Logistic Regression | 0.9972 | 0.9954 | 0.9407 | 0.9481 | 0.0083 | 0.0300 | OPERATIONAL |
| C | Random Forest Ensemble | 1.0000 | 0.9999 | 0.9416 | 1.0000 | 0.0584 | 0.0252 | PILOT_APPROVED |
| D | Isolation Forest Anomaly Screener | — | — | — | — | — | — | SUPPLEMENT |

### Metric Definitions
- **CSI (Critical Success Index)**: TP/(TP+FP+FN) — Primary NDRF warning quality metric
- **POD (Probability of Detection)**: TP/(TP+FN) — Must be maximized: no missed events
- **FAR (False Alarm Ratio)**: FP/(TP+FP) — Must be minimized: avoids warning fatigue
- **PR-AUC**: Precision-Recall Area Under Curve — robust to class imbalance

Tier C (PILOT_APPROVED) achieves zero missed events (POD=1.0) on held-out Kedarnath and Wayanad basins.

---

## 6. Historical Events and Lessons

### Kedarnath 2013
- Multi-day extreme rainfall (325 mm in 24h over Mandakini catchment)
- Chorabari moraine lake breach caused catastrophic GLOF
- Mandakini and Alaknanda surged simultaneously
- Over 5,000 fatalities, Kedarnath temple area devastated
- **Lesson**: Multi-day antecedent rainfall monitoring is critical; moraine lake inventories needed

### Chamoli 2021 (Rishiganga)
- February 7: Rock-ice avalanche from Ronti Peak (5,600m)
- Instant GLOF surge down Rishiganga → Dhauliganga valley
- Tapovan Vishnugad barrage destroyed; 204+ fatalities
- **Lesson**: Non-rainfall triggers (glacial, seismic) require IoT acoustic monitoring

### Wayanad 2024
- July 30: After 3 consecutive days of heavy monsoon rainfall
- Mundakkai and Chooralmala slope failures in Meenangadi panchayat
- Complete burial of settlements; 400+ deaths
- **Lesson**: Soil saturation tracking (Source 2) combined with slope stability (Source 3) could have provided 2–4 hour lead time

---

## 7. NDRF Operational SOPs

### Quick Reaction Team (QRT)
- 45 personnel, 5 motorboats, 2 inflatable rafts
- Deployed on ORANGE alert stage
- Notice-to-move: 30 minutes

### Full Battalion Deployment
- 1,149 personnel per battalion
- Deployed on RED alert stage
- Notice-to-move: 2 hours

### NDRF Battalions for Hilly Regions
| Battalion | Base | Coverage Area |
|-----------|------|---------------|
| 8th Bn NDRF | Ghaziabad | Uttarakhand & Himachal Pradesh |
| 7th Bn NDRF | Bathinda | Jammu & Kashmir & Punjab |
| 1st Bn NDRF | Guwahati | Northeast India (Sikkim, Assam) |
| 6th Bn NDRF | Arakkonam | Kerala & Tamil Nadu |

---

## 8. IoT Sensor Specification

| Sensor | Measurement | Range | Precision | Protocol |
|--------|------------|-------|-----------|----------|
| Tipping Bucket AWS | Rainfall intensity | 0–500 mm/h | ±0.2 mm | NB-IoT |
| TDR Probe (3-depth) | Volumetric soil moisture | 0–100% | ±2% | LoRaWAN |
| MEMS Geophone | Debris vibration | 20–120 dB | ±1 dB | LoRaWAN |
| Ultrasonic Level | River stage | 0–15 m | ±1 cm | NB-IoT |
| Pressure Transducer | Culvert backpressure | 0–5 bar | ±0.01 bar | LoRaWAN |

All sensors report via LoRaWAN/NB-IoT gateway → MQTT broker → FloodGuard API ingest pipeline.
