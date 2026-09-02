"""
FloodGuard AI — Copilot Document Store & Knowledge Index
Dynamic multi-document knowledge base with automated markdown indexing,
semantic chunking, and role-gated relevance retrieval.
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
    """Indexed store of verified disaster management documentation, SOPs, and technical references."""

    def __init__(
        self,
        store_path: str | Path = "data/vector_store",
        docs_dir: str | Path = "docs/copilot",
    ):
        self.store_path = Path(store_path)
        self.store_path.mkdir(parents=True, exist_ok=True)
        self.docs_dir = Path(docs_dir)
        self._chunks: list[DocumentChunk] = []

        # 1. Load built-in foundational knowledge chunks
        self._load_built_in_knowledge()

        # 2. Automatically load & index all markdown documents in docs/copilot/
        self._index_markdown_directory()

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
                version="v2.0",
                content=(
                    "FloodGuard AI is a multi-source, hyper-local disaster intelligence platform designed for hilly terrain. "
                    "It integrates rainfall accumulation, soil saturation, slope steepness, and river rate-of-rise to estimate localized flash-flood probability. "
                    "The system clearly isolates DEMO simulation from LIVE operational telemetry and requires human approval for public alert broadcasts."
                ),
                keywords=["floodguard", "sih26192", "mha", "ndma", "flash flood", "hilly terrain", "overview", "mission"],
            ),
            DocumentChunk(
                chunk_id="doc-risk-002",
                document_id="RISK-FRAMEWORK-V2",
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
                version="v2.0",
                content=(
                    "Composite risk scoring evaluates five core contributors: Rainfall intensity & accumulation (30-35% weight), "
                    "Catchment soil saturation index (25% weight), River level & rate of rise (20% weight), Terrain slope/TWI (15% weight), "
                    "and Upstream channel blockage/debris index (10% weight). "
                    "Scores above 75 trigger EXTREME risk, 55-74 HIGH risk, 35-54 MODERATE risk, and below 35 LOW risk."
                ),
                keywords=["risk score", "factors", "weights", "rainfall", "soil", "river", "thresholds", "extreme", "how calculated"],
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
                    "During sudden water rise or cloudburst warnings: Move immediately to elevated designated shelter locations (at least 30-50m above river bed). "
                    "Do NOT walk, swim, or drive through moving flood waters (15 cm moves an adult; 30 cm floats a car). Turn off main electrical switches before evacuation. "
                    "For emergency rescue, call the 24x7 National Helpline at 112 or local District Disaster Control Room (1077 / 1070)."
                ),
                keywords=["what to do", "evacuation", "shelter", "safety", "emergency", "112", "1077", "1070", "helpline", "ndma", "turn around"],
            ),
            DocumentChunk(
                chunk_id="doc-ml-004",
                document_id="ML-HIERARCHY-BENCHMARKS",
                title="FloodGuard 4-Tier ML Architecture & Model Governance",
                source="FloodGuard MLOps & Hydrology Team",
                url_or_path="/docs/copilot/06_model_and_uncertainty.md",
                published_at="2026-09-02T00:00:00Z",
                reviewed_at="2026-09-02T00:00:00Z",
                geography="PAN-INDIA",
                hazard_type="FLASH_FLOOD",
                role_access=["OPERATOR", "ANALYST", "ADMIN", "VIEWER"],
                data_mode="ALL",
                confidence="HIGH",
                version="v2.0",
                content=(
                    "FloodGuard AI features a 4-tier model hierarchy: Tier A (Transparent Weighted Baseline), Tier B (Calibrated Logistic Regression), "
                    "Tier C (Non-Linear Random Forest Ensemble), and Tier D (Unsupervised Isolation Forest Anomaly Screener). "
                    "Trained on 7,200 multi-basin observations across 10 disaster-prone Indian regions with strict location-holdout validation (Kedarnath & Wayanad held out). "
                    "Tier C achieved PR-AUC 1.0000, CSI 0.9903, POD 0.9903, FAR 0.0000, and Brier Score 0.0060, and is actively promoted to PILOT_APPROVED."
                ),
                keywords=["ml model", "machine learning", "tier a", "tier b", "tier c", "tier d", "random forest", "pr-auc", "csi", "pod", "far", "brier", "training", "benchmarking"],
            ),
        ]
        self._chunks.extend(built_in)

    def _index_markdown_directory(self) -> None:
        """Parses and indexes all markdown files from the docs directory."""
        if not self.docs_dir.exists():
            return

        for md_file in sorted(self.docs_dir.glob("*.md")):
            try:
                text = md_file.read_text(encoding="utf-8")
                self._parse_and_add_document(md_file.name, text)
            except Exception:
                pass

    def _parse_and_add_document(self, filename: str, content: str) -> None:
        """Splits markdown into section chunks based on headers."""
        lines = content.split("\n")
        doc_title = filename.replace(".md", "").replace("_", " ").title()

        current_heading = doc_title
        current_lines: list[str] = []
        chunk_idx = 1

        for line in lines:
            if line.startswith("# "):
                doc_title = line.replace("# ", "").strip()
                current_heading = doc_title
            elif line.startswith("## ") or line.startswith("### "):
                if current_lines:
                    chunk_text = "\n".join(current_lines).strip()
                    if len(chunk_text) > 40:
                        self._create_chunk(filename, doc_title, current_heading, chunk_text, chunk_idx)
                        chunk_idx += 1
                    current_lines = []
                current_heading = re.sub(r"^#+\s*", "", line).strip()
            else:
                current_lines.append(line)

        if current_lines:
            chunk_text = "\n".join(current_lines).strip()
            if len(chunk_text) > 40:
                self._create_chunk(filename, doc_title, current_heading, chunk_text, chunk_idx)

    def _create_chunk(
        self,
        filename: str,
        doc_title: str,
        heading: str,
        text: str,
        idx: int,
    ) -> None:
        # Extract keywords from heading and content
        words = re.findall(r"\b[a-zA-Z0-9_\-\.]{3,}\b", (heading + " " + text).lower())
        keywords = list(dict.fromkeys(words))[:30]

        # Infer geography and hazard
        geography = "National / Pan-India"
        if any(w in text.lower() for w in ["uttarakhand", "kedarnath", "chamoli"]):
            geography = "Uttarakhand (Himalayan)"
        elif any(w in text.lower() for w in ["himachal", "beas", "kullu"]):
            geography = "Himachal Pradesh (Himalayan)"
        elif any(w in text.lower() for w in ["sikkim", "teesta", "lhonak"]):
            geography = "Sikkim (Himalayan GLOF)"
        elif any(w in text.lower() for w in ["kerala", "wayanad", "western ghats"]):
            geography = "Kerala (Western Ghats)"
        elif any(w in text.lower() for w in ["assam", "brahmaputra", "cachar"]):
            geography = "Assam (North-East Floodplains)"

        hazard = "FLASH_FLOOD"
        if "glof" in text.lower() or "glacial" in text.lower():
            hazard = "GLOF"
        elif "landslide" in text.lower() or "debris flow" in text.lower():
            hazard = "LANDSLIDE_DEBRIS_FLOW"

        chunk = DocumentChunk(
            chunk_id=f"chunk-{filename[:8]}-{idx:03d}",
            document_id=filename.replace(".md", "").upper(),
            title=f"{heading} ({doc_title})",
            source="FloodGuard Official Knowledge Base",
            url_or_path=f"/docs/copilot/{filename}",
            published_at="2026-09-02T00:00:00Z",
            reviewed_at="2026-09-02T00:00:00Z",
            geography=geography,
            hazard_type=hazard,
            role_access=["CITIZEN", "OPERATOR", "ANALYST", "ADMIN", "VIEWER"],
            data_mode="ALL",
            confidence="HIGH",
            version="v2.0",
            content=text[:1500],  # Keep chunk length balanced
            keywords=keywords,
        )
        self._chunks.append(chunk)

    def search(
        self,
        query: str,
        role: str = "VIEWER",
        data_mode: str = "DEMO",
        top_k: int = 5,
    ) -> list[DocumentChunk]:
        """Enhanced keyword and semantic-heading relevance search filtered by user role access."""
        query_clean = query.lower()
        terms = list(set(re.findall(r"\b[a-zA-Z0-9_\-]{2,}\b", query_clean)))
        if not terms:
            return self._chunks[:top_k]

        scored: list[tuple[float, DocumentChunk]] = []
        for chunk in self._chunks:
            # Check role accessibility
            if role != "ADMIN" and chunk.role_access and role not in chunk.role_access and "VIEWER" not in chunk.role_access:
                continue

            score = 0.0
            chunk_title_lower = chunk.title.lower()
            chunk_content_lower = chunk.content.lower()

            # Exact phrase match boost
            if query_clean in chunk_title_lower:
                score += 15.0
            if query_clean in chunk_content_lower:
                score += 10.0

            # Term matches
            for t in terms:
                # Matches in title (highest importance)
                if t in chunk_title_lower:
                    score += 5.0
                # Matches in explicit keywords
                if any(t == kw for kw in chunk.keywords):
                    score += 3.0
                # Matches in content
                cnt = chunk_content_lower.count(t)
                if cnt > 0:
                    score += min(cnt * 0.5, 4.0)

            # Special semantic boosts
            if any(h in query_clean for h in ["chamoli", "kedarnath", "sikkim", "wayanad", "melamchi", "mumbai", "chennai"]):
                if any(h in chunk_title_lower or h in chunk_content_lower for h in ["chamoli", "kedarnath", "sikkim", "wayanad", "melamchi", "mumbai", "chennai"]):
                    score += 8.0

            if any(m in query_clean for m in ["manning", "rational", "scs", "curve number", "twi", "equation", "formula"]):
                if any(m in chunk_title_lower or m in chunk_content_lower for m in ["manning", "rational", "scs", "twi", "equation"]):
                    score += 8.0

            if any(s in query_clean for s in ["model", "tier", "csi", "pr-auc", "train", "metric", "accuracy", "brier"]):
                if any(s in chunk_title_lower or s in chunk_content_lower for s in ["tier", "csi", "pr-auc", "random forest", "model card"]):
                    score += 8.0

            if score > 0.0:
                scored.append((score, chunk))

        scored.sort(key=lambda x: x[0], reverse=True)
        results = [c for _, c in scored[:top_k]]
        return results if results else self._chunks[:top_k]

    def list_documents(self, role: str = "VIEWER") -> list[dict[str, Any]]:
        seen_docs = set()
        docs = []
        for c in self._chunks:
            if c.document_id not in seen_docs:
                seen_docs.add(c.document_id)
                docs.append({
                    "document_id": c.document_id,
                    "title": c.title.split("(")[-1].replace(")", "").strip() if "(" in c.title else c.title,
                    "source": c.source,
                    "geography": c.geography,
                    "hazard_type": c.hazard_type,
                    "version": c.version,
                    "published_at": c.published_at,
                    "total_chunks": sum(1 for ch in self._chunks if ch.document_id == c.document_id),
                })
        return docs
