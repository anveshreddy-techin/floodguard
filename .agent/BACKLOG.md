# FloodGuard AI — Backlog

**Last Updated:** 2026-08-28

---

## Sprint 1 (Current): Foundation

### IN_PROGRESS
- [x] Create repository structure
- [x] Write project control files
- [/] Official SIH verification (research agent active)
- [/] Research ecosystem (research agent active)
- [ ] Backend: FastAPI skeleton + health endpoints
- [ ] Backend: PostgreSQL + PostGIS migrations
- [ ] Backend: Authentication (JWT + RBAC)
- [ ] Frontend: Next.js scaffold + design system
- [ ] Frontend: Command center shell
- [ ] Demo data: seed scripts

### NEXT
- [ ] Data ingestion adapters (Open-Meteo, demo)
- [ ] Risk engine baseline (rule-based)
- [ ] GIS layer loading (admin boundaries)
- [ ] Map component (MapLibre GL)
- [ ] Alert engine
- [ ] Upload pipeline

---

## P0 Backlog

| ID | Item | Priority | Effort |
|----|------|----------|--------|
| P0-01 | Rainfall ingestion (Open-Meteo + demo) | HIGH | M |
| P0-02 | Soil saturation feature engineering | HIGH | M |
| P0-03 | Terrain static layer (SRTM) | HIGH | L |
| P0-04 | Historical data seed | HIGH | M |
| P0-05 | Hybrid risk engine (rule-based v1) | CRITICAL | L |
| P0-06 | GIS: village/watershed layers | HIGH | M |
| P0-07 | Baseline ML model (logistic regression) | HIGH | L |
| P0-08 | SHAP explainability | HIGH | S |
| P0-09 | Uncertainty engine v1 | HIGH | S |
| P0-10 | Alert engine + lifecycle | CRITICAL | M |
| P0-11 | Core incident workflow | HIGH | M |
| P0-12 | Audit log (all mutations) | HIGH | M |
| P0-13 | Demo data (deterministic) | HIGH | M |
| P0-14 | Data upload + validation pipeline | HIGH | M |
| P0-15 | Data provenance tracking | HIGH | S |

## P1 Backlog

| ID | Item | Priority | Effort |
|----|------|----------|--------|
| P1-01 | IoT simulator (deterministic) | MEDIUM | M |
| P1-02 | IoT ingestion endpoint | MEDIUM | S |
| P1-03 | Upstream→downstream cascade engine | MEDIUM | M |
| P1-04 | Historical event replay | MEDIUM | M |
| P1-05 | Scenario simulation engine | MEDIUM | M |
| P1-06 | Shelter/evacuation data | MEDIUM | S |
| P1-07 | Route analysis (blocked/candidate) | MEDIUM | M |
| P1-08 | Infrastructure exposure engine | MEDIUM | M |
| P1-09 | Incident command full workflow | MEDIUM | L |

## P2 Backlog

| ID | Item | Priority | Effort |
|----|------|----------|--------|
| P2-01 | FloodGuard Copilot (grounded Q&A) | LOW | L |
| P2-02 | Advanced MLOps (drift detection) | LOW | L |
| P2-03 | Source agreement engine | LOW | M |
| P2-04 | Cross-border architecture | LOW | M |
| P2-05 | Advanced data gap intelligence | LOW | M |

---

## Technical Debt

- [ ] Replace in-memory cache with Redis (when scale requires it)
- [ ] Add proper async background job queue (when load requires it)
- [ ] Add spatial clustering for high-density sensor areas
- [ ] Model retraining pipeline (requires labeled data)

