"""
FloodGuard AI — Upstream-to-Downstream Multi-Hazard Cascade Engine
Traces environmental anomalies from mountain ridges to valley floodplains.
Calculates propagation stages, hazard transitions, and exposure risks.
"""
from datetime import datetime, timezone
from typing import Any


class CascadeEngine:
    @staticmethod
    def evaluate_cascade(
        rainfall_mm: float = 48.0,
        soil_saturation: float = 0.82,
        river_rate_of_rise: float = 0.40,
        has_upstream_blockage: bool = False,
    ) -> dict[str, Any]:
        """
        Evaluate multi-stage cascade progression:
        Stage 1: Ridge Precipitation
        Stage 2: Slope Soil Saturation & Runoff Generation
        Stage 3: Headwater Debris / Debris Flow Potential
        Stage 4: River Channel Inundation Surge
        Stage 5: Downstream Village Exposure & Infrastructure Bottlenecks
        """
        now = datetime.now(timezone.utc).isoformat()

        # Stage 1: Ridge Trigger
        stage1_status = "CRITICAL" if rainfall_mm >= 40 else "ELEVATED" if rainfall_mm >= 20 else "NORMAL"
        
        # Stage 2: Slope Saturation
        stage2_status = "CRITICAL" if soil_saturation >= 0.80 else "ELEVATED" if soil_saturation >= 0.60 else "NORMAL"
        
        # Stage 3: Debris Flow / Landslide Potential
        slope_risk = "HIGH" if (rainfall_mm >= 30 and soil_saturation >= 0.75) else "MODERATE"

        # Stage 4: Channel Surge
        stage4_status = "SURGING" if river_rate_of_rise >= 0.3 else "RISING" if river_rate_of_rise > 0.1 else "STABLE"

        # Stage 5: Downstream Exposure
        exposure_level = "EXTREME" if (stage1_status == "CRITICAL" and stage2_status == "CRITICAL") else "HIGH"

        nodes = [
            {
                "id": "node-1-ridge",
                "stage": 1,
                "name": "Upper Ridge Catchment (Rainfall Trigger)",
                "location": "Ridge Altitude 2200m",
                "status": stage1_status,
                "evidence": f"Precipitation: {rainfall_mm}mm in 3h",
                "confidence": "HIGH",
                "data_mode": "DEMO",
                "timestamp": now,
            },
            {
                "id": "node-2-slope",
                "stage": 2,
                "name": "Mid-Slope Hillslope (Saturation & Runoff)",
                "location": "Slope Angle 28°",
                "status": stage2_status,
                "evidence": f"Soil Saturation Index: {int(soil_saturation * 100)}%",
                "confidence": "MEDIUM",
                "data_mode": "DEMO",
                "timestamp": now,
            },
            {
                "id": "node-3-gorge",
                "stage": 3,
                "name": "Narrow Gorge (Debris & Flow Concentration)",
                "location": "Strahler Order 3 Channel",
                "status": slope_risk,
                "evidence": "High stream power; debris remobilization risk on steep banks",
                "confidence": "MEDIUM",
                "data_mode": "DEMO",
                "timestamp": now,
            },
            {
                "id": "node-4-channel",
                "stage": 4,
                "name": "Main River Channel (Surge Wave)",
                "location": "Gauge Station 001",
                "status": stage4_status,
                "evidence": f"Rate of rise: +{river_rate_of_rise:.2f} m/h",
                "confidence": "HIGH",
                "data_mode": "DEMO",
                "timestamp": now,
            },
            {
                "id": "node-5-valley",
                "stage": 5,
                "name": "Downstream Floodplain (Village Exposure)",
                "location": "Sunderbans Nagar (Alluvial Cone)",
                "status": exposure_level,
                "evidence": "3,400 residents; 1 bridge bottleneck; low elevation relative to active riverbed",
                "confidence": "MEDIUM",
                "data_mode": "DEMO",
                "timestamp": now,
            },
        ]

        edges = [
            {"from": "node-1-ridge", "to": "node-2-slope", "relationship": "INFILTRATION_AND_SATURATION", "lag_time_est": "15-30 min"},
            {"from": "node-2-slope", "to": "node-3-gorge", "relationship": "OVERLAND_FLOW_CONVERGENCE", "lag_time_est": "20-45 min"},
            {"from": "node-3-gorge", "to": "node-4-channel", "relationship": "HYDROGRAPH_PEAK_PROPAGATION", "lag_time_est": "30-60 min"},
            {"from": "node-4-channel", "to": "node-5-valley", "relationship": "INUNDATION_AND_BACKWATER", "lag_time_est": "15-40 min"},
        ]

        return {
            "cascade_status": "ACTIVE_ESCALATION" if exposure_level in ("HIGH", "EXTREME") else "MONITORING",
            "overall_exposure": exposure_level,
            "estimated_lead_time_min": 45,
            "nodes": nodes,
            "edges": edges,
            "disclaimer": "Lag times are empirical heuristic estimates for decision support. Hydrodynamic 2D calibration required for exact wave travel timings.",
        }


cascade_engine = CascadeEngine()
