"""
FloodGuard AI — Audit Log ORM Model
Immutable record of all operational actions, inferences, data ingestion, and alert dispatches.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, JSON, String, Text
from sqlalchemy.dialects.postgresql import UUID

from ..db.engine import Base


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


class AuditLog(Base):
    """
    Immutable audit log entry for regulatory and operational accountability.
    """
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    timestamp = Column(DateTime(timezone=True), nullable=False, default=_now_utc, index=True)

    action = Column(String(100), nullable=False, index=True)
    user_id = Column(String(200), nullable=True)
    user_role = Column(String(100), nullable=True)

    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(200), nullable=True)

    data_mode = Column(String(50), nullable=False, default="DEMO")
    details = Column(JSON, nullable=False, default=dict)

    trace_id = Column(String(100), nullable=False, index=True)

    def __repr__(self) -> str:
        return f"<AuditLog {self.action} on {self.resource_type}:{self.resource_id}>"
