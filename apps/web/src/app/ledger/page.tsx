'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { 
  Database, 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock, 
  Layers, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  FileCode, 
  ArrowRight,
  Fingerprint,
  Zap
} from 'lucide-react';
import { RiskBadge, UncertaintyBadge, DataModeBadge } from '@/components/ui/Badges';

export default function PredictionLedgerPage() {
  const [filterMode, setFilterMode] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSnapshot, setSelectedSnapshot] = useState<any | null>(null);

  const ledgerRecords = [
    {
      id: 'pred-sunderbans-001',
      when: '2026-08-28 13:45:00 UTC',
      where: 'Sunderbans Nagar (Alluvial Fan Base)',
      locationId: 'demo-village-003',
      riskLevel: 'HIGH' as const,
      riskScore: 68.5,
      uncertainty: 'MEDIUM' as const,
      modelVersion: 'rule_based_baseline_v9.2',
      dataMode: 'DEMO' as const,
      whatHappenedLater: 'Hydrograph peaked at 4.2m (+0.4m above warning level) 42 min later.',
      outcomeVerified: true,
      evidenceCount: 4,
      hash: 'sha256:4a8c9b...1f2d',
      leadTime: '42 min verified advantage',
      contributors: [
        { name: '3h Rainfall', val: '48.0 mm', weight: '35%' },
        { name: 'Soil Saturation', val: '82%', weight: '25%' },
        { name: 'Catchment Slope', val: '28°', weight: '20%' },
        { name: 'River Surge', val: '+0.40m/h', weight: '15%' },
      ],
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
      hash: 'sha256:7b1e4c...9a0e',
      leadTime: '10 min acoustic warning',
      contributors: [
        { name: 'Rock-Ice Avalanche Volume', val: '27M m³', weight: '50%' },
        { name: 'Acoustic Tripwire Shock', val: '18.4 Hz', weight: '30%' },
        { name: 'Stage Wave Propagation', val: '4.8 m/s', weight: '20%' },
      ],
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
      hash: 'sha256:9c2d1a...4f8b',
      leadTime: '3.5 hours antecedent alert',
      contributors: [
        { name: 'Multi-Day Rainfall Sum', val: '325 mm', weight: '45%' },
        { name: 'Chorabari Lake Expansion', val: '400% Area', weight: '35%' },
        { name: 'Moraine Rim Saturation', val: '98%', weight: '20%' },
      ],
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
      hash: 'sha256:3d8a7c...2e1b',
      leadTime: '45 min flood pulse warning',
      contributors: [
        { name: 'Upstream Landslide Impoundment', val: 'Bhemathang Dam', weight: '40%' },
        { name: 'Rainfall Accumulation', val: '110 mm/24h', weight: '35%' },
        { name: 'Debris Concentration', val: '65% Solids', weight: '25%' },
      ],
    },
  ];

  const filtered = ledgerRecords.filter((r) => {
    if (filterMode !== 'ALL' && r.dataMode !== filterMode) return false;
    if (searchQuery && !r.where.toLowerCase().includes(searchQuery.toLowerCase()) && !r.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#040814] text-slate-100 select-none">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="ledger" />

        <main className="flex-1 p-6 max-w-6xl mx-auto space-y-6">
          {/* Header with Glowing Text Gradient */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#223354] pb-5 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-xl bg-cyan-950/80 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                  APPEND-ONLY IMMUTABLE STORE
                </span>
                <h1 className="text-2xl font-black tracking-tight text-gradient-cyan flex items-center gap-2.5">
                  <Database className="w-6 h-6 text-cyan-400 animate-pulse" />
                  PREDICTION MEMORY & AUDIT LEDGER
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 font-sans">
                Cryptographic black-box record of every model prediction, what was known at that exact moment, and what happened later
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-700/80 px-3.5 py-1.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                IMMUTABLE SNAPSHOTS SEALED
              </span>
            </div>
          </div>

          {/* Search & Mode Filter Bar with Glassmorphism */}
          <div className="glass-panel-glow rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search location, disaster, or prediction hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl text-xs text-slate-200 placeholder-slate-500 font-mono transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto font-mono text-xs">
              <span className="text-slate-400 text-[11px] font-bold">DATA MODE:</span>
              <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
                {['ALL', 'DEMO', 'HINDCAST'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition transform active:scale-95 ${
                      filterMode === mode
                        ? 'btn-glow-cyan text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stream of Sealed Prediction Cards with Dynamic Glassmorphism Hover Effects */}
          <div className="space-y-4">
            {filtered.map((record) => (
              <div
                key={record.id}
                className="glass-panel rounded-3xl p-6 border border-cyan-500/20 hover:border-cyan-400/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-300 transform hover:-translate-y-1 space-y-4 relative overflow-hidden group"
              >
                {/* Top Row: IDs, Badges, and Timestamps */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3.5 gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 text-xs font-black tracking-wider bg-slate-900/90 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
                        {record.id}
                      </span>
                      <h2 className="text-base font-black text-slate-100 group-hover:text-cyan-300 transition">
                        {record.where}
                      </h2>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{record.when}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <RiskBadge level={record.riskLevel} />
                    <UncertaintyBadge level={record.uncertainty} />
                    <DataModeBadge mode={record.dataMode} />
                  </div>
                </div>

                {/* Middle Row: Model Config & Outcome Verification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-[#070d1e]/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-between">
                      <span>MODEL CONFIGURATION</span>
                      <span className="text-cyan-400">SCORE: {record.riskScore}/100</span>
                    </div>
                    <div className="text-slate-200 font-bold text-xs">{record.modelVersion}</div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] text-slate-300">
                      {record.contributors.map((c, i) => (
                        <div key={i} className="bg-slate-900 px-2 py-1 rounded border border-slate-800">
                          <span className="text-slate-400">{c.name}:</span> <span className="text-cyan-300 font-bold">{c.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#070d1e]/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="text-emerald-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WHAT HAPPENED LATER (OUTCOME VERIFICATION)</span>
                    </div>
                    <p className="text-slate-200 text-xs leading-relaxed font-sans font-medium">
                      {record.whatHappenedLater}
                    </p>
                    <div className="text-[10px] text-cyan-300 font-mono font-bold pt-1">
                      Lead Time Advantage: {record.leadTime}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Cryptographic Digest & Inspection Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono gap-3">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                    <span>Cryptographic Digest: <span className="text-purple-300 font-bold">{record.hash}</span></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/flight-recorder"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold flex items-center gap-1.5 transition text-[11px]"
                    >
                      <span>BLACK-BOX TRACE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/hindcast"
                      className="btn-glow-cyan px-3 py-1.5 rounded-xl text-white font-bold flex items-center gap-1.5 transition text-[11px]"
                    >
                      <span>REPLAY HINDSIGHT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
