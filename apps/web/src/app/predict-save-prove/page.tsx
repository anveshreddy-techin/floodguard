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
    <div className="flex flex-col h-screen overflow-hidden select-none bg-[#F0F4F8] text-slate-900 font-sans">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="predict-save-prove" />

        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 pb-24 md:pb-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">CORE ARCHITECTURE</span>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 font-sans">
                  <Award className="w-6 h-6 text-amber-600" />
                  PREDICT · SAVE · PROVE
                </h1>
              </div>
              <p className="text-slate-600 text-sm mt-1 font-sans">
                The three-stage operational lifecycle ensuring scientific defensibility, cryptographic immutability, and empirical retrospective proof.
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* 3 Step Interactive Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('PREDICT')}
              className={`p-6 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between shadow-sm ${
                activeTab === 'PREDICT'
                  ? 'bg-white border-2 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-4 font-bold text-lg font-sans shadow-2xs">
                  1
                </div>
                <div className="text-xs font-bold text-blue-700 uppercase tracking-wider font-sans">STAGE 1</div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5 font-sans">PREDICT</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-sans">
                  Transparent, multi-source physics-guided risk scoring with explicit telemetry provenance and uncertainty bounds.
                </p>
              </div>
              <div className="text-xs font-mono text-blue-700 font-bold mt-4 pt-3 border-t border-slate-100">
                Risk: 68.5/100 (HIGH)
              </div>
            </button>

            <button
              onClick={() => setActiveTab('SAVE')}
              className={`p-6 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between shadow-sm ${
                activeTab === 'SAVE'
                  ? 'bg-white border-2 border-purple-600 shadow-md ring-2 ring-purple-500/20'
                  : 'bg-white hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 mb-4 font-bold text-lg font-sans shadow-2xs">
                  2
                </div>
                <div className="text-xs font-bold text-purple-700 uppercase tracking-wider font-sans">STAGE 2</div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5 font-sans">SAVE</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-sans">
                  Every prediction, feature vector, and raw telemetry frame is sealed in an append-only cryptographic ledger.
                </p>
              </div>
              <div className="text-xs font-mono text-purple-700 font-bold mt-4 pt-3 border-t border-slate-100">
                SHA-256 Digest Sealed
              </div>
            </button>

            <button
              onClick={() => setActiveTab('PROVE')}
              className={`p-6 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between shadow-sm ${
                activeTab === 'PROVE'
                  ? 'bg-white border-2 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4 font-bold text-lg font-sans shadow-2xs">
                  3
                </div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-sans">STAGE 3</div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5 font-sans">PROVE</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-sans">
                  Continuous validation against post-event reality and retrospective replay across 5 historical Himalayan disasters.
                </p>
              </div>
              <div className="text-xs font-mono text-emerald-700 font-bold mt-4 pt-3 border-t border-slate-100">
                100% LOOCV Audited
              </div>
            </button>
          </div>

          {/* Deep Stage Explainer Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            {activeTab === 'PREDICT' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-sans">
                    Stage 1: Explainable Multi-Source Hydrological Inference
                  </span>
                  <RiskBadge level="HIGH" />
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-sans">
                  Unlike black-box AI models that generate unsubstantiated probabilities, FloodGuard computes transparent physics heuristics combining rainfall accumulation, soil saturation index, mean DEM slope angle, and river stage rates-of-rise with full provenance attribution.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl shadow-2xs">
                    <div className="text-slate-500 text-xs font-medium font-sans">Rainfall (35%)</div>
                    <div className="text-blue-700 font-bold text-base font-mono mt-0.5">48.0 mm</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl shadow-2xs">
                    <div className="text-slate-500 text-xs font-medium font-sans">Soil Sat (25%)</div>
                    <div className="text-amber-800 font-bold text-base font-mono mt-0.5">82%</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl shadow-2xs">
                    <div className="text-slate-500 text-xs font-medium font-sans">Slope (20%)</div>
                    <div className="text-indigo-700 font-bold text-base font-mono mt-0.5">28°</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl shadow-2xs">
                    <div className="text-slate-500 text-xs font-medium font-sans">River Surge (15%)</div>
                    <div className="text-emerald-700 font-bold text-base font-mono mt-0.5">+0.40m/h</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'SAVE' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider font-sans">
                    Stage 2: Cryptographic Prediction Memory & Audit Ledger
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-50 text-purple-800 border border-purple-200">SEALED</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-sans">
                  To eliminate post-hoc manipulation and prevent hindsight leakage, every generated prediction creates an immutable <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-slate-800">KnowledgeSnapshot</code> containing exact contemporaneous observations and a SHA-256 tamper-evident digest.
                </p>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2.5 text-xs font-sans">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Ledger Entry ID:</span>
                    <span className="text-blue-700 font-mono font-bold">pred-sunderbans-001</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Cryptographic Digest:</span>
                    <span className="text-purple-700 font-mono font-bold">sha256:4a8c9b7e1f2d48...</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Available At Timestamp:</span>
                    <span className="text-slate-800 font-mono font-semibold">2026-08-28 13:45:00 UTC</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'PROVE' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-sans">
                    Stage 3: Empirical Ground-Truth Validation & Hindcast Replay
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">100% AUDITED</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-sans">
                  FloodGuard AI is validated against 5 verified historical disaster datasets (2013 Kedarnath, 2021 Chamoli, 2021 Melamchi, 2023 Nepal, 2026 Rasuwa). During replay, future data is locked out to demonstrate an advance warning lead-time of 15–45 minutes before downstream impact.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs pt-2">
                  <Link
                    href="/hindcast"
                    className="p-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-center font-bold font-sans text-white flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>OPEN HISTORICAL HINDSIGHT LAB</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/benchmark"
                    className="p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-center font-bold font-sans text-slate-700 flex items-center justify-center gap-2 shadow-sm transition-all hover:text-blue-700"
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
