"""FloodGuard AI — Incident Command Router"""
from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from ..db.engine import get_db
from ..db.models import Incident

router = APIRouter()

@router.get("")
async def list_incidents(
    db: Annotated[AsyncSession, Depends(get_db)],
    status: str | None = Query(None),
    limit: int = Query(20, le=100),
):
    query = select(Incident).order_by(desc(Incident.detected_at))
    if status:
        query = query.where(Incident.status == status)
    result = await db.execute(query.limit(limit))
    incidents = result.scalars().all()
    return {"data": [_fmt(i) for i in incidents], "meta": {"data_mode": "DEMO"}}

@router.get("/{incident_id}")
async def get_incident(incident_id: UUID, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(Incident).where(Incident.id == incident_id))
    incident = result.scalar_one_or_none()
    if not incident:
        from ..core.errors import NotFoundError
        raise NotFoundError("Incident", str(incident_id))
    return {"data": _fmt(incident, detailed=True), "meta": {"data_mode": incident.data_mode}}

def _fmt(i: Incident, detailed: bool = False) -> dict:
    d = {
        "id": str(i.id), "title": i.title, "status": i.status, "severity": i.severity,
        "data_mode": i.data_mode, "detected_at": i.detected_at.isoformat() if i.detected_at else None,
        "location_id": str(i.location_id) if i.location_id else None,
    }
    if detailed:
        d.update({
            "description": i.description, "evidence": i.evidence or [],
            "known_facts": i.known_facts or [], "unknown_facts": i.unknown_facts or [],
            "timeline": i.timeline or [],
        })
    return d
