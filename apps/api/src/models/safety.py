"""
FloodGuard AI V9 — User Location, Exposure & Safety Guidance Models
Zero silent tracking, permission-gated, conservative candidate guidance.
"""
from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
import uuid


class OfficialAlert(BaseModel):
    alert_id: str = Field(default_factory=lambda: f"off-{uuid.uuid4().hex[:8]}")
    source: str
    source_type: str = "GOVERNMENT"  # GOVERNMENT, NDMA, IMD, DHM_NEPAL, LOCAL_AUTHORITY, DEMO
    severity: str = "HIGH"  # LOW, MODERATE, HIGH, EXTREME
    title: str
    message: str
    issued_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    expires_at: Optional[str] = None
    area_description: str
    is_evacuation_order: bool = False
    verification_status: str = "VERIFIED"
    url: Optional[str] = None


class GuidanceRoute(BaseModel):
    route_id: str = Field(default_factory=lambda: f"rt-{uuid.uuid4().hex[:8]}")
    name: str
    confidence: str = "MEDIUM"  # HIGH, MEDIUM, LOW, NOT_VERIFIED
    road_data_freshness_minutes: int = 5
    hazard_overlap: bool = False
    bridge_status: str = "CLEAR"  # CLEAR, FLOODED, BLOCKED, UNKNOWN
    verification_status: str = "CANDIDATE"
    label: str = "CANDIDATE_ROUTE"  # CANDIDATE_ROUTE, LOWER_EXPOSURE_CANDIDATE, ROUTE_SAFETY_NOT_VERIFIED, BLOCKED
    distance_km: Optional[float] = None
    note: Optional[str] = None


class UserExposure(BaseModel):
    exposure_status: str = "OUTSIDE_RISK_AREA"  # OUTSIDE_RISK_AREA, NEAR_RISK_AREA, INSIDE_RISK_AREA, INSIDE_HIGH_RISK_AREA, INSIDE_EXTREME_RISK_AREA, UNKNOWN
    risk_level: str = "LOW"
    distance_to_hazard_km: Optional[float] = None
    hazard_type: Optional[str] = None
    data_freshness_minutes: int = 4
    confidence: str = "MEDIUM"
    approaching_risk: bool = False
    leaving_risk: bool = False
    location_accuracy_ok: bool = True
    official_alert_active: bool = False
    guidance_level: int = 0  # 0: MONITOR, 1: STAY ALERT, 2: MOVE AWAY, 3: MOVE TO SHELTER, 4: OFFICIAL EVAC
    why: List[str] = []
    computed_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class SafetyGuidance(BaseModel):
    guidance_id: str = Field(default_factory=lambda: f"gd-{uuid.uuid4().hex[:8]}")
    level: int = 0
    level_label: str = "MONITOR"
    risk_level: str = "LOW"
    exposure: UserExposure
    primary_message: str
    why_messages: List[str] = []
    candidate_routes: List[GuidanceRoute] = []
    official_alerts: List[OfficialAlert] = []
    shelters: List[Dict[str, Any]] = []
    data_freshness_minutes: int = 4
    confidence: str = "MEDIUM"
    is_degraded: bool = False
    degradation_reason: Optional[str] = None
    disclaimer: str = (
        "DECISION-SUPPORT GUIDANCE ONLY. This model-estimated guidance does not replace "
        "official emergency directives, local authority orders, or on-ground physical inspection."
    )
    computed_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class UserSafetySession(BaseModel):
    session_id: str = Field(default_factory=lambda: f"ses-{uuid.uuid4().hex[:8]}")
    mode: str = "DEMO"  # LIVE_DEVICE_LOCATION, APPROXIMATE, MANUAL, SAVED, UNAVAILABLE, DEMO
    lat: Optional[float] = 30.505
    lon: Optional[float] = 79.155
    accuracy_m: Optional[float] = 15.0
    monitoring_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    last_ping: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class CommunityReport(BaseModel):
    report_id: str = Field(default_factory=lambda: f"rep-{uuid.uuid4().hex[:8]}")
    report_type: str  # ROUTE_BLOCKED, SHELTER_FULL, RISK_NOT_PRESENT, WARNING_RECEIVED, WARNING_MISSED, LOCATION_INACCURATE, RESCUE_NEEDED
    lat: float
    lon: float
    description: str
    people_count: Optional[int] = None
    medical_urgency: bool = False
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    verification_status: str = "UNVERIFIED"  # UNVERIFIED, UNDER_REVIEW, CORROBORATED, VERIFIED, REJECTED
