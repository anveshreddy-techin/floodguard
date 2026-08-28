# Data Sources & Ingestion Protocol Matrix

| Source | Provider | Variable | Mode | Fallback |
|---|---|---|---|---|
| **Open-Meteo API** | Open-Meteo | Hourly Precipitation, Soil Temperature, Humidity | LIVE | Cached / Deterministic Demo |
| **IMD API** | IMD Pune | AWS/ARG Rain Gauge Telemetry | REGISTRATION_REQUIRED | Open-Meteo / Demo |
| **CWC WRIS** | Central Water Commission | River Level ($H$), Discharge ($Q$) | REGISTRATION_REQUIRED | Deterministic River Simulator |
| **CartoDEM / SRTM** | ISRO Bhuvan / NASA USGS | 30m Digital Elevation Model | AVAILABLE | Static GeoJSON Grid |
| **IoT Telemetry** | Edge Sensors | Rainfall, Water Level, Soil Saturation | LIVE / SIMULATION | Built-in Seeded Simulator |
