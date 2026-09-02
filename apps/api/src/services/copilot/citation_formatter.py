"""
FloodGuard AI — Copilot Citation Formatter
Converts retrieved document chunks into structured citations attached to every response.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Sequence

from .document_store import DocumentChunk


@dataclass
class Citation:
    chunk_id: str
    document_id: str
    title: str
    source: str
    url_or_path: str
    published_at: str
    reviewed_at: str | None
    geography: str
    hazard_type: str
    confidence: str
    version: str
    data_mode: str


def format_citations(chunks: Sequence[DocumentChunk]) -> list[Citation]:
    """Convert retrieved DocumentChunks to structured Citation objects."""
    citations = []
    for c in chunks:
        citations.append(
            Citation(
                chunk_id=c.chunk_id,
                document_id=c.document_id,
                title=c.title,
                source=c.source,
                url_or_path=c.url_or_path,
                published_at=c.published_at,
                reviewed_at=c.reviewed_at,
                geography=c.geography,
                hazard_type=c.hazard_type,
                confidence=c.confidence,
                version=c.version,
                data_mode=c.data_mode,
            )
        )
    return citations
