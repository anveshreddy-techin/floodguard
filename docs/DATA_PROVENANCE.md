# Data Provenance & Evidence Tracking

Every operational datum and prediction in FloodGuard AI carries immutable provenance metadata:
- `data_mode`: `LIVE` | `HISTORICAL` | `UPLOAD` | `DEMO` | `SIMULATION` | `REPLAY`
- `evidence_state`: `OBSERVED` | `REPORTED` | `MODEL_INFERRED` | `SIMULATED` | `UNAVAILABLE` | `UNKNOWN`
- `freshness`: `FRESH` | `STALE` | `DEGRADED` | `UNAVAILABLE`
- `source`: Attribution string (e.g. `open_meteo`, `iot_device:demo-aws-001`)
- `trace_id`: UUID for request and event lifecycle auditability.
