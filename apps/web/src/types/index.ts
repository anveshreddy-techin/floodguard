/**
 * FloodGuard AI V9 — Extended TypeScript Types
 * Covers: Prediction Memory, Historical Events, User Safety, Flight Recorder
 */

export type DataMode = 'LIVE' | 'HISTORICAL' | 'UPLOAD' | 'DEMO' | 'SIMULATION' | 'REPLAY' | 'HINDCAST';

export type EvidenceState = 'OBSERVED' | 'REPORTED' | 'MODEL_INFERRED' | 'SIMULATED' | 'UNAVAILABLE' | 'UNKNOWN';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME' | 'UNKNOWN';

export type UncertaintyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'INSUFFICIENT_DATA';

export type AlertSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';

export type AlertStatus = 'DRAFT' | 'ACTIVE' | 'ACKNOWLEDGED' | 'ESCALATED' | 'RESOLVED' | 'ARCHIVED';

export type VerificationStatus = 'PRELIMINARY' | 'REPORTED' | 'CORROBORATED' | 'VERIFIED' | 'DISPUTED' | 'SUPERSEDED';

export type HindcastMode = 'STRICT_REPLAY' | 'RECONSTRUCTION' | 'SIMULATION';

export type EventStatus = 'ACTIVE' | 'MONITORING' | 'RECOVERY' | 'HISTORICAL';

export type GuidanceLevel = 0 | 1 | 2 | 3 | 4;

export type LocationMode = 'LIVE_DEVICE_LOCATION' | 'APPROXIMATE' | 'MANUAL' | 'SAVED' | 'UNAVAILABLE' | 'DEMO';

export type RouteConfidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'NOT_VERIFIED';

export type ExposureStatus =
  | 'OUTSIDE_RISK_AREA'
  | 'NEAR_RISK_AREA'
  | 'INSIDE_RISK_AREA'
  | 'INSIDE_HIGH_RISK_AREA'
  | 'INSIDE_EXTREME_RISK_AREA'
  | 'UNKNOWN';

export type FlightEventType =
  | 'DATA_ARRIVED'
  | 'MODEL_RAN'
  | 'RISK_CHANGED'
  | 'ALERT_FIRED'
  | 'OPERATOR_ACTED'
  | 'EVENT_EVOLVED'
  | 'GUIDANCE_ISSUED'
  | 'SENSOR_FAILED'
  | 'DATA_STALE';

// ─── Core Risk Types (V8 compat) ───────────────────────────────────────────

export interface RiskContributor {
  name: string;
  score: number;
  weight: number;
  weighted_contribution: number;
  evidence: string[];
  data_mode: DataMode;
  staleness_hours?: number;
}

export interface RiskAssessmentData {
  id: string;
  location_id?: string;
  assessed_at: string;
  risk_score: number;
  risk_level: RiskLevel;
  confidence: UncertaintyLevel;
  uncertainty: UncertaintyLevel;
  data_mode: DataMode;
  components?: {
    rainfall_risk?: number;
    soil_risk?: number;
    terrain_risk?: number;
    river_risk?: number;
    historical_risk?: number;
  };
  contributors?: RiskContributor[];
  evidence?: Array<{ type: string; observation: string; data_mode?: string }>;
  explanation?: {
    summary?: string;
    primary_driver?: string;
    model_note?: string;
  };
  data_gaps?: string[];
  limitations?: string[];
  model_version?: string;
  data_sources_used?: string[];
  data_freshness?: string;
}

export interface AlertData {
  id: string;
  alert_type: string;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description?: string;
  data_mode: DataMode;
  triggered_at?: string;
  created_at?: string;
  acknowledged_at?: string;
  source?: string;
  confidence?: UncertaintyLevel;
  uncertainty?: UncertaintyLevel;
  location_id?: string;
  evidence?: string[];
}

// ─── V9: Prediction Memory ──────────────────────────────────────────────────

export interface PredictionRecord {
  prediction_id: string;
  location_id: string;
  geography_level: string;
  prediction_time: string;
  forecast_horizon_minutes: number;
  risk_score: number;
  risk_level: RiskLevel;
  confidence: UncertaintyLevel;
  uncertainty: UncertaintyLevel;
  model_version: string;
  feature_version: string;
  threshold_version: string;
  data_snapshot_id: string;
  data_mode: DataMode;
  created_at: string;
  explanation_summary?: string;
  alert_id?: string;
  event_id?: string;
}

export interface PredictionTimelineStep {
  timestamp: string;
  risk_score: number;
  risk_level: RiskLevel;
  uncertainty: UncertaintyLevel;
  previous_risk_level?: RiskLevel;
  reason?: string;
  data_change?: string;
  model_version: string;
}

export interface KnowledgeSnapshot {
  snapshot_id: string;
  prediction_id: string;
  snapshot_time: string;
  available_observations: Array<{ type: string; value: string; source: string; available_at: string }>;
  available_sources: string[];
  available_forecasts: string[];
  terrain_data_version: string;
  sensor_data: Array<{ sensor_id: string; last_reading: string; status: string }>;
  data_gaps: string[];
  model_state: string;
}

export interface PredictionLedgerEntry {
  prediction_id: string;
  when: string;
  where: string;
  location_id: string;
  risk_level: RiskLevel;
  risk_score: number;
  uncertainty: UncertaintyLevel;
  model_version: string;
  data_mode: DataMode;
  what_happened_later?: string;
  outcome_verified: boolean;
  evidence_count: number;
}

// ─── V9: Event Memory ───────────────────────────────────────────────────────

export interface EventEvidenceClaim {
  claim_id: string;
  event_id: string;
  source: string;
  publication_time: string;
  retrieval_time: string;
  claim: string;
  claim_type: 'CASUALTY' | 'DAMAGE' | 'CAUSE' | 'LOCATION' | 'TIMING' | 'IMPACT';
  confidence: UncertaintyLevel;
  verification_status: VerificationStatus;
}

export interface EventMemory {
  event_id: string;
  event_name: string;
  event_type: 'FLASH_FLOOD' | 'GLOF' | 'DEBRIS_FLOOD' | 'RIVER_FLOOD' | 'LANDSLIDE_TRIGGERED';
  status: EventStatus;
  start_time: string;
  end_time?: string;
  country: string;
  region: string;
  lat: number;
  lon: number;
  watershed?: string;
  river?: string;
  hazard_chain: string[];
  cause_primary: string;
  cause_contributing: string[];
  cause_confidence: UncertaintyLevel;
  data_availability_before_event: string;
  key_facts: Array<{ fact: string; source: string; verification_status: VerificationStatus }>;
  evidence_claims: EventEvidenceClaim[];
  predictions?: PredictionRecord[];
  lessons?: string[];
  source_version: string;
  review_status: VerificationStatus;
  model_teachable: boolean;
}

// ─── V9: Historical Hindcast ────────────────────────────────────────────────

export interface HindcastReplayStep {
  step_index: number;
  replay_time: string;
  available_at: string;
  data_available: Array<{ type: string; value: string; source: string }>;
  data_locked_out: Array<{ type: string; reason: string }>;
  prediction: {
    risk_score: number;
    risk_level: RiskLevel;
    uncertainty: UncertaintyLevel;
    confidence: UncertaintyLevel;
  };
  alert_fired: boolean;
  hindsight_mode: HindcastMode;
  explanation?: string;
}

export interface HindcastRun {
  run_id: string;
  event_id: string;
  event_name: string;
  mode: HindcastMode;
  started_at: string;
  steps: HindcastReplayStep[];
  actual_outcome?: {
    peak_impact_time: string;
    verified_risk_level: RiskLevel;
    documentation: string;
    source: string;
  };
  scorecard?: {
    detection: boolean;
    lead_time_minutes?: number;
    false_alarms: number;
    missed_detections: number;
    data_completeness_pct: number;
    uncertainty_calibrated: boolean;
  };
  label: 'RETROSPECTIVE_HINDCAST' | 'HISTORICAL_MODEL_EVALUATION';
}

// ─── V9: User Safety & Location ─────────────────────────────────────────────

export interface UserLocationState {
  mode: LocationMode;
  lat?: number;
  lon?: number;
  accuracy_m?: number;
  timestamp?: string;
  is_demo: boolean;
  permission_granted: boolean;
}

export interface UserExposure {
  exposure_status: ExposureStatus;
  risk_level: RiskLevel;
  distance_to_hazard_km?: number;
  hazard_type?: string;
  data_freshness_minutes: number;
  confidence: UncertaintyLevel;
  approaching_risk: boolean;
  leaving_risk: boolean;
  location_accuracy_ok: boolean;
  official_alert_active: boolean;
  guidance_level: GuidanceLevel;
  why: string[];
  computed_at: string;
}

export interface GuidanceRoute {
  route_id: string;
  name: string;
  confidence: RouteConfidence;
  road_data_freshness_minutes: number;
  hazard_overlap: boolean;
  bridge_status: 'CLEAR' | 'FLOODED' | 'BLOCKED' | 'UNKNOWN';
  verification_status: VerificationStatus;
  label: 'CANDIDATE_ROUTE' | 'LOWER_EXPOSURE_CANDIDATE' | 'ROUTE_SAFETY_NOT_VERIFIED' | 'BLOCKED';
  distance_km?: number;
  note?: string;
}

export interface SafetyGuidance {
  guidance_id: string;
  level: GuidanceLevel;
  level_label: string;
  risk_level: RiskLevel;
  exposure: UserExposure;
  primary_message: string;
  why_messages: string[];
  candidate_routes: GuidanceRoute[];
  official_alerts: OfficialAlert[];
  shelters: Array<{ name: string; distance_km: number; elevation_m: number; status: string }>;
  data_freshness_minutes: number;
  confidence: UncertaintyLevel;
  is_degraded: boolean;
  degradation_reason?: string;
  disclaimer: string;
  computed_at: string;
}

export interface OfficialAlert {
  alert_id: string;
  source: string;
  source_type: 'GOVERNMENT' | 'NDMA' | 'IMD' | 'DHM_NEPAL' | 'LOCAL_AUTHORITY' | 'DEMO';
  severity: AlertSeverity;
  title: string;
  message: string;
  issued_at: string;
  expires_at?: string;
  area_description: string;
  is_evacuation_order: boolean;
  verification_status: VerificationStatus;
  url?: string;
}

// ─── V9: Flight Recorder ────────────────────────────────────────────────────

export interface FlightRecorderEvent {
  event_index: number;
  event_type: FlightEventType;
  timestamp: string;
  title: string;
  description: string;
  data_mode: DataMode;
  prediction_id?: string;
  alert_id?: string;
  risk_before?: RiskLevel;
  risk_after?: RiskLevel;
  operator_action?: string;
  sensor_id?: string;
  evidence?: string[];
  trace_id: string;
}

// ─── V9: Event Benchmark ────────────────────────────────────────────────────

export interface EventBenchmarkMetrics {
  event_id: string;
  event_name: string;
  year: number;
  detection: boolean | null;
  lead_time_minutes: number | null;
  false_alarms: number | null;
  missed_detections: number | null;
  data_completeness_pct: number | null;
  uncertainty_calibrated: boolean | null;
  note: string;
}

// ─── Predict·Save·Prove ─────────────────────────────────────────────────────

export interface PredictSaveProveRecord {
  prediction: PredictionRecord;
  saved_at: string;
  snapshot_id: string;
  historical_comparison?: {
    event_id: string;
    event_name: string;
    similarity_note: string;
    outcome_documented: string;
    hindcast_label: 'RETROSPECTIVE_HINDCAST';
  };
}
