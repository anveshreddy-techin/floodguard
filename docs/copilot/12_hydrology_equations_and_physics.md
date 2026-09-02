# Physical Hydrology Equations, Governing Principles & Flood Dynamics

This document provides the mathematical, physical, and engineering foundation used by FloodGuard AI Copilot to explain risk scores, water flow rates, soil infiltration, and catchment response times.

---

## 1. Manning's Equation for Open Channel Flow

Used to calculate stream velocity and volumetric discharge in natural mountain river channels and culverts.

### Velocity Formula:
$$v = \frac{1}{n} R_h^{2/3} S^{1/2}$$

### Volumetric Discharge Formula:
$$Q = A \cdot v = \frac{1}{n} A R_h^{2/3} S^{1/2}$$

- **$Q$**: Discharge in cubic meters per second ($\text{m}^3/\text{s}$ or cumecs).
- **$v$**: Mean flow velocity ($\text{m/s}$).
- **$n$**: Manning's roughness coefficient:
  - Natural mountain stream with gravels and cobbles: $n \approx 0.040 - 0.055$.
  - Torrential stream with large boulders and steep banks: $n \approx 0.060 - 0.075$.
  - Clean concrete culvert: $n \approx 0.013 - 0.015$.
- **$A$**: Cross-sectional area of flow ($\text{m}^2$).
- **$R_h$**: Hydraulic radius ($\text{m}$), defined as $R_h = \frac{A}{P}$, where $P$ is the wetted perimeter.
- **$S$**: Channel bed slope (dimensionless, $\text{m/m}$).

**Application in Hilly Basins**: Because Himalayan slopes are steep ($S > 0.05$), flow velocities routinely exceed $4.0 - 7.0\text{ m/s}$ during flash surges, drastically increasing destructive kinetic energy ($\propto v^2$).

---

## 2. The Rational Method (Peak Runoff)

Used for estimating peak flash-flood discharge in small, steep mountain sub-catchments ($< 25\text{ km}^2$).

### Formula:
$$Q_p = 0.278 \cdot C \cdot I \cdot A$$

- **$Q_p$**: Peak runoff discharge ($\text{m}^3/\text{s}$).
- **$C$**: Dimensionless runoff coefficient ($0.0 \le C \le 1.0$):
  - Saturated steep rocky slope: $C = 0.80 - 0.95$.
  - Forested mountain catchment (dry): $C = 0.20 - 0.35$.
  - Terraced agricultural slopes: $C = 0.40 - 0.60$.
- **$I$**: Rainfall intensity ($\text{mm/h}$) for duration equal to catchment time of concentration ($t_c$).
- **$A$**: Catchment drainage area ($\text{km}^2$).
- **$0.278$**: Metric conversion constant ($1 / 3.6$).

---

## 3. SCS-CN (Soil Conservation Service Curve Number) Method

Used for computing direct storm runoff depth from cumulative precipitation and antecedent soil moisture.

### Runoff Equation:
$$Q_d = \frac{(P - I_a)^2}{(P - I_a) + S_r} \quad \text{for } P > I_a$$
Where initial abstraction $I_a = 0.2 \cdot S_r$ (or $0.05 \cdot S_r$ for steep mountain slopes).

### Potential Maximum Soil Retention ($S_r$ in mm):
$$S_r = \frac{25400}{\text{CN}} - 254$$

- **$P$**: Total storm rainfall accumulation ($\text{mm}$).
- **$Q_d$**: Accumulated depth of direct runoff ($\text{mm}$).
- **$\text{CN}$**: Curve Number ($0 - 100$), adjusted for Antecedent Moisture Condition:
  - **AMC-I**: Dry conditions (5-day prior rain $< 13\text{ mm}$ in dormant season).
  - **AMC-II**: Average soil condition.
  - **AMC-III**: Saturated soil (5-day prior rain $> 53\text{ mm}$ in monsoon).

**Physical Consequence**: In AMC-III (monsoon saturation), $\text{CN}$ shifts from $70 \to 88$, reducing retention $S_r$ from $108\text{ mm}$ to $34\text{ mm}$, causing over $80\%$ of subsequent rain to convert directly into overland flood volume.

---

## 4. Topographic Wetness Index (TWI)

Used to quantify topographical control on hydrological processes and saturation zone susceptibility from Digital Elevation Models (DEM).

### Formula:
$$\text{TWI} = \ln\left(\frac{a}{\tan\beta}\right)$$

- **$a$**: Specific catchment area ($\text{m}^2/\text{m}$), the upslope contributing drainage area per unit contour width.
- **$\beta$**: Local surface slope angle in radians (or degrees converted to $\tan\beta$).

### Interpretation:
- **Low TWI ($< 5$)**: Steep ridges and shedding slopes; rapid runoff, high shear stress, landslide prone.
- **Moderate TWI ($6 - 10$)**: Mid-slope colluvial hollows and gullies; debris flow initiation zones.
- **High TWI ($> 12$)**: Flat valley bottoms, floodplain sinks, and natural choke points; severe inundation and water accumulation.

---

## 5. Antecedent Precipitation Index (API)

Used when real-time soil moisture sensors (TDR/FDR probes) are offline or degraded.

### Formula:
$$\text{API}_t = \text{API}_{t-1} \cdot k + P_t$$

- **$\text{API}_t$**: Soil moisture index at day/hour $t$ ($\text{mm}$).
- **$k$**: Recession / drainage factor (typically $0.85 - 0.95$ per day depending on temperature and soil drainage characteristics).
- **$P_t$**: Measured precipitation during period $t$ ($\text{mm}$).

---

## 6. Time of Concentration ($t_c$ — Kirpich's Equation)

The time needed for water to flow from the hydraulically most remote point of the watershed to the outlet.

### Formula:
$$t_c = 0.01947 \cdot L^{0.77} \cdot S^{-0.385}$$

- **$t_c$**: Time of concentration in minutes.
- **$L$**: Maximum length of stream travel ($\text{m}$).
- **$S$**: Overall slope of the flow path ($\text{m/m}$).

**Flash-Flood Hazard Rule**: In Himalayan headwaters where $L = 5\text{ km}$ and $S = 0.15$, $t_c$ can be as short as **$20 - 35$ minutes**, explaining why warnings must be issued within minutes of cloudburst detection.

---

## 7. River Stage Rate of Rise ($\Delta h / \Delta t$)

- **Normal rise**: $< +0.10\text{ m/h}$.
- **Accelerated rise (Watch)**: $+0.15\text{ m/h}$ to $+0.30\text{ m/h}$.
- **Surge / Flash flood threshold**: $> +0.40\text{ m/h}$.
- **Dam breach / GLOF catastrophic wave**: $> +1.50\text{ m}$ in 15 minutes.
