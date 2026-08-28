# Risk & Failure Mode Analysis

**Classification:** ENGINEERING_INFERENCE  
**Research Date:** 2026-08-28  

---

## 1. System Failure Modes & Automated Defenses

| Failure Scenario | Impact | System Response & Mitigation |
|---|---|---|
| **External Weather API Outage (e.g., Open-Meteo down)** | Forecast inputs missing | Mark provider status `UNAVAILABLE`; fall back to last cached telemetry; elevate uncertainty indicator; prompt operator to upload local rain reports. |
| **IoT Sensor Telemetry Interruption (Radio/Power loss)** | Stale ground readings | Device status transitions from `ONLINE` $\rightarrow$ `STALE` $\rightarrow$ `OFFLINE`; risk engine switches to satellite/modeled estimates with explicit `INSUFFICIENT_DATA` / `LOW_CONFIDENCE` flags. |
| **Model Ingestion of Corrupted / Spurious Data (e.g. negative rain)** | Erroneous extreme predictions | Input Validation Guardrails quarantine anomalous values ($P < 0$ or $P > 1000\text{ mm/h}$); quarantined records are locked out of risk computation. |
| **Replay Attacks on IoT Gateways** | Fake alert generation | HMAC-SHA256 signature verification + strictly monotonic sequence numbers (`sequence > last_sequence`) immediately reject duplicate or replayed frames. |
| **Power/Network Blackout at Incident Command Post** | Loss of live dashboard | Client-side caching of last known risk map and evacuation routes; PWA offline storage capabilities. |

---

## 2. Scientific & Ethical Risks

- **False Alarm Fatigue:** Repeated false alarms cause villagers and local authorities to ignore genuine warnings.
  - *Mitigation:* Multi-source consensus requirement (requires agreement between rainfall intensity and soil saturation or river rate-of-rise before escalating to `EXTREME` alert).
- **Missed Events (False Negatives):** Catastrophic flash flood occurs without alert.
  - *Mitigation:* Conservative thresholding in steep catchments; explicit display of "UNKNOWN" zones where no telemetry exists.

