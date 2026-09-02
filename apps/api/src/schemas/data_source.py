"""
FloodGuard AI — Pydantic Schemas for Data Governance
Covers DataSource, SourceObservation, FeatureSnapshot, ModelVersion, AnalysisRun.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from ..models.data_source import SourceStatus, SourceType
from ..models.model_version import DeploymentStatus
from ..models.analysis_run import RunStatus


# ─── DataSource ───────────────────────────────────────────────────────────────

class DataSourceCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    provider: str = Field(min_length=2, max_length=100)
    owner_agency: str | None = None
    source_type: SourceType
    variables: list[str] = Field(default_factory=list)
    area_coverage: str | None = None
    temporal_resolution: str | None = None
    spatial_resolution: str | None = None
    expected_latency_minutes: int | None = 15
    freshness_threshold_minutes: int | None = 60
    api_base_url: str | None = None
    requires_credentials: bool = True
    terms_license_url: str | None = None
    permitted_use: str | None = None
    redistribution_rule: str | None = None
    data_mode: str = "DEMO"
    provenance_policy: str | None = None


class DataSourceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    provider: str
    owner_agency: str | None
    source_type: SourceType
    variables: list[str]
    area_coverage: str | None
    temporal_resolution: str | None
    spatial_resolution: str | None
    expected_latency_minutes: int | None
    freshness_threshold_minutes: int | None
    api_base_url: str | None
    requires_credentials: bool
    terms_license_url: str | None
    permitted_use: str | None
    redistribution_rule: str | None
    status: SourceStatus
    last_success_at: datetime | None
    last_failure_at: datetime | None
    failure_reason: str | None
    data_mode: str
    configured_by: str | None
    reviewed_by: str | None
    review_date: datetime | None
    provenance_policy: str | None
    created_at: datetime
    updated_at: datetime


class DataSourceStatusUpdate(BaseModel):
    status: SourceStatus
    failure_reason: str | None = None
    reviewer: str | None = None


class DataSourceHealthCheckResult(BaseModel):
    source_id: str
    status: SourceStatus
    latency_ms: float | None
    error_detail: str | None
    checked_at: datetime
    data_mode: str


class DataSourceSummary(BaseModel):
    total: int
    by_status: dict[str, int]
    by_type: dict[str, int]
    operational_count: int
    not_configured_count: int


# ─── FeatureSnapshot ──────────────────────────────────────────────────────────

class FeatureSnapshotRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    location_id: str
    watershed_id: str | None
    feature_timestamp: datetime
    generated_at: datetime
    observed_data_cutoff_at: datetime
    feature_version: str
    input_source_ids: list[str]
    data_mode: str
    missing_fraction: float
    stale_source_count: int
    source_agreement_score: float | None
    feature_payload: dict[str, Any]
    trace_id: str
    created_at: datetime


# ─── ModelVersion ─────────────────────────────────────────────────────────────

class ModelVersionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    semantic_version: str
    model_type: str
    target: str
    region: str | None
    feature_version: str
    label_version: str
    evaluation_report: dict[str, Any] | None
    artifact_uri: str | None
    artifact_checksum: str | None
    deployment_status: str
    reviewer: str | None
    approval_date: datetime | None
    limitations: str
    created_at: datetime
    updated_at: datetime


class ModelVersionPromote(BaseModel):
    new_status: DeploymentStatus
    reviewer: str = Field(min_length=2)
    reason: str = Field(min_length=10)


# ─── AnalysisRun ─────────────────────────────────────────────────────────────

class AnalysisRunRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: str
    location_id: str
    uploaded_dataset_ids: list[str]
    model_version_id: UUID | None
    feature_version: str | None
    data_mode: str
    result_status: str
    quality_report_id: str | None
    prediction_ids: list[str]
    limitations: str | None
    created_at: datetime
    trace_id: str
