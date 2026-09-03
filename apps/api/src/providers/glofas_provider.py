"""
FloodGuard AI — GloFAS (Global Flood Awareness System) River Discharge Provider
Integrates the Copernicus Emergency Management Service / Open-Meteo Flood API.
Provides real-time and 3-day forecasted river discharge (m³/s) across all Indian river basins.
Free, open tier, zero credentials required.
"""
from datetime import datetime, timezone
from typing import Any, Optional
import httpx

from ..core.logging import get_logger

logger = get_logger(__name__)


class GloFASRiverProvider:
    BASE_URL = "https://flood-api.open-meteo.com/v1/flood"

    async def fetch_discharge(
        self,
        latitude: float,
        longitude: float,
        forecast_days: int = 3,
    ) -> dict[str, Any]:
        """
        Fetch river discharge data for coordinates in any Indian river basin.
        Returns m³/s discharge, mean, max, and derived rate of rise.
        """
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "daily": "river_discharge,river_discharge_mean,river_discharge_max",
            "forecast_days": forecast_days,
        }

        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(
                    self.BASE_URL,
                    params=params,
                    headers={"User-Agent": "FloodGuard-AI/2.0 (NDRF Disaster Intelligence)"},
                )
                res.raise_for_status()
                data = res.json()

                daily = data.get("daily", {})
                discharges = daily.get("river_discharge", [])
                discharge_mean = daily.get("river_discharge_mean", [])
                discharge_max = daily.get("river_discharge_max", [])
                dates = daily.get("time", [])

                current_discharge = discharges[0] if discharges and discharges[0] is not None else 25.0
                max_discharge = max([d for d in discharge_max if d is not None] or [current_discharge])
                
                # Estimate rate of rise from day-over-day discharge change
                rise_rate_m_hr = 0.0
                if len(discharges) >= 2 and discharges[1] is not None and discharges[0] is not None:
                    daily_delta = discharges[1] - discharges[0]
                    # Approximate stage response rate: 100 m3/s delta ~ 0.25m stage rise per day
                    rise_rate_m_hr = max(0.0, round(daily_delta / 24.0 * 0.05, 3))

                return {
                    "status": "SUCCESS",
                    "source": "GloFAS_Copernicus_Flood_Service",
                    "data_mode": "LIVE",
                    "latitude": data.get("latitude"),
                    "longitude": data.get("longitude"),
                    "river_discharge_m3_s": current_discharge,
                    "river_discharge_max_m3_s": max_discharge,
                    "estimated_rate_of_rise_m_hr": rise_rate_m_hr,
                    "forecast_dates": dates,
                    "forecast_values": discharges,
                    "retrieved_at": datetime.now(timezone.utc).isoformat(),
                    "attribution": "Copernicus Emergency Management Service / GloFAS (Open-Meteo Gateway)",
                }
        except Exception as e:
            logger.warning("glofas_fetch_failed", error=str(e), lat=latitude, lon=longitude)
            return {
                "status": "FALLBACK",
                "source": "GloFAS_Copernicus_Flood_Service",
                "data_mode": "DEMO",
                "latitude": latitude,
                "longitude": longitude,
                "river_discharge_m3_s": 45.0,
                "river_discharge_max_m3_s": 95.0,
                "estimated_rate_of_rise_m_hr": 0.25,
                "error": str(e),
                "retrieved_at": datetime.now(timezone.utc).isoformat(),
            }

glofas_river_provider = GloFASRiverProvider()
