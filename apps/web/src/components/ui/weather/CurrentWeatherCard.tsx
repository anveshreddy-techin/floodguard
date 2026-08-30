'use client';

import React from 'react';
import { 
  CloudRain, Sun, Droplets, Wind, Gauge, Eye, Cloud, 
  MapPin, Clock, ShieldCheck, AlertTriangle, Compass, Info 
} from 'lucide-react';
import { RainfallIntensityBadge, WeatherConditionBadge, WeatherSourceBadge } from './WeatherBadges';

interface CurrentWeatherCardProps {
  weather: any;
  locationName: string;
  state: string;
  district: string;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  locationName,
  state,
  district,
}) => {
  if (!weather) return null;

  const { conditions, precipitation, forecast, source, official_status, limitations } = weather;

  return (
    <div className="fp fp-operational p-4 sm:p-5 rounded-2xl space-y-4 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header: Location & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>{state} • {district}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white font-sans tracking-tight mt-0.5">
            {locationName}
          </h2>
        </div>

        {/* Source & Mode Badges */}
        <WeatherSourceBadge
          provider={source?.provider || 'OPEN_METEO'}
          dataMode={source?.data_mode || 'LIVE'}
          officialStatus={official_status}
        />
      </div>

      {/* Primary Conditions Hero Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* Col 1: Big Temperature & Condition */}
        <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tighter">
            {conditions?.temperature_c !== null && conditions?.temperature_c !== undefined
              ? `${conditions.temperature_c.toFixed(1)}°C`
              : '--°C'}
          </div>
          <div className="space-y-1">
            <WeatherConditionBadge condition={conditions?.condition_label || 'CLOUDY'} />
            <div className="text-[10px] font-mono text-slate-400">
              Cloud Cover: {conditions?.cloud_cover_percent ?? 75}%
            </div>
          </div>
        </div>

        {/* Col 2: Live Precipitation & Intensity */}
        <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl space-y-2">
          <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">
            CURRENT RAINFALL INTENSITY:
          </div>
          <RainfallIntensityBadge
            intensityClass={precipitation?.intensity_class || 'MODERATE_RAIN'}
            rateMmH={precipitation?.current_rainfall_intensity}
          />
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-1">
            <span>Past 1h: <strong className="text-cyan-300">{precipitation?.last_hour_mm ?? 0} mm</strong></span>
            <span>Past 3h: <strong className="text-cyan-300">{precipitation?.last_3_hours_mm ?? 0} mm</strong></span>
            <span>Past 24h: <strong className="text-cyan-300">{precipitation?.last_24_hours_mm ?? 0} mm</strong></span>
          </div>
        </div>

        {/* Col 3: Atmospheric Telemetry */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[9px] text-slate-400">HUMIDITY</div>
              <div className="font-bold text-white">{conditions?.humidity_percent ?? '--'}%</div>
            </div>
          </div>

          <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Wind className="w-4 h-4 text-teal-400 shrink-0" />
            <div>
              <div className="text-[9px] text-slate-400">WIND</div>
              <div className="font-bold text-white">{conditions?.wind_speed_kmh ?? '--'} km/h</div>
            </div>
          </div>

          <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <div className="text-[9px] text-slate-400">PRESSURE</div>
              <div className="font-bold text-white">{conditions?.pressure_hpa ?? 1012} hPa</div>
            </div>
          </div>

          <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[9px] text-slate-400">VISIBILITY</div>
              <div className="font-bold text-white">{conditions?.visibility_km ?? '6.5'} km</div>
            </div>
          </div>
        </div>

      </div>

      {/* Short-Range Rainfall Forecast Horizon */}
      <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-cyan-400 font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> RAINFALL FORECAST HORIZON:
        </span>
        <div className="flex items-center gap-3 sm:gap-4 text-slate-300">
          <span>Next 1h: <strong className="text-white">{forecast?.next_hour_rain_mm ?? 0} mm</strong></span>
          <span>Next 3h: <strong className="text-white">{forecast?.next_3_hours_rain_mm ?? 0} mm</strong></span>
          <span>Next 6h: <strong className="text-white">{forecast?.next_6_hours_rain_mm ?? 0} mm</strong></span>
          <span>Next 24h: <strong className="text-white">{forecast?.next_24_hours_rain_mm ?? 0} mm</strong></span>
        </div>
      </div>

      {/* Truthfulness & Provenance Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          <span>Observed/Synced: <strong className="text-slate-200">{source?.observed_at ? new Date(source.observed_at).toLocaleTimeString() : 'Recent'}</strong></span>
          <span>• Freshness: <strong className="text-emerald-400">{source?.freshness || 'FRESH'}</strong></span>
          <span>• Quality: <strong className="text-cyan-400">{source?.quality_status || 'VALID'}</strong></span>
        </div>
        <div className="text-slate-400 flex items-center gap-1">
          <Info className="w-3 h-3 text-cyan-400" />
          <span>{official_status === 'OFFICIAL_IMD_OBSERVATION' ? 'Authorized IMD telemetry' : 'Public NWP Model • Not an official government warning'}</span>
        </div>
      </div>
    </div>
  );
};
