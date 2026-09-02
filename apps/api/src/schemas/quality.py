"""
FloodGuard AI — Data Quality Schemas
Pydantic schemas for quality evaluation reports, quarantine reviews, and flag audits.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from ..services.data_quality import QualityFlag, QualityStatus


class QualityValidationRequest(BaseModel):
    observation: dict[str, Any] = Field(description="Normalized observation payload")
    source_meta: dict[str, Any] | None = None
    recent_observations: list[dict[str, Any]] | None = None


class QualityReportResponse(BaseModel):
    flags: list[QualityFlag]
    status: QualityStatus
    score: float = Field(ge=0.0, le=1.0)
    details_by_field: dict[str, str]
    quarantine_reason: str | None = None


class QuarantineApprovalRequest(BaseModel):
    reviewer_id: str = Field(min_length=2)
    review_notes: str = Field(min_length=5)
    override_status: QualityStatus = QualityStatus.ACCEPTED_WITH_WARNING


class QuarantineApprovalResponse(BaseModel):
    observation_id: str
    previous_status: QualityStatus
    new_status: QualityStatus
    reviewer_id: str
    approved_at: datetime
    message: str


class QualitySummaryResponse(BaseModel):
    total_evaluated: int
    by_status: dict[str, int]
    common_flags: dict[str, int]
    quarantine_count: int
    mean_quality_score: float
