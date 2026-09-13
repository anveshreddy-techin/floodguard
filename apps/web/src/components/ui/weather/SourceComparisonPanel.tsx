'use client';

import React from 'react';
import { Layers, CheckCircle2, AlertTriangle, HelpCircle, ShieldAlert, Radio, Database, Info } from 'lucide-react';

interface SourceComparisonPanelProps {
  sources: any[];
  fusionMethod?: string;
}

export const SourceComparisonPanel: React.FC<SourceComparisonPanelProps> = ({
  sources = [],
  fusionMethod = 'Hierarchical Authoritative Priority with Fallback Fusion',
}) => {
  return (
    <div className="bg-white border border-slate-200 shadow-sm p-4 sm:p-5 rounded-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black font-mono text-slate-900 tracking-wide uppercase">
            MULTI-PROVIDER SOURCE COMPARISON & AGREEMENT MATRIX
          </h3>
        </div>
        <div className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 w-fit">
          Method: {fusionMethod}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
            <tr>
              <th className="p-3 font-black">Data Provider</th>
              <th className="p-3 font-black">Source Classification</th>
              <th className="p-3 font-black">Status</th>
              <th className="p-3 font-black">Observed / Forecast Rain</th>
              <th className="p-3 font-black">Freshness & Latency</th>
              <th className="p-3 font-black">Cross-Agreement</th>
              <th className="p-3 font-black">Integration Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {sources.map((src, i) => {
              const isFusion = src.provider_id === 'floodguard_fusion';

              return (
                <tr key={i} className="hover:bg-slate-50/80 transition">
                  <td className="p-3">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      {src.provider_name}
                    </div>
                    <span className="text-[10px] text-slate-500">{src.provider_id}</span>
                  </td>

                  <td className="p-3">
                    {src.official_status && src.official_status.includes('OFFICIAL') ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                        OFFICIAL STATUTORY
                      </span>
                    ) : isFusion ? (
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold">
                        AI FUSION MODEL
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-semibold">
                        PUBLIC NWP / SENSOR
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      src.status === 'OPERATIONAL'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : src.status === 'NOT_CONFIGURED'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-purple-100 text-purple-800 border-purple-300'
                    }`}>
                      {src.status}
                    </span>
                  </td>

                  <td className="p-3 font-black">
                    {src.rainfall_observed_or_forecast_mm !== null && src.rainfall_observed_or_forecast_mm !== undefined ? (
                      <span className="text-blue-700 font-black text-sm">{src.rainfall_observed_or_forecast_mm.toFixed(1)} mm</span>
                    ) : (
                      <span className="text-slate-400 italic">--</span>
                    )}
                  </td>

                  <td className="p-3 text-[11px]">
                    <div className="text-slate-900 font-semibold">{src.freshness}</div>
                    <div className="text-slate-500">{src.expected_latency_ms} ms avg</div>
                  </td>

                  <td className="p-3">
                    {src.agreement_status === 'AGREE' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> CORROBORATED
                      </span>
                    ) : src.agreement_status === 'DIVERGENT' ? (
                      <span className="inline-flex items-center gap-1 text-red-700 font-bold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> DIVERGENT
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
                        <HelpCircle className="w-3.5 h-3.5" /> INSUFFICIENT DATA
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-[11px] text-slate-600 max-w-xs font-sans">
                    {src.notes}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-blue-50/90 border border-blue-200 rounded-xl text-[11px] font-mono text-slate-800 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="font-sans leading-relaxed">
          <strong className="text-slate-900 font-mono">Truthfulness Rule:</strong> FloodGuard AI does not overwrite or fabricate provider data. If IMD credentials are unconfigured, the system explicitly displays <span className="font-bold text-amber-800 font-mono bg-amber-100 px-1 rounded">NOT_CONFIGURED</span> and routes to public NWP with clear public-forecast attribution.
        </div>
      </div>
    </div>
  );
};
