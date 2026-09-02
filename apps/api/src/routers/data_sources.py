"""
FloodGuard AI — Data Sources Registry Router
REST API endpoints for data source registry, health checks, and status audits.
"""
from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.engine import get_db
from ..models.data_source import SourceStatus, SourceType
from ..schemas.data_source import (
    DataSourceCreate,
    DataSourceHealthCheckResult,
    DataSourceRead,
    DataSourceStatusUpdate,
    DataSourceSummary,
)
from ..services.source_registry import source_registry_service

router = APIRouter()


@router.get("", response_model=list[DataSourceRead], summary="List all data sources")
async def list_data_sources(
    status: SourceStatus | None = Query(None, description="Filter by operational status"),
    source_type: SourceType | None = Query(None, description="Filter by source type"),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve all registered data sources with operational metadata."""
    sources = await source_registry_service.get_all_sources(db, status=status, source_type=source_type)
    return sources


@router.get("/summary", response_model=DataSourceSummary, summary="Get registry summary statistics")
async def get_data_sources_summary(
    db: AsyncSession = Depends(get_db),
):
    """Get high-level summary of active, degraded, and unconfigured providers."""
    return await source_registry_service.get_summary(db)


@router.get("/{source_id}", response_model=DataSourceRead, summary="Get single data source")
async def get_data_source(
    source_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    source = await source_registry_service.get_source_by_id(db, source_id)
    if not source:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data source {source_id} not found in registry.",
        )
    return source


@router.post("", response_model=DataSourceRead, status_code=status.HTTP_201_CREATED, summary="Register new data source")
async def create_data_source(
    payload: DataSourceCreate,
    db: AsyncSession = Depends(get_db),
):
    """Register a new data source. Starts in NOT_CONFIGURED state."""
    existing = await source_registry_service.get_source_by_name(db, payload.name)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A data source named '{payload.name}' already exists.",
        )
    return await source_registry_service.create_source(db, payload)


@router.patch("/{source_id}/status", response_model=DataSourceRead, summary="Update data source status")
async def update_data_source_status(
    source_id: UUID,
    payload: DataSourceStatusUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update source status and governance reviewer metadata."""
    updated = await source_registry_service.update_source_status(
        db,
        source_id,
        status=payload.status,
        failure_reason=payload.failure_reason,
        reviewer=payload.reviewer,
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data source {source_id} not found.",
        )
    return updated


@router.post("/{source_id}/health-check", response_model=DataSourceHealthCheckResult, summary="Trigger live provider health check")
async def check_data_source_health(
    source_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Run an on-demand latency and reachability health check against the provider."""
    return await source_registry_service.check_source_health(db, source_id)
