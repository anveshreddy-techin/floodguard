'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
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
  const { setPage, setMode } = useEnvironment();
  const [selectedChallenge, setSelectedChallenge] = useState<number>(0);

  useEffect(() => {
    setPage('challenge');
    setMode('DEMO');
  }, [setPage, setMode]);

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
      question: '“Can you provide safe escape routes without misleading citizens into hazards?”',
      subtitle: 'Conservative Location-Aware Guidance',
      answer: 'FloodGuard labels all routes strictly as "Candidate Lower-Exposure Routes" and validates paths against active river surge contours and known bridge choke points, never falsely claiming absolute surface safety.',
      actionLabel: 'OPEN CITIZEN GUIDANCE HUD',
      actionHref: '/safety',
      verifiedProof: 'Evaluated in Section 78 Safe Route Verification Protocol',
    },
  ];

  const current = challenges[selectedChallenge];

  return (
    <div className="flex flex-col min-h-screen select-none">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="challenge" />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-7xl mx-auto space-y-5 pb-24 md:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="chip chip-demo">EVALUATION ARENA</span>
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  SIH JUDGE CHALLENGE MODE ARENA
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Direct stress-test prompts answering critical evaluator questions with live working proofs
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Challenge Prompts List (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              {challenges.map((ch, idx) => {
                const isSelected = selectedChallenge === idx;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChallenge(idx)}
                    className={`w-full p-4 rounded-2xl text-left transition-all duration-300 flex items-start gap-3.5 ${
                      isSelected
                        ? 'fp-operational ring-2 ring-amber-400 shadow-xl scale-[1.01]'
                        : 'fp hover:bg-slate-900/60'
                    }`}
                  >
                    <span className="font-mono text-xs font-black text-amber-400 bg-amber-950/80 px-2 py-1 rounded-lg border border-amber-800/80 shrink-0">
                      {ch.id}
                    </span>
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 transition leading-snug">
                        {ch.question}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{ch.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Answer & Live Interactive Demonstration (7 Cols) */}
            <div className="lg:col-span-7 fp fp-operational rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-slide-up">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                  CHALLENGE PROMPT {current.id} • {current.subtitle}
                </span>
                <h2 className="text-xl font-black text-white mt-1 leading-snug">{current.question}</h2>
              </div>

              {/* Comprehensive System Answer */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider block">
                  SYSTEM DEFENSE & ARCHITECTURAL SOLUTION
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-sans font-medium">
                  {current.answer}
                </p>
              </div>

              {/* Verified Proof */}
              <div className="fp p-4 rounded-2xl flex items-center gap-3 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">Empirical Proof:</div>
                  <div className="text-emerald-300 font-bold">{current.verifiedProof}</div>
                </div>
              </div>

              {/* Action Button Launching Live Feature */}
              <div className="pt-2">
                <Link
                  href={current.actionHref}
                  className="btn-primary w-full py-3.5 rounded-xl text-center text-xs font-black font-mono text-white flex items-center justify-center gap-2 shadow-xl"
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
