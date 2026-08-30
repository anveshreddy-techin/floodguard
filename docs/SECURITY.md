# FloodGuard AI — Security Architecture & Threat Model

## 1. Authentication & Role-Based Access Control (RBAC)
- **JWT Authentication**: HS256 / RS256 token validation with 24-hour expiration.
- **Password Security**: Passwords hashed with `bcrypt` (work factor 12).
- **Five Tiered Roles**:
  1. `ADMIN`: Full system configuration and cryptographic master ledger access.
  2. `OPERATOR`: Incident triage, emergency dispatch, task assignment, shelter activation.
  3. `ANALYST`: Sensor calibration, historical replay, ML feature evaluation.
  4. `RESPONDER`: Field-level SAR execution, victim lookup, shelter check-in.
  5. `VIEWER`: Public advisory lookup, safe route guidance (victim personal info masked).

## 2. IoT Sensor Security & Device Authorization
- **HMAC-SHA256 Token Auth**: Every physical IoT node signs telemetry payloads with a pre-shared device key.
- **Timestamp Windowing**: Packets older than 300 seconds are rejected to mitigate replay attacks.
- **Dead-Letter Queue**: Malformed or unauthenticated packets are isolated for security review.

## 3. Privacy Protection & IT Act 2000 Compliance
- Victim PII (names, phone numbers, family linkages) in Missing Persons registry is encrypted at rest with **AES-256**.
- Automated role-masking redacts PII for VIEWER / DEMO sessions.
