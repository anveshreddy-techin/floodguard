'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CloudRain,
  Droplets,
  Waves,
  Mountain,
  FileText,
  Layers,
  Sun,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Cpu,
  Activity,
  Radio,
  Clock,
  Compass,
  Zap,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const DataArchitectureFlow: React.FC = () => {
  // Step for the interactive "One Record Flow" simulator
  const [activeStep, setActiveStep] = useState<number>(6); // Default to full completed flow
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeRawTab, setActiveRawTab] = useState<string>('ALL');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= 6) {
            setIsPlaying(false);
            return 6;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handlePlaySimulation = () => {
    setActiveStep(0);
    setIsPlaying(true);
  };

  return (
    <section className="w-full bg-[#0a192f] text-slate-100 rounded-xl border border-slate-700/80 shadow-2xl p-4 sm:p-6 lg:p-8 space-y-8 select-none font-sans">
      {/* ── HEADER BLOCK (Matching Reference Image 1) ── */}
      <div className="border-b border-slate-700/80 pb-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              DATA INGESTION &amp; MULTI-SOURCE FUSION SPECIFICATION
            </span>
            <span className="text-slate-400 text-xs font-mono">SIH26192 Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-serif mt-1">
            HOW DATA IS GIVEN TO THE SYSTEM
          </h1>
          <p className="text-sm text-cyan-300/90 font-medium">
            Example of Different Data Sources and Their Formats
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Flash Flood Prediction System</span>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 1: DATA SOURCES (7 TILES)                                     */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <span>1. DATA SOURCES</span>
            <span className="text-slate-400 font-normal normal-case text-xs">
              — Example of Different Data Sources and Their Formats
            </span>
          </h2>
          <span className="text-[11px] font-mono text-slate-400">7 Multi-Source Pillars</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {/* 1. Rainfall */}
          <div className="bg-slate-900/90 border border-blue-500/40 hover:border-blue-400 rounded-lg p-3 space-y-2 transition shadow-sm">
            <div className="flex items-center justify-between">
              <CloudRain className="w-5 h-5 text-blue-400" />
              <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800">
                MET-01
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-tight">
                RAINFALL DATA
              </div>
              <div className="text-[10px] text-blue-300 font-medium">
                (IMD / Weather API)
              </div>
            </div>
            <ul className="text-[10px] text-slate-300 space-y-1 font-mono pt-1 border-t border-slate-800">
              <li className="flex items-center gap-1">• Rainfall amount (mm)</li>
              <li className="flex items-center gap-1">• Time</li>
              <li className="flex items-center gap-1">• Location (lat, long)</li>
            </ul>
          </div>

          {/* 2. Soil Moisture */}
          <div className="bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 rounded-lg p-3 space-y-2 transition shadow-sm">
            <div className="flex items-center justify-between">
              <Droplets className="w-5 h-5 text-emerald-400" />
              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                GEO-02
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-tight">
                SOIL MOISTURE DATA
              </div>
              <div className="text-[10px] text-emerald-300 font-medium">
                (IoT Sensors / API)
              </div>
            </div>
            <ul className="text-[10px] text-slate-300 space-y-1 font-mono pt-1 border-t border-slate-800">
              <li className="flex items-center gap-1">• Soil moisture (%)</li>
              <li className="flex items-center gap-1">• Depth</li>
              <li className="flex items-center gap-1">• Time, Location</li>
            </ul>
          </div>

          {/* 3. Water Level */}
          <div className="bg-slate-900/90 border border-sky-500/40 hover:border-sky-400 rounded-lg p-3 space-y-2 transition shadow-sm">
            <div className="flex items-center justify-between">
              <Waves className="w-5 h-5 text-sky-400" />
              <span className="text-[9px] font-mono font-bold text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800">
                HYD-03
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-tight">
                WATER LEVEL DATA
              </div>
              <div className="text-[10px] text-sky-300 font-medium">
                (River / Stream Sensors)
              </div>
            </div>
            <ul className="text-[10px] text-slate-300 space-y-1 font-mono pt-1 border-t border-slate-800">
              <li className="flex items-center gap-1">• Water level (m)</li>
              <li className="flex items-center gap-1">• Flow rate (m³/s)</li>
              <li className="flex items-center gap-1">• Time, Location</li>
            </ul>
          </div>

          {/* 4. Terrain Data */}
          <div className="bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 rounded-lg p-3 space-y-2 transition shadow-sm">
            <div className="flex items-center justify-between">
              <Mountain className="w-5 h-5 text-amber-400" />
              <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800">
                GIS-04
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-tight">
                TERRAIN DATA
              </div>
              <div className="text-[10px] text-amber-300 font-medium">
                (DEM / GIS)
              </div>
            </div>
            <ul className="text-[10px] text-slate-300 space-y-1 font-mono pt-1 border-t border-slate-800">
              <li className="flex items-center gap-1">• Elevation</li>
              <li className="flex items-center gap-1">• Slope</li>
              <li className="flex items-center gap-1">• Aspect</li>
            </ul>
          </div>

          {/* 5. Historical Data */}
          <div className="bg-slate-900/90 border border-purple-500/40 hover:border-purple-400 rounded-lg p-3 space-y-2 transition shadow-sm">
            <div className="flex items-center justify-between">
              <FileText className="w-5 h-5 text-purple-400" />
              <span className="text-[9px] font-mono font-bold text-purple-400 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-800">
                CAT-05
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-tight">
                HISTORICAL DATA
              </div>
              <div className="text-[10px] text-purple-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                (Past Floods/Landslides)
              </div>
            </div>
            <ul className="text-[10px] text-slate-300 space-y-1 font-mono pt-1 border-t border-slate-800">
              <li className="flex items-center gap-1">• Event type</li>
              <li className="flex items-center gap-1">• Date &amp; Time</li>
              <li className="flex items-center gap-1">• Location, Impact</li>
            </ul>
          </div>

          {/* 6. Satellite Data */}
          <div className="bg-slate-900/90 border border-teal-500/40 hover:border-teal-400 rounded-lg p-3 space-y-2 transition shadow-sm">
            <div className="flex items-center justify-between">
              <Layers className="w-5 h-5 text-teal-400" />
              <span className="text-[9px] font-mono font-bold text-teal-400 bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-800">
                SAT-06
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-tight">
                SATELLITE DATA
              </div>
              <div className="text-[10px] text-teal-300 font-medium">
                (Remote Sensing)
              </div>
            </div>
            <ul className="text-[10px] text-slate-300 space-y-1 font-mono pt-1 border-t border-slate-800">
              <li className="flex items-center gap-1">• Land Use / Cover</li>
              <li className="flex items-center gap-1">• NDVI</li>
              <li className="flex items-center gap-1">• Surface Water</li>
            </ul>
          </div>

          {/* 7. Weather Forecast */}
          <div className="bg-slate-900/90 border border-orange-500/40 hover:border-orange-400 rounded-lg p-3 space-y-2 transition shadow-sm">
            <div className="flex items-center justify-between">
              <Sun className="w-5 h-5 text-orange-400" />
              <span className="text-[9px] font-mono font-bold text-orange-400 bg-orange-950/80 px-1.5 py-0.5 rounded border border-orange-800">
                NWP-07
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-tight">
                WEATHER FORECAST
              </div>
              <div className="text-[10px] text-orange-300 font-medium">
                (API / Model)
              </div>
            </div>
            <ul className="text-[10px] text-slate-300 space-y-1 font-mono pt-1 border-t border-slate-800">
              <li className="flex items-center gap-1">• Forecasted Rain</li>
              <li className="flex items-center gap-1">• Temperature</li>
              <li className="flex items-center gap-1">• Humidity, Wind</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 2: EXAMPLE — HOW DATA IS GIVEN (RAW FORMAT) (A Through G)      */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-cyan-400 font-mono">
            2. EXAMPLE — HOW DATA IS GIVEN (RAW FORMAT)
          </h2>
          <span className="text-[11px] font-mono text-slate-400">Authentic Ingestion Payloads</span>
        </div>

        {/* 7-Card Grid Matching Reference Image 1 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          
          {/* A. RAINFALL DATA (API JSON) */}
          <div className="lg:col-span-1 bg-[#071322] border border-blue-500/30 rounded-lg p-2.5 flex flex-col justify-between space-y-2">
            <div>
              <div className="text-[11px] font-bold text-blue-300 uppercase tracking-tight">
                A. RAINFALL DATA (API JSON)
              </div>
              {/* Raw JSON snippet */}
              <div className="bg-[#030b14] border border-slate-800 rounded p-2 text-[9px] font-mono text-slate-300 mt-1.5 overflow-x-auto leading-relaxed">
                <span className="text-slate-500">&#123;</span><br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;location&quot;</span>: <span className="text-amber-300">&quot;Bhatwari&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;latitude&quot;</span>: <span className="text-emerald-400">30.7171</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;longitude&quot;</span>: <span className="text-emerald-400">78.5648</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;datetime&quot;</span>: <span className="text-amber-300">&quot;2025-05-20T10:00:00Z&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;rainfall_mm&quot;</span>: <span className="text-emerald-400 font-bold">48.6</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;duration_min&quot;</span>: <span className="text-emerald-400">60</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;source&quot;</span>: <span className="text-amber-300">&quot;IMD_API&quot;</span><br />
                <span className="text-slate-500">&#125;</span>
              </div>
            </div>

            {/* Rainfall Bar Chart */}
            <div className="bg-[#030b14] border border-slate-800/80 rounded p-2 space-y-1">
              <div className="text-[9px] font-mono text-slate-400 flex items-center justify-between">
                <span>Rainfall (mm)</span>
                <span className="text-blue-400 font-bold">Max 48.6</span>
              </div>
              <svg viewBox="0 0 100 45" className="w-full h-11">
                <line x1="10" y1="40" x2="95" y2="40" stroke="#334155" strokeWidth="0.5" />
                <rect x="15" y="24" width="8" height="16" fill="#38bdf8" rx="0.5" />
                <rect x="32" y="28" width="8" height="12" fill="#38bdf8" rx="0.5" />
                <rect x="49" y="25" width="8" height="15" fill="#38bdf8" rx="0.5" />
                <rect x="66" y="22" width="8" height="18" fill="#38bdf8" rx="0.5" />
                <rect x="83" y="10" width="8" height="30" fill="#0284c7" rx="0.5" />
                <text x="19" y="44" fontSize="5" fill="#64748b" textAnchor="middle">06:00</text>
                <text x="36" y="44" fontSize="5" fill="#64748b" textAnchor="middle">07:00</text>
                <text x="53" y="44" fontSize="5" fill="#64748b" textAnchor="middle">08:00</text>
                <text x="70" y="44" fontSize="5" fill="#64748b" textAnchor="middle">09:00</text>
                <text x="87" y="44" fontSize="5" fill="#38bdf8" fontWeight="bold" textAnchor="middle">10:00</text>
              </svg>
            </div>
          </div>

          {/* B. SOIL MOISTURE (SENSOR JSON) */}
          <div className="lg:col-span-1 bg-[#071322] border border-emerald-500/30 rounded-lg p-2.5 flex flex-col justify-between space-y-2">
            <div>
              <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-tight">
                B. SOIL MOISTURE (SENSOR JSON)
              </div>
              {/* Raw JSON snippet */}
              <div className="bg-[#030b14] border border-slate-800 rounded p-2 text-[9px] font-mono text-slate-300 mt-1.5 overflow-x-auto leading-relaxed">
                <span className="text-slate-500">&#123;</span><br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;sensor_id&quot;</span>: <span className="text-amber-300">&quot;SMT-001&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;location&quot;</span>: <span className="text-amber-300">&quot;Bhatwari&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;latitude&quot;</span>: <span className="text-emerald-400">30.7171</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;longitude&quot;</span>: <span className="text-emerald-400">78.5648</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;depth_cm&quot;</span>: <span className="text-emerald-400">20</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;soil_moisture_percent&quot;</span>: <span className="text-emerald-400 font-bold">72.5</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;timestamp&quot;</span>: <span className="text-amber-300">&quot;2025-05-20T10:00:00Z&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;battery_percent&quot;</span>: <span className="text-emerald-400">87</span><br />
                <span className="text-slate-500">&#125;</span>
              </div>
            </div>

            {/* Soil Moisture Bar Chart */}
            <div className="bg-[#030b14] border border-slate-800/80 rounded p-2 space-y-1">
              <div className="text-[9px] font-mono text-slate-400 flex items-center justify-between">
                <span>Soil Moisture (%)</span>
                <span className="text-emerald-400 font-bold">72.5%</span>
              </div>
              <svg viewBox="0 0 100 45" className="w-full h-11">
                <line x1="10" y1="40" x2="95" y2="40" stroke="#334155" strokeWidth="0.5" />
                <rect x="15" y="27" width="8" height="13" fill="#10b981" rx="0.5" />
                <rect x="32" y="24" width="8" height="16" fill="#10b981" rx="0.5" />
                <rect x="49" y="20" width="8" height="20" fill="#10b981" rx="0.5" />
                <rect x="66" y="16" width="8" height="24" fill="#10b981" rx="0.5" />
                <rect x="83" y="11" width="8" height="29" fill="#059669" rx="0.5" />
                <text x="19" y="44" fontSize="5" fill="#64748b" textAnchor="middle">06:00</text>
                <text x="36" y="44" fontSize="5" fill="#64748b" textAnchor="middle">07:00</text>
                <text x="53" y="44" fontSize="5" fill="#64748b" textAnchor="middle">08:00</text>
                <text x="70" y="44" fontSize="5" fill="#64748b" textAnchor="middle">09:00</text>
                <text x="87" y="44" fontSize="5" fill="#10b981" fontWeight="bold" textAnchor="middle">10:00</text>
              </svg>
            </div>
          </div>

          {/* C. WATER LEVEL (SENSOR JSON) */}
          <div className="lg:col-span-1 bg-[#071322] border border-sky-500/30 rounded-lg p-2.5 flex flex-col justify-between space-y-2">
            <div>
              <div className="text-[11px] font-bold text-sky-300 uppercase tracking-tight">
                C. WATER LEVEL (SENSOR JSON)
              </div>
              {/* Raw JSON snippet */}
              <div className="bg-[#030b14] border border-slate-800 rounded p-2 text-[9px] font-mono text-slate-300 mt-1.5 overflow-x-auto leading-relaxed">
                <span className="text-slate-500">&#123;</span><br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;sensor_id&quot;</span>: <span className="text-amber-300">&quot;WL-002&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;location&quot;</span>: <span className="text-amber-300">&quot;Alaknanda River&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;latitude&quot;</span>: <span className="text-emerald-400">30.6502</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;longitude&quot;</span>: <span className="text-emerald-400">78.5210</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;water_level_m&quot;</span>: <span className="text-emerald-400 font-bold">2.85</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;flow_rate_cms&quot;</span>: <span className="text-emerald-400">215.6</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;timestamp&quot;</span>: <span className="text-amber-300">&quot;2025-05-20T10:00:00Z&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;status&quot;</span>: <span className="text-rose-400 font-bold">&quot;RISING&quot;</span><br />
                <span className="text-slate-500">&#125;</span>
              </div>
            </div>

            {/* Water Level Line Chart */}
            <div className="bg-[#030b14] border border-slate-800/80 rounded p-2 space-y-1">
              <div className="text-[9px] font-mono text-slate-400 flex items-center justify-between">
                <span>Water Level (m)</span>
                <span className="text-sky-400 font-bold">2.85 m</span>
              </div>
              <svg viewBox="0 0 100 45" className="w-full h-11">
                <line x1="10" y1="40" x2="95" y2="40" stroke="#334155" strokeWidth="0.5" />
                <path d="M 15,34 L 32,30 L 49,24 L 66,19 L 85,11" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="15" cy="34" r="1.5" fill="#38bdf8" />
                <circle cx="32" cy="30" r="1.5" fill="#38bdf8" />
                <circle cx="49" cy="24" r="1.5" fill="#38bdf8" />
                <circle cx="66" cy="19" r="1.5" fill="#38bdf8" />
                <circle cx="85" cy="11" r="2" fill="#ef4444" />
                <text x="15" y="44" fontSize="5" fill="#64748b" textAnchor="middle">06:00</text>
                <text x="32" y="44" fontSize="5" fill="#64748b" textAnchor="middle">07:00</text>
                <text x="49" y="44" fontSize="5" fill="#64748b" textAnchor="middle">08:00</text>
                <text x="66" y="44" fontSize="5" fill="#64748b" textAnchor="middle">09:00</text>
                <text x="85" y="44" fontSize="5" fill="#38bdf8" fontWeight="bold" textAnchor="middle">10:00</text>
              </svg>
            </div>
          </div>

          {/* D. TERRAIN DATA (GIS SHAPEFILE/RASTER) */}
          <div className="lg:col-span-1 bg-[#071322] border border-amber-500/30 rounded-lg p-2.5 flex flex-col justify-between space-y-2">
            <div>
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-tight">
                D. TERRAIN DATA (GIS RASTER)
              </div>
              
              {/* Raster Elevation Elevation Map Visualization */}
              <div className="relative w-full h-24 bg-gradient-to-tr from-emerald-900 via-amber-900 to-rose-950 rounded border border-slate-700/60 mt-1.5 overflow-hidden flex items-center justify-center">
                {/* Contour Iso-lines */}
                <svg viewBox="0 0 100 60" className="w-full h-full opacity-60">
                  <path d="M 0,15 Q 40,35 70,10 T 100,25" fill="none" stroke="#fef08a" strokeWidth="0.8" strokeDasharray="2,2" />
                  <path d="M 0,30 Q 30,50 60,30 T 100,45" fill="none" stroke="#fed7aa" strokeWidth="0.8" strokeDasharray="2,2" />
                  <path d="M 0,45 Q 40,55 80,45 T 100,55" fill="none" stroke="#bbf7d0" strokeWidth="0.8" strokeDasharray="2,2" />
                </svg>

                {/* Elevation Legend Scale */}
                <div className="absolute top-1 right-1 bg-slate-950/80 border border-slate-800 px-1 py-0.5 rounded text-[8px] font-mono text-slate-300">
                  <span className="text-amber-400 font-bold">3500m</span><br />
                  <span className="text-emerald-400">500m</span>
                </div>
              </div>
            </div>

            {/* Attributes Table */}
            <div className="bg-[#030b14] border border-slate-800/80 rounded p-1.5 space-y-0.5">
              <div className="text-[8px] font-mono text-amber-400 font-bold">Attributes (Example)</div>
              <table className="w-full text-[8px] font-mono text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="py-0.5 text-left">Grid</th>
                    <th className="py-0.5 text-right">Ele(m)</th>
                    <th className="py-0.5 text-right">Slope</th>
                    <th className="py-0.5 text-right">Aspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-0.5 text-cyan-300">101</td>
                    <td className="py-0.5 text-right">2450</td>
                    <td className="py-0.5 text-right text-rose-400 font-bold">32.6°</td>
                    <td className="py-0.5 text-right">120°</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 text-cyan-300">102</td>
                    <td className="py-0.5 text-right">2270</td>
                    <td className="py-0.5 text-right text-amber-400">28.1°</td>
                    <td className="py-0.5 text-right">135°</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 text-cyan-300">103</td>
                    <td className="py-0.5 text-right">2100</td>
                    <td className="py-0.5 text-right text-emerald-400">25.4°</td>
                    <td className="py-0.5 text-right">110°</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* E. HISTORICAL DATA (CSV) */}
          <div className="lg:col-span-1 bg-[#071322] border border-purple-500/30 rounded-lg p-2.5 flex flex-col justify-between space-y-2">
            <div>
              <div className="text-[11px] font-bold text-purple-300 uppercase tracking-tight">
                E. HISTORICAL DATA (CSV)
              </div>

              {/* CSV table preview */}
              <div className="bg-[#030b14] border border-slate-800 rounded p-1.5 text-[8px] font-mono text-slate-300 mt-1.5 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500">
                      <th className="py-0.5 text-left">id</th>
                      <th className="py-0.5 text-left">type</th>
                      <th className="py-0.5 text-left">date</th>
                      <th className="py-0.5 text-left">location</th>
                      <th className="py-0.5 text-right">impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr>
                      <td className="py-0.5 text-purple-400">101</td>
                      <td className="py-0.5 text-rose-400">Flood</td>
                      <td className="py-0.5">2023-07-15</td>
                      <td className="py-0.5">Bhatwari</td>
                      <td className="py-0.5 text-right text-rose-400 font-bold">High</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 text-purple-400">102</td>
                      <td className="py-0.5 text-amber-400">Landslide</td>
                      <td className="py-0.5">2022-08-04</td>
                      <td className="py-0.5">Taluka</td>
                      <td className="py-0.5 text-right text-amber-400">Med</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 text-purple-400">103</td>
                      <td className="py-0.5 text-rose-400">Flood</td>
                      <td className="py-0.5">2021-07-21</td>
                      <td className="py-0.5">Uttarkashi</td>
                      <td className="py-0.5 text-right text-rose-400 font-bold">High</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Spatial Location Map Graphic */}
            <div className="bg-[#030b14] border border-slate-800/80 rounded p-2 space-y-1">
              <div className="text-[8px] font-mono text-slate-400">Past Flood/Landslide Locations</div>
              <svg viewBox="0 0 100 40" className="w-full h-9 bg-slate-900/60 rounded">
                <circle cx="20" cy="25" r="3" fill="#ef4444" />
                <circle cx="45" cy="18" r="3" fill="#f59e0b" />
                <circle cx="65" cy="28" r="3" fill="#ef4444" />
                <circle cx="85" cy="15" r="3" fill="#f59e0b" />
              </svg>
              <div className="flex items-center justify-between text-[7.5px] font-mono text-slate-400">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Flood</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Landslide</span>
              </div>
            </div>
          </div>

          {/* F. SATELLITE DATA (TIFF / RASTER) */}
          <div className="lg:col-span-1 bg-[#071322] border border-teal-500/30 rounded-lg p-2.5 flex flex-col justify-between space-y-2">
            <div>
              <div className="text-[11px] font-bold text-teal-300 uppercase tracking-tight">
                F. SATELLITE DATA (RASTER)
              </div>

              {/* False Color NDVI raster representation */}
              <div className="relative w-full h-24 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 rounded border border-slate-700/60 mt-1.5 overflow-hidden flex items-center justify-center">
                {/* Topographic pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />
                <div className="absolute top-1 left-1 bg-slate-950/80 px-1 py-0.5 rounded text-[8px] font-mono text-teal-300">
                  NDVI Spectral Index
                </div>

                {/* NDVI Scale */}
                <div className="absolute right-1 top-1 bottom-1 w-2 bg-gradient-to-b from-emerald-500 via-amber-500 to-rose-600 rounded" />
              </div>
            </div>

            {/* Satellite Metadata info */}
            <div className="bg-[#030b14] border border-slate-800/80 rounded p-1.5 text-[8px] font-mono text-slate-300 space-y-0.5">
              <div>Resolution: <span className="text-teal-400 font-bold">10m</span></div>
              <div>Date: <span className="text-white">2025-05-20</span></div>
              <div>Source: <span className="text-teal-300">Sentinel-2 MSI</span></div>
            </div>
          </div>

          {/* G. WEATHER FORECAST (API JSON) */}
          <div className="lg:col-span-1 bg-[#071322] border border-orange-500/30 rounded-lg p-2.5 flex flex-col justify-between space-y-2">
            <div>
              <div className="text-[11px] font-bold text-orange-300 uppercase tracking-tight">
                G. WEATHER FORECAST (JSON)
              </div>
              {/* Raw JSON snippet */}
              <div className="bg-[#030b14] border border-slate-800 rounded p-2 text-[9px] font-mono text-slate-300 mt-1.5 overflow-x-auto leading-relaxed">
                <span className="text-slate-500">&#123;</span><br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;location&quot;</span>: <span className="text-amber-300">&quot;Bhatwari&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;forecast&quot;</span>: [<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&#123;<span className="text-cyan-400">&quot;rain&quot;</span>: <span className="text-orange-400 font-bold">35.0</span>&#125;,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&#123;<span className="text-cyan-400">&quot;rain&quot;</span>: <span className="text-orange-400 font-bold">42.0</span>&#125;,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&#123;<span className="text-cyan-400">&quot;rain&quot;</span>: <span className="text-orange-400 font-bold">28.0</span>&#125;<br />
                &nbsp;&nbsp;],<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;temp_c&quot;</span>: <span className="text-emerald-400">22.4</span>,<br />
                &nbsp;&nbsp;<span className="text-cyan-400">&quot;humidity&quot;</span>: <span className="text-emerald-400">91%</span><br />
                <span className="text-slate-500">&#125;</span>
              </div>
            </div>

            {/* Forecast Rainfall Bar Chart */}
            <div className="bg-[#030b14] border border-slate-800/80 rounded p-2 space-y-1">
              <div className="text-[9px] font-mono text-slate-400 flex items-center justify-between">
                <span>Forecast Rain (mm)</span>
                <span className="text-orange-400 font-bold">42 mm max</span>
              </div>
              <svg viewBox="0 0 100 45" className="w-full h-11">
                <line x1="10" y1="40" x2="95" y2="40" stroke="#334155" strokeWidth="0.5" />
                <rect x="25" y="16" width="12" height="24" fill="#f97316" rx="0.5" />
                <rect x="48" y="11" width="12" height="29" fill="#ea580c" rx="0.5" />
                <rect x="71" y="21" width="12" height="19" fill="#f97316" rx="0.5" />
                <text x="31" y="44" fontSize="5" fill="#64748b" textAnchor="middle">11:00</text>
                <text x="54" y="44" fontSize="5" fill="#f97316" fontWeight="bold" textAnchor="middle">12:00</text>
                <text x="77" y="44" fontSize="5" fill="#64748b" textAnchor="middle">13:00</text>
              </svg>
            </div>
          </div>

        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 3: HOW DATA FLOWS INTO THE SYSTEM (7-STEP PIPELINE)            */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-cyan-400 font-mono">
            3. HOW DATA FLOWS INTO THE SYSTEM
          </h2>
          <span className="text-[11px] font-mono text-slate-400">Sequential Ingestion Architecture</span>
        </div>

        {/* 7-Step Pipeline Diagram matching Reference Image 1 */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 relative">
          
          {/* 1. DATA COLLECTION */}
          <div className="bg-slate-900/90 border border-slate-700 hover:border-cyan-500/80 rounded-lg p-3 text-center space-y-2 transition flex flex-col justify-between">
            <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
              1. DATA COLLECTION
            </div>
            <div className="w-10 h-10 mx-auto rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center">
              <CloudRain className="w-5 h-5" />
            </div>
            <p className="text-[10px] text-slate-300 leading-snug">
              APIs, IoT Sensors, Satellite, Historical Records
            </p>
            <span className="text-[8px] font-mono text-slate-500 uppercase">Input Layer</span>
          </div>

          {/* 2. DATA INGESTION */}
          <div className="bg-slate-900/90 border border-slate-700 hover:border-cyan-500/80 rounded-lg p-3 text-center space-y-2 transition flex flex-col justify-between">
            <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
              2. DATA INGESTION
            </div>
            <div className="w-10 h-10 mx-auto rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <p className="text-[10px] text-slate-300 leading-snug">
              Data is received in raw format (JSON, CSV, TIFF, Shapefile, etc.)
            </p>
            <span className="text-[8px] font-mono text-slate-500 uppercase">Gateway Ingest</span>
          </div>

          {/* 3. PREPROCESSING */}
          <div className="bg-slate-900/90 border border-slate-700 hover:border-cyan-500/80 rounded-lg p-3 text-center space-y-2 transition flex flex-col justify-between">
            <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">
              3. PREPROCESSING
            </div>
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <p className="text-[10px] text-slate-300 leading-snug">
              Cleaning, validation, handling missing values, format conversion
            </p>
            <span className="text-[8px] font-mono text-slate-500 uppercase">Data Hygiene</span>
          </div>

          {/* 4. DATA FUSION */}
          <div className="bg-slate-900/90 border border-slate-700 hover:border-cyan-500/80 rounded-lg p-3 text-center space-y-2 transition flex flex-col justify-between">
            <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
              4. DATA FUSION
            </div>
            <div className="w-10 h-10 mx-auto rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <p className="text-[10px] text-slate-300 leading-snug">
              Combine all datasets (spatial + temporal) into unified format
            </p>
            <span className="text-[8px] font-mono text-slate-500 uppercase">Space-Time Mesh</span>
          </div>

          {/* 5. FEATURE ENGINEERING */}
          <div className="bg-slate-900/90 border border-slate-700 hover:border-cyan-500/80 rounded-lg p-3 text-center space-y-2 transition flex flex-col justify-between">
            <div className="text-[10px] font-mono font-bold text-teal-400 uppercase">
              5. FEATURE ENGINEERING
            </div>
            <div className="w-10 h-10 mx-auto rounded-full bg-teal-950/80 border border-teal-800 text-teal-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-[10px] text-slate-300 leading-snug">
              Extract important features like rainfall intensity, slope, soil saturation, etc.
            </p>
            <span className="text-[8px] font-mono text-slate-500 uppercase">27-Feature Vector</span>
          </div>

          {/* 6. AI / ML MODEL */}
          <div className="bg-slate-900/90 border border-rose-500/40 hover:border-rose-400 rounded-lg p-3 text-center space-y-2 transition flex flex-col justify-between">
            <div className="text-[10px] font-mono font-bold text-rose-400 uppercase">
              6. AI / ML MODEL
            </div>
            <div className="w-10 h-10 mx-auto rounded-full bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-[10px] text-slate-300 leading-snug">
              Model predicts risk score, flood probability, lead time at village/ward level
            </p>
            <span className="text-[8px] font-mono text-rose-400 uppercase font-bold">Inference Core</span>
          </div>

          {/* 7. OUTPUT */}
          <div className="bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 rounded-lg p-3 text-center space-y-2 transition flex flex-col justify-between">
            <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
              7. OUTPUT
            </div>
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <p className="text-[10px] text-slate-300 leading-snug">
              Risk Map, Alerts, Dashboards, Reports, Evacuation Vectors
            </p>
            <span className="text-[8px] font-mono text-emerald-400 uppercase font-bold">Actionable Output</span>
          </div>

        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* HERO SECTION: REAL EXAMPLE (ONE RECORD FLOW)                           */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="bg-[#040e1b] border-2 border-cyan-500/40 rounded-xl p-4 sm:p-5 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
              END-TO-END EXECUTION TRACE (BHATWARI DISASTER RECORD)
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-white uppercase font-mono">
              REAL EXAMPLE (ONE RECORD FLOW)
            </h3>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlaySimulation}
              disabled={isPlaying}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPlaying ? 'RUNNING TRACE…' : 'PLAY TRACE'}</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveStep(6); setIsPlaying(false); }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1 transition"
              title="Reset to Full View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The Animated Horizontal Step Flow matching Image 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 items-center">
          
          {/* Step 1: Rainfall */}
          <div
            onClick={() => setActiveStep(0)}
            className={`p-2.5 rounded-lg border transition cursor-pointer flex flex-col justify-between min-h-[90px] ${
              activeStep >= 0
                ? 'bg-blue-950/80 border-blue-500 text-white shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <CloudRain className="w-4 h-4 text-blue-400" />
              <span className="text-[9px] font-mono text-blue-300 font-bold">10:00 AM</span>
            </div>
            <div className="text-[11px] font-bold leading-snug">
              Rainfall API sends <span className="text-cyan-300 font-mono">48.6 mm</span> for Bhatwari
            </div>
            <div className="text-[8px] font-mono text-slate-400">IMD AWS Station #42114</div>
          </div>

          {/* Step 2: Soil Moisture */}
          <div
            onClick={() => setActiveStep(1)}
            className={`p-2.5 rounded-lg border transition cursor-pointer flex flex-col justify-between min-h-[90px] ${
              activeStep >= 1
                ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <Droplets className="w-4 h-4 text-emerald-400" />
              <span className="text-[9px] font-mono text-emerald-300 font-bold">TDR Probe</span>
            </div>
            <div className="text-[11px] font-bold leading-snug">
              Soil moisture sensor sends <span className="text-emerald-300 font-mono">72.5%</span>
            </div>
            <div className="text-[8px] font-mono text-slate-400">Near Zero Infiltration Buffer</div>
          </div>

          {/* Step 3: Water Level */}
          <div
            onClick={() => setActiveStep(2)}
            className={`p-2.5 rounded-lg border transition cursor-pointer flex flex-col justify-between min-h-[90px] ${
              activeStep >= 2
                ? 'bg-sky-950/80 border-sky-500 text-white shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <Waves className="w-4 h-4 text-sky-400" />
              <span className="text-[9px] font-mono text-rose-400 font-bold">RISING</span>
            </div>
            <div className="text-[11px] font-bold leading-snug">
              Water level sensor sends <span className="text-sky-300 font-mono">2.85 m</span>
            </div>
            <div className="text-[8px] font-mono text-slate-400">+0.40 m/h Surge Velocity</div>
          </div>

          {/* Step 4: DEM Slope */}
          <div
            onClick={() => setActiveStep(3)}
            className={`p-2.5 rounded-lg border transition cursor-pointer flex flex-col justify-between min-h-[90px] ${
              activeStep >= 3
                ? 'bg-amber-950/80 border-amber-500 text-white shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <Mountain className="w-4 h-4 text-amber-400" />
              <span className="text-[9px] font-mono text-amber-300 font-bold">CartoDEM 10m</span>
            </div>
            <div className="text-[11px] font-bold leading-snug">
              DEM shows high slope <span className="text-amber-300 font-mono">(32.6°)</span>
            </div>
            <div className="text-[8px] font-mono text-slate-400">FoS = 1.04 Imminent Failure</div>
          </div>

          {/* Step 5: Past Data */}
          <div
            onClick={() => setActiveStep(4)}
            className={`p-2.5 rounded-lg border transition cursor-pointer flex flex-col justify-between min-h-[90px] ${
              activeStep >= 4
                ? 'bg-purple-950/80 border-purple-500 text-white shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <FileText className="w-4 h-4 text-purple-400" />
              <span className="text-[9px] font-mono text-purple-300 font-bold">Catalog #101</span>
            </div>
            <div className="text-[11px] font-bold leading-snug">
              Past data shows <span className="text-purple-300 font-mono">floods</span> in same area
            </div>
            <div className="text-[8px] font-mono text-slate-400">84% Cosine Match (2021)</div>
          </div>

          {/* Step 6: Model Calculates Risk */}
          <div
            onClick={() => setActiveStep(5)}
            className={`p-2.5 rounded-lg border transition cursor-pointer flex flex-col justify-between min-h-[90px] ${
              activeStep >= 5
                ? 'bg-rose-950/80 border-rose-500 text-white shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span className="text-[9px] font-mono text-rose-300 font-bold">ML Tier C</span>
            </div>
            <div className="text-[11px] font-bold leading-snug">
              Model calculates <span className="text-rose-400 font-mono text-sm font-black">Risk = 87%</span>
            </div>
            <div className="text-[8px] font-mono text-slate-400">Lead Time: 38 mins</div>
          </div>

          {/* Step 7: Critical Alert Dispatch */}
          <div
            onClick={() => setActiveStep(6)}
            className={`p-2.5 rounded-lg border transition cursor-pointer flex flex-col justify-between min-h-[90px] ${
              activeStep >= 6
                ? 'bg-red-600 border-red-400 text-white shadow-lg animate-pulse'
                : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <ShieldAlert className="w-4 h-4 text-white" />
              <span className="text-[9px] font-mono text-white font-black bg-red-800 px-1 py-0.2 rounded">
                CAP v1.2
              </span>
            </div>
            <div className="text-xs font-black uppercase tracking-tight leading-snug">
              System sends CRITICAL ALERT
            </div>
            <div className="text-[8px] font-mono text-red-100">CMAS + Siren + NDRF EOC</div>
          </div>

        </div>

        {/* Live Mathematical Proof State Banner */}
        <div className="bg-[#020712] border border-slate-800 rounded-lg p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Active Pipeline State:</strong> {
                activeStep === 0 ? 'Telemetry Ingest: Bhatwari 48.6mm/h rain recorded' :
                activeStep === 1 ? 'Pore Saturation: 72.5% moisture reached (Threshold 80%)' :
                activeStep === 2 ? 'Hydraulic Gauge: Alaknanda river at 2.85m (+0.40m/h surge)' :
                activeStep === 3 ? 'Geotechnical DEM: 32.6° slope with Factor of Safety 1.04' :
                activeStep === 4 ? 'Disaster Archive: High spatial overlap with 2023 cloudburst' :
                activeStep === 5 ? 'Random Forest Ensemble: Composite score converged to 87.0% (EXTREME)' :
                'Multi-Channel Outbound Broadcast: CAP XML, CMAS Cell Broadcast, and 1078 Helpline Dispatched'
              }
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-slate-400 text-[11px]">Audit Hash: 0x7c49...b821</span>
            <Link
              href="/portal/alerts"
              className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>View Public Alert</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
