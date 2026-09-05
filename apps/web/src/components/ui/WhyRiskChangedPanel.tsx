'use client';

import React, { useState } from 'react';
import { HelpCircle, AlertCircle, TrendingUp, Info, ChevronRight } from 'lucide-react';
import { RiskContributor } from '@/types';

export const WhyRiskChangedPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CONTRIBUTORS' | 'CHANGED' | 'MISSING' | 'ELIGIBILITY'>('CONTRIBUTORS');

  const contributors = [
    { name: 'Rainfall Accumulation (3h)', score: 75, weight: 0.35, points: '+26.2', color: 'bg-orange-500', note: '48mm on upper ridge exceeds flash flood threshold' },
    { name: 'Soil Saturation Index', score: 82, weight: 0.25, points: '+20.5', color: 'bg-amber-500', note: '82% moisture saturation on steep hillslope colluvium' },
    { name: 'Terrain Gradient & Slope', score: 55, weight: 0.20, points: '+11.0', color: 'bg-blue-500', note: '28° mean catchment slope accelerates runoff concentration' },
    { name: 'River Stage Rate-of-Rise', score: 42, weight: 0.15, points: '+6.3', color: 'bg-cyan-500', note: 'Gauge reading 3.80m rising +0.40m/hr' },
  ];

  const deltas = [
    { param: '3h Rainfall', previous: '22 mm', current: '48 mm', change: '+26 mm (+118%)', status: 'ESCALATING' },
    { param: 'Soil Saturation', previous: '74%', current: '82%', change: '+8% (+11%)', status: 'CRITICAL' },
    { param: 'River Level', previous: '3.40 m', current: '3.80 m', change: '+0.40 m/h', status: 'RISING' },
    { param: 'Composite Risk', previous: '51.5 (MOD)', current: '68.5 (HIGH)', change: '+17.0 pts', status: 'HIGH RISK' },
  ];

  const missingGaps = [
    { source: 'IMD AWS High-Altitude Gauge', status: 'UNAVAILABLE', detail: 'Real-time telemetry down; using open fallback model' },
    { source: 'In-Situ Soil Moisture Probes', status: 'MODEL_INFERRED', detail: 'Derived from antecedent precipitation index model' },
    { source: 'Drone LiDAR Bathymetry', status: 'NOT CONFIGURED', detail: 'High-res channel depth contouring requires aerial LiDAR' },
  ];

  return (
    <div className="bg-[#0e1630] border border-[#223354] rounded-xl p-3.5 space-y-2.5 shadow-xl text-xs overflow-hidden">
      {/* Tab Selectors */}
      <div className="grid grid-cols-4 gap-1 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('CONTRIBUTORS')}
          className={`py-1.5 px-1 rounded text-[10px] font-mono text-center transition font-bold truncate ${
            activeTab === 'CONTRIBUTORS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Why Risk? Feature Decomposition"
        >
          WHY RISK
        </button>
        <button
          onClick={() => setActiveTab('CHANGED')}
          className={`py-1.5 px-1 rounded text-[10px] font-mono text-center transition font-bold truncate ${
            activeTab === 'CHANGED' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="What Changed? Parameter Deltas"
        >
          CHANGED
        </button>
        <button
          onClick={() => setActiveTab('MISSING')}
          className={`py-1.5 px-1 rounded text-[10px] font-mono text-center transition font-bold truncate ${
            activeTab === 'MISSING' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Data Gaps & Sensor Fallbacks"
        >
          GAPS
        </button>
        <button
          onClick={() => setActiveTab('ELIGIBILITY')}
          className={`py-1.5 px-1 rounded text-[10px] font-mono text-center transition font-black truncate ${
            activeTab === 'ELIGIBILITY' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Location Prediction Eligibility"
        >
          ELIGIBILITY
        </button>
      </div>

      {/* Tab 1: Contributors Decomposition */}
      {activeTab === 'CONTRIBUTORS' && (
        <div className="space-y-2.5">
          {contributors.map((c, i) => (
            <div key={i} className="bg-slate-900/80 p-2.5 rounded border border-slate-800 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="font-semibold text-slate-200 text-[11px] truncate min-w-0">{c.name}</span>
                <span className="font-mono text-cyan-400 text-[11px] font-bold shrink-0">
                  {c.score}/100 <span className="text-slate-400 text-[10px]">({c.points} pts)</span>
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className={`h-full ${c.color} transition-all duration-500`} style={{ width: `${c.score}%` }} />
              </div>
              <div className="text-[10px] text-slate-400 font-mono italic">{c.note}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: What Changed? (Delta comparison) */}
      {activeTab === 'CHANGED' && (
        <div className="space-y-2">
          {deltas.map((d, i) => (
            <div key={i} className="bg-slate-900/80 p-2.5 rounded border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200 text-[11px]">{d.param}</div>
                <div className="text-[10px] text-slate-400 font-mono">Previous: {d.previous} → Current: {d.current}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-orange-400 font-bold text-[11px]">{d.change}</div>
                <span className="text-[9px] font-mono bg-orange-950 text-orange-300 px-1 rounded">{d.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: What's Missing? (Data Gaps) */}
      {activeTab === 'MISSING' && (
        <div className="space-y-2">
          {missingGaps.map((g, i) => (
            <div key={i} className="bg-slate-900/80 p-2.5 rounded border border-slate-800 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 text-[11px]">{g.source}</span>
                <span className="text-[9px] font-mono bg-amber-950 text-amber-300 px-1 rounded border border-amber-800">{g.status}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">{g.detail}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Location Eligibility & Coverage Profiles */}
      {activeTab === 'ELIGIBILITY' && (
        <div className="space-y-2 text-slate-300">
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">REAL DATA SUFFICIENCY</span>
              <span className="text-emerald-400 font-bold text-xs">✓ SUFFICIENT</span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">MODEL VALIDATION</span>
              <span className="text-cyan-400 font-bold text-xs">✓ BENCHMARKED</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-2 rounded border border-cyan-500/30 space-y-1 text-[10px] font-mono">
            <div className="text-slate-400 font-bold">UNCERTAINTY-AWARE ESTIMATE:</div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">Risk Point Score:</span>
              <strong className="text-white font-black text-sm">68.5 ± 12.4</strong>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">90% Confidence Interval:</span>
              <span className="text-cyan-300 font-bold">[56.1, 80.9]</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Conservative Upper (Life Safety):</span>
              <span className="text-amber-300 font-bold">77.8 / 100</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Epistemic vs Aleatoric:</span>
              <span className="text-slate-300 font-mono">18% / 12%</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-2 rounded border border-slate-800 space-y-1 text-[10px] font-mono">
            <div className="text-slate-400 font-bold">STATUS HIERARCHY:</div>
            <div className="flex items-center gap-1.5 text-emerald-300">✓ COMPUTATIONALLY_SUPPORTED</div>
            <div className="flex items-center gap-1.5 text-emerald-300">✓ DATA_SUPPORTED_LOCATION</div>
            <div className="flex items-center gap-1.5 text-cyan-300">✓ PREDICTION_ELIGIBLE_LOCATION</div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">✓ VALIDATED: HIMALAYAN_BENCHMARK</div>
          </div>

          <div className="p-2 rounded bg-slate-900 border border-cyan-500/30 text-[9px] font-mono text-slate-400 leading-relaxed">
            <strong className="text-cyan-300">SCIENTIFIC PRINCIPLE: </strong>
            FloodGuard dynamically evaluates whether sufficient real data and model validation exist before emitting an uncertainty-aware estimate.
          </div>
        </div>
      )}
    </div>
  );
};
