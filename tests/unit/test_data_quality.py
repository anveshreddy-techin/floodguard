"""
Unit tests for FloodGuard Data Quality Engine (17 Quality Flags & 4 Statuses).
"""
import pytest
from apps.api.src.services.data_quality import DataQualityEngine, QualityFlag, QualityStatus


@pytest.fixture
def engine():
    return DataQualityEngine()


def test_valid_observation(engine):
    obs = {
        "variable_name": "rainfall_mm",
        "value": 15.5,
        "unit": "mm",
        "location_id": "LOC_001",
        "observed_at": "2026-07-15T10:00:00Z",
    }
    report = engine.validate_observation(obs)
    assert report.status == QualityStatus.ACCEPTED
    assert QualityFlag.VALID in report.flags
    assert report.score == 1.0


def test_missing_value_flag(engine):
    obs = {
        "variable_name": "rainfall_mm",
        "value": None,
        "unit": "mm",
        "location_id": "LOC_001",
    }
    report = engine.validate_observation(obs)
    assert QualityFlag.MISSING in report.flags
    assert report.score < 1.0


def test_out_of_range_rainfall(engine):
    obs = {
        "variable_name": "rainfall_mm",
        "value": 650.0,  # exceeds physical boundary of 500 mm
        "unit": "mm",
        "location_id": "LOC_001",
    }
    report = engine.validate_observation(obs)
    assert QualityFlag.OUT_OF_RANGE in report.flags
    assert report.status in (QualityStatus.ACCEPTED_WITH_WARNING, QualityStatus.QUARANTINED)


def test_invalid_coordinates_triggers_quarantine(engine):
    obs = {
        "variable_name": "river_level_m",
        "value": 3.2,
        "unit": "m",
        "lat": 120.0,  # Invalid latitude (> 90)
        "lon": 78.5,
        "location_id": "LOC_001",
    }
    report = engine.validate_observation(obs)
    assert QualityFlag.INVALID_COORDINATE in report.flags
    assert report.status == QualityStatus.QUARANTINED
    assert report.quarantine_reason is not None


def test_duplicate_detection(engine):
    obs = {
        "variable_name": "rainfall_mm",
        "value": 10.0,
        "unit": "mm",
        "observed_at": "2026-07-15T12:00:00Z",
        "source_id": "SRC_01",
        "location_id": "LOC_001",
    }
    recent = [obs]  # Identical past observation
    report = engine.validate_observation(obs, recent_obs=recent)
    assert QualityFlag.DUPLICATE in report.flags
    assert report.status == QualityStatus.QUARANTINED
