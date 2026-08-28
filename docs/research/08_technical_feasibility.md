# Technical Feasibility & Architecture Sizing

**Classification:** ENGINEERING_INFERENCE  
**Research Date:** 2026-08-28  

---

## 1. Feasibility Assessment by Subsystem

| Subsystem | Approach | Feasibility | Key Constraint | Mitigation |
|---|---|---|---|---|
| **GIS & Spatial Operations** | PostGIS (ST_Contains, ST_DWithin, ST_Buffer) | **HIGH** | Spatial join latency on complex micro-watershed boundaries | Pre-compute spatial hierarchy (village $\rightarrow$ watershed mapping); use spatial R-Tree indices |
| **Rule-Based Risk Scoring** | Python / NumPy modular scoring engine | **VERY HIGH** | Deterministic compute time $< 5\text{ms}$ per location | In-memory execution, cached feature snapshots |
| **Machine Learning Inference** | Scikit-Learn / XGBoost pipeline | **HIGH** | Inference latency $< 20\text{ms}$ | Serialized `.joblib` model artifacts, no GPU requirement |
| **Real-Time Map Visualization** | MapLibre GL JS + GeoJSON layers | **HIGH** | Browser rendering of $> 10,000$ vector nodes | Vector tile pyramids & client-side geo-clustering |
| **Data Upload & Validation** | Pandas / GeoPandas streaming parser | **HIGH** | Memory usage on multi-MB CSVs | Streaming chunk validation + file size hard limits ($50\text{MB}$) |
| **IoT Telemetry Ingestion** | FastAPI async endpoints + HMAC | **HIGH** | Throughput $> 1,000\text{ req/sec}$ | AsyncPG connection pooling, non-blocking DB writes |

---

## 2. Resource Footprint
- **Prototype Footprint:** Can execute smoothly on standard developer laptops and modest cloud VMs ($2\text{ vCPU}, 4\text{GB RAM}, 20\text{GB SSD}$).
- **Zero Cloud Lock-in:** 100% Dockerized open-source stack (FastAPI + PostgreSQL/PostGIS + Next.js).

