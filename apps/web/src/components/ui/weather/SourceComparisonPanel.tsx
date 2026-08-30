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
    <div className="fp fp-operational p-4 sm:p-5 rounded-2xl space-y-4 border border-slate-800 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-black font-mono text-white tracking-wide uppercase">
            MULTI-PROVIDER SOURCE COMPARISON & AGREEMENT MATRIX
          </h3>
        </div>
        <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-xl border border-cyan-800/60">
          Method: {fusionMethod}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">Data Provider</th>
              <th className="p-3">Source Classification</th>
              <th className="p-3">Status</th>
              <th className="p-3">Observed / Forecast Rain</th>
              <th className="p-3">Freshness & Latency</th>
              <th className="p-3">Cross-Agreement</th>
              <th className="p-3">Integration Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {sources.map((src, i) => {
              const isIMD = src.provider_id === 'imd_weather';
              const isFusion = src.provider_id === 'floodguard_fusion';

              return (
                <tr key={i} className="hover:bg-slate-900/50 transition">
                  <td className="p-3">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      {src.provider_name}
                    </div>
                    <span className="text-[10px] text-slate-500">{src.provider_id}</span>
                  </td>

                  <td className="p-3">
                    {src.official_status && src.official_status.includes('OFFICIAL') ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold">
                        OFFICIAL STATUTORY
                      </span>
                    ) : isFusion ? (
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700 text-[10px] font-bold">
                        AI FUSION MODEL
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700 text-[10px]">
                        PUBLIC NWP / SENSOR
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      src.status === 'OPERATIONAL'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : src.status === 'NOT_CONFIGURED'
                        ? 'bg-slate-800 text-amber-300 border-amber-500/40'
                        : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    }`}>
                      {src.status}
                    </span>
                  </td>

                  <td className="p-3 font-bold">
                    {src.rainfall_observed_or_forecast_mm !== null && src.rainfall_observed_or_forecast_mm !== undefined ? (
                      <span className="text-cyan-300">{src.rainfall_observed_or_forecast_mm.toFixed(1)} mm</span>
                    ) : (
                      <span className="text-slate-500 italic">--</span>
                    )}
                  </td>

                  <td className="p-3 text-[11px]">
                    <div className="text-slate-200">{src.freshness}</div>
                    <div className="text-slate-500">{src.expected_latency_ms} ms avg</div>
                  </td>

                  <td className="p-3">
                    {src.agreement_status === 'AGREE' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> CORROBORATED
                      </span>
                    ) : src.agreement_status === 'DIVERGENT' ? (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-bold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" /> DIVERGENT
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
                        <HelpCircle className="w-3.5 h-3.5" /> INSUFFICIENT DATA
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-[11px] text-slate-400 max-w-xs">
                    {src.notes}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">Truthfulness Rule:</strong> FloodGuard AI does not overwrite or fabricate provider data. If IMD credentials are unconfigured, the system explicitly displays <span className="text-amber-300">NOT_CONFIGURED</span> and routes to public NWP with clear public-forecast attribution.
        </div>
      </div>
    </div>
  );
};
