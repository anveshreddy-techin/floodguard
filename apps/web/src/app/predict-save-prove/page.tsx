'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
import { ShieldCheck, Database, History, ArrowRight, CheckCircle2, Award, Zap, Layers, Sparkles, Fingerprint } from 'lucide-react';
import { RiskBadge, UncertaintyBadge, DataModeBadge } from '@/components/ui/Badges';

export default function PredictSaveProvePage() {
  const { setPage, setMode } = useEnvironment();
  const [activeTab, setActiveTab] = useState<'PREDICT' | 'SAVE' | 'PROVE'>('PREDICT');

  useEffect(() => {
    setPage('predict-save-prove');
    setMode('DEMO');
  }, [setPage, setMode]);

  return (
    <div className="flex flex-col min-h-screen select-none">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="predict-save-prove" />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-5xl mx-auto space-y-5 pb-24 md:pb-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="chip chip-demo">FLAGSHIP DIFFERENTIATOR</span>
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  PREDICT · SAVE · PROVE
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                The three-stage operational cycle that guarantees scientific defensibility, immutability, and empirical proof
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* 3 Step Interactive Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('PREDICT')}
              className={`p-6 rounded-3xl text-left transition-all duration-300 transform active:scale-95 flex flex-col justify-between ${
                activeTab === 'PREDICT'
                  ? 'fp-operational ring-2 ring-cyan-400 text-white shadow-2xl'
                  : 'fp text-slate-300 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center text-cyan-300 mb-4 font-mono font-black text-lg shadow-md">
                  1
                </div>
                <div className="font-mono text-cyan-400 text-xs font-black uppercase tracking-wider">STAGE 1</div>
                <h3 className="text-lg font-black text-white mt-0.5">PREDICT</h3>
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
              className={`p-6 rounded-3xl text-left transition-all duration-300 transform active:scale-95 flex flex-col justify-between ${
                activeTab === 'SAVE'
                  ? 'fp-historical ring-2 ring-purple-400 text-white shadow-2xl'
                  : 'fp text-slate-300 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/60 flex items-center justify-center text-purple-300 mb-4 font-mono font-black text-lg shadow-md">
                  2
                </div>
                <div className="font-mono text-purple-400 text-xs font-black uppercase tracking-wider">STAGE 2</div>
                <h3 className="text-lg font-black text-white mt-0.5">SAVE</h3>
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
              className={`p-6 rounded-3xl text-left transition-all duration-300 transform active:scale-95 flex flex-col justify-between ${
                activeTab === 'PROVE'
                  ? 'fp-operational ring-2 ring-emerald-400 text-white shadow-2xl'
                  : 'fp text-slate-300 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-300 mb-4 font-mono font-black text-lg shadow-md">
                  3
                </div>
                <div className="font-mono text-emerald-400 text-xs font-black uppercase tracking-wider">STAGE 3</div>
                <h3 className="text-lg font-black text-white mt-0.5">PROVE</h3>
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
          <div className="fp fp-operational rounded-3xl p-8 shadow-2xl space-y-6">
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
                  <div className="fp p-3 rounded-2xl">
                    <div className="text-slate-400 text-[10px]">Rainfall (35%)</div>
                    <div className="text-cyan-300 font-bold text-sm mt-0.5">48.0 mm</div>
                  </div>
                  <div className="fp p-3 rounded-2xl">
                    <div className="text-slate-400 text-[10px]">Soil Sat (25%)</div>
                    <div className="text-amber-300 font-bold text-sm mt-0.5">82%</div>
                  </div>
                  <div className="fp p-3 rounded-2xl">
                    <div className="text-slate-400 text-[10px]">Slope (20%)</div>
                    <div className="text-blue-300 font-bold text-sm mt-0.5">28°</div>
                  </div>
                  <div className="fp p-3 rounded-2xl">
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
                  <span className="chip chip-hist">SEALED</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans text-sm">
                  To eliminate post-hoc manipulation and prevent hindsight bias, every generated prediction creates an immutable <span className="font-mono text-cyan-300">KnowledgeSnapshot</span> containing the exact contemporaneous observations and a cryptographic SHA-256 digest.
                </p>
                <div className="fp p-4 rounded-2xl space-y-2 text-xs font-mono">
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
                  <span className="chip chip-live">100% AUDITED</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans text-sm">
                  FloodGuard AI is validated against 5 verified historical disaster datasets (2013 Kedarnath, 2021 Chamoli, 2021 Melamchi, 2023 Nepal, 2026 Rasuwa). During replay, future data is locked out to prove the model gives 15–45 minutes of advance warning.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <Link
                    href="/hindcast"
                    className="btn-primary p-4 rounded-2xl text-center font-bold font-mono text-white flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>OPEN HISTORICAL HINDSIGHT LAB</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/benchmark"
                    className="fp p-4 rounded-2xl text-center font-bold font-mono text-cyan-300 flex items-center justify-center gap-2 transition hover:border-cyan-400"
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
