"""
FloodGuard AI — Base Provider Interface
Contract interface for all national and regional data providers.
Guarantees honest status reporting, quality assessment, data mode propagation,
and auditable provenance across the entire disaster intelligence pipeline.
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Optional


class ProviderStatus(str, Enum):
    OPERATIONAL = "OPERATIONAL"
    DEGRADED = "DEGRADED"
    STALE = "STALE"
    UNAVAILABLE = "UNAVAILABLE"
    NOT_CONFIGURED = "NOT_CONFIGURED"
    SIMULATION_ONLY = "SIMULATION_ONLY"


class DataMode(str, Enum):
    LIVE = "LIVE"
    HISTORICAL = "HISTORICAL"
    UPLOAD = "UPLOAD"
    SIMULATION = "SIMULATION"
    DEMO = "DEMO"
    UNAVAILABLE = "UNAVAILABLE"


class QualityStatus(str, Enum):
    VALID = "VALID"
    ACCEPTED_WITH_WARNING = "ACCEPTED_WITH_WARNING"
    QUARANTINED = "QUARANTINED"
    REJECTED = "REJECTED"


@dataclass
class ProviderHealthResult:
    provider_id: str
    status: ProviderStatus
    latency_ms: Optional[float]
    last_successful_sync: Optional[str]
    freshness_seconds: Optional[int]
    error_count: int
    data_mode: DataMode
    note: str
    checked_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@dataclass
class ProviderRecord:
    record_id: str
    source_id: str
    source_type: str
    source_url: Optional[str]
    observed_at: str
    received_at: str
    processed_at: str
    location: dict[str, Any]
    variable: str
    value: float
    unit: str
    data_mode: DataMode
    quality_status: QualityStatus
    confidence_status: str
    provenance_hash: str
    trace_id: str


class BaseProvider(ABC):
    """
    Abstract Base Class for all FloodGuard AI Data Providers.
    """

    def __init__(self, provider_id: str, name: str, expected_latency_ms: float = 250.0, freshness_limit_seconds: int = 3600):
        self.provider_id = provider_id
        self.name = name
        self.expected_latency_ms = expected_latency_ms
        self.freshness_limit_seconds = freshness_limit_seconds

    @abstractmethod
    async def health_check(self) -> ProviderHealthResult:
        """Check provider connectivity, authorization, and current status."""
        pass

    @abstractmethod
    async def fetch_latest(self, location_id: str) -> dict[str, Any]:
        """Fetch latest real-time or simulated observation for a specific location."""
        pass

    @abstractmethod
    async def fetch_historical(self, location_id: str, start_time: str, end_time: str) -> list[dict[str, Any]]:
        """Fetch historical records for retrospective analysis or replay."""
        pass

    @abstractmethod
    async def fetch_by_state(self, state_code: str) -> list[dict[str, Any]]:
        """Fetch aggregated regional telemetry for a state or Union Territory."""
        pass

    @abstractmethod
    async def fetch_by_basin(self, basin_id: str) -> list[dict[str, Any]]:
        """Fetch hydrological telemetry for an entire river basin."""
        pass

    @abstractmethod
    def normalize(self, raw_payload: dict[str, Any]) -> dict[str, Any]:
        """Normalize raw provider fields into standardized FloodGuard schema."""
        pass

    @abstractmethod
    def validate(self, normalized_payload: dict[str, Any]) -> tuple[bool, list[str]]:
        """Validate physical limits, timestamps, and geographic coordinates."""
        pass

    @abstractmethod
    def provenance(self, payload: dict[str, Any]) -> dict[str, Any]:
        """Attach auditable SHA-256 provenance and trace metadata."""
        pass

    def retry_policy(self) -> dict[str, Any]:
        """Standard retry configuration."""
        return {
            "max_retries": 3,
            "backoff_factor": 1.5,
            "timeout_seconds": 10.0,
        }
