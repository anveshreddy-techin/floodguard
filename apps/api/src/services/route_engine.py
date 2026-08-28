"""
FloodGuard AI V9 — Hazard-Aware Route Engine
Evaluates candidate evacuation routes, avoids active flood/bridge bottlenecks,
and strictly enforces truthful labeling (NEVER claims 'SAFE ROUTE').
"""
from typing import Dict, Any, List, Optional
from ..models.safety import GuidanceRoute, UserExposure, OfficialAlert, SafetyGuidance


class HazardAwareRouteEngine:
    DEMO_CANDIDATE_ROUTES = [
        {
            "route_id": "rt-north-ridge",
            "name": "North Ridge Elevated Trail (Towards High School)",
            "base_distance_km": 1.4,
            "elevation_gain_m": 120,
            "hazard_overlap": False,
            "bridge_status": "CLEAR",
            "verification_status": "CANDIDATE",
            "label": "LOWER_EXPOSURE_CANDIDATE",
            "note": "Path ascends ridge above flood line. Candidate route — physical surface safety not verified.",
        },
        {
            "route_id": "rt-panchayat-bypass",
            "name": "Upper Panchayat Bhavan Connector",
            "base_distance_km": 2.1,
            "elevation_gain_m": 85,
            "hazard_overlap": False,
            "bridge_status": "CLEAR",
            "verification_status": "CANDIDATE",
            "label": "CANDIDATE_ROUTE",
            "note": "Higher elevation bypass. Avoids low culvert KM 0.6.",
        },
        {
            "route_id": "rt-river-nh-link",
            "name": "Riverbed Bypass NH-58 Link",
            "base_distance_km": 0.9,
            "elevation_gain_m": 5,
            "hazard_overlap": True,
            "bridge_status": "BLOCKED",
            "verification_status": "VERIFIED",
            "label": "BLOCKED",
            "note": "HIGH INUNDATION RISK — Direct intersection with active river surge channel. Avoid completely.",
        },
    ]

    def get_candidate_routes(
        self,
        exposure: UserExposure,
        sensor_failure_active: bool = False,
    ) -> List[GuidanceRoute]:
        routes = []
        for r_def in self.DEMO_CANDIDATE_ROUTES:
            conf = "LOW" if sensor_failure_active else ("HIGH" if r_def["label"] == "BLOCKED" else "MEDIUM")
            lbl = r_def["label"]
            if sensor_failure_active and lbl != "BLOCKED":
                lbl = "ROUTE_SAFETY_NOT_VERIFIED"

            routes.append(
                GuidanceRoute(
                    route_id=r_def["route_id"],
                    name=r_def["name"],
                    confidence=conf,
                    road_data_freshness_minutes=4,
                    hazard_overlap=r_def["hazard_overlap"],
                    bridge_status=r_def["bridge_status"],
                    verification_status=r_def["verification_status"],
                    label=lbl,
                    distance_km=r_def["base_distance_km"],
                    note=r_def["note"],
                )
            )
        return routes

    def generate_safety_guidance(
        self,
        exposure: UserExposure,
        official_alerts: Optional[List[OfficialAlert]] = None,
        sensor_failure_active: bool = False,
    ) -> SafetyGuidance:
        routes = self.get_candidate_routes(exposure, sensor_failure_active)
        alerts = official_alerts or []

        level_labels = {
            0: "MONITOR",
            1: "STAY ALERT",
            2: "MOVE AWAY FROM RIVER / CHANNEL",
            3: "MOVE TOWARD CANDIDATE LOWER-EXPOSURE AREA",
            4: "FOLLOW OFFICIAL EVACUATION INSTRUCTIONS",
        }

        lvl = exposure.guidance_level
        if any(a.is_evacuation_order for a in alerts):
            lvl = 4

        primary_msgs = {
            0: "Low estimated flood risk. Continue normal monitoring.",
            1: "Moderate flood watch nearby. Stay alert and review official announcements.",
            2: "High estimated risk. Move away from riverbanks and low-lying drainage channels.",
            3: "Extreme estimated risk. Seek higher ground along candidate lower-exposure routes.",
            4: "OFFICIAL EVACUATION NOTICE ACTIVE. Comply immediately with local authority instructions.",
        }

        shelters = [
            {"name": "Community High School Shelter", "distance_km": 1.4, "elevation_m": 840, "status": "READY"},
            {"name": "Panchayat Bhavan Center", "distance_km": 2.1, "elevation_m": 1260, "status": "STANDBY"},
        ]

        return SafetyGuidance(
            level=lvl,
            level_label=level_labels.get(lvl, "MONITOR"),
            risk_level=exposure.risk_level,
            exposure=exposure,
            primary_message=primary_msgs.get(lvl, "Monitor conditions."),
            why_messages=exposure.why,
            candidate_routes=routes,
            official_alerts=alerts,
            shelters=shelters,
            data_freshness_minutes=4,
            confidence="LOW" if sensor_failure_active else exposure.confidence,
            is_degraded=sensor_failure_active,
            degradation_reason="Upstream sensor communication degraded. Reverting to conservative guidance." if sensor_failure_active else None,
        )
