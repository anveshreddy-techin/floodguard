# Comprehensive Dataset Inventory

**Classification:** RESEARCHED_FACT / ENGINEERING_INFERENCE  
**Research Date:** 2026-08-28  

---

## 1. Remote Sensing & Gridded Environmental Datasets

| Dataset | Provider | Spatial Res. | Temporal Res. | Access Mode | License / Auth | FloodGuard AI Role |
|---|---|---|---|---|---|---|
| **CartoDEM** | ISRO / Bhuvan | 30m | Static | AVAILABLE | Open Gov (Bhuvan login) | Primary DEM for Indian terrain analysis, slope, TWI |
| **SRTM DEM v3** | NASA / USGS | 30m (1 arc-sec) | Static | AVAILABLE | Public Domain (OpenTopography) | Global terrain fallback & validation |
| **ALOS PALSAR DEM** | JAXA / ASF | 12.5m | Static | AVAILABLE | Open (Registration) | High-res slope stability & channel morphology |
| **IMD Gridded Rainfall** | IMD Pune | 0.25° x 0.25° | Daily | REGISTRATION_REQUIRED | Academic / Gov MoU | Historical baseline calibration & validation |
| **MOSDAC Soil Wetness** | ISRO / SAC | 0.1° (~10km) | Daily / Sub-daily | REGISTRATION_REQUIRED | Research Portal | Regional soil saturation baseline |
| **ERA5-Land** | ECMWF / Copernicus | 0.1° (~9km) | Hourly | AVAILABLE | Open (CDS API) | Historical reanalysis, soil moisture, antecedent rain |
| **GPM IMERG** | NASA | 0.1° (~10km) | 30-min | AVAILABLE | Open (NASA Earthdata) | Near real-time satellite precipitation estimates |
| **Landslide Atlas of India** | NRSC / ISRO | Geospatial points/polygons | Historical (1998–2022) | AVAILABLE | Bhuvan Open Archive | Landslide density & susceptibility priors |
| **National Landslide Susceptibility** | GSI (Bhukosh) | 1:50,000 map scale | Static | AVAILABLE | Open Portal | Baseline geological susceptibility layer |

---

## 2. Infrastructure & Geospatial Boundary Datasets

| Dataset | Provider | Geometry | Access Mode | FloodGuard AI Role |
|---|---|---|---|---|
| **Local Government Directory (LGD)** | MoPR / OpenGov | Village/Block/District hierarchy | AVAILABLE | Canonical Indian administrative coding |
| **OpenStreetMap (OSM) India** | OSM Contributors | Roads, bridges, hospitals, shelters | AVAILABLE (ODbL) | Infrastructure exposure & candidate evacuation routes |
| **HydroSHEDS / HydroBASINS** | WWF / USGS | Vector Watersheds (Levels 06–12) | AVAILABLE | Watershed & catchment delineation |
| **India-WRIS Basin Geodatabase** | CWC / NWIC | Major/Medium river vectors | AVAILABLE | River network topology & strahler ordering |

---

## 3. Synthetic & Simulation Datasets (Deterministic Baseline)

| Dataset | Generator | Mode | Purpose |
|---|---|---|---|
| **Deterministic Demo Suite** | FloodGuard Simulator | `DEMO` | Zero-dependency, offline finals demonstration with calibrated physics-like scenarios |
| **Stress Test Scenario Library** | FloodGuard Scenario Engine | `SIMULATION` | What-if scenarios (rain escalation, dam breach proxy, sensor blackout) |

