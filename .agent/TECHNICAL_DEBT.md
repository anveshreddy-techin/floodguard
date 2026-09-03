# Technical Debt Registry

| Debt ID | Subsystem | Description | Impact | Target Resolution Phase |
|---|---|---|---|---|
| **TD-001** | ML Engine | Currently uses domain-rule scoring baseline (`rule_based_baseline_v1`); trained XGBoost classifier awaiting labeled historical dataset curation. | Predictive accuracy not yet validated against independent holdout events. | Phase 12 (ML Engine) |
| **TD-002** | Background Jobs | APScheduler runs in-process with FastAPI; high-load deployment will benefit from Redis/Celery queue. | Adequate for prototype; potential concurrency limits under heavy bulk uploads. | Post-Hackathon / Phase 28 |
| **TD-003** | GIS Vectors | Administrative boundaries currently seeded from simplified demo GeoJSON geometries. | Village boundaries are illustrative; need full LGD CartoDEM vector ingest for production. | Phase 7 (GIS Platform) |

