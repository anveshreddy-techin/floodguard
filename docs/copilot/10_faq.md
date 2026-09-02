# Frequently Asked Questions (FAQ)

### Q1: Is FloodGuard AI providing official government warnings?
**A**: In its current version, FloodGuard AI provides model-estimated decision support and risk intelligence. Official public disaster declarations originate from NDMA, SDMAs, and District Magistrates.

### Q2: Why does the risk score stay high after rainfall stops?
**A**: Flood risk depends heavily on saturated soil and river flood waves propagating downstream from upper headwaters, which often peak 1-3 hours after localized rainfall ceases.

### Q3: How are missing or offline sensors handled?
**A**: When a sensor is stale or offline, the engine activates fallback models (e.g. antecedent precipitation estimation) and flags elevated uncertainty.

### Q4: Can I upload localized rainfall CSV data to test my village basin?
**A**: Yes. Navigate to the `/upload` center, choose CSV format, and upload historical or simulated records. The 21-step engine will validate quality and compute an updated scenario run.
