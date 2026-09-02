"""
FloodGuard AI — Dataset Manifest and Label Schemas
Structures for reproducible, versioned ML training datasets.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum


class LabelConfidence(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    UNCERTAIN = "UNCERTAIN"


@dataclass
class DatasetManifest:
    """Immutable manifest declaring training data provenance and properties."""
    id: str
    name: str
    created_at: datetime
    location_ids: list[str]
    time_range_start: datetime
    time_range_end: datetime
    feature_version: str
    label_version: str
    n_samples: int
    n_positive: int
    n_negative: int
    source_ids: list[str]
    data_modes: list[str]
    quality_threshold_min: float
    limitations: str
    checksum: str  # SHA-256 of serialized feature matrix


@dataclass
class LabelRecord:
    """Historical or hindcast ground truth event declaration."""
    id: str
    event_name: str
    event_type: str  # FLASH_FLOOD, RIVER_FLOOD, LANDSLIDE, GLOF
    location_id: str
    watershed_id: str
    event_start: datetime
    event_end: datetime
    label_value: int  # 0 or 1
    label_window_minutes: int
    source: str  # NDMA, IMD, CWC, SDMA, FIELD_REPORT
    confidence: LabelConfidence
    reviewer: str
    label_version: str
    eligible_for_training: bool
    notes: str
