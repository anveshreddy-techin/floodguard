# FloodGuard AI — Data Provenance & Audit Ledger System

## 1. Provenance Schema & Metadata Standard
Every record ingested, processed, or evaluated in FloodGuard AI carries an unalterable provenance envelope:

```json
{
  "record_id": "REC-98214-UK",
  "source_id": "AWS-001",
  "source_type": "LORA_MESH_PROBE",
  "source_url": "https://api.floodguard.local/iot/v1",
  "observed_at": "2026-08-30T06:00:00Z",
  "received_at": "2026-08-30T06:00:02Z",
  "processed_at": "2026-08-30T06:00:03Z",
  "data_mode": "DEMO",
  "quality_status": "VALID",
  "provenance_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "trace_id": "tr-4f91-88bc"
}
```

## 2. Quality Flags & Rejection Rules
- `VALID`: Within physical limits ($0 \le \text{Rain} \le 500\text{ mm/h}$, $0 \le \text{Stage} \le 100\text{ m}$), monotonic timestamp, valid geo-bounding box within India.
- `ACCEPTED_WITH_WARNING`: Minor telemetry delay ($\le 30\text{ min}$) or minor sensor noise.
- `QUARANTINED`: Suspicious spike ($> 4\sigma$ above rolling 3h mean) or missing calibration metadata.
- `REJECTED`: Out of physical boundaries, duplicate packet, or cryptographic hash mismatch.

## 3. Cryptographic Sealing & Flight Recorder
- Every state transition is recorded in the immutable Prediction Ledger and Flight Recorder.
- All records are hashed using **SHA-256**.
- In strict replay mode, future data points beyond step $T$ are cryptographically locked to prevent foresight contamination.
