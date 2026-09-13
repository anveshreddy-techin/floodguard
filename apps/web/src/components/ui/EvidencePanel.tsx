import React from 'react';
import { RiskContributor } from '@/types';

export const EvidencePanel: React.FC<{
  contributors?: RiskContributor[];
  evidence?: Array<{ type: string; observation: string; data_mode?: string }>;
  explanation?: { summary?: string; primary_driver?: string; model_note?: string };
}> = ({ contributors = [], evidence = [], explanation }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-sans">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          EXPLAINABLE RISK EVIDENCE TRACE
        </h3>
        <span className="text-xs text-slate-500 font-mono">WHY DID RISK CHANGE?</span>
      </div>

      {explanation?.summary && (
        <div className="mb-4 p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-slate-700">
          <span className="font-bold text-blue-700">Summary: </span>
          {explanation.summary}
        </div>
      )}

      {contributors.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-sans">
            Risk Contributors (Weighted Multi-Source Fusion)
          </div>
          <div className="space-y-2">
            {contributors.map((c, i) => (
              <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-slate-800 capitalize">{c.name.replace('_', ' ')}</span>
                  <span className="font-mono text-blue-700 font-bold">{c.score}/100 (wt: {c.weight})</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1.5">
                  <div 
                    className={`h-full rounded-full ${c.score > 70 ? 'bg-rose-500' : c.score > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${c.score}%` }}
                  />
                </div>
                {c.evidence?.length > 0 && (
                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-1">
                    <span className="text-blue-500">•</span>
                    <span>{c.evidence[0]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {explanation?.model_note && (
        <div className="text-[11px] text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-sans">
          {explanation.model_note}
        </div>
      )}
    </div>
  );
};
