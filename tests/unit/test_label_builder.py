"""
Unit tests for Label Builder & Ground Truth generation.
"""
from datetime import datetime, timezone
import pytest
from ml.labels.label_builder import LabelBuilder
from ml.schemas.dataset_manifest import LabelConfidence, LabelRecord


@pytest.fixture
def builder():
    return LabelBuilder()


def test_build_labels_matches_historical_event(builder):
    events = [
        LabelRecord(
            id="EVT_001",
            event_name="Kedarnath Multi-Day Flash Surge",
            event_type="FLASH_FLOOD",
            location_id="UK_RUD_01",
            watershed_id="MANDAKINI",
            event_start=datetime(2013, 6, 16, 10, 0, tzinfo=timezone.utc),
            event_end=datetime(2013, 6, 17, 18, 0, tzinfo=timezone.utc),
            label_value=1,
            label_window_minutes=60,
            source="NDMA",
            confidence=LabelConfidence.HIGH,
            reviewer="NDMA Inspector",
            label_version="v1.0",
            eligible_for_training=True,
            notes="Verified historical event",
        )
    ]

    snapshots = [
        {
            "snapshot_id": "SNAP_001",
            "location_id": "UK_RUD_01",
            "feature_timestamp": datetime(2013, 6, 16, 12, 0, tzinfo=timezone.utc).isoformat(),
        },
        {
            "snapshot_id": "SNAP_002",
            "location_id": "UK_RUD_01",
            "feature_timestamp": datetime(2013, 6, 25, 0, 0, tzinfo=timezone.utc).isoformat(),
        },
    ]

    labels = builder.build_labels(events, snapshots, window_minutes=60)
    assert len(labels) == 2
    assert labels[0]["label"] == 1
    assert labels[1]["label"] == 0


def test_validate_labels_checks(builder):
    labels = [
        {"snapshot_id": "S1", "label": 1, "label_confidence": "HIGH"},
        {"snapshot_id": "S2", "label": 0, "label_confidence": "HIGH"},
    ]
    report = builder.validate_labels(labels)
    assert report.is_valid is True
    assert report.n_positive == 1
    assert report.n_negative == 1
