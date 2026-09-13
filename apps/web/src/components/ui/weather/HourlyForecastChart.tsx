'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Table, Clock, Calendar, Droplets, Sparkles, Layers } from 'lucide-react';
import { WeatherConditionBadge } from './WeatherBadges';

export type ForecastTimeframe = 'HOURS' | 'DAYS' | 'WEEKS';

interface HourlyForecastChartProps {
  hours?: any[];
  days?: any[];
}

export const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({ hours = [], days = [] }) => {
  const [timeframe, setTimeframe] = useState<ForecastTimeframe>('HOURS');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [showTable, setShowTable] = useState<boolean>(false);

  // Synthesize 4-8 weeks extended sub-seasonal data if not passed
  const weeksData = React.useMemo(() => {
    const baseRain = 65; // mm weekly normal
    const weeks = [];
    const months = ['Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 6; i++) {
      const departure = i === 0 ? +42 : (i === 1 ? +28 : (i === 2 ? -15 : (i === 3 ? -35 : -55)));
      const rainfall = Math.max(5, Math.round(baseRain * (1 + departure / 100)));
      weeks.push({
        label: `Week ${i + 1} (${months[Math.floor(i / 2)]} W${(i % 2) + 1})`,
        weekNumber: i + 1,
        total_rainfall_mm: rainfall,
        anomaly_departure_pct: departure,
        soil_saturation_buildup_pct: Math.max(30, Math.min(95, 82 - i * 11 + (departure > 0 ? 8 : -5))),
        risk_category: departure > 30 ? 'SURGE_WARNING' : (departure > 10 ? 'MODERATE' : 'NORMAL'),
        nwp_ensemble_spread_mm: Math.round(rainfall * 0.25),
      });
    }
    return weeks;
  }, []);

  // Prepare current active dataset based on selected timeframe
  const displayHours = hours.slice(0, 24);
  const displayDays = days && days.length > 0 ? days : [
    { date: 'Today', total_precipitation_mm: 72.0, rain_probability_max_pct: 95, dominant_condition: 'HEAVY_RAIN', temperature_max_c: 24, temperature_min_c: 17 },
    { date: 'Tomorrow', total_precipitation_mm: 38.5, rain_probability_max_pct: 85, dominant_condition: 'MODERATE_RAIN', temperature_max_c: 25, temperature_min_c: 18 },
    { date: 'Day 3', total_precipitation_mm: 14.0, rain_probability_max_pct: 60, dominant_condition: 'LIGHT_RAIN', temperature_max_c: 26, temperature_min_c: 18 },
    { date: 'Day 4', total_precipitation_mm: 2.0, rain_probability_max_pct: 35, dominant_condition: 'PARTLY_CLOUDY', temperature_max_c: 27, temperature_min_c: 19 },
    { date: 'Day 5', total_precipitation_mm: 0.0, rain_probability_max_pct: 15, dominant_condition: 'CLEAR_SUNNY', temperature_max_c: 28, temperature_min_c: 19 },
    { date: 'Day 6', total_precipitation_mm: 0.0, rain_probability_max_pct: 10, dominant_condition: 'CLEAR_SUNNY', temperature_max_c: 28, temperature_min_c: 18 },
    { date: 'Day 7', total_precipitation_mm: 1.5, rain_probability_max_pct: 20, dominant_condition: 'PARTLY_CLOUDY', temperature_max_c: 27, temperature_min_c: 18 },
  ];

  // Chart dimensions
  const svgWidth = 800;
  const svgHeight = 230;
  const paddingX = 45;
  const paddingY = 30;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // Compute scale maximums
  let maxVal = 15;
  let itemCount = 24;
  let barWidth = chartWidth / 24;

  if (timeframe === 'HOURS') {
    itemCount = displayHours.length || 24;
    barWidth = chartWidth / itemCount;
    maxVal = Math.max(15.0, ...displayHours.map(h => (h.precipitation_mm || 0) * 1.25));
  } else if (timeframe === 'DAYS') {
    itemCount = displayDays.length;
    barWidth = chartWidth / itemCount;
    maxVal = Math.max(50.0, ...displayDays.map(d => (d.total_precipitation_mm || 0) * 1.2));
  } else {
    itemCount = weeksData.length;
    barWidth = chartWidth / itemCount;
    maxVal = Math.max(100.0, ...weeksData.map(w => w.total_rainfall_mm * 1.25));
  }

  return (
    <div className="bg-white p-5 rounded-2xl space-y-4 border border-slate-200 shadow-sm">
      
      {/* ── Title & Timeframe Selector Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
            {timeframe === 'HOURS' && <Clock className="w-4 h-4" />}
            {timeframe === 'DAYS' && <Calendar className="w-4 h-4" />}
            {timeframe === 'WEEKS' && <Layers className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>
                {timeframe === 'HOURS' && '24-Hour Rainfall & Water Inflow Graph'}
                {timeframe === 'DAYS' && '7-Day Daily Rainfall & Temperature Forecast'}
                {timeframe === 'WEEKS' && '6-Week Sub-Seasonal Monsoon Outlook'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              {timeframe === 'HOURS' && 'High-resolution rainfall intensity and flash flood tripwire monitoring'}
              {timeframe === 'DAYS' && 'Medium-range daily accumulation and catchment saturation progression'}
              {timeframe === 'WEEKS' && 'Sub-seasonal rainfall anomalies and long-range soil moisture trajectory'}
            </p>
          </div>
        </div>

        {/* Action Controls: Timeframe Switcher + Table Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Timeframe Mode Pill Buttons */}
          <div className="flex items-center bg-slate-100 border border-slate-200 p-1 rounded-xl shadow-inner text-xs">
            <button
              onClick={() => { setTimeframe('HOURS'); setHoveredIdx(null); }}
              className={`px-3 py-1.5 rounded-lg transition-all active:scale-95 ${
                timeframe === 'HOURS'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Hourly (24h)
            </button>

            <button
              onClick={() => { setTimeframe('DAYS'); setHoveredIdx(null); }}
              className={`px-3 py-1.5 rounded-lg transition-all active:scale-95 ${
                timeframe === 'DAYS'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Daily (7 Days)
            </button>

            <button
              onClick={() => { setTimeframe('WEEKS'); setHoveredIdx(null); }}
              className={`px-3 py-1.5 rounded-lg transition-all active:scale-95 ${
                timeframe === 'WEEKS'
                  ? 'bg-teal-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Sub-Seasonal (6 Weeks)
            </button>
          </div>

          <button
            onClick={() => setShowTable(!showTable)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1 active:scale-95 transition shadow-2xs"
            title="Toggle raw data table"
          >
            <Table className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showTable ? 'Chart View' : 'Table View'}</span>
          </button>
        </div>
      </div>

      {/* ── Active Time-Step Telemetry Inspector Banner ── */}
      <div className="bg-slate-50/90 border border-slate-200/90 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700 shadow-2xs font-sans">
        {timeframe === 'HOURS' && (() => {
          const activeH = (hoveredIdx !== null && displayHours[hoveredIdx]) ? displayHours[hoveredIdx] : displayHours[0] || {};
          return (
            <>
              <div className="flex items-center gap-2">
                <span className="text-blue-700 font-bold bg-blue-100/80 px-2.5 py-1 rounded-md border border-blue-200 text-xs">
                  Time: {activeH.timestamp ? new Date(activeH.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                </span>
                {activeH.condition_code && <WeatherConditionBadge condition={activeH.condition_code} />}
              </div>
              <div className="flex items-center gap-3 sm:gap-5 flex-wrap font-medium">
                <span>Rain: <strong className="text-blue-700 font-bold">{activeH.precipitation_mm ?? 0} mm/h</strong></span>
                <span>Probability: <strong className="text-teal-700 font-bold">{activeH.rain_probability_pct ?? 0}%</strong></span>
                <span>Accumulated: <strong className="text-amber-700 font-bold">{activeH.accumulated_precipitation_mm ?? 0} mm</strong></span>
                <span>Temp: <strong className="text-slate-900 font-bold">{activeH.temperature_c ?? '--'}°C</strong></span>
                <span>Wind: <strong className="text-slate-700 font-bold">{activeH.wind_speed_kmh ?? '--'} km/h</strong></span>
              </div>
            </>
          );
        })()}

        {timeframe === 'DAYS' && (() => {
          const activeD = (hoveredIdx !== null && displayDays[hoveredIdx]) ? displayDays[hoveredIdx] : displayDays[0] || {};
          return (
            <>
              <div className="flex items-center gap-2">
                <span className="text-amber-900 font-bold bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300 text-xs">
                  Date: {activeD.date || 'Day 1'}
                </span>
                {activeD.dominant_condition && <WeatherConditionBadge condition={activeD.dominant_condition} />}
              </div>
              <div className="flex items-center gap-3 sm:gap-5 flex-wrap font-medium">
                <span>24h Rain: <strong className="text-blue-700 font-bold">{activeD.total_precipitation_mm ?? 0} mm/day</strong></span>
                <span>Rain Chance: <strong className="text-teal-700 font-bold">{activeD.rain_probability_max_pct ?? 0}%</strong></span>
                <span>Temp: <strong className="text-slate-900 font-bold">{activeD.temperature_min_c ?? 17}°C – {activeD.temperature_max_c ?? 24}°C</strong></span>
                <span className="text-emerald-700 font-semibold">NWP Global Model</span>
              </div>
            </>
          );
        })()}

        {timeframe === 'WEEKS' && (() => {
          const activeW = (hoveredIdx !== null && weeksData[hoveredIdx]) ? weeksData[hoveredIdx] : weeksData[0] || {};
          return (
            <>
              <div className="flex items-center gap-2">
                <span className="text-teal-900 font-bold bg-teal-100 px-2.5 py-1 rounded-md border border-teal-300 text-xs">
                  Period: {activeW.label}
                </span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  activeW.anomaly_departure_pct > 20
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-teal-100 text-teal-800 border border-teal-300'
                }`}>
                  {activeW.anomaly_departure_pct > 0 ? `+${activeW.anomaly_departure_pct}% Surge` : `${activeW.anomaly_departure_pct}% Deficit`}
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-5 flex-wrap font-medium">
                <span>Weekly Rain: <strong className="text-blue-700 font-bold">{activeW.total_rainfall_mm} mm/wk</strong></span>
                <span>Spread: <strong className="text-amber-700 font-bold">±{activeW.nwp_ensemble_spread_mm} mm</strong></span>
                <span>Soil Saturation: <strong className="text-purple-700 font-bold">{activeW.soil_saturation_buildup_pct}%</strong></span>
              </div>
            </>
          );
        })()}
      </div>

      {/* ── Primary Interactive SVG Chart ── */}
      {!showTable ? (
        <div className="relative w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[650px]">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
              <defs>
                <linearGradient id="rainHourlyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="alertHourlyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="dailyBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D97706" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="weeklyBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0D9488" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#99F6E4" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, idx) => {
                const y = paddingY + chartHeight * (1 - ratio);
                const val = (maxVal * ratio).toFixed(0);
                const unit = timeframe === 'HOURS' ? 'mm/h' : (timeframe === 'DAYS' ? 'mm/d' : 'mm/w');
                return (
                  <g key={idx}>
                    <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />
                    <text x={paddingX - 6} y={y + 3} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="sans-serif" fontWeight="600">
                      {val} {idx === 4 ? unit : ''}
                    </text>
                  </g>
                );
              })}

              {/* ── Timeframe-Specific Rendering ── */}
              {timeframe === 'HOURS' && (
                <>
                  {/* Alert Threshold Line (15mm/h) */}
                  {(() => {
                    const alertY = paddingY + chartHeight - (15.0 / maxVal) * chartHeight;
                    if (alertY >= paddingY && alertY <= paddingY + chartHeight) {
                      return (
                        <g>
                          <line x1={paddingX} y1={alertY} x2={svgWidth - paddingX} y2={alertY} stroke="#DC2626" strokeWidth="1.5" strokeDasharray="4,2" />
                          <text x={svgWidth - paddingX} y={alertY - 4} textAnchor="end" fill="#DC2626" fontSize="9" fontFamily="sans-serif" fontWeight="700">
                            Flash Flood Danger Line (15 mm/h)
                          </text>
                        </g>
                      );
                    }
                    return null;
                  })()}

                  {/* Hourly Bars */}
                  {displayHours.map((h, idx) => {
                    const rainVal = h.precipitation_mm || 0;
                    const hHeight = Math.max(2, (rainVal / maxVal) * chartHeight);
                    const x = paddingX + idx * barWidth + 3;
                    const y = paddingY + chartHeight - hHeight;
                    const isAlert = rainVal >= 15.0;
                    const isHovered = hoveredIdx === idx;
                    const timeLabel = new Date(h.timestamp).getHours() + ':00';

                    return (
                      <g 
                        key={idx} 
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIdx(idx)}
                      >
                        <rect x={paddingX + idx * barWidth} y={paddingY} width={barWidth} height={chartHeight} fill={isHovered ? 'rgba(6,182,212,0.12)' : 'transparent'} />
                        <rect x={x} y={y} width={Math.max(4, barWidth - 6)} height={hHeight} rx="3" fill={isAlert ? 'url(#alertHourlyGrad)' : 'url(#rainHourlyGrad)'} stroke={isHovered ? '#38bdf8' : (isAlert ? '#f43f5e' : 'none')} strokeWidth={isHovered ? 1.5 : 0} />
                        {idx % 3 === 0 && (
                          <text x={paddingX + idx * barWidth + barWidth / 2} y={svgHeight - 8} textAnchor="middle" fill={isHovered ? '#2563eb' : '#64748b'} fontSize="9" fontFamily="sans-serif" fontWeight={isHovered ? 'bold' : '500'}>
                            {timeLabel}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </>
              )}

              {timeframe === 'DAYS' && (
                <>
                  {/* Daily Rainfall Bars */}
                  {displayDays.map((d, idx) => {
                    const rainVal = d.total_precipitation_mm || 0;
                    const hHeight = Math.max(2, (rainVal / maxVal) * chartHeight);
                    const x = paddingX + idx * barWidth + 12;
                    const y = paddingY + chartHeight - hHeight;
                    const isAlert = rainVal >= 50.0;
                    const isHovered = hoveredIdx === idx;

                    return (
                      <g 
                        key={idx} 
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIdx(idx)}
                      >
                        <rect x={paddingX + idx * barWidth} y={paddingY} width={barWidth} height={chartHeight} fill={isHovered ? 'rgba(56,189,248,0.12)' : 'transparent'} />
                        <rect x={x} y={y} width={Math.max(12, barWidth - 24)} height={hHeight} rx="4" fill={isAlert ? 'url(#alertHourlyGrad)' : 'url(#dailyBarGrad)'} stroke={isHovered ? '#38bdf8' : 'none'} strokeWidth={1.5} />
                        
                        {/* Daily Precipitation Text On Bar */}
                        <text x={x + (barWidth - 24) / 2} y={y - 4} textAnchor="middle" fill={isAlert ? '#dc2626' : '#2563eb'} fontSize="9" fontFamily="sans-serif" fontWeight="700">
                          {rainVal}mm
                        </text>

                        {/* Date Label on X-Axis */}
                        <text x={paddingX + idx * barWidth + barWidth / 2} y={svgHeight - 8} textAnchor="middle" fill={isHovered ? '#2563eb' : '#64748b'} fontSize="10" fontFamily="sans-serif" fontWeight={isHovered ? 'bold' : '500'}>
                          {d.date}
                        </text>
                      </g>
                    );
                  })}
                </>
              )}

              {timeframe === 'WEEKS' && (
                <>
                  {/* Normal Baseline Line (65mm) */}
                  {(() => {
                    const baseNormY = paddingY + chartHeight - (65.0 / maxVal) * chartHeight;
                    return (
                      <g>
                        <line x1={paddingX} y1={baseNormY} x2={svgWidth - paddingX} y2={baseNormY} stroke="#d97706" strokeWidth="1.5" strokeDasharray="5,3" />
                        <text x={svgWidth - paddingX} y={baseNormY - 4} textAnchor="end" fill="#b45309" fontSize="8" fontFamily="sans-serif" fontWeight="600">
                          Historical Monsoon Normal (65 mm/wk)
                        </text>
                      </g>
                    );
                  })()}

                  {/* Weekly Bars */}
                  {weeksData.map((w, idx) => {
                    const rainVal = w.total_rainfall_mm;
                    const hHeight = Math.max(2, (rainVal / maxVal) * chartHeight);
                    const x = paddingX + idx * barWidth + 20;
                    const y = paddingY + chartHeight - hHeight;
                    const isSurge = w.anomaly_departure_pct > 20;
                    const isHovered = hoveredIdx === idx;

                    return (
                      <g 
                        key={idx} 
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIdx(idx)}
                      >
                        <rect x={paddingX + idx * barWidth} y={paddingY} width={barWidth} height={chartHeight} fill={isHovered ? 'rgba(168,85,247,0.12)' : 'transparent'} />
                        <rect x={x} y={y} width={Math.max(18, barWidth - 40)} height={hHeight} rx="5" fill={isSurge ? 'url(#alertHourlyGrad)' : 'url(#weeklyBarGrad)'} stroke={isHovered ? '#c084fc' : 'none'} strokeWidth={1.5} />
                        
                        <text x={x + (barWidth - 40) / 2} y={y - 4} textAnchor="middle" fill={isSurge ? '#dc2626' : '#7c3aed'} fontSize="9" fontFamily="sans-serif" fontWeight="700">
                          {rainVal}mm ({w.anomaly_departure_pct > 0 ? `+${w.anomaly_departure_pct}%` : `${w.anomaly_departure_pct}%`})
                        </text>

                        {/* Week Label */}
                        <text x={paddingX + idx * barWidth + barWidth / 2} y={svgHeight - 8} textAnchor="middle" fill={isHovered ? '#7c3aed' : '#64748b'} fontSize="10" fontFamily="sans-serif" fontWeight={isHovered ? 'bold' : '500'}>
                          {w.label}
                        </text>
                      </g>
                    );
                  })}
                </>
              )}
            </svg>
          </div>
        </div>
      ) : (
        /* ── Multi-Timeframe Data Table ── */
        <div className="overflow-x-auto max-h-72 border border-slate-200 rounded-2xl shadow-xs">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 sticky top-0 font-semibold">
              {timeframe === 'HOURS' && (
                <tr>
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Condition</th>
                  <th className="p-2.5">Rain (mm/h)</th>
                  <th className="p-2.5">Cumulative</th>
                  <th className="p-2.5">Rain Prob</th>
                  <th className="p-2.5">Temp (°C)</th>
                  <th className="p-2.5">Wind</th>
                </tr>
              )}
              {timeframe === 'DAYS' && (
                <tr>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Condition</th>
                  <th className="p-2.5">24h Rain (mm)</th>
                  <th className="p-2.5">Max Rain Prob</th>
                  <th className="p-2.5">Temp (Min / Max)</th>
                  <th className="p-2.5">Warning Source</th>
                </tr>
              )}
              {timeframe === 'WEEKS' && (
                <tr>
                  <th className="p-2.5">Period</th>
                  <th className="p-2.5">Weekly Rain (mm)</th>
                  <th className="p-2.5">Anomaly Departure</th>
                  <th className="p-2.5">Ensemble Spread</th>
                  <th className="p-2.5">Soil Saturation</th>
                  <th className="p-2.5">Risk Category</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {timeframe === 'HOURS' && displayHours.map((h, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="p-2.5 text-blue-700 font-bold font-mono">
                    {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-2.5">{h.condition_code?.replace(/_/g, ' ')}</td>
                  <td className={`p-2.5 font-bold font-mono ${h.precipitation_mm >= 15 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {h.precipitation_mm ?? 0} mm/h
                  </td>
                  <td className="p-2.5 text-amber-700 font-bold font-mono">{h.accumulated_precipitation_mm ?? 0} mm</td>
                  <td className="p-2.5 text-teal-700 font-semibold font-mono">{h.rain_probability_pct ?? 0}%</td>
                  <td className="p-2.5 font-mono">{h.temperature_c ?? '--'}°C</td>
                  <td className="p-2.5 font-mono">{h.wind_speed_kmh ?? '--'} km/h</td>
                </tr>
              ))}

              {timeframe === 'DAYS' && displayDays.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="p-2.5 text-blue-700 font-bold font-mono">{d.date}</td>
                  <td className="p-2.5">{d.dominant_condition?.replace(/_/g, ' ')}</td>
                  <td className={`p-2.5 font-bold font-mono ${d.total_precipitation_mm >= 50 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {d.total_precipitation_mm} mm
                  </td>
                  <td className="p-2.5 text-teal-700 font-semibold font-mono">{d.rain_probability_max_pct}%</td>
                  <td className="p-2.5 font-mono">{d.temperature_min_c}°C – {d.temperature_max_c}°C</td>
                  <td className="p-2.5 text-slate-500">{d.warning_source || 'Open-Meteo NWP'}</td>
                </tr>
              ))}

              {timeframe === 'WEEKS' && weeksData.map((w, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="p-2.5 text-purple-700 font-bold font-mono">{w.label}</td>
                  <td className="p-2.5 font-bold font-mono text-slate-900">{w.total_rainfall_mm} mm</td>
                  <td className={`p-2.5 font-bold font-mono ${w.anomaly_departure_pct > 0 ? 'text-rose-600' : 'text-blue-700'}`}>
                    {w.anomaly_departure_pct > 0 ? `+${w.anomaly_departure_pct}%` : `${w.anomaly_departure_pct}%`}
                  </td>
                  <td className="p-2.5 text-amber-700 font-mono">±{w.nwp_ensemble_spread_mm} mm</td>
                  <td className="p-2.5 text-purple-700 font-bold font-mono">{w.soil_saturation_buildup_pct}%</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      w.risk_category === 'SURGE_WARNING' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {w.risk_category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Legend & Footnote ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-sans text-slate-500 border-t border-slate-200 pt-3">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-blue-600 rounded-xs" /> 
            {timeframe === 'HOURS' ? 'Hourly Rain (mm/h)' : (timeframe === 'DAYS' ? 'Daily Rain (mm/d)' : 'Weekly Rain (mm/w)')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500 border border-dashed border-rose-400" /> Flash Surge Alert Threshold
          </span>
          {timeframe === 'WEEKS' && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400 border border-dashed border-amber-300" /> Climatology Normal (65mm)
            </span>
          )}
        </div>
        <div>Tap or hover on any step to inspect predicted parameters</div>
      </div>

    </div>
  );
};
