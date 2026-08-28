# Prior Art & Scientific Benchmark Analysis

**Classification:** RESEARCHED_FACT  
**Research Date:** 2026-08-28  

---

## 1. Academic & Operational Prior Art

### A. Hydrological & Hydrodynamic Models
- **HEC-HMS & HEC-RAS (USACE):** Standard 1D/2D hydraulic modeling software. Highly accurate when cross-sections and bathymetry are known, but computationally prohibitive for real-time county-wide instantaneous predictions without supercomputers.
- **SWAT (Soil & Water Assessment Tool):** Basin-scale continuous-time model. Ideal for monthly/daily water yield, but less responsive to sub-hourly cloudburst dynamics.

### B. Machine Learning in Flash Flood Forecasting
- **LSTM / GRU Recurrent Networks for Streamflow:** Proven effective for continuous river hydrograph prediction (e.g., Google Flood Hub, Kratzert et al.). Limitations in mountain headwaters: extreme data sparsity and non-linear debris blockage breaches violate stationary time-series assumptions.
- **Tree-Based Ensembles (XGBoost / Random Forest) on Hydro-Geomorphic Features:** Outstanding performance for classification of flood susceptibility and threshold crossing when features include TWI, rainfall intensity, and antecedent saturation. Highly interpretable with SHAP (SHapley Additive exPlanations).

---

## 2. Commercial & Institutional Platforms

- **Google Flood Hub:** Focuses predominantly on large river basins (inundation mapping along major alluvial rivers) with 1–7 day lead times. Less tailored to 15-minute mountain cloudbursts and debris cascades.
- **GloFAS (Global Flood Awareness System):** ECMWF Copernicus product providing continental scale forecasting. Resolution too coarse for individual Himalayan village decisions.

---

## 3. FloodGuard AI's Strategic Positioning

FloodGuard AI fuses **geomorphic priors (DEM/TWI/Slope)** with **near-real-time observations and explainable machine learning**, providing a lightweight, low-latency, interpretable operational dashboard for village-level disaster managers.

