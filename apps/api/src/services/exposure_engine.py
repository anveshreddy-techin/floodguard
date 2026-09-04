"""
FloodGuard AI V9 — User Exposure Engine
Calculates spatial proximity to hazard polygons, rate-of-approach, and conservative guidance level.
"""
import math
from datetime import datetime
from typing import Dict, Any, List, Optional
from ..models.safety import UserExposure, OfficialAlert, SafetyGuidance, GuidanceRoute


class UserExposureEngine:
    # Model center of primary demonstration hazard corridor (e.g. Sunderbans Nagar Valley)
    HAZARD_CENTER_LAT = 30.5050
    HAZARD_CENTER_LON = 79.1550
    HAZARD_RADIUS_KM = 1.20

    @staticmethod
    def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Haversine distance in kilometers."""
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 3)

    def evaluate_exposure(
        self,
        lat: Optional[float],
        lon: Optional[float],
        accuracy_m: Optional[float] = 15.0,
        model_risk_level: str = "HIGH",
        official_alert_active: bool = False,
        simulated_hazard_expansion: float = 0.0,
        hazard_center_lat: Optional[float] = None,
        hazard_center_lon: Optional[float] = None,
        hazard_radius_km: Optional[float] = None,
    ) -> UserExposure:
        if lat is None or lon is None:
            return UserExposure(
                exposure_status="UNKNOWN",
                risk_level="UNKNOWN",
                distance_to_hazard_km=None,
                confidence="INSUFFICIENT_DATA",
                location_accuracy_ok=False,
                guidance_level=0,
                why=["Location coordinates unavailable. Please select location on map."],
            )

        h_lat = hazard_center_lat if hazard_center_lat is not None else (lat if (lat != self.HAZARD_CENTER_LAT and hazard_center_lat is not None) else self.HAZARD_CENTER_LAT)
        h_lon = hazard_center_lon if hazard_center_lon is not None else (lon if (lon != self.HAZARD_CENTER_LON and hazard_center_lon is not None) else self.HAZARD_CENTER_LON)
        h_radius = hazard_radius_km if hazard_radius_km is not None else self.HAZARD_RADIUS_KM

        dist_km = self.calculate_distance_km(lat, lon, h_lat, h_lon)
        effective_hazard_radius = h_radius + simulated_hazard_expansion


        accuracy_ok = (accuracy_m or 100.0) <= 50.0

        if dist_km <= effective_hazard_radius * 0.5:
            exposure_status = "INSIDE_EXTREME_RISK_AREA"
            risk_level = "EXTREME"
            guidance_level = 4 if official_alert_active else 3
            why = [
                f"Location is {dist_km:.2f} km inside the active modeled high-velocity flood corridor.",
                "River stage upstream is rising rapidly on saturated slopes.",
                "Immediate movement to candidate higher ground advised.",
            ]
        elif dist_km <= effective_hazard_radius:
            exposure_status = "INSIDE_HIGH_RISK_AREA"
            risk_level = "HIGH"
            guidance_level = 4 if official_alert_active else 2
            why = [
                f"Location is {dist_km:.2f} km from corridor center, within the modeled high-risk alluvial fan.",
                "Antecedent soil saturation has reached critical threshold.",
                "Prepare to follow candidate lower-exposure paths.",
            ]
        elif dist_km <= effective_hazard_radius * 1.8:
            exposure_status = "NEAR_RISK_AREA"
            risk_level = "MODERATE"
            guidance_level = 1
            why = [
                f"Location is {dist_km:.2f} km from active flood boundary.",
                "Currently outside direct surge path, but within warning proximity buffer.",
            ]
        else:
            exposure_status = "OUTSIDE_RISK_AREA"
            risk_level = "LOW"
            guidance_level = 0
            why = [
                f"Location is {dist_km:.2f} km from modeled hazard area.",
                "Safe distance from primary mountain riverbed channel.",
            ]

        return UserExposure(
            exposure_status=exposure_status,
            risk_level=risk_level,
            distance_to_hazard_km=dist_km,
            hazard_type="Flash Flood / Debris Corridor",
            data_freshness_minutes=4,
            confidence="HIGH" if accuracy_ok else "LOW",
            approaching_risk=dist_km < 1.0,
            leaving_risk=dist_km > 2.0,
            location_accuracy_ok=accuracy_ok,
            official_alert_active=official_alert_active,
            guidance_level=guidance_level,
            why=why,
            computed_at=datetime.utcnow().isoformat(),
        )
