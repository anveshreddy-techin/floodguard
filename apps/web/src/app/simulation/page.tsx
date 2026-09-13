'use client';

import { RelatedAppsBar } from '@/components/ui/RelatedAppsBar';
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
import { 
  PlayCircle, 
  Sliders, 
  RotateCcw, 
  Activity, 
  ShieldAlert, 
  CloudRain, 
  Waves, 
  Mountain, 
  Layers,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { RiskBadge, DataModeBadge } from '@/components/ui/Badges';
import { RiskLevel } from '@/types';

export default function ScenarioSimulatorPage() {
  const { setPage, setMode, setRiskState, setRainfallMm, setRiverStage } = useEnvironment();
  const [rainfall, setRainfall] = useState<number>(48);
  const [soilMoisture, setSoilMoisture] = useState<number>(82);
  const [riverLevel, setRiverLevel] = useState<number>(3.8);
  const [blockageActive, setBlockageActive] = useState<boolean>(false);
  const [sensorOutage, setSensorOutage] = useState<boolean>(false);

  useEffect(() => {
    setPage('simulation');
    setMode('SIMULATION');
  }, [setPage, setMode]);

  // Update global environment on parameter changes
  useEffect(() => {
    setRainfallMm(rainfall);
    setRiverStage(riverLevel);
  }, [rainfall, riverLevel, setRainfallMm, setRiverStage]);

  // Dynamic risk calculation
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

  useEffect(() => {
    setRiskState(riskLevel);
  }, [riskLevel, setRiskState]);

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

  return (
    <div className="flex flex-col min-h-screen select-none bg-[#F0F4F8] text-slate-900">
      <Header dataMode="SIMULATION" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="simulation" />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-7xl mx-auto space-y-5 pb-24 md:pb-6">
          <RelatedAppsBar activeAppId="simulation" />
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 text-xs font-semibold">WHAT-IF STRESS LAB</span>
                <h1 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-purple-600" />
                  DYNAMIC SCENARIO SIMULATOR &amp; STRESS BENCHMARK
                </h1>
              </div>
              <p className="text-sm text-slate-600 mt-1 font-sans">
                Stress-test threshold sensitivity, landslide dam bursts, and sensor failure propagation in real time
              </p>
            </div>
            <DataModeBadge mode="SIMULATION" />
          </div>

          {/* Scenario Preset Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p)}
                className="bg-white hover:border-blue-500 border border-slate-200 p-4 rounded-2xl text-left transition transform active:scale-95 group shadow-sm space-y-1.5"
              >
                <div className="text-sm font-semibold font-sans text-slate-900 group-hover:text-blue-700 transition">{p.name}</div>
                <div className="text-xs text-slate-600 leading-snug font-normal">{p.desc}</div>
                <div className="text-xs font-mono font-bold text-blue-700 pt-1">
                  Rain: {p.rain}mm • Soil: {p.soil}% • River: {p.river}m
                </div>
              </button>
            ))}
          </div>

          {/* Master 3-Column Simulator Workbench */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Interactive Sliders (4 Cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 space-y-5 border border-slate-200 shadow-sm text-xs">
              <div className="font-sans font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2 border-b border-slate-200 pb-3">
                <Sliders className="w-4 h-4 text-blue-600" />
                HYDRO-METEOROLOGICAL SLIDERS
              </div>

              {/* Rainfall Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-sans text-xs font-medium">
                  <span className="text-slate-700">Rainfall Accumulation (3h)</span>
                  <span className="text-blue-700 font-mono font-bold">{rainfall} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={rainfall}
                  onChange={(e) => setRainfall(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Soil Moisture Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-sans text-xs font-medium">
                  <span className="text-slate-700">Soil Moisture Saturation</span>
                  <span className="text-amber-700 font-mono font-bold">{soilMoisture}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={soilMoisture}
                  onChange={(e) => setSoilMoisture(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>

              {/* River Stage Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-sans text-xs font-medium">
                  <span className="text-slate-700">Gauge Stage Level</span>
                  <span className="text-teal-700 font-mono font-bold">{riverLevel.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.1"
                  value={riverLevel}
                  onChange={(e) => setRiverLevel(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Toggles */}
              <div className="pt-3 border-t border-slate-200 space-y-2.5">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <span className="text-slate-800 text-xs font-semibold">Upstream Debris Dam / Blockage</span>
                  <input
                    type="checkbox"
                    checked={blockageActive}
                    onChange={(e) => setBlockageActive(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <span className="text-slate-800 text-xs font-semibold">Simulate Sensor Blackout</span>
                  <input
                    type="checkbox"
                    checked={sensorOutage}
                    onChange={(e) => setSensorOutage(e.target.checked)}
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Center: Dynamic Simulation Canvas (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 space-y-4 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider">
                  DYNAMIC SIMULATION CANVASES
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-mono font-bold">REAL-TIME REACTIVE</span>
              </div>

              {/* SVG Simulation Graphic */}
              <div className="relative w-full h-72 bg-slate-100 rounded-2xl border border-slate-300 overflow-hidden flex items-center justify-center p-2 shadow-inner">
                <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
                  {/* Terrain */}
                  <path d="M 10,40 Q 150,10 300,50 T 390,30 L 390,230 L 10,230 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
                  
                  {/* Dynamic Hazard Flood Pool (Scales with calculated risk) */}
                  <ellipse
                    cx="240"
                    cy="140"
                    rx={50 + (calculatedRisk / 100) * 70}
                    ry={30 + (calculatedRisk / 100) * 45}
                    fill={riskLevel === 'EXTREME' ? '#ef4444' : riskLevel === 'HIGH' ? '#f97316' : '#eab308'}
                    fillOpacity="0.35"
                    stroke={riskLevel === 'EXTREME' ? '#dc2626' : riskLevel === 'HIGH' ? '#ea580c' : '#ca8a04'}
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="animate-pulse"
                  />

                  {/* River Flow */}
                  <path d="M 80,40 Q 160,80 240,140 T 340,210" fill="none" stroke="#0284c7" strokeWidth={3 + (riverLevel / 1.5)} strokeLinecap="round" />

                  {/* Village Pin */}
                  <circle cx="240" cy="140" r="7" fill="#ea580c" stroke="#fff" strokeWidth="2.5" />
                  <text x="240" y="162" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold" fontFamily="system-ui, sans-serif">
                    Sunderbans Nagar
                  </text>
                </svg>

                <div className="absolute top-3 left-3 text-xs font-sans font-bold text-slate-800 bg-white/95 px-3 py-1 rounded-xl border border-slate-300 shadow-sm">
                  ESTIMATED FLOOD RADIUS: <span className="font-mono text-blue-700">{(1.2 + (calculatedRisk / 100) * 1.8).toFixed(2)} KM</span>
                </div>
              </div>
            </div>

            {/* Right: Risk Trajectory (3 Cols) */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-6 space-y-4 border border-slate-200 shadow-sm text-xs">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-mono text-purple-700 uppercase tracking-widest font-bold">
                  SIMULATED REACTION
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">Model Trajectory</h3>
              </div>

              {/* Dynamic Risk Score Badge */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-1.5 shadow-sm">
                <div className="text-xs font-sans font-semibold text-slate-600 uppercase tracking-wide">SIMULATED COMPOSITE RISK</div>
                <div className="text-4xl font-extrabold font-mono text-slate-900">{calculatedRisk} <span className="text-sm font-normal text-slate-500">/ 100</span></div>
                <RiskBadge level={riskLevel} />
              </div>

              <div className="space-y-2.5 text-xs font-sans pt-1">
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium">Guidance Level:</span>
                  <span className="font-bold text-blue-700">Level {riskLevel === 'EXTREME' ? 3 : riskLevel === 'HIGH' ? 2 : 1}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium">Sensor State:</span>
                  <span className={sensorOutage ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
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
