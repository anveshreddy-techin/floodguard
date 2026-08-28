"""
FloodGuard AI — Database Seed Script

Seeds:
1. Default admin user (change password immediately in production)
2. Demo administrative regions
3. Demo watershed
4. Demo IoT devices
5. Sample risk assessments
6. Sample alerts/incidents
7. Demo case studies

ALL seeded data is labeled data_mode=DEMO
"""
import asyncio
import hashlib
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from ..core.config import settings
from ..core.security import hash_password, Role
from .models import (
    AdminRegion, Alert, AuditLog, IoTDevice, Incident,
    RiskAssessment, User, Watershed,
)


async def seed_database() -> None:
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        print("🌱 Seeding FloodGuard AI database...")

        # ─── Users ────────────────────────────────────────────────────────────
        print("  Creating demo users...")
        admin = User(
            id=uuid.UUID("00000000-0000-0000-0000-000000000001"),
            email="admin@floodguard.demo",
            name="System Administrator",
            hashed_password=hash_password("FloodGuard2026!"),  # CHANGE IN PRODUCTION
            role=Role.ADMIN.value,
            is_active=True,
        )
        operator = User(
            id=uuid.UUID("00000000-0000-0000-0000-000000000002"),
            email="operator@floodguard.demo",
            name="Demo Operator",
            hashed_password=hash_password("Operator2026!"),
            role=Role.AUTHORITY_OPERATOR.value,
            is_active=True,
        )
        analyst = User(
            id=uuid.UUID("00000000-0000-0000-0000-000000000003"),
            email="analyst@floodguard.demo",
            name="Demo Analyst",
            hashed_password=hash_password("Analyst2026!"),
            role=Role.ANALYST.value,
            is_active=True,
        )

        for user in [admin, operator, analyst]:
            existing = await session.get(User, user.id)
            if not existing:
                session.add(user)

        # ─── Watershed ────────────────────────────────────────────────────────
        print("  Creating demo watershed...")
        watershed_upper = Watershed(
            id=uuid.UUID("10000000-0000-0000-0000-000000000001"),
            name="Upper Demo Watershed",
            code="DEMO-WS-001",
            river_basin="Demo River Basin",
            area_km2=85.4,
            mean_elevation_m=1380.0,
            max_elevation_m=2840.0,
            source="deterministic_simulator",
            meta={"data_mode": "DEMO"},
        )
        watershed_lower = Watershed(
            id=uuid.UUID("10000000-0000-0000-0000-000000000002"),
            name="Lower Demo Watershed",
            code="DEMO-WS-002",
            river_basin="Demo River Basin",
            area_km2=120.8,
            mean_elevation_m=820.0,
            max_elevation_m=1450.0,
            source="deterministic_simulator",
            meta={"data_mode": "DEMO"},
        )
        for ws in [watershed_upper, watershed_lower]:
            existing = await session.get(Watershed, ws.id)
            if not existing:
                session.add(ws)

        # ─── Admin Regions ────────────────────────────────────────────────────
        print("  Creating demo administrative regions...")
        district = AdminRegion(
            id=uuid.UUID("20000000-0000-0000-0000-000000000001"),
            region_type="district",
            name="Demo Hill District",
            state="Demo Himalayan State",
            elevation_m=1200.0,
            area_km2=1250.0,
            population=85000,
            population_source="DEMO_DATA",
            meta={"data_mode": "DEMO", "note": "Fictional district for demonstration"},
        )
        village1 = AdminRegion(
            id=uuid.UUID("20000000-0000-0000-0000-000000000002"),
            region_type="village",
            name="Chandpur Village",
            state="Demo Himalayan State",
            district="Demo Hill District",
            elevation_m=1240.0,
            area_km2=4.2,
            population=850,
            population_source="DEMO_DATA",
            meta={"data_mode": "DEMO"},
        )
        village2 = AdminRegion(
            id=uuid.UUID("20000000-0000-0000-0000-000000000003"),
            region_type="village",
            name="Ramgarh Village",
            state="Demo Himalayan State",
            district="Demo Hill District",
            elevation_m=980.0,
            area_km2=5.8,
            population=1200,
            population_source="DEMO_DATA",
            meta={"data_mode": "DEMO"},
        )
        village3 = AdminRegion(
            id=uuid.UUID("20000000-0000-0000-0000-000000000004"),
            region_type="village",
            name="Sunderbans Nagar",
            state="Demo Himalayan State",
            district="Demo Hill District",
            elevation_m=720.0,
            area_km2=8.5,
            population=3400,
            population_source="DEMO_DATA",
            meta={"data_mode": "DEMO", "note": "Downstream village — primary exposure area"},
        )

        for region in [district, village1, village2, village3]:
            existing = await session.get(AdminRegion, region.id)
            if not existing:
                session.add(region)

        # ─── IoT Devices ──────────────────────────────────────────────────────
        print("  Creating demo IoT devices...")
        devices = [
            IoTDevice(
                id=uuid.UUID("30000000-0000-0000-0000-000000000001"),
                device_id="demo-aws-001",
                name="AWS Upper Catchment (Simulator)",
                device_type="rainfall",
                location_id=uuid.UUID("20000000-0000-0000-0000-000000000002"),
                elevation_m=1450.0,
                status="ONLINE",
                hashed_secret=hashlib.sha256(b"demo-aws-001-secret-2026").hexdigest(),
                battery_pct=87.5,
                meta={"data_mode": "DEMO", "is_simulated": True},
            ),
            IoTDevice(
                id=uuid.UUID("30000000-0000-0000-0000-000000000002"),
                device_id="demo-aws-002",
                name="AWS Mid Slope (Simulator)",
                device_type="rainfall",
                location_id=uuid.UUID("20000000-0000-0000-0000-000000000003"),
                elevation_m=1050.0,
                status="ONLINE",
                hashed_secret=hashlib.sha256(b"demo-aws-002-secret-2026").hexdigest(),
                battery_pct=72.0,
                meta={"data_mode": "DEMO", "is_simulated": True},
            ),
            IoTDevice(
                id=uuid.UUID("30000000-0000-0000-0000-000000000003"),
                device_id="demo-wl-001",
                name="River Gauge Station (Simulator)",
                device_type="water_level",
                location_id=uuid.UUID("20000000-0000-0000-0000-000000000004"),
                elevation_m=650.0,
                status="ONLINE",
                hashed_secret=hashlib.sha256(b"demo-wl-001-secret-2026").hexdigest(),
                battery_pct=95.0,
                meta={"data_mode": "DEMO", "is_simulated": True},
            ),
            IoTDevice(
                id=uuid.UUID("30000000-0000-0000-0000-000000000004"),
                device_id="demo-sm-001",
                name="Soil Moisture Sensor (Simulator)",
                device_type="soil_moisture",
                location_id=uuid.UUID("20000000-0000-0000-0000-000000000002"),
                elevation_m=1300.0,
                status="STALE",  # Demo: one sensor stale
                hashed_secret=hashlib.sha256(b"demo-sm-001-secret-2026").hexdigest(),
                battery_pct=31.0,
                meta={"data_mode": "DEMO", "is_simulated": True, "note": "Low battery — demonstrates degraded mode"},
            ),
        ]
        for device in devices:
            existing = await session.get(IoTDevice, device.id)
            if not existing:
                session.add(device)

        # ─── Risk Assessments ─────────────────────────────────────────────────
        print("  Creating demo risk assessments...")
        now = datetime.now(timezone.utc)
        risk_current = RiskAssessment(
            id=uuid.UUID("40000000-0000-0000-0000-000000000001"),
            location_id=uuid.UUID("20000000-0000-0000-0000-000000000004"),
            watershed_id=uuid.UUID("10000000-0000-0000-0000-000000000002"),
            assessed_at=now - timedelta(minutes=15),
            valid_until=now + timedelta(hours=3),
            forecast_horizon_hours=6.0,
            risk_score=68.5,
            risk_level="HIGH",
            confidence="LOW",
            uncertainty="MEDIUM",
            rainfall_risk=75.0,
            soil_risk=82.0,
            terrain_risk=55.0,
            river_risk=42.0,
            historical_risk=60.0,
            contributors=[
                {"name": "rainfall", "score": 75.0, "weight": 0.35, "contribution": 26.25},
                {"name": "soil_saturation", "score": 82.0, "weight": 0.25, "contribution": 20.5},
                {"name": "terrain", "score": 55.0, "weight": 0.20, "contribution": 11.0},
            ],
            evidence=[
                {"type": "rainfall", "observation": "3h rainfall: 48mm (intense for hilly terrain)", "data_mode": "DEMO"},
                {"type": "soil_saturation", "observation": "Soil saturation: 82% (near-saturated)", "data_mode": "DEMO"},
                {"type": "historical", "observation": "Location historically susceptible to flash floods", "data_mode": "DEMO"},
            ],
            explanation={
                "summary": "High flash-flood risk. Primary driver: soil saturation elevated by antecedent rainfall.",
                "primary_driver": "soil_saturation",
                "model_note": "Rule-based baseline engine (v1). Not operationally validated.",
            },
            data_gaps=[
                "Real-time IMD rainfall unavailable — using simulated data",
                "CWC river gauge data unavailable — using simulated data",
                "Soil moisture is model-inferred, not directly measured",
            ],
            limitations=[
                "Demo data only — not real observations",
                "Model not calibrated against real flash flood events",
            ],
            model_version="rule_based_baseline_v1",
            data_sources_used=["demo_rainfall", "demo_soil", "demo_terrain"],
            data_freshness="DEMO",
            data_mode="DEMO",
            source="deterministic_simulator",
        )
        existing = await session.get(RiskAssessment, risk_current.id)
        if not existing:
            session.add(risk_current)

        # ─── Alert ────────────────────────────────────────────────────────────
        print("  Creating demo alert...")
        alert = Alert(
            id=uuid.UUID("50000000-0000-0000-0000-000000000001"),
            alert_type="rainfall_accumulation",
            severity="HIGH",
            status="ACTIVE",
            title="Flash Flood Watch — Sunderbans Nagar Downstream Area",
            description=(
                "Elevated risk of flash flooding in Sunderbans Nagar. "
                "Heavy rainfall upstream combined with elevated soil saturation. "
                "Monitor river levels. DEMO MODE — not a real emergency alert."
            ),
            location_id=uuid.UUID("20000000-0000-0000-0000-000000000004"),
            risk_assessment_id=uuid.UUID("40000000-0000-0000-0000-000000000001"),
            activated_at=now - timedelta(minutes=30),
            expires_at=now + timedelta(hours=6),
            evidence=[
                {"type": "rainfall", "value": "48mm in 3h", "source": "demo_simulator", "data_mode": "DEMO"},
                {"type": "soil", "value": "82% saturation", "source": "demo_simulator", "data_mode": "DEMO"},
            ],
            uncertainty="MEDIUM",
            operator_notes="DEMO ALERT — generated by deterministic simulator for SIH demonstration",
            data_mode="DEMO",
            source="deterministic_simulator",
        )
        existing = await session.get(Alert, alert.id)
        if not existing:
            session.add(alert)

        # ─── Incident ─────────────────────────────────────────────────────────
        print("  Creating demo incident...")
        incident = Incident(
            id=uuid.UUID("60000000-0000-0000-0000-000000000001"),
            alert_id=uuid.UUID("50000000-0000-0000-0000-000000000001"),
            title="Flash Flood Watch — Sunderbans Nagar (Demo)",
            description="Elevated risk scenario for SIH demonstration purposes.",
            status="VERIFIED",
            severity="HIGH",
            location_id=uuid.UUID("20000000-0000-0000-0000-000000000004"),
            commander_id=uuid.UUID("00000000-0000-0000-0000-000000000002"),
            evidence=[
                {"observation": "Heavy rainfall upstream", "source": "demo_simulator", "data_mode": "DEMO"},
            ],
            known_facts=[
                "Rainfall intensity elevated in upper watershed",
                "Soil saturation at 82%",
                "River level rising",
            ],
            unknown_facts=[
                "Extent of potential inundation",
                "Rate of downstream propagation",
                "Infrastructure status at downstream bridge",
            ],
            timeline=[
                {"time": (now - timedelta(hours=2)).isoformat(), "event": "Rainfall intensification detected", "data_mode": "DEMO"},
                {"time": (now - timedelta(hours=1)).isoformat(), "event": "Soil saturation threshold crossed", "data_mode": "DEMO"},
                {"time": (now - timedelta(minutes=30)).isoformat(), "event": "Alert activated", "data_mode": "DEMO"},
                {"time": (now - timedelta(minutes=20)).isoformat(), "event": "Incident opened", "data_mode": "DEMO"},
            ],
            data_mode="DEMO",
            source="deterministic_simulator",
        )
        existing = await session.get(Incident, incident.id)
        if not existing:
            session.add(incident)

        # ─── Audit Log Entry ──────────────────────────────────────────────────
        session.add(AuditLog(
            action="SEED_COMPLETED",
            actor_email="system",
            actor_role="SYSTEM",
            entity_type="system",
            entity_id="seed",
            data_mode="DEMO",
            after_state={"seed_version": "1.0", "demo_mode": True},
            meta={"note": "Initial database seed for FloodGuard AI"},
        ))

        await session.commit()
        print("✅ Database seeded successfully!")
        print("\n📋 Demo credentials:")
        print("   Admin:    admin@floodguard.demo / FloodGuard2026!")
        print("   Operator: operator@floodguard.demo / Operator2026!")
        print("   Analyst:  analyst@floodguard.demo / Analyst2026!")
        print("\n⚠️  All data is DEMO mode. Not real observations.")


if __name__ == "__main__":
    asyncio.run(seed_database())
