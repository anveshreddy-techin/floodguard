'use client';

import React from 'react';
import { Calendar, CloudRain, Sun, Cloud, Thermometer, ShieldAlert } from 'lucide-react';
import { WeatherConditionBadge } from './WeatherBadges';

interface DailyForecastCardProps {
  days: any[];
}

export const DailyForecastCard: React.FC<DailyForecastCardProps> = ({ days = [] }) => {
  if (!days || days.length === 0) return null;

  return (
    <div className="fp fp-operational p-4 sm:p-5 rounded-2xl space-y-4 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-black font-mono text-white tracking-wide uppercase">
            7-DAY SYNOPTIC OUTLOOK & PRECIPITATION SUMS
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          NWP Ensemble Projection
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {days.slice(0, 7).map((d, idx) => {
          const dateObj = new Date(d.date);
          const dayName = idx === 0 ? 'TODAY' : dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
          const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          const rainTotal = d.total_precipitation_mm || 0;
          const isHeavy = rainTotal >= 30.0;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex flex-col justify-between transition hover:border-cyan-500/50 ${
                idx === 0
                  ? 'bg-cyan-950/30 border-cyan-500/40 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={`font-black ${idx === 0 ? 'text-cyan-400' : 'text-white'}`}>{dayName}</span>
                  <span className="text-slate-500 text-[10px]">{dateFormatted}</span>
                </div>

                <div className="py-2.5 flex justify-center">
                  <WeatherConditionBadge condition={d.dominant_condition || 'CLOUDY'} />
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-800/60 pt-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-[10px] text-slate-500">TEMP:</span>
                  <span>
                    <strong className="text-white">{d.temperature_max_c ?? '--'}°</strong> /{' '}
                    <span className="text-slate-400">{d.temperature_min_c ?? '--'}°</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-[10px] text-slate-500">RAIN:</span>
                  <strong className={isHeavy ? 'text-rose-400 font-bold' : 'text-cyan-300'}>
                    {d.total_precipitation_mm ?? 0} mm
                  </strong>
                </div>

                {d.rain_probability_max_pct !== undefined && d.rain_probability_max_pct !== null && (
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>PROB:</span>
                    <span className="text-teal-400 font-bold">{d.rain_probability_max_pct}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
