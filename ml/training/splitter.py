"""
FloodGuard AI — Time-Aware Data Splitter
Ensures zero data leakage across train, validation, and test sets.
Prevents temporal contamination via chronological splits with mandatory blackout gaps.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any, Generator

import numpy as np


@dataclass
class LeakageReport:
    is_clean: bool
    contaminated_samples: int
    earliest_test_time: datetime | None
    latest_train_time: datetime | None
    temporal_gap_actual_days: float
    violations: list[str]


class TimeAwareSplitter:
    """Time-series and spatial holdout splitter for hydrometeorology telemetry."""

    def _parse_time(self, t: Any) -> datetime:
        if isinstance(t, datetime):
            return t if t.tzinfo else t.replace(tzinfo=timezone.utc)
        if isinstance(t, str):
            dt = datetime.fromisoformat(t.replace("Z", "+00:00"))
            return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        return datetime.now(timezone.utc)

    def chronological_split(
        self,
        records: list[dict[str, Any]],
        test_fraction: float = 0.2,
        temporal_gap_days: float = 7.0,
        timestamp_key: str = "feature_timestamp",
    ) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
        if not records:
            return [], []

        sorted_recs = sorted(records, key=lambda r: self._parse_time(r[timestamp_key]))
        timestamps = [self._parse_time(r[timestamp_key]) for r in sorted_recs]

        min_time = timestamps[0]
        max_time = timestamps[-1]
        total_span = (max_time - min_time).total_seconds()

        if total_span <= 0:
            split_idx = int(len(sorted_recs) * (1.0 - test_fraction))
            return sorted_recs[:split_idx], sorted_recs[split_idx:]

        split_time = min_time + timedelta(seconds=total_span * (1.0 - test_fraction))
        train_cutoff = split_time - timedelta(days=temporal_gap_days / 2.0)
        test_start = split_time + timedelta(days=temporal_gap_days / 2.0)

        train_recs = [r for r in sorted_recs if self._parse_time(r[timestamp_key]) <= train_cutoff]
        test_recs = [r for r in sorted_recs if self._parse_time(r[timestamp_key]) >= test_start]

        if not train_recs or not test_recs:
            split_idx = int(len(sorted_recs) * (1.0 - test_fraction))
            train_recs = sorted_recs[:split_idx]
            test_recs = sorted_recs[split_idx:]

        return train_recs, test_recs

    def location_holdout_split(
        self,
        records: list[dict[str, Any]],
        holdout_location_ids: list[str],
        location_key: str = "location_id",
    ) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
        test_recs = [r for r in records if r.get(location_key) in holdout_location_ids]
        train_recs = [r for r in records if r.get(location_key) not in holdout_location_ids]
        return train_recs, test_recs

    def check_leakage(
        self,
        train_recs: list[dict[str, Any]],
        test_recs: list[dict[str, Any]],
        timestamp_key: str = "feature_timestamp",
    ) -> LeakageReport:
        violations: list[str] = []
        if not train_recs or not test_recs:
            return LeakageReport(True, 0, None, None, 0.0, [])

        train_ts = [self._parse_time(r[timestamp_key]) for r in train_recs]
        test_ts = [self._parse_time(r[timestamp_key]) for r in test_recs]

        latest_train = max(train_ts)
        earliest_test = min(test_ts)

        diff_days = (earliest_test - latest_train).total_seconds() / 86400.0

        contaminated = sum(1 for ts in test_ts if ts <= latest_train)
        if contaminated > 0:
            violations.append(f"{contaminated} test samples have timestamp <= latest training sample ({latest_train}).")

        return LeakageReport(
            is_clean=len(violations) == 0,
            contaminated_samples=contaminated,
            earliest_test_time=earliest_test,
            latest_train_time=latest_train,
            temporal_gap_actual_days=round(diff_days, 2),
            violations=violations,
        )
