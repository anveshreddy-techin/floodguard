"""
FloodGuard AI — AnalysisRun ORM Model
Records every reproducible analysis run for audit and reproducibility.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import Column, DateTime, ForeignKey, JSON, String, Text
from sqlalchemy.dialects.postgresql import UUID

from ..db.engine import Base


class RunStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


class AnalysisRun(Base):
    """
    Reproducible analysis run record tying together:
    user, data, model version, and output predictions.
    """
    __tablename__ = "analysis_runs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Inputs
    user_id = Column(String(200), nullable=False)
    location_id = Column(String(200), nullable=False)
    uploaded_dataset_ids = Column(JSON, nullable=False, default=list)
    time_range_start = Column(DateTime(timezone=True), nullable=True)
    time_range_end = Column(DateTime(timezone=True), nullable=True)

    # Model & feature versioning
    model_version_id = Column(UUID(as_uuid=True), ForeignKey("model_versions.id"), nullable=True)
    feature_version = Column(String(50), nullable=True)
    threshold_version = Column(String(50), nullable=True)

    # Data mode
    data_mode = Column(String(50), nullable=False, default="DEMO")

    # Status
    result_status = Column(String(50), nullable=False, default=RunStatus.PENDING.value)

    # Outputs
    quality_report_id = Column(String(200), nullable=True)
    input_hashes = Column(JSON, nullable=False, default=dict)  # {dataset_id: sha256}
    prediction_ids = Column(JSON, nullable=False, default=list)

    # Limitations
    limitations = Column(Text, nullable=True)

    # Lineage
    created_at = Column(DateTime(timezone=True), nullable=False, default=_now_utc)
    trace_id = Column(String(100), nullable=False, default=lambda: str(uuid.uuid4()))

    def __repr__(self) -> str:
        return f"<AnalysisRun {self.id} status={self.result_status}>"
