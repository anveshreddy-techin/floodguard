'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import {
  Brain, AlertTriangle, CheckCircle2, Clock, BarChart3,
  Route, Activity, Info, Shield
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

const MODELS = [
  {
    id: 'baseline_rule_v1',
    name: 'Rule-Based Baseline',
    region: 'Pan-India (all regions)',
    target: 'Flash flood risk classification',
    status: 'OPERATIONAL',
    status_label: 'OPERATIONAL — DEMO ONLY',
    training_period: 'N/A (deterministic rules)',
    features: 8,
    validation_note: 'No statistical validation required — pure rule system.',
    limitations: ['Threshold values require IMD/CWC operational calibration', 'Does not generalize beyond defined rules'],
    description: 'Deterministic threshold-based classifier used as the primary decision system in the demo.',
  },
  {
    id: 'logistic_regression_v1',
    name: 'Logistic Regression v1',
    region: 'Northern Himalayan Zone',
    target: 'Rainfall extreme probability',
    status: 'LIMITED_VALIDATION',
    status_label: 'LIMITED_VALIDATION',
    training_period: '2018–2023 (Uttarakhand AWS historical archive)',
    features: 12,
    validation_note: 'Trained on 5 monsoon seasons; 3-fold chronological cross-validation; F1 ≈ 0.62 on held-out 2023 season.',
    limitations: ['Small training set — insufficient for production', 'GLOF events excluded (insufficient positive labels)', 'Not validated for Western Ghats or coastal regions'],
    description: 'Exploratory model for Himalayan zone rainfall extremes. Research prototype only.',
  },
  {
    id: 'random_forest_v1',
    name: 'Random Forest Classifier v1',
    region: 'Western Ghats',
    target: 'Landslide trigger classification',
    status: 'DEMO_ONLY',
    status_label: 'DEMO_ONLY',
    training_period: 'Not completed — target variable sourcing in progress',
    features: 16,
    validation_note: 'Feature engineering complete. Training not completed pending event catalog digitization.',
    limitations: ['Target labels (verified landslide events) not yet sourced from GSI', 'Cannot be deployed without proper labels', 'Terrain features from 30m SRTM DEM — insufficient resolution for steep slopes'],
    description: 'Planned landslide trigger model for Western Ghats. Currently a feature-engineering stub only.',
  },
  {
    id: 'urban_flood_v1',
    name: 'Urban Waterlogging Regressor v1',
    region: 'Urban Metro Zones',
    target: 'Waterlogging depth estimate',
    status: 'DEMO_ONLY',
    status_label: 'DEMO_ONLY',
    training_period: 'Not started — depends on drain topology data',
    features: 14,
    validation_note: 'Planned. Storm drain network data not available for most cities.',
    limitations: ['Requires city-level storm drain network topology (not digitized)', 'Cannot be validated without field sensor networks in cities'],
    description: 'Planned urban waterlogging model for Mumbai, Bengaluru, Chennai, Hyderabad.',
  },
  {
    id: 'cascade_anomaly_v1',
    name: 'Cascade Anomaly Detector v1',
    region: 'Cross-regional (Himalayan + Brahmaputra)',
    target: 'Multi-hazard cascade trigger anomaly',
    status: 'DEMO_ONLY',
    status_label: 'DEMO_ONLY',
    training_period: 'Not started',
    features: 20,
    validation_note: 'Research concept. Requires multi-sensor time series across diverse basins.',
    limitations: ['No labeled cascade event dataset exists for India at required granularity', 'Temporal alignment of heterogeneous sensors is unsolved problem'],
    description: 'Research exploration for detecting compound/cascade hazard signatures.',
  },
];

const STATUS_COLORS: Record<string, string> = {
  OPERATIONAL: 'text-green-400 bg-green-500/10 border-green-500/30',
  LIMITED_VALIDATION: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  DEMO_ONLY: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  NOT_TRAINED: 'text-red-400 bg-red-500/10 border-red-500/30',
};

const ROUTING_REGIONS = [
  { region: 'HIMALAYAN_NORTH', states: 'UK, HP, JK, LA', model: 'baseline_rule_v1 + logistic_regression_v1' },
  { region: 'NORTHEAST_HILLS', states: 'AS, SK, AR, ML, MN, MZ, NL, TR', model: 'baseline_rule_v1' },
  { region: 'WESTERN_GHATS', states: 'KL, KA, MH, GJ', model: 'baseline_rule_v1 (RF planned)' },
  { region: 'INDO_GANGETIC_PLAINS', states: 'UP, BR, HR, PB, RJ', model: 'baseline_rule_v1' },
  { region: 'CENTRAL_RIVERS', states: 'MP, CG, OR, JH, WB, TS', model: 'baseline_rule_v1' },
  { region: 'COASTAL_CYCLONE', states: 'OR, WB, AP, TN, PY, KL', model: 'baseline_rule_v1' },
  { region: 'URBAN_FLOOD', states: 'MH, KA, TN, TS, DL, WB', model: 'baseline_rule_v1 (urban planned)' },
  { region: 'SEMI_ARID', states: 'RJ, GJ, MH, AP', model: 'baseline_rule_v1' },
];

export default function ModelMonitoringPage() {
  return (
    <div className="flex h-screen bg-[#0a0f1e] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 space-y-4">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-400" />
                ML Model Registry & Monitoring
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Model versions, regional routing, validation status, and limitations.
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Honesty notice */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-200/80">
              <span className="text-amber-300 font-semibold">Model Honesty Policy — </span>
              All FloodGuard AI models are research prototypes. <strong>No operational accuracy is claimed</strong>.
              Models labeled <strong>DEMO_ONLY</strong> have not been trained with validated field data and must not be
              used for real operational warning decisions. The baseline rule engine is used for all SIH demo outputs.
            </p>
          </div>

          {/* Model cards */}
          <div className="space-y-3">
            {MODELS.map(m => (
              <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-semibold">{m.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${STATUS_COLORS[m.status] || 'text-gray-400 bg-gray-800 border-gray-700'}`}>
                        {m.status_label}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">{m.description}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>{m.features} features</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Region</p>
                    <p className="text-gray-300 text-sm">{m.region}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Target</p>
                    <p className="text-gray-300 text-sm">{m.target}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Training Period</p>
                    <p className="text-gray-300 text-sm">{m.training_period}</p>
                  </div>
                </div>

                <div className="mt-2 bg-gray-800/60 rounded p-2 text-xs text-gray-400">
                  <span className="text-gray-300 font-medium">Validation: </span>{m.validation_note}
                </div>

                <div className="mt-2">
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Known Limitations</p>
                  <ul className="space-y-0.5">
                    {m.limitations.map((l, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-400">
                        <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Regional routing table */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h2 className="text-white font-semibold flex items-center gap-2 mb-3">
              <Route className="w-4 h-4 text-blue-400" />
              Regional Model Routing
            </h2>
            <p className="text-gray-400 text-xs mb-3">
              Coordinates → State → Hazard Region → Model family. All regions currently use the rule-based baseline in production demo.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase border-b border-gray-800">
                    <th className="text-left py-2">Hazard Region</th>
                    <th className="text-left py-2">States / UTs</th>
                    <th className="text-left py-2">Active Model</th>
                  </tr>
                </thead>
                <tbody>
                  {ROUTING_REGIONS.map((r, i) => (
                    <tr key={r.region} className={`border-b border-gray-800/40 ${i % 2 === 0 ? '' : 'bg-gray-800/20'}`}>
                      <td className="py-2 text-blue-400 font-mono text-xs">{r.region}</td>
                      <td className="py-2 text-gray-400 text-xs">{r.states}</td>
                      <td className="py-2 text-gray-300 text-xs">{r.model}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Drift monitoring */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h2 className="text-white font-semibold flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-gray-400" />
              Drift Monitoring
            </h2>
            <div className="flex items-center gap-3 bg-gray-800/40 rounded p-3">
              <Info className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-400">
                Drift monitoring is <strong>NOT_CONFIGURED</strong> in demo mode.
                Operational deployment would require: reference distribution baselines, online PSI/KL divergence tracking,
                and automated retraining triggers. None of these are active in the current prototype.
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
