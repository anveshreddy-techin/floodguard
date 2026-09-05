'use client';

import React from 'react';
import { useAdaptive } from '@/context/AdaptiveContext';
import { AlertTriangle, Info, ShieldAlert, PhoneCall } from 'lucide-react';

export const PublicNotice: React.FC = () => {
  const { operatingMode, dataMode } = useAdaptive();

  return (
    <aside aria-label="Institutional Disclaimer and Mode Notice" className="w-full space-y-2 mb-6">
      {/* Primary Institutional Non-Impersonation Notice */}
      <div className="bg-amber-50 border border-amber-300 rounded p-3 text-amber-950 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-amber-900 leading-snug">
              Research / Pilot Platform Notice — Not an Official Government Emergency Dispatch Agency
            </p>
            <p className="text-amber-800 leading-relaxed">
              FloodGuard AI is a disaster intelligence decision-support platform engineered for Smart India Hackathon (SIH26192). In case of immediate life safety hazards, flash floods, or evacuation orders, always follow instructions from local district administration and dial <strong>National Emergency Helpline 112</strong>.
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2 self-end sm:self-center">
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded text-xs transition active:scale-95 whitespace-nowrap shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency 112</span>
          </a>
        </div>
      </div>

      {/* Mode Isolation Strip: DEMO vs REAL/PILOT */}
      <div className={`px-3 py-1.5 rounded border text-xs flex items-center justify-between gap-2 ${
        operatingMode === 'DEMO'
          ? 'bg-blue-50 border-blue-200 text-blue-900'
          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
      }`}>
        <div className="flex items-center gap-2">
          <Info className={`w-3.5 h-3.5 ${operatingMode === 'DEMO' ? 'text-blue-700' : 'text-emerald-700'}`} />
          <span>
            {operatingMode === 'DEMO' ? (
              <>
                <strong>DEMO MODE ACTIVE:</strong> Catchment telemetry and rainfall triggers are simulated for demonstration. Figures do not represent real-time conditions.
              </>
            ) : (
              <>
                <strong>REAL / PILOT MODE ACTIVE:</strong> Live open satellite precipitation and verified hydrologic telemetry feeds are active where configured.
              </>
            )}
          </span>
        </div>

        <span className="text-[10px] font-mono uppercase bg-white/80 px-2 py-0.5 rounded border border-slate-300 font-semibold text-slate-700">
          Source: {dataMode}
        </span>
      </div>
    </aside>
  );
};
