'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { Activity, Droplets, Waves, Mountain, ShieldAlert, ArrowUpRight, Zap, Radio } from 'lucide-react';

const HYDRO_TIME_SERIES = [
  { time: 'T-12h', stage: 1.8, danger: 4.2, rainfall: 4, soilSaturation: 45 },
  { time: 'T-10h', stage: 1.9, danger: 4.2, rainfall: 6, soilSaturation: 52 },
  { time: 'T-8h', stage: 2.1, danger: 4.2, rainfall: 12, soilSaturation: 61 },
  { time: 'T-6h', stage: 2.3, danger: 4.2, rainfall: 18, soilSaturation: 68 },
  { time: 'T-4h', stage: 2.8, danger: 4.2, rainfall: 28, soilSaturation: 74 },
  { time: 'T-2h', stage: 3.4, danger: 4.2, rainfall: 38, soilSaturation: 79 },
  { time: 'T-60m', stage: 3.7, danger: 4.2, rainfall: 44, soilSaturation: 81 },
  { time: 'NOW', stage: 3.9, danger: 4.2, rainfall: 48, soilSaturation: 82 },
  { time: '+30m (Proj)', stage: 4.3, danger: 4.2, rainfall: 52, soilSaturation: 86 },
  { time: '+60m (Proj)', stage: 4.6, danger: 4.2, rainfall: 55, soilSaturation: 89 },
  { time: '+90m (Proj)', stage: 4.8, danger: 4.2, rainfall: 50, soilSaturation: 91 },
  { time: '+120m (Proj)', stage: 4.4, danger: 4.2, rainfall: 35, soilSaturation: 88 },
];

export const HydrodynamicInsightsDashboard: React.FC<{
  currentStage?: number;
  rainfall?: number;
  soilPercent?: number;
}> = ({
  currentStage = 3.9,
  rainfall = 48,
  soilPercent = 82,
}) => {
  const [activeMetricTab, setActiveMetricTab] = useState<'HYDROGRAPH' | 'INFILTRATION'>('HYDROGRAPH');

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4 text-white shadow-xl backdrop-blur-md">
      {/* Dashboard Top Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-black text-white font-mono uppercase tracking-wider">
                Hydrodynamic Telemetry &amp; Insights
              </h3>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE RECHARTS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Real-time river stage hydrograph vs catchment soil absorption ceiling
            </p>
          </div>
        </div>

        {/* Chart View Toggle Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono self-start sm:self-auto">
          <button
            onClick={() => setActiveMetricTab('HYDROGRAPH')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              activeMetricTab === 'HYDROGRAPH'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌊 River Hydrograph
          </button>
          <button
            onClick={() => setActiveMetricTab('INFILTRATION')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              activeMetricTab === 'INFILTRATION'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌧️ Rain vs Saturation
          </button>
        </div>
      </div>

      {/* Real-time KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
            <span>Current Stage</span>
            <Waves className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-mono font-black text-white">{currentStage}m</span>
            <span className="text-[10px] font-mono text-rose-400 font-bold">▲ +0.40m/h</span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 mt-0.5">Danger: 4.20m (Breach +30m)</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
            <span>Rainfall Rate</span>
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-mono font-black text-white">{rainfall} mm</span>
            <span className="text-[10px] font-mono text-amber-400 font-bold">/ 3 Hours</span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 mt-0.5">Catchment Max: 55 mm/h</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
            <span>Soil Saturation</span>
            <Mountain className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-mono font-black text-amber-400">{soilPercent}%</span>
            <span className="text-[10px] font-mono text-rose-400 font-bold">CRITICAL</span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 mt-0.5">Remaining Buffer: 18%</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
            <span>IoT Sensor Mesh</span>
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-mono font-black text-emerald-400">18 / 18</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">ONLINE</span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 mt-0.5">LoRa Packet Health: 99.8%</span>
        </div>
      </div>

      {/* Main Recharts Visualization Canvas */}
      <div className="w-full h-56 sm:h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetricTab === 'HYDROGRAPH' ? (
            <AreaChart data={HYDRO_TIME_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="stageAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={[0, 6]} unit="m" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#F8FAFC',
                }}
              />
              <ReferenceLine y={4.2} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'DANGER MARK (4.2m)', fill: '#EF4444', fontSize: 10, position: 'top' }} />
              <Area
                type="monotone"
                dataKey="stage"
                name="River Stage (m)"
                stroke="#60A5FA"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#stageAreaGrad)"
              />
            </AreaChart>
          ) : (
            <ComposedChart data={HYDRO_TIME_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis yAxisId="left" stroke="#38BDF8" fontSize={10} tickLine={false} domain={[0, 60]} unit="mm" />
              <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" fontSize={10} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#F8FAFC',
                }}
              />
              <Bar yAxisId="left" dataKey="rainfall" name="Precipitation (mm/h)" fill="#0284C7" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="soilSaturation" name="Soil Saturation (%)" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Explanatory Footer Annotation */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>Surge crest projected to exceed danger threshold in <strong>32 minutes</strong> without mitigation.</span>
        </span>
        <span className="hidden sm:inline text-blue-400 font-bold">Hydrodynamic Physics Engine ✓</span>
      </div>
    </div>
  );
};
