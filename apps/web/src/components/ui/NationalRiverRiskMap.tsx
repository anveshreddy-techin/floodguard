'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  NATIONAL_RIVER_POINTS,
  NATIONAL_RIVER_PATHS,
  RIVER_BASINS_META,
  RiverPoint,
  RiverBasinId,
} from '@/data/riverBasinsData';
import {
  Waves, ShieldAlert, Droplets, ArrowUpRight, Activity,
  Wind, MapPin, CheckCircle2, AlertTriangle, Filter,
  Sliders, Maximize2, RefreshCw, Layers, Zap, Info,
  ChevronRight, Radio, Compass, Building, Flame
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export const NationalRiverRiskMap: React.FC<{
  onSelectRiverPoint?: (point: RiverPoint) => void;
  className?: string;
}> = ({ onSelectRiverPoint, className = '' }) => {
  const [selectedBasin, setSelectedBasin] = useState<RiverBasinId | 'ALL'>('ALL');
  const [minRiskFilter, setMinRiskFilter] = useState<number>(0);
  const [selectedPoint, setSelectedPoint] = useState<RiverPoint>(NATIONAL_RIVER_POINTS[0]);
  const [particleOffset, setParticleOffset] = useState<number>(0);
  const [hoveredPoint, setHoveredPoint] = useState<RiverPoint | null>(null);
  const [viewMode, setViewMode] = useState<'MAP' | 'DIAGRAM' | 'ANALYTICS'>('MAP');
  const [flowAnimationSpeed, setFlowAnimationSpeed] = useState<'NORMAL' | 'FAST' | 'PAUSED'>('NORMAL');

  // Animated continuous river flow particles
  useEffect(() => {
    if (flowAnimationSpeed === 'PAUSED') return;
    const step = flowAnimationSpeed === 'FAST' ? 2 : 1;
    const interval = setInterval(() => {
      setParticleOffset((prev) => (prev + step) % 200);
    }, 40);
    return () => clearInterval(interval);
  }, [flowAnimationSpeed]);

  // Filtered river points
  const filteredPoints = useMemo(() => {
    return NATIONAL_RIVER_POINTS.filter((p) => {
      const matchBasin = selectedBasin === 'ALL' || p.basin === selectedBasin;
      const matchRisk = p.riskPercentage >= minRiskFilter;
      return matchBasin && matchRisk;
    });
  }, [selectedBasin, minRiskFilter]);

  // National metrics calculation
  const nationalStats = useMemo(() => {
    const total = NATIONAL_RIVER_POINTS.length;
    const criticalCount = NATIONAL_RIVER_POINTS.filter((p) => p.riskCategory === 'CRITICAL').length;
    const highCount = NATIONAL_RIVER_POINTS.filter((p) => p.riskCategory === 'HIGH').length;
    const avgRisk = Math.round(
      NATIONAL_RIVER_POINTS.reduce((acc, curr) => acc + curr.riskPercentage, 0) / total
    );
    const maxDischargePoint = [...NATIONAL_RIVER_POINTS].sort((a, b) => b.dischargeCumecs - a.dischargeCumecs)[0];
    return { total, criticalCount, highCount, avgRisk, maxDischargePoint };
  }, []);

  const getRiskColor = (risk: number) => {
    if (risk >= 85) return '#f43f5e'; // Rose-500
    if (risk >= 75) return '#f97316'; // Orange-500
    if (risk >= 60) return '#f59e0b'; // Amber-500
    return '#10b981'; // Emerald-500
  };

  const getRiskBadge = (category: string) => {
    switch (category) {
      case 'CRITICAL':
        return 'bg-rose-950/80 text-rose-300 border-rose-700/80 shadow-[0_0_10px_rgba(244,63,94,0.4)]';
      case 'HIGH':
        return 'bg-orange-950/80 text-orange-300 border-orange-700/80';
      case 'MODERATE':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/80';
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80';
    }
  };

  const handlePointClick = (pt: RiverPoint) => {
    setSelectedPoint(pt);
    if (onSelectRiverPoint) {
      onSelectRiverPoint(pt);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-[#030712] text-slate-100 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden font-sans ${className}`}>
      
      {/* ── Top Header & Mode Tabs ── */}
      <div className="p-3 sm:p-4 bg-slate-950/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Waves className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide uppercase font-mono">
                National Indian River Basin Risk Map
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse">
                LIVE HYDROLOGY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              37 National CWC Gauges · 9 Principal River Basins · Hydrodynamic Cascade Simulation
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('MAP')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
              viewMode === 'MAP' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🗺️ SPATIAL MAP
          </button>
          <button
            onClick={() => setViewMode('DIAGRAM')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
              viewMode === 'DIAGRAM' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 CASCADE SCHEMATIC
          </button>
          <button
            onClick={() => setViewMode('ANALYTICS')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
              viewMode === 'ANALYTICS' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📈 BASIN ANALYTICS
          </button>
        </div>
      </div>

      {/* ── National Metric Ribbon ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-900/40 border-b border-slate-800/60 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400">NATIONAL AVG RISK</span>
            <div className="text-xl font-black text-white">{nationalStats.avgRisk}%</div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-ping" />
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-rose-900/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-rose-300">CRITICAL GAUGES (≥80%)</span>
            <div className="text-xl font-black text-rose-400">{nationalStats.criticalCount} <span className="text-xs font-normal text-slate-500">/ {nationalStats.total}</span></div>
          </div>
          <AlertTriangle className="w-4 h-4 text-rose-400" />
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-cyan-300">MAX DISCHARGE NODE</span>
            <div className="text-sm font-bold text-white truncate max-w-[120px]">{nationalStats.maxDischargePoint.river}</div>
            <div className="text-[10px] text-cyan-400">{nationalStats.maxDischargePoint.dischargeCumecs.toLocaleString()} m³/s</div>
          </div>
          <Droplets className="w-4 h-4 text-cyan-400" />
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-400">FLOW SIMULATION</span>
            <div className="text-xs font-bold text-slate-200">HYDRODYNAMIC</div>
            <div className="text-[10px] text-slate-400">Continuous Vector Pulse</div>
          </div>
          <button
            onClick={() => setFlowAnimationSpeed(flowAnimationSpeed === 'NORMAL' ? 'FAST' : flowAnimationSpeed === 'FAST' ? 'PAUSED' : 'NORMAL')}
            className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-300 font-bold border border-slate-700"
          >
            {flowAnimationSpeed}
          </button>
        </div>
      </div>

      {/* ── Filter Controls Bar ── */}
      <div className="p-2.5 px-4 bg-slate-950 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        {/* Basin Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-slate-500 font-bold flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3 h-3 text-cyan-400" /> BASIN:
          </span>
          <button
            onClick={() => setSelectedBasin('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition ${
              selectedBasin === 'ALL'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            ALL BASINS ({NATIONAL_RIVER_POINTS.length})
          </button>
          {(Object.keys(RIVER_BASINS_META) as RiverBasinId[]).map((bId) => {
            const meta = RIVER_BASINS_META[bId];
            return (
              <button
                key={bId}
                onClick={() => setSelectedBasin(bId)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition flex items-center gap-1.5 ${
                  selectedBasin === bId
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                <span>{meta.name}</span>
              </button>
            );
          })}
        </div>

        {/* Severity Slider */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-400 text-[11px]">MIN RISK:</span>
          <select
            value={minRiskFilter}
            onChange={(e) => setMinRiskFilter(Number(e.target.value))}
            className="bg-slate-900 border border-slate-800 text-cyan-300 rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none cursor-pointer"
          >
            <option value={0}>All Gauges (0%+)</option>
            <option value={60}>Moderate+ (60%+)</option>
            <option value={75}>High Risk (75%+)</option>
            <option value={85}>Critical Only (85%+)</option>
          </select>
        </div>
      </div>

      {/* ── Main Interactive Content Area ── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative overflow-hidden">
        
        {/* VIEW 1: MASTER SPATIAL VECTOR MAP */}
        {viewMode === 'MAP' && (
          <div className="flex-1 relative min-h-[480px] lg:min-h-0 bg-[#02050f] overflow-hidden flex items-center justify-center">
            
            {/* SVG Master Projection of India & Hydrological Networks */}
            <svg
              viewBox="100 80 820 890"
              className="w-full h-full max-h-[85vh] select-none pointer-events-auto"
              style={{ filter: 'drop-shadow(0 0 30px rgba(6,182,212,0.15))' }}
            >
              <defs>
                {/* Flowing Water Particle Marker */}
                <radialGradient id="riverGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>
                
                {/* Elevation Background Relief Gradients */}
                <linearGradient id="himalayaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* ── 1. Realistic Geographic Coastline & National Boundary of India ── */}
              <path
                d="M 280,100 Q 350,90 410,130 Q 480,180 540,210 Q 640,220 700,240 Q 820,250 880,310 Q 850,380 820,440 Q 760,460 710,440 Q 650,490 640,560 Q 610,640 550,720 Q 490,790 440,860 Q 380,950 350,980 Q 320,930 300,860 Q 250,760 220,680 Q 180,600 200,530 Q 160,480 200,420 Q 220,340 240,260 Z"
                fill="url(#himalayaGradient)"
                stroke="#1e293b"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Northern Mountain Ridge Silhouette */}
              <path
                d="M 220,130 Q 310,100 420,160 T 630,220 T 870,290"
                fill="none"
                stroke="#475569"
                strokeWidth="1.2"
                strokeDasharray="6 3"
                opacity="0.5"
              />

              {/* ── 2. Flowing Animated River Channels ── */}
              {NATIONAL_RIVER_PATHS.map((path) => {
                const isSelectedBasin = selectedBasin === 'ALL' || path.basin === selectedBasin;
                return (
                  <g key={path.id} opacity={isSelectedBasin ? 1 : 0.2}>
                    {/* Underlying Glow Ribbon */}
                    <path
                      d={path.pathData}
                      fill="none"
                      stroke={path.color}
                      strokeWidth={path.strokeWidth * 2.5}
                      strokeOpacity="0.15"
                      strokeLinecap="round"
                    />

                    {/* Main Water Channel */}
                    <path
                      d={path.pathData}
                      fill="none"
                      stroke={path.color}
                      strokeWidth={path.strokeWidth}
                      strokeOpacity="0.85"
                      strokeLinecap="round"
                    />

                    {/* Animated Flow Particles */}
                    <path
                      d={path.pathData}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={path.strokeWidth * 0.8}
                      strokeDasharray="8 16"
                      strokeDashoffset={-particleOffset}
                      strokeOpacity="0.9"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}

              {/* ── 3. Interactive River Gauge Radar Points ── */}
              {filteredPoints.map((pt) => {
                const isSelected = selectedPoint?.id === pt.id;
                const isHovered = hoveredPoint?.id === pt.id;
                const riskColor = getRiskColor(pt.riskPercentage);

                return (
                  <g
                    key={pt.id}
                    className="cursor-pointer transition-all"
                    onClick={() => handlePointClick(pt)}
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Expanding Radar Ping (For Critical Points) */}
                    {pt.riskPercentage >= 75 && (
                      <circle
                        cx={pt.svgX}
                        cy={pt.svgY}
                        r={isSelected ? 26 : 18}
                        fill="none"
                        stroke={riskColor}
                        strokeWidth="1.5"
                        strokeOpacity="0.6"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Glow Shield */}
                    <circle
                      cx={pt.svgX}
                      cy={pt.svgY}
                      r={isSelected ? 16 : isHovered ? 12 : 9}
                      fill={riskColor}
                      fillOpacity={isSelected ? 0.35 : 0.2}
                      stroke={riskColor}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />

                    {/* Inner Core Solid Node */}
                    <circle
                      cx={pt.svgX}
                      cy={pt.svgY}
                      r={isSelected ? 7 : isHovered ? 5.5 : 4}
                      fill="#ffffff"
                      stroke={riskColor}
                      strokeWidth="2"
                    />

                    {/* Gauge Percentage Callout Tag */}
                    <g transform={`translate(${pt.svgX + 12}, ${pt.svgY - 8})`}>
                      <rect
                        x="-2"
                        y="-10"
                        width={isSelected ? 88 : 62}
                        height="18"
                        rx="5"
                        fill="#030712"
                        fillOpacity="0.9"
                        stroke={riskColor}
                        strokeWidth={isSelected ? 1.5 : 1}
                      />
                      <text
                        x="4"
                        y="3"
                        fill={riskColor}
                        fontSize={isSelected ? '10' : '9'}
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {pt.riskPercentage}% {pt.riskCategory === 'CRITICAL' ? '⚠️' : ''}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Quick Floating Legend (Bottom Left of Map) */}
            <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800/80 rounded-2xl p-3 backdrop-blur-md text-[10px] font-mono space-y-1.5 shadow-xl hidden sm:block">
              <span className="text-slate-400 font-bold uppercase tracking-wider block">HYDROLOGICAL RISK SCALE</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-rose-300 font-bold">≥ 85% CRITICAL (Emergency Action)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-orange-300 font-bold">75-84% HIGH (Evacuation Standby)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-amber-300 font-bold">60-74% MODERATE (Continuous Monitoring)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-emerald-300 font-bold">&lt; 60% NORMAL</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: STEP-BY-STEP CASCADE SCHEMATIC DIAGRAM */}
        {viewMode === 'DIAGRAM' && (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-[#030712] space-y-4">
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40">
              <h3 className="text-sm font-bold text-cyan-300 font-mono uppercase flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-cyan-400" />
                National Upstream-to-Downstream Energy Cascade Model
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Floods in India follow a physical hydrodynamic chain: from high-altitude cloudbursts and glacial outbursts in the Himalayas/Western Ghats down through reservoir choke-points and into coastal deltas.
              </p>
            </div>

            {/* Cascade Flow Steps */}
            <div className="space-y-3">
              {[
                { stage: '1. MOUNTAIN SOURCE HEADWATERS', icon: '🏔️', location: 'Alaknanda (Joshimath), Teesta (Sikkim), Siang (Arunachal)', risk: '88-94%', desc: 'Steep orographic rainfall + glacial melt generates high kinetic wave speed (>6.5 m/s).' },
                { stage: '2. HYDROPROJECT RESERVOIR BUFFER', icon: '🏗️', location: 'Tehri Dam, Pandoh Dam, Hirakud Dam, Koyna Dam', risk: '74-85%', desc: 'Dams regulate flood volume. Surcharge beyond Full Reservoir Level triggers emergency spillway release.' },
                { stage: '3. MIDSTREAM VALLEY CONVERGENCE', icon: '🌊', location: 'Haridwar, Guwahati, Bhadrachalam, Sangli, Patna', risk: '79-89%', desc: 'Tributaries merge into mainstem. River cross-sections widen, inundating low-lying agricultural floodplains.' },
                { stage: '4. COASTAL DELTA & TIDAL TRAP', icon: '🏝️', location: 'Kolkata (Hooghly), Rajahmundry, Cuttack, Surat, Aluva (Kochi)', risk: '70-91%', desc: 'High tide blocks river outflow into the sea, causing severe backwater stagnation and urban waterlogging.' },
              ].map((step, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-4">
                  <div className="text-2xl p-2.5 rounded-2xl bg-slate-800 border border-slate-700">{step.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-cyan-300 font-mono uppercase">{step.stage}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                        Risk: {step.risk}
                      </span>
                    </div>
                    <p className="text-xs text-white font-bold mt-0.5">{step.location}</p>
                    <p className="text-xs text-slate-400 mt-1 font-sans">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: BASIN-BY-BASIN ANALYTICS TABLE */}
        {viewMode === 'ANALYTICS' && (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-[#030712] space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              National Basin Vulnerability Comparison Matrix
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                    <th className="p-3">Basin Name</th>
                    <th className="p-3">Gauges Monitored</th>
                    <th className="p-3">Average Risk %</th>
                    <th className="p-3">Peak Discharge</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {(Object.keys(RIVER_BASINS_META) as RiverBasinId[]).map((bId) => {
                    const meta = RIVER_BASINS_META[bId];
                    const basinPoints = NATIONAL_RIVER_POINTS.filter((p) => p.basin === bId);
                    const peakDischarge = Math.max(...basinPoints.map((p) => p.dischargeCumecs));
                    return (
                      <tr key={bId} className="hover:bg-slate-900/50 transition">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                          {meta.name}
                        </td>
                        <td className="p-3">{basinPoints.length} Stations</td>
                        <td className="p-3">
                          <span className="font-bold text-cyan-300">{meta.avgRisk}%</span>
                        </td>
                        <td className="p-3 text-slate-400">{peakDischarge.toLocaleString()} m³/s</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            meta.avgRisk >= 80 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-orange-950 text-orange-300'
                          }`}>
                            {meta.avgRisk >= 80 ? 'CRITICAL' : 'ELEVATED'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Right River Point Inspector Card ── */}
        <div className="w-full lg:w-96 bg-slate-950/95 border-t lg:border-t-0 lg:border-l border-slate-800/80 p-4 md:p-5 flex flex-col justify-between overflow-y-auto space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="space-y-4">
            
            {/* Inspector Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  {selectedPoint.basinName} · {selectedPoint.state}
                </span>
                <h3 className="text-base font-black text-white leading-tight font-mono mt-0.5">
                  {selectedPoint.name}
                </h3>
                <span className="text-[10px] font-mono text-slate-500">
                  Station: {selectedPoint.cwcStationCode}
                </span>
              </div>

              <div className="text-right shrink-0">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border block ${getRiskBadge(selectedPoint.riskCategory)}`}>
                  {selectedPoint.riskPercentage}% RISK
                </span>
                <span className="text-[9px] font-mono text-rose-400 font-bold mt-1 block">
                  {selectedPoint.trend.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Gauge Dial & Hydrodynamics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">CURRENT STAGE</span>
                <div className="text-xl font-black text-white mt-0.5 font-mono">
                  {selectedPoint.currentStageM} <span className="text-xs font-normal text-slate-400">m</span>
                </div>
                <span className="text-[10px] text-rose-400 font-bold">
                  Danger: {selectedPoint.dangerLevelM} m
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">FLOW DISCHARGE</span>
                <div className="text-xl font-black text-cyan-300 mt-0.5 font-mono">
                  {selectedPoint.dischargeCumecs.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400">
                  Velocity: {selectedPoint.flowVelocityMs} m/s
                </span>
              </div>
            </div>

            {/* Stage Level Comparison Bar */}
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Water Stage vs Danger</span>
                <span className={`font-bold ${selectedPoint.currentStageM >= selectedPoint.dangerLevelM ? 'text-rose-400' : 'text-amber-400'}`}>
                  {selectedPoint.currentStageM >= selectedPoint.dangerLevelM ? 'ABOVE DANGER' : 'APPROACHING DANGER'}
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (selectedPoint.currentStageM / selectedPoint.hflLevelM) * 100)}%`,
                    backgroundColor: getRiskColor(selectedPoint.riskPercentage),
                  }}
                />
              </div>

              <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-0.5">
                <span>Warn: {selectedPoint.warningLevelM}m</span>
                <span>Danger: {selectedPoint.dangerLevelM}m</span>
                <span>HFL: {selectedPoint.hflLevelM}m</span>
              </div>
            </div>

            {/* Primary Hazard & Reservoir Buffer */}
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" /> Primary Hazard
              </div>
              <p className="text-slate-200 text-xs font-sans leading-relaxed">
                {selectedPoint.primaryHazard}
              </p>
              {selectedPoint.damControlled && (
                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                  <span>DAM: {selectedPoint.damName}</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold">CONTROLLED</span>
                </div>
              )}
            </div>

            {/* Recommended Action Guidance */}
            <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-800/50 space-y-1">
              <div className="text-[10px] font-mono text-rose-300 font-bold uppercase flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Recommended Action
              </div>
              <p className="text-xs text-rose-100/90 font-sans leading-relaxed">
                {selectedPoint.recommendedAction}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-copilot'));
                }
              }}
              className="flex-1 py-2.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-300 font-mono text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              ANALYZE WITH AI
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                }
              }}
              className="px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-black transition flex items-center justify-center gap-1 active:scale-95 animate-pulse"
              title="Trigger Emergency Helpline & SDRF Dispatch"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
