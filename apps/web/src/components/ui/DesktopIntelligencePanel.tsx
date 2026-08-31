'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Minimize2, 
  Maximize2, 
  X, 
  Layers, 
  Activity, 
  ShieldAlert, 
  Compass, 
  Radio, 
  Check, 
  TrendingUp, 
  ExternalLink,
  Bot,
  Sparkles,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { RiskDial } from './RiskDial';
import { InteractiveAlertStream } from './InteractiveAlertStream';
import { WhyRiskChangedPanel } from './WhyRiskChangedPanel';
import { RiskBadge } from './Badges';

interface DesktopIntelligencePanelProps {
  score?: number;
  level?: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  rainfall?: number;
  riverStage?: number;
  locationName?: string;
}

export const DesktopIntelligencePanel: React.FC<DesktopIntelligencePanelProps> = ({
  score = 68.5,
  level = 'HIGH',
  rainfall = 48,
  riverStage = 3.8,
  locationName = 'Sunderbans Nagar (Exposure Target)',
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDocked, setIsDocked] = useState(true);

  if (isMinimized) {
    return (
      <div className="hidden md:flex absolute top-3 right-3 z-[500] animate-fade-in pointer-events-auto">
        <button
          onClick={() => setIsMinimized(false)}
          className="px-3.5 py-2 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.3)] backdrop-blur-xl flex items-center gap-2.5 text-xs font-mono text-white transition active:scale-95 group"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
          <span className="font-black tracking-wider text-amber-300">INTELLIGENCE HUD</span>
          <span className="text-[10px] text-slate-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
            {score} ({level})
          </span>
          <span className="text-[10px] text-cyan-400 group-hover:text-cyan-200 transition font-bold">
            ⛶ Expand
          </span>
        </button>
      </div>
    );
  }

  return (
    <div 
      className="hidden md:flex absolute top-3 right-3 z-[500] flex-col transition-all duration-300 pointer-events-none"
      style={{
        maxHeight: 'calc(100vh - 130px)',
        width: isDocked ? '320px' : '360px',
      }}
    >
      <div 
        className="pointer-events-auto w-full h-full max-h-[calc(100vh-130px)] bg-[#070e1e]/92 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl p-3.5 flex flex-col shadow-[0_15px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.2)] space-y-2.5 overflow-hidden"
      >
        {/* Panel Header with Controls */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.9)]" />
            <div className="min-w-0">
              <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider truncate">
                INTELLIGENCE HUB
              </h3>
              <div className="text-[10px] font-mono text-slate-400 truncate max-w-[180px]">{locationName}</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <button
              onClick={() => setIsDocked(!isDocked)}
              className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition"
              title={isDocked ? 'Wider View' : 'Compact Dock'}
            >
              {isDocked ? <ExternalLink className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5 text-cyan-400" />}
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition"
              title="Minimize HUD to top pill"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Intelligence Content (Strictly bounded so it never overflows) */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
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
