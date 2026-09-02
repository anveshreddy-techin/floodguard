"""
Unit tests for DEMO vs REAL_PILOT Mode Isolation.
"""
import pytest
from apps.api.src.services.ingestion_pipeline import IngestionPipeline
from apps.api.src.services.alert_governance import alert_governance_service


@pytest.fixture
def pipeline():
    return IngestionPipeline()


def test_demo_mode_alert_dispatch_blocked():
    decision = alert_governance_service.can_dispatch_public_alert(
        user_role="COMMANDER",
        data_mode="DEMO",
    )
    assert not decision.allowed
    assert "DEMO" in decision.reason
    assert decision.is_simulation is True


def test_simulation_mode_alert_dispatch_blocked():
    decision = alert_governance_service.can_dispatch_public_alert(
        user_role="NATIONAL_OPERATOR",
        data_mode="SIMULATION",
    )
    assert not decision.allowed
    assert decision.is_simulation is True


def test_mode_isolation_check(pipeline):
    assert pipeline._check_mode_isolation("DEMO") is True
    assert pipeline._check_mode_isolation("REAL_PILOT") is True
    assert pipeline._check_mode_isolation("UNKNOWN_CORRUPT_MODE") is False
