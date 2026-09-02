"""
FloodGuard AI — Copilot ORM Models
Document chunks for RAG knowledge base and chat audit records.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, JSON, String, Text
from sqlalchemy.dialects.postgresql import UUID

from ..db.engine import Base


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


class CopilotDocument(Base):
    """
    A chunk of knowledge-base content for Copilot retrieval.
    Documents are reviewed by admin before ingestion.
    """
    __tablename__ = "copilot_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(String(200), nullable=False, index=True)  # parent doc
    title = Column(String(500), nullable=False)
    source = Column(String(200), nullable=False)  # "FloodGuard Docs" | "IMD Bulletin" etc.
    url_or_path = Column(String(500), nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    reviewed_by = Column(String(200), nullable=True)
    geography = Column(String(200), nullable=True, default="INDIA")
    hazard_type = Column(String(200), nullable=True, default="ALL")
    role_access = Column(JSON, nullable=False, default=lambda: ["CITIZEN", "OPERATOR", "ANALYST", "ADMIN"])
    data_mode = Column(String(50), nullable=False, default="ALL")
    confidence = Column(String(50), nullable=False, default="MEDIUM")
    version = Column(String(50), nullable=False, default="v1.0")
    content = Column(Text, nullable=False)
    keywords = Column(JSON, nullable=False, default=list)
    chunk_index = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=_now_utc)

    def __repr__(self) -> str:
        return f"<CopilotDocument {self.title!r} src={self.source}>"


class CopilotChat(Base):
    """
    Immutable audit record for every Copilot interaction.
    """
    __tablename__ = "copilot_chats"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(200), nullable=True)  # None if anonymous
    role = Column(String(100), nullable=False, default="VIEWER")
    location_id = Column(String(200), nullable=True)
    data_mode = Column(String(50), nullable=False, default="DEMO")

    query = Column(Text, nullable=False)
    retrieved_chunk_ids = Column(JSON, nullable=False, default=list)
    response_summary = Column(Text, nullable=True)
    safety_flagged = Column(Boolean, nullable=False, default=False)
    violations = Column(JSON, nullable=False, default=list)
    rating = Column(Integer, nullable=True)  # 1-5 user feedback

    trace_id = Column(String(100), nullable=False)
    answered_at = Column(DateTime(timezone=True), nullable=False, default=_now_utc)

    def __repr__(self) -> str:
        return f"<CopilotChat id={self.id} safety_flagged={self.safety_flagged}>"
