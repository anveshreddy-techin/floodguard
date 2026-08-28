# IoT & Sensor Telemetry Protocol

## Ingestion Endpoints
- `POST /api/v1/iot/readings`: Authenticated telemetry with HMAC-SHA256 signature and monotonic sequence number validation (replay attack defense).
- `POST /api/v1/iot/heartbeat`: Edge battery and signal RSSI health reporting.

## Deterministic Simulator
- Multi-scenario generator (`NORMAL`, `RAIN_ESCALATION`, `SOIL_SATURATION`, `RIVER_RISE`, `SENSOR_FAILURE`, `NETWORK_FAILURE`).
- Uses seed `2026` for deterministic, zero-dependency demonstrations.
