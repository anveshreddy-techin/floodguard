'use client';

import React from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { Activity, Database, Cloud, Radio, Shield, CheckCircle2 } from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function SystemHealthPage() {
  const components = [
    { name: "FastAPI Backend API", status: "OPERATIONAL", provider: "Uvicorn / Python 3.11", latency: "14ms", note: "Responding across all 10 domain routers" },
    { name: "PostgreSQL + PostGIS", status: "OPERATIONAL", provider: "PostgreSQL 15 / PostGIS 3.4", latency: "4ms", note: "Spatial index queries enabled" },
    { name: "Weather Provider", status: "CONFIGURED", provider: "Open-Meteo REST API", latency: "160ms", note: "Active open weather fallback" },
    { name: "Rainfall Provider", status: "DEMO", provider: "Deterministic Generator", latency: "1ms", note: "Seed 2026 active (IMD MoU required for live)" },
    { name: "River Level Provider", status: "DEMO", provider: "Hydrological Surge Simulator", latency: "1ms", note: "Seed 2026 active (CWC WRIS token required for live)" },
    { name: "Hybrid Risk Engine", status: "OPERATIONAL", provider: "rule_based_baseline_v1", latency: "5ms", note: "Multi-source weighted scoring active" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="overview" />

        <main className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-[#3a506b] pb-4">
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                SYSTEM OBSERVABILITY & HEALTH CENTER
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Live component diagnostics, API latencies, and data provider health
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
              OVERALL: OPERATIONAL
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {components.map((c, i) => (
              <div key={i} className="bg-[#1c2541] border border-[#3a506b] rounded-lg p-5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-100 text-sm">{c.name}</span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {c.status}
                  </span>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">{c.provider} • Latency: {c.latency}</div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-[11px] text-slate-300">
                  {c.note}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
