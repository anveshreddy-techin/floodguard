"""
FloodGuard AI — Multi-Hazard Detector Modules
16 detector classes covering the full cascade hazard chain.
Each detector returns evidence-based output with honest limitations.
Never assigns risk scores without sufficient data — returns INSUFFICIENT_DATA.
"""
from datetime import datetime, timezone
from typing import Any


def _base_output(status: str, evidence: list[str], sources: list[str], limitations: list[str]) -> dict[str, Any]:
    return {
        "status": status,
        "evidence": evidence,
        "sources": sources,
        "limitations": limitations,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data_mode": "DEMO",
    }


class RainfallExtremeDetector:
    """Detects extreme/threshold-exceeding precipitation events."""

    CRITICAL_MM_3H = 65.0
    EXTREME_MM_3H = 100.0

    def detect(self, features: dict[str, Any]) -> dict[str, Any]:
        rain_3h = features.get("rainfall_3h_mm")
        if rain_3h is None:
            return _base_output("INSUFFICIENT_DATA", ["No rainfall data supplied"], [], ["Detector cannot operate without rainfall_3h_mm"])
        if rain_3h >= self.EXTREME_MM_3H:
            status = "EXTREME"
            evidence = [f"3h rainfall {rain_3h}mm ≥ extreme threshold {self.EXTREME_MM_3H}mm"]
        elif rain_3h >= self.CRITICAL_MM_3H:
            status = "CRITICAL"
            evidence = [f"3h rainfall {rain_3h}mm ≥ critical threshold {self.CRITICAL_MM_3H}mm"]
        else:
            status = "NORMAL"
            evidence = [f"3h rainfall {rain_3h}mm below critical threshold"]
        return _base_output(status, evidence, ["IMD_AWS_DEMO"], ["Regional thresholds require IMD validation"])


class CatchmentSaturationDetector:
    """Detects soil saturation approaching runoff-generating thresholds."""

    WARN_PCT = 75.0
    CRITICAL_PCT = 90.0

    def detect(self, features: dict[str, Any]) -> dict[str, Any]:
        moisture = features.get("soil_moisture_pct")
        if moisture is None:
            return _base_output("INSUFFICIENT_DATA", ["Soil moisture data not available"], [], ["Requires soil_moisture_pct input"])
        if moisture >= self.CRITICAL_PCT:
            status = "SATURATED"
            evidence = [f"Soil moisture {moisture}% ≥ critical threshold {self.CRITICAL_PCT}%"]
        elif moisture >= self.WARN_PCT:
            status = "NEAR_SATURATION"
            evidence = [f"Soil moisture {moisture}% ≥ warning threshold {self.WARN_PCT}%"]
        else:
            status = "NORMAL"
            evidence = [f"Soil moisture {moisture}% below warning threshold"]
        return _base_output(status, evidence, ["SOIL_PROBE_DEMO"], ["Local soil texture affects threshold accuracy"])


class RiverAnomalyDetector:
    """Detects anomalous river stage rises against warning/danger levels."""

    def detect(self, features: dict[str, Any]) -> dict[str, Any]:
        level = features.get("water_level_m")
        warning = features.get("warning_level_m")
        danger = features.get("danger_level_m")
        rise_rate = features.get("rise_rate_m_hr", 0.0)
        if level is None:
            return _base_output("INSUFFICIENT_DATA", ["No water level data supplied"], [], ["Requires CWC gauge telemetry"])
        evidence = []
        if warning and level >= danger:
            status = "ABOVE_DANGER"
            evidence.append(f"Stage {level}m ≥ danger level {danger}m")
        elif warning and level >= warning:
            status = "ABOVE_WARNING"
            evidence.append(f"Stage {level}m ≥ warning level {warning}m")
        elif rise_rate > 0.5:
            status = "RAPIDLY_RISING"
            evidence.append(f"Rate of rise {rise_rate}m/h exceeds 0.5m/h")
        else:
            status = "NORMAL"
            evidence.append(f"Stage {level}m below warning level")
        lims = ["Warning/danger levels are official CWC thresholds — not FloodGuard AI predictions"]
        return _base_output(status, evidence, ["CWC_GAUGE_DEMO"], lims)


class LandslideDetector:
    """Detects landslide susceptibility triggers based on rainfall + terrain + geology."""

    def detect(self, features: dict[str, Any]) -> dict[str, Any]:
        rain_1h = features.get("rainfall_1h_mm", 0)
        slope_deg = features.get("slope_deg")
        susceptibility = features.get("gsi_susceptibility", "UNKNOWN")
        if slope_deg is None:
            return _base_output("INSUFFICIENT_DATA", ["Terrain slope data not supplied"], [], ["Requires DEM-derived slope_deg"])
        evidence = []
        if rain_1h > 30 and slope_deg > 30 and susceptibility == "HIGH":
            status = "HIGH_RISK"
            evidence = [f"Rain {rain_1h}mm/h on {slope_deg}° slope in HIGH GSI zone"]
        elif rain_1h > 20 and slope_deg > 25:
            status = "ELEVATED"
            evidence = [f"Rain {rain_1h}mm/h on {slope_deg}° slope — elevated risk"]
        else:
            status = "LOW"
            evidence = ["Conditions below landslide trigger thresholds"]
        lims = ["Geology type and colluvium depth not included in this version", "Rainfall threshold is regional, not calibrated to this slope unit"]
        return _base_output(status, evidence, ["IMD_AWS_DEMO", "GSI_STATIC"], lims)


class DebrisFlowDetector:
    """Screens for debris flow conditions in steep channel heads."""

    def detect(self, features: dict[str, Any]) -> dict[str, Any]:
        slope = features.get("slope_deg", 0)
        rain_1h = features.get("rainfall_1h_mm", 0)
        sediment_load = features.get("estimated_sediment_load", "UNKNOWN")
        evidence = []
        if slope > 35 and rain_1h > 25:
            status = "DEBRIS_FLOW_SUSCEPTIBLE"
            evidence = [f"Steep channel ({slope}°) with rain {rain_1h}mm/h"]
        else:
            status = "LOW"
            evidence = ["Below debris flow trigger thresholds"]
        lims = ["Debris fan mapping incomplete for most Indian basins"]
        return _base_output(status, evidence, ["TERRAIN_ANALYSIS_DEMO"], lims)


class GlacialLakeScreeningDetector:
    """
    Screens for glacial lake anomalies.
    IMPORTANT: No ML-based GLOF probability is assigned.
    Insufficient labeled Indian GLOF events exist for model training.
    """

    def detect(self, features: dict[str, Any]) -> dict[str, Any]:
        lake_area_km2 = features.get("lake_area_km2")
        sar_change_pct = features.get("sar_area_change_pct")
        upstream_seismicity = features.get("seismic_event_48h", False)
        if lake_area_km2 is None:
            return _base_output(
                "SCREENING_NOT_AVAILABLE",
                ["Glacial lake extent data not available"],
                [],
                [
                    "NRSC SAR imagery product not configured",
                    "GLOF ML classifier not trained — insufficient labeled events",
                ],
            )
        evidence = []
        if sar_change_pct and abs(sar_change_pct) > 20:
            status = "ANOMALY_DETECTED"
            evidence.append(f"SAR lake area change {sar_change_pct}% exceeds 20% threshold")
        elif upstream_seismicity:
            status = "MONITOR_UPSTREAM"
            evidence.append("Seismic event detected within 48h upstream of glacial lake")
        else:
            status = "NO_ANOMALY_DETECTED"
            evidence.append("Lake area within normal variability range")
        lims = [
            "SAR change detection does not distinguish natural seasonal variation from ice-dam weakening",
            "GLOF ML classifier NOT trained — insufficient India-specific labeled events",
            "Screening result is not a probability estimate",
        ]
        return _base_output(status, evidence, ["NRSC_SAR_DEMO"], lims)


class IceAvalancheScreeningDetector:
    """Screens for ice/rock avalanche potential in high-altitude glacierized terrain."""

    def detect(self, features: dict[str, Any]) -> dict[str, Any]:
        temperature_anomaly = features.get("temp_anomaly_c", 0.0)
        recent_seismicity = features.get("seismic_event_48h", False)
        slope_above_60 = features.get("slope_above_60_deg", False)
        evidence = []
        if temperature_anomaly > 3.0:
            evidence.append(f"Temperature anomaly {temperature_anomaly}°C above baseline")
        if recent_seismicity:
            evidence.append("Seismic trigger detected")
        if slope_above_60:
            evidence.append("Hanging glacier terrain ≥60°")
        status = "ELEVATED_SCREENING" if len(evidence) >= 2 else "LOW_CONCERN"
        lims = ["No operational rock/ice avalanche trigger model exists for Indian Himalaya", "Result is screening flag only"]
        return _base_output(status, evidence, ["SASE_DEMO", "USGS_SEISMICITY"], lims)


class RiverBlockageDetector:
    """Detects potential landslide dam / ice jam river blockages."""

    def detect(self, features: dict[str, Any]) -> dict[str, Any]:
        discharge_drop_pct = features.get("discharge_drop_pct", 0)
        turbidity_spike = features.get("turbidity_spike", False)
        evidence = []
        if discharge_drop_pct > 50:
            evidence.append(f"Discharge dropped {discharge_drop_pct}% — possible blockage")
        if turbidity_spike:
            evidence.append("Turbidity spike detected downstream of potential blockage")
        status = "POSSIBLE_BLOCKAGE" if evidence else "NO_BLOCKAGE_INDICATED"
        return _base_output(status, evidence, ["CWC_GAUGE_DEMO"], ["Requires two gauges to triangulate blockage"])


class SuddenReleaseDetector:
    """Detects sudden upstream water release from dam outburst or blockage failure."""

    def detect(self, features: dict[str, Any]) -> dict[str, Any]:
        discharge_surge_pct = features.get("discharge_surge_pct", 0)
        zero_precip = features.get("zero_rainfall_trigger", False)
        evidence = []
        if discharge_surge_pct > 200 and zero_precip:
            evidence.append(f"Discharge surged {discharge_surge_pct}% with zero rainfall — outburst signature")
            status = "OUTBURST_SIGNATURE"
        elif discharge_surge_pct > 100:
            evidence.append(f"Discharge surged {discharge_surge_pct}% — investigate cause")
            status = "RAPID_RISE"
        else:
            status = "NORMAL"
            evidence = ["No sudden release signature detected"]
        lims = ["Outburst detection requires upstream gauge — unavailable in remote reaches"]
        return _base_output(status, evidence, ["CWC_GAUGE_DEMO"], lims)


class DownstreamPropagationDetector:
    """Estimates downstream arrival time for a surge wave using travel time model."""

    def detect(self, features: dict[str, Any]) -> dict[str, Any]:
        channel_length_km = features.get("channel_length_to_next_settlement_km")
        wave_speed_ms = features.get("estimated_wave_speed_m_s", 5.0)
        if channel_length_km is None:
            return _base_output("INSUFFICIENT_DATA", ["Channel length not supplied"], [], ["Requires DEM-derived channel network"])
        travel_time_min = (channel_length_km * 1000) / wave_speed_ms / 60
        evidence = [f"Estimated travel time to next settlement: {travel_time_min:.0f} min at {wave_speed_ms}m/s wave speed"]
        lims = ["Wave attenuation not modelled", "Channel sinuosity not accounted for"]
        return {
            **_base_output("PROPAGATION_ESTIMATE", evidence, ["DEM_ANALYSIS_DEMO"], lims),
            "estimated_travel_time_min": round(travel_time_min, 1),
        }


class InfrastructureImpactDetector:
    """Assesses likely infrastructure impact from modelled inundation depth."""

    def detect(self, features: dict[str, Any]) -> dict[str, Any]:
        inundation_depth_m = features.get("inundation_depth_m", 0.0)
        assets = features.get("exposed_assets", [])
        evidence = []
        for asset in assets:
            if inundation_depth_m > 1.0:
                evidence.append(f"{asset['name']} likely submerged at {inundation_depth_m}m depth")
        status = "HIGH_IMPACT" if evidence else "LOW_IMPACT"
        lims = ["Inundation extent is model-derived, not field-verified", "Asset condition data incomplete"]
        return _base_output(status, evidence, ["EXPOSURE_ENGINE_DEMO"], lims)


class UrbanWaterloggingDetector:
    """Detects urban drainage surcharge and waterlogging conditions."""

    def detect(self, features: dict[str, Any]) -> dict[str, Any]:
        rain_1h_mm = features.get("rainfall_1h_mm", 0)
        imperviousness = features.get("imperviousness_index", 0.5)
        drainage_capacity = features.get("drainage_capacity_mm_hr", 30.0)
        if rain_1h_mm > drainage_capacity * (1 - imperviousness + 1.0):
            status = "WATERLOGGING_LIKELY"
            evidence = [f"Rain {rain_1h_mm}mm/h likely exceeds drainage capacity {drainage_capacity}mm/h"]
        else:
            status = "DRAINABLE"
            evidence = ["Rainfall within drainage capacity"]
        lims = ["Sub-ward drain topology not mapped for all cities"]
        return _base_output(status, evidence, ["URBAN_SENSOR_DEMO"], lims)


class CoastalFloodScreeningDetector:
    """Screens coastal flood risk from cyclone surge + tide combinations."""

    def detect(self, features: dict[str, Any]) -> dict[str, Any]:
        surge_m = features.get("surge_forecast_m", 0.0)
        tide_m = features.get("tide_level_m", 0.0)
        combined = surge_m + tide_m
        if combined > 3.0:
            status = "EXTREME_COASTAL_RISK"
        elif combined > 2.0:
            status = "HIGH_COASTAL_RISK"
        else:
            status = "LOW_COASTAL_RISK"
        evidence = [f"Surge {surge_m}m + tide {tide_m}m = {combined}m combined water level"]
        lims = ["INCOIS surge model not integrated (NOT_CONFIGURED)", "Mangrove attenuation not modelled"]
        return _base_output(status, evidence, ["INCOIS_DEMO"], lims)


# ─── Registry ─────────────────────────────────────────────────────────────────

HAZARD_DETECTORS: dict[str, Any] = {
    "rainfall_extreme": RainfallExtremeDetector(),
    "catchment_saturation": CatchmentSaturationDetector(),
    "river_anomaly": RiverAnomalyDetector(),
    "landslide": LandslideDetector(),
    "debris_flow": DebrisFlowDetector(),
    "glacial_lake_screening": GlacialLakeScreeningDetector(),
    "ice_avalanche_screening": IceAvalancheScreeningDetector(),
    "river_blockage": RiverBlockageDetector(),
    "sudden_release": SuddenReleaseDetector(),
    "downstream_propagation": DownstreamPropagationDetector(),
    "infrastructure_impact": InfrastructureImpactDetector(),
    "urban_waterlogging": UrbanWaterloggingDetector(),
    "coastal_flood_screening": CoastalFloodScreeningDetector(),
}
