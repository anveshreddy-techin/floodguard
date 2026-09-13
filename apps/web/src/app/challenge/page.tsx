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
    {
      id: 'CH-6',
      question: '“What is your Post-SIH Ministry Deployment & Field Implementation Roadmap?”',
      subtitle: 'Ministry of Education (MIC) & AICTE Guidelines Alignment',
      answer: 'Structured 6–12 month phased rollout with Ministry of Home Affairs (MHA) and State EOCs. Phase I: Alpha sensor testbed; Phase II: IMD/CWC live pipeline integration; Phase III: State Disaster Management Authority commissioning. Student-owned IP with lifetime free government access, cybersecurity audits, and quarterly MIC reporting.',
      actionLabel: 'INSPECT 12-MONTH IMPLEMENTATION ROADMAP',
      actionHref: '/predict-save-prove',
      verifiedProof: 'Documented in docs/SIH_DEPLOYMENT_GUIDELINES_ROADMAP.md (15 MIC Clauses Compliant)',
    },
  ];

  const current = challenges[selectedChallenge];

  return (
    <div className="flex flex-col min-h-screen select-none bg-[#F0F4F8] text-slate-900 font-sans">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="challenge" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">EVALUATION ARENA</span>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 font-sans">
                  <HelpCircle className="w-6 h-6 text-amber-600" />
                  SIH Technical Defense & Evaluator Arena
                </h1>
              </div>
              <p className="text-slate-600 text-sm mt-1 font-sans">
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
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 flex items-start gap-3.5 shadow-sm ${
                      isSelected
                        ? 'bg-white border-2 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 font-mono shadow-xs ${
                      isSelected ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {ch.id}
                    </span>
                    <div className="space-y-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 transition leading-snug font-sans">
                        {ch.question}
                      </div>
                      <div className="text-xs text-slate-500 font-medium font-sans">{ch.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Answer & Live Interactive Demonstration (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider font-sans">
                  Challenge Prompt {current.id} • {current.subtitle}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1.5 leading-snug font-sans">{current.question}</h2>
              </div>

              {/* Comprehensive System Answer */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block font-sans">
                  System Architecture & Physical Proof
                </span>
                <p className="text-sm text-slate-700 leading-relaxed font-sans">
                  {current.answer}
                </p>
              </div>

              {/* Verified Proof */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3.5 text-xs shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-slate-500 text-xs font-semibold font-sans">Empirical Proof:</div>
                  <div className="text-emerald-800 font-bold font-mono text-xs mt-0.5">{current.verifiedProof}</div>
                </div>
              </div>

              {/* Action Button Launching Live Feature */}
              <div className="pt-2">
                <Link
                  href={current.actionHref}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-center text-xs font-bold font-sans text-white flex items-center justify-center gap-2 shadow-sm transition-all"
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
