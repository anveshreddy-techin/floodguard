"""
FloodGuard AI — Notification Provider
Handles all external alert channels: SMS, email, push, webhook, CAP XML gateway.
All channels report NOT_CONFIGURED. In PILOT_MODE, no public warnings are dispatched.
"""
from datetime import datetime, timezone
from typing import Any


class NotificationProvider:
    """
    Central notification dispatch boundary for FloodGuard AI.
    
    PILOT_MODE: No public warning is dispatched without authorized CAP gateway
    and explicit operator approval. All channels below are NOT_CONFIGURED stubs.
    """

    def __init__(self):
        self.channels = {
            "sms_gateway": "NOT_CONFIGURED",
            "email_smtp": "NOT_CONFIGURED",
            "push_fcm": "NOT_CONFIGURED",
            "webhook": "NOT_CONFIGURED",
            "cap_gateway": "NOT_CONFIGURED",
            "ndma_ds_api": "NOT_CONFIGURED",
        }
        self.pilot_mode = True

    def status(self) -> dict[str, Any]:
        return {
            "pilot_mode": self.pilot_mode,
            "channels": self.channels,
            "note": (
                "FloodGuard AI is in PILOT_MODE. No public warnings are dispatched. "
                "All notification channels are NOT_CONFIGURED stubs. "
                "Authorization from NDMA/SEOC required before operational deployment."
            ),
            "checked_at": datetime.now(timezone.utc).isoformat(),
        }

    async def dispatch(self, alert_id: str, channel: str, payload: dict[str, Any]) -> dict[str, Any]:
        return {
            "status": "NOT_DISPATCHED",
            "reason": f"Channel '{channel}' is NOT_CONFIGURED. FloodGuard AI is in PILOT_MODE.",
            "alert_id": alert_id,
            "channel": channel,
        }

    async def send_sms(self, phone: str, message: str) -> dict[str, Any]:
        return {"status": "NOT_CONFIGURED", "channel": "sms", "phone_masked": f"{phone[:3]}****"}

    async def send_cap_alert(self, cap_xml: str) -> dict[str, Any]:
        return {"status": "NOT_CONFIGURED", "channel": "cap_gateway"}


notification_provider = NotificationProvider()
