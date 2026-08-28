'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Activity, ShieldAlert, Clock, Radio, CheckCircle2, Zap } from 'lucide-react';

interface CommandTimelineProps {
  currentStep: string;
  onStepChange: (step: string) => void;
}

export const CommandTimeline: React.FC<CommandTimelineProps> = ({
  currentStep,
  onStepChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);

  const timelineSteps = ['T-60m', 'T-45m', 'T-30m', 'T-15m', 'NOW'];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        const currentIdx = timelineSteps.indexOf(currentStep);
        const nextIdx = currentIdx < timelineSteps.length - 1 ? currentIdx + 1 : 0;
        onStepChange(timelineSteps[nextIdx]);
      }, 3000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, speed]);

  return (
    <div className="glass-panel border-t border-[#223354] px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs z-30 select-none backdrop-blur-xl">
      {/* Player Controls & Scrubber */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`btn-glow-cyan px-3 py-1.5 text-white rounded-xl font-bold flex items-center gap-1.5 text-[11px] font-mono shadow-xl transition active:scale-95 ${
            isPlaying ? 'ring-2 ring-cyan-400' : ''
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'PAUSE' : 'REPLAY'}</span>
        </button>

        {/* Speed Multipliers */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 font-mono text-[10px]">
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded-lg transition ${
                speed === s ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Step Scrubber Pills */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
          {timelineSteps.map((step) => {
            const isActive = currentStep === step;
            return (
              <button
                key={step}
                onClick={() => { setIsPlaying(false); onStepChange(step); }}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono transition ${
                  isActive
                    ? 'btn-glow-cyan text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {step}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live System Subsystem Health Lights */}
      <div className="hidden lg:flex items-center gap-3.5 font-mono text-[10px] text-slate-300">
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          <span>WEATHER: OK</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          <span>RIVER GAUGE: OK</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
          <span>SENSORS: 3/4 ONLINE</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          <span>MODEL: OPERATIONAL</span>
        </div>
      </div>

      {/* Timestamp */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-300 bg-slate-900/80 px-3 py-1 rounded-xl border border-slate-800">
        <Clock className="w-3.5 h-3.5 text-cyan-400" />
        <span>2026-08-28 13:48:12 UTC</span>
      </div>
    </div>
  );
};
