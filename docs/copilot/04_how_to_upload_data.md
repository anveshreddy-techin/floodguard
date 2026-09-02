# User Upload Center & Batch Telemetry Ingestion Guide

## Supported Formats
Users and field operators can upload batch data in **CSV**, **GeoJSON**, **JSON**, or **Parquet** format for hindcast evaluation, calibration, or localized scenario testing.

## Required Fields for Rainfall CSV
- `timestamp`: ISO 8601 string (e.g. `2026-07-15T08:30:00Z`)
- `station_id` / `location_id`: Alphanumeric station identifier
- `rainfall_mm`: Total precipitation in millimeters
- `duration_minutes`: Observation interval (typically 15, 30, or 60 min)
- `latitude`, `longitude`: WGS84 coordinates

## Data Validation Workflow (21 Steps)
1. **Security Scan**: File size check (<50MB) and content sanitization.
2. **Schema Mapping**: Automatic header alignment with FloodGuard standardized schema.
3. **Physical Range Inspection**: Values outside physical boundaries (e.g. rainfall > 500 mm/h) are flagged or quarantined.
4. **Duplicate & Replay Detection**: Identical timestamps from the same device are deduplicated.
5. **Quality Scoring**: Computes a data reliability score [0.0 - 1.0].
6. **Feature Snapshot Generation**: Calculates feature matrices for model inference.
