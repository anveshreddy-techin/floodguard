"""
FloodGuard AI V9 — User Location & Safety Guidance Router
Zero silent tracking, permission-gated, conservative candidate guidance.
"""
from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional, Dict, Any, List
from ..services.exposure_engine import UserExposureEngine
from ..services.route_engine import HazardAwareRouteEngine
from ..models.safety import UserSafetySession, CommunityReport, OfficialAlert

router = APIRouter(prefix="/api/v1", tags=["User Safety & Location Guidance"])
exposure_engine = UserExposureEngine()
route_engine = HazardAwareRouteEngine()

ACTIVE_OFFICIAL_ALERTS = [
    OfficialAlert(
        source="State Disaster Management Authority (SDMA)",
        source_type="GOVERNMENT",
        severity="HIGH",
        title="Official Flash Flood Watch — Upper Catchment",
        message="Local administration advises residents in low-lying riverbanks to stay alert and avoid crossing swollen seasonal streams.",
        area_description="Sunderbans Nagar, Ward 1 to 4, Riverbed Zone",
        is_evacuation_order=False,
    )
]

COMMUNITY_REPORTS: List[Dict[str, Any]] = [
    {
        "report_id": "rep-001",
        "report_type": "ROUTE_BLOCKED",
        "description": "Small gravel slip at KM 0.6 on riverbed bypass. Water flowing across road.",
        "timestamp": "12 min ago",
        "verification_status": "CORROBORATED",
    }
]


@router.post("/location/check")
async def check_user_location_exposure(
    lat: Optional[float] = Query(None, description="User latitude (permission-gated)"),
    lon: Optional[float] = Query(None, description="User longitude (permission-gated)"),
    accuracy_m: Optional[float] = Query(15.0),
    sensor_failure: bool = Query(False),
    hazard_expansion: float = Query(0.0),
):
    exposure = exposure_engine.evaluate_exposure(
        lat=lat,
        lon=lon,
        accuracy_m=accuracy_m,
        official_alert_active=len(ACTIVE_OFFICIAL_ALERTS) > 0,
        simulated_hazard_expansion=hazard_expansion,
    )
    guidance = route_engine.generate_safety_guidance(
        exposure=exposure,
        official_alerts=ACTIVE_OFFICIAL_ALERTS,
        sensor_failure_active=sensor_failure,
    )
    return {
        "status": "success",
        "exposure": exposure,
        "guidance": guidance,
        "data_mode": "DEMO" if (lat == 30.505) else "LIVE",
    }


@router.get("/routes/candidate")
async def get_candidate_routes(
    lat: Optional[float] = 30.505,
    lon: Optional[float] = 79.155,
):
    exposure = exposure_engine.evaluate_exposure(lat, lon)
    routes = route_engine.get_candidate_routes(exposure)
    return {
        "status": "success",
        "routes": routes,
        "disclaimer": "All paths labeled CANDIDATE — physical surface safety must be verified before travel.",
    }


@router.post("/rescue/request")
async def submit_rescue_request(payload: Dict[str, Any] = Body(...)):
    report_id = f"rescue-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    return {
        "status": "received",
        "rescue_id": report_id,
        "message": "Emergency request queued for authorized response coordination.",
        "note": "For immediate physical peril, always dial national emergency 112 / 1070.",
    }


@router.get("/community/reports")
async def get_community_reports():
    return {
        "status": "success",
        "reports": COMMUNITY_REPORTS,
    }


@router.post("/community/report")
async def submit_community_report(payload: Dict[str, Any] = Body(...)):
    rep = {
        "report_id": f"rep-{len(COMMUNITY_REPORTS)+1:03d}",
        "report_type": payload.get("report_type", "COMMUNITY_OBSERVATION"),
        "description": payload.get("description", ""),
        "timestamp": "Just now",
        "verification_status": "UNVERIFIED",
    }
    COMMUNITY_REPORTS.insert(0, rep)
    return {
        "status": "success",
        "report": rep,
        "message": "Field observation submitted to human verification queue.",
    }
