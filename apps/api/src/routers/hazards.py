"""
FloodGuard AI — Hazards & Cascade Router
Exposes multi-hazard cascade graph, upstream-to-downstream relationships, and bottleneck warnings.
"""
from fastapi import APIRouter, Query
from ..services.cascade_engine import cascade_engine

router = APIRouter()


@router.get("/cascade")
async def get_hazard_cascade(
    rainfall_mm: float = Query(48.0),
    soil_saturation: float = Query(0.82),
    river_rise_mph: float = Query(0.40),
):
    """
    Returns multi-stage upstream-to-downstream cascade intelligence.
    Traces anomaly from ridge precipitation down to valley village impact.
    """
    return {
        "data": cascade_engine.evaluate_cascade(
            rainfall_mm=rainfall_mm,
            soil_saturation=soil_saturation,
            river_rate_of_rise=river_rise_mph,
        ),
        "meta": {
            "data_mode": "DEMO",
            "evidence_state": "MODEL_INFERRED",
        },
    }
