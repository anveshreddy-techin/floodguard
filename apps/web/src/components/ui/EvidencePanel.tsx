import React from 'react';
import { RiskContributor } from '@/types';

export const EvidencePanel: React.FC<{
  contributors?: RiskContributor[];
  evidence?: Array<{ type: string; observation: string; data_mode?: string }>;
  explanation?: { summary?: string; primary_driver?: string; model_note?: string };
}> = ({ contributors = [], evidence = [], explanation }) => {
  return (
    <div className="bg-[#1c2541] border border-[#3a506b] rounded-lg p-5">
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          EXPLAINABLE RISK EVIDENCE TRACE
        </h3>
        <span className="text-xs text-slate-400 font-mono">WHY DID RISK CHANGE?</span>
      </div>

      {explanation?.summary && (
        <div className="mb-4 p-3 bg-slate-900/90 rounded border border-slate-700/80 text-xs text-slate-200">
          <span className="font-semibold text-cyan-300">Summary: </span>
          {explanation.summary}
        </div>
      )}

      {contributors.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Risk Contributors (Weighted Multi-Source Fusion)
          </div>
          <div className="space-y-2">
            {contributors.map((c, i) => (
              <div key={i} className="bg-slate-900/60 p-2.5 rounded border border-slate-800 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-300 capitalize">{c.name.replace('_', ' ')}</span>
                  <span className="font-mono text-cyan-400 font-semibold">{c.score}/100 (wt: {c.weight})</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1.5">
                  <div 
                    className={`h-full ${c.score > 70 ? 'bg-rose-500' : c.score > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${c.score}%` }}
                  />
                </div>
                {c.evidence?.length > 0 && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span className="text-slate-500">•</span>
                    <span>{c.evidence[0]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {explanation?.model_note && (
        <div className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded border border-slate-800">
          {explanation.model_note}
        </div>
      )}
    </div>
  );
};
