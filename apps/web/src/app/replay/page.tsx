'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { 
  History, 
  Play, 
  Pause, 
  RotateCcw, 
  Activity, 
  Clock, 
  ShieldAlert, 
  Waves, 
  CloudRain, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import { RiskBadge, UncertaintyBadge, DataModeBadge } from '@/components/ui/Badges';

export default function HistoricalReplayTimeMachinePage() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(3); // T-15m
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const timeSteps = [
    { label: 'T-60m', time: '13:00 UTC', rain: '12 mm', stage: '2.10m', risk: 32, status: 'NORMAL' },
    { label: 'T-45m', time: '13:15 UTC', rain: '24 mm', stage: '2.60m', risk: 45, status: 'ELEVATED' },
    { label: 'T-30m', time: '13:30 UTC', rain: '36 mm', stage: '3.20m', risk: 58, status: 'HIGH' },
    { label: 'T-15m', time: '13:45 UTC', rain: '48 mm', stage: '3.80m', risk: 68.5, status: 'HIGH' },
    { label: 'T0 (SURGE)', time: '14:00 UTC', rain: '62 mm', stage: '4.90m', risk: 88, status: 'EXTREME' },
    { label: 'T+15m', time: '14:15 UTC', rain: '70 mm', stage: '5.40m', risk: 94, status: 'EXTREME' },
    { label: 'T+30m', time: '14:30 UTC', rain: '72 mm', stage: '4.80m', risk: 82, status: 'HIGH' },
  ];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => (prev < timeSteps.length - 1 ? prev + 1 : 0));
      }, 2500 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, timeSteps.length]);

  const current = timeSteps[currentStepIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[#070d1e] text-slate-100 select-none">
      <Header dataMode="REPLAY" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="replay" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#223354] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono font-bold">
                  TIME MACHINE REPLAY
                </span>
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-400" />
                  HISTORICAL TIME MACHINE & HYDROGRAPH PLAYBACK
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Deterministic time-stepped simulation evaluating model predictive lead time before surge onset
              </p>
            </div>
            <DataModeBadge mode="REPLAY" />
          </div>

          {/* Master Replay Controller Bar */}
          <div className="bg-[#0e1630] border border-[#223354] rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 transition shadow-lg text-xs font-mono"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'PAUSE PLAYBACK' : 'START REPLAY'}</span>
                </button>

                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 font-mono text-xs">
                  {[1, 2, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        speed === s ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-slate-400">CURRENT SIMULATED TIME:</span>
                <span className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 text-cyan-300 font-bold">
                  {current.label} • {current.time}
                </span>
              </div>
            </div>

            {/* Time Steps Scrubber */}
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 font-mono text-xs">
              {timeSteps.map((stg, idx) => {
                const isCurrent = currentStepIndex === idx;
                const isFuture = idx > currentStepIndex;
                return (
                  <button
                    key={stg.label}
                    onClick={() => { setIsPlaying(false); setCurrentStepIndex(idx); }}
                    className={`p-3 rounded-xl border text-left transition ${
                      isCurrent
                        ? 'bg-blue-600/40 border-cyan-400 text-slate-100 ring-2 ring-cyan-500 shadow-xl'
                        : isFuture
                        ? 'bg-slate-950/60 border-slate-800 text-slate-500 hover:bg-slate-900'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold">{stg.label}</span>
                      {isFuture && <Lock className="w-3 h-3 text-slate-600" />}
                    </div>
                    <div className="text-cyan-400 font-bold text-xs mt-1">{stg.time}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Risk: {stg.risk}/100</div>
                  </button>
                );
              })}
            </div>

            {/* Contemporaneous Observation vs Future Lockout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-[#070d1e] p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px]">CUMULATIVE RAINFALL</div>
                <div className="text-xl font-bold text-cyan-300">{current.rain}</div>
                <div className="text-[10px] text-slate-500">Known at {current.time}</div>
              </div>
              <div className="bg-[#070d1e] p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px]">RIVER STAGE GAUGE</div>
                <div className="text-xl font-bold text-blue-400">{current.stage}</div>
                <div className="text-[10px] text-slate-500">Radar non-contact stage</div>
              </div>
              <div className="bg-[#070d1e] p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px]">MODEL RISK ESTIMATION</div>
                <div className="text-xl font-bold text-orange-400">{current.risk} / 100</div>
                <div className="text-[10px] text-slate-500">Status: {current.status}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
