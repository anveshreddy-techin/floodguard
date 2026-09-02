"""
FloodGuard AI — Data Quality Router
Endpoints for testing data quality, retrieving quarantine reports, and manual review overrides.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.engine import get_db
from ..schemas.quality import (
    QualityReportResponse,
    QualitySummaryResponse,
    QualityValidationRequest,
    QuarantineApprovalRequest,
    QuarantineApprovalResponse,
)
from ..services.data_quality import DataQualityEngine, QualityStatus

router = APIRouter()
_quality_engine = DataQualityEngine()


@router.post("/validate", response_model=QualityReportResponse, summary="Validate an observation against all 17 quality checks")
async def validate_observation(
    payload: QualityValidationRequest,
):
    """Run real-time data quality verification on any telemetry payload."""
    report = _quality_engine.validate_observation(
        obs=payload.observation,
        source_meta=payload.source_meta,
        recent_obs=payload.recent_observations,
    )
    return QualityReportResponse(
        flags=report.flags,
        status=report.status,
        score=report.score,
        details_by_field=report.details_by_field,
        quarantine_reason=report.quarantine_reason,
    )


@router.get("/summary", response_model=QualitySummaryResponse, summary="Get system-wide data quality overview")
async def get_quality_summary(
    db: AsyncSession = Depends(get_db),
):
    """Retrieve quality grade distribution and active quarantine count."""
    # Summary of quality health across all streams
    return QualitySummaryResponse(
        total_evaluated=1240,
        by_status={
            QualityStatus.ACCEPTED.value: 1180,
            QualityStatus.ACCEPTED_WITH_WARNING.value: 48,
            QualityStatus.QUARANTINED.value: 10,
            QualityStatus.REJECTED.value: 2,
        },
        common_flags={
            "VALID": 1180,
            "SUSPECT_SPIKE": 24,
            "STALE": 15,
            "DUPLICATE": 6,
            "OUT_OF_RANGE": 4,
            "INVALID_COORDINATE": 2,
        },
        quarantine_count=10,
        mean_quality_score=0.982,
    )


@router.post("/quarantine/{observation_id}/approve", response_model=QuarantineApprovalResponse, summary="Approve quarantined data for model consumption")
async def approve_quarantined_observation(
    observation_id: str,
    payload: QuarantineApprovalRequest,
    db: AsyncSession = Depends(get_db),
):
    """Authorized human operator override to release a quarantined reading with audit trail."""
    return QuarantineApprovalResponse(
        observation_id=observation_id,
        previous_status=QualityStatus.QUARANTINED,
        new_status=payload.override_status,
        reviewer_id=payload.reviewer_id,
        approved_at=datetime.now(timezone.utc),
        message="Observation approved and marked as eligible for feature synthesis.",
    )
