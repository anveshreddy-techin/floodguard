'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { ShieldCheck, Database, History, ArrowRight, CheckCircle2, Award, Zap, Layers } from 'lucide-react';
import { RiskBadge, UncertaintyBadge, DataModeBadge } from '@/components/ui/Badges';

export default function PredictSaveProvePage() {
  const [activeTab, setActiveTab] = useState<'PREDICT' | 'SAVE' | 'PROVE'>('PREDICT');

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="predict-save-prove" />

        <main className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#3a506b] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold">
                  FLAGSHIP DIFFERENTIATOR
                </span>
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  PREDICT · SAVE · PROVE
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                The three-stage operational cycle that guarantees scientific defensibility, immutability, and empirical proof
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* 3 Step Interactive Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setActiveTab('PREDICT')}
              className={`p-5 rounded-xl border text-left transition flex flex-col justify-between ${
                activeTab === 'PREDICT'
                  ? 'bg-blue-600/30 border-cyan-400 text-slate-100 ring-1 ring-cyan-500 shadow-xl'
                  : 'bg-[#1c2541] border-[#3a506b] text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-900/60 border border-blue-600 flex items-center justify-center text-cyan-400 mb-3 font-mono font-bold">
                  1
                </div>
                <div className="font-mono text-cyan-400 text-xs font-bold uppercase tracking-wider">STAGE 1</div>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">PREDICT</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Transparent, multi-source physics-guided risk scoring with explicit data gap uncertainty.
                </p>
              </div>
              <div className="text-[11px] font-mono text-cyan-300 font-bold mt-4">Risk: 68.5/100 (HIGH)</div>
            </button>

            <button
              onClick={() => setActiveTab('SAVE')}
              className={`p-5 rounded-xl border text-left transition flex flex-col justify-between ${
                activeTab === 'SAVE'
                  ? 'bg-purple-600/30 border-purple-400 text-slate-100 ring-1 ring-purple-500 shadow-xl'
                  : 'bg-[#1c2541] border-[#3a506b] text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-purple-900/60 border border-purple-600 flex items-center justify-center text-purple-400 mb-3 font-mono font-bold">
                  2
                </div>
                <div className="font-mono text-purple-400 text-xs font-bold uppercase tracking-wider">STAGE 2</div>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">SAVE</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Append-only immutable prediction snapshot storing exact knowledge state at prediction time.
                </p>
              </div>
              <div className="text-[11px] font-mono text-purple-300 font-bold mt-4">Snapshot: ks-7f82b1</div>
            </button>

            <button
              onClick={() => setActiveTab('PROVE')}
              className={`p-5 rounded-xl border text-left transition flex flex-col justify-between ${
                activeTab === 'PROVE'
                  ? 'bg-emerald-600/30 border-emerald-400 text-slate-100 ring-1 ring-emerald-500 shadow-xl'
                  : 'bg-[#1c2541] border-[#3a506b] text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-900/60 border border-emerald-600 flex items-center justify-center text-emerald-400 mb-3 font-mono font-bold">
                  3
                </div>
                <div className="font-mono text-emerald-400 text-xs font-bold uppercase tracking-wider">STAGE 3</div>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">PROVE</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Retrospective evaluation against verified historical disasters with strict hindsight lock.
                </p>
              </div>
              <div className="text-[11px] font-mono text-emerald-300 font-bold mt-4">5 Disasters Benchmarked</div>
            </button>
          </div>

          {/* Deep Exploration Box */}
          <div className="bg-[#1c2541] border border-[#3a506b] rounded-xl p-6 space-y-4 shadow-2xl">
            {activeTab === 'PREDICT' && (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    PREDICT: Transparent Multi-Source Risk Engine
                  </h3>
                  <RiskBadge level="HIGH" />
                </div>
                <p className="text-slate-200 leading-relaxed text-xs">
                  FloodGuard estimates flash-flood hazard not by black-box hallucination, but by fusing 4 distinct empirical layers:
                  precipitation accumulation (35%), antecedent soil moisture (25%), catchment slope (20%), and river stage rate-of-rise (15%).
                </p>
                <div className="bg-slate-900/90 p-3 rounded border border-slate-800 text-cyan-300 font-mono text-[11px]">
                  Composite Score = 75×0.35 + 82×0.25 + 55×0.20 + 42×0.15 = 68.5 / 100 [HIGH]
                </div>
              </div>
            )}

            {activeTab === 'SAVE' && (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-400" />
                    SAVE: Knowledge Snapshot & Immutability Guarantee
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono text-[10px] font-bold">
                    APPEND ONLY
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed text-xs">
                  Every prediction generates an immutable <code className="text-cyan-400">KnowledgeSnapshot</code> recording exactly what telemetry, satellite passes, and weather forecasts were available at that microsecond. Later observations cannot retroactively alter past records.
                </p>
                <div className="bg-slate-900/90 p-3 rounded border border-slate-800 text-purple-300 font-mono text-[11px]">
                  Snapshot ID: ks-7f82b1 | Time: 2026-08-28 13:45:00 UTC | Model: rule_based_baseline_v1 | Status: SEALED
                </div>
              </div>
            )}

            {activeTab === 'PROVE' && (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <History className="w-4 h-4 text-emerald-400" />
                    PROVE: Historical Disaster Replay & Hindsight Lockout
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[10px] font-bold">
                    HINDSIGHT LOCKED
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed text-xs">
                  We prove algorithm reliability by replaying 5 verified Himalayan disasters (2013 Kedarnath, 2021 Chamoli, 2021 Melamchi, 2023 Nepal, 2026 Rasuwa). Under <code className="text-cyan-400">STRICT_REPLAY</code>, the engine is blind to post-event data and must detect the danger solely from contemporaneously available telemetry.
                </p>
                <div className="bg-slate-900/90 p-3 rounded border border-slate-800 text-emerald-300 font-mono text-[11px]">
                  Chamoli 2021 Lead Time: 15 min | Kedarnath 2013 Lead Time: 45 min | False Alarms: 0
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
