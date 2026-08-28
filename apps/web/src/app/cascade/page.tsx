'use client';

import React from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { Layers, ArrowDown, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { RiskBadge, DataModeBadge } from '@/components/ui/Badges';

export default function CascadePage() {
  const cascadeStages = [
    {
      stage: 1,
      title: "Ridge Catchment (Precipitation Trigger)",
      location: "Upper Alaknanda Ridge Altitude 2,400m",
      evidence: "48.0 mm rain in 3h (+16mm/h peak intensity)",
      status: "TRIGGER_ACTIVE",
      riskLevel: "HIGH" as const,
      leadTime: "T-45 min",
      description: "Intense convective burst over high elevation steep terrain exceeding local infiltration capacity.",
    },
    {
      stage: 2,
      title: "Hillslope Infiltration & Runoff Generation",
      location: "Slope Gradient 28°",
      evidence: "Soil Saturation Index at 82% (near field capacity)",
      status: "RUNOFF_ACCELERATING",
      riskLevel: "HIGH" as const,
      leadTime: "T-30 min",
      description: "Pre-saturated topsoil converts >85% of incoming precipitation into immediate surface overland flow.",
    },
    {
      stage: 3,
      title: "Narrow Gorge Flow Concentration & Debris Remobilization",
      location: "Strahler Order 3 Tributary Junction",
      evidence: "High Stream Power Index; potential unconsolidated sediment transport",
      status: "DEBRIS_WARNING",
      riskLevel: "EXTREME" as const,
      leadTime: "T-15 min",
      description: "Water velocity increases down steep gorge, carrying gravel and rocky debris toward main river channel.",
    },
    {
      stage: 4,
      title: "Main River Channel Surge Wave",
      location: "River Gauge WL-001 (Altitude 650m)",
      evidence: "Water level 3.80m; rate-of-rise +0.40 m/h",
      status: "CHANNEL_SURGE",
      riskLevel: "HIGH" as const,
      leadTime: "T-0 (Now)",
      description: "Peak hydrograph enters main river, elevating stage height rapidly toward warning threshold (4.50m).",
    },
    {
      stage: 5,
      title: "Downstream Floodplain Village Impact",
      location: "Sunderbans Nagar (Altitude 720m)",
      evidence: "3,400 residents in direct alluvial path; 1 bridge bottleneck",
      status: "IMPACT_IMMINENT",
      riskLevel: "EXTREME" as const,
      leadTime: "T+15 min",
      description: "Flood pulse threatens low-lying settlement and culvert access routes.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="cascade" />

        <main className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-[#3a506b] pb-4">
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                UPSTREAM → DOWNSTREAM CASCADE REASONING ENGINE
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Multi-Hazard Propagation from Mountain Ridge to Downstream Alluvial Floodplain
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Timeline Cascade Chain */}
          <div className="space-y-4">
            {cascadeStages.map((st, i) => (
              <div key={st.stage} className="relative">
                <div className="bg-[#1c2541] border border-[#3a506b] rounded-lg p-5 hover:border-cyan-500/50 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 font-bold flex items-center justify-center text-xs font-mono">
                        {st.stage}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-100">{st.title}</h3>
                        <div className="text-[11px] text-slate-400 font-mono">{st.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {st.leadTime}
                      </span>
                      <RiskBadge level={st.riskLevel} />
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-3">{st.description}</p>

                  <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-2">
                    <span className="text-slate-400">Observed Evidence:</span>
                    <span>{st.evidence}</span>
                  </div>
                </div>

                {i < cascadeStages.length - 1 && (
                  <div className="flex justify-center my-1 text-cyan-500">
                    <ArrowDown className="w-5 h-5 animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
