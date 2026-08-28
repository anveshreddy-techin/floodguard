# FloodGuard AI — Disaster Management Lifecycle Framework

**Theme:** 4 — Disaster Management  
**Problem Statement:** SIH26192 (Ministry of Home Affairs)  
**Standard:** National Disaster Management Authority (NDMA) & Sendai Framework for Disaster Risk Reduction (SFDRR 2015–2030)  
**Date:** 2026-08-28  

---

## 1. Overview of Theme 4 Alignment

Disaster Management is not a single point-in-time notification tool; it is a **continuous lifecycle of Risk Mitigation, Preparedness, Real-Time Emergency Response, and Post-Event Recovery & Forensics**.

FloodGuard AI addresses all four quadrants of the National Disaster Management Authority (NDMA) cycle:

$$\begin{aligned}
\textbf{BEFORE} &\longrightarrow \text{Risk Mitigation, Hazard Mapping, Catchment Saturation Modeling \& Simulation} \\
\textbf{DURING} &\longrightarrow \text{Real-Time Stage Surge Detection, Incident Command, Citizen Escape Guidance} \\
\textbf{AFTER} &\longrightarrow \text{Flight Recorder Black Box, Prediction Memory Ledger, Leave-One-Out Benchmark}
\end{aligned}$$

---

## 2. The Three Operational Phases of FloodGuard AI

### Phase 1: BEFORE — Risk Mitigation, Planning & Preparedness (Pre-Disaster)
*Objective: Reduce vulnerability and detect evolving hazards before flash floods trigger.*

1. **Hyper-Local Vector GIS Hazard Mapping (`/map`):**
   - High-resolution spatial mapping of catchment slope gradients (DEM), river stream orders (Strahler 1–4), and alluvial fan settlement zones.
2. **Upstream Ridge-to-Valley Cascade Graph (`/cascade`):**
   - 8-stage physical hazard propagation chain tracing energy transfer from high-altitude orographic cloudbursts through saturated colluvial gullies.
3. **Scenario Simulator & "What-If" Stress Lab (`/simulation`):**
   - Enables disaster managers to simulate extreme monsoon downpours, upstream moraine dam breaches, and sensor blackouts to plan shelter capacities and bottleneck closures ahead of time.
4. **IoT & Telemetry Constellation (`/sensors`):**
   - In-situ tipping bucket rain gauges, non-contact radar water level gauges, and geophone tripwires monitoring antecedent watershed conditions.

---

### Phase 2: DURING — Real-Time Response, Command & Life-Safety Guidance (In-Progress)
*Objective: Protect human lives and coordinate emergency operations when a hazard manifests.*

1. **Full-Viewport Incident Command Center (`/`):**
   - Live 100vh operational workspace fusing real-time radar stage rates-of-rise ($+0.40\text{ m/h}$), composite risk trajectory dials ($68.5/100$), and active alert streams.
2. **Citizen Escape Guidance HUD ("My Safety") (`/safety`):**
   - Location-aware exposure estimation ($\pm 15\text{m}$ accuracy) computing distances to hazard perimeters and candidate elevated shelters.
   - **Emergency Mode HUD:** One-tap toggle that strips distraction metrics and focuses purely on life-safety escape vectors during extreme crisis.
   - Dynamic route status checks against active inundation contours (strictly labeled *Candidate Lower-Exposure Route*).
3. **Incident Command Operations Board (`/incidents`):**
   - 6-stage lifecycle progression (`Detected → Triaged → Investigating → Active Response → Recovery → Closed`) with multi-agency task dispatch (shelter readiness, road barriers, siren broadcasts).

---

### Phase 3: AFTER — Post-Disaster Forensics, Memory & Recovery (Post-Disaster)
*Objective: Audit model decisions, learn from historical disasters, and prevent future hindsight bias.*

1. **Flight Recorder Black-Box Timeline (`/flight-recorder`):**
   - Synchronized causal audit stream tracing raw telemetry arrivals to feature extraction, model inference, alert dispatch, and operator response.
2. **Historical Hindcast Lab (`/hindcast` & `/replay`):**
   - Strict hindsight lockout ($T-60\text{m}$ to $T_0$) evaluating model lead-time advantages (15–45 min) across 5 authoritative historical events (2013 Kedarnath, 2021 Chamoli, 2021 Melamchi, 2023 Nepal, 2026 Rasuwa).
3. **Prediction Memory & Ledger (`/ledger`):**
   - Append-only `KnowledgeSnapshot` store cryptographically sealed with SHA-256 digests to audit predictions against observed ground reality.
4. **Event Benchmark & Cross-Validation Matrix (`/benchmark`):**
   - Leave-One-Out Cross-Validation (LOOCV) matrix proving generalization across diverse Himalayan terrain without overfitting.

---

## 3. Disaster Management Feature Architecture

```
                       ┌─────────────────────────────────────────────────────────┐
                       │          FLOODGUARD AI DISASTER MANAGEMENT              │
                       │           SIH26192 • THEME 4 MASTER PLATFORM            │
                       └────────────────────────────┬────────────────────────────┘
                                                    │
        ┌───────────────────────────────────────────┼───────────────────────────────────────────┐
        │                                           │                                           │
  ▼ BEFORE                                    ▼ DURING                                    ▼ AFTER
PRE-DISASTER PLANNING                       REAL-TIME RESPONSE                          POST-DISASTER AUDIT
─────────────────────                       ──────────────────                          ───────────────────
• Hyper-Local GIS Map (`/map`)              • Command Center (`/`)                      • Flight Recorder (`/flight-recorder`)
• Upstream Cascade (`/cascade`)             • My Safety HUD (`/safety`)                 • Hindcast Lab (`/hindcast`)
• Scenario Simulator (`/simulation`)        • Incident Board (`/incidents`)             • Time Machine (`/replay`)
• Village Dossier (`/village/[id]`)         • Interactive Alerts (`/`)                  • Prediction Ledger (`/ledger`)
• IoT Constellation (`/sensors`)            • Emergency Mode HUD (`/safety`)            • Event Memory (`/events`)
• Ingestion Workbench (`/upload`)           • Public Alert Feeds (`/`)                  • LOOCV Benchmark (`/benchmark`)
```
