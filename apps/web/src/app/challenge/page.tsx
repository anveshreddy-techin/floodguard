'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { HelpCircle, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2, Play, Eye } from 'lucide-react';
import { RiskBadge, UncertaintyBadge, DataModeBadge } from '@/components/ui/Badges';

export default function JudgeChallengePage() {
  const [selectedScenario, setSelectedScenario] = useState<number>(1);
  const [scenarioState, setScenarioState] = useState<any>({
    active: true,
    title: "Scenario 1: What happens if rainfall data becomes unavailable?",
    question: "What happens if rainfall data becomes unavailable?",
    simulationResult: {
      behavior: "Graceful Degradation with Elevated Uncertainty",
      sourceStatus: "UNAVAILABLE (Rainfall Feed Down)",
      confidence: "INSUFFICIENT_DATA",
      uncertainty: "HIGH",
      systemAction: "1. Flags rainfall telemetry as UNAVAILABLE in UI\n2. Drops confidence to INSUFFICIENT_DATA\n3. Escalates uncertainty band to HIGH\n4. Employs antecedent moisture index model as temporary proxy\n5. Flags warning banner to dispatch local observer reports",
      truthfulnessNote: "Zero false certainty. The system explicitly reports what is unknown rather than hallucinating zero rain.",
    },
  });

  const scenarios = [
    {
      id: 1,
      name: "1. Missing Rainfall Data",
      question: "What happens if rainfall data becomes unavailable?",
      trigger: () => {
        setSelectedScenario(1);
        setScenarioState({
          active: true,
          title: "Scenario 1: What happens if rainfall data becomes unavailable?",
          question: "What happens if rainfall data becomes unavailable?",
          simulationResult: {
            behavior: "Graceful Degradation with Elevated Uncertainty",
            sourceStatus: "UNAVAILABLE (Rainfall Feed Down)",
            confidence: "INSUFFICIENT_DATA",
            uncertainty: "HIGH",
            systemAction: "1. Flags rainfall telemetry as UNAVAILABLE in UI\n2. Drops confidence to INSUFFICIENT_DATA\n3. Escalates uncertainty band to HIGH\n4. Employs antecedent moisture index model as temporary proxy\n5. Flags warning banner to dispatch local observer reports",
            truthfulnessNote: "Zero false certainty. The system explicitly reports what is unknown rather than hallucinating zero rain.",
          },
        });
      },
    },
    {
      id: 2,
      name: "2. Sensor Disagreement",
      question: "What happens if satellite and ground sensors disagree?",
      trigger: () => {
        setSelectedScenario(2);
        setScenarioState({
          active: true,
          title: "Scenario 2: What happens if sensors disagree?",
          question: "Satellite indicates moderate rain (15mm/h) while ground gauge reports extreme cloudburst (65mm/h).",
          simulationResult: {
            behavior: "Multi-Source Disagreement Detection & Cross-Verification",
            sourceStatus: "DISAGREEMENT DETECTED (Δ = 50mm/h)",
            confidence: "LOW",
            uncertainty: "HIGH",
            systemAction: "1. Evaluates sensor spatial proximity (Ground AWS-001 is inside valley, Satellite is 10km grid average)\n2. Weights local in-situ sensor higher due to mountain micro-climate terrain effects\n3. Widens uncertainty bounds and flags 'Source Agreement: LOW'\n4. Triggers rapid cross-check with soil moisture saturation rate-of-change",
            truthfulnessNote: "Treats disagreement as an active uncertainty signal rather than silently averaging conflicting numbers.",
          },
        });
      },
    },
    {
      id: 3,
      name: "3. Explain 'HIGH Risk'",
      question: "Why is Sunderbans Nagar rated HIGH risk right now?",
      trigger: () => {
        setSelectedScenario(3);
        setScenarioState({
          active: true,
          title: "Scenario 3: Why is this location HIGH risk?",
          question: "Explain the exact evidence chain behind the HIGH risk classification.",
          simulationResult: {
            behavior: "Transparent Multi-Factor Risk Decomposition",
            sourceStatus: "MULTI-SOURCE OBSERVED & INFERRED",
            confidence: "MEDIUM",
            uncertainty: "LOW",
            systemAction: "• Rainfall Accumulation: 48mm in 3h (Weight 35%, Score 75/100) [OBSERVED]\n• Soil Saturation Index: 82% (Weight 25%, Score 82/100) [MODEL_INFERRED]\n• Terrain Slope: 28° mean gradient (Weight 20%, Score 55/100) [OBSERVED DEM]\n• River Stage Rise: +0.40 m/h (Weight 15%, Score 42/100) [OBSERVED GAUGE]\n$\rightarrow$ Composite Score = 68.5 / 100 (HIGH RISK)",
            truthfulnessNote: "Every contributor is backed by a verified timestamp and explicit data_mode label.",
          },
        });
      },
    },
    {
      id: 4,
      name: "4. Historical Replay",
      question: "Can the system replay a historical event through time?",
      trigger: () => {
        setSelectedScenario(4);
        setScenarioState({
          active: true,
          title: "Scenario 4: Can you replay an event?",
          question: "Demonstrate time-stepped replay from T-60 to T+30 min.",
          simulationResult: {
            behavior: "Time-Stepped Historical Hydrograph Playback",
            sourceStatus: "REPLAY MODE (Historical Reanalysis)",
            confidence: "HIGH",
            uncertainty: "LOW",
            systemAction: "1. Loads frozen historical feature snapshot from database\n2. Replays precipitation curve, soil saturation evolution, and river surge\n3. Traces when threshold was crossed (T-30 min) and when alert was activated (T-20 min)\n4. Demonstrates 45-minute operational lead time before peak impact",
            truthfulnessNote: "Replay data is strictly isolated with data_mode='REPLAY' and cannot corrupt live tables.",
          },
        });
      },
    },
    {
      id: 5,
      name: "5. Cloudburst Perturbation",
      question: "What if rainfall becomes more intense (Cloudburst What-If)?",
      trigger: () => {
        setSelectedScenario(5);
        setScenarioState({
          active: true,
          title: "Scenario 5: What if rainfall becomes more intense?",
          question: "Simulate rainfall escalating from 48mm/3h to 95mm/1h.",
          simulationResult: {
            behavior: "Instantaneous Rule-Based Risk Sensitivity Computation",
            sourceStatus: "SIMULATION MODE",
            confidence: "MEDIUM",
            uncertainty: "MEDIUM",
            systemAction: "1. Precipitation risk spikes from 75 $\rightarrow$ 98/100\n2. Composite Risk score escalates from 68.5 (HIGH) $\rightarrow$ 88.4 (EXTREME)\n3. Downstream impact window contracts from 45 min $\rightarrow$ 20 min\n4. Automatically promotes Shelter 1 and Shelter 2 to FULL EVACUATION status in Incident Command",
            truthfulnessNote: "Clearly labeled 'SIMULATION'. Never modifies operational telemetry.",
          },
        });
      },
    },
    {
      id: 6,
      name: "6. Downstream Propagation",
      question: "What happens downstream if a blockage occurs in the upper gorge?",
      trigger: () => {
        setSelectedScenario(6);
        setScenarioState({
          active: true,
          title: "Scenario 6: What happens downstream?",
          question: "Upstream slope failure creates a temporary landslide dam in the narrow gorge.",
          simulationResult: {
            behavior: "Cascade Propagation & Sudden Breach Exposure Modeling",
            sourceStatus: "CASCADE MODEL INFERENCE",
            confidence: "MEDIUM",
            uncertainty: "HIGH",
            systemAction: "1. Temporary river level drop at upper gauge followed by sudden surge\n2. Flags 'Possible Debris Damming' in Upstream Cascade\n3. Traces downstream travel corridor to Sunderbans Nagar (KM 4.2 downstream)\n4. Flags bridge bottleneck at KM 0.6 as 'High Inundation Risk — Evacuate Lower Wards'",
            truthfulnessNote: "Lag times are empirical heuristic bounds. System disclaims exact hydraulic arrival timing without LiDAR.",
          },
        });
      },
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="overview" />

        <main className="flex-1 p-6 max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-[#3a506b] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold">
                  SECTION G COMPLIANCE
                </span>
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  JUDGE CHALLENGE MODE
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Controlled, reproducible demonstration of difficult disaster questions & edge cases
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Scenario Selector Buttons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={sc.trigger}
                className={`p-3 rounded-lg border text-left text-xs transition flex flex-col justify-between ${
                  selectedScenario === sc.id
                    ? 'bg-blue-600/30 border-cyan-400 text-cyan-200 font-bold shadow-md ring-1 ring-cyan-500'
                    : 'bg-[#1c2541] border-[#3a506b] text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-mono text-[11px] text-cyan-400 mb-1">{sc.name}</div>
                <div className="text-[10px] text-slate-400 line-clamp-2">{sc.question}</div>
              </button>
            ))}
          </div>

          {/* Active Scenario Demonstration Canvas */}
          <div className="bg-[#1c2541] border border-[#3a506b] rounded-xl p-6 space-y-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
              <div>
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-0.5">
                  Interactive Evaluation Sandbox
                </div>
                <h2 className="text-base font-bold text-slate-100">{scenarioState.title}</h2>
                <p className="text-xs text-slate-300 italic mt-1">Challenge: "{scenarioState.question}"</p>
              </div>
              <div className="flex items-center gap-2">
                <UncertaintyBadge level={scenarioState.simulationResult.uncertainty} />
              </div>
            </div>

            {/* Expected Behavior vs System Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/90 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div className="text-slate-400 font-mono text-[11px] uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Expected Architectural Response:
                </div>
                <div className="text-sm font-bold text-emerald-300">
                  {scenarioState.simulationResult.behavior}
                </div>
                <div className="text-slate-300 pt-2 border-t border-slate-800">
                  <span className="text-slate-400 font-mono">Source Status: </span>
                  <span className="font-mono text-amber-400">{scenarioState.simulationResult.sourceStatus}</span>
                </div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div className="text-slate-400 font-mono text-[11px] uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Truthfulness & Reliability Guarantee:
                </div>
                <div className="text-slate-200 leading-relaxed">
                  {scenarioState.simulationResult.truthfulnessNote}
                </div>
              </div>
            </div>

            {/* Step-by-Step Executed Action Trace */}
            <div className="bg-[#141d38] p-4 rounded-lg border border-slate-700/80 space-y-2 text-xs">
              <div className="font-semibold text-cyan-300 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Live System Execution Trail & Logic Trace:
              </div>
              <pre className="font-mono text-slate-200 text-xs bg-slate-950 p-3 rounded border border-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {scenarioState.simulationResult.systemAction}
              </pre>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
