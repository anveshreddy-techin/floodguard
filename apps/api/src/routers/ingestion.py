"""
FloodGuard AI — Ingestion Jobs Router
Tracks all data ingestion jobs, provider health, and pipeline status.
All live provider integrations start as NOT_CONFIGURED with DEMO fallback.
"""
import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Query
from pydantic import BaseModel


router = APIRouter(tags=["Ingestion Pipeline"])


# ─── Schemas ──────────────────────────────────────────────────────────────────

class IngestionJobStatus(str):
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    SUCCEEDED = "SUCCEEDED"
    PARTIAL = "PARTIAL"
    RETRYING = "RETRYING"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


DEMO_PROVIDERS = [
    {"provider_id": "imd_national", "name": "IMD National AWS Network", "status": "NOT_CONFIGURED", "data_mode": "DEMO", "products": ["district_rainfall", "aws_observations", "qpf_forecasts"], "coverage": "Pan-India", "update_frequency": "15 minutes", "integration_note": "Requires MoU and static IP whitelisting"},
    {"provider_id": "cwc_national", "name": "CWC India-WRIS River Gauge Telemetry", "status": "NOT_CONFIGURED", "data_mode": "DEMO", "products": ["river_stage", "discharge", "warning_levels"], "coverage": "Pan-India", "update_frequency": "15 minutes", "integration_note": "Requires institutional API registration"},
    {"provider_id": "open_meteo", "name": "Open-Meteo Weather API", "status": "CONFIGURED", "data_mode": "LIVE", "products": ["weather_forecast", "temperature", "wind", "precipitation_forecast"], "coverage": "Global (includes India)", "update_frequency": "1 hour", "integration_note": "Open, no auth required"},
    {"provider_id": "satellite_precip", "name": "GPM IMERG Satellite Precipitation", "status": "NOT_CONFIGURED", "data_mode": "DEMO", "products": ["satellite_rainfall_3h", "areal_precip"], "coverage": "Pan-India", "update_frequency": "3 hours", "integration_note": "Requires NASA EarthData OAuth2"},
    {"provider_id": "nrsc_bhuvan", "name": "NRSC Bhuvan Flood Inundation", "status": "NOT_CONFIGURED", "data_mode": "DEMO", "products": ["flood_extent_raster", "ndwi_change"], "coverage": "India (selected basins)", "update_frequency": "2-3 days", "integration_note": "Requires NRSC institutional registration"},
    {"provider_id": "glacier_nrsc", "name": "NRSC Glacier & Glacial Lake Monitoring", "status": "NOT_CONFIGURED", "data_mode": "DEMO", "products": ["glacial_lake_extent", "sar_change_detection"], "coverage": "Himalayan basins", "update_frequency": "5-10 days", "integration_note": "Requires NRSC institutional access"},
    {"provider_id": "landslide_gsi", "name": "GSI National Landslide Inventory", "status": "NOT_CONFIGURED", "data_mode": "DEMO", "products": ["susceptibility_zones", "event_catalog"], "coverage": "Pan-India", "update_frequency": "Static + event updates", "integration_note": "Requires GSI data sharing agreement"},
    {"provider_id": "reservoir_cwc", "name": "CWC Reservoir Level Monitoring", "status": "NOT_CONFIGURED", "data_mode": "DEMO", "products": ["dam_level", "storage_pct", "spillway_status", "inflow_outflow"], "coverage": "Major dams (national)", "update_frequency": "Daily", "integration_note": "Requires CWC institutional key"},
    {"provider_id": "iot_simulator", "name": "FloodGuard IoT Sensor Simulator", "status": "SIMULATION_ONLY", "data_mode": "SIMULATION", "products": ["rainfall_rate", "river_stage", "soil_moisture", "vibration"], "coverage": "Chamoli pilot area (demo)", "update_frequency": "5 minutes", "integration_note": "Demo simulator — replace with real IoT gateway for deployment"},
    {"provider_id": "floodguard_demo", "name": "FloodGuard Demo Dataset", "status": "OPERATIONAL", "data_mode": "DEMO", "products": ["historical_events", "model_scenarios", "training_cases"], "coverage": "Pan-India (curated)", "update_frequency": "On demand", "integration_note": "Always available for demonstration and testing"},
]

DEMO_JOBS = [
    {"job_id": "JOB-2026-001", "provider": "open_meteo", "region": "Pan-India", "data_mode": "LIVE", "status": "SUCCEEDED", "started_at": "2026-08-30T06:00:00Z", "completed_at": "2026-08-30T06:00:22Z", "records_accepted": 1248, "records_rejected": 0, "note": "Forecast ingestion succeeded"},
    {"job_id": "JOB-2026-002", "provider": "imd_national", "region": "Pan-India", "data_mode": "DEMO", "status": "PARTIAL", "started_at": "2026-08-30T05:45:00Z", "completed_at": "2026-08-30T05:45:08Z", "records_accepted": 0, "records_rejected": 0, "note": "NOT_CONFIGURED — demo fallback activated"},
    {"job_id": "JOB-2026-003", "provider": "cwc_national", "region": "Alaknanda Basin", "data_mode": "DEMO", "status": "PARTIAL", "started_at": "2026-08-30T05:30:00Z", "completed_at": "2026-08-30T05:30:05Z", "records_accepted": 0, "records_rejected": 0, "note": "NOT_CONFIGURED — demo fallback activated"},
    {"job_id": "JOB-2026-004", "provider": "floodguard_demo", "region": "Chamoli District", "data_mode": "DEMO", "status": "SUCCEEDED", "started_at": "2026-08-30T00:00:00Z", "completed_at": "2026-08-30T00:00:04Z", "records_accepted": 42, "records_rejected": 0, "note": "Demo scenario data loaded"},
    {"job_id": "JOB-2026-005", "provider": "iot_simulator", "region": "Chamoli Pilot", "data_mode": "SIMULATION", "status": "RUNNING", "started_at": "2026-08-30T11:00:00Z", "completed_at": None, "records_accepted": 144, "records_rejected": 2, "note": "Sensor simulator active"},
]


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.get("/api/v1/ingestion/providers")
async def list_providers(status: str = Query(None, description="Filter by provider status")) -> dict[str, Any]:
    providers = DEMO_PROVIDERS
    if status:
        providers = [p for p in DEMO_PROVIDERS if p["status"].lower() == status.lower()]
    return {
        "providers": providers,
        "total": len(providers),
        "data_mode": "DEMO",
        "note": "Provider statuses reflect actual configuration. NOT_CONFIGURED = boundary implemented, credentials absent.",
    }


@router.get("/api/v1/ingestion/providers/{provider_id}/health")
async def provider_health(provider_id: str) -> dict[str, Any]:
    provider = next((p for p in DEMO_PROVIDERS if p["provider_id"] == provider_id), None)
    if not provider:
        return {"error": "Provider not found", "provider_id": provider_id}
    return {
        "provider_id": provider_id,
        "name": provider["name"],
        "status": provider["status"],
        "data_mode": provider["data_mode"],
        "last_checked": datetime.now(timezone.utc).isoformat(),
        "latency_ms": None if provider["status"] == "NOT_CONFIGURED" else 180.5,
        "note": provider["integration_note"],
    }


@router.get("/api/v1/ingestion/jobs")
async def list_jobs(
    provider: str = Query(None),
    status: str = Query(None),
    limit: int = Query(20, ge=1, le=100),
) -> dict[str, Any]:
    jobs = DEMO_JOBS
    if provider:
        jobs = [j for j in jobs if j["provider"] == provider]
    if status:
        jobs = [j for j in jobs if j["status"].lower() == status.lower()]
    return {
        "jobs": jobs[:limit],
        "total": len(jobs),
        "data_mode": "DEMO",
        "summary": {
            "total": len(DEMO_JOBS),
            "succeeded": sum(1 for j in DEMO_JOBS if j["status"] == "SUCCEEDED"),
            "running": sum(1 for j in DEMO_JOBS if j["status"] == "RUNNING"),
            "partial": sum(1 for j in DEMO_JOBS if j["status"] == "PARTIAL"),
            "failed": sum(1 for j in DEMO_JOBS if j["status"] == "FAILED"),
        },
    }


@router.get("/api/v1/ingestion/jobs/{job_id}")
async def get_job(job_id: str) -> dict[str, Any]:
    job = next((j for j in DEMO_JOBS if j["job_id"] == job_id), None)
    if not job:
        return {"error": "Job not found", "job_id": job_id}
    return {**job, "data_mode": "DEMO"}


@router.post("/api/v1/ingestion/providers/{provider_id}/sync")
async def trigger_sync(provider_id: str) -> dict[str, Any]:
    provider = next((p for p in DEMO_PROVIDERS if p["provider_id"] == provider_id), None)
    if not provider:
        return {"error": "Provider not found", "provider_id": provider_id}
    if provider["status"] == "NOT_CONFIGURED":
        return {
            "job_id": f"JOB-{uuid.uuid4().hex[:8].upper()}",
            "provider_id": provider_id,
            "status": "PARTIAL",
            "data_mode": "DEMO",
            "note": f"Provider {provider_id} is NOT_CONFIGURED. Demo fallback activated. No live sync performed.",
            "started_at": datetime.now(timezone.utc).isoformat(),
        }
    return {
        "job_id": f"JOB-{uuid.uuid4().hex[:8].upper()}",
        "provider_id": provider_id,
        "status": "QUEUED",
        "data_mode": provider["data_mode"],
        "started_at": datetime.now(timezone.utc).isoformat(),
    }
