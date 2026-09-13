'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, CloudLightning, Droplets, CheckCircle2, Clock } from 'lucide-react';

interface WeatherAlertCardProps {
  alerts: any[];
}

export const WeatherAlertCard: React.FC<WeatherAlertCardProps> = ({ alerts = [] }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="text-xs font-mono text-emerald-950">
          <strong className="text-emerald-900 font-bold">NO ACTIVE METEOROLOGICAL DISASTER WATCHES</strong>
          <p className="text-[11px] text-emerald-800 mt-0.5 font-sans">
            Precipitation and convective hazard indicators remain below alert thresholds for this region.
          </p>
        </div>
      </div>
    );
  }

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'EMERGENCY':
      case 'WARNING':
        return {
          cardBg: 'bg-red-50/90 border-2 border-red-400 shadow-sm',
          badgeBg: 'bg-red-600 text-white border-red-700',
          titleColor: 'text-red-950',
        };
      case 'WATCH':
        return {
          cardBg: 'bg-amber-50/90 border-2 border-amber-400 shadow-sm',
          badgeBg: 'bg-amber-500 text-slate-950 border-amber-600',
          titleColor: 'text-amber-950',
        };
      default:
        return {
          cardBg: 'bg-blue-50/90 border-2 border-blue-400 shadow-sm',
          badgeBg: 'bg-blue-600 text-white border-blue-700',
          titleColor: 'text-blue-950',
        };
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
        <div className="p-1 rounded-md bg-red-100 text-red-600">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <span>ACTIVE METEOROLOGICAL ALERT RECOMMENDATIONS ({alerts.length})</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {alerts.map((alt) => {
          const style = getSeverityStyle(alt.severity);

          return (
            <div
              key={alt.alert_id}
              className={`p-4 rounded-2xl border ${style.cardBg} space-y-3 relative overflow-hidden`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-black uppercase border shadow-xs inline-block ${style.badgeBg}`}>
                    {alt.severity} • {alt.category.replace(/_/g, ' ')}
                  </span>
                  <h4 className={`text-xs font-bold font-sans mt-1.5 leading-snug ${style.titleColor}`}>
                    {alt.recommendation_text}
                  </h4>
                </div>

                <div className="text-right shrink-0 bg-white/80 border border-slate-200 px-2 py-1 rounded-lg">
                  <span className="text-[10px] font-mono text-slate-500 block">Horizon:</span>
                  <span className="text-xs font-mono font-black text-slate-900">+{alt.forecast_horizon_hours}h</span>
                </div>
              </div>

              {/* Triggering Variables Grid */}
              {alt.triggering_variables && (
                <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-[11px] font-mono space-y-1 text-slate-700 shadow-xs">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Triggering Evidence:</div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {Object.entries(alt.triggering_variables).map(([k, v]) => (
                      <span key={k}>
                        <span className="text-slate-600">{k.replace(/_/g, ' ')}:</span>{' '}
                        <strong className="text-blue-700 font-bold">{String(v)}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 pt-1 border-t border-slate-300/80">
                <span>Status: <strong className="text-amber-800 font-bold">{alt.operator_review_status}</strong></span>
                <span>Model: <strong className="text-slate-800 font-bold">{alt.model_version}</strong></span>
                <span>Uncertainty: <strong className="text-teal-700 font-bold">{alt.uncertainty}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
