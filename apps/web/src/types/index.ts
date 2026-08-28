export type DataMode = 'LIVE' | 'HISTORICAL' | 'UPLOAD' | 'DEMO' | 'SIMULATION' | 'REPLAY';

export type EvidenceState = 'OBSERVED' | 'REPORTED' | 'MODEL_INFERRED' | 'SIMULATED' | 'UNAVAILABLE' | 'UNKNOWN';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME' | 'UNKNOWN';

export type UncertaintyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'INSUFFICIENT_DATA';

export type AlertSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';

export type AlertStatus = 'DRAFT' | 'ACTIVE' | 'ACKNOWLEDGED' | 'ESCALATED' | 'RESOLVED' | 'ARCHIVED';

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
  created_at: string;
  activated_at?: string;
  location_id?: string;
  uncertainty?: UncertaintyLevel;
  evidence?: Array<Record<string, any>>;
  operator_notes?: string;
}

export interface SystemHealthData {
  status: 'OPERATIONAL' | 'DEGRADED' | 'UNAVAILABLE';
  version: string;
  data_mode: DataMode;
  demo_mode: boolean;
  components: Record<string, { status: string; detail?: string; provider?: string }>;
}
