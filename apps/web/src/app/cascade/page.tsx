'use client';

import { RelatedAppsBar } from '@/components/ui/RelatedAppsBar';
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
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
  Info,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function CascadeFlowPage() {
  const { setPage, setMode, setRiverStage, setRainfallMm } = useEnvironment();
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(4); // River stage node

  useEffect(() => {
    setPage('cascade');
    setMode('DEMO');
    setRiverStage(3.8);
    setRainfallMm(48);
  }, [setPage, setMode, setRiverStage, setRainfallMm]);

  const cascadeStages = [
    {
      id: 'stg-1',
      name: 'High Ridge Atmosphere',
      domain: 'METEOROLOGICAL',
      status: 'CRITICAL',
      statusColor: '#ef4444',
      value: '48.0 mm / 3h',
      rate: '16.0 mm/h rate',
      desc: 'Orographic condensation convergence at 1,450m ASL exceeding flash-flood threshold.',
      evidence: ['AWS-001 High Ridge Station (48mm/3h)', 'Barometric anomaly -2.4 hPa', 'Doppler precipitation core detection'],
    },
    {
      id: 'stg-2',
      name: 'Upper Catchment Slopes',
      domain: 'HYDROLOGICAL',
      status: 'CRITICAL',
      statusColor: '#ef4444',
      value: '82% Saturation Index',
      rate: 'Si > 0.80 threshold breached',
      desc: 'Antecedent soil moisture capacity depleted; near-instantaneous Hortonian overland runoff.',
      evidence: ['Antecedent Precipitation Model API: 92.4', 'Topographic Wetness Index (TWI) > 8.5', 'Infiltration capacity: <5 mm/h'],
    },
    {
      id: 'stg-3',
      name: 'Steep Colluvial Gullies',
      domain: 'GEOMECHANICAL',
      status: 'ELEVATED',
      statusColor: '#f97316',
      value: '28° Mean Slope Angle',
      rate: 'Runoff velocity 3.4 m/s',
      desc: 'High Stream Power Index (SPI) initiating shallow translational debris scour.',
      evidence: ['DEM SRTM 30m Slope Gradient Matrix', 'Gully Scour Risk: HIGH', 'Bed shear stress: 145 N/m²'],
    },
    {
      id: 'stg-4',
      name: 'Riverbed Choke Point',
      domain: 'HYDRAULIC',
      status: 'WARNING',
      statusColor: '#eab308',
      value: 'Bridge Culvert KM 0.6',
      rate: 'Backwater level +1.8m',
      desc: 'Sediment and boulder accumulation constricting downstream discharge capacity.',
      evidence: ['Culvert Stage Gauge reading 2.9m', 'Debris Trap sensor status: ACCUMULATING', 'Discharge coefficient reduced 38%'],
    },
    {
      id: 'stg-5',
      name: 'Mainstem River Surge',
      domain: 'FLUVIAL',
      status: 'CRITICAL',
      statusColor: '#ef4444',
      value: '3.80 m (+0.40 m/h)',
      rate: 'Rising +0.40 m/h',
      desc: 'Hydrodynamic surge front propagating downstream at ~4.2 m/s towards alluvial fan settlement.',
      evidence: ['Radar Water Level Gauge #1 (3.80m)', 'Hydrograph Gradient: RAPID SURGE', 'Wave crest velocity: 4.2 m/s'],
    },
    {
      id: 'stg-6',
      name: 'Sunderbans Nagar Fan',
      domain: 'SETTLEMENT EXPOSURE',
      status: 'HIGH EXPOSURE',
      statusColor: '#f97316',
      value: 'Risk Score: 68.5 / 100',
      rate: 'Lead time: 42 minutes',
      desc: 'Primary inhabited settlement in direct flood path. Guidance Level 2 activated.',
      evidence: ['Inhabited footprint: 3,400 residents', 'Candidate route: North Ridge Trail', 'Shelter readiness: 85% capacity'],
    },
  ];

  const active = cascadeStages[selectedNodeIndex];

  return (
    <div className="flex flex-col h-screen overflow-hidden select-none bg-[#F0F4F8] text-slate-900">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="cascade" />

        <main className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 lg:p-6 pb-24 md:pb-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <RelatedAppsBar activeAppId="cascade" />
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-mono font-bold">PROPAGATION PHYSICS</span>
                <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  UPSTREAM → DOWNSTREAM CASCADE PROPAGATION GRAPH
                </h1>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-sans">
                Physics-guided hazard chain mapping energy transfer from mountain ridge cloudburst down to settlement exposure
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/simulation"
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
              >
                <span>🧪 Scenario Lab (What-If)</span>
                <span className="text-blue-500">→</span>
              </a>
              <DataModeBadge mode="DEMO" />
            </div>
          </div>

          {/* Master 2-Column Spatial Flow Graph Workbench */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: Vertical SVG Propagation Pipeline (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 space-y-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                  PHYSICAL CASCADE PIPELINE
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-bold">PROPAGATION: 4.2 M/S</span>
              </div>

              {/* Vertical Stack with Animated Downward Connectors */}
              <div className="space-y-2 relative">
                {cascadeStages.map((stg, idx) => {
                  const isSelected = selectedNodeIndex === idx;
                  return (
                    <React.Fragment key={stg.id}>
                      <button
                        onClick={() => setSelectedNodeIndex(idx)}
                        className={`w-full p-4 rounded-2xl text-left transition-all duration-300 flex items-center justify-between group shadow-sm border ${
                          isSelected
                            ? 'bg-blue-50/80 border-2 border-blue-600 shadow-md scale-[1.01]'
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0"
                            style={{
                              backgroundColor: `${stg.statusColor}15`,
                              color: stg.statusColor,
                              border: `1px solid ${stg.statusColor}50`
                            }}
                          >
                            0{idx + 1}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                              {stg.name}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {stg.domain}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-slate-900">{stg.value}</div>
                          <span
                            className="text-[9px] font-mono font-bold px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: `${stg.statusColor}15`,
                              color: stg.statusColor,
                              border: `1px solid ${stg.statusColor}40`
                            }}
                          >
                            {stg.status}
                          </span>
                        </div>
                      </button>

                      {/* Animated Downward Flow Indicator */}
                      {idx < cascadeStages.length - 1 && (
                        <div className="flex justify-center my-0.5">
                          <div className="w-0.5 h-4 bg-gradient-to-b from-blue-500 to-teal-500 rounded-full animate-pulse" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Active Node Detail Inspector & Physical Evidence (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-200 shadow-sm animate-slide-up">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-blue-700 uppercase tracking-widest font-bold">
                      STAGE 0{selectedNodeIndex + 1} INSPECTION • {active.domain}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 mt-0.5">{active.name}</h2>
                  </div>
                  <span
                    className="px-3 py-1 rounded-xl text-xs font-mono font-bold shadow-sm"
                    style={{
                      backgroundColor: `${active.statusColor}15`,
                      color: active.statusColor,
                      border: `1px solid ${active.statusColor}50`
                    }}
                  >
                    {active.status}
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-sans font-medium">
                  {active.desc}
                </p>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-1 border border-slate-200">
                    <div className="text-slate-500 text-[10px] uppercase font-bold">PRIMARY VALUE</div>
                    <div className="text-lg font-black text-blue-700">{active.value}</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-1 border border-slate-200">
                    <div className="text-slate-500 text-[10px] uppercase font-bold">RATE OF CHANGE</div>
                    <div className="text-lg font-black text-amber-700">{active.rate}</div>
                  </div>
                </div>

                {/* Evidence Input Vectors */}
                <div className="space-y-3 pt-2">
                  <div className="font-mono font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    SUPPORTING PHYSICAL OBSERVATIONS
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    {active.evidence.map((ev, i) => (
                      <div key={i} className="bg-slate-50 p-3 rounded-xl text-slate-800 flex items-center gap-2.5 border border-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
);
}
