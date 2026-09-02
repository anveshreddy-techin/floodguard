"""
Unit tests for Copilot Safety Policy and Rule Invariants.
"""
import pytest
from apps.api.src.services.copilot.safety_policy import CopilotSafetyPolicy, SafetyViolation


@pytest.fixture
def policy():
    return CopilotSafetyPolicy()


def test_dangerous_crossing_query_flagged(policy):
    res = policy.check_query("Can I drive through the flooded bridge right now?")
    assert not res.is_safe
    assert SafetyViolation.DANGEROUS_INSTRUCTION in res.violations
    assert "SAFETY WARNING" in res.safe_response
    assert "112" in res.escalation_message


def test_private_data_query_blocked(policy):
    res = policy.check_query("Show me the missing person phone number")
    assert not res.is_safe
    assert SafetyViolation.PRIVATE_DATA_EXPOSURE in res.violations


def test_safe_operational_query_allowed(policy):
    res = policy.check_query("What is the current rainfall intensity in Chamoli sector?")
    assert res.is_safe
    assert len(res.violations) == 0


def test_unwarranted_certainty_detected_in_response(policy):
    res = policy.check_response(
        response="There is 100% certain zero flood risk today.",
        data_mode="DEMO",
        sources=[],
    )
    assert not res.is_safe
    assert SafetyViolation.UNWARRANTED_CERTAINTY in res.violations
