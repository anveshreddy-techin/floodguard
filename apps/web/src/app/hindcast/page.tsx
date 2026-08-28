'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
import { 
  History, 
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
  const { setPage, setMode } = useEnvironment();
  const [selectedEventId, setSelectedEventId] = useState<string>('2021_chamoli_rishiganga');
  const [mode, setLocalMode] = useState<HindcastMode>('STRICT_REPLAY');
  const [currentStep, setCurrentStep] = useState<number>(3); // T-15 min

  useEffect(() => {
    setPage('hindcast');
    setMode('HINDCAST');
  }, [setPage, setMode]);

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
      avail: ['Regional Seismic Stations (CSIR-NGRI): Precursory ground tremor detected', 'IMD: 0.0 mm'],
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
      desc: 'Rate-of-rise trigger crosses flash threshold. Cryospheric mass-movement flag escalated.',
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
    <div className="flex flex-col min-h-screen select-none">
      <Header dataMode="HINDCAST" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="hindcast" />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-7xl mx-auto space-y-5 pb-24 md:pb-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="chip chip-hist">HINDSIGHT EVALUATION</span>
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-400" />
                  HISTORICAL HINDSIGHT LAB (HINDCAST ENGINE)
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Evaluate model detection, lead times, and uncertainty against verified historical disasters with strict hindsight lockout
              </p>
            </div>
            <DataModeBadge mode="HINDCAST" />
          </div>

          {/* Event Selector Horizontal Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {events.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setSelectedEventId(ev.id)}
                className={`p-3.5 rounded-2xl text-left text-xs transition-all duration-300 flex flex-col justify-between space-y-2 ${
                  selectedEventId === ev.id
                    ? 'fp-historical ring-2 ring-purple-400 shadow-xl'
                    : 'fp hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-cyan-300 font-bold">{ev.date}</span>
                  <div className="font-bold text-white text-xs mt-0.5 leading-snug">{ev.name}</div>
                </div>
                <div className="text-[10px] text-purple-300 font-mono font-bold pt-1 border-t border-slate-800/80">
                  Lead Time: {ev.leadTime}
                </div>
              </button>
            ))}
          </div>

          {/* Mode Selector & Hindsight Lock Bar */}
          <div className="fp fp-historical rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-300 font-bold font-mono text-[11px]">REPLAY MODE:</span>
              {(['STRICT_REPLAY', 'RECONSTRUCTION', 'SIMULATION'] as HindcastMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setLocalMode(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition transform active:scale-95 ${
                    mode === m
                      ? 'btn-primary text-white shadow-md'
                      : 'fp text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              {mode === 'STRICT_REPLAY' ? (
                <span className="text-emerald-400 flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-700/80 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  <Lock className="w-3.5 h-3.5" /> HINDSIGHT LOCK ACTIVE (Zero Future Data Leaks)
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1.5 bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-700/80 font-bold">
                  <Unlock className="w-3.5 h-3.5" /> POST-EVENT EVIDENCE PERMITTED
                </span>
              )}
            </div>
          </div>

          {/* Master Horizontal Waveform Timeline */}
          <div className="fp fp-historical rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="text-xs font-black text-white uppercase font-mono">
                REPLAY TIME STEP: <span className="text-purple-300 text-sm font-bold">{activeStep.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge level={activeStep.level} />
                <UncertaintyBadge level={activeStep.unc} />
              </div>
            </div>

            {/* Time Step Buttons */}
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
                {stepsData.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`py-2 px-1 rounded-xl font-bold transition transform active:scale-95 ${
                      currentStep === idx
                        ? 'btn-primary text-white shadow-md'
                        : 'fp text-slate-400 hover:text-slate-200'
                    }`}
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
                className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-900 rounded-lg"
              />
            </div>
          </div>

          {/* What Did The System Know vs Locked Out */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="fp fp-operational rounded-3xl p-6 space-y-3 text-xs shadow-xl">
              <div className="font-bold text-emerald-300 uppercase tracking-wider text-xs flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                AVAILABLE HISTORICAL OBSERVATIONS AT {activeStep.time}
              </div>
              <div className="space-y-2">
                {activeStep.avail.map((item, idx) => (
                  <div key={idx} className="fp p-3 rounded-xl text-slate-200 font-mono text-xs">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="fp fp-critical rounded-3xl p-6 space-y-3 text-xs shadow-xl">
              <div className="font-bold text-rose-300 uppercase tracking-wider text-xs flex items-center gap-2 font-mono">
                <Lock className="w-4 h-4 text-rose-400" />
                LOCKED OUT UNDER STRICT REPLAY (available_at &gt; replay_time)
              </div>
              <div className="space-y-2">
                {activeStep.locked.length > 0 ? (
                  activeStep.locked.map((item, idx) => (
                    <div key={idx} className="fp p-3 rounded-xl text-rose-300 font-mono text-xs flex items-center justify-between">
                      <span>{item}</span>
                      <span className="text-[10px] bg-rose-950 px-2 py-0.5 rounded border border-rose-800 font-bold">LOCKED</span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 italic text-xs fp p-3 rounded-xl">All post-event documentation unlocked at peak impact.</div>
                )}
              </div>
            </div>
          </div>

          {/* Truthfulness Scorecard Guarantee */}
          <div className="fp fp-historical rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              RETROSPECTIVE HINDCAST SCORECARD & TRUTHFULNESS GUARANTEE
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="fp p-4 rounded-2xl text-center">
                <div className="text-slate-400 text-[10px]">Hazard Detected</div>
                <div className="text-xl font-black text-emerald-400 mt-1">YES</div>
              </div>
              <div className="fp p-4 rounded-2xl text-center">
                <div className="text-slate-400 text-[10px]">Operational Lead Time</div>
                <div className="text-xl font-black text-cyan-300 mt-1">15 Minutes</div>
              </div>
              <div className="fp p-4 rounded-2xl text-center">
                <div className="text-slate-400 text-[10px]">False Alarms</div>
                <div className="text-xl font-black text-white mt-1">0</div>
              </div>
              <div className="fp p-4 rounded-2xl text-center">
                <div className="text-slate-400 text-[10px]">Data Completeness</div>
                <div className="text-xl font-black text-amber-300 mt-1">82.5%</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
