'use client';

import React from 'react';
import { ShieldAlert, ArrowUpRight, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { RiskLevel, UncertaintyLevel } from '@/types';
import { RiskBadge, UncertaintyBadge } from './Badges';

interface RiskDialProps {
  score: number;
  level: RiskLevel;
  trendDelta?: number;
  uncertainty?: UncertaintyLevel;
  primaryDriver?: string;
  dataFreshness?: string;
}

export const RiskDial: React.FC<RiskDialProps> = ({
  score = 68.5,
  level = 'HIGH',
  trendDelta = 14.2,
  uncertainty = 'MEDIUM',
  primaryDriver = 'Rainfall Accumulation (3h)',
  dataFreshness = '3 min ago',
}) => {
  // SVG gauge constants
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference * 0.75; // 270 deg gauge

  const colorMap: Record<RiskLevel, string> = {
    LOW: '#10b981',
    MODERATE: '#f59e0b',
    HIGH: '#f97316',
    EXTREME: '#ef4444',
    UNKNOWN: '#64748b',
  };

  const activeColor = colorMap[level] || '#f97316';

  return (
    <div className="bg-[#0e1630] border border-[#223354] rounded-xl p-4 space-y-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
            COMPOSITE RISK TRAJECTORY
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{dataFreshness}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* SVG Circular Dial Gauge */}
        <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-135" viewBox="0 0 160 160">
            {/* Background Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * 0.25}
              strokeLinecap="round"
            />
            {/* Foreground Active Risk Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={activeColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Dial Score Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black font-mono text-slate-100">{score}</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">/ 100</span>
          </div>
        </div>

        {/* Trajectory & Risk Details */}
        <div className="flex-1 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <RiskBadge level={level} />
            <span className="font-mono text-[11px] text-orange-400 flex items-center gap-0.5 font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> +{trendDelta} pts
            </span>
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[10px] uppercase font-mono">Primary Driver</div>
            <div className="font-semibold text-slate-200 text-[11px] truncate">{primaryDriver}</div>
          </div>

          <div className="flex items-center justify-between pt-1 font-mono text-[10px]">
            <span className="text-slate-400">TRAJECTORY:</span>
            <span className="text-slate-300 font-bold">MOD → HIGH</span>
          </div>
        </div>
      </div>
    </div>
  );
};
