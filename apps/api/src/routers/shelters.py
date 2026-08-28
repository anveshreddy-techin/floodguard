"""
FloodGuard AI — Shelters & Evacuation Router
Provides designated relief shelters and candidate evacuation paths.
Truthfulness rule: Always designates paths as 'Candidate route — safety not verified' unless field-checked.
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("")
async def list_shelters():
    """List designated relief shelters with current operational readiness."""
    return {
        "data": [
            {
                "id": "shelter-001",
                "name": "Community High School Shelter (Elevated Ground)",
                "location": "Upper Ridge Plateau, Sunderbans Nagar",
                "capacity": 450,
                "current_occupancy": 0,
                "status": "READY_FOR_ACTIVATION",
                "elevation_m": 840.0,
                "accessibility": "High ground accessible via North Ridge Road",
                "backup_power": True,
                "drinking_water": True,
                "data_mode": "DEMO",
            },
            {
                "id": "shelter-002",
                "name": "Panchayat Bhavan Relief Center",
                "location": "West Sector, Chandpur Village",
                "capacity": 250,
                "current_occupancy": 0,
                "status": "STANDBY",
                "elevation_m": 1260.0,
                "accessibility": "Accessible",
                "backup_power": True,
                "drinking_water": True,
                "data_mode": "DEMO",
            },
        ],
        "meta": {"data_mode": "DEMO"},
    }


@router.get("/routes")
async def list_candidate_routes():
    """
    Returns candidate evacuation routes with explicit verification disclaimer.
    Never claims a route is safe without verified ground truth.
    """
    return {
        "data": [
            {
                "id": "route-001",
                "name": "North Ridge Evacuation Trail",
                "origin": "Sunderbans Nagar Lowland Settlement",
                "destination": "Community High School Shelter",
                "distance_km": 1.4,
                "status": "CANDIDATE",
                "status_label": "Candidate route — safety not verified",
                "bottlenecks": ["Culvert Crossing KM 0.6 (Potential overflow during peak)"],
                "last_inspected": "Pre-monsoon survey",
                "data_mode": "DEMO",
            },
            {
                "id": "route-002",
                "name": "Riverbed Bypass Highway (NH Link)",
                "origin": "Ramgarh Market",
                "destination": "District Relief Camp",
                "distance_km": 6.8,
                "status": "BLOCKED",
                "status_label": "High Inundation Risk — River Surge Zone",
                "bottlenecks": ["Low-lying Causeway at River Gauge 001"],
                "last_inspected": "Continuous Sensor Monitoring",
                "data_mode": "DEMO",
            },
        ],
        "disclaimer": "All paths are candidate routes. Safety is not guaranteed without real-time field confirmation.",
        "meta": {"data_mode": "DEMO"},
    }
