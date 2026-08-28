"""
FloodGuard AI — Risk Engine Router
Returns risk assessments with full evidence, uncertainty, and explanation.
Never fabricates risk scores. Returns INSUFFICIENT_DATA when data is unavailable.
"""
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.engine import get_db
from ..db.models import RiskAssessment, AdminRegion

router = APIRouter()


@router.get("/assessments")
async def list_risk_assessments(
    db: Annotated[AsyncSession, Depends(get_db)],
    location_id: UUID | None = Query(None),
    risk_level: str | None = Query(None, description="LOW | MODERATE | HIGH | EXTREME"),
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
):
    """List recent risk assessments."""
    query = select(RiskAssessment).order_by(desc(RiskAssessment.assessed_at))
    if location_id:
        query = query.where(RiskAssessment.location_id == location_id)
    if risk_level:
        query = query.where(RiskAssessment.risk_level == risk_level)

    result = await db.execute(query.limit(limit).offset(offset))
    assessments = result.scalars().all()

    return {
        "data": [_format_assessment(a) for a in assessments],
        "meta": {
            "data_mode": "DEMO",
            "note": "Risk assessments are computed by the hybrid rule-based engine. ML model is prototype status.",
        },
    }


@router.get("/assessments/{assessment_id}")
async def get_risk_assessment(
    assessment_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Get detailed risk assessment with full evidence chain."""
    result = await db.execute(select(RiskAssessment).where(RiskAssessment.id == assessment_id))
    assessment = result.scalar_one_or_none()
    if not assessment:
        from ..core.errors import NotFoundError
        raise NotFoundError("Risk Assessment", str(assessment_id))

    return {"data": _format_assessment(assessment, detailed=True), "meta": {"data_mode": "DEMO"}}


@router.get("/locations/{location_id}/current")
async def get_current_risk(
    location_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Get the most recent risk assessment for a location."""
    result = await db.execute(
        select(RiskAssessment)
        .where(RiskAssessment.location_id == location_id)
        .order_by(desc(RiskAssessment.assessed_at))
        .limit(1)
    )
    assessment = result.scalar_one_or_none()

    if not assessment:
        return {
            "data": {
                "risk_level": "UNKNOWN",
                "confidence": "INSUFFICIENT_DATA",
                "uncertainty": "HIGH",
                "note": "No risk assessment available for this location. Upload data or wait for ingestion.",
            },
            "meta": {"data_mode": "DEMO", "freshness": "UNAVAILABLE"},
        }

    return {"data": _format_assessment(assessment, detailed=True), "meta": {"data_mode": "DEMO"}}


def _format_assessment(a: RiskAssessment, detailed: bool = False) -> dict:
    base = {
        "id": str(a.id),
        "location_id": str(a.location_id) if a.location_id else None,
        "assessed_at": a.assessed_at.isoformat() if a.assessed_at else None,
        "risk_score": a.risk_score,
        "risk_level": a.risk_level,
        "confidence": a.confidence,
        "uncertainty": a.uncertainty,
        "data_mode": a.data_mode,
    }
    if detailed:
        base.update({
            "components": {
                "rainfall_risk": a.rainfall_risk,
                "soil_risk": a.soil_risk,
                "terrain_risk": a.terrain_risk,
                "river_risk": a.river_risk,
                "historical_risk": a.historical_risk,
            },
            "contributors": a.contributors or [],
            "evidence": a.evidence or [],
            "explanation": a.explanation or {},
            "data_gaps": a.data_gaps or [],
            "limitations": a.limitations or [],
            "model_version": a.model_version,
            "data_sources_used": a.data_sources_used or [],
            "data_freshness": a.data_freshness,
        })
    return base
