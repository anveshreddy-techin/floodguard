'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { 
  History, 
  Play, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders, 
  ArrowRight,
  Layers,
  FileText
} from 'lucide-react';
import { RiskBadge, UncertaintyBadge, DataModeBadge } from '@/components/ui/Badges';
import { HindcastMode, RiskLevel } from '@/types';

export default function HindcastLabPage() {
  const [selectedEventId, setSelectedEventId] = useState<string>('2021_chamoli_rishiganga');
  const [mode, setMode] = useState<HindcastMode>('STRICT_REPLAY');
  const [currentStep, setCurrentStep] = useState<number>(3); // T-15 min

  const events = [
    { id: '2013_uttarakhand_kedarnath', name: '2013 Uttarakhand / Kedarnath (India)', date: 'June 2013', type: 'FLASH_FLOOD', leadTime: '45 min' },
    { id: '2021_chamoli_rishiganga', name: '2021 Chamoli Avalanche & Surge (India)', date: 'Feb 2021', type: 'GLOF', leadTime: '15 min' },
    { id: '2021_nepal_melamchi', name: '2021 Melamchi Debris Cascade (Nepal)', date: 'June 2021', type: 'DEBRIS_FLOOD', leadTime: '40 min' },
    { id: '2023_nepal_events', name: '2023 Nepal Multi-Event Catalog', date: 'June-Aug 2023', type: 'FLASH_FLOOD', leadTime: '35 min' },
    { id: '2026_nepal_bhote_koshi', name: '2026 Bhote Koshi / Rasuwa Disaster (Nepal)', date: 'Aug 2026', type: 'GLOF', leadTime: '25 min' },
  ];

  const stepsData = [
    {
      time: 'T-60 min',
      riskScore: 10.0,
      level: 'LOW' as RiskLevel,
      unc: 'HIGH' as const,
      avail: ['IMD Joshimath: 0.0 mm/h (Clear winter weather)', 'CWC Base Stage: 2.10m'],
      locked: ['Satellite Wedge Detachment Scar (post-event acquisition)', 'Downstream Hydropower Damage Reports'],
      desc: 'Quiescent baseline under clear skies. Rainfall models report zero hazard.',
    },
    {
      time: 'T-45 min',
      riskScore: 25.0,
      level: 'LOW' as RiskLevel,
      unc: 'HIGH' as const,
      avail: ['Regional Seismic Stations (CSIR-NGRI): Precursory seismic ground tremor detected', 'IMD: 0.0 mm'],
      locked: ['Ronti Peak Wedge Volume Analysis', 'Tapovan Inundation Evidence'],
      desc: 'Ground vibration anomaly detected in high-altitude sector without precipitation.',
    },
    {
      time: 'T-30 min',
      riskScore: 65.0,
      level: 'HIGH' as RiskLevel,
      unc: 'MEDIUM' as const,
      avail: ['Rate-of-Rise Tripwire: Upstream hydrometric rate-of-rise +4.5m/h', 'Seismic amplitude peak'],
      locked: ['Final Casualty Figures (Available only post-event)', 'Geomorphology Field Survey'],
      desc: 'Rate-of-rise trigger crosses flash threshold. Cryospheric/mass-movement flag escalated.',
    },
    {
      time: 'T-15 min',
      riskScore: 92.0,
      level: 'EXTREME' as RiskLevel,
      unc: 'LOW' as const,
      avail: ['Stage Surge: River level +8.2m at upper gorge', 'Rishiganga 13.2MW Sensor Sudden Flatline'],
      locked: ['Post-event Drone LiDAR Survey'],
      desc: 'CRITICAL ALERT DISPATCHED. 15-minute lead time before surge reaches Tapovan barrage.',
    },
    {
      time: 'T0 (Peak Impact)',
      riskScore: 98.0,
      level: 'EXTREME' as RiskLevel,
      unc: 'LOW' as const,
      avail: ['Full gauge inundation record', 'Downstream river height: 14.5m surge'],
      locked: [],
      desc: 'Surge front impacts Tapovan Vishnugad project corridor.',
    },
  ];

  const activeStep = stepsData[currentStep];

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode="HINDCAST" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="hindcast" />

        <main className="flex-1 p-6 max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#3a506b] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono font-bold">
                  HINDSIGHT EVALUATION
                </span>
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-400" />
                  HISTORICAL HINDSIGHT LAB (HINDCAST ENGINE)
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Evaluate model detection, lead times, and uncertainty against verified historical disasters with strict hindsight lockout
              </p>
            </div>
            <DataModeBadge mode="HINDCAST" />
          </div>

          {/* Event Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {events.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setSelectedEventId(ev.id)}
                className={`p-3 rounded-lg border text-left text-xs transition flex flex-col justify-between ${
                  selectedEventId === ev.id
                    ? 'bg-purple-950/60 border-purple-500 text-purple-200 font-bold shadow-md ring-1 ring-purple-500'
                    : 'bg-[#1c2541] border-[#3a506b] text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-cyan-400">{ev.date}</span>
                  <div className="font-semibold text-slate-100 text-xs mt-0.5">{ev.name}</div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-2">
                  Lead Time: {ev.leadTime}
                </div>
              </button>
            ))}
          </div>

          {/* Mode Selector & Hindsight Lock Bar */}
          <div className="bg-[#1c2541] border border-[#3a506b] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-300 font-semibold font-mono text-[11px]">REPLAY MODE:</span>
              {(['STRICT_REPLAY', 'RECONSTRUCTION', 'SIMULATION'] as HindcastMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition ${
                    mode === m
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              {mode === 'STRICT_REPLAY' ? (
                <span className="text-emerald-400 flex items-center gap-1.5 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
                  <Lock className="w-3.5 h-3.5" /> HINDSIGHT LOCK ACTIVE (Zero Future Data Leaks)
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1.5 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-800">
                  <Unlock className="w-3.5 h-3.5" /> POST-EVENT EVIDENCE PERMITTED
                </span>
              )}
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="bg-[#1c2541] border border-[#3a506b] rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-xs font-bold text-slate-200 uppercase font-mono">
                REPLAY TIME STEP: <span className="text-purple-400">{activeStep.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge level={activeStep.level} />
                <UncertaintyBadge level={activeStep.unc} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                {stepsData.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`hover:text-purple-300 transition ${currentStep === idx ? 'text-purple-400 font-bold' : ''}`}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="0"
                max={stepsData.length - 1}
                value={currentStep}
                onChange={(e) => setCurrentStep(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>
          </div>

          {/* What Did The System Know vs Locked Out (Clauses 4 & 13) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#141d38] border border-emerald-800/80 rounded-xl p-4 space-y-3 text-xs">
              <div className="font-bold text-emerald-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                AVAILABLE HISTORICAL INPUTS AT {activeStep.time}
              </div>
              <div className="space-y-2">
                {activeStep.avail.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-2.5 rounded border border-slate-800 text-slate-200 font-mono text-[11px]">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#141d38] border border-rose-900/80 rounded-xl p-4 space-y-3 text-xs">
              <div className="font-bold text-rose-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-rose-400" />
                LOCKED OUT UNDER STRICT REPLAY (available_at &gt; replay_time)
              </div>
              <div className="space-y-2">
                {activeStep.locked.length > 0 ? (
                  activeStep.locked.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/90 p-2.5 rounded border border-slate-800 text-rose-300 font-mono text-[11px] flex items-center justify-between">
                      <span>{item}</span>
                      <span className="text-[10px] text-slate-500">LOCKED</span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 italic text-[11px]">All post-event documentation unlocked at peak impact.</div>
                )}
              </div>
            </div>
          </div>

          {/* Prediction vs Documented Outcome Scorecard (Clause 14 & 16) */}
          <div className="bg-[#1c2541] border border-[#3a506b] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-700 pb-3">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              RETROSPECTIVE HINDCAST SCORECARD & TRUTHFULNESS GUARANTEE
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-slate-900/90 p-3 rounded border border-slate-800 text-center">
                <div className="text-slate-400 text-[10px]">Hazard Detected</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">YES</div>
              </div>
              <div className="bg-slate-900/90 p-3 rounded border border-slate-800 text-center">
                <div className="text-slate-400 text-[10px]">Operational Lead Time</div>
                <div className="text-lg font-bold text-cyan-300 mt-0.5">15 Minutes</div>
              </div>
              <div className="bg-slate-900/90 p-3 rounded border border-slate-800 text-center">
                <div className="text-slate-400 text-[10px]">False Alarms</div>
                <div className="text-lg font-bold text-slate-200 mt-0.5">0</div>
              </div>
              <div className="bg-slate-900/90 p-3 rounded border border-slate-800 text-center">
                <div className="text-slate-400 text-[10px]">Data Completeness</div>
                <div className="text-lg font-bold text-amber-300 mt-0.5">82.5%</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 italic bg-slate-950 p-3 rounded border border-slate-800">
              Truthfulness Notice: This is a retrospective model evaluation (hindcast), not a live prediction made in 2021.
              FloodGuard AI evaluates past events strictly to benchmark detection algorithms and improve future warning readiness.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
