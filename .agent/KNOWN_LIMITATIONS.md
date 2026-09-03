# FloodGuard AI — Known Limitations

**IMPORTANT: This document must be kept honest. Never minimize real limitations.**

---

## Data Limitations

### CRITICAL
- **IMD real-time rainfall:** Requires formal data-sharing agreement with IMD. Not publicly available via open API. FloodGuard uses Open-Meteo (open) and demo data in prototype.
- **CWC river levels:** Station data requires CWC registration. Prototype uses simulated river data.
- **Soil moisture:** SMAP/MODIS data is 1–3 day lag, not real-time. Soil saturation index is modeled, not directly measured.
- **Labeled flash flood events:** Ground-truth labels for Indian hilly regions are sparse. ML model is a PROTOTYPE MODEL, not VALIDATED MODEL.

### SIGNIFICANT
- **Spatial resolution of IMD gridded data:** 0.25° (~27 km) grid — insufficient for village-level hyper-local prediction alone. Downscaling is statistical inference, not measurement.
- **Historical event database:** Compiled from published records (NRSC, academic papers). Completeness cannot be guaranteed. Many events unreported.
- **Terrain data (SRTM):** 30m resolution, adequate for watershed delineation, but 15–20m vertical error affects local drainage computation.
- **IoT sensor network:** Prototype relies entirely on deterministic simulator. No real IoT devices are connected.

### MODERATE
- **Open-Meteo accuracy:** Adequate for demo/testing. Forecast accuracy decreases beyond 3 days. Not calibrated for extreme Indian monsoon events.
- **Landslide susceptibility:** Uses published GSI/NRSC layers where available. Village-scale susceptibility is based on terrain proxies, not field surveys.

---

## Model Limitations

- ML model is trained on available open datasets — label quality is limited
- Model has NOT been validated against independent held-out real events
- Model accuracy claims are PROTOTYPE ESTIMATES, not operationally validated
- No calibration against IMD/CWC operational thresholds
- Flash flood prediction in complex terrain is an unsolved research problem even globally

---

## Operational Limitations

- Not connected to official government alert systems (IMD, NDMA, SDMA)
- Alert delivery (SMS/email) requires external provider configuration
- No verified authority partnerships
- Not suitable for operational deployment without:
  - Authority review and approval
  - Real sensor data
  - Field calibration
  - Independent validation
  - Legal/regulatory clearance

---

## What Must NOT Be Claimed

- "Live data" when running on demo/simulated data
- "100% accurate" or any specific accuracy without validation evidence
- "Government approved" or "IMD partnered" without actual agreements
- "Production ready" — this is a FUNCTIONAL PROTOTYPE
- Route/shelter safety without verified current-condition data
- Specific casualty/damage figures in historical cases without sourced evidence

---

## Degraded Mode Behavior

| Failure | System Behavior |
|---------|----------------|
| IMD provider down | Shows UNAVAILABLE, uses last cached/demo |
| CWC provider down | Shows UNAVAILABLE, river data marked STALE |
| ML model fails | Falls back to rule-based risk engine |
| Database unavailable | Shows maintenance page with cached status |
| IoT gateway down | Devices marked OFFLINE, uncertainty increased |

---

## Future Work Required for Real Deployment

1. IMD/CWC data-sharing MOU
2. IoT sensor deployment (SDRF/DDMA coordination)
3. Field validation in target watershed
4. Authority review by hydrology experts
5. Model calibration with verified historical events
6. Integration with NDMA/SDMA alert systems
7. Legal/privacy review of field officer data
8. Load testing with real-scale data volumes
9. Cybersecurity audit

