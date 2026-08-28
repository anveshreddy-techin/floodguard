'use client';

import React from 'react';
import Link from 'next/link';
import { 
  X, 
  MapPin, 
  ShieldAlert, 
  Compass, 
  Database, 
  History, 
  Home, 
  Waves, 
  CloudRain, 
  Layers, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { RiskBadge, UncertaintyBadge } from './Badges';

interface VillageIntelligenceDrawerProps {
  location: any;
  onClose: () => void;
}

export const VillageIntelligenceDrawer: React.FC<VillageIntelligenceDrawerProps> = ({
  location,
  onClose,
}) => {
  if (!location) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0e1630]/98 backdrop-blur-xl border-l border-[#223354] shadow-2xl p-5 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300">
      <div className="space-y-4">
        {/* Header & Close */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              LOCAL INTELLIGENCE DOSSIER
            </span>
            <h2 className="text-base font-bold text-slate-100 mt-0.5">{location.name}</h2>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Type: {location.type} • Status: {location.status}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Risk & Telemetry Overview */}
        <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px] uppercase font-mono">Current Status</span>
            <RiskBadge level={location.risk || 'HIGH'} />
          </div>
          <p className="text-slate-200 leading-relaxed text-xs">{location.desc}</p>
        </div>

        {/* Observed Telemetry Metrics */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono">
            OBSERVED IN-SITU TELEMETRY
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px]">Rainfall (3h)</div>
              <div className="font-bold text-cyan-300 mt-0.5">48.0 mm</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px]">River Stage</div>
              <div className="font-bold text-blue-400 mt-0.5">3.80m (+0.40m/h)</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px]">Soil Saturation</div>
              <div className="font-bold text-amber-400 mt-0.5">82% (Critical)</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px]">Catchment Area</div>
              <div className="font-bold text-slate-200 mt-0.5">85.4 km²</div>
            </div>
          </div>
        </div>

        {/* Shelters & Candidate Paths */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" /> CANDIDATE LOWER-EXPOSURE DESTINATION
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-200">Community High School</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono">READY</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Distance: 1.4 km • Elevation: +120m</div>
            <div className="text-[10px] text-slate-300 italic">Candidate path via North Ridge Trail. Avoids low culvert.</div>
          </div>
        </div>
      </div>

      {/* Action Jump Buttons */}
      <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
        <Link
          href="/safety"
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition shadow-lg"
        >
          <Compass className="w-4 h-4" /> OPEN SAFETY & ROUTE GUIDANCE
        </Link>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/ledger"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg text-center font-medium transition"
          >
            PREDICTION LEDGER
          </Link>
          <Link
            href="/hindcast"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 rounded-lg text-center font-medium transition"
          >
            HINDCAST LAB
          </Link>
        </div>
      </div>
    </div>
  );
};
