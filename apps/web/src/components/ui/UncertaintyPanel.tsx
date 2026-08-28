import React from 'react';
import { UncertaintyLevel } from '@/types';
import { UncertaintyBadge } from './Badges';

export const UncertaintyPanel: React.FC<{
  uncertainty?: UncertaintyLevel;
  confidence?: UncertaintyLevel;
  dataGaps?: string[];
  limitations?: string[];
}> = ({
  uncertainty = 'MEDIUM',
  confidence = 'LOW',
  dataGaps = [],
  limitations = [],
}) => {
  return (
    <div className="bg-[#1c2541] border border-[#3a506b] rounded-lg p-5">
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          UNCERTAINTY & DATA GAP INTELLIGENCE
        </h3>
        <UncertaintyBadge level={uncertainty} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 text-xs">
          <div className="text-slate-400">Confidence Rating</div>
          <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">{confidence}</div>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 text-xs">
          <div className="text-slate-400">Uncertainty State</div>
          <div className="text-sm font-mono font-bold text-amber-400 mt-0.5">{uncertainty}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <span>WHAT DATA IS MISSING?</span>
        </div>
        {dataGaps.length > 0 ? (
          <ul className="space-y-1.5 text-xs text-slate-300">
            {dataGaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-1.5 bg-slate-900/50 p-2 rounded border border-slate-800/80">
                <span className="text-amber-500 font-bold">⚠</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-slate-400 italic">No critical telemetry gaps flagged.</div>
        )}
      </div>

      <div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Model Limitations
        </div>
        <ul className="text-[11px] text-slate-400 space-y-1">
          {limitations.map((lim, i) => (
            <li key={i}>• {lim}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
