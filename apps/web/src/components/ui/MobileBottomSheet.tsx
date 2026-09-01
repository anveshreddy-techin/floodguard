'use client';

import React, { useState, useRef } from 'react';
import { 
  Activity, 
  ChevronUp, 
  ChevronDown, 
  X, 
  ShieldAlert, 
  Droplets, 
  TrendingUp, 
  Compass, 
  Radio, 
  Check, 
  Zap,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { RiskDial } from './RiskDial';
import { InteractiveAlertStream } from './InteractiveAlertStream';
import { WhyRiskChangedPanel } from './WhyRiskChangedPanel';

interface MobileBottomSheetProps {
  score?: number;
  level?: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  rainfall?: number;
  riverStage?: number;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  score = 68.5,
  level = 'HIGH',
  rainfall = 48,
  riverStage = 3.8,
  isOpen,
  onToggle,
  onClose,
}) => {
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY !== null) {
      setCurrentY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    if (startY !== null && currentY !== null) {
      const deltaY = currentY - startY;
      if (deltaY > 50 && isOpen) {
        onClose(); // Swipe down to collapse
      } else if (deltaY < -50 && !isOpen) {
        onToggle(); // Swipe up to expand
      }
    }
    setStartY(null);
    setCurrentY(null);
  };

  return (
    <div 
      className={`md:hidden fixed inset-x-0 bottom-16 z-[650] transition-all duration-300 ease-out select-none ${
        isOpen ? 'max-h-[44vh] h-[44vh]' : 'h-12'
      }`}
    >
      <div 
        className="w-full h-full bg-gradient-to-b from-[#0c1a3a]/98 via-[#09152e]/98 to-[#050d20]/98 backdrop-blur-2xl border-t-2 border-cyan-400/50 rounded-t-3xl shadow-[0_-12px_40px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden"
        style={{
          boxShadow: '0 -10px 35px rgba(6, 182, 212, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle Bar (Always visible & tap-friendly) */}
        <div 
          onClick={onToggle}
          className="h-12 px-4 flex items-center justify-between cursor-pointer shrink-0 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/60 via-cyan-950/30 to-slate-900/60 active:bg-cyan-900/30 transition"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shadow-[0_0_10px_rgba(244,63,94,1)]" />
            <span className="text-xs font-mono font-black text-white uppercase tracking-tight flex items-center gap-1.5">
              <span className="text-rose-400">Risk: {score}</span>
              <span className="px-1.5 py-0.2 rounded bg-rose-950/80 border border-rose-600/50 text-[10px] text-rose-300 font-bold">
                {level}
              </span>
              <span className="text-[10px] text-cyan-300 font-normal hidden xs:inline">• {rainfall}mm/3h</span>
            </span>
          </div>

          {/* Center Drag Pill Indicator */}
          <div className="w-12 h-1.5 rounded-full bg-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.6)] my-auto" />

          {/* Right Action Trigger */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 font-bold bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-lg shadow-sm">
            <span>{isOpen ? 'Minimize' : 'Intel HUB'}</span>
            {isOpen ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronUp className="w-4 h-4 text-cyan-400 animate-bounce" />}
          </div>
        </div>

        {/* Expandable Content Area (Visible when open) */}
        {isOpen && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs pb-6 bg-[#081228]/80">
            <div className="flex items-center justify-between pb-1 border-b border-cyan-500/20">
              <span className="text-[10px] font-mono text-cyan-300 uppercase font-black tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                ACTIVE DISASTER INTELLIGENCE
              </span>
              <button
                onClick={onClose}
                className="text-[11px] font-mono text-cyan-300 hover:text-white bg-slate-900/90 px-2.5 py-0.5 rounded-lg border border-cyan-500/40 shadow-sm"
              >
                ✕ Hide
              </button>
            </div>

            {/* Risk Gauge */}
            <RiskDial
              score={score}
              level={level}
              trendDelta={14.2}
              primaryDriver={`Rainfall ${rainfall}mm/3h + River Stage ${riverStage}m`}
              dataFreshness="Updated 2 min ago"
            />

            {/* Alert Stream */}
            <InteractiveAlertStream />

            {/* Why Risk Changed Tabs */}
            <WhyRiskChangedPanel />
          </div>
        )}
      </div>
    </div>
  );
};
