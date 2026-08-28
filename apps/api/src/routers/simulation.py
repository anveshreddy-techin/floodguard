"""
FloodGuard AI — Scenario Simulation Router
What-if scenarios. All output is labeled SIMULATION.
Never presented as LIVE operational data.
"""
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.engine import get_db
from ..db.models import SimulationScenario

router = APIRouter()


class ScenarioParameters(BaseModel):
    rainfall_mm_per_hour: float = Field(ge=0, le=500, description="Simulated rainfall intensity")
    duration_hours: float = Field(ge=1, le=72, description="Event duration")
    antecedent_moisture_pct: float = Field(ge=0, le=100, description="Initial soil saturation %")
    river_level_m: float | None = Field(None, ge=0, description="Initial river level")
    upstream_anomaly: bool = False
    sensor_failure_pct: float = Field(0, ge=0, le=100, description="% of sensors to simulate as failed")
    location_id: str | None = None
    seed: int | None = Field(None, description="Random seed for deterministic replay")


class RunScenario(BaseModel):
    name: str
    description: str | None = None
    parameters: ScenarioParameters


@router.post("/run")
async def run_simulation(
    request: RunScenario,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """
    Run a what-if scenario simulation.
    
    ALL OUTPUT IS LABELED SIMULATION. This is not a validated physical model.
    Outputs show directional trends based on risk rules, not calibrated hydrodynamics.
    """
    params = request.parameters
    p = params

    # Simple rule-based simulation (not a physical model — labeled accordingly)
    # Compute simulated risk components
    rainfall_risk = min(100, (p.rainfall_mm_per_hour / 50) * 100)
    soil_risk = p.antecedent_moisture_pct
    terrain_risk = 50  # Static for now — would use DEM in full implementation
    river_risk = min(100, ((p.river_level_m or 0) / 10) * 100) if p.river_level_m else 30
    sensor_confidence_penalty = p.sensor_failure_pct * 0.3

    composite_score = (
        rainfall_risk * 0.35
        + soil_risk * 0.25
        + terrain_risk * 0.20
        + river_risk * 0.15
        + (5 if p.upstream_anomaly else 0)
    )
    composite_score = min(100, composite_score)

    risk_level = (
        "EXTREME" if composite_score >= 75
        else "HIGH" if composite_score >= 55
        else "MODERATE" if composite_score >= 35
        else "LOW"
    )

    uncertainty = (
        "HIGH" if sensor_confidence_penalty > 20
        else "MEDIUM" if sensor_confidence_penalty > 10
        else "LOW"
    )

    scenario = SimulationScenario(
        name=request.name,
        description=request.description,
        parameters=params.model_dump(),
        results={
            "composite_risk_score": round(composite_score, 1),
            "risk_level": risk_level,
            "uncertainty": uncertainty,
            "components": {
                "rainfall_risk": round(rainfall_risk, 1),
                "soil_risk": round(soil_risk, 1),
                "terrain_risk": round(terrain_risk, 1),
                "river_risk": round(river_risk, 1),
            },
            "upstream_cascade": p.upstream_anomaly,
            "sensor_coverage_penalty": round(sensor_confidence_penalty, 1),
        },
        status="COMPLETED",
        data_mode="SIMULATION",
        seed=p.seed,
        scenario_type="what_if",
    )
    db.add(scenario)

    return {
        "simulation_id": str(scenario.id),
        "name": request.name,
        "data_mode": "SIMULATION",
        "disclaimer": (
            "This is a simplified rule-based simulation, NOT a validated physical model. "
            "Results show directional risk trends only. "
            "Do not use for operational decisions without validated hydrological modeling."
        ),
        "parameters": params.model_dump(),
        "results": scenario.results,
    }
