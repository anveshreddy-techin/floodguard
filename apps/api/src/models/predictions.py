"""
FloodGuard AI V9 — Prediction Memory & Snapshots
Append-only, immutable prediction records with full knowledge snapshot.
"""
from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
import uuid


class KnowledgeSnapshot(BaseModel):
    snapshot_id: str = Field(default_factory=lambda: f"ks-{uuid.uuid4().hex[:8]}")
    prediction_id: str
    snapshot_time: datetime = Field(default_factory=datetime.utcnow)
    available_observations: List[Dict[str, Any]] = []
    available_sources: List[str] = []
    available_forecasts: List[str] = []
    terrain_data_version: str = "DEM_SRTM_30M_v1"
    sensor_data: List[Dict[str, Any]] = []
    data_gaps: List[str] = []
    model_state: str = "LOADED_OK"


class PredictionRecord(BaseModel):
    prediction_id: str = Field(default_factory=lambda: f"pred-{uuid.uuid4().hex[:8]}")
    location_id: str
    geography_level: str = "MICRO_WATERSHED"
    prediction_time: datetime = Field(default_factory=datetime.utcnow)
    forecast_horizon_minutes: int = 60
    risk_score: float
    risk_level: str  # LOW, MODERATE, HIGH, EXTREME
    confidence: str  # LOW, MEDIUM, HIGH, INSUFFICIENT_DATA
    uncertainty: str # LOW, MEDIUM, HIGH, INSUFFICIENT_DATA
    model_version: str = "rule_based_baseline_v1"
    feature_version: str = "feat_v1.2"
    threshold_version: str = "ndma_cwc_v1"
    data_snapshot_id: str
    source_snapshot_id: Optional[str] = None
    explanation_id: Optional[str] = None
    alert_id: Optional[str] = None
    event_id: Optional[str] = None
    data_mode: str = "DEMO"  # LIVE, HISTORICAL, UPLOAD, DEMO, SIMULATION, REPLAY, HINDCAST
    created_at: datetime = Field(default_factory=datetime.utcnow)
    explanation_summary: Optional[str] = None
    is_immutable: bool = True


class PredictionTimelineStep(BaseModel):
    timestamp: str
    risk_score: float
    risk_level: str
    uncertainty: str
    previous_risk_level: Optional[str] = None
    reason: Optional[str] = None
    data_change: Optional[str] = None
    model_version: str = "rule_based_baseline_v1"


class PredictionLedgerEntry(BaseModel):
    prediction_id: str
    when: str
    where: str
    location_id: str
    risk_level: str
    risk_score: float
    uncertainty: str
    model_version: str
    data_mode: str
    what_happened_later: Optional[str] = None
    outcome_verified: bool = False
    evidence_count: int = 4
