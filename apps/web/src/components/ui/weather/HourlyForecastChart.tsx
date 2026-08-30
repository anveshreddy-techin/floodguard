'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Table, Clock, Droplets } from 'lucide-react';
import { WeatherConditionBadge } from './WeatherBadges';

interface HourlyForecastChartProps {
  hours: any[];
}

export const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({ hours = [] }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [showTable, setShowTable] = useState<boolean>(false);

  if (!hours || hours.length === 0) {
    return (
      <div className="fp p-6 rounded-2xl text-center text-slate-400 font-mono text-xs">
        No hourly forecast records available for this coordinate pair.
      </div>
    );
  }

  // Focus on next 24 hours for the chart
  const displayHours = hours.slice(0, 24);
  const maxRain = Math.max(15.0, ...displayHours.map(h => (h.precipitation_mm || 0) * 1.2));
  const maxAccum = Math.max(20.0, ...displayHours.map(h => h.accumulated_precipitation_mm || 0));

  // Chart dimensions
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;
  const barWidth = chartWidth / displayHours.length;

  // Calculate points for cumulative rainfall line
  const accumPoints = displayHours.map((h, i) => {
    const x = paddingX + i * barWidth + barWidth / 2;
    const y = paddingY + chartHeight - ((h.accumulated_precipitation_mm || 0) / maxAccum) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const activeHour = hoveredIdx !== null ? displayHours[hoveredIdx] : displayHours[0];

  return (
    <div className="fp fp-operational p-4 sm:p-5 rounded-2xl space-y-4 border border-slate-800 shadow-2xl">
      
      {/* Title & Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-black font-mono text-white tracking-wide uppercase">
            24-HOUR HOURLY RAINFALL & CUMULATIVE HYDROGRAPH
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTable(!showTable)}
            className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1 active:scale-95 transition"
          >
            <Table className="w-3.5 h-3.5" />
            <span>{showTable ? 'SHOW CHART' : 'DATA TABLE'}</span>
          </button>
        </div>
      </div>

      {/* Selected Hour Telemetry Inspector Strip */}
      {activeHour && (
        <div className="bg-slate-900/80 border border-cyan-500/30 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-300 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">
              TIME: {new Date(activeHour.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <WeatherConditionBadge condition={activeHour.condition_code} />
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <span>Rain: <strong className="text-cyan-300">{activeHour.precipitation_mm ?? 0} mm/h</strong></span>
            <span>Prob: <strong className="text-teal-300">{activeHour.rain_probability_pct ?? 0}%</strong></span>
            <span>Cumulative: <strong className="text-amber-300">{activeHour.accumulated_precipitation_mm ?? 0} mm</strong></span>
            <span>Temp: <strong className="text-white">{activeHour.temperature_c ?? '--'}°C</strong></span>
          </div>
        </div>
      )}

      {/* Primary SVG Hydrograph Chart */}
      {!showTable ? (
        <div className="relative w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[650px]">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
              <defs>
                <linearGradient id="rainBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="alertBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#be123c" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="accumAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, idx) => {
                const y = paddingY + chartHeight * (1 - ratio);
                const val = (maxRain * ratio).toFixed(0);
                return (
                  <g key={idx}>
                    <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
                    <text x={paddingX - 6} y={y + 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">{val} mm</text>
                  </g>
                );
              })}

              {/* Alert Threshold Line (15mm/h) */}
              {(() => {
                const alertY = paddingY + chartHeight - (15.0 / maxRain) * chartHeight;
                if (alertY >= paddingY && alertY <= paddingY + chartHeight) {
                  return (
                    <g>
                      <line x1={paddingX} y1={alertY} x2={svgWidth - paddingX} y2={alertY} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,2" />
                      <text x={svgWidth - paddingX} y={alertY - 4} textAnchor="end" fill="#fb7185" fontSize="8" fontFamily="monospace">HEAVY SURGE THRESHOLD (15 mm/h)</text>
                    </g>
                  );
                }
                return null;
              })()}

              {/* Cumulative Rainfall Line */}
              <polyline
                points={accumPoints}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Hourly Precipitation Bars */}
              {displayHours.map((h, idx) => {
                const rainVal = h.precipitation_mm || 0;
                const hHeight = Math.max(2, (rainVal / maxRain) * chartHeight);
                const x = paddingX + idx * barWidth + 3;
                const y = paddingY + chartHeight - hHeight;
                const isAlert = rainVal >= 15.0;
                const isHovered = hoveredIdx === idx;

                const timeLabel = new Date(h.timestamp).getHours() + ':00';

                return (
                  <g 
                    key={idx}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredIdx(idx)}
                  >
                    {/* Interactive hit area */}
                    <rect
                      x={paddingX + idx * barWidth}
                      y={paddingY}
                      width={barWidth}
                      height={chartHeight}
                      fill={isHovered ? 'rgba(6,182,212,0.1)' : 'transparent'}
                    />

                    {/* Bar rectangle */}
                    <rect
                      x={x}
                      y={y}
                      width={Math.max(4, barWidth - 6)}
                      height={hHeight}
                      rx="3"
                      fill={isAlert ? 'url(#alertBarGrad)' : 'url(#rainBarGrad)'}
                      stroke={isHovered ? '#38bdf8' : (isAlert ? '#f43f5e' : 'none')}
                      strokeWidth={isHovered ? 1.5 : 0}
                    />

                    {/* Cumulative node dot */}
                    <circle
                      cx={paddingX + idx * barWidth + barWidth / 2}
                      cy={paddingY + chartHeight - ((h.accumulated_precipitation_mm || 0) / maxAccum) * chartHeight}
                      r={isHovered ? 4 : 2}
                      fill="#fbbf24"
                      stroke="#0f172a"
                      strokeWidth="1"
                    />

                    {/* X-axis time label (every 3 hours) */}
                    {idx % 3 === 0 && (
                      <text
                        x={paddingX + idx * barWidth + barWidth / 2}
                        y={svgHeight - 8}
                        textAnchor="middle"
                        fill={isHovered ? '#38bdf8' : '#64748b'}
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight={isHovered ? 'bold' : 'normal'}
                      >
                        {timeLabel}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      ) : (
        /* Accessible Data Table */
        <div className="overflow-x-auto max-h-72 border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 sticky top-0">
              <tr>
                <th className="p-2.5">Time</th>
                <th className="p-2.5">Condition</th>
                <th className="p-2.5">Rain (mm/h)</th>
                <th className="p-2.5">Cumulative (mm)</th>
                <th className="p-2.5">Rain Prob</th>
                <th className="p-2.5">Temp (°C)</th>
                <th className="p-2.5">Wind (km/h)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {displayHours.map((h, i) => (
                <tr key={i} className="hover:bg-slate-900/60">
                  <td className="p-2.5 text-cyan-300 font-bold">
                    {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-2.5">{h.condition_code.replace(/_/g, ' ')}</td>
                  <td className={`p-2.5 font-bold ${h.precipitation_mm >= 15 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {h.precipitation_mm ?? 0}
                  </td>
                  <td className="p-2.5 text-amber-300 font-bold">{h.accumulated_precipitation_mm ?? 0}</td>
                  <td className="p-2.5 text-teal-300">{h.rain_probability_pct ?? 0}%</td>
                  <td className="p-2.5">{h.temperature_c ?? '--'}°C</td>
                  <td className="p-2.5">{h.wind_speed_kmh ?? '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend & Footnote */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-slate-400 border-t border-slate-800/60 pt-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-cyan-500 rounded-xs" /> Hourly Rain (mm/h)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400 rounded-xs" /> Cumulative Rain (mm)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500 border border-dashed border-rose-400" /> Alert Level (15mm/h)
          </span>
        </div>
        <div>Hover over any hour for exact telemetry breakdown</div>
      </div>

    </div>
  );
};
