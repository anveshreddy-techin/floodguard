'use client';

import React from 'react';
import { useAdaptive } from '@/context/AdaptiveContext';
import { ShieldAlert, Activity, CloudRain, Droplets, Mountain, Waves, Info } from 'lucide-react';

export const PublicRiskSummary: React.FC = () => {
  const { selectedLocation, operatingMode, highContrast } = useAdaptive();

  if (!selectedLocation) return null;

  const score = selectedLocation.riskScore;
  const level = selectedLocation.riskLevel;

  // Restrained institutional color styles per risk level
  const getLevelStyle = () => {
    switch (level) {
      case 'EXTREME':
        return {
          badgeBg: 'bg-red-100 text-red-900 border-red-300',
          indicator: 'bg-red-600',
          title: 'EXTREME RISK',
          desc: 'High probability of catastrophic runoff or breach; prompt evacuation preparedness recommended.',
        };
      case 'HIGH':
        return {
          badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
          indicator: 'bg-orange-600',
          title: 'HIGH RISK',
          desc: 'Critical runoff preconditions detected; monitor local streams and avoid low-lying culverts.',
        };
      case 'MODERATE':
        return {
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
          indicator: 'bg-amber-500',
          title: 'MODERATE RISK',
          desc: 'Elevated precipitation or soil saturation observed; normal caution in vulnerable drainages.',
        };
      default:
        return {
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          indicator: 'bg-emerald-600',
          title: 'LOW RISK',
          desc: 'Conditions within seasonal safety baselines; regular hydrological monitoring active.',
        };
    }
  };

  const style = getLevelStyle();

  return (
    <div className={`border rounded p-5 mb-6 shadow-xs ${
      highContrast 
        ? 'bg-black border-white text-white' 
        : 'bg-white border-slate-300 text-slate-900'
    }`}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Catchment Flash Flood Assessment
            </span>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
              Dossier: {selectedLocation.id}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">
            {selectedLocation.name} ({selectedLocation.state})
          </h3>
          <p className="text-xs text-slate-600">
            {selectedLocation.region} · Elevation: {selectedLocation.elevation} · Estimated Population: {selectedLocation.population.toLocaleString()}
          </p>
        </div>

        {/* Level badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className={`px-3 py-1.5 rounded border text-xs font-bold flex items-center gap-2 uppercase tracking-wide ${style.badgeBg}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${style.indicator}`} />
            <span>{style.title}</span>
          </div>
        </div>
      </div>

      {/* Main Score & Multi-factor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Risk Score Box */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded text-center">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Model-Estimated Risk Index
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 my-1 font-mono">
            {score.toFixed(1)}
            <span className="text-sm font-normal text-slate-500"> / 100</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Uncertainty band: ±{((100 - score) * 0.08).toFixed(1)} pts
          </div>
          <div className="mt-2 text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded">
            Lead Time: <strong>{selectedLocation.leadTimeMinutes} minutes</strong>
          </div>
        </div>

        {/* Contributing Environmental Indicators */}
        <div className="md:col-span-2 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Rainfall 3h */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                <span>3-Hour Rainfall</span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-1 font-mono">
                {selectedLocation.rainfall3h}
              </div>
              <span className="text-[10px] text-slate-500">AWS / Radar telemetry</span>
            </div>

            {/* Soil Moisture */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <Droplets className="w-3.5 h-3.5 text-amber-600" />
                <span>Soil Saturation</span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-1 font-mono">
                {selectedLocation.soilMoisture}
              </div>
              <span className="text-[10px] text-slate-500">Infiltration buffer low</span>
            </div>

            {/* River Stage */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <Waves className="w-3.5 h-3.5 text-cyan-600" />
                <span>River Stage</span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-1 font-mono">
                {selectedLocation.riverStage}
              </div>
              <span className="text-[10px] text-slate-500">Hydrologic gauge</span>
            </div>
          </div>

          {/* Primary Hazard Interpretation */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-xs text-blue-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900">
                Primary Hazard: {selectedLocation.primaryHazard}
              </p>
              <p className="text-blue-800 text-[11px] leading-relaxed mt-0.5">
                Authoritative Reference: {selectedLocation.authoritativeAgency}. All composite indicators are synthesized through FloodGuard ensemble inference.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Non-Impersonation Disclaimer Footnote */}
      <div className="mt-4 pt-2.5 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span>
          * Model-estimated decision support metric. Follow district administration directives during alerts.
        </span>
        <span className="font-mono text-[10px] text-slate-600">
          Mode: {operatingMode}
        </span>
      </div>
    </div>
  );
};
