# Finals Demo Readiness & Deterministic Simulator Status

**Target Demo Script:** 5-minute SIH Finals Presentation (`make finals-demo`)

## Demo Scenarios Supported in Engine
1. `NORMAL`: Quiescent baseline in mountain watershed.
2. `RAIN_ESCALATION`: Monsoon cloudburst progression ($5\text{ mm/h} \rightarrow 65\text{ mm/h}$).
3. `SOIL_SATURATION`: Prolonged rainfall leading to $S_i > 0.85$ saturation.
4. `RIVER_RISE`: Flash surge down river channel ($2.5\text{m} \rightarrow 7.5\text{m}$).
5. `SENSOR_FAILURE`: Degraded telemetry handling and uncertainty visualization.
6. `NETWORK_FAILURE`: Offline mode and local caching demonstration.

## Demo Data Integrity
- Seed: `FINALS_SEED = 2026`
- Data Mode: Strictly labeled `data_mode="DEMO"`
- Reproducibility: 100% deterministic mathematical generation

