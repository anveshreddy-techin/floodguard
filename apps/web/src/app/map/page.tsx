'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { Layers, MapPin, Activity, Eye, Compass, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { RiskBadge } from '@/components/ui/Badges';

export default function GISMapPage() {
  const [activeLayers, setActiveLayers] = useState({
    watersheds: true,
    rivers: true,
    villages: true,
    sensors: true,
    riskHeatmap: true,
  });

  const [selectedEntity, setSelectedEntity] = useState<any>({
    name: 'Sunderbans Nagar (Exposure Target)',
    type: 'Village / Settlement',
    population: 3400,
    elevation: '720m ASL',
    slope: '12° (Valley Base)',
    riskLevel: 'EXTREME',
    riskScore: 78.5,
    exposure: 'Direct alluvial fan path; 1 bridge bottleneck',
    upstreamCatchment: 'Upper Demo Watershed (85.4 km²)',
  });

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="map" />

        <main className="flex-1 relative flex flex-col overflow-hidden">
          {/* Top Layer & Filter Control Bar */}
          <div className="bg-[#1c2541]/95 border-b border-[#3a506b] p-3 px-6 flex flex-wrap items-center justify-between gap-3 z-10 backdrop-blur">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-slate-100">HYPER-LOCAL GIS PLATFORM</span>
              <span className="text-xs text-slate-400 font-mono">EPSG:4326 (WGS84)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Layers:
              </span>
              {(
                [
                  ['watersheds', 'Watersheds'],
                  ['rivers', 'River Network'],
                  ['villages', 'Villages'],
                  ['sensors', 'IoT Sensors'],
                  ['riskHeatmap', 'Risk Heatmap'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleLayer(key)}
                  className={`text-xs px-2.5 py-1 rounded border transition ${
                    activeLayers[key]
                      ? 'bg-blue-600/30 text-cyan-300 border-cyan-500/60 font-medium'
                      : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Simulated Map Canvas / Vector Surface */}
          <div className="flex-1 relative bg-[#090f20] flex items-center justify-center overflow-hidden">
            {/* SVG Visual Spatial Representation of the Watershed & Rivers */}
            <svg className="w-full h-full absolute inset-0 cursor-crosshair" viewBox="0 0 1000 600">
              <defs>
                <linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Watershed Polygons */}
              {activeLayers.watersheds && (
                <g className="transition-opacity duration-300">
                  {/* Upper Watershed */}
                  <polygon
                    points="200,80 450,50 600,160 480,320 220,280 160,180"
                    fill="#1e3a8a"
                    fillOpacity="0.25"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    className="hover:fill-opacity-40 transition cursor-pointer"
                    onClick={() =>
                      setSelectedEntity({
                        name: 'Upper Catchment Ridge Basin (DEMO-WS-001)',
                        type: 'Micro-Watershed',
                        area: '85.4 km²',
                        elevation: '1380m - 2840m ASL',
                        slope: '28° Mean Gradient',
                        riskLevel: 'HIGH',
                        riskScore: 72.0,
                        exposure: 'Headwater cloudburst accumulation zone',
                        upstreamCatchment: 'None (Ridge Headwater)',
                      })
                    }
                  />
                  {/* Lower Watershed */}
                  <polygon
                    points="480,320 600,160 820,240 760,480 520,520 400,420"
                    fill="#312e81"
                    fillOpacity="0.2"
                    stroke="#818cf8"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                </g>
              )}

              {/* Risk Heatmap Contour */}
              {activeLayers.riskHeatmap && (
                <path
                  d="M 280,120 Q 420,200 520,330 T 680,440"
                  fill="none"
                  stroke="url(#riskGrad)"
                  strokeWidth="80"
                  strokeLinecap="round"
                  className="blur-xl"
                />
              )}

              {/* River Network */}
              {activeLayers.rivers && (
                <g>
                  {/* Tributaries */}
                  <path d="M 240,100 Q 320,180 390,220" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
                  <path d="M 480,90 Q 440,160 390,220" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
                  {/* Mainstem River Channel */}
                  <path
                    d="M 390,220 C 460,290 510,340 560,390 S 680,480 740,540"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* Village Nodes */}
              {activeLayers.villages && (
                <g>
                  {/* Chandpur */}
                  <circle cx="330" cy="180" r="7" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
                  <text x="345" y="185" fill="#f8fafc" fontSize="11" fontWeight="bold">Chandpur (1240m)</text>

                  {/* Ramgarh */}
                  <circle cx="470" cy="300" r="7" fill="#f97316" stroke="#fff" strokeWidth="1.5" />
                  <text x="485" y="305" fill="#f8fafc" fontSize="11" fontWeight="bold">Ramgarh (980m)</text>

                  {/* Sunderbans Nagar (Exposure Target) */}
                  <circle cx="620" cy="440" r="10" fill="#ef4444" stroke="#fff" strokeWidth="2" className="animate-pulse" />
                  <text x="640" y="445" fill="#ef4444" fontSize="12" fontWeight="extrabold">Sunderbans Nagar (720m) ⚠</text>
                </g>
              )}

              {/* IoT Sensors */}
              {activeLayers.sensors && (
                <g>
                  <rect x="250" y="110" width="12" height="12" fill="#10b981" rx="2" />
                  <text x="270" y="120" fill="#10b981" fontSize="10" fontFamily="monospace">AWS-001</text>

                  <rect x="420" y="240" width="12" height="12" fill="#10b981" rx="2" />
                  <text x="440" y="250" fill="#10b981" fontSize="10" fontFamily="monospace">AWS-002</text>

                  <rect x="580" y="400" width="12" height="12" fill="#06b6d4" rx="2" />
                  <text x="600" y="410" fill="#06b6d4" fontSize="10" fontFamily="monospace">WL-001 (River Gauge)</text>
                </g>
              )}
            </svg>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-6 left-6 bg-[#111827]/90 border border-[#3a506b] rounded-lg p-3 text-xs text-slate-300 space-y-2 backdrop-blur shadow-xl">
              <div className="font-semibold text-slate-100 uppercase tracking-wider text-[11px]">Map Legend</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-sm" /> Watershed Boundaries</div>
              <div className="flex items-center gap-2"><span className="w-4 h-1 bg-cyan-500 rounded-full" /> River Network</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" /> High-Risk Exposure Settlement</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> IoT Telemetry Stations</div>
            </div>

            {/* Entity Inspector Drawer / Float Card */}
            {selectedEntity && (
              <div className="absolute top-6 right-6 w-80 bg-[#1c2541]/95 border border-[#3a506b] rounded-lg p-4 text-xs text-slate-200 backdrop-blur shadow-2xl space-y-3">
                <div className="flex items-start justify-between border-b border-slate-700/80 pb-2">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">{selectedEntity.type}</div>
                    <div className="font-bold text-sm text-slate-100">{selectedEntity.name}</div>
                  </div>
                  <RiskBadge level={selectedEntity.riskLevel} />
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between"><span className="text-slate-400">Elevation:</span> <span>{selectedEntity.elevation}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Slope:</span> <span>{selectedEntity.slope}</span></div>
                  {selectedEntity.population && <div className="flex justify-between"><span className="text-slate-400">Population:</span> <span>{selectedEntity.population.toLocaleString()}</span></div>}
                  <div className="flex justify-between"><span className="text-slate-400">Composite Risk:</span> <span className="text-rose-400 font-bold">{selectedEntity.riskScore}/100</span></div>
                </div>

                <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-[11px]">
                  <div className="font-semibold text-cyan-400 uppercase">Exposure Analysis:</div>
                  <div className="text-slate-300 mt-0.5">{selectedEntity.exposure}</div>
                </div>

                <button 
                  onClick={() => alert(`Navigating to detailed intelligence dossier for ${selectedEntity.name}`)}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center justify-center gap-1 text-xs transition"
                >
                  <span>Open Full Village Intelligence Dossier</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
