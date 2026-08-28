# Feature Engineering for Hilly Flash Floods

| Category | Engineered Feature | Formula / Description |
|---|---|---|
| **Rainfall** | 1h/3h/24h Accumulations, Intensity Gradient | Moving window summations and $dP/dt$ rates |
| **Antecedent Moisture** | API (Antecedent Precipitation Index) | $API_t = 0.88 \cdot API_{t-1} + P_t$ |
| **Soil State** | Saturation Index ($S_i$) | Ratio of volumetric moisture to porosity ($0\text{--}1$) |
| **Geomorphology** | Topographic Wetness Index (TWI) | $\ln(a / \tan \beta)$ |
| **Channel Dynamics** | Rate of River Rise ($dH/dt$) | Differential stage rise rate ($\text{m/h}$) |
