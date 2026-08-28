"""FloodGuard AI — Audit Log Router (read-only)"""
from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from ..db.engine import get_db
from ..db.models import AuditLog

router = APIRouter()

@router.get("")
async def list_audit_logs(
    db: Annotated[AsyncSession, Depends(get_db)],
    entity_type: str | None = Query(None),
    action: str | None = Query(None),
    limit: int = Query(50, le=200),
    offset: int = Query(0, ge=0),
):
    """Read audit log entries. Audit records are immutable."""
    query = select(AuditLog).order_by(desc(AuditLog.occurred_at))
    if entity_type:
        query = query.where(AuditLog.entity_type == entity_type)
    if action:
        query = query.where(AuditLog.action == action)
    result = await db.execute(query.limit(limit).offset(offset))
    logs = result.scalars().all()
    return {
        "data": [
            {
                "id": str(l.id), "action": l.action, "entity_type": l.entity_type,
                "entity_id": l.entity_id, "actor_email": l.actor_email, "actor_role": l.actor_role,
                "occurred_at": l.occurred_at.isoformat(), "data_mode": l.data_mode,
                "trace_id": l.trace_id,
            }
            for l in logs
        ],
        "meta": {"data_mode": "AUDIT", "immutable": True},
    }
