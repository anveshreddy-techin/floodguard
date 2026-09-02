"""
FloodGuard AI — Feature Snapshot ORM Model
Reproducible, versioned feature vectors for ML training and inference.
Strict future-leakage prevention: observed_data_cutoff_at is the hard boundary.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, Integer, JSON, String
from sqlalchemy.dialects.postgresql import UUID

from ..db.engine import Base


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


class FeatureSnapshot(Base):
    """
    A versioned snapshot of all ML features for a location at a point in time.
    All features use ONLY data with observed_at <= observed_data_cutoff_at.
    """
    __tablename__ = "feature_snapshots"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Scope
    location_id = Column(String(200), nullable=False, index=True)
    watershed_id = Column(String(200), nullable=True, index=True)

    # Timing (leakage prevention — all features must be from data <= observed_data_cutoff_at)
    feature_timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    generated_at = Column(DateTime(timezone=True), nullable=False, default=_now_utc)
    observed_data_cutoff_at = Column(DateTime(timezone=True), nullable=False)

    # Versioning and provenance
    feature_version = Column(String(50), nullable=False, default="v1.0")
    input_source_ids = Column(JSON, nullable=False, default=list)  # list[str]
    input_observation_ids = Column(JSON, nullable=False, default=list)  # list[str]

    # Data quality summary
    data_mode = Column(String(50), nullable=False, default="DEMO")
    quality_summary = Column(JSON, nullable=False, default=dict)  # per-feature quality
    missing_fraction = Column(Float, nullable=False, default=0.0)
    stale_source_count = Column(Integer, nullable=False, default=0)
    source_agreement_score = Column(Float, nullable=True)  # 0.0–1.0 if multiple sources

    # The actual feature vector (all feature categories combined)
    feature_payload = Column(JSON, nullable=False, default=dict)

    # Lineage
    trace_id = Column(String(100), nullable=False, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime(timezone=True), nullable=False, default=_now_utc)

    def __repr__(self) -> str:
        return (
            f"<FeatureSnapshot {self.location_id} "
            f"at {self.feature_timestamp} v={self.feature_version}>"
        )
