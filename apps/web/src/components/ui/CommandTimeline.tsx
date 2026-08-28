'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Activity, ShieldAlert, Clock, Radio, CheckCircle2 } from 'lucide-react';

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
    <div className="bg-[#0b132b]/95 border-t border-[#223354] px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs z-30 select-none">
      {/* Player Controls & Scrubber */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition shadow-md flex items-center gap-1 font-bold text-[11px]"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'PAUSE' : 'REPLAY'}</span>
        </button>

        {/* Speed buttons */}
        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 font-mono text-[10px]">
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-1.5 py-0.5 rounded transition ${
                speed === s ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Step Scrubber */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-lg p-1">
          {timelineSteps.map((step) => {
            const isActive = currentStep === step;
            return (
              <button
                key={step}
                onClick={() => { setIsPlaying(false); onStepChange(step); }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
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
      <div className="hidden lg:flex items-center gap-3 font-mono text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>WEATHER: OK</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>RIVER GAUGE: OK</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>SENSORS: 3/4 ONLINE</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>MODEL: OPERATIONAL</span>
        </div>
      </div>

      {/* Timestamp */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
        <Clock className="w-3.5 h-3.5 text-cyan-400" />
        <span>2026-08-28 13:48:12 UTC</span>
      </div>
    </div>
  );
};
