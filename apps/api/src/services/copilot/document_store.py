"""
FloodGuard AI — Copilot Document Store
In-memory indexed knowledge base for official SOPs, disaster guidelines, and technical references.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


@dataclass
class DocumentChunk:
    chunk_id: str
    document_id: str
    title: str
    source: str
    url_or_path: str
    published_at: str
    reviewed_at: str | None
    geography: str
    hazard_type: str
    role_access: list[str]
    data_mode: str
    confidence: str
    version: str
    content: str
    keywords: list[str]


class DocumentStore:
    """Indexed store of verified disaster management documentation and SOPs."""

    def __init__(self, store_path: str | Path = "data/vector_store"):
        self.store_path = Path(store_path)
        self.store_path.mkdir(parents=True, exist_ok=True)
        self._chunks: list[DocumentChunk] = []
        self._load_built_in_knowledge()

    def _load_built_in_knowledge(self) -> None:
        """Load default knowledge base chunks."""
        built_in = [
            DocumentChunk(
                chunk_id="doc-sih-001",
                document_id="SIH26192-SPEC",
                title="Smart India Hackathon 2026: Flash Flood Early Warning (SIH26192)",
                source="Ministry of Home Affairs / NDMA",
                url_or_path="/docs/copilot/01_about_floodguard.md",
                published_at="2026-01-15T00:00:00Z",
                reviewed_at="2026-02-01T00:00:00Z",
                geography="Himalayan Hilly Regions (Uttarakhand, Himachal, NE)",
                hazard_type="FLASH_FLOOD",
                role_access=["CITIZEN", "OPERATOR", "ANALYST", "ADMIN", "VIEWER"],
                data_mode="ALL",
                confidence="HIGH",
                version="v1.0",
                content=(
                    "FloodGuard AI is a multi-source, hyper-local disaster intelligence platform designed for hilly terrain. "
                    "It integrates rainfall accumulation, soil saturation, slope steepness, and river rate-of-rise to estimate localized flash-flood probability. "
                    "The system clearly isolates DEMO simulation from LIVE operational telemetry and requires human approval for public alert broadcasts."
                ),
                keywords=["floodguard", "sih26192", "mha", "ndma", "flash flood", "hilly terrain", "overview"],
            ),
            DocumentChunk(
                chunk_id="doc-risk-002",
                document_id="RISK-FRAMEWORK-V1",
                title="FloodGuard Multi-Factor Risk Assessment Methodology",
                source="FloodGuard Scientific Advisory",
                url_or_path="/docs/copilot/02_risk_indicators.md",
                published_at="2026-02-10T00:00:00Z",
                reviewed_at="2026-02-12T00:00:00Z",
                geography="INDIA",
                hazard_type="FLASH_FLOOD",
                role_access=["CITIZEN", "OPERATOR", "ANALYST", "ADMIN", "VIEWER"],
                data_mode="ALL",
                confidence="HIGH",
                version="v1.0",
                content=(
                    "Composite risk scoring evaluates four core contributors: Rainfall intensity & 24h accumulation (30% weight), "
                    "Catchment soil saturation index (25% weight), River level & rate of rise (20% weight), and Terrain slope/TWI (15% weight). "
                    "Scores above 75 trigger EXTREME risk, 55-75 HIGH risk, 35-55 MODERATE risk, and below 35 LOW risk."
                ),
                keywords=["risk score", "factors", "weights", "rainfall", "soil", "river", "thresholds", "extreme"],
            ),
            DocumentChunk(
                chunk_id="doc-safety-003",
                document_id="NDMA-SOP-CITIZEN",
                title="NDMA Citizen Action Protocol for Flash Floods & Cloudbursts",
                source="National Disaster Management Authority (NDMA)",
                url_or_path="/docs/copilot/05_what_to_do_flood.md",
                published_at="2025-08-01T00:00:00Z",
                reviewed_at="2026-01-10T00:00:00Z",
                geography="INDIA",
                hazard_type="FLASH_FLOOD",
                role_access=["CITIZEN", "OPERATOR", "ANALYST", "ADMIN", "VIEWER"],
                data_mode="ALL",
                confidence="HIGH",
                version="v2.1",
                content=(
                    "During sudden water rise or cloudburst warnings: Move immediately to elevated designated shelter locations. "
                    "Do NOT walk, swim, or drive through moving flood waters. Turn off main electrical switches before evacuation. "
                    "For emergency rescue, call the 24x7 National Helpline at 112 or local District Disaster Control Room."
                ),
                keywords=["what to do", "evacuation", "shelter", "safety", "emergency", "112", "helpline", "ndma"],
            ),
            DocumentChunk(
                chunk_id="doc-sources-004",
                document_id="DATA-REGISTRY-SOP",
                title="Official Data Source Integration Standards (IMD / CWC)",
                source="FloodGuard Data Governance Policy",
                url_or_path="/docs/copilot/03_data_sources.md",
                published_at="2026-02-15T00:00:00Z",
                reviewed_at="2026-02-20T00:00:00Z",
                geography="INDIA",
                hazard_type="ALL",
                role_access=["OPERATOR", "ANALYST", "ADMIN"],
                data_mode="ALL",
                confidence="HIGH",
                version="v1.0",
                content=(
                    "FloodGuard connects with external providers via clean standardized adapters. IMD meteorological bulletins, "
                    "CWC water level gauge telemetry, and Open-Meteo regional feeds require explicit institutional credentials. "
                    "In DEMO mode, telemetry is deterministically synthesized; no live government credentials are faked."
                ),
                keywords=["imd", "cwc", "data sources", "providers", "credentials", "live", "demo mode"],
            ),
        ]
        self._chunks.extend(built_in)

    def search(
        self,
        query: str,
        role: str = "VIEWER",
        data_mode: str = "DEMO",
        top_k: int = 4,
    ) -> list[DocumentChunk]:
        """Keyword relevance search filtered by user role access."""
        terms = set(re.findall(r"\w+", query.lower()))
        if not terms:
            return self._chunks[:top_k]

        scored: list[tuple[float, DocumentChunk]] = []
        for chunk in self._chunks:
            # Check role accessibility
            if role != "ADMIN" and chunk.role_access and role not in chunk.role_access and "VIEWER" not in chunk.role_access:
                continue

            score = 0.0
            # Keyword match
            for kw in chunk.keywords:
                if any(t in kw.lower() for t in terms):
                    score += 2.0

            # Content match
            content_lower = chunk.content.lower()
            for t in terms:
                if t in content_lower:
                    score += 1.0

            if score > 0.0:
                scored.append((score, chunk))

        scored.sort(key=lambda x: x[0], reverse=True)
        results = [c for _, c in scored[:top_k]]
        return results if results else self._chunks[:top_k]

    def list_documents(self, role: str = "VIEWER") -> list[dict[str, Any]]:
        docs = []
        for c in self._chunks:
            docs.append({
                "document_id": c.document_id,
                "title": c.title,
                "source": c.source,
                "geography": c.geography,
                "hazard_type": c.hazard_type,
                "version": c.version,
                "published_at": c.published_at,
            })
        return docs
