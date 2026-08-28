'use client';

import React from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { Activity, Battery, Radio, ShieldCheck, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function SensorsPage() {
  const devices = [
    { id: "demo-aws-001", name: "AWS Upper Ridge Catchment", type: "Rainfall & Barometric", elevation: "1,450m", status: "ONLINE", battery: 87, sequence: 1042, lastSeen: "2 min ago" },
    { id: "demo-aws-002", name: "AWS Mid-Slope Station", type: "Rainfall & Temperature", elevation: "1,050m", status: "ONLINE", battery: 72, sequence: 981, lastSeen: "3 min ago" },
    { id: "demo-wl-001", name: "River Gauge Radar Station", type: "Water Level & Stage", elevation: "650m", status: "ONLINE", battery: 95, sequence: 2411, lastSeen: "1 min ago" },
    { id: "demo-sm-001", name: "Soil Moisture Probe Alpha", type: "Volumetric Water Content", elevation: "1,300m", status: "STALE", battery: 31, sequence: 402, lastSeen: "48 min ago" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="sensors" />

        <main className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-[#3a506b] pb-4">
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                IoT & SENSOR TELEMETRY HEALTH CENTER
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time edge station telemetry, HMAC replay security validation, and battery status
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
              3 ONLINE / 1 STALE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {devices.map((d) => (
              <div key={d.id} className="bg-[#1c2541] border border-[#3a506b] rounded-lg p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">{d.id}</span>
                    <h3 className="text-sm font-bold text-slate-100">{d.name}</h3>
                    <div className="text-xs text-slate-400">{d.type} • {d.elevation}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                    d.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {d.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/80 text-xs font-mono">
                  <div className="bg-slate-900 p-2 rounded text-center">
                    <div className="text-slate-400 text-[10px]">Battery</div>
                    <div className={`font-bold ${d.battery < 40 ? 'text-amber-400' : 'text-emerald-400'}`}>{d.battery}%</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded text-center">
                    <div className="text-slate-400 text-[10px]">Sequence</div>
                    <div className="font-bold text-slate-200">#{d.sequence}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded text-center">
                    <div className="text-slate-400 text-[10px]">Last Seen</div>
                    <div className="font-bold text-slate-300">{d.lastSeen}</div>
                  </div>
                </div>

                {d.status === 'STALE' && (
                  <div className="bg-amber-950/40 p-2 rounded border border-amber-800 text-[11px] text-amber-300 flex items-center gap-1.5">
                    <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                    <span>Low battery causes sequence lag. Risk engine escalated uncertainty for this probe.</span>
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
