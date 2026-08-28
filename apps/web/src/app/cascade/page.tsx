'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { 
  Layers, 
  ArrowDown, 
  Activity, 
  Mountain, 
  CloudRain, 
  Waves, 
  AlertTriangle, 
  ShieldCheck, 
  Compass, 
  ChevronRight,
  Info
} from 'lucide-react';
import { RiskBadge, UncertaintyBadge, DataModeBadge } from '@/components/ui/Badges';

export default function CascadeFlowPage() {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(5); // River stage node
  const [particleOffset, setParticleOffset] = useState<number>(0);

  const cascadeStages = [
    {
      id: 'stg-1',
      name: 'High Ridge Atmosphere',
      domain: 'METEOROLOGICAL',
      status: 'CRITICAL',
      value: '48.0 mm / 3h',
      rate: '16.0 mm/h',
      desc: 'Orographic condensation convergence at 1,450m ASL exceeding flash threshold.',
      evidence: ['AWS-001 High Ridge Station (48mm/3h)', 'Barometric anomaly -2.4 hPa'],
    },
    {
      id: 'stg-2',
      name: 'Upper Catchment Slopes',
      domain: 'HYDROLOGICAL',
      status: 'CRITICAL',
      value: '82% Saturation Index',
      rate: 'Si > 0.80 threshold breached',
      desc: 'Antecedent soil moisture capacity depleted; near-instantaneous Hortonian overland runoff.',
      evidence: ['Antecedent Precipitation Model API: 92.4', 'Topographic Wetness Index (TWI) > 8.5'],
    },
    {
      id: 'stg-3',
      name: 'Steep Colluvial Gullies',
      domain: 'GEOMECHANICAL',
      status: 'ELEVATED',
      value: '28° Mean Slope Angle',
      rate: 'Runoff velocity 3.4 m/s',
      desc: 'High Stream Power Index (SPI) initiating shallow translational debris scour.',
      evidence: ['DEM SRTM 30m Slope Gradient Matrix', 'Gully Scour Risk: HIGH'],
    },
    {
      id: 'stg-4',
      name: 'Riverbed Choke Point',
      domain: 'HYDRAULIC',
      status: 'WARNING',
      value: 'Bridge Culvert KM 0.6',
      rate: 'Backwater level +1.8m',
      desc: 'Sediment and boulder accumulation constricting downstream discharge capacity.',
      evidence: ['Culvert Stage Gauge reading 2.9m', 'Debris Trap sensor status: ACCUMULATING'],
    },
    {
      id: 'stg-5',
      name: 'Mainstem River Surge',
      domain: 'FLUVIAL',
      status: 'CRITICAL',
      value: '3.80 m (+0.40 m/h)',
      rate: 'Rising +0.40 m/h',
      desc: 'Hydrodynamic surge front propagating downstream at ~4.2 m/s towards alluvial fan.',
      evidence: ['Radar Water Level Gauge #1 (3.80m)', 'Hydrograph Gradient: RAPID SURGE'],
    },
    {
      id: 'stg-6',
      name: 'Sunderbans Nagar Fan',
      domain: 'SETTLEMENT EXPOSURE',
      status: 'HIGH_EXPOSURE',
      value: 'Risk Score: 68.5 / 100',
      rate: 'Lead time: 42 minutes',
      desc: 'Primary inhabited settlement in direct flood path. Guidance Level 2 activated.',
      evidence: ['Inhabited footprint: 3,400 residents', 'Candidate route: North Ridge Trail'],
    },
  ];

  const active = cascadeStages[selectedNodeIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[#070d1e] text-slate-100 select-none">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="cascade" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#223354] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">
                  PROPAGATION PHYSICS
                </span>
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  UPSTREAM → DOWNSTREAM CASCADE PROPAGATION GRAPH
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Physics-guided hazard chain mapping energy transfer from mountain ridge cloudburst down to settlement exposure
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Master 8-Stage Interactive Horizontal Flow Graph */}
          <div className="bg-[#0e1630] border border-[#223354] rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                ACTIVE HAZARD CASCADE PIPELINE (CLICK NODE TO INSPECT)
              </span>
              <span className="text-[10px] font-mono text-slate-400">PROPAGATION VELOCITY: 4.2 M/S</span>
            </div>

            {/* Visual Node Chain */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {cascadeStages.map((stg, idx) => {
                const isSelected = selectedNodeIndex === idx;
                return (
                  <button
                    key={stg.id}
                    onClick={() => setSelectedNodeIndex(idx)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 relative overflow-hidden group ${
                      isSelected
                        ? 'bg-blue-600/30 border-cyan-400 text-slate-100 ring-2 ring-cyan-500 shadow-xl'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">0{idx + 1}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          stg.status === 'CRITICAL' ? 'bg-rose-400 animate-ping' : stg.status === 'HIGH_EXPOSURE' ? 'bg-orange-400 animate-pulse' : 'bg-amber-400'
                        }`} />
                      </div>
                      <div className="text-xs font-bold text-slate-100 mt-1 leading-snug">{stg.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{stg.domain}</div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="font-mono text-cyan-300 font-bold text-[11px] truncate">{stg.value}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Node Detail Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#070d1e] p-6 rounded-xl border border-slate-800">
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                    CASCADE STAGE 0{selectedNodeIndex + 1}: {active.domain}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800 text-[10px] font-mono font-bold">
                    {active.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100">{active.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{active.desc}</p>
                <div className="text-xs font-mono text-cyan-300 font-bold pt-1">
                  Rate of Change: {active.rate}
                </div>
              </div>

              {/* Physical Evidence Stack */}
              <div className="bg-[#0e1630] p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div className="font-mono font-bold text-slate-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  PHYSICAL EVIDENCE INPUTS
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {active.evidence.map((ev, i) => (
                    <div key={i} className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-300 flex items-center gap-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
