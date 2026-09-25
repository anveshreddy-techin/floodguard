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
        isOpen ? 'max-h-[44vh] h-[44vh]' : 'h-14'
      }`}
    >
      <div 
        className="w-full h-full bg-white border-t-2 border-blue-500/40 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── Visual Drag-Handle Pill (always visible, universally understood) ── */}
        <div className="flex justify-center pt-2.5 pb-0 shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* ── Collapsed Handle Bar (tap to expand / collapse) ── */}
        <div 
          onClick={onToggle}
          className="h-10 px-4 flex items-center justify-between cursor-pointer shrink-0 active:bg-slate-50 transition"
        >
          {/* Left: Risk indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span className="text-xs font-mono font-black text-slate-900">
              RISK:
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-100 border border-red-300 text-[11px] text-red-700 font-black font-mono">
              {level}
            </span>
            <span className="text-[11px] font-black text-rose-600 font-mono">{score}</span>
            <span className="hidden xs:inline text-[10px] text-blue-600 font-medium">· {rainfall}mm/3h</span>
          </div>

          {/* Right: Clear expand/collapse CTA */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-blue-700 font-bold bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg shadow-sm">
            <span>{isOpen ? 'Hide' : 'Details'}</span>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-blue-500" /> : <ChevronUp className="w-3.5 h-3.5 text-blue-500 animate-bounce" />}
          </div>
        </div>

        {/* ── Expandable Content Area ── */}
        {isOpen && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs pb-6 bg-[#F0F4F8]">
            <div className="flex items-center justify-between pb-1 border-b border-slate-300">
              <span className="text-[10px] font-mono text-slate-700 uppercase font-black tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                DISASTER INTELLIGENCE
              </span>
              <button
                onClick={onClose}
                className="text-[11px] font-mono text-slate-600 hover:text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-300 shadow-sm"
              >
                ✕ Close
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
