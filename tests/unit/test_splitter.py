"""
Unit tests for TimeAwareSplitter and zero-leakage constraints.
"""
from datetime import datetime, timedelta, timezone
import pytest
from ml.training.splitter import TimeAwareSplitter


@pytest.fixture
def splitter():
    return TimeAwareSplitter()


def test_chronological_split_preserves_temporal_order(splitter):
    base_time = datetime(2026, 6, 1, 0, 0, tzinfo=timezone.utc)
    records = []
    for i in range(100):
        records.append({
            "feature_timestamp": (base_time + timedelta(hours=i * 6)).isoformat(),
            "rainfall_1h_mm": float(i % 25),
            "label": 1 if i % 10 == 0 else 0,
        })

    train_recs, test_recs = splitter.chronological_split(records, test_fraction=0.2, temporal_gap_days=2.0)
    assert len(train_recs) > 0
    assert len(test_recs) > 0

    max_train_ts = max(r["feature_timestamp"] for r in train_recs)
    min_test_ts = min(r["feature_timestamp"] for r in test_recs)

    assert min_test_ts > max_train_ts

    leakage = splitter.check_leakage(train_recs, test_recs)
    assert leakage.is_clean is True
    assert leakage.contaminated_samples == 0
