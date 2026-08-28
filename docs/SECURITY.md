# Security & DevSecOps Architecture

- **Authentication:** JWT HS256 tokens with configurable expiration and bcrypt password hashing (12 rounds).
- **RBAC (Role-Based Access Control):** 6-tier hierarchy (`VIEWER`, `RESEARCHER`, `FIELD_OFFICER`, `ANALYST`, `AUTHORITY_OPERATOR`, `ADMIN`).
- **IoT Device Security:** HMAC-SHA256 signature verification + monotonic sequence number checking against replay attacks.
- **Upload Hardening:** MIME type validation, file size hard caps ($50\text{MB}$), and isolated quarantine directories.
- **Secret Protection:** Zero hardcoded secrets; 100% environment variable loading via Pydantic Settings.
