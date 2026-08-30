'use client';

import React from 'react';
import { CloudRain, Sun, Cloud, CloudLightning, Snowflake, ShieldAlert, Radio, Database, CheckCircle2, AlertTriangle } from 'lucide-react';

export type WeatherConditionType = 
  | 'CLEAR_SUNNY'
  | 'PARTLY_CLOUDY'
  | 'CLOUDY'
  | 'LIGHT_RAIN'
  | 'MODERATE_RAIN'
  | 'HEAVY_RAIN'
  | 'VERY_HEAVY_RAIN'
  | 'THUNDERSTORM'
  | 'HAZARDOUS_THUNDERSTORM'
  | 'SNOW'
  | 'HAZE_FOG'
  | 'UNKNOWN';

export type RainfallIntensityType =
  | 'NO_RAIN'
  | 'LIGHT_RAIN'
  | 'MODERATE_RAIN'
  | 'HEAVY_RAIN'
  | 'VERY_HEAVY_RAIN'
  | 'EXTREME_RAIN'
  | 'UNKNOWN';

export const RainfallIntensityBadge: React.FC<{
  intensityClass: RainfallIntensityType | string;
  rateMmH?: number | null;
}> = ({ intensityClass, rateMmH }) => {
  const configs: Record<string, { label: string; bg: string; text: string; border: string }> = {
    NO_RAIN: { label: 'NO RAINFALL (0 mm/h)', bg: 'bg-emerald-950/70', text: 'text-emerald-300', border: 'border-emerald-700/60' },
    LIGHT_RAIN: { label: 'LIGHT RAIN (0.1–2.5 mm/h)', bg: 'bg-sky-950/70', text: 'text-sky-300', border: 'border-sky-700/60' },
    MODERATE_RAIN: { label: 'MODERATE RAIN (2.6–7.5 mm/h)', bg: 'bg-amber-950/70', text: 'text-amber-300', border: 'border-amber-700/60' },
    HEAVY_RAIN: { label: 'HEAVY RAIN (7.6–15.0 mm/h)', bg: 'bg-orange-950/70', text: 'text-orange-300', border: 'border-orange-700/60' },
    VERY_HEAVY_RAIN: { label: 'VERY HEAVY RAIN (15.1–30.0 mm/h)', bg: 'bg-rose-950/70', text: 'text-rose-300', border: 'border-rose-700/60' },
    EXTREME_RAIN: { label: 'EXTREME SURGE (>30.0 mm/h)', bg: 'bg-red-950/90 animate-pulse', text: 'text-red-200', border: 'border-red-500' },
  };

  const cfg = configs[intensityClass] || {
    label: `${intensityClass} (PROTOTYPE CLASSIFICATION)`,
    bg: 'bg-slate-900',
    text: 'text-slate-300',
    border: 'border-slate-700',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <CloudRain className="w-3.5 h-3.5 shrink-0" />
      <span>{cfg.label}</span>
      {rateMmH !== undefined && rateMmH !== null && (
        <span className="font-sans font-normal opacity-90">({rateMmH.toFixed(1)} mm/h)</span>
      )}
    </span>
  );
};

export const WeatherConditionBadge: React.FC<{
  condition: WeatherConditionType | string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ condition, size = 'md' }) => {
  const getIcon = () => {
    switch (condition) {
      case 'CLEAR_SUNNY': return <Sun className="w-4 h-4 text-amber-400" />;
      case 'PARTLY_CLOUDY': return <Cloud className="w-4 h-4 text-sky-300" />;
      case 'CLOUDY': return <Cloud className="w-4 h-4 text-slate-400" />;
      case 'LIGHT_RAIN': return <CloudRain className="w-4 h-4 text-cyan-400" />;
      case 'MODERATE_RAIN': return <CloudRain className="w-4 h-4 text-blue-400" />;
      case 'HEAVY_RAIN':
      case 'VERY_HEAVY_RAIN': return <CloudRain className="w-4 h-4 text-indigo-400" />;
      case 'THUNDERSTORM':
      case 'HAZARDOUS_THUNDERSTORM': return <CloudLightning className="w-4 h-4 text-amber-300 animate-pulse" />;
      case 'SNOW': return <Snowflake className="w-4 h-4 text-cyan-200" />;
      default: return <Cloud className="w-4 h-4 text-slate-500" />;
    }
  };

  const getLabel = () => {
    return condition.replace(/_/g, ' ');
  };

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono font-bold text-slate-200">
      {getIcon()}
      <span>{getLabel()}</span>
    </span>
  );
};

export const WeatherSourceBadge: React.FC<{
  provider: string;
  dataMode: string;
  officialStatus?: string;
}> = ({ provider, dataMode, officialStatus }) => {
  const modeColors: Record<string, string> = {
    LIVE: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
    REAL_PILOT: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    DEMO: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    SIMULATION: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    UPLOAD: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50',
    HISTORICAL: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    UNAVAILABLE: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-mono font-bold text-slate-300">
        PROVIDER: {provider.toUpperCase()}
      </span>
      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${modeColors[dataMode] || modeColors.DEMO}`}>
        MODE: {dataMode}
      </span>
      {officialStatus && officialStatus.includes('OFFICIAL') ? (
        <span className="px-2 py-0.5 rounded-lg bg-emerald-950 border border-emerald-700 text-[10px] font-mono font-bold text-emerald-300 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> OFFICIAL SOURCE
        </span>
      ) : (
        <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-400">
          PUBLIC NWP FORECAST
        </span>
      )}
    </div>
  );
};
