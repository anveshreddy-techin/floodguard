# FloodGuard AI — Architecture Decisions

---

## ADR-001: Modular Monolith Over Microservices

**Status:** ACCEPTED  
**Date:** 2026-08-28

**Context:** SIH prototype needs fast iteration, single-machine deployment, clear architecture.

**Decision:** Modular monolith (FastAPI) with internal module separation. Workers run in-process with APScheduler.

**Consequences:** 
- Simpler deployment (single docker-compose)
- Easier testing
- No network overhead between modules
- Can be split later if load requires

---

## ADR-002: PostgreSQL + PostGIS for All Data

**Status:** ACCEPTED  
**Date:** 2026-08-28

**Context:** Need relational + spatial + time-series in one store. No Redis/InfluxDB at prototype stage.

**Decision:** PostgreSQL 15 + PostGIS 3.4. Use TimescaleDB hypertables if time-series performance becomes bottleneck.

**Consequences:**
- Single database to manage
- PostGIS handles all spatial queries
- Simple backup/restore
- May need Timescale or partitioning for large sensor datasets

---

## ADR-003: Open-Meteo as Primary Weather Source (Prototype)

**Status:** ACCEPTED  
**Date:** 2026-08-28

**Context:** IMD API not publicly accessible. Need weather data for prototype.

**Decision:** Use Open-Meteo (open, no-key for basic) as prototype weather provider. Label data source clearly. Architecture supports IMD adapter when available.

**Consequences:**
- Demo can run without IMD credentials
- Must NOT claim data is from IMD
- Open-Meteo may not capture Indian monsoon extremes well
- Clearly labeled as DEMO/PROTOTYPE source

---

## ADR-004: Scikit-learn + XGBoost for ML (No Deep Learning)

**Status:** ACCEPTED  
**Date:** 2026-08-28

**Context:** Limited labeled data. Need interpretable, fast models.

**Decision:** Logistic regression as baseline, XGBoost as primary ML model. No neural networks (insufficient data, poor interpretability for this use case).

**Consequences:**
- Models are interpretable (SHAP support)
- Fast inference
- No GPU dependency
- Appropriate for sparse label situation

---

## ADR-005: MapLibre GL JS for Mapping (No Google Maps)

**Status:** ACCEPTED  
**Date:** 2026-08-28

**Context:** Need powerful GIS map. Google Maps has cost/licensing. Leaflet lacks vector tile support.

**Decision:** MapLibre GL JS with OpenStreetMap tiles or free raster tiles. All operational layers served from PostGIS.

**Consequences:**
- No API key required for basic raster tiles
- Vector tile support for admin boundaries
- Full control over styling
- Can integrate official Bhuvan WMS when configured

---

## ADR-006: Demo Mode is First-Class

**Status:** ACCEPTED  
**Date:** 2026-08-28

**Context:** Finals demo cannot depend on external APIs. All external providers could fail.

**Decision:** Build deterministic demo data generator as core feature, not afterthought. All demo data carries `data_mode=DEMO` and `source=deterministic_simulator`.

**Consequences:**
- Finals demo is reliable
- Never claim demo data is live
- Demo scenarios must be internally consistent and time-ordered

---

## ADR-007: Truthfulness Over Feature Completeness

**Status:** ACCEPTED (NON-NEGOTIABLE)  
**Date:** 2026-08-28

**Decision:** Any feature that cannot be implemented honestly is marked PARTIAL/PLANNED with clear documentation of what's missing. Never fabricate:
- Data connectivity
- Model accuracy
- Government partnerships
- Alert delivery confirmation
- Real-time sensor readings from disconnected devices

**Consequences:**
- SIH judges will see honest state — this is a strength
- Some features will be marked PARTIAL — this is acceptable
- System integrity is maintained

