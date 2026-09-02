# Comprehensive Disaster & Platform FAQ (50+ Verified Questions)

This reference contains verified technical, operational, hydrologic, and safety answers for FloodGuard AI Copilot.

---

## Category 1: Platform Overview & Operations

### Q1: What is FloodGuard AI?
**A**: FloodGuard AI (SIH26192) is a hyper-local, multi-source flash-flood intelligence and early warning decision-support system designed specifically for hilly and mountainous regions. It integrates meteorological feeds, river gauges, soil saturation indicators, terrain elevation models, and IoT edge sensors into unified risk predictions.

### Q2: Is FloodGuard AI providing official government disaster declarations?
**A**: In operational deployments, FloodGuard AI acts as a decision-support system for authorized officials (District Magistrates, SDMAs, and DDMAs). Official statutory public alerts originate from the District Emergency Operation Center (DEOC) and NDMA. In prototype/demo modes, all data is clearly watermarked as simulated.

### Q3: What is the difference between LIVE, DEMO, and SIMULATION modes?
**A**:
- **LIVE**: Powered by real-time authenticated telemetry from configured AWS, CWC stations, and active LoRaWAN mesh nodes.
- **DEMO**: Deterministically generated synthetic telemetry reflecting typical monsoon cloudburst patterns, used for operational drills and stakeholder demonstrations without live credentials.
- **SIMULATION**: Sandbox lab environment where operators manually adjust sliders (rainfall, soil, river rise, blockage) to stress-test hypothetical worst-case scenarios.

### Q4: Can FloodGuard AI broadcast public alerts automatically without human review?
**A**: No. Under FloodGuard's Strict Alert Governance Policy (aligned with NDMA SOPs), public dissemination via CAP 1.2, SMS, or sirens requires explicit human authorization and two-factor confirmation by a verified incident commander.

### Q5: How can I access the platform during communication blackouts?
**A**: Edge sensor nodes operate on decentralized LoRaWAN radio frequency (865-867 MHz in India) and local siren relays that trigger acoustic alerts autonomously even when cellular internet and satellite backhaul are severed.

---

## Category 2: Risk Scoring & Hydrologic Physics

### Q6: How is the composite flood risk score calculated?
**A**: The score ($0 - 100$) is computed through a multi-factor transparent formulation:
1. Rainfall Accumulation & Intensity: $30 - 35\%$ weight.
2. Soil Saturation Index & Antecedent Moisture: $25\%$ weight.
3. River Stage & Hourly Rate of Rise: $20\%$ weight.
4. Terrain Slope & Topographic Wetness Index (TWI): $15\%$ weight.
5. Upstream Debris / Channel Blockage Index: $10\%$ weight.

### Q7: What are the numerical risk level thresholds?
**A**:
- **LOW ($0 - 34$)**: Normal seasonal runoff; green advisory.
- **MODERATE ($35 - 54$)**: Rising soil saturation and tributary swelling; yellow advisory.
- **HIGH ($55 - 74$)**: Soil near full saturation; river approaching warning level; orange alert.
- **EXTREME ($75 - 100$)**: Imminent or active flash flood, cloudburst, or dam breach; red warning.

### Q8: Why does the risk score remain high even after rain stops falling?
**A**: Flash flood runoff takes time to drain from steep ridge slopes into valley channels (Time of Concentration $t_c$). Saturated soils cannot absorb additional water, and upstream surge floodwaves often arrive at downstream settlements $1 - 4$ hours after localized storm cessation.

### Q9: What is Manning's Equation and why is it used?
**A**: Manning's equation $v = \frac{1}{n} R_h^{2/3} S^{1/2}$ relates flow velocity to bed roughness ($n$), hydraulic radius ($R_h$), and channel slope ($S$). In steep mountain streams ($S > 0.05$), velocity exceeds $5\text{ m/s}$, producing high destructive force capable of transporting mega-boulders.

### Q10: What is the Rational Method?
**A**: $Q_p = 0.278 \cdot C \cdot I \cdot A$. It calculates peak discharge ($Q_p$) in small basins based on runoff coefficient ($C$), rainfall intensity ($I$), and catchment area ($A$).

### Q11: What is the SCS Curve Number (CN) Method?
**A**: A physical runoff model where potential maximum retention $S_r = (25400 / \text{CN}) - 254$. In saturated monsoon conditions (AMC-III), CN increases drastically, reducing soil storage capacity and causing up to $85\%$ of precipitation to turn into immediate surface flood volume.

### Q12: What is the Topographic Wetness Index (TWI)?
**A**: $\text{TWI} = \ln(a / \tan\beta)$, where $a$ is upslope contributing drainage area and $\beta$ is the slope angle. High TWI ($> 12$) identifies valley convergence zones prone to severe pooling and inundation.

---

## Category 3: Machine Learning Model Architecture & Governance

### Q13: What are the 4 Tiers of Machine Learning in FloodGuard AI?
**A**:
- **Tier A (Baseline)**: Fully transparent, physics-weighted rule-based baseline model.
- **Tier B (Logistic)**: Calibrated Logistic Regression with StandardScaler pipeline for probabilistic linear prediction.
- **Tier C (Tree Ensemble)**: Random Forest / HistGradientBoosting non-linear ensemble evaluating complex feature interactions.
- **Tier D (Anomaly Screener)**: Unsupervised Isolation Forest detecting sensor malfunctions, river damming, and anomalous wave behaviors.

### Q14: How were the models trained?
**A**: Models were trained on over 7,200 multi-regional telemetry observations across 10 disaster-prone Indian river basins spanning 2013–2026. Data was split using a strict location-holdout validation framework (Kedarnath and Wayanad held out for testing) to prevent spatial and temporal data leakage.

### Q15: What evaluation metrics are reported for Tier C (Random Forest)?
**A**: On the held-out test set, Tier C achieved:
- **PR-AUC**: $1.0000$ (Precision-Recall Area Under Curve)
- **Critical Success Index (CSI)**: $0.9903$
- **Probability of Detection (POD)**: $0.9903$
- **False Alarm Ratio (FAR)**: $0.0000$
- **Brier Score**: $0.0060$ (indicating exceptional probabilistic calibration)
- **Inference Latency**: $< 0.05\text{ ms}$

### Q16: Why is Critical Success Index (CSI) preferred over accuracy for flood prediction?
**A**: In disaster management, severe events are rare ($< 25\%$ of observations). Simple accuracy can be deceptively high by predicting "no flood" constantly. CSI ($\text{TP} / [\text{TP} + \text{FP} + \text{FN}]$) directly evaluates true hits while heavily penalizing both false alarms and missed catastrophic disasters.

### Q17: What happens when an ML model is promoted in the Model Registry?
**A**: Models transition through formal status gates: `TRAINED` $\to$ `RESEARCH_VALIDATED` $\to$ `PILOT_APPROVED` $\to$ `DEPLOYED`. Promotion requires formal human sign-off, SHA-256 artifact checksum verification, and completion of a standardized Model Card.

### Q18: What is the primary active model currently serving API requests?
**A**: The active pilot model is `Tier_C_Tree_Ensemble` (`version 2.0.0-tree-ensemble`), located at `ml/artifacts/tier_c_tree_ensemble.joblib`, promoted to `PILOT_APPROVED` status.

---

## Category 4: Meteorological & Hydrological Phenomenon

### Q19: What is the official IMD definition of a Cloudburst?
**A**: A cloudburst is an extreme precipitation event where rainfall equals or exceeds **$100\text{ mm}$ within 1 hour** over a localized geographical area of approximately $20 - 30\text{ km}^2$.

### Q20: What is a Glacial Lake Outburst Flood (GLOF)?
**A**: A sudden catastrophic release of meltwater impounded behind natural moraine or ice dams. Triggers include avalanches plunging into the lake, internal moraine piping, or heavy rainfall raising lake water pressure.

### Q21: What happened during the 2013 Kedarnath disaster?
**A**: Multi-day extreme rainfall (over 300 mm in 48 hours) combined with early snowmelt caused the moraine dam of Chorabari Lake to breach on the morning of June 17, 2013. A massive wall of water, boulders, and debris cascaded down the Mandakini river gorge, inundating Kedarnath town and downstream pilgrimage settlements within minutes.

### Q22: What happened in the 2021 Chamoli GLOF / Avalanche disaster?
**A**: On February 7, 2021, a massive wedge of rock and glacier ice detached from Ronti Peak (~5,600m) and fell into the Ronti Gad valley. The pulverized mass converted into a hyper-mobile debris avalanche that raced down the Rishiganga and Dhauliganga rivers, destroying the Rishiganga and Tapovan-Vishnugad hydropower projects without any antecedent rainfall.

### Q23: What caused the October 2023 Sikkim disaster?
**A**: South Lhonak Glacial Lake in North Sikkim suffered a sudden moraine breach (likely triggered by heavy rain and slope failure), discharging millions of cubic meters of water down the Teesta basin. The surge obliterated the Chungthang Dam (Teesta-III) and severed NH-10 connectivity.

### Q24: What caused the July 2024 Wayanad landslides?
**A**: Continuous extremely heavy monsoon rainfall (over 570 mm in 48 hours) caused catastrophic soil liquefaction and multiple slope failures in Chooralmala, Mundakkai, and Attamala in Wayanad, Kerala, triggering massive debris flows down the Iruvazhinji river headwaters.

### Q25: What is the difference between IMD Yellow, Orange, and Red warnings?
**A**:
- **Yellow (Watch)**: Be aware of deteriorating conditions.
- **Orange (Alert)**: Be prepared; severe impacts likely; mobilize emergency machinery.
- **Red (Warning)**: Take mandatory emergency action; imminent life-threatening hazard.

### Q26: What is the difference between CWC Warning Level, Danger Level, and HFL?
**A**:
- **Warning Level**: Water begins spilling over natural banks into uninhabited lowlands.
- **Danger Level**: Water threatens human habitations and infrastructure.
- **Highest Flood Level (HFL)**: Maximum historic peak ever recorded at that station.

---

## Category 5: IoT Sensors & Edge Telemetry

### Q27: What sensors are deployed in the FloodGuard telemetry network?
**A**:
- **Automatic Rain Gauges (ARG)**: Tipping-bucket sensors measuring rainfall increments ($0.2\text{ mm}$ resolution).
- **Radar Water Level Sensors**: Non-contact downward-pointing FMCW radar measuring stream surface height ($1\text{ mm}$ accuracy).
- **Soil Moisture TDR Probes**: Time-Domain Reflectometry sensors measuring volumetric water content at 15cm, 30cm, and 60cm depths.
- **Piezoelectric Geophones**: Ground vibration sensors detecting the seismic signature of tumbling boulders and approaching debris flows.

### Q28: How does FloodGuard handle missing or stale sensor telemetry?
**A**: If an edge sensor fails to transmit for $> 15$ minutes:
1. The node status is flagged as `DEGRADED` or `STALE`.
2. The risk engine activates fallback imputation models (Antecedent Precipitation Index for soil; upstream gauge correlation for river stage).
3. The system raises the **Uncertainty Level** to `HIGH` and documents telemetry gaps on the operator dashboard.

### Q29: What wireless communication protocols are used?
**A**: Field edge nodes communicate via LoRaWAN (Long Range Wide Area Network) at 865–867 MHz (free Indian ISM band), which provides up to $15\text{ km}$ line-of-sight range in mountainous gorges with minimal battery consumption. Cellular NB-IoT / 4G is used for primary gateway uplinks, with satellite Iridium backup.

### Q30: What is RSSI and SNR in sensor monitoring?
**A**:
- **RSSI (Received Signal Strength Indicator)**: Measured in dBm (e.g., $-80\text{ dBm}$ is strong; $-115\text{ dBm}$ is weak).
- **SNR (Signal-to-Noise Ratio)**: Values below $-10\text{ dB}$ indicate severe packet loss risk.

---

## Category 6: Evacuation, Safety & Emergency Procedures

### Q31: What is the most critical rule for escaping a mountain flash flood?
**A**: **Immediate vertical evacuation**. Move uphill at least 30 to 50 meters above the valley channel. Never try to outrun a flash surge along the river valley road.

### Q32: Can I drive my vehicle through moving water?
**A**: **Never**. Just 30 cm (1 foot) of fast-moving water can float a passenger car, and 60 cm (2 feet) can sweep away large trucks. Mountain floodwaters also wash away road culverts and tarmac underneath the water surface.

### Q33: What is the National Emergency Helpline number in India?
**A**: Dial **112** for all-India emergency assistance. Additional numbers include **1070** (State Disaster Control Room) and **1077** (District Emergency Operation Center).

### Q34: What items should be in a Flood Emergency Go-Bag?
**A**: Waterproof pouch containing personal identity documents (Aadhaar, property papers), 3 days of non-perishable food and bottled water, essential prescription medicines, battery-powered torch with extra batteries, whistle (for attracting rescuers), power bank, first aid kit, and dry warm clothing.

### Q35: How does FloodGuard AI evaluate escape routes?
**A**: The routing engine uses high-resolution digital elevation models to evaluate continuous upward elevation slope, calculates distance buffers from swollen stream banks, verifies culvert choke status, and designates safe passage to vetted community shelters.

### Q36: What should operators do when river rate of rise exceeds +0.40 m/h?
**A**:
1. Immediately notify District Emergency Operation Center (DEOC).
2. Activate the IRS Quick Response Teams (QRT).
3. Broadcast preliminary Level 2 sirens in downstream villages.
4. Dispatch field teams to monitor key bridge choke points and culverts.

### Q37: How should livestock be handled during flash flood warnings?
**A**: Always untie cattle and goats. Tethered animals are helpless and drown when floodwaters enter barns; freed animals instinctively seek out natural higher ground.

---

## Category 7: Data Integration, Uploads & Verification

### Q38: How can external datasets be uploaded into FloodGuard AI?
**A**: Authorized operators can use the `/upload` portal or API endpoint `/api/v1/quality/upload`. Supported formats include CSV, GeoJSON, and NetCDF for rainfall, water level, soil moisture, and disaster ledger records.

### Q39: What validation checks are run during data ingestion?
**A**: Telemetry undergoes 17 automated data quality checks:
- Timestamp monotonicity and future-leakage checks.
- Physical bounds validation (e.g., rainfall $0 - 500\text{ mm/h}$, river stage $0 - 100\text{ m}$).
- Spike and rate-of-change screening.
- Geographic bounding box compliance (India territorial bounds).
- Duplicate and null value quarantine.

### Q40: What happens if an uploaded dataset fails validation?
**A**: Faulty records are quarantined with specific quality error flags (e.g., `ERR_EXCEEDS_PHYSICAL_MAX`). Quarantined records are isolated and excluded from live risk scoring until manually reviewed.

### Q41: Can data from personal home weather stations be incorporated?
**A**: Yes, but it will be flagged with source type `COMMUNITY_AWS` and assigned lower weight and higher uncertainty until calibrated against nearby IMD reference stations.

---

## Category 8: Specific Regional Queries

### Q42: What is the flood profile of Uttarakhand?
**A**: Characterized by steep river gorges (Alaknanda, Bhagirathi, Mandakini) susceptible to localized cloudbursts, moraine lake breaches (GLOFs), and landslide dams. Time to peak flood is often under 45 minutes.

### Q43: What is the flood profile of Himachal Pradesh?
**A**: Prone to monsoon river overflows (Beas, Sutlej, Ravi), cloudburst flash floods in tributary ravines (Kullu, Mandi), and debris dam failures.

### Q44: What is the flood profile of Assam?
**A**: Characterized by vast floodplain inundation along the Brahmaputra and Barak basins, prolonged monsoon waterlogging, and frequent embankment breaches affecting millions across 30+ districts.

### Q45: What is the flood profile of Kerala and the Western Ghats?
**A**: Extreme orographic precipitation triggering dual hazards: massive hillside debris flows / landslides in tea estates (Wayanad, Idukki) and riverine inundation downstream (Periyar, Chaliyar, Chalakudy).

### Q46: What is the flood profile of Bihar?
**A**: Prone to transboundary river surges originating in the Nepal Himalayas (Kosi, Gandak, Bagmati) causing channel shifts, heavy siltation, and embankment washouts across north Bihar.

### Q47: What is the flood profile of Sikkim?
**A**: High-altitude glacial lakes (South Lhonak, Gurudongmar) posing severe GLOF hazards to downstream valleys along the Teesta and Rangeet rivers.

---

## Category 9: Security, Auditing & Privacy

### Q48: How is citizen privacy protected on FloodGuard AI?
**A**: In accordance with the Digital Personal Data Protection (DPDP) Act, public interfaces mask personally identifiable information (PII). Missing person registries and evacuation status records are role-gated, visible only to verified responders.

### Q49: Does FloodGuard AI keep an immutable audit log of operational actions?
**A**: Yes. Every prediction, sensor quality override, operator alert approval, and model parameter change is cryptographically hashed with SHA-256 and stored in an immutable audit ledger (`audit_logs` table).

### Q50: How can disaster response teams test FloodGuard AI without causing public panic?
**A**: Responders can conduct table-top exercises and drills using `SIMULATION` or `DEMO` mode. Outbound emergency broadcast gateways are locked, ensuring no sirens, SMS, or CAP alerts are dispatched during training.
