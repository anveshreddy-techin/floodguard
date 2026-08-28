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
  Cpu
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function SensorsConstellationPage() {
  const { setPage, setMode } = useEnvironment();
  const [selectedSensorIndex, setSelectedSensorIndex] = useState<number>(0);

  useEffect(() => {
    setPage('sensors');
    setMode('LIVE');
  }, [setPage, setMode]);

  const sensorNodes = [
    {
      id: 'AWS-001',
      name: 'High Ridge Rain Gauge Station',
      type: 'TIPPING_BUCKET_AWS',
      elevation: '1,450 m ASL',
      status: 'ONLINE',
      battery: '94%',
      signal: '-68 dBm (LoRaWAN)',
      lastTransmission: '28 sec ago',
      value: '48.0 mm (3h sum)',
      trend: '+16.0 mm/h',
      quality: '100% VALIDATED',
      logs: [
        { time: '13:45:00 UTC', reading: '16.0 mm/h', battery: '3.92V', snr: '10.2 dB' },
        { time: '13:30:00 UTC', reading: '18.5 mm/h', battery: '3.93V', snr: '10.4 dB' },
        { time: '13:15:00 UTC', reading: '13.5 mm/h', battery: '3.94V', snr: '10.5 dB' },
      ],
    },
    {
      id: 'RADAR-001',
      name: 'River Stage Non-Contact Radar #1',
      type: 'FMCW_RADAR_GAUGE',
      elevation: '1,180 m ASL',
      status: 'ONLINE',
      battery: '88%',
      signal: '-72 dBm (4G LTE)',
      lastTransmission: '45 sec ago',
      value: '3.80 m stage',
      trend: '+0.40 m/h',
      quality: '100% VALIDATED',
      logs: [
        { time: '13:45:00 UTC', reading: '3.80 m', battery: '12.4V', snr: '14.1 dB' },
        { time: '13:30:00 UTC', reading: '3.70 m', battery: '12.4V', snr: '14.0 dB' },
        { time: '13:15:00 UTC', reading: '3.55 m', battery: '12.5V', snr: '14.2 dB' },
      ],
    },
    {
      id: 'SOIL-002',
      name: 'Mid-Slope TDR Soil Probe Array',
      type: 'TIME_DOMAIN_REFLECTOMETRY',
      elevation: '1,320 m ASL',
      status: 'DEGRADED',
      battery: '62%',
      signal: '-104 dBm (Weak)',
      lastTransmission: '14 min ago',
      value: '82% Saturation Index',
      trend: 'CRITICAL THRESHOLD',
      quality: 'INTERPOLATED FALLBACK',
      logs: [
        { time: '13:31:00 UTC', reading: '82% Si', battery: '3.61V', snr: '4.1 dB' },
        { time: '13:00:00 UTC', reading: '78% Si', battery: '3.62V', snr: '4.5 dB' },
      ],
    },
    {
      id: 'GEO-001',
      name: 'Gully Debris Tripwire & Geophone',
      type: 'SEISMIC_GEOPHONE_ARRAY',
      elevation: '1,290 m ASL',
      status: 'ONLINE',
      battery: '91%',
      signal: '-70 dBm (LoRaWAN)',
      lastTransmission: '12 sec ago',
      value: '18.4 Hz Amplitude',
      trend: 'ELEVATED VIBRATION',
      quality: '100% VALIDATED',
      logs: [
        { time: '13:45:00 UTC', reading: '18.4 Hz', battery: '3.88V', snr: '11.0 dB' },
        { time: '13:30:00 UTC', reading: '12.1 Hz', battery: '3.89V', snr: '11.2 dB' },
      ],
    },
  ];

  const current = sensorNodes[selectedSensorIndex];

  return (
    <div className="flex flex-col min-h-screen select-none">
      <Header dataMode="LIVE" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="sensors" />

        <main className="flex-1 p-5 lg:p-6 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="chip chip-live">TELEMETRY MESH</span>
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-cyan-400" />
                  IOT SENSOR CONSTELLATION & HYDROLOGICAL PROBES
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Real-time telemetry stream from rain gauges, FMCW radar river gauges, TDR soil sensors, and seismic geophones
              </p>
            </div>
            <DataModeBadge mode="LIVE" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sensor Nodes List (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              {sensorNodes.map((s, idx) => {
                const isSelected = selectedSensorIndex === idx;
                const isDegraded = s.status === 'DEGRADED';
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSensorIndex(idx)}
                    className={`w-full p-4 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'fp-operational ring-2 ring-cyan-400 shadow-xl scale-[1.01]'
                        : isDegraded
                        ? 'fp-critical'
                        : 'fp hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-300">{s.id}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        isDegraded ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    <div className="font-bold text-white text-xs leading-snug">{s.name}</div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>Value: <strong className="text-cyan-300">{s.value}</strong></span>
                      <span>Batt: {s.battery}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sensor Detail View (7 Cols) */}
            <div className="lg:col-span-7 fp fp-operational rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-slide-up">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{current.id} • {current.type}</div>
                  <h2 className="text-xl font-black text-white mt-0.5">{current.name}</h2>
                </div>
                <span className="chip chip-live">{current.quality}</span>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="fp p-3 rounded-2xl text-center">
                  <div className="text-slate-400 text-[10px]">Elevation</div>
                  <div className="text-cyan-300 font-bold mt-0.5">{current.elevation}</div>
                </div>
                <div className="fp p-3 rounded-2xl text-center">
                  <div className="text-slate-400 text-[10px]">Battery</div>
                  <div className="text-emerald-300 font-bold mt-0.5">{current.battery}</div>
                </div>
                <div className="fp p-3 rounded-2xl text-center">
                  <div className="text-slate-400 text-[10px]">Signal</div>
                  <div className="text-purple-300 font-bold mt-0.5">{current.signal}</div>
                </div>
                <div className="fp p-3 rounded-2xl text-center">
                  <div className="text-slate-400 text-[10px]">Last Packet</div>
                  <div className="text-amber-300 font-bold mt-0.5">{current.lastTransmission}</div>
                </div>
              </div>

              {/* Value & Trend */}
              <div className="fp p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">CURRENT TELEMETRIC READING</span>
                  <span className="text-cyan-300 font-bold">{current.trend}</span>
                </div>
                <div className="text-3xl font-black text-white font-mono">{current.value}</div>
              </div>

              {/* Log Frames */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">RECENT TELEMETRY PACKETS</span>
                <div className="space-y-1.5 font-mono text-xs">
                  {current.logs.map((lg, i) => (
                    <div key={i} className="fp p-2.5 rounded-xl flex items-center justify-between text-slate-200">
                      <span className="text-slate-400">{lg.time}</span>
                      <span className="text-cyan-300 font-bold">{lg.reading}</span>
                      <span className="text-slate-400">SNR: {lg.snr}</span>
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
