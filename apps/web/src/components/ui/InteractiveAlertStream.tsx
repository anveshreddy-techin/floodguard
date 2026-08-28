'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, Bell, ArrowRight, Check, Compass, Radio } from 'lucide-react';
import { SeverityBadge, DataModeBadge } from './Badges';
import { AlertSeverity } from '@/types';

export const InteractiveAlertStream: React.FC = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 'alt-001',
      title: 'Flash Flood Watch: Sunderbans Nagar',
      location: 'Sunderbans Nagar (demo-village-003)',
      time: '2 min ago',
      severity: 'HIGH' as AlertSeverity,
      reason: 'Rainfall acceleration (48mm/3h) + catchment saturation (82%)',
      source: 'RiskEngineDaemon',
      acknowledged: false,
    },
    {
      id: 'alt-002',
      title: 'Gorge Culvert Rate-of-Rise Surge',
      location: 'Bridge Bottleneck KM 0.6',
      time: '8 min ago',
      severity: 'EXTREME' as AlertSeverity,
      reason: 'River stage rise (+0.40m/h) exceeding drainage conduit capacity',
      source: 'RadarGaugeSensor#1',
      acknowledged: false,
    },
  ]);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  return (
    <div className="bg-[#0e1630] border border-[#223354] rounded-xl p-4 space-y-3 shadow-xl text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-400 animate-bounce" />
          <span className="font-mono font-bold text-slate-200 text-xs uppercase tracking-wider">
            INTERACTIVE ALERT STREAM
          </span>
        </div>
        <span className="text-[10px] font-mono bg-orange-950 text-orange-300 px-2 py-0.5 rounded border border-orange-800">
          2 ACTIVE
        </span>
      </div>

      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`p-3 rounded-lg border text-xs space-y-2 transition-all ${
              a.acknowledged
                ? 'bg-slate-900/50 border-slate-800 opacity-60'
                : a.severity === 'EXTREME'
                ? 'bg-rose-950/40 border-rose-700/80 shadow-md ring-1 ring-rose-600/40'
                : 'bg-orange-950/30 border-orange-700/80 shadow-md ring-1 ring-orange-600/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100 text-xs">{a.title}</span>
              <SeverityBadge severity={a.severity} />
            </div>

            <div className="text-[11px] text-slate-300">{a.reason}</div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800">
              <span>{a.time} • Source: {a.source}</span>
            </div>

            <div className="flex items-center gap-1.5 pt-1 text-[11px]">
              <Link
                href="/safety"
                className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center gap-1 transition"
              >
                <Compass className="w-3 h-3" /> GUIDANCE
              </Link>
              <Link
                href="/flight-recorder"
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded font-medium flex items-center gap-1 transition"
              >
                <Radio className="w-3 h-3" /> TRACE
              </Link>
              {!a.acknowledged && (
                <button
                  onClick={() => handleAcknowledge(a.id)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded font-medium ml-auto flex items-center gap-1 transition"
                >
                  <Check className="w-3 h-3 text-emerald-400" /> ACK
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
