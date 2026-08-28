"""
FloodGuard AI V9 — Event Memory, Evidence Claims & Fingerprints
Supports multi-event memory, versioned claims, and leave-one-event-out benchmarks.
"""
from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
import uuid


class EventEvidenceClaim(BaseModel):
    claim_id: str = Field(default_factory=lambda: f"clm-{uuid.uuid4().hex[:8]}")
    event_id: str
    source: str
    publication_time: str
    retrieval_time: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    claim: str
    claim_type: str  # CASUALTY, DAMAGE, CAUSE, LOCATION, TIMING, IMPACT
    confidence: str  # LOW, MEDIUM, HIGH, INSUFFICIENT_DATA
    verification_status: str  # PRELIMINARY, REPORTED, CORROBORATED, VERIFIED, DISPUTED, SUPERSEDED


class EventFingerprint(BaseModel):
    fingerprint_id: str = Field(default_factory=lambda: f"fp-{uuid.uuid4().hex[:8]}")
    rainfall_peak_intensity_mmh: float
    antecedent_precipitation_index: float
    catchment_area_sqkm: float
    average_slope_deg: float
    elevation_drop_m: float
    river_stage_rise_rate_mh: float
    hazard_chain_signature: List[str]
    geology_type: str


class EventMemory(BaseModel):
    event_id: str
    event_name: str
    event_type: str  # FLASH_FLOOD, GLOF, DEBRIS_FLOOD, RIVER_FLOOD, LANDSLIDE_TRIGGERED
    status: str = "HISTORICAL"  # ACTIVE, MONITORING, RECOVERY, HISTORICAL
    start_time: str
    end_time: Optional[str] = None
    country: str
    region: str
    lat: float
    lon: float
    watershed: Optional[str] = None
    river: Optional[str] = None
    hazard_chain: List[str]
    cause_primary: str
    cause_contributing: List[str] = []
    cause_confidence: str = "HIGH"
    data_availability_before_event: str
    key_facts: List[Dict[str, str]] = []
    evidence_claims: List[EventEvidenceClaim] = []
    lessons: List[str] = []
    source_version: str = "v1.0"
    review_status: str = "VERIFIED"  # PRELIMINARY, REPORTED, CORROBORATED, VERIFIED
    model_teachable: bool = True
    fingerprint: Optional[EventFingerprint] = None


class EventBenchmarkMetrics(BaseModel):
    event_id: str
    event_name: str
    year: int
    detection: Optional[bool] = None
    lead_time_minutes: Optional[int] = None
    false_alarms: Optional[int] = None
    missed_detections: Optional[int] = None
    data_completeness_pct: Optional[float] = None
    uncertainty_calibrated: Optional[bool] = None
    note: str
