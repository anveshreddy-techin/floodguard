# Sensor Availability & Telemetry Reality in Indian Mountain Valleys

**Classification:** RESEARCHED_FACT / ENGINEERING_INFERENCE  
**Research Date:** 2026-08-28  

---

## 1. Ground Sensor Reality in Hilly Regions

- **Telemetry Density:** While plains have relatively dense weather stations, Himalayan river basins (e.g., Alaknanda, Bhagirathi, Teesta) have sparse gauge networks due to inaccessible terrain, harsh winters, landslides, and flash flood washouts.
- **Vulnerabilities:**
  - River level ultrasonic/radar gauges installed in narrow gorges frequently get damaged during peak debris flows.
  - Cellular backhaul (4G/5G) is prone to fiber cuts and tower power failures during monsoon storms.
  - Optical rain gauges suffer from under-catch during extreme wind/squalls.

---

## 2. Sensor Types Supported in FloodGuard AI

| Sensor Type | Telemetry Parameter | Unit | Sampling Rate | Edge Resilience Requirement |
|---|---|---|---|---|
| **Tipping Bucket / Piezo Rain Gauge** | Precipitation Intensity & Accumulation | $\text{mm/h}$, $\text{mm}$ | 1–5 min | Local flash storage for 72h offline buffering |
| **Radar / Ultrasonic Water Level** | Gauge Height, Rate-of-Rise ($dH/dt$) | $\text{m}$, $\text{m/h}$ | 1–5 min | Outlier rejection for wave/turbulence noise |
| **FDR / TDR Soil Moisture** | Volumetric Water Content (VWC) | $\%$ | 15–30 min | Multi-depth probes (10cm, 30cm, 50cm) |
| **MEMS Tiltmeter / Inclinometer** | Slope Tilt / Creep | Degrees (°) | 1 min / Event | Threshold-triggered emergency burst transmission |
| **Geophone / Vibration Sensor** | Ground High-Frequency Vibration | $\text{Hz}$, $\text{mm/s}$ | Continuous/Event | Edge FFT for debris flow seismic signature |

---

## 3. FloodGuard Deterministic IoT Simulator Design

To ensure reproducible testing without requiring physical sensors deployed in Uttarakhand during development:
- **Simulator Properties:** Deterministic, seeded pseudo-random noise generator modeling physics-based diurnal variations, rainfall events, and sensor outages.
- **Data Mode:** Always tagged `data_mode="SIMULATION"` or `"DEMO"`.
- **Security:** Every simulated payload validates HMAC credentials and monotonic sequence counters to test replay protection.

