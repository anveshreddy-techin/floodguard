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
        isOpen ? 'max-h-[42vh] h-[42vh]' : 'h-12'
      }`}
    >
      <div 
        className="w-full h-full bg-[#0a1124]/95 backdrop-blur-2xl border-t border-cyan-500/40 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
        style={{
          boxShadow: '0 -10px 35px rgba(0, 168, 232, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle Bar (Always visible & tap-friendly) */}
        <div 
          onClick={onToggle}
          className="h-12 px-4 flex items-center justify-between cursor-pointer shrink-0 border-b border-slate-800/60 active:bg-slate-800/40 transition"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping shadow-[0_0_8px_rgba(249,115,22,1)]" />
            <span className="text-xs font-mono font-black text-white uppercase tracking-tight flex items-center gap-1.5">
              <span>Risk: {score} ({level})</span>
              <span className="text-[10px] text-cyan-400 font-normal hidden xs:inline">• {rainfall}mm/3h</span>
            </span>
          </div>

          {/* Center Drag Pill Indicator */}
          <div className="w-10 h-1 rounded-full bg-slate-600/80 my-auto" />

          {/* Right Action Trigger */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 font-bold">
            <span>{isOpen ? 'Minimize' : 'Intelligence HUB'}</span>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4 animate-bounce" />}
          </div>
        </div>

        {/* Expandable Content Area (Visible when open) */}
        {isOpen && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs pb-6">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                ACTIVE DISASTER INTELLIGENCE
              </span>
              <button
                onClick={onClose}
                className="text-[11px] font-mono text-slate-400 hover:text-white bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-700"
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
