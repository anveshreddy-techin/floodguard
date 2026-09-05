"""
FloodGuard AI — NDRF (National Disaster Response Force) Tactical Operations Router
Battalion staging, Quick Response Teams (QRT), and specialized rescue asset tracking.
"""
from datetime import datetime, timezone
from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/v1/ndrf-ops", tags=["NDRF Tactical Operations"])

@router.get("/battalions")
async def get_ndrf_deployments():
    """Returns NDRF battalion deployments, team staging, and operational asset readiness."""
    deployments = [
        {
            "battalion_id": "8-BN-NDRF",
            "battalion_name": "8th Battalion NDRF (Ghaziabad / Northern Command)",
            "hq_location": "Ghaziabad, Uttar Pradesh",
            "commanding_officer": "Commandant P. K. Srivastava",
            "forward_operating_bases": [
                {
                    "team_id": "TEAM-8-ALPHA",
                    "location": "Joshimath / Raini Sector, Chamoli",
                    "strength_personnel": 45,
                    "equipment": ["4x Inflatable Motorized Boats (IRB)", "2x Victim Location Cameras", "VHF Comms Mast"],
                    "status": "FORWARD_STAGED",
                    "contact": "Team Commander: 01372-251437"
                },
                {
                    "team_id": "TEAM-8-BRAVO",
                    "location": "Guptkashi / Mandakini Corridor, Rudraprayag",
                    "strength_personnel": 40,
                    "equipment": ["3x Inflatable Rescue Boats", "Deep Diving Set", "Pneumatic Lifting Bags"],
                    "status": "ACTIVE_PATROL",
                    "contact": "Team Commander: 01364-267210"
                }
            ],
            "total_staged_personnel": 85,
            "readiness_status": "HIGH_ALERT"
        },
        {
            "battalion_id": "14-BN-NDRF",
            "battalion_name": "14th Battalion NDRF (Jaspur / Uttarakhand Command)",
            "hq_location": "Jaspur, Udham Singh Nagar, Uttarakhand",
            "commanding_officer": "Commandant Rajesh Kumar",
            "forward_operating_bases": [
                {
                    "team_id": "TEAM-14-CHARLIE",
                    "location": "Bhatwari / Harsil Sector, Uttarkashi",
                    "strength_personnel": 45,
                    "equipment": ["4x Inflatable Motor Boats", "Canine Squad (2 Dogs)", "Satellite Phone BGAN"],
                    "status": "FORWARD_STAGED",
                    "contact": "Team Commander: 01374-222123"
                },
                {
                    "team_id": "TEAM-14-DELTA",
                    "location": "Srinagar Garhwal / Alaknanda Bridge Point",
                    "strength_personnel": 35,
                    "equipment": ["2x High-Volume Dewatering Pumps", "Emergency Lighting Towers"],
                    "status": "STANDBY_RESERVE",
                    "contact": "Team Commander: 01346-252110"
                }
            ],
            "total_staged_personnel": 80,
            "readiness_status": "HIGH_ALERT"
        }
    ]
    return {
        "status": "OPERATIONAL",
        "data": deployments,
        "summary": {
            "total_battalions_engaged": len(deployments),
            "total_forward_teams": sum(len(b["forward_operating_bases"]) for b in deployments),
            "total_personnel_deployed": sum(b["total_staged_personnel"] for b in deployments),
            "total_rescue_boats": 13,
            "readiness": "DEFCON_ORANGE"
        },
        "meta": {"data_mode": "DEMO_NDRF_MHA"}
    }

@router.get("/dispatch-log")
async def get_rescue_dispatch_log():
    """Returns log of tactical search, rescue, and evacuation convoy operations."""
    return {
        "dispatches": [
            {
                "dispatch_id": "DISP-2026-0905-01",
                "team": "TEAM-8-ALPHA (Joshimath)",
                "mission": "Pre-evacuation escort for 140 residents in lower Raini terrace to GIC Shelter",
                "started_at": "13:30 IST",
                "status": "COMPLETED",
                "persons_safely_relocated": 140
            },
            {
                "dispatch_id": "DISP-2026-0905-02",
                "team": "TEAM-14-CHARLIE (Uttarkashi)",
                "mission": "Roadblock clearance and spotter stationing along Bhatwari highway corridor",
                "started_at": "14:00 IST",
                "status": "IN_PROGRESS",
                "persons_safely_relocated": 45
            }
        ]
    }
