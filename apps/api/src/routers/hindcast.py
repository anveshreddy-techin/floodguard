"""
FloodGuard AI V9 — Hindcast API Router
Endpoints for historical event catalog, step-by-step hindsight replay, and scorecards.
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from ..services.hindcast_engine import HistoricalHindcastEngine

router = APIRouter(prefix="/api/v1/hindcast", tags=["Historical Hindcast"])
engine = HistoricalHindcastEngine()


@router.get("/events")
async def list_historical_events():
    return {
        "status": "success",
        "count": len(engine.list_events()),
        "events": engine.list_events(),
        "data_mode": "HISTORICAL",
    }


@router.get("/events/{event_id}")
async def get_historical_event(event_id: str):
    data = engine.get_event_details(event_id)
    if not data:
        raise HTTPException(status_code=404, detail=f"Event '{event_id}' not found in catalog")
    return {
        "status": "success",
        "event": data,
        "data_mode": "HISTORICAL",
    }


@router.post("/runs")
async def run_historical_hindcast(
    event_id: str = Query(..., description="Event ID to replay (e.g. 2021_chamoli_rishiganga)"),
    mode: str = Query("STRICT_REPLAY", description="STRICT_REPLAY, RECONSTRUCTION, or SIMULATION"),
):
    try:
        res = engine.run_hindcast(event_id=event_id, mode=mode)
        return {
            "status": "success",
            "data_mode": "HINDCAST",
            "hindcast": res,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
