'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { Play, Pause, RotateCcw, FastForward, Clock, ShieldAlert, Waves, CloudRain } from 'lucide-react';
import { RiskBadge, DataModeBadge } from '@/components/ui/Badges';

export default function HistoricalReplayPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(2);

  const timelineSteps = [
    { time: "T-60 min", rain: 5.0, soil: 40, river: 2.50, risk: 18.0, level: "LOW" as const, note: "Quiescent baseline; normal monsoon drizzle." },
    { time: "T-45 min", rain: 18.0, soil: 55, river: 2.70, risk: 36.0, level: "MODERATE" as const, note: "Precipitation intensifies over ridge headwaters." },
    { time: "T-30 min", rain: 36.0, soil: 74, river: 3.10, risk: 58.0, level: "HIGH" as const, note: "Soil saturation crossed threshold; runoff accelerates down slope." },
    { time: "T-15 min", rain: 48.0, soil: 82, river: 3.80, risk: 68.5, level: "HIGH" as const, note: "Flash flood alert dispatched; shelter preparation triggered." },
    { time: "T0 (Peak)", rain: 55.0, soil: 90, river: 4.80, risk: 84.0, level: "EXTREME" as const, note: "Peak surge reaches downstream culvert; road inundation active." },
    { time: "T+15 min", rain: 20.0, soil: 88, river: 4.20, risk: 65.0, level: "HIGH" as const, note: "Rain easing; hydrograph receding slowly." },
    { time: "T+30 min", rain: 8.0, soil: 82, river: 3.50, risk: 45.0, level: "MODERATE" as const, note: "Recession limb; damage assessment initiated." },
  ];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => (prev < timelineSteps.length - 1 ? prev + 1 : 0));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timelineSteps.length]);

  const current = timelineSteps[currentStepIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode="REPLAY" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="overview" />

        <main className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-[#3a506b] pb-4">
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                HISTORICAL EVENT TIME-SERIES REPLAY
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Replay flash flood events through time to audit lead times, alert activations, and model predictions
              </p>
            </div>
            <DataModeBadge mode="REPLAY" />
          </div>

          {/* Player Controls Bar */}
          <div className="bg-[#1c2541] border border-[#3a506b] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition shadow-md"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause Playback' : 'Play Historical Replay'}</span>
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setCurrentStepIndex(0); }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition border border-slate-700"
                  title="Reset to T-60"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-cyan-400 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded font-bold">
                  STEP: {current.time}
                </span>
                <RiskBadge level={current.level} />
              </div>
            </div>

            {/* Timeline Progress Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                {timelineSteps.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setIsPlaying(false); setCurrentStepIndex(idx); }}
                    className={`hover:text-cyan-300 transition ${currentStepIndex === idx ? 'text-cyan-400 font-bold' : ''}`}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="0"
                max={timelineSteps.length - 1}
                value={currentStepIndex}
                onChange={(e) => { setIsPlaying(false); setCurrentStepIndex(Number(e.target.value)); }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Current Step Telemetry & Risk Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#1c2541] border border-[#3a506b] p-4 rounded-lg text-center">
              <div className="text-slate-400 text-xs flex items-center justify-center gap-1.5 mb-1">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> Rainfall Intensity
              </div>
              <div className="text-2xl font-bold font-mono text-cyan-300">{current.rain} mm/h</div>
            </div>

            <div className="bg-[#1c2541] border border-[#3a506b] p-4 rounded-lg text-center">
              <div className="text-slate-400 text-xs flex items-center justify-center gap-1.5 mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Soil Saturation
              </div>
              <div className="text-2xl font-bold font-mono text-amber-400">{current.soil}%</div>
            </div>

            <div className="bg-[#1c2541] border border-[#3a506b] p-4 rounded-lg text-center">
              <div className="text-slate-400 text-xs flex items-center justify-center gap-1.5 mb-1">
                <Waves className="w-3.5 h-3.5 text-blue-400" /> River Stage
              </div>
              <div className="text-2xl font-bold font-mono text-blue-300">{current.river.toFixed(2)} m</div>
            </div>

            <div className="bg-[#1c2541] border border-[#3a506b] p-4 rounded-lg text-center">
              <div className="text-slate-400 text-xs mb-1">Composite Risk</div>
              <div className="text-2xl font-bold font-mono text-rose-400">{current.risk}%</div>
            </div>
          </div>

          {/* Operational Log for Replay Step */}
          <div className="bg-[#1c2541] border border-[#3a506b] rounded-lg p-5 text-xs space-y-2">
            <div className="font-semibold text-cyan-300 uppercase tracking-wider text-[11px]">
              Hydro-Meteorological Event Log at {current.time}:
            </div>
            <p className="text-slate-200 text-sm leading-relaxed bg-slate-900/80 p-3 rounded border border-slate-800 font-mono">
              {current.note}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
