# Existing Indian Disaster Management & Hydro-Meteorological Ecosystem

**Classification:** RESEARCHED_FACT  
**Research Date:** 2026-08-28  

---

## 1. Primary Government Agencies & Responsibilities

| Agency | Role | Key Systems / Portals | Data Accessibility |
|---|---|---|---|
| **IMD** (India Meteorological Department) | Weather forecasting, precipitation monitoring, cyclone & storm tracking | IMD API Portal (`api.imd.gov.in`), AWS/ARG Network, India-FFGS | Restricted (Static IP whitelisting required for live streaming APIs), Open data via `data.gov.in` |
| **CWC** (Central Water Commission) | River discharge, gauge levels, basin telemetry, nationwide flood forecasting | National Water Data Portal (`nwdp.nwic.gov.in`), India-WRIS (`indiawris.gov.in`), FloodWatch India App | Public web visualization; APIs require institutional registration; border basin data classified |
| **ISRO / NRSC** | Satellite remote sensing, flood inundation mapping, landslide hazard zonation | Bhuvan Geoportal (`bhuvan.nrsc.gov.in`), MOSDAC (`mosdac.gov.in`), Bhoonidhi | Open access for standard products (WMS/WFS / CartoDEM / LISS data); high-res on request |
| **GSI** (Geological Survey of India) | Landslide inventories, national landslide susceptibility mapping | Bhukosh Portal, Bhooskhalan App | Open spatial datasets (>91,000 documented historical landslides) |
| **NDMA / SDMA / DDMA** | Disaster mitigation policies, incident command, emergency alert dissemination | National Emergency Response System, SACHET (CAP-based SMS portal) | CAP (Common Alerting Protocol) integration via authorized telecom/state channels |

---

## 2. Deep Dive: India-FFGS (Flash Flood Guidance System)

- **Classification:** RESEARCHED_FACT
- **Operational Status:** Operational since October 2020.
- **Scope:** India + South Asian Regional Center (SAsiaFFGS covers India, Nepal, Bhutan, Bangladesh, Sri Lanka).
- **Core Methodology:**
  - Operates on a **4km x 4km micro-watershed** grid.
  - Computes **FFG (Flash Flood Guidance):** depth of rainfall of a given duration needed to cause flooding at the outlet of a catchment.
  - Generates **Flash Flood Threat (FFT):** 6-hour advance warning based on radar and satellite precipitation estimates.
  - Generates **Flash Flood Risk (FFR):** 24-hour advance forecast using numerical weather prediction models.
- **Ecosystem Gap:**
  - India-FFGS provides macro-watershed guidance to regional disaster managers, but lacks:
    1. **Hyper-local village/ward level impact intelligence** (building footprints, vulnerable roads).
    2. **Upstream-to-downstream cascade reasoning** (debris dams, sudden glacial lake outbursts, landslides blocking narrow gorges).
    3. **Uncertainty and data-gap transparency** for frontline local operators.
    4. **Explainable AI decision traces** linked to ground incident command workflows.

---

## 3. Hydrological & Flood Early Warning Products

- **CWC FloodWatch India:** Smartphone application providing 7-day advisory and 24-hour real-time flood status across 338 river monitoring stations.
- **SFEWS (Spatial Flood Early Warning System):** NRSC-developed 2D hydrodynamic flood simulation system operating primarily in the Godavari and Mahanadi basins.
- **MOSDAC Soil Wetness Index (SWI):** Derived soil moisture proxy derived from SCATSAT-1 and INSAT-3D/3DR observations.

---

## 4. Integration Philosophy for FloodGuard AI

**Core Principle:** FloodGuard AI is designed as a **complementary, high-resolution decision-support platform**, NOT an adversarial replacement for national agencies (IMD/CWC/NRSC).

- Ingests official IMD/CWC telemetry wherever authenticated APIs exist.
- Employs Open-Meteo & GFS as open-access developmental/prototype fallbacks.
- Provides hyper-local watershed downscaling, multi-hazard cascade logic, explainability, and incident command workflows that national guidance does not natively deliver.

