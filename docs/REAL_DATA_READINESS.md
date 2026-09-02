# FloodGuard AI — Real-Data & Pilot Readiness Specification

## 1. Executive Readiness Statement
FloodGuard AI is architected as an auditable, multi-tier disaster decision-support platform for hyper-local flash-flood and cloudburst monitoring across Indian hilly terrain.

## 2. Operational Mode Guardrails
- **DEMO / BENCHMARK MODE (Active by default)**:
  - All telemetry is deterministically generated from historical benchmark hindcasts (e.g. 2013 Kedarnath, 2021 Chamoli, 2024 Wayanad) or synthetic hydrological models.
  - Zero live government credentials required.
  - Public alert broadcast is **hard-blocked** by the alert governance engine.
- **REAL_PILOT MODE (Institutional Deployment)**:
  - Connects to verified IMD AWS/ARG networks, CWC hydrological river gauges, state telemetry portals, and IoT hardware gateways.
  - Requires signed institutional MoUs, API tokens, and two-operator authorization protocols.

## 3. Transparency & Non-Fabrication Guarantee
1. If an external API is offline or unconfigured, the system reports `NOT_CONFIGURED` or `UNAVAILABLE`.
2. Telemetry age is strictly audited; readings older than 60 minutes are flagged as `STALE`.
3. Predictions always reference a formal `ModelVersion` and feature cutoff timestamp to prevent retrospective contamination.
