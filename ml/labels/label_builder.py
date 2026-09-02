"""
FloodGuard AI — Label Builder
Constructs binary/multiclass hazard target labels from verified disaster records.
Strict invariant: Labels are NEVER synthesized from model outputs — only from authoritative event records.
Compatible with standard Python lists/dicts and optional pandas.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone, timedelta
from typing import Any

try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False

from ..schemas.dataset_manifest import LabelConfidence, LabelRecord


@dataclass
class LabelValidationReport:
    total_samples: int
    n_positive: int
    n_negative: int
    positive_ratio: float
    confidence_distribution: dict[str, int]
    is_valid: bool
    issues: list[str]


class LabelBuilder:
    """Ground truth builder for temporal disaster labels."""

    def _parse_time(self, t: Any) -> datetime:
        if isinstance(t, datetime):
            return t if t.tzinfo else t.replace(tzinfo=timezone.utc)
        if isinstance(t, str):
            dt = datetime.fromisoformat(t.replace("Z", "+00:00"))
            return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        return datetime.now(timezone.utc)

    def build_labels(
        self,
        event_records: list[LabelRecord],
        snapshots: Any,
        window_minutes: int = 60,
    ) -> list[dict[str, Any]]:
        """
        Match feature snapshots against verified disaster records.
        Returns a list of structured label dicts (convertible to DataFrame if pandas is present).
        """
        records: list[dict[str, Any]] = []
        eligible_events = [e for e in event_records if e.eligible_for_training]

        # Extract snapshot iterable
        items = []
        if HAS_PANDAS and isinstance(snapshots, pd.DataFrame):
            items = snapshots.to_dict(orient="records")
        elif isinstance(snapshots, list):
            items = snapshots
        else:
            items = list(snapshots)

        for row in items:
            loc = row.get("location_id", "")
            ts = self._parse_time(row.get("feature_timestamp"))

            label = 0
            matched_event: LabelRecord | None = None

            for event in eligible_events:
                if event.location_id == loc:
                    e_start = self._parse_time(event.event_start)
                    e_end = self._parse_time(event.event_end)

                    window_end = ts + timedelta(minutes=window_minutes)
                    if (ts <= e_end) and (window_end >= e_start):
                        label = 1
                        matched_event = event
                        break

            records.append({
                "snapshot_id": row.get("snapshot_id", f"snap_{len(records)}"),
                "location_id": loc,
                "feature_timestamp": ts.isoformat(),
                "label": label,
                "label_confidence": matched_event.confidence.value if matched_event else LabelConfidence.HIGH.value,
                "event_id": matched_event.id if matched_event else None,
                "label_version": matched_event.label_version if matched_event else "v1.0-unlabelled",
            })

        return records

    def validate_labels(self, labels: list[dict[str, Any]] | Any) -> LabelValidationReport:
        """Run structural sanity checks on generated ground-truth table."""
        issues: list[str] = []
        items = []
        if HAS_PANDAS and isinstance(labels, pd.DataFrame):
            items = labels.to_dict(orient="records")
        elif isinstance(labels, list):
            items = labels
        else:
            items = list(labels)

        if not items:
            return LabelValidationReport(0, 0, 0, 0.0, {}, False, ["Labels list is empty."])

        n_pos = sum(1 for r in items if r.get("label") == 1)
        n_neg = sum(1 for r in items if r.get("label") == 0)
        total = len(items)

        for r in items:
            if r.get("label") not in (0, 1):
                issues.append(f"Non-binary label found: {r.get('label')}")

        conf_dist: dict[str, int] = {}
        for r in items:
            c = str(r.get("label_confidence", "UNKNOWN"))
            conf_dist[c] = conf_dist.get(c, 0) + 1

        if n_pos == 0:
            issues.append("Zero positive disaster instances in dataset.")

        ratio = n_pos / total if total > 0 else 0.0

        return LabelValidationReport(
            total_samples=total,
            n_positive=n_pos,
            n_negative=n_neg,
            positive_ratio=round(ratio, 4),
            confidence_distribution=conf_dist,
            is_valid=len(issues) == 0,
            issues=issues,
        )

    def filter_eligible(
        self,
        labels: list[dict[str, Any]],
        min_confidence: LabelConfidence = LabelConfidence.MEDIUM,
    ) -> list[dict[str, Any]]:
        accepted_tiers = {LabelConfidence.HIGH.value}
        if min_confidence in (LabelConfidence.MEDIUM, LabelConfidence.LOW):
            accepted_tiers.add(LabelConfidence.MEDIUM.value)
        if min_confidence == LabelConfidence.LOW:
            accepted_tiers.add(LabelConfidence.LOW.value)

        return [r for r in labels if r.get("label_confidence") in accepted_tiers]
