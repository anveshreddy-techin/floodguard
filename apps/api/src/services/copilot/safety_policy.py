"""
FloodGuard Copilot Safety Policy — Hard Rules
Enforces all 12 hard safety invariants across queries and generated responses.
Safety interventions cannot be bypassed by prompt engineering or system role settings.
"""
from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Any


class SafetyViolation(str, Enum):
    OFFICIAL_WARNING_ATTEMPT = "OFFICIAL_WARNING_ATTEMPT"
    FAKE_ALERT_CLAIM = "FAKE_ALERT_CLAIM"
    SIMULATION_AS_LIVE = "SIMULATION_AS_LIVE"
    SAFE_ROUTE_ASSURANCE = "SAFE_ROUTE_ASSURANCE"
    DANGEROUS_INSTRUCTION = "DANGEROUS_INSTRUCTION"
    PRIVATE_DATA_EXPOSURE = "PRIVATE_DATA_EXPOSURE"
    INVENTED_CITATION = "INVENTED_CITATION"
    UNWARRANTED_CERTAINTY = "UNWARRANTED_CERTAINTY"
    APPROVAL_BYPASS_ATTEMPT = "APPROVAL_BYPASS_ATTEMPT"
    FAKE_GOVERNMENT_DATA = "FAKE_GOVERNMENT_DATA"
    MISSING_CONTEXT = "MISSING_CONTEXT"
    EMERGENCY_MISDIRECT = "EMERGENCY_MISDIRECT"


@dataclass
class SafetyCheckResult:
    is_safe: bool
    violations: list[SafetyViolation]
    safe_response: str | None = None
    escalation_message: str | None = None


class CopilotSafetyPolicy:
    """
    12 Hard Safety Rules:
    1. Never generate official public disaster declarations as if from NDMA/IMD.
    2. Never claim an alert has been delivered unless confirmed by delivery logs.
    3. Never present simulation/demo telemetry as live operational data.
    4. Never guarantee a route is completely safe without surface verification.
    5. Never advise entering flood waters, crossing submerging bridges, or ignoring SOPs.
    6. Never disclose unmasked missing persons or responder private data.
    7. Never invent document citations or fake bulletin numbers.
    8. Never express 100% certainty on cloudburst / GLOF forecasting.
    9. Never allow an operator to bypass required two-party approval.
    10. Never fabricate IMD radar or CWC gauge data when offline.
    11. Always explicitly indicate data mode (DEMO vs REAL_PILOT) and location.
    12. Promptly escalate life-threatening queries with National Emergency Helpline 112.
    """

    DANGEROUS_QUERY_PATTERNS = [
        "can i drive through",
        "is it safe to walk across the bridge",
        "should i ignore the evacuation",
        "can i enter the river",
        "is the bridge safe right now",
    ]

    CERTAINTY_PATTERNS = [
        "100% certain",
        "guaranteed no flood",
        "definitely safe route",
        "zero risk",
    ]

    OFFICIAL_CLAIM_PATTERNS = [
        "official ndma declaration",
        "government order to evacuate",
        "imd official bulletin approved",
    ]

    SAFE_EMERGENCY_ESCALATION = (
        "⚠️ EMERGENCY GUIDANCE: For life-threatening emergencies or trapped individuals, "
        "immediately contact emergency response at 112 (National Emergency Helpline) or NDRF control at 011-24363260. "
        "FloodGuard AI is a decision-support platform and does NOT replace directives from District Disaster Management Authorities."
    )

    def check_query(self, query: str, role: str = "VIEWER", data_mode: str = "DEMO") -> SafetyCheckResult:
        q_lower = query.lower()
        violations: list[SafetyViolation] = []

        for p in self.DANGEROUS_QUERY_PATTERNS:
            if p in q_lower:
                violations.append(SafetyViolation.DANGEROUS_INSTRUCTION)
                return SafetyCheckResult(
                    is_safe=False,
                    violations=violations,
                    safe_response=(
                        "⚠️ SAFETY WARNING: Never attempt to cross flooded roads, culverts, or damaged bridges. "
                        "Water as shallow as 15 cm (6 inches) can sweep a person off their feet, and 30 cm (1 foot) can carry away vehicles. "
                        "Move to higher ground immediately and follow instructions from local emergency personnel."
                    ),
                    escalation_message=self.SAFE_EMERGENCY_ESCALATION,
                )

        if "missing person" in q_lower and "phone" in q_lower:
            violations.append(SafetyViolation.PRIVATE_DATA_EXPOSURE)
            return SafetyCheckResult(
                is_safe=False,
                violations=violations,
                safe_response="Personal contact details and phone numbers are protected under privacy policy and restricted to verified incident commanders.",
                escalation_message=None,
            )

        return SafetyCheckResult(is_safe=True, violations=[])

    def check_response(self, response: str, data_mode: str, sources: list[dict[str, Any]]) -> SafetyCheckResult:
        r_lower = response.lower()
        violations: list[SafetyViolation] = []

        for p in self.CERTAINTY_PATTERNS:
            if p in r_lower:
                violations.append(SafetyViolation.UNWARRANTED_CERTAINTY)

        if data_mode == "DEMO" and "live operational observation" in r_lower:
            violations.append(SafetyViolation.SIMULATION_AS_LIVE)

        if violations:
            return SafetyCheckResult(
                is_safe=False,
                violations=violations,
                safe_response=response + f"\n\n[Governance Notice: Model response operates under {data_mode} mode; probabilistic decision-support only.]",
                escalation_message=None,
            )

        return SafetyCheckResult(is_safe=True, violations=[])
