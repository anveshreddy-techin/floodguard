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
  Bot
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
  locationName = 'Sunderbans Nagar',
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDocked, setIsDocked] = useState(true);

  if (isMinimized) {
    return (
      <div className="hidden md:flex absolute top-4 right-4 z-[700] animate-fade-in pointer-events-auto">
        <button
          onClick={() => setIsMinimized(false)}
          className="glass-panel-glow px-4 py-2 rounded-2xl flex items-center gap-2.5 text-xs font-mono text-white shadow-2xl hover:border-cyan-400/80 transition active:scale-95 group"
          style={{ border: '1.5px solid #E67E22', boxShadow: '0 0 20px rgba(230,126,34,0.3)' }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
          <span className="font-bold tracking-wider">RISK: {score} ({level})</span>
          <span className="text-[10px] text-slate-400 group-hover:text-cyan-300 transition">⛶ Expand HUB</span>
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`hidden md:flex absolute top-4 right-4 bottom-20 z-[700] flex-col transition-all duration-300 pointer-events-none ${
        isDocked ? 'w-80 xl:w-[340px]' : 'w-96'
      }`}
    >
      <div 
        className="pointer-events-auto w-full h-full bg-[#0a1124]/90 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-4 flex flex-col shadow-2xl space-y-3 overflow-hidden"
        style={{
          boxShadow: '0 10px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)'
        }}
      >
        {/* Panel Header with Controls */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <div>
              <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider">
                INTELLIGENCE HUB
              </h3>
              <div className="text-[10px] font-mono text-slate-400">{locationName}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              onClick={() => setIsDocked(!isDocked)}
              className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition"
              title={isDocked ? 'Float panel' : 'Dock panel'}
            >
              {isDocked ? <ExternalLink className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5 text-cyan-400" />}
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition"
              title="Minimize to top pill"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Intelligence Content */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
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
