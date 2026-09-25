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
    <>
      {/* ── Soft Dimming Backdrop when expanded (tap to close) ── */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="md:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] z-[640] transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* ── Bottom Sheet Container ── */}
      <div 
        className={`md:hidden fixed inset-x-0 bottom-16 z-[650] transition-all duration-300 ease-out select-none ${
          isOpen ? 'h-[68vh] max-h-[68vh]' : 'h-13'
        }`}
      >
        <div 
          className="w-full h-full bg-white border-t border-slate-200 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* ── Top Drag-Handle Pill ── */}
          <div 
            onClick={onToggle}
            className="flex justify-center pt-2 pb-1 shrink-0 cursor-pointer bg-slate-50 border-b border-slate-100"
          >
            <div className="w-10 h-1.5 rounded-full bg-slate-300 hover:bg-slate-400 transition" />
          </div>

          {/* ── SINGLE UNIFIED HEADER (No duplicate rows!) ── */}
          <div 
            className="h-11 px-4 flex items-center justify-between shrink-0 bg-slate-50/80 border-b border-slate-200"
          >
            {!isOpen ? (
              /* Collapsed State Header */
              <div 
                onClick={onToggle}
                className="flex items-center justify-between w-full cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span className="text-xs font-mono font-bold text-slate-800">
                    RISK:
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 border border-red-300 text-[11px] text-red-700 font-black font-mono">
                    {level} {score}
                  </span>
                  <span className="text-[11px] text-blue-700 font-mono font-semibold">
                    · 🌧️ {rainfall}mm
                  </span>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); onToggle(); }}
                  className="flex items-center gap-1 text-[11px] font-mono text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg shadow-xs transition"
                >
                  <span>Details</span>
                  <ChevronUp className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
                </button>
              </div>
            ) : (
              /* Expanded State Header (Single, clean, definitive) */
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
                  <span className="text-xs font-mono font-black text-slate-900 tracking-tight truncate">
                    DISASTER INTELLIGENCE
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 border border-red-300 text-[10px] text-red-700 font-black font-mono shrink-0">
                    {level} {score}
                  </span>
                </div>

                <button
                  onClick={onClose}
                  className="flex items-center gap-1 text-[11px] font-mono text-slate-700 font-bold bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1 rounded-lg shadow-xs transition active:scale-95 shrink-0"
                >
                  <X className="w-3.5 h-3.5 text-slate-500" />
                  <span>Close</span>
                </button>
              </div>
            )}
          </div>

          {/* ── Scrollable Intelligence Body (Visible when open) ── */}
          {isOpen && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs pb-8 bg-[#F0F4F8]">
              {/* Risk Gauge Dial */}
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
    </>
  );
};
