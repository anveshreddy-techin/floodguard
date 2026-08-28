# FloodGuard AI — Architecture

**Version:** 0.1.0-foundation  
**Status:** IN_PROGRESS

---

## System Overview

FloodGuard AI is a **modular monolith with background workers** — chosen for:
- Maintainability over microservice complexity
- Fast iteration for prototype → pilot
- Clear separation of concerns without network overhead

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  Next.js 14 | React | TypeScript | Tailwind          │
│  MapLibre GL | TanStack Query | Recharts             │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP/REST + WebSocket
┌─────────────────────▼───────────────────────────────┐
│                 API LAYER                            │
│  FastAPI | Python 3.11+ | Pydantic v2                │
│  SQLAlchemy 2 | Alembic | JWT Auth                   │
└──────┬──────────────┬──────────────┬────────────────┘
       │              │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌───▼───────────────┐
│   DATABASE  │ │  ML ENGINE │ │  BACKGROUND JOBS  │
│  PostgreSQL │ │  scikit-  │ │  Data ingestion   │
│  + PostGIS  │ │  learn /  │ │  Feature compute  │
│             │ │  XGBoost  │ │  Risk scoring     │
└─────────────┘ └────────────┘ └───────────────────┘
```

---

## Layer Architecture

### 1. Data Ingestion Layer

**Purpose:** Acquire data from external sources, normalize, validate, store.

**Sources (by priority):**
1. IMD rainfall (gridded/AWS/ARG) — REGISTRATION_REQUIRED
2. CWC river levels — REGISTRATION_REQUIRED
3. IMD weather bulletins — PARTIAL_PUBLIC_ACCESS
4. Open-Meteo API — AVAILABLE (no key for basic use)
5. NOAA GFS QPF — AVAILABLE (public)
6. User uploads (CSV/JSON/GeoJSON) — AVAILABLE
7. IoT sensors (simulated or real) — AVAILABLE (simulator)

**Adapter pattern:** Each source has an adapter implementing `DataSourceAdapter`:
```python
class DataSourceAdapter(Protocol):
    source_id: str
    async def fetch(self, params: FetchParams) -> RawDataBatch
    async def health_check(self) -> ProviderHealth
```

### 2. Data Quality Layer

**Pipeline:**
```
RAW_RECORD
  → format_check()
  → range_check()
  → coordinate_check()
  → timestamp_check()
  → duplicate_check()
  → unit_check()
  → location_lookup()
  → quality_flag assignment
  → VALID | ACCEPTED_WITH_WARNING | QUARANTINED | REJECTED
```

### 3. Feature Engineering Layer

**Feature groups:**

| Group | Features | Source |
|-------|----------|--------|
| Rainfall | 1h/3h/6h/12h/24h/48h/72h intensity, accumulation, intensity gradient | IMD, AWS, upload |
| Antecedent | 7-day/14-day/30-day rainfall, API, AWC | IMD historical |
| Soil | Saturation index, field capacity ratio, drainage class | MODIS, computed |
| Terrain | Slope, aspect, elevation, flow accumulation, TRI, TWI, curvature | SRTM/ALOS DEM |
| River | Current level, rate of rise, anomaly score, bank proximity | CWC, sensors |
| Historical | susceptibility_score, event_frequency, event_magnitude | NRSC/GSI, historical |
| Sensor | Coverage score, outage count, freshness, agreement | IoT |

### 4. Risk Engine

**Hybrid approach:** Domain-rule scoring + ML override + uncertainty propagation

```
RainfallRisk        → weight × score
SoilSaturationRisk  → weight × score
TerrainRisk         → static × multiplier
RiverRisk           → weight × score
HistoricalRisk      → prior × modifier
SensorEvidence      → confidence modifier
DataQuality         → uncertainty modifier
─────────────────────────────────────────
COMPOSITE_RISK_SCORE (0–100)
→ RISK_LEVEL: LOW | MODERATE | HIGH | EXTREME
→ CONFIDENCE: HIGH | MEDIUM | LOW | INSUFFICIENT_DATA
→ UNCERTAINTY: HIGH | MEDIUM | LOW
→ CONTRIBUTORS: sorted list with weights
→ EVIDENCE: list of supporting observations
```

**Thresholds:** Domain-informed, not claimed as official IMD thresholds unless verified.

### 5. ML Layer

**Model selection (by data availability):**
- Sufficient labels → XGBoost classifier (flash flood / no flash flood)
- Insufficient labels → Logistic regression with domain features
- No labels → Rule-based risk scoring only

**Leakage prevention:**
- Feature snapshot captured BEFORE event outcome known
- Time-aware train/test split (train pre-2022, validate 2022–2023, test 2023+)
- No spatial leakage (train/test split by watershed, not random)

### 6. Uncertainty Engine

**Uncertainty sources:**
- Data staleness (age > threshold → uncertainty++)
- Source disagreement (multiple sources disagree → uncertainty++)
- Missing features (required features missing → uncertainty++)
- Out-of-distribution inputs (rare event → uncertainty++)
- Sensor outage (insufficient coverage → uncertainty++)

**Output:** `HIGH | MEDIUM | LOW | INSUFFICIENT_DATA`

### 7. Cascade Engine

**Upstream → Downstream chain:**
```
UPSTREAM_SIGNAL (rainfall/river anomaly)
  → watershed routing
  → intermediate_points
  → downstream_locations
  → exposure_assessment
  → response_trigger
```

Each link has: evidence, confidence, timestamp, data_age.

### 8. Alert Engine

**Lifecycle:** DRAFT → ACTIVE → ACKNOWLEDGED → ESCALATED → RESOLVED → ARCHIVED

**Controls:**
- Debounce (minimum time between repeated alerts for same area)
- Hysteresis (risk must drop below threshold to deactivate, not just touch threshold)
- Deduplication (same area + same hazard → merge)
- Expiry (auto-expire stale alerts)
- Operator override (manual RESOLVED with audit trail)

### 9. GIS Platform

**PostGIS:** All spatial queries, spatial joins, watershed assignments.

**Layers:**
```
administrative  → district, block, village polygons
watershed       → hydrological catchment boundaries
river_network   → centerlines, flow direction
terrain         → DEM, slope, TWI, TRI
risk_zones      → computed risk areas
sensor_points   → IoT device locations
alert_areas     → active alert polygons
historical      → past event locations
infrastructure  → roads, bridges, hospitals, towers
shelters        → shelter points with capacity
```

### 10. Incident Command System

**Lifecycle:** DETECTED → TRIAGED → UNDER_INVESTIGATION → VERIFIED → ACTIVE_RESPONSE → CONTAINED → RECOVERY → CLOSED → ARCHIVED

---

## Technology Stack

### Backend
- Python 3.11+
- FastAPI (async)
- Pydantic v2 (strict validation)
- SQLAlchemy 2.0 (async sessions)
- Alembic (migrations)
- APScheduler (background jobs)
- HTTPX (async HTTP client)
- JWT (python-jose)
- bcrypt (password hashing)

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript (strict mode)
- Tailwind CSS
- MapLibre GL JS (maps)
- TanStack Query v5 (data fetching)
- Recharts (charts)
- Zod (validation)
- shadcn/ui (accessible primitives)

### Database
- PostgreSQL 15+
- PostGIS 3.4
- pgcrypto (device credentials)

### ML
- scikit-learn 1.4+
- XGBoost
- pandas 2.x
- NumPy 1.26+
- GeoPandas
- Shapely 2.x
- SHAP (explainability)
- joblib (model serialization)

### Infrastructure
- Docker + Docker Compose
- GitHub Actions (CI/CD)

---

## Data Flow Diagram

```
EXTERNAL SOURCES          INGESTION           QUALITY
────────────────          ─────────           ───────
IMD Rainfall  ──────────► Adapter ──────────► Validator
CWC River     ──────────► Adapter ──────────► Flag
Open-Meteo    ──────────► Adapter ──────────► Normalize
IoT Sensors   ──────────► MQTT/HTTP ────────► Store
User Upload   ──────────► Upload API ────────► Review
                                │
                         ┌──────▼──────┐
                         │  PostgreSQL │
                         │  + PostGIS  │
                         └──────┬──────┘
                                │
                    ┌───────────▼───────────┐
                    │   FEATURE ENGINEERING  │
                    │  rainfall / soil /     │
                    │  terrain / river /     │
                    │  historical            │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │     RISK ENGINE        │
                    │  rules + ML + cascade  │
                    │  + uncertainty         │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │     ALERT ENGINE       │
                    │  debounce/hysteresis   │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │    INCIDENT ENGINE     │
                    │  response / recovery   │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │       AUDIT LOG        │
                    │  every action logged   │
                    └────────────────────────┘
```

---

## API Design

Base: `/api/v1/`

All responses:
```json
{
  "data": {...},
  "meta": {
    "data_mode": "LIVE|HISTORICAL|DEMO|SIMULATION",
    "freshness": "FRESH|STALE|DEGRADED|UNAVAILABLE",
    "generated_at": "ISO8601",
    "trace_id": "uuid"
  },
  "errors": []
}
```

Error response:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "...",
    "details": [],
    "trace_id": "uuid"
  }
}
```

---

## Security Architecture

- JWT (Bearer) — 24h access token, 7-day refresh
- RBAC: ADMIN | AUTHORITY_OPERATOR | ANALYST | FIELD_OFFICER | RESEARCHER | VIEWER
- Rate limiting: per-endpoint, per-user
- CORS: restricted to configured frontend origin
- Upload: type check, size limit (50MB), virus scan (ClamAV when available)
- IoT: device-scoped HMAC credentials, replay protection via sequence numbers
- Audit: every state-changing action logged with actor, role, before/after

---

## Deployment Architecture (Phase 28)

```
docker-compose.yml
├── web (Next.js, port 3000)
├── api (FastAPI, port 8000)
├── db (PostgreSQL + PostGIS, port 5432)
└── worker (APScheduler background jobs)
```

