"""
FloodGuard AI — DataSource ORM Model
Formal registry of every data provider used in the platform.
Status is NEVER set to OPERATIONAL without a successful health_check() + data retrieval.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum as SAEnum,
    Float,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID

from ..db.engine import Base


class SourceType(str, Enum):
    IMD_METEOROLOGICAL = "IMD_METEOROLOGICAL"
    CWC_HYDROLOGICAL = "CWC_HYDROLOGICAL"
    STATE_HYDROLOGY = "STATE_HYDROLOGY"
    STATE_DISASTER_MGMT = "STATE_DISASTER_MGMT"
    SATELLITE_PRECIPITATION = "SATELLITE_PRECIPITATION"
    FLOOD_MAPPING = "FLOOD_MAPPING"
    DEM_TERRAIN = "DEM_TERRAIN"
    SOIL_LAND_COVER = "SOIL_LAND_COVER"
    GLACIER_CRYOSPHERE = "GLACIER_CRYOSPHERE"
    IOT = "IOT"
    USER_UPLOAD = "USER_UPLOAD"
    HISTORICAL_ARCHIVE = "HISTORICAL_ARCHIVE"
    FIELD_REPORT = "FIELD_REPORT"
    COMMUNITY_REPORT = "COMMUNITY_REPORT"
    APPROVED_KNOWLEDGE = "APPROVED_KNOWLEDGE"


class SourceStatus(str, Enum):
    """
    OPERATIONAL: health_check passed AND data successfully retrieved.
    DEGRADED: partial data or elevated latency.
    STALE: data is beyond freshness_threshold_minutes.
    UNAVAILABLE: health_check failed.
    NOT_CONFIGURED: no credentials or endpoint configured. DEFAULT for new sources.
    SIMULATION_ONLY: demo/simulation data only; never operational.
    DISABLED: administratively disabled.
    """
    OPERATIONAL = "OPERATIONAL"
    DEGRADED = "DEGRADED"
    STALE = "STALE"
    UNAVAILABLE = "UNAVAILABLE"
    NOT_CONFIGURED = "NOT_CONFIGURED"
    SIMULATION_ONLY = "SIMULATION_ONLY"
    DISABLED = "DISABLED"


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


class DataSource(Base):
    """
    Formal registry entry for every data provider used by FloodGuard AI.
    All fields are required for production sources; demo sources may omit credentials.
    """
    __tablename__ = "data_sources"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Identity
    name = Column(String(200), nullable=False, unique=True)
    provider = Column(String(100), nullable=False)
    owner_agency = Column(String(200), nullable=True)
    source_type = Column(
        SAEnum(SourceType, name="source_type_enum"),
        nullable=False,
        default=SourceType.HISTORICAL_ARCHIVE,
    )

    # Coverage metadata
    variables = Column(JSON, nullable=False, default=list)  # list[str]
    area_coverage = Column(String(500), nullable=True)
    temporal_resolution = Column(String(100), nullable=True)  # e.g. "15-minute", "daily"
    spatial_resolution = Column(String(100), nullable=True)  # e.g. "0.25° grid"

    # Operational parameters
    expected_latency_minutes = Column(Integer, nullable=True, default=15)
    freshness_threshold_minutes = Column(Integer, nullable=True, default=60)

    # Access
    api_base_url = Column(String(500), nullable=True)
    requires_credentials = Column(Boolean, nullable=False, default=True)
    terms_license_url = Column(String(500), nullable=True)
    permitted_use = Column(Text, nullable=True)
    redistribution_rule = Column(Text, nullable=True)

    # Status — default NOT_CONFIGURED (safe default)
    status = Column(
        SAEnum(SourceStatus, name="source_status_enum"),
        nullable=False,
        default=SourceStatus.NOT_CONFIGURED,
    )
    last_success_at = Column(DateTime(timezone=True), nullable=True)
    last_failure_at = Column(DateTime(timezone=True), nullable=True)
    failure_reason = Column(Text, nullable=True)

    # Data mode
    data_mode = Column(String(50), nullable=False, default="DEMO")

    # Governance
    configured_by = Column(String(200), nullable=True)
    reviewed_by = Column(String(200), nullable=True)
    review_date = Column(DateTime(timezone=True), nullable=True)
    provenance_policy = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), nullable=False, default=_now_utc)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=_now_utc, onupdate=_now_utc)

    def __repr__(self) -> str:
        return f"<DataSource {self.name!r} status={self.status}>"
