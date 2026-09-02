"""
Integration test for FloodGuard Ingestion Pipeline (17 steps).
"""
import pytest
from apps.api.src.services.ingestion_pipeline import IngestionPipeline


@pytest.mark.asyncio
async def test_full_ingestion_workflow():
    pipeline = IngestionPipeline()
    payload = {
        "variable_name": "rainfall_mm",
        "value": 24.5,
        "unit": "mm",
        "lat": 30.145,
        "lon": 79.231,
        "observed_at": "2026-07-20T14:30:00Z",
    }

    result = await pipeline.ingest(
        raw_payload=payload,
        source_id="SRC_TEST_AWS_01",
        data_mode="DEMO",
    )

    assert result.status in ("ACCEPTED", "ACCEPTED_WITH_WARNING")
    assert result.raw_hash is not None
    assert len(result.raw_hash) == 64
    assert "1_mode_isolation" in result.steps_completed
    assert "17_audit_record" in result.steps_completed
    assert result.observation_id is not None
