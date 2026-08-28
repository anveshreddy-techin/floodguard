"""FloodGuard AI — Alerts Router"""
from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from ..db.engine import get_db
from ..db.models import Alert, AlertStatus

router = APIRouter()

@router.get("")
async def list_alerts(
    db: Annotated[AsyncSession, Depends(get_db)],
    status: str | None = Query(None),
    severity: str | None = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
):
    query = select(Alert).order_by(desc(Alert.created_at))
    if status:
        query = query.where(Alert.status == status)
    if severity:
        query = query.where(Alert.severity == severity)
    result = await db.execute(query.limit(limit).offset(offset))
    alerts = result.scalars().all()
    return {
        "data": [_fmt(a) for a in alerts],
        "meta": {"data_mode": "DEMO", "total_returned": len(alerts)},
    }

@router.get("/{alert_id}")
async def get_alert(alert_id: UUID, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(Alert).where(Alert.id == alert_id))
    alert = result.scalar_one_or_none()
    if not alert:
        from ..core.errors import NotFoundError
        raise NotFoundError("Alert", str(alert_id))
    return {"data": _fmt(alert, detailed=True), "meta": {"data_mode": alert.data_mode}}

def _fmt(a: Alert, detailed: bool = False) -> dict:
    d = {
        "id": str(a.id), "alert_type": a.alert_type, "severity": a.severity,
        "status": a.status, "title": a.title, "data_mode": a.data_mode,
        "created_at": a.created_at.isoformat() if a.created_at else None,
        "activated_at": a.activated_at.isoformat() if a.activated_at else None,
        "location_id": str(a.location_id) if a.location_id else None,
        "uncertainty": a.uncertainty,
    }
    if detailed:
        d.update({"description": a.description, "evidence": a.evidence or [], "operator_notes": a.operator_notes})
    return d
