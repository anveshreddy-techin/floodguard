"""
FloodGuard AI — Feature Store Router
Exposes reproducible feature snapshots and feature schema definitions.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.engine import get_db
from ..schemas.data_source import FeatureSnapshotRead
from ..services.feature_store import FeatureStoreService

router = APIRouter()
_feature_store = FeatureStoreService()


@router.get("/snapshot/{location_id}", summary="Get latest feature snapshot for location")
async def get_latest_feature_snapshot(
    location_id: str,
    data_mode: str = Query("DEMO", description="Data mode context"),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve the latest real-time computed feature vector for a given station/basin."""
    now = datetime.now(timezone.utc)
    # Simulated demo observations for current snapshot
    demo_observations = [
        {"variable_name": "rainfall_mm", "value": 16.0, "unit": "mm", "observed_at": now.isoformat()},
        {"variable_name": "rainfall_intensity_mmph", "value": 16.0, "unit": "mm/h", "observed_at": now.isoformat()},
        {"variable_name": "soil_moisture_pct", "value": 82.0, "unit": "%", "observed_at": now.isoformat()},
        {"variable_name": "soil_saturation_index", "value": 0.82, "unit": "index", "observed_at": now.isoformat()},
        {"variable_name": "river_level_m", "value": 3.8, "unit": "m", "observed_at": now.isoformat()},
        {"variable_name": "river_rate_of_rise_mph", "value": 0.40, "unit": "m/h", "observed_at": now.isoformat()},
    ]

    snapshot_payload = _feature_store.build_snapshot_from_observations(
        location_id=location_id,
        feature_timestamp=now,
        observations=demo_observations,
        data_mode=data_mode,
    )

    return {
        "location_id": location_id,
        "feature_timestamp": now.isoformat(),
        "feature_version": "v1.0",
        "data_mode": data_mode,
        "features": snapshot_payload,
        "missing_fraction": _feature_store.compute_missing_fraction(snapshot_payload),
    }


@router.get("/schema", summary="Get feature store variable schema definitions")
async def get_feature_schema():
    """Returns the versioned feature taxonomy, descriptions, and physical units."""
    return {
        "feature_version": "v1.0",
        "groups": {
            "rainfall": [
                {"name": "rainfall_15m_mm", "unit": "mm", "description": "15-minute accumulated precipitation"},
                {"name": "rainfall_30m_mm", "unit": "mm", "description": "30-minute accumulated precipitation"},
                {"name": "rainfall_1h_mm", "unit": "mm", "description": "1-hour accumulated precipitation"},
                {"name": "rainfall_3h_mm", "unit": "mm", "description": "3-hour accumulated precipitation"},
                {"name": "rainfall_6h_mm", "unit": "mm", "description": "6-hour accumulated precipitation"},
                {"name": "rainfall_12h_mm", "unit": "mm", "description": "12-hour accumulated precipitation"},
                {"name": "rainfall_24h_mm", "unit": "mm", "description": "24-hour daily rainfall"},
                {"name": "rainfall_72h_mm", "unit": "mm", "description": "72-hour antecedent rainfall"},
                {"name": "rainfall_peak_intensity_mmph", "unit": "mm/h", "description": "Peak instantaneous rain rate"},
            ],
            "soil": [
                {"name": "soil_moisture_pct", "unit": "%", "description": "Topsoil volumetric water content"},
                {"name": "soil_saturation_index", "unit": "fraction", "description": "Catchment saturation degree [0,1]"},
                {"name": "antecedent_7d_mm", "unit": "mm", "description": "7-day cumulative antecedent precipitation index"},
            ],
            "terrain": [
                {"name": "elevation_m", "unit": "m ASL", "description": "Mean catchment elevation"},
                {"name": "slope_degrees", "unit": "deg", "description": "Catchment mean terrain slope"},
                {"name": "twi", "unit": "index", "description": "Topographic Wetness Index ln(a/tanβ)"},
            ],
            "hydrology": [
                {"name": "river_level_m", "unit": "m", "description": "Current mainstem gauge water stage"},
                {"name": "river_rate_of_rise_mph", "unit": "m/h", "description": "Hourly rate of water level change"},
                {"name": "warning_level_diff_m", "unit": "m", "description": "Delta to CWC warning threshold"},
                {"name": "danger_level_diff_m", "unit": "m", "description": "Delta to CWC danger threshold"},
            ],
        },
    }
