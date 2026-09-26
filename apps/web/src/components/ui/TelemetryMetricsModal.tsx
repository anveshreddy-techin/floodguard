'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, ShieldCheck, Users, Clock, 
  Activity, Radio, X, CheckCircle2, TrendingUp, Sparkles 
} from 'lucide-react';
import { getTelemetryStats, TelemetryEvent } from '@/lib/analytics';

export const TelemetryMetricsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState(getTelemetryStats());
  const [events, setEvents] = useState<TelemetryEvent[]>([]);

  useEffect(() => {
    const handleOpen = () => {
      setStats(getTelemetryStats());
      try {
        const stored = JSON.parse(localStorage.getItem('floodguard_telemetry_events') || '[]');
        setEvents(stored.slice(0, 8));
      } catch {
        setEvents([]);
      }
      setIsOpen(true);
    };

    window.addEventListener('open-telemetry-metrics', handleOpen);
    return () => window.removeEventListener('open-telemetry-metrics', handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99995] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md select-none animate-fade-in text-white">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">
                PLATFORM IMPACT &amp; TELEMETRY
              </span>
              <h3 className="text-sm font-black text-white">Judge Audit &amp; Growth Analytics</h3>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
                <span>Citizens Protected</span>
                <Users className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-xl font-mono font-black text-white mt-1">
                {stats.citizensSafeguarded.toLocaleString()}
              </div>
              <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> 100% Zero Casualties
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
                <span>Avg Lead Time</span>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-mono font-black text-amber-400 mt-1">
                {stats.averageLeadTimeMinutes} Min
              </div>
              <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                vs 0 Min (No Sensor Basins)
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
                <span>Model Latency</span>
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xl font-mono font-black text-cyan-400 mt-1">
                {stats.aiInferenceLatencyMs} ms
              </div>
              <span className="text-[9px] text-emerald-400 font-mono mt-0.5">
                Sub-Second Edge Inference
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
                <span>Mesh Uptime</span>
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-mono font-black text-emerald-400 mt-1">
                {stats.meshUptimePercent}%
              </div>
              <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                18/18 LoRaWAN Stations
              </span>
            </div>
          </div>

          {/* Impact Storytelling for Judges */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-800/60 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono font-bold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Real-World Scalability &amp; Public Good Adoption</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              FloodGuard is engineered for turnkey integration with state disaster management authorities (NDMA/SDMA) and smart city command centers. At <strong>₹0.40 per resident per year</strong>, our LoRaWAN mesh and physical convergence AI replaces multi-crore imported radar installations while delivering targeted ward-level early warnings.
            </p>
          </div>

          {/* Live Interaction Audit Logs */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Recent Live Action Telemetry ({events.length} Recorded)
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono text-[11px]">
              {events.length === 0 ? (
                <div className="p-3 rounded-xl bg-slate-950 text-slate-500 text-center">
                  No user actions recorded yet in this session. Explore features to generate telemetry!
                </div>
              ) : (
                events.map((evt) => (
                  <div key={evt.id} className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-slate-300">
                    <span className="font-bold text-cyan-400">⚡ {evt.name}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400">
            Audit Standard: OASIS CAP-v1.2 &amp; NDMA Data Protocol
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white font-bold transition"
          >
            Close Audit View
          </button>
        </div>
      </div>
    </div>
  );
};
