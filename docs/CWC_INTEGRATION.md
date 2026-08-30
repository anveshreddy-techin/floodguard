# CWC (Central Water Commission) Integration Architecture

## 1. Scope & Telemetry Products
The CWC adapter (`apps/api/src/providers/cwc_adapter.py`) integrates with India-WRIS (Water Resources Information System) and the National Water Data Portal:
- **River Gauge Water Levels**: Stage observations ($m$), rate of rise ($m/h$), discharge ($m^3/s$).
- **Official Threshold Levels**: Warning Level, Danger Level, Highest Flood Level (HFL).
- **Reservoir Telemetry**: Full Reservoir Level (FRL), live storage %, inflow/outflow balance, gate opening status.

## 2. Institutional Boundary & Threshold Authority
- **Endpoint**: `https://indiawris.gov.in/wrisapi`
- **Configuration**: `RIVER_API_KEY` in `.env`.
- **Threshold Integrity**: Warning and Danger levels are official government parameters defined by CWC. FloodGuard AI **never invents or alters official CWC threshold figures**. All FloodGuard AI predictive outputs are explicitly separated from official statutory thresholds.
- When unconfigured, the adapter returns `status: "NOT_CONFIGURED"` and falls back to deterministic hydrological demo models with `data_mode: "DEMO"`.
