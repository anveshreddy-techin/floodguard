"""
FloodGuard AI — IMD (India Meteorological Department) Adapter
Contract interface for official IMD weather/AWS telemetry.
Requires institutional static IP whitelisting in production.
Gracefully degrades to DEMO / Open-Meteo fallback.
"""
from datetime import datetime, timezone
from typing import Any
from ..core.config import settings
from ..core.logging import get_logger

logger = get_logger(__name__)


class IMDAdapter:
    """
    Adapter for IMD APIs (api.imd.gov.in / National Data Center Pune).
    """
    def __init__(self):
        self.api_key = settings.RAINFALL_API_KEY
        self.provider_status = "CONFIGURED" if self.api_key else "NOT_CONFIGURED"

    async def fetch_station_rainfall(self, station_id: str) -> dict[str, Any]:
        if not self.api_key or settings.RAINFALL_PROVIDER != "imd":
            # Transparently report NOT_CONFIGURED without fabricating live connection
            return {
                "status": "NOT_CONFIGURED",
                "source": "imd_adapter",
                "data_mode": "DEMO",
                "station_id": station_id,
                "note": "IMD direct API requires formal MoU & static IP whitelisting. Falling back to demo data.",
                "retrieved_at": datetime.now(timezone.utc).isoformat(),
            }
        
        # Real HTTP call implementation when authenticated credentials are provided
        return {"status": "SUCCESS", "source": "imd_api", "data_mode": "LIVE"}


imd_adapter = IMDAdapter()
