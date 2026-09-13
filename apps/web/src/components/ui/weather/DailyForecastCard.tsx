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
    <div className="bg-white border border-slate-200 shadow-sm p-4 sm:p-5 rounded-2xl space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            7-Day Daily Forecast & Precipitation Outlook
          </h3>
        </div>
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg w-fit">
          Ensemble Forecast Projection
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {days.slice(0, 7).map((d, idx) => {
          const dateObj = new Date(d.date);
          const dayName = idx === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          const rainTotal = d.total_precipitation_mm || 0;
          const isHeavy = rainTotal >= 30.0;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex flex-col justify-between transition hover:shadow-md ${
                idx === 0
                  ? 'bg-blue-50/90 border-2 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                  : 'bg-slate-50/80 hover:bg-slate-100/90 border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${idx === 0 ? 'text-blue-700' : 'text-slate-900'}`}>{dayName}</span>
                  <span className="text-slate-500 text-[11px] font-medium">{dateFormatted}</span>
                </div>

                <div className="py-2.5 flex justify-center">
                  <WeatherConditionBadge condition={d.dominant_condition || 'CLOUDY'} />
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-200/80 pt-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-[11px] text-slate-500 font-medium">Temp:</span>
                  <span>
                    <strong className="text-slate-900 font-bold">{d.temperature_max_c ?? '--'}°</strong> /{' '}
                    <span className="text-slate-600">{d.temperature_min_c ?? '--'}°</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-[11px] text-slate-500 font-medium">Rain:</span>
                  <strong className={isHeavy ? 'text-red-600 font-bold' : 'text-blue-700 font-bold'}>
                    {d.total_precipitation_mm ?? 0} mm
                  </strong>
                </div>

                {d.rain_probability_max_pct !== undefined && d.rain_probability_max_pct !== null && (
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-medium text-slate-500">Chance:</span>
                    <span className="text-emerald-700 font-bold">{d.rain_probability_max_pct}%</span>
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
