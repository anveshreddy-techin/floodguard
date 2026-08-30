"""
FloodGuard AI — Weather & Community Intelligence Data Models
Full schemas for weather observations, forecasts, alerts, community reports, and provider provenance.
"""
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Optional
from pydantic import BaseModel, Field


class WeatherConditionCode(str, Enum):
    CLEAR_SUNNY = "CLEAR_SUNNY"
    PARTLY_CLOUDY = "PARTLY_CLOUDY"
    CLOUDY = "CLOUDY"
    LIGHT_RAIN = "LIGHT_RAIN"
    MODERATE_RAIN = "MODERATE_RAIN"
    HEAVY_RAIN = "HEAVY_RAIN"
    VERY_HEAVY_RAIN = "VERY_HEAVY_RAIN"
    THUNDERSTORM = "THUNDERSTORM"
    HAZARDOUS_THUNDERSTORM = "HAZARDOUS_THUNDERSTORM"
    SNOW = "SNOW"
    HAZE_FOG = "HAZE_FOG"
    UNKNOWN = "UNKNOWN"


class RainfallIntensityClass(str, Enum):
    NO_RAIN = "NO_RAIN"                     # 0.0 mm/h
    LIGHT_RAIN = "LIGHT_RAIN"               # 0.1 - 2.5 mm/h
    MODERATE_RAIN = "MODERATE_RAIN"         # 2.6 - 7.5 mm/h
    HEAVY_RAIN = "HEAVY_RAIN"               # 7.6 - 15.0 mm/h
    VERY_HEAVY_RAIN = "VERY_HEAVY_RAIN"     # 15.1 - 30.0 mm/h
    EXTREME_RAIN = "EXTREME_RAIN"           # > 30.0 mm/h
    UNKNOWN = "UNKNOWN"


class WeatherDataMode(str, Enum):
    LIVE = "LIVE"
    REAL_PILOT = "REAL_PILOT"
    HISTORICAL = "HISTORICAL"
    UPLOAD = "UPLOAD"
    DEMO = "DEMO"
    SIMULATION = "SIMULATION"
    UNAVAILABLE = "UNAVAILABLE"
    STALE = "STALE"


class WeatherQualityStatus(str, Enum):
    VALID = "VALID"
    ACCEPTED_WITH_WARNING = "ACCEPTED_WITH_WARNING"
    QUARANTINED = "QUARANTINED"
    REJECTED = "REJECTED"
    UNKNOWN = "UNKNOWN"


class OfficialStatus(str, Enum):
    OFFICIAL_IMD_OBSERVATION = "OFFICIAL_IMD_OBSERVATION"
    OFFICIAL_GOVERNMENT_WARNING = "OFFICIAL_GOVERNMENT_WARNING"
    PUBLIC_FORECAST_PROVIDER = "PUBLIC_FORECAST_PROVIDER"
    UNVERIFIED_COMMUNITY_REPORT = "UNVERIFIED_COMMUNITY_REPORT"
    MODEL_ESTIMATED_RECOMMENDATION = "MODEL_ESTIMATED_RECOMMENDATION"
    NOT_AN_OFFICIAL_WARNING = "NOT_AN_OFFICIAL_WARNING"


class WeatherAlertCategory(str, Enum):
    HEAVY_RAINFALL_WATCH = "HEAVY_RAINFALL_WATCH"
    VERY_HEAVY_RAINFALL_WATCH = "VERY_HEAVY_RAINFALL_WATCH"
    EXTREME_RAINFALL_WATCH = "EXTREME_RAINFALL_WATCH"
    THUNDERSTORM_WATCH = "THUNDERSTORM_WATCH"
    INTENSE_RAIN_SATURATED_SOIL = "INTENSE_RAIN_SATURATED_SOIL"
    RAINFALL_RISING_WATER_LEVEL = "RAINFALL_RISING_WATER_LEVEL"
    RAINFALL_LANDSLIDE_SUSCEPTIBILITY = "RAINFALL_LANDSLIDE_SUSCEPTIBILITY"
    RAINFALL_DEBRIS_FLOW_SUSCEPTIBILITY = "RAINFALL_DEBRIS_FLOW_SUSCEPTIBILITY"
    FORECAST_RAIN_DOWNSTREAM_EXPOSURE = "FORECAST_RAIN_DOWNSTREAM_EXPOSURE"


class CommunityReportType(str, Enum):
    HEAVY_RAINFALL = "HEAVY_RAINFALL"
    SUDDEN_FLOOD = "SUDDEN_FLOOD"
    RISING_RIVER = "RISING_RIVER"
    BLOCKED_ROAD = "BLOCKED_ROAD"
    BRIDGE_DAMAGE = "BRIDGE_DAMAGE"
    LANDSLIDE = "LANDSLIDE"
    DEBRIS_FLOW = "DEBRIS_FLOW"
    HAIL = "HAIL"
    THUNDERSTORM = "THUNDERSTORM"
    SNOWFALL = "SNOWFALL"
    WATERLOGGING = "WATERLOGGING"
    POWER_FAILURE = "POWER_FAILURE"
    COMMUNICATION_FAILURE = "COMMUNICATION_FAILURE"
    SHELTER_ISSUE = "SHELTER_ISSUE"
    MISSING_PERSON = "MISSING_PERSON"
    RESCUE_NEED = "RESCUE_NEED"


class VerificationStatus(str, Enum):
    UNVERIFIED = "UNVERIFIED"
    NEEDS_REVIEW = "NEEDS_REVIEW"
    CORROBORATED = "CORROBORATED"
    VERIFIED_BY_AUTHORITY = "VERIFIED_BY_AUTHORITY"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"


# ============================================================================
# Pydantic Request / Response Schemas
# ============================================================================

class WeatherLocation(BaseModel):
    latitude: float
    longitude: float
    state: str = "National"
    district: str = "Unspecified"
    watershed_id: Optional[str] = None
    village_id: Optional[str] = None
    location_name: Optional[str] = None
    elevation_m: Optional[float] = None


class WeatherConditions(BaseModel):
    temperature_c: Optional[float] = None
    humidity_percent: Optional[float] = None
    wind_speed_kmh: Optional[float] = None
    wind_direction_deg: Optional[float] = None
    pressure_hpa: Optional[float] = None
    cloud_cover_percent: Optional[float] = None
    weather_code: Optional[int] = None
    condition_label: WeatherConditionCode = WeatherConditionCode.UNKNOWN
    visibility_km: Optional[float] = None


class WeatherPrecipitation(BaseModel):
    last_hour_mm: Optional[float] = None
    last_3_hours_mm: Optional[float] = None
    last_24_hours_mm: Optional[float] = None
    current_rainfall_intensity: Optional[float] = None
    intensity_class: RainfallIntensityClass = RainfallIntensityClass.UNKNOWN


class WeatherPrecipitationForecast(BaseModel):
    next_hour_rain_mm: Optional[float] = None
    next_3_hours_rain_mm: Optional[float] = None
    next_6_hours_rain_mm: Optional[float] = None
    next_24_hours_rain_mm: Optional[float] = None


class WeatherProvenanceSource(BaseModel):
    provider: str
    source_type: str = "FORECAST_PROVIDER"
    observed_at: Optional[str] = None
    received_at: Optional[str] = None
    forecast_issued_at: Optional[str] = None
    data_mode: WeatherDataMode = WeatherDataMode.UNAVAILABLE
    freshness: str = "UNKNOWN"
    quality_status: WeatherQualityStatus = WeatherQualityStatus.UNKNOWN
    trace_id: str = "trace-default"


class CurrentWeatherResponse(BaseModel):
    location: WeatherLocation
    conditions: WeatherConditions
    precipitation: WeatherPrecipitation
    forecast: WeatherPrecipitationForecast
    source: WeatherProvenanceSource
    official_status: OfficialStatus = OfficialStatus.NOT_AN_OFFICIAL_WARNING
    limitations: list[str] = Field(default_factory=list)


class HourlyForecastItem(BaseModel):
    timestamp: str
    temperature_c: Optional[float] = None
    precipitation_mm: Optional[float] = None
    rain_probability_pct: Optional[float] = None
    condition_code: WeatherConditionCode = WeatherConditionCode.UNKNOWN
    wind_speed_kmh: Optional[float] = None
    humidity_percent: Optional[float] = None
    accumulated_precipitation_mm: Optional[float] = None
    is_alert_threshold: bool = False


class HourlyForecastResponse(BaseModel):
    location: WeatherLocation
    hours: list[HourlyForecastItem]
    source: WeatherProvenanceSource
    official_status: OfficialStatus = OfficialStatus.NOT_AN_OFFICIAL_WARNING
    limitations: list[str] = Field(default_factory=list)


class DailyForecastItem(BaseModel):
    date: str
    temperature_min_c: Optional[float] = None
    temperature_max_c: Optional[float] = None
    total_precipitation_mm: Optional[float] = None
    rain_probability_max_pct: Optional[float] = None
    dominant_condition: WeatherConditionCode = WeatherConditionCode.UNKNOWN
    warning_source: Optional[str] = None
    source_timestamp: Optional[str] = None


class DailyForecastResponse(BaseModel):
    location: WeatherLocation
    days: list[DailyForecastItem]
    source: WeatherProvenanceSource
    official_status: OfficialStatus = OfficialStatus.NOT_AN_OFFICIAL_WARNING
    limitations: list[str] = Field(default_factory=list)


class WeatherAlertRecommendation(BaseModel):
    alert_id: str
    category: WeatherAlertCategory
    severity: str  # ADVISORY, WATCH, WARNING, EMERGENCY
    affected_location: WeatherLocation
    forecast_horizon_hours: int
    triggering_variables: dict[str, Any]
    recommendation_text: str
    model_version: str = "v1.4_weather_fusion"
    threshold_version: str = "imd_cwc_aligned_2026.1"
    operator_review_status: str = "PENDING_REVIEW"
    issued_at: str
    data_mode: WeatherDataMode
    quality_status: WeatherQualityStatus
    uncertainty: str = "MODERATE"
    official_status: OfficialStatus = OfficialStatus.MODEL_ESTIMATED_RECOMMENDATION


class WeatherAlertsResponse(BaseModel):
    alerts: list[WeatherAlertRecommendation]
    total_active: int
    data_mode: WeatherDataMode


class WeatherSourceComparisonItem(BaseModel):
    provider_id: str
    provider_name: str
    status: str  # OPERATIONAL, NOT_CONFIGURED, UNAVAILABLE, SIMULATION_ONLY
    source_type: str  # OFFICIAL_GOVERNMENT, PUBLIC_FORECAST, IOT_SENSOR, FUSION_MODEL
    current_condition: str
    rainfall_observed_or_forecast_mm: Optional[float]
    issued_at: Optional[str]
    expected_latency_ms: float
    freshness: str
    quality: WeatherQualityStatus
    agreement_status: str  # AGREE, DIVERGENT, INSUFFICIENT_DATA
    official_status: OfficialStatus
    notes: str


class WeatherSourcesResponse(BaseModel):
    location: WeatherLocation
    sources: list[WeatherSourceComparisonItem]
    fusion_method: str = "Hierarchical Authoritative Priority with Fallback Fusion"
    evaluated_at: str


class WeatherQualityReport(BaseModel):
    provider_id: str
    completeness_pct: float
    latency_avg_ms: float
    freshness_compliance_pct: float
    spike_anomaly_count: int
    total_records_processed: int
    quality_grade: str  # GRADE_A, GRADE_B, GRADE_C, DEGRADED
    last_audited_at: str


class WeatherQualityResponse(BaseModel):
    reports: list[WeatherQualityReport]
    overall_system_quality: str


# ============================================================================
# Community Intelligence Schemas
# ============================================================================

class CommunityReportSubmission(BaseModel):
    location: WeatherLocation
    report_type: CommunityReportType
    description: str
    severity: str = "MEDIUM"  # LOW, MEDIUM, HIGH, CRITICAL
    observed_at: Optional[str] = None
    language: str = "en"
    has_photo: bool = False
    has_video: bool = False
    is_anonymous: bool = True
    reporter_contact_masked: Optional[str] = None


class CommunityReport(BaseModel):
    report_id: str
    location: WeatherLocation
    report_type: CommunityReportType
    description: str
    severity: str
    observed_at: str
    received_at: str
    language: str
    has_photo: bool
    has_video: bool
    is_anonymous: bool
    reporter_contact_masked: Optional[str]
    verification_status: VerificationStatus
    corroborating_sensor_id: Optional[str] = None
    corroborating_weather_signal: Optional[str] = None
    operator_notes: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[str] = None
    data_mode: WeatherDataMode
    provenance_hash: str


class CommunityReportVerificationRequest(BaseModel):
    status: VerificationStatus
    operator_notes: str
    operator_id: str


# ============================================================================
# Subscription Schemas
# ============================================================================

class WeatherSubscription(BaseModel):
    subscription_id: str
    user_role: str
    location: WeatherLocation
    alert_categories: list[WeatherAlertCategory]
    channel: str = "IN_APP"  # IN_APP, WEBHOOK, EMAIL_SIMULATED
    created_at: str
    active: bool = True
