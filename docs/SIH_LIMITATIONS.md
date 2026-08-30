# FloodGuard AI — Operational Limitations & Evaluation Boundaries

## 1. Institutional API Authorization Limits
- **IMD / CWC Live Keys**: Direct streaming connections to IMD National Data Center Pune and CWC India-WRIS require formal ministry-level static IP whitelisting and institutional MoUs. Both adapters are fully implemented with honest `NOT_CONFIGURED` fallbacks.
- **ISRO Bhuvan SAR Feed**: Satellite revisit cycles range from 2 to 5 days; real-time continuous SAR inundation is not available.

## 2. Machine Learning Scope & Training Limits
- **GLOF ML Classifier**: Glacial Lake Outburst Floods (GLOFs) are rare historical events in India ($< 30$ documented instances over 50 years). A reliable supervised ML model cannot be trained without severe overfitting; FloodGuard AI therefore utilizes **SAR morphometry change screening** rather than asserting false ML probabilities.
- **Prototypes**: ML models in the model registry are labeled `DEMO_ONLY` or `LIMITED_VALIDATION`. The deterministic physics-based baseline is used for primary demo operations.

## 3. Communication & Warning Boundaries
- **CAP Emergency Broadcast**: Live public siren dispatch and cell-broadcast towers are disabled under `PILOT_MODE` to prevent accidental public alarm during hackathon evaluation.
