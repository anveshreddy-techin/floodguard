# FloodGuard AI — Alert Governance & CAP Policy

## 1. Prototype Governance: PILOT_MODE Enforcement
FloodGuard AI operates strictly under **PILOT_MODE** in development, testing, and hackathon evaluation:
- **No Public Broadcasts**: Public SMS broadcast towers, cell broadcast gateways, and sirens are **NOT** triggered automatically.
- **CAP Protocol**: Alerts adhere strictly to the OASIS Common Alerting Protocol (CAP v1.2 / ITU-T X.1303) XML specification format.
- **Operator-in-the-Loop**: Escalating an alert from `DRAFT` to `ACTIVE` requires human SEOC incident commander sign-off.

## 2. Six-Stage Alert Lifecycle
```
[DRAFT] ── (AI Model / Sensor Threshold Exceeded)
   │
   ▼
[ACTIVE] ── (Operator Reviewed & Broadcast Approved)
   │
   ▼
[ACKNOWLEDGED] ── (District EOC & Field Teams Responding)
   │
   ▼
[ESCALATED] ── (Secondary Cascade: Dam Spill / Landslide)
   │
   ▼
[RESOLVED] ── (Surge Wave Cleared / Water Receded)
   │
   ▼
[ARCHIVED] ── (Forensic Review Sealed in Immutable Ledger)
```

## 3. Dissemination Channel Boundaries
- `SMS Gateway`: `NOT_CONFIGURED` (Simulation / Mocked).
- `CAP XML Gateway`: `NOT_CONFIGURED` (Mocked validation).
- `Push / Webhook`: `NOT_CONFIGURED` (Simulated internal bus).
