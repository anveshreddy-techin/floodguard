"""
FloodGuard AI — Alert Governance & CAP Export Service
Enforces human-in-the-loop review, blocks accidental public dispatches in DEMO mode,
and formats official Common Alerting Protocol (CAP v1.2) payloads.
"""
from __future__ import annotations

import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from ..core.config import settings
from ..core.logging import get_logger

logger = get_logger(__name__)


@dataclass
class AlertDispatchDecision:
    allowed: bool
    reason: str
    required_action: str | None
    is_simulation: bool


class AlertGovernanceService:
    """Governance authority for dispatching citizen or responder-facing alerts."""

    def can_dispatch_public_alert(
        self,
        user_role: str,
        data_mode: str,
        approval_token: str | None = None,
    ) -> AlertDispatchDecision:
        """
        Hard rules:
        1. DEMO / SIMULATION mode can NEVER dispatch live public SMS/CAP alerts.
        2. Real public dispatch requires explicit human approval if configured.
        3. Only authorized incident commanders/operators can authorize public alerts.
        """
        if data_mode in ("DEMO", "SIMULATION", "HISTORICAL", "REPLAY"):
            return AlertDispatchDecision(
                allowed=False,
                reason=f"Public alert blocked: System is operating in {data_mode} mode.",
                required_action="Switch system to verified REAL_PILOT mode to enable authorized alerts.",
                is_simulation=True,
            )

        authorized_roles = {"COMMANDER", "DISTRICT_OPERATOR", "STATE_OPERATOR", "NATIONAL_OPERATOR", "ADMIN"}
        if user_role not in authorized_roles:
            return AlertDispatchDecision(
                allowed=False,
                reason=f"User role '{user_role}' is not authorized to dispatch public warning broadcasts.",
                required_action="Request dispatch authorization from District Emergency Operation Center (DEOC).",
                is_simulation=False,
            )

        if settings.ALERT_APPROVAL_REQUIRED and not approval_token:
            return AlertDispatchDecision(
                allowed=False,
                reason="Alert dispatch requires verified two-operator authorization signature.",
                required_action="Provide verified secondary approval token.",
                is_simulation=False,
            )

        return AlertDispatchDecision(
            allowed=True,
            reason="Authorized for dispatch under standard SOP.",
            required_action=None,
            is_simulation=False,
        )

    def generate_cap_alert(
        self,
        alert_id: str,
        headline: str,
        description: str,
        severity: str,
        certainty: str,
        urgency: str,
        location_name: str,
        polygon_coords: list[tuple[float, float]] | None = None,
        data_mode: str = "DEMO",
    ) -> dict[str, Any]:
        """Generate a Common Alerting Protocol (CAP 1.2) compliant JSON message."""
        now = datetime.now(timezone.utc).isoformat()
        is_test = data_mode != "REAL_PILOT"

        cap_msg = {
            "identifier": f"IN-NDMA-FG-{alert_id}",
            "sender": "floodguard-engine@ndma.gov.in.simulated",
            "sent": now,
            "status": "Test" if is_test else "Actual",
            "msgType": "Alert",
            "scope": "Public",
            "info": {
                "category": "Met",
                "event": "Flash Flood Watch",
                "urgency": urgency,
                "severity": severity,
                "certainty": certainty,
                "eventCode": [{"valueName": "SAME", "value": "FFW"}],
                "headline": headline,
                "description": description,
                "instruction": "Avoid low-lying riverbanks, culverts, and steep ravines. Follow local disaster authority instructions.",
                "area": {
                    "areaDesc": location_name,
                    "polygon": polygon_coords or [],
                },
                "parameter": [
                    {"valueName": "FloodGuardDataMode", "value": data_mode},
                    {"valueName": "Disclaimer", "value": "Model-estimated guidance; not an unreviewed official declaration."},
                ],
            },
        }
        return cap_msg


alert_governance_service = AlertGovernanceService()
