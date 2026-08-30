"""
FloodGuard AI — Regional Configuration
Defines India's 8 national hazard regions with model families, features, and thresholds.
Used for regional model routing: coordinates → state/district → hazard region → model.
"""
from enum import Enum
from typing import Any


class HazardRegion(str, Enum):
    HIMALAYAN_NORTH = "HIMALAYAN_NORTH"
    NORTHEAST_HILLS = "NORTHEAST_HILLS"
    WESTERN_GHATS = "WESTERN_GHATS"
    INDO_GANGETIC_PLAINS = "INDO_GANGETIC_PLAINS"
    CENTRAL_RIVERS = "CENTRAL_RIVERS"
    COASTAL_CYCLONE = "COASTAL_CYCLONE"
    URBAN_FLOOD = "URBAN_FLOOD"
    SEMI_ARID = "SEMI_ARID"


REGION_CONFIGS: dict[HazardRegion, dict[str, Any]] = {
    HazardRegion.HIMALAYAN_NORTH: {
        "display_name": "Northern Himalayan Zone",
        "states": ["UK", "HP", "JK", "LA"],
        "hazard_types": ["flash_flood", "glof", "landslide", "debris_flow", "avalanche", "cloudbursts"],
        "model_family": "baseline_himalayan_v1",
        "feature_groups": ["rainfall_intensity", "soil_moisture", "terrain_slope", "glacier_proximity", "geology", "snow_pack"],
        "thresholds": {
            "rainfall_critical_mm_3h": 65.0,
            "soil_saturation_warn_pct": 75.0,
            "river_rise_rate_warn_m_hr": 0.5,
        },
        "expected_data_sources": ["IMD_AWS", "CWC_GAUGE", "NRSC_GLACIER", "GSI_LANDSLIDE"],
        "known_limitations": [
            "Dense cloud cover limits SAR optical fusion during monsoon peaks",
            "Remote terrain limits IoT sensor density",
            "GLOF classification not trained due to insufficient labeled events",
        ],
    },
    HazardRegion.NORTHEAST_HILLS: {
        "display_name": "North-East Hills & Brahmaputra Zone",
        "states": ["AS", "SK", "AR", "MN", "ML", "MZ", "NL", "TR"],
        "hazard_types": ["flash_flood", "riverine_flood", "landslide", "debris_flow", "glof"],
        "model_family": "baseline_northeast_v1",
        "feature_groups": ["rainfall_duration", "soil_moisture", "terrain_slope", "antecedent_wetness"],
        "thresholds": {
            "rainfall_critical_mm_3h": 80.0,
            "soil_saturation_warn_pct": 80.0,
            "river_rise_rate_warn_m_hr": 0.8,
        },
        "expected_data_sources": ["IMD_AWS", "CWC_GAUGE", "STATE_HYDROLOGY"],
        "known_limitations": [
            "Very high annual rainfall creates persistent saturation; thresholds require local calibration",
            "Cross-border upstream data (Bhutan, China, Myanmar) not integrated",
        ],
    },
    HazardRegion.WESTERN_GHATS: {
        "display_name": "Western Ghats & Konkan Zone",
        "states": ["KL", "KA", "MH", "GJ"],
        "hazard_types": ["flash_flood", "landslide", "coastal_flood", "riverine_flood"],
        "model_family": "baseline_western_ghats_v1",
        "feature_groups": ["rainfall_intensity", "terrain_slope", "laterite_saturation", "catchment_area"],
        "thresholds": {
            "rainfall_critical_mm_3h": 70.0,
            "soil_saturation_warn_pct": 85.0,
            "river_rise_rate_warn_m_hr": 0.6,
        },
        "expected_data_sources": ["IMD_AWS", "CWC_GAUGE", "KSDMA_SENSORS"],
        "known_limitations": [
            "Dense orographic rainfall variability at 1km scale",
            "Lateritic soil saturation curve poorly characterized below 500m elevation",
        ],
    },
    HazardRegion.INDO_GANGETIC_PLAINS: {
        "display_name": "Indo-Gangetic & Terai Plains",
        "states": ["UP", "BR", "HR", "PB", "RJ"],
        "hazard_types": ["riverine_flood", "waterlogging", "erosion", "embankment_breach"],
        "model_family": "baseline_igp_v1",
        "feature_groups": ["river_stage", "discharge", "embankment_condition", "antecedent_wetness"],
        "thresholds": {
            "rainfall_critical_mm_3h": 50.0,
            "soil_saturation_warn_pct": 70.0,
            "river_rise_rate_warn_m_hr": 0.3,
        },
        "expected_data_sources": ["CWC_GAUGE", "IMD_AWS", "STATE_HYDROLOGY"],
        "known_limitations": [
            "Upstream Nepal catchment data dependent on DHM Nepal API (NOT_CONFIGURED)",
            "Embankment condition survey data not digitised",
        ],
    },
    HazardRegion.CENTRAL_RIVERS: {
        "display_name": "Central & Peninsular Rivers",
        "states": ["MP", "CG", "OR", "JH", "WB", "TS"],
        "hazard_types": ["riverine_flood", "flash_flood", "dam_induced_flood"],
        "model_family": "baseline_central_v1",
        "feature_groups": ["river_stage", "discharge", "reservoir_storage", "catchment_rainfall"],
        "thresholds": {
            "rainfall_critical_mm_3h": 55.0,
            "soil_saturation_warn_pct": 72.0,
            "river_rise_rate_warn_m_hr": 0.4,
        },
        "expected_data_sources": ["CWC_GAUGE", "IMD_AWS", "RESERVOIR_MONITORING"],
        "known_limitations": [
            "Mahanadi and Godavari basin inter-state data sharing inconsistent",
        ],
    },
    HazardRegion.COASTAL_CYCLONE: {
        "display_name": "Bay of Bengal & Arabian Sea Coastal",
        "states": ["OR", "WB", "AP", "TN", "PY", "KL", "MH", "GJ"],
        "hazard_types": ["coastal_flood", "cyclone_surge", "estuarine_flood"],
        "model_family": "baseline_coastal_v1",
        "feature_groups": ["surge_forecast", "tide_level", "wind_speed", "track_landfall_distance"],
        "thresholds": {
            "surge_critical_m": 2.5,
            "wind_speed_cyclonic_kmh": 90.0,
        },
        "expected_data_sources": ["IMD_CYCLONE_TRACK", "INCOIS_TIDE", "CWC_ESTUARINE"],
        "known_limitations": [
            "Surge model requires INCOIS API (NOT_CONFIGURED)",
            "Mangrove attenuation not modelled at fine resolution",
        ],
    },
    HazardRegion.URBAN_FLOOD: {
        "display_name": "Urban Metropolitan Flood Zones",
        "states": ["MH", "KA", "TN", "TS", "DL", "WB"],
        "hazard_types": ["urban_waterlogging", "drainage_surcharge", "flash_flood"],
        "model_family": "baseline_urban_v1",
        "feature_groups": ["rainfall_intensity", "imperviousness_index", "drainage_capacity", "antecedent_waterlogging"],
        "thresholds": {
            "rainfall_critical_mm_1h": 40.0,
            "drainage_saturation_pct": 90.0,
        },
        "expected_data_sources": ["IMD_AWS", "URBAN_SENSOR_NETWORK", "STATE_HYDROLOGY"],
        "known_limitations": [
            "Sub-ward drainage network topology not available for all metro cities",
            "Storm drain capacity database incomplete",
        ],
    },
    HazardRegion.SEMI_ARID: {
        "display_name": "Semi-Arid & Deccan Flash Flood Zones",
        "states": ["RJ", "GJ", "MH", "AP"],
        "hazard_types": ["flash_flood", "ephemeral_river_flood"],
        "model_family": "baseline_semi_arid_v1",
        "feature_groups": ["soil_moisture", "rainfall_intensity", "dry_soil_runoff_coefficient"],
        "thresholds": {
            "rainfall_critical_mm_3h": 45.0,
            "soil_saturation_warn_pct": 55.0,
        },
        "expected_data_sources": ["IMD_AWS", "STATE_HYDROLOGY"],
        "known_limitations": [
            "Ephemeral channel network poorly mapped at 1:50000 scale",
        ],
    },
}


# Simple coordinate-to-region lookup (based on bounding boxes)
def get_region_for_coordinates(lat: float, lon: float) -> HazardRegion:
    if lat > 26 and lon < 80:
        return HazardRegion.HIMALAYAN_NORTH
    if lat > 22 and lon > 89:
        return HazardRegion.NORTHEAST_HILLS
    if lat < 20 and lon < 78:
        return HazardRegion.WESTERN_GHATS
    if 24 < lat < 32 and 74 < lon < 88:
        return HazardRegion.INDO_GANGETIC_PLAINS
    if 17 < lat < 25 and 76 < lon < 88:
        return HazardRegion.CENTRAL_RIVERS
    if lat < 17 and lon > 78:
        return HazardRegion.COASTAL_CYCLONE
    if lat < 24 and lon < 74:
        return HazardRegion.SEMI_ARID
    return HazardRegion.URBAN_FLOOD


def get_model_config_for_region(region: HazardRegion) -> dict:
    return REGION_CONFIGS.get(region, REGION_CONFIGS[HazardRegion.INDO_GANGETIC_PLAINS])
