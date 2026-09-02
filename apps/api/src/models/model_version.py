"""
FloodGuard AI — ModelVersion ORM Model
Full model governance registry. Promotion requires authorized reviewer,
completed evaluation, and artifact integrity check.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import Column, DateTime, JSON, String, Text
from sqlalchemy.dialects.postgresql import UUID

from ..db.engine import Base


class DeploymentStatus(str, Enum):
    """
    TRAINED: model file exists, no evaluation yet.
    VALIDATION_PENDING: evaluation requested, not completed.
    RESEARCH_VALIDATED: passed research-grade evaluation, not yet pilot-approved.
    PILOT_APPROVED: approved for limited pilot deployment by authorized reviewer.
    DEMO_ONLY: prototype; cannot be promoted to operational.
    DEPLOYED: active operational model.
    RETIRED: replaced or withdrawn.
    FAILED: training or evaluation failed.
    """
    TRAINED = "TRAINED"
    VALIDATION_PENDING = "VALIDATION_PENDING"
    RESEARCH_VALIDATED = "RESEARCH_VALIDATED"
    PILOT_APPROVED = "PILOT_APPROVED"
    DEMO_ONLY = "DEMO_ONLY"
    DEPLOYED = "DEPLOYED"
    RETIRED = "RETIRED"
    FAILED = "FAILED"


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


class ModelVersion(Base):
    """
    Complete governance record for every trained model version.
    Promotion between statuses is gated and audited.
    """
    __tablename__ = "model_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Identity
    name = Column(String(200), nullable=False)
    semantic_version = Column(String(50), nullable=False)  # e.g. "1.0.0-demo"
    model_type = Column(String(100), nullable=False)  # TRANSPARENT_BASELINE|LOGISTIC|RANDOM_FOREST|etc.
    target = Column(String(200), nullable=False)  # FLASH_FLOOD_30MIN|RIVER_WARNING|etc.

    # Applicability
    region = Column(String(200), nullable=True)
    watershed_applicability = Column(JSON, nullable=False, default=list)  # list[str]

    # Versioning
    feature_version = Column(String(50), nullable=False)
    label_version = Column(String(50), nullable=False)

    # Training data
    training_dataset_manifest = Column(JSON, nullable=True)
    training_period_start = Column(DateTime(timezone=True), nullable=True)
    training_period_end = Column(DateTime(timezone=True), nullable=True)
    validation_period_start = Column(DateTime(timezone=True), nullable=True)
    validation_period_end = Column(DateTime(timezone=True), nullable=True)

    # Evaluation
    evaluation_report = Column(JSON, nullable=True)  # Full EvaluationReport as dict

    # Artifacts
    artifact_uri = Column(String(500), nullable=True)
    artifact_checksum = Column(String(100), nullable=True)  # SHA-256

    # Configuration
    training_configuration = Column(JSON, nullable=True)
    thresholds = Column(JSON, nullable=False, default=dict)
    calibration = Column(JSON, nullable=True)

    # Governance
    deployment_status = Column(
        String(50), nullable=False, default=DeploymentStatus.TRAINED.value
    )
    reviewer = Column(String(200), nullable=True)
    approval_date = Column(DateTime(timezone=True), nullable=True)
    limitations = Column(Text, nullable=False, default="Not evaluated.")

    # Timestamps
    created_at = Column(DateTime(timezone=True), nullable=False, default=_now_utc)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=_now_utc, onupdate=_now_utc)

    def __repr__(self) -> str:
        return f"<ModelVersion {self.name!r} v={self.semantic_version} status={self.deployment_status}>"
