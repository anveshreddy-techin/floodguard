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


class DatasetDataMode(str, Enum):
    REAL_OBSERVATIONS = "REAL_OBSERVATIONS"
    HISTORICAL_BENCHMARK = "HISTORICAL_BENCHMARK"
    SYNTHETIC_DEVELOPMENT = "SYNTHETIC_DEVELOPMENT"
    SYNTHETIC_AUGMENTED = "SYNTHETIC_AUGMENTED"
    SIMULATION_TESTING = "SIMULATION_TESTING"


@dataclass
class DatasetManifest:
    """Immutable manifest declaring training data provenance and properties."""
    dataset_id: str
    source: str
    provider: str
    geographic_coverage: list[str]
    temporal_coverage: tuple[str, str]
    sampling_frequency: str
    feature_schema: list[str]
    target_definition: str
    label_methodology: str
    quality_criteria: dict[str, Any]
    missingness: dict[str, float]
    data_mode: str
    provenance: dict[str, Any]
    # Optional / backward-compatible properties
    id: str = ""
    name: str = ""
    created_at: datetime | None = None
    location_ids: list[str] = field(default_factory=list)
    time_range_start: datetime | None = None
    time_range_end: datetime | None = None
    feature_version: str = "v2.0"
    label_version: str = "v2.0"
    n_samples: int = 0
    n_positive: int = 0
    n_negative: int = 0
    source_ids: list[str] = field(default_factory=list)
    data_modes: list[str] = field(default_factory=list)
    quality_threshold_min: float = 0.8
    limitations: str = ""
    checksum: str = ""  # SHA-256 of serialized feature matrix

    def __post_init__(self):
        if not self.id:
            self.id = self.dataset_id
        if not self.name:
            self.name = f"Dataset-{self.dataset_id}"
        if not self.data_modes:
            self.data_modes = [self.data_mode]



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
