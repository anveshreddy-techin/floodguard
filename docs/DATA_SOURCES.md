# Data Sources & Ingestion Protocol Matrix

## Operational Multi-Source Architecture (SIH26192)

This document provides a transparent, authoritative accounting of all hydrometeorological, satellite, terrain, and geotechnical data sources powering FloodGuard AI / HillGuard.

---

## 1. Data Source Attribution Matrix

| Source / Agency | Products / Variables | Current Operating Mode | Provenance & Endpoint | Fallback Mechanism |
|---|---|---|---|---|
| **Open-Meteo High-Resolution NWP** | Hourly Precipitation (15m, 30m, 1h, 3h, 6h, 12h, 24h, 72h), Peak Intensity, 2m Temperature, 2m Relative Humidity, 10m Wind Speed | `LIVE` | `https://api.open-meteo.com/v1/forecast` | In-memory cached last observation (15 min TTL) |
| **ECMWF Land Surface Model** | Volumetric Soil Moisture (0–1cm, 1–3cm), Saturation Ratio, Antecedent Precipitation Index (API 7d) | `MODELLED` | Open-Meteo / ECMWF IFS Land Analysis | Calibrated physical Antecedent Precipitation Index (API) |
| **India-WRIS / Central Water Commission (CWC)** | River Stage ($H$), Rate of Rise ($dH/dt$), Warning/Danger Thresholds, Cumulative Discharge ($Q$) | `LIVE` / `UNAVAILABLE` | India-WRIS REST API (`https://indiawris.gov.in/`) | Copernicus Emergency Management Service GloFAS (`https://flood-api.open-meteo.com/v1/flood`) with transparent gateway provenance label |
| **NASA / USGS SRTM 30m DEM** | Elevation ($z$), Coordinate Slope ($\beta$), Topographic Wetness Index (TWI $\ln(a / \tan\beta)$) | `LIVE_SRTM_QUERY` | Open-Meteo Elevation REST API (3-point 30m orthogonal spatial gradient query) | Village Geotechnical Registry (`VILLAGE_REGISTRY`) based on GSI/NRSC survey data |
| **ESA Copernicus Sentinel-2 MSI** | Normalized Difference Vegetation Index (NDVI), Surface Water Index (SWI / NDWI) | `SIMULATION` / `NOT_CONFIGURED` | Copernicus Data Space Ecosystem STAC API (`https://catalogue.dataspace.copernicus.eu/resto/api/collections/Sentinel2`) | Regional bioclimatic baseline table (Honest `NOT_CONFIGURED` badge until institutional `COPERNICUS_API_TOKEN` is supplied) |
| **Geotechnical Stability Physics (SHALe / SLIP)** | Factor of Safety ($FoS$), Limit Equilibrium Infinite Slope analysis | `CALCULATED_PHYSICS` | Deterministic closed-form Navier-Coulomb equation with pore-water saturation feedback | Minimum stability lower-bound ($FoS = 0.25$) |
| **In-Situ IoT Geophones & Culvert Transducers** | Debris acoustic vibration (dB), culvert hydraulic backpressure ratio | `SYNTHETIC_SIMULATION` | Virtual Environmental Node telemetry | **Strict Hardware Boundary**: Physical piezoresistive and geophone hardware cannot be fabricated in software. Clearly labeled simulation in all responses. |

---

## 2. Atmospheric & Meteorological Features

In addition to precipitation accumulation, FloodGuard AI ingests auxiliary surface weather variables from Open-Meteo:
- **Air Temperature (2m)**: Used to assess freezing level, snowmelt contribution in high-altitude Himalayan catchments (>2500m ASL), and convective instability.
- **Relative Humidity (2m)**: At $\ge 80\%$, atmospheric boundary layer saturation suppresses evaporation, increasing the fraction of rainfall converted directly into surface runoff ($+6$ points to rainfall hazard score).
- **Wind Speed (10m)**: At $\ge 35\text{ km/h}$, orographic windward slope convergence intensifies localized cloudburst formation ($+4$ points to rainfall hazard score).

---

## 3. Honest Hardware & Institutional Boundaries

1. **Physical IoT Probes**: Software cannot emulate real in-ground TDR probes, culvert strain gauges, or geophones without deployed hardware in the field. When physical hardware is absent, endpoints honestly tag these channels as `SYNTHETIC_SIMULATION`.
2. **India-WRIS Institutional API**: Direct real-time polling of CWC telemetry requires institutional static IP whitelisting or an active Ministry of Jal Shakti API key. When unauthenticated, the pipeline queries the Copernicus GloFAS hydrological gateway and transparently attributes the source as `Copernicus_GloFAS_Gateway`.
3. **Copernicus Data Space**: Queries the public STAC catalogue. If unauthenticated (`NOT_CONFIGURED`), it gracefully falls back to regionally verified Sentinel-2 seasonal baselines without throwing unhandled exceptions.
