# Data Quality & Automated Quarantine Guardrails

Validation pipeline flags:
- `VALID`: Within physical limits ($0 \le P \le 1000\text{ mm/h}$, $0 \le H \le 30\text{m}$).
- `ACCEPTED_WITH_WARNING`: Minor missing metadata.
- `QUARANTINED`: Physically impossible readings (negative rainfall, extreme sensor spikes).
- `REJECTED`: Missing mandatory timestamp or malformed schemas.

**Quarantine Guarantee:** Quarantined records are safely stored in audit tables but locked out from risk scoring algorithms.
