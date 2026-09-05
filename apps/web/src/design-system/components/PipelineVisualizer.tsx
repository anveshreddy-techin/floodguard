'use client';

import React, { useState } from 'react';
import {
  CloudRain,
  Droplets,
  Mountain,
  History,
  Radio,
  Brain,
  Target,
  Bell,
  ShieldCheck,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export interface PipelineStageInfo {
  stage: number;
  id: string;
  name: string;
  shortName: string;
  icon: any;
  agency: string;
  equation: string;
  formulaDescription: string;
  inputSensors: string;
  sampleValue: string;
  unit: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  statusColor: string;
  threshold: string;
  provenance: string;
  details: string;
}

const PIPELINE_STAGES: PipelineStageInfo[] = [
  {
    stage: 1,
    id: 'rainfall',
    name: 'Rainfall Telemetry',
    shortName: 'Rainfall',
    icon: CloudRain,
    agency: 'IMD / NASA GPM',
    equation: 'I_{rain} = \\frac{\\Delta R}{\\Delta t} \\quad [\\text{mm/h}]; \\quad QPF_{24h} = \\int_{0}^{24} R(t)\\,dt',
    formulaDescription: 'Instantaneous intensity & 24h Quantitative Precipitation Forecast accumulation over ridge crests.',
    inputSensors: 'IMD AWS Tipping Bucket (0.2mm tip) + GPM IMERG 0.1° Satellite Radar',
    sampleValue: '48.0 mm / 3h (18.5 mm/h peak)',
    unit: 'mm / mm/h',
    status: 'CRITICAL',
    statusColor: 'text-red-700 bg-red-50 border-red-200',
    threshold: 'Normal < 15 mm/h | Critical >= 40 mm/h',
    provenance: 'IMD Joshimath AWS (Station #42114) · Lat: 30.5566, Lon: 79.5645',
    details: 'Torrential mountain downpour exceeding antecedent threshold. Rapid runoff expected within 35 minutes.',
  },
  {
    stage: 2,
    id: 'soil_moisture',
    name: 'Soil Moisture Saturation',
    shortName: 'Soil Moisture',
    icon: Droplets,
    agency: 'NRSC / State Hydrology',
    equation: 'API_{72h} = \\sum_{t=1}^{n} k^t \\cdot P_t; \\quad S_{sat} = \\left( \\frac{\\theta_v}{\\theta_{sat}} \\right) \\times 100',
    formulaDescription: 'Volumetric soil moisture fraction and 72-hour Antecedent Precipitation Index (decay factor k=0.88).',
    inputSensors: 'TDR (Time-Domain Reflectometry) Multi-Depth Probes (20cm, 50cm, 100cm)',
    sampleValue: '82.5% Volumetric Saturation',
    unit: 'Percentage (%)',
    status: 'CRITICAL',
    statusColor: 'text-red-700 bg-red-50 border-red-200',
    threshold: 'Normal < 60% | Critical >= 80% (Zero Infiltration Buffer)',
    provenance: 'In-situ TDR Probe array (SOIL-001/002) at Raini Slope',
    details: 'Pore space completely saturated. Over 85% of incoming precipitation translates into immediate overland flow.',
  },
  {
    stage: 3,
    id: 'slope_stability',
    name: 'Slope Stability (FoS)',
    shortName: 'Slope (FoS)',
    icon: Mountain,
    agency: 'GSI / CartoDEM',
    equation: 'FoS = \\frac{c\' + (\\gamma - m \\cdot \\gamma_w) \\cdot z \\cdot \\cos^2\\theta \\cdot \\tan\\phi\'}{\\gamma \\cdot z \\cdot \\sin\\theta \\cdot \\cos\\theta}',
    formulaDescription: 'Geotechnical Infinite Slope limit equilibrium with pore-water pressure coupling ratio m.',
    inputSensors: 'ISRO CartoDEM 10m Digital Elevation Model + Inclinometer Mesh',
    sampleValue: 'FoS = 1.04 (Slope 32°)',
    unit: 'Factor of Safety ratio',
    status: 'CRITICAL',
    statusColor: 'text-red-700 bg-red-50 border-red-200',
    threshold: 'Stable FoS > 1.30 | Critical FoS < 1.05 (Imminent Failure)',
    provenance: 'CartoDEM v3 10m + Geotechnical Mohr-Coulomb soil parameters (c\'=14kPa, phi\'=29°)',
    details: 'Pore-water pressure has drastically reduced effective normal stress. High risk of debris flow trigger.',
  },
  {
    stage: 4,
    id: 'historical_data',
    name: 'Historical Forensic Analogs',
    shortName: 'Historical',
    icon: History,
    agency: 'NDEM / CWC Archive',
    equation: 'Sim(X, X_{hist}) = \\cos(\\theta) = \\frac{X \\cdot X_{hist}}{\\|X\\| \\cdot \\|X_{hist}\\|}',
    formulaDescription: 'Cosine similarity vector matching real-time multi-variate trajectory against audited disaster catalog.',
    inputSensors: 'National Database for Emergency Management (NDEM) Catastrophe Catalog',
    sampleValue: '84% Similarity → 2021 Chamoli GLOF',
    unit: 'Cosine Index (0-1.0)',
    status: 'WARNING',
    statusColor: 'text-orange-700 bg-orange-50 border-orange-200',
    threshold: 'Nominal < 0.50 | Warning >= 0.75 (Catastrophic Analog)',
    provenance: 'NDEM ISRO Disaster Archive (Record #NDEM-UK-20210207)',
    details: 'Precipitation and stream rate trajectory mirrors early phase of the February 2021 Chamoli flash flood.',
  },
  {
    stage: 5,
    id: 'iot_mesh',
    name: 'IoT Mesh Telemetry',
    shortName: 'IoT Mesh',
    icon: Radio,
    agency: 'C-DAC / FloodGuard Mesh',
    equation: '\\frac{dS}{dt} = \\frac{S_t - S_{t-1}}{\\Delta t}; \\quad RMS_{acoustic} = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N v_i^2}',
    formulaDescription: '24GHz FMCW Radar river stage velocity + sub-surface geophone acoustic bedload vibration.',
    inputSensors: 'Non-contact FMCW Radar Gauge + Sub-surface Geophone (LoRaWAN 865MHz)',
    sampleValue: 'Stage: 4.80m (+0.45 m/h surge)',
    unit: 'Meters / m/h / Hz',
    status: 'CRITICAL',
    statusColor: 'text-red-700 bg-red-50 border-red-200',
    threshold: 'Warning Level: 3.50m | Danger Level: 4.20m',
    provenance: 'RADAR-001 at Raini Bridge + GEO-001 Geophone',
    details: 'River level has breached CWC Danger Level (4.20m). Upstream constriction indicates temporary debris blockage.',
  },
  {
    stage: 6,
    id: 'ml_prediction',
    name: 'ML Ensemble Prediction',
    shortName: 'ML Model',
    icon: Brain,
    agency: 'NDRF / SIH Tier C Ensemble',
    equation: 'P(Flood) = \\frac{1}{B} \\sum_{b=1}^{B} \\text{Tree}_b(X_{25}); \\quad \\text{Margin} = \\pm 1.96 \\cdot \\frac{\\sigma}{\\sqrt{B}}',
    formulaDescription: 'Tier C 25-feature Random Forest inference across regional meteorological and geotechnical vectors.',
    inputSensors: 'Copernicus GloFAS + Open-Meteo Multi-Decadal + Real-Time Mesh Telemetry',
    sampleValue: 'P = 0.87 (Confidence 88.5%)',
    unit: 'Probability (0.0 - 1.0)',
    status: 'CRITICAL',
    statusColor: 'text-red-700 bg-red-50 border-red-200',
    threshold: 'Normal P < 0.35 | Warning P >= 0.70',
    provenance: 'Trained on 1990-2025 Central Himalayan Catchment Reanalysis',
    details: 'Ensemble consensus confirms flash flood genesis with 95% confidence interval ±3.2%.',
  },
  {
    stage: 7,
    id: 'hyperlocal_risk',
    name: 'Hyper-Local Flash Flood Risk',
    shortName: 'Micro Risk',
    icon: Target,
    agency: 'NDMIS / District EOC',
    equation: 'Risk = 0.35 \\cdot R_{norm} + 0.25 \\cdot S_{sat} + 0.20 \\cdot FoS_{inv} + 0.20 \\cdot Q_{surge}',
    formulaDescription: 'Multi-hazard fusion index mapped onto 0-100 micro-ward spatial grid with hydraulic lead time.',
    inputSensors: 'Catchment Micro-Ward Risk Synthesis Engine',
    sampleValue: 'Risk Index: 88.5 / 100 (EXTREME)',
    unit: 'Score (0 - 100)',
    status: 'CRITICAL',
    statusColor: 'text-red-700 bg-red-50 border-red-200',
    threshold: 'Moderate 35-59 | High 60-74 | Extreme >= 75',
    provenance: 'Chamoli District Emergency Operation Centre (DEOC) Grid Cell #UK-CHAM-04',
    details: 'Calculated downstream flood wave arrival time: 24 minutes to primary village cluster.',
  },
  {
    stage: 8,
    id: 'village_alert',
    name: 'Village/Ward Alert Dissemination',
    shortName: 'SACHET Alert',
    icon: Bell,
    agency: 'NDMA SACHET (CAP v1.2)',
    equation: '\\text{OASIS CAP v1.2: } \\{ \\text{Urgency: Immediate}, \\text{Severity: Extreme}, \\text{Certainty: Observed} \\}',
    formulaDescription: 'Geo-targeted bilingual (EN/HI) alerting formatted to NDMA Common Alerting Protocol v1.2 standard.',
    inputSensors: 'SACHET CAP XML/JSON Dispatch Gateway',
    sampleValue: 'RED CAP Alert Dispatched',
    unit: 'Cell Broadcast / SMS / Siren',
    status: 'CRITICAL',
    statusColor: 'text-red-700 bg-red-50 border-red-200',
    threshold: 'Green Advisory | Yellow Watch | Orange Warning | Red Evacuate',
    provenance: 'CAP Alert ID: SACHET-CAP-UK-CHA-1788604800 (OASIS Standard)',
    details: 'Bilingual audio sirens triggered at 9 municipal towers; Cell broadcast transmitted to 28,450 mobile devices.',
  },
  {
    stage: 9,
    id: 'evacuation_action',
    name: 'Evacuation & Shelter Action',
    shortName: 'Evacuation',
    icon: ShieldCheck,
    agency: 'NDRF / SDMA Relief Directorate',
    equation: '\\text{Route Safety} = \\min(\\text{Elev}_{path}) - S_{flood}(t) > 3.0\\text{m}; \\quad \\text{Capacity Margin} = C - O',
    formulaDescription: 'Real-time topological safety passability check and shelter capacity allocation.',
    inputSensors: 'NDRF Tactical Shelter Ledger & Digital Elevation Safety Routing',
    sampleValue: 'North Ridge Route Active (GIC Camp)',
    unit: 'Capacity: 650 | Occupancy: 140',
    status: 'NORMAL',
    statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    threshold: 'Route Inundated: CLOSED | High-Ground Route: PASSABLE',
    provenance: '8th Battalion NDRF Forward Base · Joshimath GIC Shelter',
    details: 'Primary escape vector (North Ridge Trail, +120m elevation) verified passable. 140 citizens sheltered.',
  },
];

export const PipelineVisualizer: React.FC<{
  currentStageIndex?: number;
  onStageSelect?: (stageIndex: number) => void;
}> = ({ currentStageIndex = 6, onStageSelect }) => {
  const [activeStage, setActiveStage] = useState<number>(currentStageIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const selected = PIPELINE_STAGES[activeStage] || PIPELINE_STAGES[0];
  const SelectedIcon = selected.icon;

  const handleStageClick = (idx: number) => {
    setActiveStage(idx);
    if (onStageSelect) {
      onStageSelect(idx);
    }
  };

  const handleAutoPlay = () => {
    setIsPlaying(true);
    let cur = 0;
    const interval = setInterval(() => {
      setActiveStage(cur);
      cur++;
      if (cur >= PIPELINE_STAGES.length) {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-300 rounded shadow-xs overflow-hidden text-slate-900 mb-6">
      {/* ── HEADER: 9-STAGE PREDICTION PIPELINE ── */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-blue-800 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
            9-P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                9-Stage Physical to Operational Prediction Pipeline
              </h3>
              <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                SIH26192 Core Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              End-to-end deterministic prediction chain from mountain rainfall to village evacuation action.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoPlay}
            disabled={isPlaying}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-800 hover:bg-blue-900 disabled:bg-slate-400 text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Play className="w-3 h-3" />
            <span>{isPlaying ? 'Evaluating...' : 'Simulate Pipeline'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStage(0)}
            className="p-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
            title="Reset to Stage 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── INTERACTIVE HORIZONTAL STEPPER (9 STAGES) ── */}
      <div className="p-3 bg-slate-100/60 border-b border-slate-200 overflow-x-auto">
        <div className="flex items-center min-w-[820px] gap-1">
          {PIPELINE_STAGES.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeStage === idx;
            const isCritical = s.status === 'CRITICAL';
            const isWarning = s.status === 'WARNING';

            return (
              <React.Fragment key={s.id}>
                <button
                  type="button"
                  onClick={() => handleStageClick(idx)}
                  className={`flex-1 flex flex-col items-center p-2 rounded text-center transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-900 text-white border-blue-900 shadow-md scale-[1.02] ring-2 ring-blue-500/50'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <span
                      className={`w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center ${
                        isSelected
                          ? 'bg-white text-blue-900'
                          : isCritical
                          ? 'bg-red-600 text-white'
                          : isWarning
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {s.stage}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`} />
                  </div>
                  <div className={`text-[10px] font-bold leading-tight line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {s.shortName}
                  </div>
                  <div
                    className={`text-[8px] font-mono mt-0.5 px-1 py-0.2 rounded uppercase ${
                      isSelected
                        ? 'bg-blue-800 text-cyan-200'
                        : isCritical
                        ? 'text-red-700 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    {s.agency.split('/')[0]}
                  </div>
                </button>

                {idx < PIPELINE_STAGES.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── ACTIVE STAGE DEEP-DIVE INSPECTOR ── */}
      <div className="p-4 sm:p-5 bg-white space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 border border-blue-200">
              <SelectedIcon className="w-5 h-5 text-blue-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-700 uppercase">
                  Stage {selected.stage} of 9
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-bold text-slate-600">
                  Agency Benchmark: <strong className="text-slate-900">{selected.agency}</strong>
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {selected.name}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded text-xs font-bold border font-mono ${selected.statusColor}`}>
              STATUS: {selected.status}
            </span>
          </div>
        </div>

        {/* 2-Column Inspector Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          {/* Left Column: Equations & Sensors */}
          <div className="space-y-3 bg-slate-50 border border-slate-200 rounded p-3.5">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                GOVERNING PHYSICAL / MATHEMATICAL FORMULA
              </div>
              <div className="bg-slate-900 text-cyan-300 font-mono text-[11px] p-2.5 rounded border border-slate-800 overflow-x-auto">
                <code>{selected.equation}</code>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 italic">
                {selected.formulaDescription}
              </p>
            </div>

            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                INPUT SENSORS &amp; DATA TELEMETRY FEEDS
              </div>
              <p className="text-slate-800 font-medium bg-white p-2 rounded border border-slate-200">
                {selected.inputSensors}
              </p>
            </div>

            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                THRESHOLD CRITERIA
              </div>
              <p className="text-slate-700 font-mono text-[11px] bg-white p-2 rounded border border-slate-200">
                {selected.threshold}
              </p>
            </div>
          </div>

          {/* Right Column: Values & Provenance */}
          <div className="space-y-3 bg-slate-50 border border-slate-200 rounded p-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                  OBSERVED / CALCULATED VALUES
                </div>
                <div className="bg-white border border-slate-300 rounded p-2.5 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {selected.sampleValue}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {selected.unit}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                  PHYSICAL INTERPRETATION
                </div>
                <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                  {selected.details}
                </p>
              </div>

              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                  AUDIT &amp; DATA PROVENANCE
                </div>
                <div className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-200">
                  {selected.provenance}
                </div>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-mono">
                Verified against MHA Disaster Management Theme 4
              </span>
              <div className="flex items-center gap-1.5 font-bold text-blue-700">
                <span>Stage {selected.stage}/9 Verified</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
