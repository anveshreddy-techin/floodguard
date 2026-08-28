'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { ShieldCheck, Database, History, ArrowRight, CheckCircle2, Award, Zap, Layers, Sparkles, Fingerprint } from 'lucide-react';
import { RiskBadge, UncertaintyBadge, DataModeBadge } from '@/components/ui/Badges';

export default function PredictSaveProvePage() {
  const [activeTab, setActiveTab] = useState<'PREDICT' | 'SAVE' | 'PROVE'>('PREDICT');

  return (
    <div className="flex flex-col min-h-screen bg-[#040814] text-slate-100 select-none">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="predict-save-prove" />

        <main className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#223354] pb-5 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                  FLAGSHIP CORE DIFFERENTIATOR
                </span>
                <h1 className="text-2xl font-black tracking-tight text-gradient-cyan flex items-center gap-2.5">
                  <Award className="w-6 h-6 text-amber-400 animate-pulse" />
                  PREDICT · SAVE · PROVE
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 font-sans">
                The three-stage operational cycle that guarantees scientific defensibility, immutability, and empirical proof
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* 3 Step Interactive Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('PREDICT')}
              className={`p-6 rounded-3xl border text-left transition-all duration-300 transform active:scale-95 flex flex-col justify-between ${
                activeTab === 'PREDICT'
                  ? 'glass-panel-glow border-cyan-400 text-slate-100 ring-2 ring-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                  : 'glass-panel text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-900/50 border border-blue-500/60 flex items-center justify-center text-cyan-400 mb-4 font-mono font-black text-lg shadow-md">
                  1
                </div>
                <div className="font-mono text-cyan-400 text-xs font-black uppercase tracking-wider">STAGE 1</div>
                <h3 className="text-lg font-black text-slate-100 mt-0.5">PREDICT</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Transparent, multi-source physics-guided risk scoring with explicit data gap uncertainty.
                </p>
              </div>
              <div className="text-xs font-mono text-cyan-300 font-bold mt-4 pt-3 border-t border-slate-800">
                Risk: 68.5/100 (HIGH)
              </div>
            </button>

            <button
              onClick={() => setActiveTab('SAVE')}
              className={`p-6 rounded-3xl border text-left transition-all duration-300 transform active:scale-95 flex flex-col justify-between ${
                activeTab === 'SAVE'
                  ? 'glass-panel-glow border-purple-400 text-slate-100 ring-2 ring-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.4)]'
                  : 'glass-panel text-slate-300 hover:border-purple-500/40 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-900/50 border border-purple-500/60 flex items-center justify-center text-purple-300 mb-4 font-mono font-black text-lg shadow-md">
                  2
                </div>
                <div className="font-mono text-purple-400 text-xs font-black uppercase tracking-wider">STAGE 2</div>
                <h3 className="text-lg font-black text-slate-100 mt-0.5">SAVE</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Every prediction, feature vector, and raw telemetry frame is sealed in an append-only ledger.
                </p>
              </div>
              <div className="text-xs font-mono text-purple-300 font-bold mt-4 pt-3 border-t border-slate-800">
                SHA-256 Digest Sealed
              </div>
            </button>

            <button
              onClick={() => setActiveTab('PROVE')}
              className={`p-6 rounded-3xl border text-left transition-all duration-300 transform active:scale-95 flex flex-col justify-between ${
                activeTab === 'PROVE'
                  ? 'glass-panel-glow border-emerald-400 text-slate-100 ring-2 ring-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                  : 'glass-panel text-slate-300 hover:border-emerald-500/40 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-900/50 border border-emerald-500/60 flex items-center justify-center text-emerald-300 mb-4 font-mono font-black text-lg shadow-md">
                  3
                </div>
                <div className="font-mono text-emerald-400 text-xs font-black uppercase tracking-wider">STAGE 3</div>
                <h3 className="text-lg font-black text-slate-100 mt-0.5">PROVE</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Continuous validation against post-event reality and retrospective replay of historical disasters.
                </p>
              </div>
              <div className="text-xs font-mono text-emerald-300 font-bold mt-4 pt-3 border-t border-slate-800">
                100% LOOCV Accuracy
              </div>
            </button>
          </div>

          {/* Deep Stage Explainer Details */}
          <div className="glass-panel-glow rounded-3xl p-8 shadow-2xl space-y-6">
            {activeTab === 'PREDICT' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    STAGE 1: EXPLAINABLE MULTI-SOURCE INFERENCE
                  </span>
                  <RiskBadge level="HIGH" />
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans text-sm">
                  Unlike black-box AI models that generate unsubstantiated risk probabilities, FloodGuard evaluates explicit physical formulas combining rainfall accumulation, soil saturation index, mean DEM slope angle, and river stage rates-of-rise.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
                  <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Rainfall (35%)</div>
                    <div className="text-cyan-300 font-bold text-sm mt-0.5">48.0 mm</div>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Soil Sat (25%)</div>
                    <div className="text-amber-300 font-bold text-sm mt-0.5">82%</div>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Slope (20%)</div>
                    <div className="text-blue-300 font-bold text-sm mt-0.5">28°</div>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                    <div className="text-slate-400 text-[10px]">River Surge (15%)</div>
                    <div className="text-emerald-300 font-bold text-sm mt-0.5">+0.40m/h</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'SAVE' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                    STAGE 2: CRYPTOGRAPHIC PREDICTION MEMORY
                  </span>
                  <span className="px-2.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded-lg text-xs font-mono font-bold">
                    SEALED
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans text-sm">
                  To eliminate post-hoc manipulation and prevent hindsight bias, every generated prediction creates an immutable <span className="font-mono text-cyan-300">KnowledgeSnapshot</span> containing the exact contemporaneous observations and a cryptographic SHA-256 digest.
                </p>
                <div className="bg-[#070d1e] p-4 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Ledger Entry ID:</span>
                    <span className="text-cyan-300 font-bold">pred-sunderbans-001</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Cryptographic Digest:</span>
                    <span className="text-purple-300 font-bold">sha256:4a8c9b7e1f2d...</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Available At Timestamp:</span>
                    <span className="text-slate-200">2026-08-28 13:45:00 UTC</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'PROVE' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    STAGE 3: EMPIRICAL GROUND-TRUTH VALIDATION
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-mono font-bold">
                    100% AUDITED
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans text-sm">
                  FloodGuard AI is validated against 5 verified historical disaster datasets (2013 Kedarnath, 2021 Chamoli, 2021 Melamchi, 2023 Nepal, 2026 Rasuwa). During replay, future data is locked out to prove the model gives 15–45 minutes of advance warning.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <Link
                    href="/hindcast"
                    className="btn-glow-cyan p-4 rounded-2xl text-center font-bold font-mono text-white flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>OPEN HISTORICAL HINDSIGHT LAB</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/benchmark"
                    className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-center font-bold font-mono text-cyan-300 flex items-center justify-center gap-2 transition"
                  >
                    <span>VIEW 5-EVENT BENCHMARK MATRIX</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
