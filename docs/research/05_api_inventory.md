# API Inventory & Ingestion Protocols

**Classification:** RESEARCHED_FACT / ENGINEERING_INFERENCE  
**Research Date:** 2026-08-28  

---

## 1. External APIs Evaluated

| API Endpoint | Provider | Protocol | Authentication | Latency | Status in Prototype | Fallback Mechanism |
|---|---|---|---|---|---|---|
| `https://api.open-meteo.com/v1/forecast` | Open-Meteo | REST / JSON | None (Free tier) | ~150ms | **ACTIVE (Default Weather)** | Cached hourly forecast / Demo |
| `https://api.imd.gov.in/` | IMD | REST / JSON | IP Whitelist + API Key | Variable | **ADAPTER READY (Restricted)** | Open-Meteo $\rightarrow$ Demo data |
| `https://indiawris.gov.in/` | CWC / NWIC | OGC WFS / REST | Token Required | ~500ms | **ADAPTER READY (Restricted)** | Deterministic River Simulator |
| `https://bhuvan-api.nrsc.gov.in/` | ISRO NRSC | OGC WMS / WMTS | Token / Session | ~300ms | **OPTIONAL (Layer Map)** | OpenStreetMap Raster Tiles |
| `https://cds.climate.copernicus.eu/api/v2` | ECMWF | REST / NetCDF | API Key | Batch/Async | **OFFLINE / RESEARCH** | Pre-computed static datasets |

---

## 2. FloodGuard Native IoT Ingestion APIs

- **`POST /api/v1/iot/readings`**: Ingests HMAC-SHA256 authenticated single sensor readings.
- **`POST /api/v1/iot/readings/batch`**: Batch ingestion of buffered edge telemetry.
- **`POST /api/v1/iot/heartbeat`**: Node battery, RSSI, and gateway health telemetry.

---

## 3. Graceful Degradation Protocol

```
   [ External API Query ]
             │
      ( HTTP 200 OK ) ──► [ Update Cache & Flag FRESH ] ──► [ Process Ingestion ]
             │ (Error / Timeout / 403)
             ▼
   [ Check Cached State ]
             │
      ( Valid Cache ) ────► [ Flag STALE + Increase Uncertainty ] ──► [ Fallback to Rule Baseline ]
             │ (No Cache / Offline)
             ▼
   [ Switch to DETERMINISTIC DEMO / SIMULATION ] ──► [ Explicit Warning in UI & Header ]
```

