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
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
        <h3 className="text-sm font-bold font-sans text-slate-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          UNCERTAINTY & DATA GAP INTELLIGENCE
        </h3>
        <UncertaintyBadge level={uncertainty} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-sans">
          <div className="text-slate-500 font-medium">Confidence Rating</div>
          <div className="text-sm font-bold text-slate-900 mt-0.5">{confidence}</div>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-sans">
          <div className="text-slate-500 font-medium">Uncertainty State</div>
          <div className="text-sm font-bold text-amber-700 mt-0.5">{uncertainty}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs font-bold font-sans text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1">
          <span>WHAT DATA IS MISSING?</span>
        </div>
        {dataGaps.length > 0 ? (
          <ul className="space-y-1.5 text-xs font-sans text-slate-800">
            {dataGaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-2 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/80">
                <span className="text-amber-600 font-bold">⚠</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-slate-500 italic font-sans">No critical telemetry gaps flagged.</div>
        )}
      </div>

      <div>
        <div className="text-xs font-bold font-sans text-slate-700 uppercase tracking-wider mb-1.5">
          Model Limitations
        </div>
        <ul className="text-xs font-sans text-slate-600 space-y-1">
          {limitations.map((lim, i) => (
            <li key={i}>• {lim}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
