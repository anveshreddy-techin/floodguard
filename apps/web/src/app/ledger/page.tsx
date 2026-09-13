'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
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
  const { setPage, setMode } = useEnvironment();
  const [filterMode, setFilterMode] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setPage('ledger');
    setMode('DEMO');
  }, [setPage, setMode]);

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
    <div className="flex flex-col min-h-screen select-none bg-[#F0F4F8] text-slate-900">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="ledger" />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-6xl mx-auto space-y-5 pb-24 md:pb-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300 text-xs font-semibold">APPEND-ONLY IMMUTABLE STORE</span>
                <h1 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  PREDICTION MEMORY &amp; AUDIT LEDGER
                </h1>
              </div>
              <p className="text-sm text-slate-600 mt-1 font-sans">
                Cryptographic black-box record of every model prediction, what was known at that exact moment, and what happened later
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-sans text-emerald-800 bg-emerald-50 border border-emerald-300 px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                IMMUTABLE SNAPSHOTS SEALED
              </span>
            </div>
          </div>

          {/* Search & Mode Filter Bar with Floating Panel */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search location, disaster, or prediction hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 font-sans transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto font-sans text-xs">
              <span className="text-slate-600 text-xs font-bold">DATA MODE:</span>
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 shadow-inner">
                {['ALL', 'DEMO', 'HINDCAST'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition transform active:scale-95 ${
                      filterMode === mode
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stream of Sealed Prediction Cards */}
          <div className="space-y-4">
            {filtered.map((record) => (
              <div
                key={record.id}
                className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 transition-all duration-300 transform hover:-translate-y-0.5 space-y-4 relative overflow-hidden group hover:border-slate-300"
              >
                {/* Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3.5 gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-700 text-xs font-bold tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                        {record.id}
                      </span>
                      <h2 className="text-base font-bold font-sans text-slate-900 group-hover:text-blue-700 transition">
                        {record.where}
                      </h2>
                    </div>
                    <div className="text-xs text-slate-500 font-sans flex items-center gap-2 mt-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{record.when}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <RiskBadge level={record.riskLevel} />
                    <UncertaintyBadge level={record.uncertainty} />
                    <DataModeBadge mode={record.dataMode} />
                  </div>
                </div>

                {/* Middle Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                    <div className="text-slate-600 text-xs uppercase font-bold flex items-center justify-between">
                      <span>MODEL CONFIGURATION</span>
                      <span className="text-blue-700 font-mono font-bold">SCORE: {record.riskScore}/100</span>
                    </div>
                    <div className="text-slate-900 font-bold text-xs font-mono">{record.modelVersion}</div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs text-slate-700 font-sans">
                      {record.contributors.map((c, i) => (
                        <div key={i} className="bg-white border border-slate-200 px-2.5 py-1 rounded shadow-xs">
                          <span className="text-slate-500">{c.name}:</span> <span className="text-blue-700 font-mono font-bold">{c.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                    <div className="text-emerald-800 text-xs uppercase font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WHAT HAPPENED LATER (OUTCOME VERIFICATION)</span>
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed font-sans font-medium">
                      {record.whatHappenedLater}
                    </p>
                    <div className="text-xs text-blue-700 font-sans font-semibold pt-1">
                      Lead Time Advantage: <span className="font-mono font-bold">{record.leadTime}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-slate-200 text-xs font-sans gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Fingerprint className="w-3.5 h-3.5 text-purple-600" />
                    <span>Cryptographic Digest: <span className="text-purple-800 font-mono font-bold">{record.hash}</span></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/flight-recorder"
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 font-bold flex items-center gap-1.5 transition text-xs font-sans shadow-sm"
                    >
                      <span>BLACK-BOX TRACE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/hindcast"
                      className="btn-primary px-3 py-1.5 rounded-xl text-white font-bold flex items-center gap-1.5 transition text-xs font-sans shadow-sm"
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
