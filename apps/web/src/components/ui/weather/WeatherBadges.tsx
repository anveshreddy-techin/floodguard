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
    NO_RAIN: { label: 'NO RAINFALL (0 mm/h)', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300' },
    LIGHT_RAIN: { label: 'LIGHT RAIN (0.1–2.5 mm/h)', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300' },
    MODERATE_RAIN: { label: 'MODERATE RAIN (2.6–7.5 mm/h)', bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-300' },
    HEAVY_RAIN: { label: 'HEAVY RAIN (7.6–15.0 mm/h)', bg: 'bg-orange-50', text: 'text-orange-900', border: 'border-orange-300' },
    VERY_HEAVY_RAIN: { label: 'VERY HEAVY RAIN (15.1–30.0 mm/h)', bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300' },
    EXTREME_RAIN: { label: 'EXTREME SURGE (>30.0 mm/h)', bg: 'bg-red-600 animate-pulse', text: 'text-white', border: 'border-red-700' },
  };

  const cfg = configs[intensityClass] || {
    label: `${intensityClass} (PROTOTYPE CLASSIFICATION)`,
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-300',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold border shadow-xs ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <CloudRain className="w-3.5 h-3.5 shrink-0" />
      <span>{cfg.label}</span>
      {rateMmH !== undefined && rateMmH !== null && (
        <span className="font-sans font-black opacity-95">({rateMmH.toFixed(1)} mm/h)</span>
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
      case 'CLEAR_SUNNY': return <Sun className="w-4 h-4 text-amber-500" />;
      case 'PARTLY_CLOUDY': return <Cloud className="w-4 h-4 text-blue-500" />;
      case 'CLOUDY': return <Cloud className="w-4 h-4 text-slate-500" />;
      case 'LIGHT_RAIN': return <CloudRain className="w-4 h-4 text-blue-600" />;
      case 'MODERATE_RAIN': return <CloudRain className="w-4 h-4 text-blue-700" />;
      case 'HEAVY_RAIN':
      case 'VERY_HEAVY_RAIN': return <CloudRain className="w-4 h-4 text-indigo-700" />;
      case 'THUNDERSTORM':
      case 'HAZARDOUS_THUNDERSTORM': return <CloudLightning className="w-4 h-4 text-amber-600 animate-pulse" />;
      case 'SNOW': return <Snowflake className="w-4 h-4 text-cyan-600" />;
      default: return <Cloud className="w-4 h-4 text-slate-500" />;
    }
  };

  const getLabel = () => {
    return condition.replace(/_/g, ' ');
  };

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 shadow-xs">
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
    LIVE: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    REAL_PILOT: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    DEMO: 'bg-amber-50 text-amber-800 border-amber-300',
    SIMULATION: 'bg-purple-50 text-purple-800 border-purple-300',
    UPLOAD: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    HISTORICAL: 'bg-blue-50 text-blue-800 border-blue-300',
    UNAVAILABLE: 'bg-slate-100 text-slate-600 border-slate-300',
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-mono font-bold text-slate-700">
        PROVIDER: {provider.toUpperCase()}
      </span>
      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${modeColors[dataMode] || modeColors.DEMO}`}>
        MODE: {dataMode}
      </span>
      {officialStatus && officialStatus.includes('OFFICIAL') ? (
        <span className="px-2 py-0.5 rounded-lg bg-emerald-100 border border-emerald-300 text-[10px] font-mono font-bold text-emerald-800 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> OFFICIAL SOURCE
        </span>
      ) : (
        <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600 font-medium">
          PUBLIC NWP FORECAST
        </span>
      )}
    </div>
  );
};
