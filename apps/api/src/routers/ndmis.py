"""
FloodGuard AI — MHA NDMIS (National Disaster Management Information System) Router
Operational reporting, district damage assessment, and relief camp tracking.
"""
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/v1/ndmis", tags=["MHA NDMIS Operations"])

@router.get("/damage-assessment")
async def get_district_damage_assessment(
    state: str = Query("Uttarakhand", description="Target State"),
    district: Optional[str] = Query(None, description="Target District"),
):
    """Returns official damage and impact statistics structured in NDMIS format."""
    assessments = [
        {
            "district": "Chamoli",
            "state": "Uttarakhand",
            "households_affected": 240,
            "population_at_risk": 4850,
            "roads_blocked_km": 14.5,
            "bridges_culverts_damaged": 3,
            "human_lives_lost": 0,
            "injured_rescued": 18,
            "relief_camps_active": 4,
            "camps_occupancy": 320,
            "agricultural_submerged_ha": 42.0,
            "reporting_date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "status": "ACTIVE_INCIDENT",
            "reporting_authority": "Chamoli District Magistrate / DEOC"
        },
        {
            "district": "Uttarkashi",
            "state": "Uttarakhand",
            "households_affected": 410,
            "population_at_risk": 8200,
            "roads_blocked_km": 28.0,
            "bridges_culverts_damaged": 5,
            "human_lives_lost": 0,
            "injured_rescued": 34,
            "relief_camps_active": 6,
            "camps_occupancy": 580,
            "agricultural_submerged_ha": 85.0,
            "reporting_date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "status": "ACTIVE_INCIDENT",
            "reporting_authority": "Uttarkashi District Magistrate / DEOC"
        },
        {
            "district": "Kullu",
            "state": "Himachal Pradesh",
            "households_affected": 180,
            "population_at_risk": 3600,
            "roads_blocked_km": 8.0,
            "bridges_culverts_damaged": 2,
            "human_lives_lost": 0,
            "injured_rescued": 12,
            "relief_camps_active": 3,
            "camps_occupancy": 210,
            "agricultural_submerged_ha": 30.0,
            "reporting_date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "status": "MONITORING",
            "reporting_authority": "Kullu District Administration"
        }
    ]
    
    if district:
        filtered = [a for a in assessments if a["district"].lower() == district.lower()]
        return {"data": filtered or assessments[:1], "meta": {"data_mode": "DEMO_NDMIS", "total": len(filtered)}}

    return {"data": assessments, "meta": {"data_mode": "DEMO_NDMIS", "total": len(assessments)}}

@router.get("/relief-camps")
async def get_relief_camps_ledger():
    """Returns relief camp directory, capacities, and utility provision status."""
    camps = [
        {
            "camp_id": "NDMIS-CAMP-UK-01",
            "name": "Govt Inter College (GIC) Joshimath",
            "district": "Chamoli",
            "state": "Uttarakhand",
            "sanctioned_capacity": 650,
            "current_occupancy": 140,
            "available_capacity": 510,
            "occupancy_rate_pct": 21.5,
            "drinking_water": "OPERATIONAL_RO",
            "power_backup": "SOLAR_GENSET",
            "medical_team": "DEPUTED",
            "sanitation_facilities": "ADEQUATE",
            "nodal_officer": "Shri R. S. Negi (Sub-Divisional Magistrate)"
        },
        {
            "camp_id": "NDMIS-CAMP-UK-02",
            "name": "Panchayat Bhawan Pipalkoti",
            "district": "Chamoli",
            "state": "Uttarakhand",
            "sanctioned_capacity": 350,
            "current_occupancy": 45,
            "available_capacity": 305,
            "occupancy_rate_pct": 12.8,
            "drinking_water": "OPERATIONAL_TANKER",
            "power_backup": "GENSET",
            "medical_team": "ON_CALL",
            "sanitation_facilities": "ADEQUATE",
            "nodal_officer": "Smt. K. Rawat"
        },
        {
            "camp_id": "NDMIS-CAMP-UK-03",
            "name": "Bhatwari Multi-Purpose Hall",
            "district": "Uttarkashi",
            "state": "Uttarakhand",
            "sanctioned_capacity": 500,
            "current_occupancy": 210,
            "available_capacity": 290,
            "occupancy_rate_pct": 42.0,
            "drinking_water": "OPERATIONAL_RO",
            "power_backup": "SOLAR",
            "medical_team": "DEPUTED",
            "sanitation_facilities": "ADEQUATE",
            "nodal_officer": "Dr. V. K. Semwal"
        }
    ]
    return {
        "data": camps,
        "summary": {
            "total_registered_camps": len(camps),
            "total_sanctioned_capacity": sum(c["sanctioned_capacity"] for c in camps),
            "total_occupancy": sum(c["current_occupancy"] for c in camps),
            "overall_occupancy_rate_pct": round(sum(c["current_occupancy"] for c in camps) / sum(c["sanctioned_capacity"] for c in camps) * 100, 1)
        },
        "meta": {"data_mode": "DEMO_NDMIS"}
    }
