# IMD & CWC Integration Architecture

## 1. India Meteorological Department (IMD) Integration
- **Adapter**: `apps/api/src/providers/imd_adapter.py`
- **Supported Products**:
  - Automated Weather Station (AWS) 15-minute observations.
  - Automated Rain Gauge (ARG) hourly rainfall.
  - District-level Quantitative Precipitation Forecasts (QPF).
  - Doppler Weather Radar (DWR) composite reflectivity.
- **Security & Authorization**:
  - Configured via `IMD_API_KEY` and `IMD_STATION_NETWORK_ID`.
  - When credentials are absent, adapter reports `NOT_CONFIGURED`.

## 2. Central Water Commission (CWC) Integration
- **Adapter**: `apps/api/src/providers/cwc_adapter.py`
- **Supported Products**:
  - River water level gauges (meters above MSL).
  - Rate-of-rise telemetry ($\Delta h / \Delta t$).
  - Official Warning Level (WL) and Danger Level (DL) thresholds.
  - Highest Flood Level (HFL) hindcast baselines.
