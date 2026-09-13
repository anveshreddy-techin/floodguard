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
  ChevronRight, Radio, Compass, Building, Flame,
  ZoomIn, ZoomOut, RotateCcw, ChevronDown, ChevronUp, X, ExternalLink
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export const NationalRiverRiskMap: React.FC<{
  onSelectRiverPoint?: (point: RiverPoint) => void;
  className?: string;
}> = ({ onSelectRiverPoint, className = '' }) => {
  const [selectedBasin, setSelectedBasin] = useState<RiverBasinId | 'ALL'>('ALL');
  const [minRiskFilter, setMinRiskFilter] = useState<number>(0);
  const [selectedPoint, setSelectedPoint] = useState<RiverPoint>(NATIONAL_RIVER_POINTS[0]);
  const [hoveredPoint, setHoveredPoint] = useState<RiverPoint | null>(null);
  const [viewMode, setViewMode] = useState<'MAP' | 'DIAGRAM' | 'ANALYTICS'>('MAP');
  const [flowAnimationSpeed, setFlowAnimationSpeed] = useState<'NORMAL' | 'FAST' | 'PAUSED'>('NORMAL');
  const [statsExpanded, setStatsExpanded] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showInMapCard, setShowInMapCard] = useState<boolean>(true);
  const [inMapCardMinimized, setInMapCardMinimized] = useState<boolean>(false);
  const [showAllLabels, setShowAllLabels] = useState<boolean>(false);

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
        return 'bg-red-50 text-red-700 border-red-200 font-bold shadow-sm';
      case 'HIGH':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
      case 'MODERATE':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200 font-bold';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
    }
  };

  const handlePointClick = (pt: RiverPoint) => {
    setSelectedPoint(pt);
    setShowInMapCard(true);
    setInMapCardMinimized(false);
    if (onSelectRiverPoint) {
      onSelectRiverPoint(pt);
    }
    // On mobile, smooth scroll to inspector card if needed
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const el = document.getElementById('gauge-inspector-card');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleBasinSelect = (bId: RiverBasinId | 'ALL') => {
    setSelectedBasin(bId);
    setShowInMapCard(true);
    setInMapCardMinimized(false);
    if (bId !== 'ALL') {
      const basinPoints = NATIONAL_RIVER_POINTS.filter((p) => p.basin === bId);
      if (basinPoints.length > 0) {
        // Automatically pick the highest risk point in this basin
        const top = [...basinPoints].sort((a, b) => b.riskPercentage - a.riskPercentage)[0];
        setSelectedPoint(top);
        if (onSelectRiverPoint) onSelectRiverPoint(top);
      }
    }
  };

  const handleRiverPathClick = (path: any) => {
    handleBasinSelect(path.basin);
    const basinPoints = NATIONAL_RIVER_POINTS.filter((p) => p.basin === path.basin);
    const matchingPoint = basinPoints.find((p) =>
      p.river.toLowerCase().includes(path.name.toLowerCase().split(' ')[0]) ||
      path.name.toLowerCase().includes(p.river.toLowerCase().split(' ')[0])
    ) || basinPoints[0];
    if (matchingPoint) {
      setSelectedPoint(matchingPoint);
      if (onSelectRiverPoint) onSelectRiverPoint(matchingPoint);
    }
  };

  return (
    <div className={`flex flex-col bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-sm overflow-y-auto lg:overflow-hidden font-sans ${className}`}>
      
      {/* ── Top Header & Mode Tabs ── */}
      <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
            <Waves className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-wide uppercase font-sans">
                National Indian River Risk Map
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium hidden sm:block">
              37 National CWC Gauges · 9 Principal River Basins · Hydrodynamic Flow
            </p>
          </div>
        </div>

        {/* View Switcher Tabs & Mobile Stats Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-200/80 border border-slate-300 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('MAP')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
              viewMode === 'MAP' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            🗺️ MAP
          </button>
          <button
            onClick={() => setViewMode('DIAGRAM')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
              viewMode === 'DIAGRAM' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            📊 CASCADE
          </button>
          <button
            onClick={() => setViewMode('ANALYTICS')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
              viewMode === 'ANALYTICS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            📈 BASINS
          </button>
          <button
            onClick={() => setStatsExpanded(!statsExpanded)}
            className="sm:hidden px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-white border border-slate-300 text-blue-700 flex items-center gap-0.5"
            title="Toggle stats cards"
          >
            {statsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            <span>KPI</span>
          </button>
        </div>
      </div>

      {/* ── National Metric Ribbon (Collapsible on Mobile, always on Desktop) ── */}
      <div className={`${statsExpanded ? 'grid' : 'hidden'} sm:grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2.5 sm:p-3 bg-slate-100/70 border-b border-slate-200 text-xs font-mono animate-fade-in`}>
        <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold">NATIONAL AVG RISK</span>
            <div className="text-xl font-black text-slate-900">{nationalStats.avgRisk}%</div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm" />
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-red-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-red-700 font-semibold">CRITICAL GAUGES (≥80%)</span>
            <div className="text-xl font-black text-red-600">{nationalStats.criticalCount} <span className="text-xs font-normal text-slate-500">/ {nationalStats.total}</span></div>
          </div>
          <AlertTriangle className="w-4 h-4 text-red-500" />
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-blue-700 font-semibold">MAX DISCHARGE NODE</span>
            <div className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{nationalStats.maxDischargePoint.river}</div>
            <div className="text-[10px] text-blue-600 font-bold">{nationalStats.maxDischargePoint.dischargeCumecs.toLocaleString()} m³/s</div>
          </div>
          <Droplets className="w-4 h-4 text-blue-600" />
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-700 font-semibold">FLOW SIMULATION</span>
            <div className="text-xs font-bold text-slate-800">HYDRODYNAMIC</div>
            <div className="text-[10px] text-slate-500">Continuous Vector Pulse</div>
          </div>
          <button
            onClick={() => setFlowAnimationSpeed(flowAnimationSpeed === 'NORMAL' ? 'FAST' : flowAnimationSpeed === 'FAST' ? 'PAUSED' : 'NORMAL')}
            className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-blue-700 font-bold border border-slate-300 hover:bg-slate-200 transition"
          >
            {flowAnimationSpeed}
          </button>
        </div>
      </div>

      {/* ── Filter Controls Bar ── */}
      <div className="p-2 sm:p-2.5 px-3 sm:px-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        {/* Basin Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 flex-1">
          <span className="text-slate-600 font-bold flex items-center gap-1 mr-1 shrink-0 text-[11px]">
            <Filter className="w-3 h-3 text-blue-600" /> BASIN:
          </span>
          <button
            onClick={() => handleBasinSelect('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition ${
              selectedBasin === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 shadow-xs'
            }`}
          >
            ALL BASINS ({NATIONAL_RIVER_POINTS.length})
          </button>
          {(Object.keys(RIVER_BASINS_META) as RiverBasinId[]).map((bId) => {
            const meta = RIVER_BASINS_META[bId];
            return (
              <button
                key={bId}
                onClick={() => handleBasinSelect(bId)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition flex items-center gap-1.5 ${
                  selectedBasin === bId
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 shadow-xs'
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
          <span className="text-slate-600 text-[11px] font-semibold">MIN RISK:</span>
          <select
            value={minRiskFilter}
            onChange={(e) => setMinRiskFilter(Number(e.target.value))}
            className="bg-white border border-slate-300 text-blue-700 rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none cursor-pointer shadow-xs"
          >
            <option value={0}>All Gauges (0%+)</option>
            <option value={60}>Moderate+ (60%+)</option>
            <option value={75}>High Risk (75%+)</option>
            <option value={85}>Critical Only (85%+)</option>
          </select>
        </div>
      </div>

      {/* ── Main Interactive Content Area ── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        
        {/* VIEW 1: MASTER SPATIAL VECTOR MAP */}
        {viewMode === 'MAP' && (
          <div className="flex-1 relative min-h-[520px] sm:min-h-[640px] lg:min-h-0 bg-[#02050f] flex items-center justify-center p-1 sm:p-2 overflow-hidden">
            
            {/* ── IN-MAP TELEMETRY & BASIN INTELLIGENCE HUD CARD ── */}
            {showInMapCard && (
              <div className={`absolute top-2 left-2 z-20 transition-all duration-300 max-w-[340px] sm:max-w-[390px] w-full ${
                inMapCardMinimized ? 'w-auto' : ''
              }`}>
                {inMapCardMinimized ? (
                  <button
                    onClick={() => setInMapCardMinimized(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 border border-blue-400 text-blue-700 text-xs font-mono font-bold shadow-xl backdrop-blur-md hover:bg-slate-50 transition active:scale-95"
                  >
                    <Waves className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    <span>SHOW TELEMETRY: {selectedPoint.name.split(' at ')[0]} ({selectedPoint.riskPercentage}%)</span>
                    <ChevronDown className="w-3.5 h-3.5 ml-1" />
                  </button>
                ) : (
                  <div className="bg-white/95 border border-slate-200 rounded-2xl p-3 sm:p-3.5 backdrop-blur-xl shadow-2xl text-xs font-mono space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200 text-slate-800">
                    {/* Header with basin badge, title, and action buttons */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="px-2 py-0.5 rounded-md text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1 shadow-sm"
                            style={{ backgroundColor: RIVER_BASINS_META[selectedPoint.basin]?.color || '#0284c7' }}
                          >
                            <span>🌊 {selectedPoint.basinName}</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold">
                            {selectedPoint.state}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1 leading-tight truncate">
                          {selectedPoint.name}
                        </h3>
                        <div className="text-[10px] text-blue-700 font-bold flex items-center gap-1 mt-0.5">
                          <span>{selectedPoint.river}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">{selectedPoint.cwcStationCode}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setInMapCardMinimized(true)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                          title="Minimize Telemetry Card"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShowInMapCard(false)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                          title="Close Card"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Risk Badge & Stage Alert */}
                    <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border flex items-center gap-1 ${getRiskBadge(selectedPoint.riskCategory)}`}>
                        <AlertTriangle className="w-3 h-3" />
                        <span>{selectedPoint.riskPercentage}% {selectedPoint.riskCategory}</span>
                      </span>
                      <span className="text-[10px] font-bold text-red-600 animate-pulse flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        <span>{selectedPoint.trend.replace('_', ' ')}</span>
                      </span>
                    </div>

                    {/* Key Telemetry Stats Grid */}
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[9px] text-slate-500 block font-semibold">WATER STAGE</span>
                        <span className="text-sm font-black text-slate-900">{selectedPoint.currentStageM}m</span>
                        <span className="text-[8px] text-red-600 block font-bold">Danger: {selectedPoint.dangerLevelM}m</span>
                      </div>
                      <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[9px] text-slate-500 block font-semibold">DISCHARGE</span>
                        <span className="text-sm font-black text-blue-700">{selectedPoint.dischargeCumecs.toLocaleString()}</span>
                        <span className="text-[8px] text-slate-500 block">m³/s</span>
                      </div>
                      <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[9px] text-slate-500 block font-semibold">3H RAIN</span>
                        <span className="text-sm font-black text-emerald-700">{selectedPoint.rainfall3hMm}mm</span>
                        <span className="text-[8px] text-slate-500 block">Vel: {selectedPoint.flowVelocityMs}m/s</span>
                      </div>
                    </div>

                    {/* Danger Ratio Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                        <span>STAGE / DANGER RATIO</span>
                        <span className="font-bold text-amber-700">
                          {Math.round((selectedPoint.currentStageM / selectedPoint.dangerLevelM) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (selectedPoint.currentStageM / selectedPoint.dangerLevelM) * 100)}%`,
                            backgroundColor: getRiskColor(selectedPoint.riskPercentage),
                          }}
                        />
                      </div>
                    </div>

                    {/* Threat & Directive */}
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-sans leading-tight">
                      <div className="text-[9px] font-mono font-bold text-amber-700 flex items-center gap-1 mb-0.5">
                        <ShieldAlert className="w-3 h-3 text-amber-600" />
                        <span>THREAT PROFILE</span>
                      </div>
                      <p className="text-slate-700">{selectedPoint.primaryHazard}</p>
                    </div>

                    {/* Quick Stations in this Basin */}
                    <div className="pt-1 border-t border-slate-200">
                      <span className="text-[9px] text-slate-500 block font-bold mb-1">
                        OTHER STATIONS IN {selectedPoint.basinName.toUpperCase()}:
                      </span>
                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                        {NATIONAL_RIVER_POINTS.filter((p) => p.basin === selectedPoint.basin).map((p) => (
                          <button
                            key={p.id}
                            onClick={() => handlePointClick(p)}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 transition ${
                              selectedPoint.id === p.id
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300'
                            }`}
                          >
                            {p.name.split(' at ')[0].slice(0, 14)} ({p.riskPercentage}%)
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!showInMapCard && (
              <button
                onClick={() => { setShowInMapCard(true); setInMapCardMinimized(false); }}
                className="absolute top-2 left-2 z-10 bg-white/95 border border-blue-400 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-blue-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xl transition"
              >
                <Waves className="w-3.5 h-3.5 text-blue-600" />
                <span>OPEN IN-MAP TELEMETRY HUD</span>
              </button>
            )}

            {/* Quick Map & Zoom Controls */}
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 bg-white/95 border border-slate-200 p-1 rounded-xl shadow-lg backdrop-blur-md">
              <button
                onClick={() => setShowAllLabels((s) => !s)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition flex items-center gap-1 ${
                  showAllLabels 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title="Toggle all gauge risk percentage labels"
              >
                <span>{showAllLabels ? '🏷️ All Labels' : '✨ Clean Map'}</span>
              </button>
              <div className="w-[1px] h-4 bg-slate-200" />
              <button
                onClick={() => setZoomLevel((z) => Math.min(2, z + 0.25))}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-blue-600 active:scale-95 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-blue-600 active:scale-95 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 active:scale-95 transition"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* SVG Master Projection of India & Hydrological Networks */}
            <svg
              viewBox="70 60 870 940"
              className="w-full h-full min-h-[500px] sm:min-h-[600px] max-h-[88vh] select-none touch-manipulation transition-transform duration-300"
              style={{
                transform: `scale(${zoomLevel})`,
                filter: 'drop-shadow(0 0 30px rgba(6,182,212,0.15))',
              }}
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

              {/* ── 2. Flowing Animated River Channels (Interactive & Downstream Flow) ── */}
              {NATIONAL_RIVER_PATHS.map((path) => {
                const isSelectedBasin = selectedBasin === 'ALL' || path.basin === selectedBasin;
                return (
                  <g
                    key={path.id}
                    opacity={isSelectedBasin ? 1 : 0.25}
                    className="cursor-pointer transition-opacity group"
                    onClick={() => handleRiverPathClick(path)}
                  >
                    <title>{`${path.name} (${RIVER_BASINS_META[path.basin]?.name}) — Click to view telemetry`}</title>

                    {/* Underlying Glow Ribbon */}
                    <path
                      d={path.pathData}
                      fill="none"
                      stroke={path.color}
                      strokeWidth={path.strokeWidth * 2.5}
                      strokeOpacity={isSelectedBasin ? 0.25 : 0.08}
                      strokeLinecap="round"
                    />

                    {/* Main Water Channel */}
                    <path
                      d={path.pathData}
                      fill="none"
                      stroke={path.color}
                      strokeWidth={path.strokeWidth}
                      strokeOpacity={isSelectedBasin ? 0.95 : 0.35}
                      strokeLinecap="round"
                    />

                    {/* Animated Flow Particles (GPU-Accelerated) */}
                    <path
                      d={path.pathData}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={path.strokeWidth * 0.8}
                      strokeDasharray="8 16"
                      className={flowAnimationSpeed === 'FAST' ? 'flow-stream-fast' : 'flow-stream'}
                      strokeOpacity={isSelectedBasin ? 0.95 : 0.25}
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}

              {/* ── 3. Interactive River Gauge Radar Points (Clean, Non-Overlapping) ── */}
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
                    <title>{`${pt.name} (${pt.river}, ${pt.state}) — ${pt.riskPercentage}% Risk [${pt.riskCategory}] — Click to inspect live telemetry`}</title>

                    {/* Selected Node: Clean static locator target ring (NO spinning circular animation) */}
                    {isSelected && (
                      <>
                        <circle
                          cx={pt.svgX}
                          cy={pt.svgY}
                          r="16"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                          opacity="0.85"
                        />
                        <circle
                          cx={pt.svgX}
                          cy={pt.svgY}
                          r="11"
                          fill="#38bdf8"
                          fillOpacity="0.2"
                          stroke="#38bdf8"
                          strokeWidth="1.2"
                        />
                      </>
                    )}

                    {/* Outer Halo Node */}
                    <circle
                      cx={pt.svgX}
                      cy={pt.svgY}
                      r={isSelected ? 9 : isHovered ? 8 : 6}
                      fill={riskColor}
                      fillOpacity={isSelected ? 0.45 : isHovered ? 0.35 : 0.22}
                      stroke={riskColor}
                      strokeWidth={isSelected ? 2 : 1}
                    />

                    {/* Inner Core Solid Node */}
                    <circle
                      cx={pt.svgX}
                      cy={pt.svgY}
                      r={isSelected ? 5 : isHovered ? 4.5 : 3.2}
                      fill={isSelected ? '#38bdf8' : '#ffffff'}
                      stroke={riskColor}
                      strokeWidth="1.5"
                    />

                    {/* All Labels Mode (Only if explicitly toggled ON by user) */}
                    {showAllLabels && !isSelected && !isHovered && (
                      <g transform={`translate(${pt.svgX + 7}, ${pt.svgY - 4})`} className="pointer-events-none opacity-85">
                        <text
                          x="0"
                          y="0"
                          fill={riskColor}
                          fontSize="8"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {pt.riskPercentage}%
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* ── 4. Dedicated High-Z-Index Callout Layer (Never Collides or Gets Hidden) ── */}
              {/* Selected Point Callout Badge */}
              {selectedPoint && (
                <g
                  transform={`translate(${selectedPoint.svgX}, ${selectedPoint.svgY - 24})`}
                  className="pointer-events-none drop-shadow-md"
                >
                  <rect
                    x="-75"
                    y="-13"
                    width="150"
                    height="22"
                    rx="6"
                    fill="#0b1329"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    fillOpacity="0.98"
                  />
                  <text
                    x="0"
                    y="2"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9.5"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    📍 {selectedPoint.name.split(' at ')[0]} ({selectedPoint.riskPercentage}%)
                  </text>
                  <polygon points="-4,9 4,9 0,13" fill="#0b1329" stroke="#38bdf8" strokeWidth="1" />
                </g>
              )}

              {/* Hovered Point Callout Tooltip (Only if different from selected) */}
              {hoveredPoint && hoveredPoint.id !== selectedPoint?.id && (
                <g
                  transform={`translate(${hoveredPoint.svgX}, ${hoveredPoint.svgY - 22})`}
                  className="pointer-events-none drop-shadow-md"
                >
                  <rect
                    x="-60"
                    y="-11"
                    width="120"
                    height="20"
                    rx="5"
                    fill="#0f172a"
                    stroke={getRiskColor(hoveredPoint.riskPercentage)}
                    strokeWidth="1.2"
                    fillOpacity="0.95"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {hoveredPoint.name.split(' at ')[0]} • {hoveredPoint.riskPercentage}%
                  </text>
                  <polygon
                    points="-3,9 3,9 0,12"
                    fill="#0f172a"
                    stroke={getRiskColor(hoveredPoint.riskPercentage)}
                    strokeWidth="1"
                  />
                </g>
              )}
            </svg>

            {/* Quick Floating Legend (Bottom Left of Map) */}
            <div className="absolute bottom-2 left-2 bg-white/95 border border-slate-200 rounded-2xl p-2.5 backdrop-blur-md text-[10px] font-mono space-y-1 shadow-lg hidden sm:block">
              <span className="text-slate-500 font-bold uppercase tracking-wider block">HYDROLOGICAL RISK SCALE</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
                <span className="text-red-700 font-bold">≥ 85% CRITICAL</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-amber-800 font-bold">75-84% HIGH</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-yellow-800 font-bold">60-74% MODERATE</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: STEP-BY-STEP CASCADE SCHEMATIC DIAGRAM */}
        {viewMode === 'DIAGRAM' && (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50 space-y-4 min-h-[450px]">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <h3 className="text-sm font-bold text-blue-900 font-sans uppercase flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-blue-600" />
                National Upstream-to-Downstream Energy Cascade Model
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
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
                <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="text-2xl p-2.5 rounded-2xl bg-slate-100 border border-slate-200">{step.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-blue-900 font-sans uppercase">{step.stage}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                        Risk: {step.risk}
                      </span>
                    </div>
                    <p className="text-xs text-slate-900 font-bold mt-0.5">{step.location}</p>
                    <p className="text-xs text-slate-600 mt-1 font-sans">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: BASIN-BY-BASIN ANALYTICS TABLE */}
        {viewMode === 'ANALYTICS' && (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50 space-y-4 min-h-[450px]">
            <h3 className="text-sm font-bold text-slate-900 font-sans uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              National Basin Vulnerability Comparison Matrix
            </h3>

            <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 bg-slate-100/70 font-bold">
                    <th className="p-3">Basin Name</th>
                    <th className="p-3">Gauges Monitored</th>
                    <th className="p-3">Average Risk %</th>
                    <th className="p-3">Peak Discharge</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {(Object.keys(RIVER_BASINS_META) as RiverBasinId[]).map((bId) => {
                    const meta = RIVER_BASINS_META[bId];
                    const basinPoints = NATIONAL_RIVER_POINTS.filter((p) => p.basin === bId);
                    const peakDischarge = Math.max(...basinPoints.map((p) => p.dischargeCumecs));
                    return (
                      <tr
                        key={bId}
                        onClick={() => { handleBasinSelect(bId); setViewMode('MAP'); }}
                        className="hover:bg-slate-50 transition cursor-pointer active:scale-[0.99]"
                        title="Click to view on National River Map"
                      >
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                          {meta.name}
                        </td>
                        <td className="p-3">{basinPoints.length} Stations</td>
                        <td className="p-3">
                          <span className="font-bold text-blue-700">{meta.avgRisk}%</span>
                        </td>
                        <td className="p-3 text-slate-600">{peakDischarge.toLocaleString()} m³/s</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            meta.avgRisk >= 80 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
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

        {/* ── Right River Point Inspector Card (Scroll-linked on Mobile) ── */}
        <div
          id="gauge-inspector-card"
          className="w-full lg:w-96 bg-slate-50/95 border-t lg:border-t-0 lg:border-l border-slate-200 p-4 md:p-5 flex flex-col justify-between overflow-y-auto space-y-4 shadow-sm shrink-0 text-slate-800"
        >
          <div className="space-y-4">
            
            {/* Inspector Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-blue-700 font-bold uppercase tracking-wider block">
                  {selectedPoint.basinName} · {selectedPoint.state}
                </span>
                <h3 className="text-base font-black text-slate-900 leading-tight font-sans mt-0.5">
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
                <span className="text-[9px] font-mono text-red-600 font-bold mt-1 block">
                  {selectedPoint.trend.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Gauge Dial & Hydrodynamics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-500 block font-semibold">CURRENT STAGE</span>
                <div className="text-xl font-black text-slate-900 mt-0.5 font-mono">
                  {selectedPoint.currentStageM} <span className="text-xs font-normal text-slate-500">m</span>
                </div>
                <span className="text-[10px] text-red-600 font-bold">
                  Danger: {selectedPoint.dangerLevelM} m
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-500 block font-semibold">DISCHARGE FLOW</span>
                <div className="text-lg font-black text-blue-700 mt-0.5 font-mono">
                  {selectedPoint.dischargeCumecs.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-500">m³/s (cumecs)</span>
              </div>
            </div>

            {/* Stage Progress Bar relative to Danger Level */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5 text-xs font-mono">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 font-semibold">STAGE TO DANGER RATIO</span>
                <span className="font-bold text-amber-700">
                  {Math.round((selectedPoint.currentStageM / selectedPoint.dangerLevelM) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (selectedPoint.currentStageM / selectedPoint.dangerLevelM) * 100)}%`,
                    backgroundColor: getRiskColor(selectedPoint.riskPercentage),
                  }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                <span>Warning: {selectedPoint.warningLevelM}m</span>
                <span>Danger: {selectedPoint.dangerLevelM}m</span>
              </div>
            </div>

            {/* Primary Hazard & Model Evidence */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider block flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                PRIMARY HYDROLOGICAL THREAT
              </span>
              <p className="text-xs text-slate-700 font-sans leading-relaxed">
                {selectedPoint.primaryHazard}
              </p>
            </div>

            {/* Cascade Flow Connections */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs font-mono space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                HYDRODYNAMIC CASCADE LINKAGES
              </span>
              {selectedPoint.upstreamNodeId && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">↑ Upstream Gauge:</span>
                  <span className="text-blue-700 font-bold">{selectedPoint.upstreamNodeId}</span>
                </div>
              )}
              {selectedPoint.downstreamNodeId && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">↓ Downstream Gauge:</span>
                  <span className="text-emerald-700 font-bold">{selectedPoint.downstreamNodeId}</span>
                </div>
              )}
            </div>

          </div>

          {/* Action Links */}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/safety"
              className="w-full py-2.5 rounded-xl btn-primary text-white text-xs font-sans font-bold text-center flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>EVACUATION GUIDANCE FOR {selectedPoint.state.toUpperCase()}</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default NationalRiverRiskMap;
