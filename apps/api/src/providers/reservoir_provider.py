"""
FloodGuard AI — Reservoir / Dam Monitoring Provider
Interfaces for major dam water levels, storage, inflow, and spillway status.
Aggregated from CWC Reservoir Monitoring + State Irrigation Departments.
"""
import hashlib
import json
import uuid
from datetime import datetime, timezone
from typing import Any

from .base import BaseProvider, DataMode, ProviderHealthResult, ProviderStatus


class ReservoirProvider(BaseProvider):
    def __init__(self):
        super().__init__(
            provider_id="reservoir_cwc",
            name="Reservoir & Dam Monitoring (CWC / State Irrigation)",
            expected_latency_ms=900.0,
            freshness_limit_seconds=7200,
        )
        self.is_configured = False

    async def health_check(self) -> ProviderHealthResult:
        return ProviderHealthResult(
            provider_id=self.provider_id,
            status=ProviderStatus.NOT_CONFIGURED,
            latency_ms=None,
            last_successful_sync=None,
            freshness_seconds=None,
            error_count=0,
            data_mode=DataMode.DEMO,
            note="CWC Reservoir Monitoring API not configured. State irrigation feeds not configured.",
        )

    async def fetch_latest(self, reservoir_id: str) -> dict[str, Any]:
        return {
            "status": "NOT_CONFIGURED",
            "source": "reservoir_cwc_adapter",
            "data_mode": DataMode.DEMO.value,
            "reservoir_id": reservoir_id,
            "current_level_m": 380.5,
            "full_reservoir_level_m": 395.0,
            "percent_full": 72.5,
            "live_inflow_cumecs": 1850.0,
            "live_outflow_cumecs": 1200.0,
            "spillway_status": "CLOSED",
            "note": "Reservoir telemetry not configured. Deterministic demo values returned.",
            "retrieved_at": datetime.now(timezone.utc).isoformat(),
        }

    async def fetch_historical(self, reservoir_id: str, start_time: str, end_time: str) -> list[dict[str, Any]]:
        return []

    async def fetch_by_state(self, state_code: str) -> list[dict[str, Any]]:
        return [{"state": state_code, "major_reservoirs": 8, "data_mode": DataMode.DEMO.value}]

    async def fetch_by_basin(self, basin_id: str) -> list[dict[str, Any]]:
        return [{"basin_id": basin_id, "aggregate_storage_pct": 64.2, "data_mode": DataMode.DEMO.value}]

    def normalize(self, raw_payload: dict[str, Any]) -> dict[str, Any]:
        return raw_payload

    def validate(self, normalized_payload: dict[str, Any]) -> tuple[bool, list[str]]:
        return (True, [])

    def provenance(self, payload: dict[str, Any]) -> dict[str, Any]:
        return {
            "provenance_hash": hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest(),
            "provider": self.provider_id,
            "processed_at": datetime.now(timezone.utc).isoformat(),
            "trace_id": str(uuid.uuid4()),
        }


reservoir_provider = ReservoirProvider()
