# Data Source Governance & Formal Provider Registry

## 1. Overview
Every observation entering FloodGuard AI is traced to an entry in the `DataSource` ORM registry.

## 2. Mandatory Registry Metadata Fields
1. `id`: Immutable UUID identifier.
2. `name`: Unique name of the telemetry feed or agency.
3. `provider`: Parent organization (e.g. `IMD`, `CWC`, `Open-Meteo`, `IoT-Mesh`).
4. `source_type`: Category enum (`IMD_METEOROLOGICAL`, `CWC_HYDROLOGICAL`, `STATE_HYDROLOGY`, `SATELLITE_PRECIPITATION`, `IOT`, `USER_UPLOAD`, `HISTORICAL_ARCHIVE`).
5. `status`: Strict operational lifecycle status (`OPERATIONAL`, `DEGRADED`, `STALE`, `UNAVAILABLE`, `NOT_CONFIGURED`, `SIMULATION_ONLY`, `DISABLED`).
6. `freshness_threshold_minutes`: Maximum allowable latency before status automatically degrades to `STALE`.
7. `permitted_use` & `provenance_policy`: Data rights and sharing restrictions.

## 3. Safe Status Transition Policy
- New data sources default to `NOT_CONFIGURED`.
- Status transitions to `OPERATIONAL` only after passing a verified live `health_check()` and receiving valid non-null telemetry.
- If no data is received within `freshness_threshold_minutes`, the scheduled scan automatically demotes status to `STALE`.
