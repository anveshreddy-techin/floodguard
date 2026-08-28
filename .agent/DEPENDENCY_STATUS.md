# Dependency Status & External Service Health

| Dependency | Purpose | Access Requirement | Prototype Strategy |
|---|---|---|---|
| **Python 3.11+** | Backend Runtime | Local / Container | Standard distribution |
| **PostgreSQL 15 + PostGIS 3.4** | Relational & Spatial Storage | Local / Container (`postgis/postgis:15-3.4`) | Containerized |
| **Node.js 20+ / Next.js 14** | Frontend Dashboard | Local / Container | App Router with TypeScript |
| **Open-Meteo API** | Real-time weather fallback | Open Internet (No Key Required) | Active when online, cached offline |
| **IMD API** | Official Indian Weather | Institutional Key + IP Whitelist | Adapter implemented; Mock/Demo fallback |
| **CWC WRIS API** | Official River Telemetry | Token Registration | Adapter implemented; Simulator fallback |
| **Bhuvan Geoportal WMS** | Indian Satellite / Flood Maps | Institutional Session | Standard OSM fallback; Bhuvan layer ready |
| **MapLibre GL JS** | Interactive Map Rendering | Open Source Client Library | Vector/Raster GeoJSON rendering |

