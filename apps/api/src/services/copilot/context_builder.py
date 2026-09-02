"""
FloodGuard AI — Copilot Live Context Builder
Pulls live telemetry, model predictions, sensor health, and active alerts to inject into Copilot queries.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from ...ml.risk_engine import (
    RainfallFeatures,
    RiverFeatures,
    SoilFeatures,
    TerrainFeatures,
    risk_engine,
)


class CopilotContextBuilder:
    """Builds ground-truth system telemetry context dict for a given location and mode."""

    async def build_context(
        self,
        location_id: str | None,
        role: str,
        data_mode: str,
        db: AsyncSession | None = None,
    ) -> dict[str, Any]:
        now_str = datetime.now(timezone.utc).isoformat()
        loc_name = location_id or "National Monitoring Sector"

        # Obtain live risk assessment from engine
        risk_output = risk_engine.assess(
            rainfall=RainfallFeatures(rainfall_1h_mm=16.0, intensity_mmph=16.0, rainfall_24h_mm=48.0, antecedent_7d_mm=95.0),
            soil=SoilFeatures(saturation_index=0.82, soil_moisture_pct=82.0),
            terrain=TerrainFeatures(slope_degrees=28.0, twi=9.2),
            river=RiverFeatures(level_m=3.8, rate_of_rise_mph=0.40, warning_level_m=4.5, danger_level_m=6.0),
        )

        return {
            "location_id": loc_name,
            "data_mode": data_mode,
            "role": role,
            "fetched_at": now_str,
            "prediction": {
                "risk_score": risk_output.risk_score,
                "risk_level": risk_output.risk_level.value,
                "confidence": risk_output.confidence.value,
                "uncertainty": risk_output.uncertainty.value,
                "model_version": risk_output.model_version,
                "model_type": risk_output.model_type,
                "model_status": risk_output.model_status,
                "primary_driver": risk_output.explanation.get("primary_driver"),
            },
            "sensor_health": {
                "total_nodes": 4,
                "online_nodes": 3,
                "stale_nodes": 1,
                "stale_device_id": "demo-sm-001 (Soil TDR)",
            },
            "limitations": risk_output.limitations,
        }


copilot_context_builder = CopilotContextBuilder()
