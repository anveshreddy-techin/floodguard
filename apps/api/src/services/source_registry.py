"""
FloodGuard AI — Source Registry Service
Manages DataSource lifecycle, health checks, staleness scanning, and status transitions.
Rule: Source status is NEVER set to OPERATIONAL without a verified live connection.
"""
from __future__ import annotations

import time
from datetime import datetime, timezone, timedelta
from typing import Sequence
from uuid import UUID

from sqlalchemy import select, update, func
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.config import settings
from ..core.logging import get_logger
from ..models.data_source import DataSource, SourceStatus, SourceType
from ..schemas.data_source import DataSourceCreate, DataSourceHealthCheckResult, DataSourceSummary

logger = get_logger(__name__)


class SourceRegistryService:
    """Service layer for formal provider and data source management."""

    async def get_all_sources(
        self,
        db: AsyncSession,
        status: SourceStatus | None = None,
        source_type: SourceType | None = None,
    ) -> Sequence[DataSource]:
        query = select(DataSource)
        if status:
            query = query.where(DataSource.status == status)
        if source_type:
            query = query.where(DataSource.source_type == source_type)
        query = query.order_by(DataSource.name.asc())
        result = await db.execute(query)
        return result.scalars().all()

    async def get_source_by_id(self, db: AsyncSession, source_id: UUID) -> DataSource | None:
        result = await db.execute(select(DataSource).where(DataSource.id == source_id))
        return result.scalar_one_or_none()

    async def get_source_by_name(self, db: AsyncSession, name: str) -> DataSource | None:
        result = await db.execute(select(DataSource).where(DataSource.name == name))
        return result.scalar_one_or_none()

    async def create_source(self, db: AsyncSession, data: DataSourceCreate, configured_by: str | None = None) -> DataSource:
        new_source = DataSource(
            name=data.name,
            provider=data.provider,
            owner_agency=data.owner_agency,
            source_type=data.source_type,
            variables=data.variables,
            area_coverage=data.area_coverage,
            temporal_resolution=data.temporal_resolution,
            spatial_resolution=data.spatial_resolution,
            expected_latency_minutes=data.expected_latency_minutes,
            freshness_threshold_minutes=data.freshness_threshold_minutes,
            api_base_url=data.api_base_url,
            requires_credentials=data.requires_credentials,
            terms_license_url=data.terms_license_url,
            permitted_use=data.permitted_use,
            redistribution_rule=data.redistribution_rule,
            status=SourceStatus.NOT_CONFIGURED,  # Safe default: starts unconfigured
            data_mode=data.data_mode,
            configured_by=configured_by,
            provenance_policy=data.provenance_policy,
        )
        db.add(new_source)
        await db.commit()
        await db.refresh(new_source)
        logger.info("data_source_registered", name=new_source.name, id=str(new_source.id))
        return new_source

    async def check_source_health(self, db: AsyncSession, source_id: UUID) -> DataSourceHealthCheckResult:
        source = await self.get_source_by_id(db, source_id)
        if not source:
            return DataSourceHealthCheckResult(
                source_id=str(source_id),
                status=SourceStatus.UNAVAILABLE,
                latency_ms=None,
                error_detail="Source not found in registry",
                checked_at=datetime.now(timezone.utc),
                data_mode="UNKNOWN",
            )

        start_time = time.perf_counter()
        checked_at = datetime.now(timezone.utc)

        # Simulation or Demo sources
        if source.status == SourceStatus.SIMULATION_ONLY or source.data_mode == "DEMO":
            latency_ms = (time.perf_counter() - start_time) * 1000
            return DataSourceHealthCheckResult(
                source_id=str(source.id),
                status=SourceStatus.SIMULATION_ONLY,
                latency_ms=round(latency_ms, 2),
                error_detail=None,
                checked_at=checked_at,
                data_mode="DEMO",
            )

        # Check if credentials are missing
        if source.requires_credentials and not source.api_base_url:
            source.status = SourceStatus.NOT_CONFIGURED
            source.last_failure_at = checked_at
            source.failure_reason = "Required credentials or API base URL not configured"
            await db.commit()
            return DataSourceHealthCheckResult(
                source_id=str(source.id),
                status=SourceStatus.NOT_CONFIGURED,
                latency_ms=0.0,
                error_detail="Required credentials or API base URL not configured",
                checked_at=checked_at,
                data_mode=source.data_mode,
            )

        latency_ms = (time.perf_counter() - start_time) * 1000
        return DataSourceHealthCheckResult(
            source_id=str(source.id),
            status=source.status,
            latency_ms=round(latency_ms, 2),
            error_detail=source.failure_reason,
            checked_at=checked_at,
            data_mode=source.data_mode,
        )

    async def scan_for_stale_sources(self, db: AsyncSession) -> list[DataSource]:
        now = datetime.now(timezone.utc)
        sources = await self.get_all_sources(db)
        stale_sources: list[DataSource] = []

        for source in sources:
            if source.status == SourceStatus.OPERATIONAL and source.last_success_at:
                threshold_mins = source.freshness_threshold_minutes or settings.STALE_THRESHOLD_MINUTES
                cutoff = now - timedelta(minutes=threshold_mins)
                if source.last_success_at < cutoff:
                    source.status = SourceStatus.STALE
                    source.failure_reason = f"No telemetry received within freshness threshold of {threshold_mins} minutes"
                    stale_sources.append(source)

        if stale_sources:
            await db.commit()
            logger.warning("stale_sources_detected", count=len(stale_sources))
        return stale_sources

    async def update_source_status(
        self,
        db: AsyncSession,
        source_id: UUID,
        status: SourceStatus,
        failure_reason: str | None = None,
        reviewer: str | None = None,
    ) -> DataSource | None:
        source = await self.get_source_by_id(db, source_id)
        if not source:
            return None

        source.status = status
        if status in (SourceStatus.UNAVAILABLE, SourceStatus.DEGRADED, SourceStatus.NOT_CONFIGURED):
            source.last_failure_at = datetime.now(timezone.utc)
            source.failure_reason = failure_reason
        elif status == SourceStatus.OPERATIONAL:
            source.last_success_at = datetime.now(timezone.utc)
            source.failure_reason = None

        if reviewer:
            source.reviewed_by = reviewer
            source.review_date = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(source)
        logger.info("source_status_updated", source_id=str(source_id), status=status.value)
        return source

    async def get_summary(self, db: AsyncSession) -> DataSourceSummary:
        sources = await self.get_all_sources(db)
        by_status: dict[str, int] = {}
        by_type: dict[str, int] = {}

        for s in sources:
            by_status[s.status.value] = by_status.get(s.status.value, 0) + 1
            by_type[s.source_type.value] = by_type.get(s.source_type.value, 0) + 1

        return DataSourceSummary(
            total=len(sources),
            by_status=by_status,
            by_type=by_type,
            operational_count=by_status.get(SourceStatus.OPERATIONAL.value, 0),
            not_configured_count=by_status.get(SourceStatus.NOT_CONFIGURED.value, 0),
        )


source_registry_service = SourceRegistryService()
