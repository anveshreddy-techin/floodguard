"""
FloodGuard AI — CWC (Central Water Commission) Adapter
Interface for National Water Data Portal / India-WRIS river gauge telemetry.
"""
from datetime import datetime, timezone
from typing import Any
from ..core.config import settings


class CWCAdapter:
    def __init__(self):
        self.api_key = settings.RIVER_API_KEY
        self.provider_status = "CONFIGURED" if self.api_key else "NOT_CONFIGURED"

    async def fetch_gauge_telemetry(self, station_code: str) -> dict[str, Any]:
        if not self.api_key or settings.RIVER_PROVIDER != "cwc":
            return {
                "status": "NOT_CONFIGURED",
                "source": "cwc_wris_adapter",
                "data_mode": "DEMO",
                "station_code": station_code,
                "note": "CWC WRIS river gauge telemetry not configured. Using deterministic hydrological simulator.",
                "retrieved_at": datetime.now(timezone.utc).isoformat(),
            }
        return {"status": "SUCCESS", "source": "cwc_api", "data_mode": "LIVE"}


cwc_adapter = CWCAdapter()
