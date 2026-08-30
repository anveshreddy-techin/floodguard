'use client';

import React from 'react';
import { Activity, ShieldCheck, CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';

interface WeatherQualityPanelProps {
  qualityReports: any[];
}

export const WeatherQualityPanel: React.FC<WeatherQualityPanelProps> = ({ qualityReports = [] }) => {
  return (
    <div className="fp fp-operational p-4 sm:p-5 rounded-2xl space-y-4 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-black font-mono text-white tracking-wide uppercase">
            PROVIDER TELEMETRY QUALITY & FRESHNESS COMPLIANCE
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
          Continuous Ingestion Audit
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {qualityReports.map((q, i) => (
          <div
            key={i}
            className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase">
                {q.provider_id.replace(/_/g, ' ')}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                q.quality_grade === 'GRADE_A'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {q.quality_grade}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="text-[9px] text-slate-500">COMPLETENESS</div>
                <div className="font-bold text-cyan-300">{q.completeness_pct}%</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="text-[9px] text-slate-500">AVG LATENCY</div>
                <div className="font-bold text-teal-300">{q.latency_avg_ms} ms</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="text-[9px] text-slate-500">FRESHNESS RATE</div>
                <div className="font-bold text-emerald-300">{q.freshness_compliance_pct}%</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="text-[9px] text-slate-500">SPIKE ANOMALIES</div>
                <div className="font-bold text-amber-300">{q.spike_anomaly_count}</div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between pt-1 border-t border-slate-800/60">
              <span>Records: {q.total_records_processed.toLocaleString()}</span>
              <span>Audited: Just now</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
