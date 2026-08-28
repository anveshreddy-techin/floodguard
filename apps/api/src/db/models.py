"""
FloodGuard AI — Database Models
All models include created_at, updated_at, and data provenance fields.
"""
import uuid
from datetime import datetime
from enum import Enum as PyEnum

try:
    from geoalchemy2 import Geometry
except ImportError:
    # Graceful fallback to Text for local environments without geoalchemy2
    from sqlalchemy import Text as Geometry

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from .engine import Base


# ─── Enums ────────────────────────────────────────────────────────────────────

class DataMode(str, PyEnum):
    LIVE = "LIVE"
    HISTORICAL = "HISTORICAL"
    UPLOAD = "UPLOAD"
    DEMO = "DEMO"
    SIMULATION = "SIMULATION"
    REPLAY = "REPLAY"


class EvidenceState(str, PyEnum):
    OBSERVED = "OBSERVED"
    REPORTED = "REPORTED"
    MODEL_INFERRED = "MODEL_INFERRED"
    SIMULATED = "SIMULATED"
    UNAVAILABLE = "UNAVAILABLE"
    UNKNOWN = "UNKNOWN"


class DataFreshness(str, PyEnum):
    FRESH = "FRESH"
    STALE = "STALE"
    DEGRADED = "DEGRADED"
    UNAVAILABLE = "UNAVAILABLE"
    NOT_CONFIGURED = "NOT_CONFIGURED"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"


class RiskLevel(str, PyEnum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    EXTREME = "EXTREME"
    UNKNOWN = "UNKNOWN"


class AlertStatus(str, PyEnum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    ESCALATED = "ESCALATED"
    RESOLVED = "RESOLVED"
    ARCHIVED = "ARCHIVED"


class IncidentStatus(str, PyEnum):
    DETECTED = "DETECTED"
    TRIAGED = "TRIAGED"
    UNDER_INVESTIGATION = "UNDER_INVESTIGATION"
    VERIFIED = "VERIFIED"
    ACTIVE_RESPONSE = "ACTIVE_RESPONSE"
    CONTAINED = "CONTAINED"
    RECOVERY = "RECOVERY"
    CLOSED = "CLOSED"
    ARCHIVED = "ARCHIVED"


class DeviceStatus(str, PyEnum):
    ONLINE = "ONLINE"
    STALE = "STALE"
    OFFLINE = "OFFLINE"
    NEVER_SEEN = "NEVER_SEEN"
    MAINTENANCE = "MAINTENANCE"
    DECOMMISSIONED = "DECOMMISSIONED"
    UNKNOWN = "UNKNOWN"


class UserRole(str, PyEnum):
    ADMIN = "ADMIN"
    AUTHORITY_OPERATOR = "AUTHORITY_OPERATOR"
    ANALYST = "ANALYST"
    FIELD_OFFICER = "FIELD_OFFICER"
    RESEARCHER = "RESEARCHER"
    VIEWER = "VIEWER"


# ─── Mixins ───────────────────────────────────────────────────────────────────

class TimestampMixin:
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class ProvenanceMixin:
    data_mode = Column(String(20), nullable=False, default=DataMode.DEMO.value)
    source = Column(String(200), nullable=True)
    source_reference = Column(String(500), nullable=True)


# ─── Users ────────────────────────────────────────────────────────────────────

class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(30), nullable=False, default=UserRole.VIEWER.value)
    is_active = Column(Boolean, nullable=False, default=True)
    last_login_at = Column(DateTime(timezone=True), nullable=True)

    audit_logs = relationship("AuditLog", back_populates="user", lazy="dynamic")


# ─── Geography ────────────────────────────────────────────────────────────────

class AdminRegion(Base, TimestampMixin):
    __tablename__ = "admin_regions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    region_type = Column(String(30), nullable=False)
    name = Column(String(255), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=True)
    block = Column(String(100), nullable=True)
    lgd_code = Column(String(20), nullable=True, index=True)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("admin_regions.id"), nullable=True)
    geom = Column(Geometry, nullable=True)
    centroid = Column(Geometry, nullable=True)
    elevation_m = Column(Float, nullable=True)
    area_km2 = Column(Float, nullable=True)
    population = Column(Integer, nullable=True)
    population_source = Column(String(100), nullable=True)
    meta = Column(JSONB, nullable=True, default=dict)

    children = relationship("AdminRegion", foreign_keys=[parent_id])
    risk_assessments = relationship("RiskAssessment", back_populates="location")


class Watershed(Base, TimestampMixin):
    __tablename__ = "watersheds"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=True, unique=True, index=True)
    river_basin = Column(String(100), nullable=True)
    area_km2 = Column(Float, nullable=True)
    geom = Column(Geometry, nullable=True)
    centroid = Column(Geometry, nullable=True)
    mean_elevation_m = Column(Float, nullable=True)
    max_elevation_m = Column(Float, nullable=True)
    source = Column(String(200), nullable=True)
    meta = Column(JSONB, nullable=True, default=dict)


class RiverSegment(Base, TimestampMixin):
    __tablename__ = "river_segments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    river_system = Column(String(100), nullable=True)
    watershed_id = Column(UUID(as_uuid=True), ForeignKey("watersheds.id"), nullable=True)
    upstream_segment_id = Column(UUID(as_uuid=True), ForeignKey("river_segments.id"), nullable=True)
    geom = Column(Geometry, nullable=True)
    order_strahler = Column(Integer, nullable=True)
    length_km = Column(Float, nullable=True)
    source = Column(String(200), nullable=True)
    meta = Column(JSONB, nullable=True, default=dict)

    watershed = relationship("Watershed")


# ─── Observations ─────────────────────────────────────────────────────────────

class RainfallObservation(Base, ProvenanceMixin, TimestampMixin):
    __tablename__ = "rainfall_observations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("admin_regions.id"), nullable=True, index=True)
    watershed_id = Column(UUID(as_uuid=True), ForeignKey("watersheds.id"), nullable=True, index=True)
    station_code = Column(String(50), nullable=True, index=True)
    observed_at = Column(DateTime(timezone=True), nullable=False, index=True)
    received_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    geom = Column(Geometry, nullable=True)
    rainfall_mm = Column(Float, nullable=True)
    duration_hours = Column(Float, nullable=True)
    intensity_mmph = Column(Float, nullable=True)
    quality_flag = Column(String(30), nullable=True)
    evidence_state = Column(String(20), nullable=False, default=EvidenceState.OBSERVED.value)
    meta = Column(JSONB, nullable=True, default=dict)


class RiverLevelObservation(Base, ProvenanceMixin, TimestampMixin):
    __tablename__ = "river_level_observations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    station_code = Column(String(50), nullable=False, index=True)
    station_name = Column(String(255), nullable=True)
    river_segment_id = Column(UUID(as_uuid=True), ForeignKey("river_segments.id"), nullable=True)
    observed_at = Column(DateTime(timezone=True), nullable=False, index=True)
    received_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    geom = Column(Geometry, nullable=True)
    level_m = Column(Float, nullable=True)
    discharge_cumecs = Column(Float, nullable=True)
    danger_level_m = Column(Float, nullable=True)
    warning_level_m = Column(Float, nullable=True)
    rate_of_rise_mph = Column(Float, nullable=True)
    quality_flag = Column(String(30), nullable=True)
    evidence_state = Column(String(20), nullable=False, default=EvidenceState.OBSERVED.value)
    meta = Column(JSONB, nullable=True, default=dict)


class SoilMoistureObservation(Base, ProvenanceMixin, TimestampMixin):
    __tablename__ = "soil_moisture_observations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("admin_regions.id"), nullable=True)
    watershed_id = Column(UUID(as_uuid=True), ForeignKey("watersheds.id"), nullable=True)
    observed_at = Column(DateTime(timezone=True), nullable=False, index=True)
    received_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    geom = Column(Geometry, nullable=True)
    soil_moisture_pct = Column(Float, nullable=True)
    saturation_index = Column(Float, nullable=True)
    depth_cm = Column(Float, nullable=True)
    quality_flag = Column(String(30), nullable=True)
    evidence_state = Column(String(20), nullable=False, default=EvidenceState.MODEL_INFERRED.value)
    meta = Column(JSONB, nullable=True, default=dict)


# ─── IoT Devices ──────────────────────────────────────────────────────────────

class IoTDevice(Base, TimestampMixin):
    __tablename__ = "iot_devices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    device_id = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    device_type = Column(String(50), nullable=False)
    location_id = Column(UUID(as_uuid=True), ForeignKey("admin_regions.id"), nullable=True)
    watershed_id = Column(UUID(as_uuid=True), ForeignKey("watersheds.id"), nullable=True)
    geom = Column(Geometry, nullable=True)
    elevation_m = Column(Float, nullable=True)
    status = Column(String(30), nullable=False, default=DeviceStatus.NEVER_SEEN.value)
    hashed_secret = Column(String(255), nullable=False)
    last_seen_at = Column(DateTime(timezone=True), nullable=True)
    last_sequence = Column(Integer, nullable=True, default=0)
    battery_pct = Column(Float, nullable=True)
    meta = Column(JSONB, nullable=True, default=dict)

    readings = relationship("IoTReading", back_populates="device", lazy="dynamic")


class IoTReading(Base, ProvenanceMixin, TimestampMixin):
    __tablename__ = "iot_readings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    device_id = Column(UUID(as_uuid=True), ForeignKey("iot_devices.id"), nullable=False, index=True)
    observed_at = Column(DateTime(timezone=True), nullable=False, index=True)
    received_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    sequence = Column(Integer, nullable=False)
    measurement_type = Column(String(50), nullable=False)
    value = Column(Float, nullable=True)
    unit = Column(String(20), nullable=True)
    quality_flag = Column(String(30), nullable=True)
    is_duplicate = Column(Boolean, nullable=False, default=False)
    meta = Column(JSONB, nullable=True, default=dict)

    device = relationship("IoTDevice", back_populates="readings")

    __table_args__ = (
        UniqueConstraint("device_id", "sequence", name="uq_device_sequence"),
    )


# ─── Risk Assessment ──────────────────────────────────────────────────────────

class RiskAssessment(Base, ProvenanceMixin, TimestampMixin):
    __tablename__ = "risk_assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("admin_regions.id"), nullable=False, index=True)
    watershed_id = Column(UUID(as_uuid=True), ForeignKey("watersheds.id"), nullable=True)
    assessed_at = Column(DateTime(timezone=True), nullable=False, index=True)
    valid_until = Column(DateTime(timezone=True), nullable=True)
    forecast_horizon_hours = Column(Float, nullable=True)

    risk_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    confidence = Column(String(20), nullable=False)
    uncertainty = Column(String(20), nullable=False)

    rainfall_risk = Column(Float, nullable=True)
    soil_risk = Column(Float, nullable=True)
    terrain_risk = Column(Float, nullable=True)
    river_risk = Column(Float, nullable=True)
    historical_risk = Column(Float, nullable=True)

    contributors = Column(JSONB, nullable=True, default=list)
    evidence = Column(JSONB, nullable=True, default=list)
    explanation = Column(JSONB, nullable=True, default=dict)
    data_gaps = Column(JSONB, nullable=True, default=list)
    limitations = Column(JSONB, nullable=True, default=list)

    model_version = Column(String(50), nullable=True)
    feature_snapshot = Column(JSONB, nullable=True, default=dict)

    data_sources_used = Column(JSONB, nullable=True, default=list)
    data_freshness = Column(String(30), nullable=True)

    location = relationship("AdminRegion", back_populates="risk_assessments")
    alerts = relationship("Alert", back_populates="risk_assessment")


# ─── Alerts ───────────────────────────────────────────────────────────────────

class Alert(Base, ProvenanceMixin, TimestampMixin):
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    alert_type = Column(String(50), nullable=False)
    severity = Column(String(20), nullable=False)
    status = Column(String(30), nullable=False, default=AlertStatus.DRAFT.value)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)

    location_id = Column(UUID(as_uuid=True), ForeignKey("admin_regions.id"), nullable=True)
    watershed_id = Column(UUID(as_uuid=True), ForeignKey("watersheds.id"), nullable=True)
    risk_assessment_id = Column(UUID(as_uuid=True), ForeignKey("risk_assessments.id"), nullable=True)
    affected_area = Column(Geometry, nullable=True)

    activated_at = Column(DateTime(timezone=True), nullable=True)
    acknowledged_at = Column(DateTime(timezone=True), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)

    evidence = Column(JSONB, nullable=True, default=list)
    uncertainty = Column(String(20), nullable=True)
    operator_notes = Column(Text, nullable=True)
    meta = Column(JSONB, nullable=True, default=dict)

    risk_assessment = relationship("RiskAssessment", back_populates="alerts")
    incident = relationship("Incident", back_populates="alert", uselist=False)


# ─── Incidents ────────────────────────────────────────────────────────────────

class Incident(Base, ProvenanceMixin, TimestampMixin):
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    alert_id = Column(UUID(as_uuid=True), ForeignKey("alerts.id"), nullable=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(30), nullable=False, default=IncidentStatus.DETECTED.value)
    severity = Column(String(20), nullable=False)

    location_id = Column(UUID(as_uuid=True), ForeignKey("admin_regions.id"), nullable=True)
    commander_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    detected_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    verified_at = Column(DateTime(timezone=True), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    evidence = Column(JSONB, nullable=True, default=list)
    known_facts = Column(JSONB, nullable=True, default=list)
    unknown_facts = Column(JSONB, nullable=True, default=list)
    timeline = Column(JSONB, nullable=True, default=list)
    meta = Column(JSONB, nullable=True, default=dict)

    alert = relationship("Alert", back_populates="incident")
    tasks = relationship("IncidentTask", back_populates="incident")
    field_reports = relationship("FieldReport", back_populates="incident")


class IncidentTask(Base, TimestampMixin):
    __tablename__ = "incident_tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default="PENDING")
    assigned_to_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    due_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    incident = relationship("Incident", back_populates="tasks")


class FieldReport(Base, ProvenanceMixin, TimestampMixin):
    __tablename__ = "field_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=False)
    reporter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    report_type = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    geom = Column(Geometry, nullable=True)
    reported_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    meta = Column(JSONB, nullable=True, default=dict)

    incident = relationship("Incident", back_populates="field_reports")


# ─── Audit Log ────────────────────────────────────────────────────────────────

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    actor_email = Column(String(255), nullable=True)
    actor_role = Column(String(30), nullable=True)
    action = Column(String(100), nullable=False, index=True)
    entity_type = Column(String(100), nullable=True, index=True)
    entity_id = Column(String(100), nullable=True, index=True)
    before_state = Column(JSONB, nullable=True)
    after_state = Column(JSONB, nullable=True)
    reason = Column(Text, nullable=True)
    trace_id = Column(String(100), nullable=True, index=True)
    data_mode = Column(String(20), nullable=True)
    occurred_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    ip_address = Column(String(50), nullable=True)
    meta = Column(JSONB, nullable=True, default=dict)

    user = relationship("User", back_populates="audit_logs")


# ─── Simulation & Upload ───────────────────────────────────────────────────────

class DataUpload(Base, TimestampMixin):
    __tablename__ = "data_uploads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    uploader_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    filename = Column(String(500), nullable=False)
    data_type = Column(String(50), nullable=False)
    status = Column(String(30), nullable=False, default="UPLOADED")
    total_rows = Column(Integer, nullable=True)
    accepted_rows = Column(Integer, nullable=True, default=0)
    rejected_rows = Column(Integer, nullable=True, default=0)
    quarantined_rows = Column(Integer, nullable=True, default=0)
    warning_rows = Column(Integer, nullable=True, default=0)
    validation_report = Column(JSONB, nullable=True, default=dict)
    file_path = Column(String(1000), nullable=True)
    file_hash = Column(String(64), nullable=True)
    file_size_bytes = Column(Integer, nullable=True)
    meta = Column(JSONB, nullable=True, default=dict)


class SimulationScenario(Base, TimestampMixin):
    __tablename__ = "simulation_scenarios"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    location_id = Column(UUID(as_uuid=True), ForeignKey("admin_regions.id"), nullable=True)
    parameters = Column(JSONB, nullable=False, default=dict)
    results = Column(JSONB, nullable=True, default=dict)
    status = Column(String(30), nullable=False, default="DRAFT")
    data_mode = Column(String(20), nullable=False, default=DataMode.SIMULATION.value)
    run_at = Column(DateTime(timezone=True), nullable=True)
    seed = Column(Integer, nullable=True)
    scenario_type = Column(String(50), nullable=True)
