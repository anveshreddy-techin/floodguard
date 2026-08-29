'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
import { 
  Activity, 
  Radio, 
  Battery, 
  Signal, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Mountain,
  Wifi,
  Zap,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function SensorsConstellationPage() {
  const { setPage, setMode } = useEnvironment();
  const [selectedSensorIndex, setSelectedSensorIndex] = useState<number>(0);
  const [packetTick, setPacketTick] = useState<number>(0);

  useEffect(() => {
    setPage('sensors');
    setMode('LIVE');
    const interval = setInterval(() => {
      setPacketTick((prev) => (prev + 1) % 100);
    }, 1200);
    return () => clearInterval(interval);
  }, [setPage, setMode]);

  const sensorNodes = [
    {
      id: 'AWS-001',
      name: 'High Ridge Rain Gauge Station',
      type: 'TIPPING_BUCKET_AWS',
      elevation: '1,450 m ASL',
      slope: '34° Ridge Slope',
      coords: { x: 140, y: 70 },
      status: 'ONLINE',
      battery: '94%',
      batteryVoltage: '3.94V',
      signal: '-68 dBm (LoRaWAN)',
      snr: '10.5 dB',
      lastTransmission: '8 sec ago',
      value: '48.0 mm (3h sum)',
      trend: '+16.0 mm/h Surge',
      quality: '100% VALIDATED',
      desc: 'Orographic precipitation collection node at upper catchment ridge. Dual-reed switch tipping bucket with heating element.',
      logs: [
        { time: '13:45:00 UTC', reading: '16.0 mm/h', battery: '3.92V', snr: '10.2 dB', status: 'VALID' },
        { time: '13:30:00 UTC', reading: '18.5 mm/h', battery: '3.93V', snr: '10.4 dB', status: 'VALID' },
        { time: '13:15:00 UTC', reading: '13.5 mm/h', battery: '3.94V', snr: '10.5 dB', status: 'VALID' },
        { time: '13:00:00 UTC', reading: '11.0 mm/h', battery: '3.95V', snr: '10.6 dB', status: 'VALID' },
      ],
    },
    {
      id: 'SOIL-002',
      name: 'Mid-Slope TDR Soil Moisture Array',
      type: 'TIME_DOMAIN_REFLECTOMETRY',
      elevation: '1,320 m ASL',
      slope: '28° Colluvial Fan',
      coords: { x: 320, y: 140 },
      status: 'DEGRADED',
      battery: '62%',
      batteryVoltage: '3.61V',
      signal: '-104 dBm (Weak)',
      snr: '4.1 dB',
      lastTransmission: '14 min ago',
      value: '82% Saturation Index',
      trend: 'CRITICAL PRECONDITION',
      quality: 'FALLBACK INFERRED',
      desc: 'Multi-depth TDR soil moisture wave probe. Signal degraded due to antenna tilt. Antecedent precipitation model acting as fallback.',
      logs: [
        { time: '13:31:00 UTC', reading: '82% Si', battery: '3.61V', snr: '4.1 dB', status: 'WEAK_SIG' },
        { time: '13:00:00 UTC', reading: '78% Si', battery: '3.62V', snr: '4.5 dB', status: 'WEAK_SIG' },
        { time: '12:00:00 UTC', reading: '74% Si', battery: '3.64V', snr: '5.2 dB', status: 'VALID' },
      ],
    },
    {
      id: 'GEO-001',
      name: 'Gully Debris Tripwire & Geophone',
      type: 'SEISMIC_GEOPHONE_ARRAY',
      elevation: '1,290 m ASL',
      slope: '38° Colluvial Choke',
      coords: { x: 490, y: 190 },
      status: 'ONLINE',
      battery: '91%',
      batteryVoltage: '3.88V',
      signal: '-70 dBm (LoRaWAN)',
      snr: '11.0 dB',
      lastTransmission: '12 sec ago',
      value: '18.4 Hz Amplitude',
      trend: 'ELEVATED VIBRATION',
      quality: '100% VALIDATED',
      desc: 'Piezoelectric seismic tremor monitor detecting high-velocity debris and boulder movements in steep feeder gully.',
      logs: [
        { time: '13:45:00 UTC', reading: '18.4 Hz', battery: '3.88V', snr: '11.0 dB', status: 'VALID' },
        { time: '13:30:00 UTC', reading: '12.1 Hz', battery: '3.89V', snr: '11.2 dB', status: 'VALID' },
        { time: '13:15:00 UTC', reading: '9.4 Hz', battery: '3.90V', snr: '11.4 dB', status: 'VALID' },
      ],
    },
    {
      id: 'RADAR-001',
      name: 'River Stage Non-Contact FMCW Radar #1',
      type: 'FMCW_RADAR_GAUGE',
      elevation: '1,180 m ASL',
      slope: 'Channel Confluence',
      coords: { x: 670, y: 260 },
      status: 'ONLINE',
      battery: '88%',
      batteryVoltage: '12.4V Solar',
      signal: '-72 dBm (4G LTE)',
      snr: '14.1 dB',
      lastTransmission: '35 sec ago',
      value: '3.80 m Stage',
      trend: '↑ +0.40 m/h Surge',
      quality: '100% VALIDATED',
      desc: '24 GHz FMCW non-contact radar level sensor suspended over mainstem gorge bridge. Millimeter-accurate hydrography.',
      logs: [
        { time: '13:45:00 UTC', reading: '3.80 m', battery: '12.4V', snr: '14.1 dB', status: 'VALID' },
        { time: '13:30:00 UTC', reading: '3.70 m', battery: '12.4V', snr: '14.0 dB', status: 'VALID' },
        { time: '13:15:00 UTC', reading: '3.55 m', battery: '12.5V', snr: '14.2 dB', status: 'VALID' },
        { time: '13:00:00 UTC', reading: '3.40 m', battery: '12.5V', snr: '14.3 dB', status: 'VALID' },
      ],
    },
  ];

  const current = sensorNodes[selectedSensorIndex];

  return (
    <div className="flex flex-col min-h-screen select-none bg-[#020714]">
      <Header dataMode="LIVE" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="sensors" />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-7xl mx-auto space-y-5 pb-24 md:pb-6 overflow-y-auto">
          {/* Page Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="chip chip-live">LIVING SENSOR FIELD</span>
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                  IOT SENSOR CONSTELLATION & HYDROLOGICAL MESH
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Real-time physical telemetry stream from mountain ridge rain gauges, FMCW radar river stations, soil TDR probes, and seismic geophones
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>3/4 NODES ONLINE</span>
              </span>
              <DataModeBadge mode="LIVE" />
            </div>
          </div>

          {/* ── HERO: Mountain Elevation Cross-Section Spatial Sensor Map ── */}
          <div className="fp fp-operational rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
                <Mountain className="w-4 h-4 text-cyan-400" />
                CATCHMENT ELEVATION DEPLOYMENT PROFILE (1,450m Ridge → 1,180m Gorge)
              </span>
              <span className="text-[10px] font-mono text-slate-400">CLICK SENSOR NODE TO INSPECT TELEMETRY</span>
            </div>

            {/* Spatial Mountain SVG Canvas */}
            <div className="w-full h-56 sm:h-64 bg-[#03091e] rounded-2xl relative overflow-hidden border border-cyan-500/20">
              <svg viewBox="0 0 800 320" className="w-full h-full object-cover">
                <defs>
                  <linearGradient id="mountainSlopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0a193b" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#07132c" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#040b1a" stopOpacity="0.95" />
                  </linearGradient>

                  <radialGradient id="sensorPulseGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00A8E8" stopOpacity="0.8" />
                    <stop offset="60%" stopColor="#00A8E8" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00A8E8" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Topographic Mountain Silhouette Profile */}
                <path
                  d="M 50,40 Q 200,90 350,150 T 600,240 L 780,280 L 780,320 L 20,320 Z"
                  fill="url(#mountainSlopeGrad)"
                  stroke="#1e3a8a"
                  strokeWidth="1.5"
                />

                {/* Flowing Waterline at Confluence */}
                <path
                  d="M 580,240 Q 660,260 780,290"
                  fill="none"
                  stroke="#00A8E8"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeOpacity="0.7"
                />

                {/* Elevation Baseline Markers */}
                <line x1="50" y1="40" x2="780" y2="40" stroke="rgba(56,189,248,0.1)" strokeDasharray="3 4" />
                <line x1="50" y1="140" x2="780" y2="140" stroke="rgba(56,189,248,0.1)" strokeDasharray="3 4" />
                <line x1="50" y1="260" x2="780" y2="260" stroke="rgba(56,189,248,0.1)" strokeDasharray="3 4" />
                <text x="60" y="35" fill="#64748b" fontSize="9" fontFamily="monospace">1,450m (Ridge Peak)</text>
                <text x="60" y="135" fill="#64748b" fontSize="9" fontFamily="monospace">1,320m (Mid Slope)</text>
                <text x="60" y="255" fill="#64748b" fontSize="9" fontFamily="monospace">1,180m (River Gorge)</text>

                {/* Interactive Sensor Nodes */}
                {sensorNodes.map((s, idx) => {
                  const isSelected = selectedSensorIndex === idx;
                  const isDegraded = s.status === 'DEGRADED';
                  const nodeColor = isDegraded ? '#F39C12' : '#00A8E8';

                  return (
                    <g
                      key={s.id}
                      className="cursor-pointer transition-transform duration-300"
                      onClick={() => setSelectedSensorIndex(idx)}
                    >
                      {/* Pulsing Radio Rings */}
                      <circle
                        cx={s.coords.x}
                        cy={s.coords.y}
                        r={isSelected ? '28' : '18'}
                        fill="none"
                        stroke={nodeColor}
                        strokeWidth="1.5"
                        className="animate-ping opacity-60"
                      />

                      {/* Main Node Pin */}
                      <circle
                        cx={s.coords.x}
                        cy={s.coords.y}
                        r={isSelected ? '12' : '9'}
                        fill={nodeColor}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? '3' : '1.5'}
                        style={{ filter: `drop-shadow(0 0 10px ${nodeColor})` }}
                      />

                      {/* Label Pill */}
                      <rect
                        x={s.coords.x - 45}
                        y={s.coords.y + 16}
                        width="90"
                        height="20"
                        rx="5"
                        fill="rgba(6,14,32,0.92)"
                        stroke={isSelected ? '#38bdf8' : 'rgba(56,189,248,0.3)'}
                        strokeWidth={isSelected ? '1.5' : '0.8'}
                      />
                      <text
                        x={s.coords.x}
                        y={s.coords.y + 30}
                        textAnchor="middle"
                        fill={isSelected ? '#38bdf8' : '#ffffff'}
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {s.id} • {s.elevation.split(' ')[0]}m
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* ── Granular Sensor Inspector (Split View) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Sensor Nodes Mini-Cards (5 Cols) */}
            <div className="lg:col-span-5 space-y-2.5">
              {sensorNodes.map((s, idx) => {
                const isSelected = selectedSensorIndex === idx;
                const isDegraded = s.status === 'DEGRADED';
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSensorIndex(idx)}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'fp-operational border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] scale-[1.01]'
                        : isDegraded
                        ? 'fp-critical'
                        : 'fp hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isDegraded ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                        <span className="font-mono text-xs font-black text-white">{s.id}</span>
                        <span className="text-[10px] font-mono text-slate-400">({s.elevation})</span>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        isDegraded ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {s.status}
                      </span>
                    </div>

                    <div className="font-bold text-slate-200 text-xs">{s.name}</div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>Value: <strong className="text-cyan-300">{s.value}</strong></span>
                      <span>Signal: <strong className={isDegraded ? 'text-amber-400' : 'text-slate-300'}>{s.signal.split(' ')[0]}</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Node Real-Time Telemetric Detail View (7 Cols) */}
            <div className="lg:col-span-7 fp fp-operational rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl animate-slide-up">
              <div className="border-b border-slate-800 pb-3.5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{current.id} • {current.type}</div>
                  <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">{current.name}</h2>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{current.elevation} • {current.slope}</div>
                </div>
                <span className={`chip ${current.status === 'DEGRADED' ? 'chip-sim' : 'chip-live'}`}>
                  {current.quality}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">{current.desc}</p>

              {/* Physical Telemetry Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="fp p-3 rounded-2xl text-center">
                  <div className="text-slate-400 text-[10px] flex items-center justify-center gap-1">
                    <Battery className="w-3 h-3 text-emerald-400" /> Battery
                  </div>
                  <div className="text-emerald-300 font-bold mt-1">{current.battery}</div>
                  <div className="text-[9px] text-slate-500">{current.batteryVoltage}</div>
                </div>

                <div className="fp p-3 rounded-2xl text-center">
                  <div className="text-slate-400 text-[10px] flex items-center justify-center gap-1">
                    <Signal className="w-3 h-3 text-purple-400" /> RSSI / SNR
                  </div>
                  <div className="text-purple-300 font-bold mt-1">{current.signal.split(' ')[0]}</div>
                  <div className="text-[9px] text-slate-500">SNR: {current.snr}</div>
                </div>

                <div className="fp p-3 rounded-2xl text-center">
                  <div className="text-slate-400 text-[10px] flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" /> Packet Freshness
                  </div>
                  <div className="text-amber-300 font-bold mt-1">{current.lastTransmission}</div>
                  <div className="text-[9px] text-slate-500">Live Cycle</div>
                </div>

                <div className="fp p-3 rounded-2xl text-center">
                  <div className="text-slate-400 text-[10px] flex items-center justify-center gap-1">
                    <Wifi className="w-3 h-3 text-cyan-400" /> Protocol
                  </div>
                  <div className="text-cyan-300 font-bold mt-1">LoRaWAN 868</div>
                  <div className="text-[9px] text-slate-500">AES-128 Encrypted</div>
                </div>
              </div>

              {/* Primary Telemetry Metric Dial Box */}
              <div className="fp p-4 sm:p-5 rounded-2xl space-y-1.5 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-blue-950/40">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 uppercase font-bold">CURRENT PHYSICAL READING</span>
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> {current.trend}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">{current.value}</div>
              </div>

              {/* Telemetry Packet Stream Logs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold">
                  <span>RAW TELEMETRY FRAME STREAM</span>
                  <span className="text-cyan-400 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> LIVE PACKETS
                  </span>
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  {current.logs.map((lg, i) => (
                    <div key={i} className="fp p-2.5 rounded-xl flex items-center justify-between text-slate-200">
                      <span className="text-slate-400">{lg.time}</span>
                      <span className="text-cyan-300 font-bold">{lg.reading}</span>
                      <span className="text-slate-400">Batt: {lg.battery}</span>
                      <span className="text-emerald-400 text-[10px]">{lg.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
