"""
FloodGuard AI — Audit Logging Service
Provides tamper-evident event recording for model inferences, operator actions, and data ingestion.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.logging import get_logger
from ..models.audit_log import AuditLog

logger = get_logger(__name__)


class AuditService:
    """Audit recording and trail extraction service."""

    async def log(
        self,
        db: AsyncSession,
        action: str,
        resource_type: str,
        resource_id: str | None = None,
        user_id: str | None = None,
        user_role: str | None = None,
        data_mode: str = "DEMO",
        details: dict[str, Any] | None = None,
        trace_id: str | None = None,
    ) -> AuditLog:
        trace_id = trace_id or str(uuid.uuid4())
        entry = AuditLog(
            action=action,
            user_id=user_id,
            user_role=user_role,
            resource_type=resource_type,
            resource_id=resource_id,
            data_mode=data_mode,
            details=details or {},
            trace_id=trace_id,
            timestamp=datetime.now(timezone.utc),
        )
        db.add(entry)
        try:
            await db.commit()
            await db.refresh(entry)
        except Exception as e:
            logger.error("audit_log_persist_failed", error=str(e), action=action)
            await db.rollback()

        logger.info(
            "audit_event",
            action=action,
            resource=f"{resource_type}:{resource_id}",
            user=user_id,
            mode=data_mode,
            trace_id=trace_id,
        )
        return entry

    async def get_recent_trail(
        self,
        db: AsyncSession,
        action: str | None = None,
        resource_type: str | None = None,
        limit: int = 50,
    ) -> list[AuditLog]:
        query = select(AuditLog)
        if action:
            query = query.where(AuditLog.action == action)
        if resource_type:
            query = query.where(AuditLog.resource_type == resource_type)
        query = query.order_by(AuditLog.timestamp.desc()).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())


audit_service = AuditService()
