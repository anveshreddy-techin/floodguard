'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { 
  PlayCircle, 
  Sliders, 
  RotateCcw, 
  Play, 
  Pause, 
  Activity, 
  ShieldAlert, 
  CloudRain, 
  Waves, 
  Mountain, 
  Layers,
  Zap
} from 'lucide-react';
import { RiskBadge, UncertaintyBadge, DataModeBadge } from '@/components/ui/Badges';
import { RiskLevel } from '@/types';

export default function ScenarioSimulatorPage() {
  const [rainfall, setRainfall] = useState<number>(48);
  const [soilMoisture, setSoilMoisture] = useState<number>(82);
  const [riverLevel, setRiverLevel] = useState<number>(3.8);
  const [blockageActive, setBlockageActive] = useState<boolean>(false);
  const [sensorOutage, setSensorOutage] = useState<boolean>(false);
  const [simTimeIndex, setSimTimeIndex] = useState<number>(2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Dynamic risk score calculation based on sliders
  const calculatedRisk = Math.min(
    100,
    Math.round(
      (rainfall / 120) * 35 +
      (soilMoisture / 100) * 25 +
      (riverLevel / 6.0) * 25 +
      (blockageActive ? 15 : 0)
    )
  );

  const riskLevel: RiskLevel = calculatedRisk >= 75 ? 'EXTREME' : calculatedRisk >= 55 ? 'HIGH' : calculatedRisk >= 35 ? 'MODERATE' : 'LOW';

  const presets = [
    { name: 'Monsoon Cloudburst', rain: 95, soil: 88, river: 4.5, blockage: false, desc: 'High intensity downpour on pre-saturated catchment.' },
    { name: 'Upstream Moraine Breach', rain: 35, soil: 70, river: 5.8, blockage: true, desc: 'Sudden hydraulic burst from temporary debris blockage.' },
    { name: 'Cryospheric Surge (Chamoli)', rain: 0, soil: 20, river: 6.2, blockage: true, desc: 'Non-precipitation rock-ice surge wave.' },
    { name: 'Post-Event Quiescent', rain: 5, soil: 40, river: 1.8, blockage: false, desc: 'Normal baseline flow after runoff recession.' },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setRainfall(p.rain);
    setSoilMoisture(p.soil);
    setRiverLevel(p.river);
    setBlockageActive(p.blockage);
  };

  const simTimes = ['00:00 (T0)', '00:15 (+15m)', '00:30 (+30m)', '00:45 (+45m)', '01:00 (+60m)'];

  return (
    <div className="flex flex-col min-h-screen bg-[#070d1e] text-slate-100 select-none">
      <Header dataMode="SIMULATION" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="simulation" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#223354] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono font-bold">
                  WHAT-IF SANDBOX
                </span>
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-purple-400" />
                  IMMERSIVE SCENARIO SIMULATOR & WHAT-IF LAB
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Stress-test flash flood threshold sensitivity, landslide dam bursts, and sensor failure propagation in real time
              </p>
            </div>
            <DataModeBadge mode="SIMULATION" />
          </div>

          {/* Scenario Preset Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p)}
                className="bg-[#0e1630] border border-[#223354] hover:border-purple-400/60 p-3.5 rounded-xl text-left transition group shadow-md"
              >
                <div className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition">{p.name}</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">{p.desc}</div>
                <div className="text-[10px] font-mono text-cyan-400 mt-2">
                  Rain: {p.rain}mm • Soil: {p.soil}% • River: {p.river}m
                </div>
              </button>
            ))}
          </div>

          {/* Master 3-Column Simulator Workbench */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Interactive Controls (4 Cols) */}
            <div className="lg:col-span-4 bg-[#0e1630] border border-[#223354] rounded-2xl p-5 space-y-4 shadow-2xl text-xs">
              <div className="font-mono font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2 border-b border-slate-800 pb-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                HYDRO-METEOROLOGICAL PARAMETERS
              </div>

              {/* Rainfall Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-300">Rainfall Accumulation (3h)</span>
                  <span className="text-cyan-400 font-bold">{rainfall} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={rainfall}
                  onChange={(e) => setRainfall(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Soil Saturation Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-300">Soil Moisture Saturation</span>
                  <span className="text-amber-400 font-bold">{soilMoisture}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={soilMoisture}
                  onChange={(e) => setSoilMoisture(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* River Stage Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-300">Gauge Stage Level</span>
                  <span className="text-blue-400 font-bold">{riverLevel.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.1"
                  value={riverLevel}
                  onChange={(e) => setRiverLevel(Number(e.target.value))}
                  className="w-full accent-blue-400 cursor-pointer"
                />
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                  <span className="text-slate-300 text-[11px]">Upstream Debris Dam / Blockage</span>
                  <input
                    type="checkbox"
                    checked={blockageActive}
                    onChange={(e) => setBlockageActive(e.target.checked)}
                    className="w-4 h-4 accent-purple-400 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                  <span className="text-slate-300 text-[11px]">Simulate Telemetry Sensor Blackout</span>
                  <input
                    type="checkbox"
                    checked={sensorOutage}
                    onChange={(e) => setSensorOutage(e.target.checked)}
                    className="w-4 h-4 accent-rose-400 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Center: Dynamic Simulation Canvas (5 Cols) */}
            <div className="lg:col-span-5 bg-[#0e1630] border border-[#223354] rounded-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  DYNAMIC GIS SIMULATION CANVASES
                </span>
                <span className="text-[10px] font-mono text-slate-400">{simTimes[simTimeIndex]}</span>
              </div>

              {/* SVG Simulation Graphic */}
              <div className="relative w-full h-64 bg-[#070d1e] rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-2">
                <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
                  {/* Terrain */}
                  <path d="M 10,40 Q 150,10 300,50 T 390,30 L 390,230 L 10,230 Z" fill="#0c1836" stroke="#1b2a54" />
                  
                  {/* Dynamic Hazard Flood Pool (Scales with calculated risk) */}
                  <ellipse
                    cx="240"
                    cy="140"
                    rx={60 + (calculatedRisk / 100) * 60}
                    ry={35 + (calculatedRisk / 100) * 35}
                    fill={riskLevel === 'EXTREME' ? '#ef4444' : riskLevel === 'HIGH' ? '#f97316' : '#eab308'}
                    fillOpacity="0.35"
                    className="animate-pulse"
                  />

                  {/* River Flow */}
                  <path d="M 80,40 Q 160,80 240,140 T 340,210" fill="none" stroke="#38bdf8" strokeWidth={3 + (riverLevel / 2)} />

                  {/* Village Pin */}
                  <circle cx="240" cy="140" r="8" fill="#f97316" stroke="#fff" strokeWidth="2" />
                  <text x="240" y="162" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    Sunderbans Nagar
                  </text>
                </svg>

                <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                  ESTIMATED FLOOD INUNDATION RADIUS: {(1.2 + (calculatedRisk / 100) * 1.8).toFixed(2)} KM
                </div>
              </div>
            </div>

            {/* Right: Risk Trajectory (3 Cols) */}
            <div className="lg:col-span-3 bg-[#0e1630] border border-[#223354] rounded-2xl p-5 space-y-4 shadow-2xl text-xs">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
                  SIMULATED REACTION
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">Model Trajectory</h3>
              </div>

              {/* Dynamic Risk Score Badge */}
              <div className="bg-[#070d1e] p-4 rounded-xl border border-slate-800 text-center space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">SIMULATED COMPOSITE RISK</div>
                <div className="text-3xl font-black font-mono text-slate-100">{calculatedRisk} <span className="text-sm font-normal text-slate-400">/ 100</span></div>
                <RiskBadge level={riskLevel} />
              </div>

              <div className="space-y-2 text-[11px] font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Guidance Level:</span>
                  <span className="font-bold text-cyan-400">Level {riskLevel === 'EXTREME' ? 3 : riskLevel === 'HIGH' ? 2 : 1}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Sensor State:</span>
                  <span className={sensorOutage ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {sensorOutage ? 'DEGRADED' : 'OPERATIONAL'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
