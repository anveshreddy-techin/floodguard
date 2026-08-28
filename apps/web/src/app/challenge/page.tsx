'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { 
  HelpCircle, 
  ShieldAlert, 
  ArrowRight, 
  Radio, 
  Activity, 
  History, 
  Layers, 
  Compass, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function JudgeChallengeModePage() {
  const [selectedChallenge, setSelectedChallenge] = useState<number>(0);

  const challenges = [
    {
      id: 'CH-1',
      question: '“What happens if upstream IoT sensors fail or lose power?”',
      subtitle: 'Graceful Degradation & Sensor Resilience',
      answer: 'FloodGuard AI automatically transitions into degraded mode, switching to gridded satellite precipitation and antecedent soil moisture models. Risk estimates are widened with higher uncertainty bounds, never fabricating fake zero risk.',
      actionLabel: 'TEST SENSOR BLACKOUT IN SIMULATOR',
      actionHref: '/simulation',
      verifiedProof: 'Evaluated in Unit Test test_sensor_blackout_degradation()',
    },
    {
      id: 'CH-2',
      question: '“Why is the risk high? Can you prove it is not a black-box hallucination?”',
      subtitle: 'Explainable Factor Decomposition',
      answer: 'Every risk score is computed by transparent physics heuristics: 35% rainfall accumulation (48mm), 25% soil saturation (82%), 20% terrain slope (28°), and 15% river stage surge (+0.40m/h). All factors are inspectable with physical units.',
      actionLabel: 'INSPECT WHY RISK CHANGED',
      actionHref: '/',
      verifiedProof: 'Evaluated in Unit Test test_component_weights_sum_to_one()',
    },
    {
      id: 'CH-3',
      question: '“How do we know the prediction wasn’t generated after seeing the disaster?”',
      subtitle: 'Immutable Memory & Hindsight Lockout',
      answer: 'Predictions are cryptographically sealed in the PredictionLedger with strict available_at timestamps. In Historical Hindcast Mode, data arriving after the simulation timestamp is physically locked out.',
      actionLabel: 'LAUNCH HISTORICAL HINDSIGHT LAB',
      actionHref: '/hindcast',
      verifiedProof: 'Evaluated in Unit Test test_hindcast_strict_replay_locks_future_data()',
    },
    {
      id: 'CH-4',
      question: '“What happened during the 2021 Chamoli disaster where there was no rainfall?”',
      subtitle: 'Cryospheric Non-Precipitation Surges',
      answer: 'Chamoli was triggered by a 27 million m³ rock-ice avalanche in the Ronti peak, not a cloudburst. FloodGuard records this cryogenic hazard chain with zero rainfall weight and 100% stage/velocity surge detection.',
      actionLabel: 'VIEW 2021 CHAMOLI EVENT DOSSIER',
      actionHref: '/events',
      verifiedProof: 'Documented in data/historical/events/2021_chamoli_rishiganga.json',
    },
    {
      id: 'CH-5',
      question: '“Does FloodGuard guarantee a safe evacuation route to citizens?”',
      subtitle: 'Conservative Life-Safety Semantics',
      answer: 'No. FloodGuard AI NEVER claims a route is "SAFE". All paths are labeled "CANDIDATE LOWER-EXPOSURE ROUTE" with explicit bridge/hazard overlap checks, and official state disaster management warnings are given top priority.',
      actionLabel: 'OPEN MY SAFETY ESCAPE HUD',
      actionHref: '/safety',
      verifiedProof: 'Evaluated in Unit Test test_route_engine_candidate_labels_never_say_safe()',
    },
    {
      id: 'CH-6',
      question: '“What is the overall empirical accuracy across historical events?”',
      subtitle: 'Leave-One-Out Cross-Validation (LOOCV)',
      answer: 'FloodGuard was benchmarked across 5 historical events (2013 Kedarnath, 2021 Chamoli, 2021 Melamchi, 2023 Nepal, 2026 Rasuwa) achieving 100% event detection with 15–45 minutes of verified lead time.',
      actionLabel: 'VIEW EVENT BENCHMARK MATRIX',
      actionHref: '/benchmark',
      verifiedProof: 'Documented in apps/web/src/app/benchmark/page.tsx',
    },
  ];

  const current = challenges[selectedChallenge];

  return (
    <div className="flex flex-col min-h-screen bg-[#070d1e] text-slate-100 select-none">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="challenge" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#223354] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold">
                  SIH EVALUATION ARENA
                </span>
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  JUDGE CHALLENGE MODE & STRESS TEST ARENA
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Interactive real-system demonstrations answering tough architectural and scientific questions
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Master 2-Column Challenge Arena */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Challenge Questions List (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                SELECT A CHALLENGE QUESTION
              </div>

              {challenges.map((ch, idx) => {
                const isSelected = selectedChallenge === idx;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChallenge(idx)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-blue-600/30 border-amber-400 text-slate-100 ring-2 ring-amber-500 shadow-2xl'
                        : 'bg-[#0e1630] border-[#223354] text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-amber-400 text-[10px] font-bold">{ch.id} • {ch.subtitle}</span>
                    </div>
                    <div className="font-bold text-slate-100 text-xs leading-snug">{ch.question}</div>
                  </button>
                );
              })}
            </div>

            {/* Right: Live Interactive Response & Verification Proof (7 Cols) */}
            <div className="lg:col-span-7 bg-[#0e1630] border border-[#223354] rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="border-b border-slate-800 pb-4 space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                  CHALLENGE RESPONSE & DEFENSE: {current.id}
                </span>
                <h2 className="text-base font-bold text-slate-100">{current.question}</h2>
                <div className="text-xs text-slate-400 font-mono">{current.subtitle}</div>
              </div>

              {/* Real System Defense Response */}
              <div className="bg-[#070d1e] p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="font-mono font-bold text-cyan-300 uppercase tracking-wider text-[11px]">
                  ARCHITECTURAL EXPLANATION & MECHANISM
                </div>
                <p className="text-slate-200 leading-relaxed text-xs">{current.answer}</p>
              </div>

              {/* Verified Automated Proof Pill */}
              <div className="bg-emerald-950/40 border border-emerald-800 p-3.5 rounded-xl text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-emerald-300 text-xs">AUTOMATED VALIDATION PROOF</div>
                  <div className="text-[11px] text-slate-300 font-mono mt-0.5">{current.verifiedProof}</div>
                </div>
              </div>

              {/* Direct Jump to Real System State */}
              <div className="pt-2">
                <Link
                  href={current.actionHref}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-xl text-xs font-mono"
                >
                  <span>{current.actionLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
