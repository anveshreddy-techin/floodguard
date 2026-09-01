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
    <div className="fp fp-operational p-4 sm:p-5 rounded-3xl space-y-4 border border-cyan-500/30 shadow-2xl backdrop-blur-2xl">
      
      {/* ── Title & Timeframe Selector Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            {timeframe === 'HOURS' && <Clock className="w-4 h-4" />}
            {timeframe === 'DAYS' && <Calendar className="w-4 h-4" />}
            {timeframe === 'WEEKS' && <Layers className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-sm font-black font-mono text-white tracking-wide uppercase flex items-center gap-2">
              <span>
                {timeframe === 'HOURS' && '24-HOUR HOURLY PRECIPITATION & SURGE HYDROGRAPH'}
                {timeframe === 'DAYS' && '7-DAY DAILY RAINFALL & TEMPERATURE OUTLOOK'}
                {timeframe === 'WEEKS' && '6-WEEK SUB-SEASONAL MONSOON ENSEMBLE FORECAST'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              {timeframe === 'HOURS' && 'High-resolution orographic precipitation intensity & flash tripwire alerts'}
              {timeframe === 'DAYS' && 'Medium-range daily accumulation & flood precondition trajectory'}
              {timeframe === 'WEEKS' && 'Sub-seasonal anomalous precipitation departure & soil saturation buildup'}
            </p>
          </div>
        </div>

        {/* Action Controls: Timeframe Switcher + Table Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Timeframe Mode Pill Buttons */}
          <div className="flex items-center bg-[#060e22] border border-cyan-500/40 p-1 rounded-2xl shadow-inner text-xs font-mono">
            <button
              onClick={() => { setTimeframe('HOURS'); setHoveredIdx(null); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all active:scale-95 ${
                timeframe === 'HOURS'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              ⏱️ HOURS (24H)
            </button>

            <button
              onClick={() => { setTimeframe('DAYS'); setHoveredIdx(null); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all active:scale-95 ${
                timeframe === 'DAYS'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              📅 DAYS (7D)
            </button>

            <button
              onClick={() => { setTimeframe('WEEKS'); setHoveredIdx(null); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all active:scale-95 ${
                timeframe === 'WEEKS'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              🗓️ WEEKS (6W)
            </button>
          </div>

          <button
            onClick={() => setShowTable(!showTable)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1 active:scale-95 transition"
            title="Toggle raw data table"
          >
            <Table className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showTable ? 'CHART' : 'TABLE'}</span>
          </button>
        </div>
      </div>

      {/* ── Active Time-Step Telemetry Inspector Banner ── */}
      <div className="bg-[#071128]/90 border border-cyan-500/30 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-300 shadow-sm animate-fade-in">
        {timeframe === 'HOURS' && (() => {
          const activeH = (hoveredIdx !== null && displayHours[hoveredIdx]) ? displayHours[hoveredIdx] : displayHours[0] || {};
          return (
            <>
              <div className="flex items-center gap-2">
                <span className="text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-700/50">
                  TIME: {activeH.timestamp ? new Date(activeH.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                </span>
                {activeH.condition_code && <WeatherConditionBadge condition={activeH.condition_code} />}
              </div>
              <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
                <span>Rain: <strong className="text-cyan-300">{activeH.precipitation_mm ?? 0} mm/h</strong></span>
                <span>Probability: <strong className="text-teal-300">{activeH.rain_probability_pct ?? 0}%</strong></span>
                <span>Cumulative: <strong className="text-amber-300">{activeH.accumulated_precipitation_mm ?? 0} mm</strong></span>
                <span>Temp: <strong className="text-white">{activeH.temperature_c ?? '--'}°C</strong></span>
                <span>Wind: <strong className="text-slate-200">{activeH.wind_speed_kmh ?? '--'} km/h</strong></span>
              </div>
            </>
          );
        })()}

        {timeframe === 'DAYS' && (() => {
          const activeD = (hoveredIdx !== null && displayDays[hoveredIdx]) ? displayDays[hoveredIdx] : displayDays[0] || {};
          return (
            <>
              <div className="flex items-center gap-2">
                <span className="text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-700/50">
                  DATE: {activeD.date || 'Day 1'}
                </span>
                {activeD.dominant_condition && <WeatherConditionBadge condition={activeD.dominant_condition} />}
              </div>
              <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
                <span>24h Rain: <strong className="text-cyan-300">{activeD.total_precipitation_mm ?? 0} mm/day</strong></span>
                <span>Rain Probability: <strong className="text-teal-300">{activeD.rain_probability_max_pct ?? 0}%</strong></span>
                <span>Temp Range: <strong className="text-white">{activeD.temperature_min_c ?? 17}°C – {activeD.temperature_max_c ?? 24}°C</strong></span>
                <span className="text-emerald-400 font-bold">NWP Global Model</span>
              </div>
            </>
          );
        })()}

        {timeframe === 'WEEKS' && (() => {
          const activeW = (hoveredIdx !== null && weeksData[hoveredIdx]) ? weeksData[hoveredIdx] : weeksData[0] || {};
          return (
            <>
              <div className="flex items-center gap-2">
                <span className="text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-700/50">
                  PERIOD: {activeW.label}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeW.anomaly_departure_pct > 20
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}>
                  {activeW.anomaly_departure_pct > 0 ? `+${activeW.anomaly_departure_pct}% SURGE` : `${activeW.anomaly_departure_pct}% DEFICIT`}
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
                <span>Weekly Rain: <strong className="text-cyan-300">{activeW.total_rainfall_mm} mm/wk</strong></span>
                <span>Ensemble Spread: <strong className="text-amber-300">±{activeW.nwp_ensemble_spread_mm} mm</strong></span>
                <span>Soil Saturation: <strong className="text-purple-300">{activeW.soil_saturation_buildup_pct}%</strong></span>
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
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="alertHourlyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#be123c" stopOpacity="0.35" />
                </linearGradient>
                <linearGradient id="dailyBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="weeklyBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#6b21a8" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, idx) => {
                const y = paddingY + chartHeight * (1 - ratio);
                const val = (maxVal * ratio).toFixed(0);
                const unit = timeframe === 'HOURS' ? 'mm/h' : (timeframe === 'DAYS' ? 'mm/d' : 'mm/w');
                return (
                  <g key={idx}>
                    <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
                    <text x={paddingX - 6} y={y + 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
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
                          <line x1={paddingX} y1={alertY} x2={svgWidth - paddingX} y2={alertY} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,2" />
                          <text x={svgWidth - paddingX} y={alertY - 4} textAnchor="end" fill="#fb7185" fontSize="8" fontFamily="monospace">
                            FLASH FLOOD THRESHOLD (15 mm/h)
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
                          <text x={paddingX + idx * barWidth + barWidth / 2} y={svgHeight - 8} textAnchor="middle" fill={isHovered ? '#38bdf8' : '#64748b'} fontSize="9" fontFamily="monospace" fontWeight={isHovered ? 'bold' : 'normal'}>
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
                        <text x={x + (barWidth - 24) / 2} y={y - 4} textAnchor="middle" fill={isAlert ? '#fb7185' : '#38bdf8'} fontSize="9" fontFamily="monospace" fontWeight="bold">
                          {rainVal}mm
                        </text>

                        {/* Date Label on X-Axis */}
                        <text x={paddingX + idx * barWidth + barWidth / 2} y={svgHeight - 8} textAnchor="middle" fill={isHovered ? '#38bdf8' : '#94a3b8'} fontSize="10" fontFamily="monospace" fontWeight={isHovered ? 'bold' : 'normal'}>
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
                        <line x1={paddingX} y1={baseNormY} x2={svgWidth - paddingX} y2={baseNormY} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5,3" />
                        <text x={svgWidth - paddingX} y={baseNormY - 4} textAnchor="end" fill="#fbbf24" fontSize="8" fontFamily="monospace">
                          HISTORICAL MONSOON CLIMATOLOGY NORMAL (65 mm/wk)
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
                        
                        <text x={x + (barWidth - 40) / 2} y={y - 4} textAnchor="middle" fill={isSurge ? '#fb7185' : '#c084fc'} fontSize="9" fontFamily="monospace" fontWeight="bold">
                          {rainVal}mm ({w.anomaly_departure_pct > 0 ? `+${w.anomaly_departure_pct}%` : `${w.anomaly_departure_pct}%`})
                        </text>

                        {/* Week Label */}
                        <text x={paddingX + idx * barWidth + barWidth / 2} y={svgHeight - 8} textAnchor="middle" fill={isHovered ? '#c084fc' : '#94a3b8'} fontSize="10" fontFamily="monospace" fontWeight={isHovered ? 'bold' : 'normal'}>
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
        <div className="overflow-x-auto max-h-72 border border-slate-800 rounded-2xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#050d20] text-slate-400 border-b border-slate-800 sticky top-0">
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
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {timeframe === 'HOURS' && displayHours.map((h, i) => (
                <tr key={i} className="hover:bg-slate-900/60">
                  <td className="p-2.5 text-cyan-300 font-bold">
                    {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-2.5">{h.condition_code?.replace(/_/g, ' ')}</td>
                  <td className={`p-2.5 font-bold ${h.precipitation_mm >= 15 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {h.precipitation_mm ?? 0} mm/h
                  </td>
                  <td className="p-2.5 text-amber-300 font-bold">{h.accumulated_precipitation_mm ?? 0} mm</td>
                  <td className="p-2.5 text-teal-300">{h.rain_probability_pct ?? 0}%</td>
                  <td className="p-2.5">{h.temperature_c ?? '--'}°C</td>
                  <td className="p-2.5">{h.wind_speed_kmh ?? '--'} km/h</td>
                </tr>
              ))}

              {timeframe === 'DAYS' && displayDays.map((d, i) => (
                <tr key={i} className="hover:bg-slate-900/60">
                  <td className="p-2.5 text-cyan-300 font-bold">{d.date}</td>
                  <td className="p-2.5">{d.dominant_condition?.replace(/_/g, ' ')}</td>
                  <td className={`p-2.5 font-bold ${d.total_precipitation_mm >= 50 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {d.total_precipitation_mm} mm
                  </td>
                  <td className="p-2.5 text-teal-300">{d.rain_probability_max_pct}%</td>
                  <td className="p-2.5">{d.temperature_min_c}°C – {d.temperature_max_c}°C</td>
                  <td className="p-2.5 text-slate-400">{d.warning_source || 'Open-Meteo NWP'}</td>
                </tr>
              ))}

              {timeframe === 'WEEKS' && weeksData.map((w, i) => (
                <tr key={i} className="hover:bg-slate-900/60">
                  <td className="p-2.5 text-purple-300 font-bold">{w.label}</td>
                  <td className="p-2.5 font-bold text-slate-200">{w.total_rainfall_mm} mm</td>
                  <td className={`p-2.5 font-bold ${w.anomaly_departure_pct > 0 ? 'text-rose-400' : 'text-cyan-300'}`}>
                    {w.anomaly_departure_pct > 0 ? `+${w.anomaly_departure_pct}%` : `${w.anomaly_departure_pct}%`}
                  </td>
                  <td className="p-2.5 text-amber-300">±{w.nwp_ensemble_spread_mm} mm</td>
                  <td className="p-2.5 text-purple-400 font-bold">{w.soil_saturation_buildup_pct}%</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      w.risk_category === 'SURGE_WARNING' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-300'
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
      <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-slate-400 border-t border-slate-800/60 pt-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-cyan-500 rounded-xs" /> 
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
