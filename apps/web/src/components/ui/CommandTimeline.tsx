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
    <div className="bg-white/95 border-t border-slate-200 px-3 sm:px-4 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs z-30 select-none backdrop-blur-md shadow-sm">
      {/* Player Controls & Scrubber */}
      <div className="flex items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 text-[11px] font-mono shadow-sm transition active:scale-95 shrink-0 ${
            isPlaying ? 'ring-2 ring-blue-400' : ''
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'PAUSE' : 'REPLAY'}</span>
        </button>

        {/* Speed Multipliers — hidden on mobile */}
        <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 font-mono text-[10px]">
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded-md transition ${
                speed === s ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        <button
          onClick={() => { setIsPlaying(false); onStepChange('T-60m'); }}
          className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition active:scale-95 shadow-sm shrink-0"
          title="Reset to T-60m"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Step Scrubber Pills — horizontally scrollable on mobile */}
        <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-1 overflow-x-auto no-scrollbar max-w-full">
          {timelineSteps.map((step) => {
            const isActive = currentStep === step;
            return (
              <button
                key={step}
                onClick={() => { setIsPlaying(false); onStepChange(step); }}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono transition shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {step}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hotkeys Hint — desktop only */}
      <div className="hidden xl:flex items-center gap-1.5 font-mono text-[10px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
        <span className="text-blue-600 font-bold">KEYS:</span>
        <span className="bg-white px-1 py-0.2 rounded text-slate-800 font-bold border border-slate-200">W</span>
        <span>Roles</span>
        <span className="bg-white px-1 py-0.2 rounded text-slate-800 font-bold border border-slate-200">S</span>
        <span>Safety</span>
        <span className="bg-white px-1 py-0.2 rounded text-slate-800 font-bold border border-slate-200">H</span>
        <span>Hindcast</span>
        <span className="bg-white px-1 py-0.2 rounded text-slate-800 font-bold border border-slate-200">R</span>
        <span>Replay</span>
      </div>

      {/* Live System Subsystem Health Lights — lg+ only */}
      <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-slate-700">
        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>WEATHER: OK</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>RIVER GAUGE: OK</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>SENSORS: 3/4 ONLINE</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>MODEL: OPERATIONAL</span>
        </div>
      </div>

      {/* Timestamp */}
      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
        <Clock className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden sm:inline">2026-08-28 13:48:12 UTC</span>
        <span className="sm:hidden">NOW</span>
      </div>
    </div>
  );
};
