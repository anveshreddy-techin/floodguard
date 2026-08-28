# Domain Knowledge & Hilly Region Flash-Flood Dynamics

**Classification:** RESEARCHED_FACT / ENGINEERING_INFERENCE  
**Research Date:** 2026-08-28  

---

## 1. The Multi-Hazard Flash Flood Process in Mountainous Terrains

In high-relief mountain systems (e.g., Himalayas, Western Ghats), flash floods cannot be modeled simply as `RAINFALL = FLOOD`. They are complex **multi-hazard cascades**:

```
                       [ High-Intensity Precipitation ]
                       [ / Cloudburst / Rain-on-Snow  ]
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
       [ Steep Slopes / High TWI ]             [ Soil Infiltration Excess ]
                 │                                       │
                 ▼                                       ▼
       [ Slope Instabilities / ]               [ Surface Runoff & ]
       [ Landslides & Debris ]                 [ Rapid Hydrograph Peak ]
                 │                                       │
                 ▼                                       ▼
       [ Temporary River Damming / ]           [ Narrow Gorge Hydraulic Jam ]
       [ Natural Blockage in Gorges ]                    │
                 │                                       │
                 └───────────────────┬───────────────────┘
                                     ▼
                      [ Sudden Breaching & Release ]
                                     ▼
                    [ Hyper-Concentrated Debris Flow ]
                                     ▼
                 [ Downstream Village & Infrastructure Impact ]
```

---

## 2. Key Physical Parameters & Hydrological Indicators

### A. Meteorological Triggers
1. **Short-duration precipitation intensity:** $\ge 30\text{ mm/h}$ in steep catchments can overwhelm infiltration capacity (Hortonian overland flow).
2. **Cloudburst definition (IMD standard):** Rainfall $\ge 100\text{ mm/h}$ over a geographical area of roughly $20\text{ to }30\text{ km}^2$.
3. **Antecedent Precipitation Index (API):** $API_t = k \cdot API_{t-1} + P_t$ (where $k \approx 0.85\text{--}0.92$). Represents stored moisture in the root zone from preceding 7–14 days.

### B. Geomorphic & Terrain Factors
1. **Topographic Wetness Index (TWI):** $\ln(a / \tan \beta)$, where $a$ is specific catchment area and $\beta$ is local slope angle. High TWI denotes zones of water accumulation and saturation overland flow.
2. **Terrain Ruggedness Index (TRI):** Quantifies topographic heterogeneity and potential energy gradients.
3. **Stream Power Index (SPI):** $a \cdot \tan \beta$, measuring the erosive power of flowing water.
4. **Strahler Stream Order:** Lower order headwater streams (Orders 1–3) have steep gradients and low concentration times ($T_c < 30\text{ min}$).

### C. Soil & Geotechnical Factors
1. **Soil Saturation Index ($S_i$):** Ratio of current volumetric moisture content to porosity/field capacity ($0.0\text{--}1.0$). When $S_i > 0.85$, virtually $100\%$ of new rainfall converts directly into surface runoff.
2. **Landslide Susceptibility Index (LSI):** Derived from lithology, fault proximity, slope angle, aspect, and land use/land cover (LULC).

---

## 3. Case Studies of Mountainous Flash Floods

| Event | Date | Primary Mechanism | Key Takeaway |
|---|---|---|---|
| **Kedarnath / Uttarakhand Disaster** | June 2013 | Extreme multi-day monsoon rainfall + Chorabari Lake moraine dam breach + debris flow | Cascading lake breach + intense rainfall created catastrophic downstream surge within minutes. |
| **Chamoli Disaster (Rishiganga)** | Feb 2021 | Rock & ice avalanche from Ronti peak ($~5600\text{m}$) $\rightarrow$ frictional melting $\rightarrow$ massive debris flow | Non-rainfall trigger created a downstream flash flood destroying two hydropower projects. |
| **Melamchi Disaster (Nepal)** | June 2021 | Upstream glacial sediment remobilization + heavy rainfall + landslide dam breach | Upstream blockage followed by catastrophic release choked downstream bridges and settlements. |
| **South Lhonak Lake GLOF (Sikkim)** | Oct 2023 | Glacial Lake Outburst Flood (GLOF) triggered by moraine failure / intense precipitation | Breached Chungthang dam, severe downstream infrastructure devastation. |

---

## 4. Operational Implications for FloodGuard AI
- **Multi-Source Evidence Required:** In addition to gauge sensors, we must monitor upstream rate-of-rise, soil saturation, and landslide susceptibility.
- **Uncertainty Quantification:** Due to micro-climate variations in mountain valleys, radar beam blockage, and sparse telemetry, predictions must explicitly report uncertainty bands and missing telemetry.

