"""
FloodGuard AI — Copilot Retrieval Service
Orchestrates document search, context synthesis, and structured citation assembly.
"""
from __future__ import annotations

from typing import Any

from .citation_formatter import Citation, format_citations
from .document_store import DocumentChunk, DocumentStore


class RetrievalService:
    """Combines DocumentStore search with contextual string formatting."""

    def __init__(self, document_store: DocumentStore):
        self._store = document_store

    def retrieve(
        self,
        query: str,
        role: str = "VIEWER",
        data_mode: str = "DEMO",
        top_k: int = 4,
    ) -> tuple[list[DocumentChunk], list[Citation]]:
        chunks = self._store.search(query=query, role=role, data_mode=data_mode, top_k=top_k)
        citations = format_citations(chunks)
        return chunks, citations

    def build_context_string(self, chunks: list[DocumentChunk], system_context: dict[str, Any]) -> str:
        lines = [
            f"=== LIVE SYSTEM CONTEXT ===",
            f"Location: {system_context.get('location_id')}",
            f"Data Mode: {system_context.get('data_mode')}",
            f"Timestamp: {system_context.get('fetched_at')}",
        ]
        pred = system_context.get("prediction")
        if pred:
            lines.append(f"Risk Score: {pred.get('risk_score')}/100 ({pred.get('risk_level')})")
            lines.append(f"Model: {pred.get('model_version')} ({pred.get('model_type')}) — Status: {pred.get('model_status')}")
            lines.append(f"Uncertainty: {pred.get('uncertainty')}")

        lines.append("\n=== RETRIEVED AUTHORITATIVE SOURCES ===")
        for i, chunk in enumerate(chunks, start=1):
            lines.append(f"[{i}] {chunk.title} (Source: {chunk.source})")
            lines.append(f"Content: {chunk.content}\n")

        return "\n".join(lines)
