"""
FloodGuard AI V9 — Prediction Memory & Ledger API Router
Immutable append-only prediction records, timelines, and knowledge snapshots.
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/api/v1/predictions", tags=["Prediction Memory"])

MOCK_LEDGER = [
    {
        "prediction_id": "pred-sunderbans-001",
        "when": "2026-08-28 13:45:00 UTC",
        "where": "Sunderbans Nagar (Alluvial Fan Base)",
        "location_id": "demo-village-003",
        "risk_level": "HIGH",
        "risk_score": 68.5,
        "uncertainty": "MEDIUM",
        "model_version": "rule_based_baseline_v1",
        "data_mode": "DEMO",
        "what_happened_later": "Hydrograph peaked at 4.2m (+0.4m above warning level) 42 min later.",
        "outcome_verified": True,
        "evidence_count": 4,
    },
    {
        "prediction_id": "pred-chamoli-retro-01",
        "when": "2021-02-07 05:05:00 UTC (Retrospective)",
        "where": "Tapovan Vishnugad Hydropower Barrage",
        "location_id": "chamoli-tapovan",
        "risk_level": "EXTREME",
        "risk_score": 95.0,
        "uncertainty": "HIGH",
        "model_version": "retrospective_hindcast_v1",
        "data_mode": "HINDCAST",
        "what_happened_later": "Catastrophic rock-ice surge arrived at Tapovan barrage at ~05:15 UTC.",
        "outcome_verified": True,
        "evidence_count": 3,
    },
    {
        "prediction_id": "pred-kedarnath-retro-01",
        "when": "2013-06-16 12:00:00 UTC (Retrospective)",
        "where": "Kedarnath Township / Rambara Corridor",
        "location_id": "kedarnath-town",
        "risk_level": "EXTREME",
        "risk_score": 88.0,
        "uncertainty": "LOW",
        "model_version": "retrospective_hindcast_v1",
        "data_mode": "HINDCAST",
        "what_happened_later": "Chorabari moraine breach occurred early morning June 17, 2013.",
        "outcome_verified": True,
        "evidence_count": 5,
    },
]


@router.get("/ledger")
async def get_prediction_ledger(location_id: Optional[str] = None):
    records = MOCK_LEDGER
    if location_id:
        records = [r for r in records if r["location_id"] == location_id]
    return {
        "status": "success",
        "count": len(records),
        "ledger": records,
        "data_mode": "DEMO",
    }


@router.get("/{prediction_id}")
async def get_prediction_detail(prediction_id: str):
    record = next((r for r in MOCK_LEDGER if r["prediction_id"] == prediction_id), None)
    if not record:
        record = MOCK_LEDGER[0]
    return {
        "status": "success",
        "prediction": record,
        "data_mode": "DEMO",
    }


@router.get("/{prediction_id}/timeline")
async def get_prediction_timeline(prediction_id: str):
    timeline = [
        {"timestamp": "10:00 UTC", "risk_score": 21.0, "risk_level": "LOW", "uncertainty": "LOW", "model_version": "rule_based_baseline_v1", "reason": "Baseline monsoon drizzle."},
        {"timestamp": "10:15 UTC", "risk_score": 41.0, "risk_level": "MODERATE", "uncertainty": "MEDIUM", "model_version": "rule_based_baseline_v1", "reason": "Upper ridge rainfall crossed 20mm/h."},
        {"timestamp": "10:30 UTC", "risk_score": 68.5, "risk_level": "HIGH", "uncertainty": "MEDIUM", "model_version": "rule_based_baseline_v1", "reason": "Soil saturation index reached 82% critical limit."},
        {"timestamp": "10:45 UTC", "risk_score": 76.0, "risk_level": "EXTREME", "uncertainty": "LOW", "model_version": "rule_based_baseline_v1", "reason": "Downstream radar gauge reported +0.40m/h stage surge."},
    ]
    return {
        "status": "success",
        "prediction_id": prediction_id,
        "timeline": timeline,
        "data_mode": "DEMO",
    }
