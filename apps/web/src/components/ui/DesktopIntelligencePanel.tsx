'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { RiskDial } from './RiskDial';
import { InteractiveAlertStream } from './InteractiveAlertStream';
import { WhyRiskChangedPanel } from './WhyRiskChangedPanel';

interface DesktopIntelligencePanelProps {
  score?: number;
  level?: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  rainfall?: number;
  riverStage?: number;
  locationName?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const DesktopIntelligencePanel: React.FC<DesktopIntelligencePanelProps> = ({
  score = 68.5,
  level = 'HIGH',
  rainfall = 48,
  riverStage = 3.8,
  locationName = 'Sunderbans Nagar (Exposure Target)',
  isOpen = false,
  onClose = () => {},
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex justify-end pointer-events-auto select-none">
      {/* Dimmed Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Slide-in Operations Drawer */}
      <div 
        className="relative w-full max-w-md h-full bg-white border-l border-slate-200 shadow-2xl p-4 flex flex-col space-y-3 z-10 animate-slide-left font-sans text-slate-800"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
            <div className="min-w-0">
              <h3 className="text-sm font-mono font-black text-slate-900 uppercase tracking-wider truncate">
                INTELLIGENCE HUB
              </h3>
              <div className="text-xs font-mono text-slate-500 truncate max-w-[220px]">
                {locationName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-orange-100 text-orange-800 border border-orange-200">
              {score} ({level})
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition active:scale-95"
              title="Close Intelligence Hub (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-300">
          {/* Quick link to 4. Live Dashboard & Alerts */}
          <Link
            href="/dashboard"
            className="w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-mono text-xs font-black flex items-center justify-between shadow-md transition active:scale-95 border border-red-400/50"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>4. LIVE DASHBOARD &amp; ALERTS</span>
            </div>
            <span className="text-[10px] bg-red-950/80 px-2 py-0.5 rounded-full border border-red-400/60 font-mono">
              82% RISK ➔
            </span>
          </Link>

          {/* Risk Dial Gauge */}
          <RiskDial
            score={score}
            level={level}
            trendDelta={14.2}
            primaryDriver={`Rainfall ${rainfall}mm/3h + Soil 82% Saturation`}
            dataFreshness="Updated 2 min ago"
          />

          {/* Interactive Alert Stream */}
          <InteractiveAlertStream />

          {/* Why Risk Changed / Missing Evidence Tabs */}
          <WhyRiskChangedPanel />
        </div>
      </div>
    </div>
  );
};
