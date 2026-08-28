"""
FloodGuard AI — Open-Meteo Weather Provider
Public API provider used for real-time and forecasted weather data.
Zero API key required for open tier.
"""
from datetime import datetime, timezone
from typing import Any
import httpx

from ..core.logging import get_logger

logger = get_logger(__name__)


class OpenMeteoProvider:
    BASE_URL = "https://api.open-meteo.com/v1/forecast"

    async def fetch_forecast(
        self,
        latitude: float,
        longitude: float,
        hourly_variables: list[str] | None = None,
    ) -> dict[str, Any]:
        """
        Fetch forecast data for a coordinate pair.
        Returns parsed weather data with data_mode=LIVE and source attribution.
        """
        variables = hourly_variables or [
            "precipitation",
            "rain",
            "soil_moisture_0_to_1cm",
            "soil_moisture_1_to_3cm",
            "soil_temperature_0cm",
            "temperature_2m",
            "relative_humidity_2m",
            "wind_speed_10m",
        ]

        params = {
            "latitude": latitude,
            "longitude": longitude,
            "hourly": ",".join(variables),
            "timezone": "UTC",
            "past_days": 2,
            "forecast_days": 3,
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(self.BASE_URL, params=params)
                response.raise_for_status()
                data = response.json()

                return {
                    "status": "SUCCESS",
                    "source": "open_meteo",
                    "data_mode": "LIVE",
                    "latitude": data.get("latitude"),
                    "longitude": data.get("longitude"),
                    "elevation": data.get("elevation"),
                    "hourly": data.get("hourly", {}),
                    "retrieved_at": datetime.now(timezone.utc).isoformat(),
                }
        except Exception as e:
            logger.warning("open_meteo_fetch_failed", error=str(e), lat=latitude, lon=longitude)
            return {
                "status": "UNAVAILABLE",
                "source": "open_meteo",
                "data_mode": "UNAVAILABLE",
                "error": str(e),
                "retrieved_at": datetime.now(timezone.utc).isoformat(),
            }


open_meteo_provider = OpenMeteoProvider()
