# FloodGuard AI — SIH 2026 Official Alignment
**Problem Statement SIH26192 | Theme 4: Disaster Management**  
**Category: Software | Ministry / Agency Alignment: Ministry of Home Affairs / NDMA / CWC**

---

## 1. Problem Statement Requirements vs. FloodGuard Implementation

| SIH26192 Requirement | FloodGuard AI Implementation | Verification Route / Module |
|---|---|---|
| **1. Rainfall Monitoring & Intensity Analysis** | 3-hour & 24-hour rainfall accumulation tracking with orographic elevation adjustment (+16mm/h surge triggers). | `/sensors`, `/cascade`, `risk_engine.py` |
| **2. Soil Moisture & Saturation Preconditioning** | Antecedent Precipitation Index (API) & TDR soil probe saturation modeling (82% critical threshold). | `/simulation`, `/map` (SOIL layer) |
| **3. Steep Terrain & Slope Hydrology** | SRTM 30m / ALOS 12.5m Digital Elevation Model with slope-weighted runoff velocity & 28°-41° gorge acceleration. | `/map`, `/cascade` |
| **4. Historical Disaster Event Memory** | Multi-event hindcast archive (2013 Kedarnath, 2021 Chamoli GLOF, 2021 Melamchi, 2023 Nepal, 2026 Bhote Koshi). | `/events`, `/hindcast`, `/replay` |
| **5. Real-Time IoT & Telemetry Integration** | LoRaWAN / 4G telemetry simulation for FMCW radar river gauges, AWS rain gauges, and mid-slope geophones. | `/sensors`, `/flight-recorder` |
| **6. Hyper-Local Risk Scoring** | Multi-factor physics-informed composite risk calculation (0-100 scale: LOW, MODERATE, HIGH, EXTREME). | `/`, `/village/[id]`, `risk_engine.py` |
| **7. Actionable Early Warning & Citizen Safety** | User-proximity exposure scoring, hazard-avoiding candidate escape vectors, and designated shelter guidance. | `/safety`, `/incidents`, `exposure_engine.py` |

---

## 2. Indian Disaster-Management Ecosystem Interoperability

FloodGuard AI acts as an **Integration, Analysis & Decision-Support Layer** that augments existing national systems rather than attempting to replace them:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   INDIAN DISASTER ECOSYSTEM ADAPTERS                   │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Source Agency     │ Ingested Data     │ FloodGuard Role                │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ IMD               │ AWS / ARG Rainfall│ Orographic gorge accumulation  │
│                   │ Doppler Radar QPE │ and cloudburst early detection │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ CWC               │ River Water Level │ FMCW radar rate-of-rise (+0.4m/h│
│                   │ Hydrographs       │ flash surge triggers)          │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ NRSC / ISRO Bhuvan│ Flood Inundation  │ 100-yr flood buffer mapping    │
│                   │ Landslide Maps    │ and colluvial choke points     │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ NDMA / SDMA       │ CAP Alert Feeds   │ Common Alerting Protocol       │
│                   │ Official Guidance │ broadcast prioritization       │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ India-FFGS        │ Flash Flood Alert │ Hyper-local catchment boundary │
│                   │ Thresholds        │ micro-scale downscaling        │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

## 3. Truth-In-Data & Operational Principles

1. **No Absolute Safety Guarantees**: Emergency route outputs are strictly labeled **`LOWER-EXPOSURE CANDIDATE`** or **`CANDIDATE ROUTE`**, never "Safe Route", acknowledging real-world landslide and unverified mudflow dynamics.
2. **Official Guidance Precedence**: In compliance with NDMA protocols, verified official administration instructions are displayed **above** algorithmic model suggestions during active emergencies.
3. **Strict Replay Hindsight Lock**: In historical hindcasts, future data points ($T > T_{\text{simulated}}$) are cryptographically locked to ensure genuine zero-leakage evaluation.
4. **Deterministic Finals Safe Mode**: All core demonstration flows function 100% offline without third-party network dependencies.
