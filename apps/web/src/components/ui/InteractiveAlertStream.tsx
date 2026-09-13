'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, Bell, ArrowRight, Check, Compass, Radio, Zap } from 'lucide-react';
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
    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2.5 shadow-sm text-xs overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Bell className="w-3.5 h-3.5 text-orange-500 animate-bounce shrink-0" />
          <span className="font-mono font-black text-slate-900 text-xs uppercase tracking-wider truncate">
            ACTIVE ALERTS
          </span>
        </div>
        <span className="text-[10px] font-mono bg-red-50 text-red-700 px-2 py-0.5 rounded-lg border border-red-200 font-bold shrink-0">
          2 ACTIVE
        </span>
      </div>

      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`p-3 rounded-xl border text-xs space-y-2 transition-all ${
              a.acknowledged
                ? 'bg-slate-50 border-slate-200 opacity-60'
                : a.severity === 'EXTREME'
                ? 'bg-red-50 border-red-400 ring-1 ring-red-300'
                : 'bg-orange-50 border-orange-400 ring-1 ring-orange-200'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-slate-900 text-xs truncate min-w-0">{a.title}</span>
              <SeverityBadge severity={a.severity} />
            </div>

            <div className="text-[11px] text-slate-700 leading-snug break-words">{a.reason}</div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-200">
              <span className="truncate">{a.time} • {a.source}</span>
            </div>

            <div className="flex items-center flex-wrap gap-1.5 pt-1 text-[10px]">
              <Link
                href="/safety"
                className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-white rounded-lg font-bold flex items-center gap-1 transition"
              >
                <Compass className="w-3 h-3" /> GUIDANCE
              </Link>
              <Link
                href="/flight-recorder"
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg font-mono font-medium flex items-center gap-1 transition"
              >
                <Radio className="w-3 h-3" /> TRACE
              </Link>
              {!a.acknowledged && (
                <button
                  onClick={() => handleAcknowledge(a.id)}
                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg font-medium ml-auto flex items-center gap-1 transition active:scale-95"
                >
                  <Check className="w-3 h-3 text-emerald-600" /> ACK
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
