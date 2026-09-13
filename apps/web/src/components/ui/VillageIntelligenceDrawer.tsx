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
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl p-5 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300">
      <div className="space-y-4">
        {/* Header & Close */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-bold">
              LOCAL INTELLIGENCE DOSSIER
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">{location.name}</h2>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              Type: {location.type} • Status: {location.status}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Risk & Telemetry Overview */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[11px] uppercase font-mono font-semibold">Current Status</span>
            <RiskBadge level={location.risk || 'HIGH'} />
          </div>
          <p className="text-slate-700 leading-relaxed text-xs">{location.desc}</p>
        </div>

        {/* Observed Telemetry Metrics */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider font-mono">
            OBSERVED IN-SITU TELEMETRY
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-blue-50 p-2.5 rounded border border-blue-200">
              <div className="text-blue-600 text-[10px] font-semibold">Rainfall (3h)</div>
              <div className="font-bold text-blue-800 mt-0.5">48.0 mm</div>
            </div>
            <div className="bg-sky-50 p-2.5 rounded border border-sky-200">
              <div className="text-sky-600 text-[10px] font-semibold">River Stage</div>
              <div className="font-bold text-sky-800 mt-0.5">3.80m (+0.40m/h)</div>
            </div>
            <div className="bg-amber-50 p-2.5 rounded border border-amber-200">
              <div className="text-amber-600 text-[10px] font-semibold">Soil Saturation</div>
              <div className="font-bold text-amber-800 mt-0.5">82% (Critical)</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="text-slate-500 text-[10px] font-semibold">Catchment Area</div>
              <div className="font-bold text-slate-800 mt-0.5">85.4 km²</div>
            </div>
          </div>
        </div>

        {/* Shelters & Candidate Paths */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" /> CANDIDATE LOWER-EXPOSURE DESTINATION
          </div>
          <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">Community High School</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-mono font-bold">READY</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">Distance: 1.4 km • Elevation: +120m</div>
            <div className="text-[10px] text-slate-600 italic">Candidate path via North Ridge Trail. Avoids low culvert.</div>
          </div>
        </div>
      </div>

      {/* Action Jump Buttons */}
      <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
        <Link
          href="/safety"
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition shadow-md"
        >
          <Compass className="w-4 h-4" /> OPEN SAFETY & ROUTE GUIDANCE
        </Link>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/ledger"
            className="p-2 bg-blue-600 hover:bg-blue-500 text-white border border-blue-700 rounded-lg text-center font-bold transition shadow-sm"
          >
            PREDICTION LEDGER
          </Link>
          <Link
            href="/hindcast"
            className="p-2 bg-purple-600 hover:bg-purple-500 text-white border border-purple-700 rounded-lg text-center font-bold transition shadow-sm"
          >
            HINDCAST LAB
          </Link>
        </div>
      </div>
    </div>
  );
};
