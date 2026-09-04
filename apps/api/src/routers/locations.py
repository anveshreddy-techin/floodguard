"""
FloodGuard AI — Locations & GIS Router
Provides administrative regions, watersheds, river segments, and GeoJSON layer exports.
"""
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.engine import get_db
from ..db.models import AdminRegion, Watershed, RiverSegment
from ..gis.spatial_service import spatial_service

router = APIRouter()


@router.get("/regions")
async def list_regions(
    db: Annotated[AsyncSession, Depends(get_db)],
    region_type: str | None = Query(None, description="district | block | village"),
    state: str | None = Query(None),
    district: str | None = Query(None),
    limit: int = Query(50, le=500),
    offset: int = Query(0, ge=0),
):
    query = select(AdminRegion)
    if region_type:
        query = query.where(AdminRegion.region_type == region_type)
    if state:
        query = query.where(AdminRegion.state == state)
    if district:
        query = query.where(AdminRegion.district == district)

    result = await db.execute(query.limit(limit).offset(offset))
    regions = result.scalars().all()

    if not regions:
        # Fallback to demo regions if database not seeded
        return {
            "data": [
                {
                    "id": "demo-v1",
                    "name": "Chandpur Village",
                    "region_type": "village",
                    "state": "Demo Himalayan State",
                    "district": "Demo Hill District",
                    "elevation_m": 1240.0,
                    "population": 850,
                },
                {
                    "id": "demo-v2",
                    "name": "Ramgarh Village",
                    "region_type": "village",
                    "state": "Demo Himalayan State",
                    "district": "Demo Hill District",
                    "elevation_m": 980.0,
                    "population": 1200,
                },
                {
                    "id": "demo-v3",
                    "name": "Sunderbans Nagar",
                    "region_type": "village",
                    "state": "Demo Himalayan State",
                    "district": "Demo Hill District",
                    "elevation_m": 720.0,
                    "population": 3400,
                },
            ],
            "meta": {"data_mode": "DEMO", "total_returned": 3},
        }

    return {
        "data": [
            {
                "id": str(r.id),
                "name": r.name,
                "region_type": r.region_type,
                "state": r.state,
                "district": r.district,
                "block": r.block,
                "lgd_code": r.lgd_code,
                "elevation_m": r.elevation_m,
                "area_km2": r.area_km2,
                "population": r.population,
            }
            for r in regions
        ],
        "meta": {"data_mode": "DEMO", "total_returned": len(regions), "offset": offset},
    }


@router.get("/geojson/watersheds")
async def get_watersheds_geojson():
    """GeoJSON endpoint for MapLibre watershed polygons layer."""
    return spatial_service.get_demo_watershed_geojson()


@router.get("/geojson/rivers")
async def get_rivers_geojson():
    """GeoJSON endpoint for MapLibre river centerlines layer."""
    return spatial_service.get_demo_river_network_geojson()


@router.get("/geojson/villages")
async def get_villages_geojson():
    """GeoJSON endpoint for MapLibre village points and exposure circles."""
    return spatial_service.get_demo_villages_geojson()


@router.get("/resolve")
async def resolve_coordinates(
    lat: float = Query(..., description="Latitude coordinate"),
    lon: float = Query(..., description="Longitude coordinate"),
    mode: str = Query("OPERATIONAL", description="OPERATIONAL | DEMO"),
):
    """
    Global Location-Adaptive Intelligence Endpoint:
    Resolves geographic hierarchy, DEM elevation & slope, river basin,
    weather/hydrology data, data gaps, and prediction eligibility for ANY coordinate.
    """
    from ..services.global_location_service import global_location_service

    profile = await global_location_service.build_location_intelligence_profile(
        latitude=lat,
        longitude=lon,
        operational_mode=mode,
    )
    return profile


@router.post("/profile")
async def resolve_location_profile(body: dict):
    """
    POST variant for Location Intelligence Profile query:
    Accepts latitude, longitude, and operational mode.
    """
    from ..services.global_location_service import global_location_service

    lat = float(body.get("latitude") or body.get("lat") or 30.485)
    lon = float(body.get("longitude") or body.get("lon") or 79.692)
    mode = str(body.get("mode", "OPERATIONAL"))

    profile = await global_location_service.build_location_intelligence_profile(
        latitude=lat,
        longitude=lon,
        operational_mode=mode,
    )
    return profile

