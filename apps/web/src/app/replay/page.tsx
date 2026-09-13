'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
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
  const { setPage, setMode, setRiverStage, setRainfallMm } = useEnvironment();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(3); // T-15m
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  useEffect(() => {
    setPage('replay');
    setMode('REPLAY');
  }, [setPage, setMode]);

  const timeSteps = [
    { label: 'T-60m', time: '13:00 UTC', rain: '12 mm', stage: '2.10m', risk: 32, status: 'NORMAL' as const },
    { label: 'T-45m', time: '13:15 UTC', rain: '24 mm', stage: '2.60m', risk: 45, status: 'ELEVATED' as const },
    { label: 'T-30m', time: '13:30 UTC', rain: '36 mm', stage: '3.20m', risk: 58, status: 'HIGH' as const },
    { label: 'T-15m', time: '13:45 UTC', rain: '48 mm', stage: '3.80m', risk: 68.5, status: 'HIGH' as const },
    { label: 'T0 (SURGE)', time: '14:00 UTC', rain: '62 mm', stage: '4.90m', risk: 88, status: 'EXTREME' as const },
    { label: 'T+15m', time: '14:15 UTC', rain: '70 mm', stage: '5.40m', risk: 94, status: 'EXTREME' as const },
    { label: 'T+30m', time: '14:30 UTC', rain: '72 mm', stage: '4.80m', risk: 82, status: 'HIGH' as const },
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

  useEffect(() => {
    setRainfallMm(parseFloat(current.rain));
    setRiverStage(parseFloat(current.stage));
  }, [current, setRainfallMm, setRiverStage]);

  return (
    <div className="flex flex-col min-h-screen select-none bg-[#F0F4F8] text-slate-900">
      <Header dataMode="REPLAY" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="replay" />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-7xl mx-auto space-y-5 pb-24 md:pb-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 text-xs font-semibold">TIME MACHINE REPLAY</span>
                <h1 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-600" />
                  HISTORICAL TIME MACHINE &amp; HYDROGRAPH PLAYBACK
                </h1>
              </div>
              <p className="text-sm text-slate-600 mt-1 font-sans">
                Deterministic time-stepped simulation evaluating model predictive lead time before surge onset
              </p>
            </div>
            <DataModeBadge mode="REPLAY" />
          </div>

          {/* Master Replay Controller Bar */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="btn-primary px-4 py-2 text-white rounded-xl font-bold flex items-center gap-2 transition shadow-sm text-xs font-sans"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'PAUSE PLAYBACK' : 'START REPLAY'}</span>
                </button>

                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 font-sans text-xs">
                  {[1, 2, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`px-2.5 py-1 rounded-lg transition font-medium ${
                        speed === s ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 font-sans text-xs">
                <span className="text-slate-500 font-medium">TIMESTAMP:</span>
                <span className="text-blue-700 font-bold font-mono bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                  {current.time} ({current.label})
                </span>
              </div>
            </div>

            {/* Stepped Timeline */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {timeSteps.map((st, idx) => (
                <button
                  key={st.label}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    currentStepIndex === idx
                      ? 'border-blue-500 ring-2 ring-blue-400/30 bg-blue-50/40 shadow-sm scale-[1.02]'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-mono text-blue-700 font-bold">{st.label}</div>
                  <div className="text-xs font-bold font-sans text-slate-900 mt-1">{st.time}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    Rain: {st.rain} • Stage: {st.stage}
                  </div>
                </button>
              ))}
            </div>

            {/* Dynamic Telemetry Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center space-y-1">
                <div className="text-xs font-sans font-semibold text-slate-500 uppercase tracking-wide">3H ACCUMULATED RAINFALL</div>
                <div className="text-2xl font-black text-blue-700 font-mono">{current.rain}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center space-y-1">
                <div className="text-xs font-sans font-semibold text-slate-500 uppercase tracking-wide">RIVER STAGE LEVEL</div>
                <div className="text-2xl font-black text-teal-700 font-mono">{current.stage}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center space-y-1">
                <div className="text-xs font-sans font-semibold text-slate-500 uppercase tracking-wide">COMPOSITE RISK ESTIMATE</div>
                <div className="text-2xl font-black text-amber-700 font-mono">{current.risk} / 100</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
