'use client';

import React from 'react';
import { Activity, ShieldCheck, CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';

interface WeatherQualityPanelProps {
  qualityReports: any[];
}

export const WeatherQualityPanel: React.FC<WeatherQualityPanelProps> = ({ qualityReports = [] }) => {
  return (
    <div className="bg-white border border-slate-200 shadow-sm p-4 sm:p-5 rounded-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black font-mono text-slate-900 tracking-wide uppercase">
            PROVIDER TELEMETRY QUALITY & FRESHNESS COMPLIANCE
          </h3>
        </div>
        <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300 w-fit">
          Continuous Ingestion Audit
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {qualityReports.map((q, i) => (
          <div
            key={i}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-slate-900 uppercase">
                {q.provider_id.replace(/_/g, ' ')}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                q.quality_grade === 'GRADE_A'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {q.quality_grade}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-700">
              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div className="text-[9px] text-slate-500 font-bold">COMPLETENESS</div>
                <div className="font-black text-blue-700 text-sm">{q.completeness_pct}%</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div className="text-[9px] text-slate-500 font-bold">AVG LATENCY</div>
                <div className="font-black text-teal-700 text-sm">{q.latency_avg_ms} ms</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div className="text-[9px] text-slate-500 font-bold">FRESHNESS RATE</div>
                <div className="font-black text-emerald-700 text-sm">{q.freshness_compliance_pct}%</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div className="text-[9px] text-slate-500 font-bold">SPIKE ANOMALIES</div>
                <div className="font-black text-amber-700 text-sm">{q.spike_anomaly_count}</div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200">
              <span>Records: {q.total_records_processed.toLocaleString()}</span>
              <span className="font-semibold text-emerald-700">Audited: Just now</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
