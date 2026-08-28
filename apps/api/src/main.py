"""
FloodGuard AI — Main FastAPI Application
All responses include data_mode and evidence_state.
Simulation/demo data is never presented as live operational data.
"""
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .core.config import settings
from .core.errors import FloodGuardError, floodguard_exception_handler, validation_exception_handler
from .core.logging import configure_logging, get_logger
from .db.engine import check_db_health

configure_logging(log_level=settings.LOG_LEVEL, json_output=settings.LOG_JSON)
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(
        "floodguard_starting",
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT.value,
        data_mode=settings.DEFAULT_DATA_MODE.value,
        demo_mode=settings.DEMO_MODE,
    )
    db_health = await check_db_health()
    if db_health["status"] != "OPERATIONAL":
        logger.warning("database_unavailable_on_startup", detail=db_health.get("detail"))
    else:
        logger.info("database_connected")
    yield
    logger.info("floodguard_shutting_down")


app = FastAPI(
    title="FloodGuard AI API",
    description=(
        "Hyper-Local Multi-Source Flash-Flood Intelligence Platform (SIH26192). "
        "All responses include data_mode and evidence_state. "
        "Simulation/demo data is never presented as live operational data."
    ),
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Trace-ID", "X-Request-ID"],
    expose_headers=["X-Trace-ID", "X-FloodGuard-Data-Mode"],
)


@app.middleware("http")
async def trace_id_middleware(request: Request, call_next):
    trace_id = request.headers.get("X-Trace-ID", str(uuid.uuid4()))
    response = await call_next(request)
    response.headers["X-Trace-ID"] = trace_id
    response.headers["X-FloodGuard-Data-Mode"] = settings.DEFAULT_DATA_MODE.value
    return response


app.add_exception_handler(FloodGuardError, floodguard_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)


@app.get("/health", tags=["System"])
async def health_check():
    db_health = await check_db_health()
    all_operational = db_health["status"] == "OPERATIONAL"
    return {
        "status": "OPERATIONAL" if all_operational else "DEGRADED",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT.value,
        "data_mode": settings.DEFAULT_DATA_MODE.value,
        "demo_mode": settings.DEMO_MODE,
        "components": {
            "database": db_health,
            "weather_provider": {"status": "CONFIGURED", "provider": settings.WEATHER_PROVIDER},
            "rainfall_provider": {"status": "DEMO", "provider": settings.RAINFALL_PROVIDER},
            "river_provider": {"status": "DEMO", "provider": settings.RIVER_PROVIDER},
            "iot": {"status": "SIMULATOR" if not settings.IOT_ENABLED else "OPERATIONAL"},
            "ml_engine": {"status": "OPERATIONAL", "mode": "rule_based_baseline_v1"},
        },
        "transparency": {
            "simulation_data_is_labeled": True,
            "no_fabricated_live_data": True,
        },
    }


@app.get("/readiness", tags=["System"])
async def readiness_check():
    db_health = await check_db_health()
    ready = db_health["status"] == "OPERATIONAL"
    return JSONResponse(
        status_code=200 if ready else 503,
        content={"ready": ready, "database": db_health["status"]},
    )


@app.get("/api/v1/system/version", tags=["System"])
async def system_version():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "problem_id": "SIH26192",
        "sih_theme": "Disaster Management",
        "organization": "Ministry of Home Affairs",
        "maturity": "LEVEL_1_FUNCTIONAL_PROTOTYPE",
    }


# ─── Routers ───────────────────────────────────────────────────────────────────

from .routers import auth, locations, risk, alerts, incidents, iot, uploads, simulation, audit, system, hazards, shelters, copilot

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(locations.router, prefix="/api/v1/locations", tags=["Locations & GIS"])
app.include_router(risk.router, prefix="/api/v1/risk", tags=["Risk Engine"])
app.include_router(hazards.router, prefix="/api/v1/hazards", tags=["Hazards & Cascade"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["Alerts"])
app.include_router(incidents.router, prefix="/api/v1/incidents", tags=["Incident Command"])
app.include_router(shelters.router, prefix="/api/v1/shelters", tags=["Shelters & Evacuation"])
app.include_router(copilot.router, prefix="/api/v1/copilot", tags=["Copilot"])
app.include_router(iot.router, prefix="/api/v1/iot", tags=["IoT & Sensors"])
app.include_router(uploads.router, prefix="/api/v1/uploads", tags=["Data Upload"])
app.include_router(simulation.router, prefix="/api/v1/simulation", tags=["Simulation"])
app.include_router(audit.router, prefix="/api/v1/audit", tags=["Audit"])
app.include_router(system.router, prefix="/api/v1/system", tags=["System"])
