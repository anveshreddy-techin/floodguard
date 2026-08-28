'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
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
  const [selectedSensorIndex, setSelectedSensorIndex] = useState<number>(0);

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
      name: 'Mid-Catchment Soil Probe Cluster',
      type: 'TDR_MOISTURE_PROBE',
      elevation: '1,320 m ASL',
      status: 'STALE',
      battery: '62%',
      signal: '-84 dBm (Satellite Iridium)',
      lastTransmission: '14 min ago',
      value: '82% VWC Saturation',
      trend: '+4% / h',
      quality: 'ESTIMATED (FALLBACK)',
      logs: [
        { time: '13:31:00 UTC', reading: '82% VWC', battery: '3.71V', snr: '7.8 dB' },
        { time: '13:00:00 UTC', reading: '80% VWC', battery: '3.72V', snr: '8.0 dB' },
      ],
    },
    {
      id: 'DEBRIS-003',
      name: 'Gully Acoustic Geophone Tripwire',
      type: 'PIEZO_GEOPHONE',
      elevation: '1,510 m ASL',
      status: 'ONLINE',
      battery: '91%',
      signal: '-65 dBm (LoRaWAN)',
      lastTransmission: '1 min ago',
      value: '1.2 Hz Background Noise',
      trend: 'Normal (No Debris Shock)',
      quality: '100% VALIDATED',
      logs: [
        { time: '13:44:00 UTC', reading: '1.2 Hz', battery: '3.88V', snr: '11.0 dB' },
        { time: '13:29:00 UTC', reading: '1.1 Hz', battery: '3.89V', snr: '11.2 dB' },
      ],
    },
  ];

  const current = sensorNodes[selectedSensorIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[#070d1e] text-slate-100 select-none">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="sensors" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#223354] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">
                  TELEMETRY NETWORK
                </span>
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  REAL-TIME IoT SENSOR FIELD CONSTELLATION
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Continuous in-situ monitoring across mountain precipitation, river radar stages, soil TDR probes, and debris tripwires
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Master 4-Node Sensor Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sensorNodes.map((s, idx) => {
              const isSelected = selectedSensorIndex === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSensorIndex(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                    isSelected
                      ? 'bg-blue-600/30 border-cyan-400 text-slate-100 ring-2 ring-cyan-500 shadow-2xl'
                      : 'bg-[#0e1630] border-[#223354] text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-cyan-400 text-[10px] font-bold">{s.id}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          s.status === 'ONLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'
                        }`} />
                        <span className="font-mono text-[9px] text-slate-400">{s.status}</span>
                      </div>
                    </div>
                    <div className="font-bold text-slate-100 text-xs mt-1 leading-snug">{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{s.elevation}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1 font-mono text-[11px]">
                    <div className="text-slate-100 font-bold text-sm truncate">{s.value}</div>
                    <div className="text-orange-400 text-[10px]">{s.trend}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Sensor Deep Telemetry Inspector */}
          <div className="bg-[#0e1630] border border-[#223354] rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                  TELEMETRY INSPECTOR: {current.id}
                </span>
                <h2 className="text-lg font-bold text-slate-100 mt-0.5">{current.name}</h2>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Device: {current.type} • Telemetry Uplink: {current.signal}
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
                <div className="flex items-center gap-1">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  <span>{current.battery}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>{current.lastTransmission}</span>
                </div>
              </div>
            </div>

            {/* Ingestion Transmission Log Table */}
            <div className="space-y-3">
              <div className="font-mono font-bold text-slate-300 text-xs uppercase tracking-wider">
                RECENT TRANSMISSION TELEMETRY FRAMES (HMAC VERIFIED)
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#070d1e] text-slate-400 font-mono text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Timestamp (UTC)</th>
                      <th className="p-2.5">Primary Reading</th>
                      <th className="p-2.5">Operating Voltage</th>
                      <th className="p-2.5">Signal SNR</th>
                      <th className="p-2.5 text-right">Integrity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                    {current.logs.map((log, i) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        <td className="p-2.5 text-cyan-300">{log.time}</td>
                        <td className="p-2.5 font-bold text-slate-100">{log.reading}</td>
                        <td className="p-2.5 text-slate-300">{log.battery}</td>
                        <td className="p-2.5 text-slate-400">{log.snr}</td>
                        <td className="p-2.5 text-right text-emerald-400 font-bold">SHA-256 VALID</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
