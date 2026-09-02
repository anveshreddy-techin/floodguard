"""
FloodGuard AI — Source Observation ORM Model
Archived raw and normalized observations from all data providers.
Three timestamps are preserved: observed_at, received_at, processed_at.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import Column, DateTime, Float, ForeignKey, JSON, String, Text
from sqlalchemy.dialects.postgresql import UUID

from ..db.engine import Base


class ObservationQualityStatus(str, Enum):
    ACCEPTED = "ACCEPTED"
    ACCEPTED_WITH_WARNING = "ACCEPTED_WITH_WARNING"
    QUARANTINED = "QUARANTINED"
    REJECTED = "REJECTED"


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


class SourceObservation(Base):
    """
    Archived observation record. All three timestamps must be present.
    Quarantined observations cannot influence operational predictions.
    """
    __tablename__ = "source_observations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_id = Column(UUID(as_uuid=True), ForeignKey("data_sources.id"), nullable=False, index=True)

    # Three mandatory timestamps
    observed_at = Column(DateTime(timezone=True), nullable=False, index=True)
    received_at = Column(DateTime(timezone=True), nullable=False)
    processed_at = Column(DateTime(timezone=True), nullable=False, default=_now_utc)

    # Location
    location_id = Column(String(200), nullable=True, index=True)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)

    # Observation
    variable_name = Column(String(100), nullable=False)
    value = Column(Float, nullable=False)
    unit = Column(String(50), nullable=False)

    # Raw payload preserved for audit
    raw_payload = Column(JSON, nullable=True)

    # Quality
    quality_status = Column(
        String(50), nullable=False, default=ObservationQualityStatus.ACCEPTED.value
    )
    quality_flags = Column(JSON, nullable=False, default=list)  # list[str]

    # Lineage
    data_mode = Column(String(50), nullable=False, default="DEMO")
    trace_id = Column(String(100), nullable=False, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime(timezone=True), nullable=False, default=_now_utc)

    def __repr__(self) -> str:
        return f"<SourceObservation {self.variable_name}={self.value} at {self.observed_at}>"
