'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, CloudLightning, Droplets, CheckCircle2, Clock } from 'lucide-react';

interface WeatherAlertCardProps {
  alerts: any[];
}

export const WeatherAlertCard: React.FC<WeatherAlertCardProps> = ({ alerts = [] }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="fp p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        <div className="text-xs font-mono text-emerald-300">
          <strong>NO ACTIVE METEOROLOGICAL DISASTER WATCHES</strong>
          <p className="text-[11px] text-emerald-400/80 mt-0.5">
            Precipitation and convective hazard indicators remain below alert thresholds for this region.
          </p>
        </div>
      </div>
    );
  }

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'EMERGENCY':
      case 'WARNING': return 'bg-rose-950/40 border-rose-500/60 text-rose-300';
      case 'WATCH': return 'bg-amber-950/40 border-amber-500/60 text-amber-300';
      default: return 'bg-cyan-950/40 border-cyan-500/60 text-cyan-300';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
        <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
        <span>ACTIVE METEOROLOGICAL ALERT RECOMMENDATIONS ({alerts.length})</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {alerts.map((alt) => (
          <div
            key={alt.alert_id}
            className={`p-4 rounded-2xl border ${getSeverityStyle(alt.severity)} shadow-xl space-y-3 relative overflow-hidden`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-slate-900/80 border border-current">
                  {alt.severity} • {alt.category.replace(/_/g, ' ')}
                </span>
                <h4 className="text-xs font-bold font-sans text-white mt-1">
                  {alt.recommendation_text}
                </h4>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-slate-400 block">Horizon:</span>
                <span className="text-xs font-mono font-bold text-white">+{alt.forecast_horizon_hours}h</span>
              </div>
            </div>

            {/* Triggering Variables Grid */}
            {alt.triggering_variables && (
              <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl text-[11px] font-mono space-y-1 text-slate-300">
                <div className="text-[9px] text-slate-400 uppercase font-bold">Triggering Evidence:</div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {Object.entries(alt.triggering_variables).map(([k, v]) => (
                    <span key={k}>
                      {k.replace(/_/g, ' ')}: <strong className="text-cyan-300">{String(v)}</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-current/20">
              <span>Status: <strong className="text-amber-300">{alt.operator_review_status}</strong></span>
              <span>Model: <strong className="text-slate-300">{alt.model_version}</strong></span>
              <span>Uncertainty: <strong className="text-teal-300">{alt.uncertainty}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
