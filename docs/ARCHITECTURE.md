# FloodGuard AI System Architecture

## Design Pattern: Modular Monolith + Asynchronous Workers
Chosen to optimize performance, maintainability, and rapid edge deployment without distributed microservice overhead.

```
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS 14 FRONTEND                      │
│   MapLibre GIS | Upstream Cascade | Grounded Copilot        │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / WebSocket
┌──────────────────────────────▼──────────────────────────────┐
│                    FASTAPI BACKEND API                      │
│   Auth / RBAC | Risk Engine | Ingestion | IoT Simulator     │
└───────┬──────────────────────┬──────────────────────┬───────┘
        │                      │                      │
┌───────▼──────────────┐ ┌─────▼──────────────┐ ┌─────▼──────────────┐
│  POSTGRESQL+POSTGIS  │ │ HYBRID RISK ENGINE │ │ APSCHEDULER WORKER │
│  Spatial Vectors     │ │ Multi-Source Rules │ │ Background Ingest  │
└──────────────────────┘ └────────────────────┘ └────────────────────┘
```
