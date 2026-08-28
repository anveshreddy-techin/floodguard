'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { Database, Search, Filter, ShieldCheck, Clock, Layers, ArrowUpRight } from 'lucide-react';
import { RiskBadge, UncertaintyBadge, DataModeBadge } from '@/components/ui/Badges';

export default function PredictionLedgerPage() {
  const [filterMode, setFilterMode] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const ledgerRecords = [
    {
      id: 'pred-sunderbans-001',
      when: '2026-08-28 13:45:00 UTC',
      where: 'Sunderbans Nagar (Alluvial Fan Base)',
      locationId: 'demo-village-003',
      riskLevel: 'HIGH' as const,
      riskScore: 68.5,
      uncertainty: 'MEDIUM' as const,
      modelVersion: 'rule_based_baseline_v1',
      dataMode: 'DEMO' as const,
      whatHappenedLater: 'Hydrograph peaked at 4.2m (+0.4m above warning level) 42 min later.',
      outcomeVerified: true,
      evidenceCount: 4,
    },
    {
      id: 'pred-chamoli-retro-01',
      when: '2021-02-07 05:05:00 UTC (Retrospective)',
      where: 'Tapovan Vishnugad Hydropower Barrage',
      locationId: 'chamoli-tapovan',
      riskLevel: 'EXTREME' as const,
      riskScore: 95.0,
      uncertainty: 'HIGH' as const,
      modelVersion: 'retrospective_hindcast_v1',
      dataMode: 'HINDCAST' as const,
      whatHappenedLater: 'Catastrophic rock-ice surge arrived at Tapovan barrage at ~05:15 UTC.',
      outcomeVerified: true,
      evidenceCount: 3,
    },
    {
      id: 'pred-kedarnath-retro-01',
      when: '2013-06-16 12:00:00 UTC (Retrospective)',
      where: 'Kedarnath Township / Rambara Corridor',
      locationId: 'kedarnath-town',
      riskLevel: 'EXTREME' as const,
      riskScore: 88.0,
      uncertainty: 'LOW' as const,
      modelVersion: 'retrospective_hindcast_v1',
      dataMode: 'HINDCAST' as const,
      whatHappenedLater: 'Chorabari moraine breach occurred early morning June 17, 2013.',
      outcomeVerified: true,
      evidenceCount: 5,
    },
    {
      id: 'pred-melamchi-retro-01',
      when: '2021-06-15 14:30:00 UTC (Retrospective)',
      where: 'Melamchi Bazaar & Headworks',
      locationId: 'melamchi-bazaar',
      riskLevel: 'HIGH' as const,
      riskScore: 74.0,
      uncertainty: 'MEDIUM' as const,
      modelVersion: 'retrospective_hindcast_v1',
      dataMode: 'HINDCAST' as const,
      whatHappenedLater: 'Bhemathang landslide dam burst sending pulses downstream burying intake.',
      outcomeVerified: true,
      evidenceCount: 4,
    },
  ];

  const filtered = ledgerRecords.filter((r) => {
    if (filterMode !== 'ALL' && r.dataMode !== filterMode) return false;
    if (searchQuery && !r.where.toLowerCase().includes(searchQuery.toLowerCase()) && !r.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="ledger" />

        <main className="flex-1 p-6 max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#3a506b] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">
                  APPEND-ONLY LEDGER
                </span>
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  PREDICTION MEMORY & AUDIT LEDGER
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Permanent memory of every model prediction, what was known at that moment, and what happened later
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1.5 rounded">
              IMMUTABLE SNAPSHOTS
            </span>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-[#1c2541] border border-[#3a506b] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search location or prediction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono text-[11px]">DATA MODE:</span>
              {['ALL', 'DEMO', 'HINDCAST'].map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterMode(m)}
                  className={`px-3 py-1.5 rounded font-mono text-[11px] transition ${
                    filterMode === m ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Chronological Prediction Cards */}
          <div className="space-y-4">
            {filtered.map((item) => (
              <div key={item.id} className="bg-[#1c2541] border border-[#3a506b] rounded-xl p-5 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700 pb-3 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-cyan-400 text-xs font-bold bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                      {item.id}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm">{item.where}</h3>
                      <div className="text-[11px] text-slate-400 font-mono">{item.when}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiskBadge level={item.riskLevel} />
                    <UncertaintyBadge level={item.uncertainty} />
                    <DataModeBadge mode={item.dataMode} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-[10px] uppercase font-mono">Model Configuration</div>
                    <div className="font-bold text-slate-200 font-mono">{item.modelVersion}</div>
                    <div className="text-[11px] text-slate-400">Score: {item.riskScore}/100</div>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded border border-slate-800 space-y-1 md:col-span-2">
                    <div className="text-emerald-400 text-[10px] uppercase font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> What Happened Later (Outcome Verification)
                    </div>
                    <div className="text-slate-200 text-xs leading-relaxed">{item.whatHappenedLater}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
