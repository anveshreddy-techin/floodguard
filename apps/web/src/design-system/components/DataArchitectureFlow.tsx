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
    <section className="w-full bg-white text-slate-900 rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 lg:p-8 space-y-8 select-none font-sans">
      {/* ── HEADER BLOCK ── */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-sans font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              DATA INGESTION &amp; MULTI-SOURCE FUSION SPECIFICATION
            </span>
            <span className="text-slate-500 text-xs font-sans">SIH26192 Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans mt-1">
            HOW DATA IS GIVEN TO THE SYSTEM
          </h1>
          <p className="text-sm text-blue-700 font-medium">
            Example of Different Data Sources and Their Formats
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-sans text-blue-700 font-bold shadow-xs">
            <Cpu className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>Flash Flood Prediction System</span>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 1: DATA SOURCES (7 TILES)                                     */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-700 font-sans flex items-center gap-2">
            <span>1. DATA SOURCES</span>
            <span className="text-slate-500 font-normal normal-case text-xs">
              — Example of Different Data Sources and Their Formats
            </span>
          </h2>
          <span className="text-[11px] font-sans text-slate-500">7 Multi-Source Pillars</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {/* 1. Rainfall */}
          <div className="bg-slate-50 border border-blue-200 hover:border-blue-400 rounded-xl p-3 space-y-2 transition shadow-sm">
            <div className="flex items-center justify-between">
              <CloudRain className="w-5 h-5 text-blue-600" />
              <span className="text-[9px] font-sans font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200">
                MET-01
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                RAINFALL DATA
              </div>
              <div className="text-[10px] text-blue-700 font-medium">
                (IMD / Weather API)
              </div>
            </div>
            <ul className="text-[10px] text-slate-600 space-y-1 font-sans pt-1 border-t border-slate-200">
              <li className="flex items-center gap-1">• Rainfall amount (mm)</li>
              <li className="flex items-center gap-1">• Time</li>
              <li className="flex items-center gap-1">• Location (lat, long)</li>
            </ul>
          </div>

          {/* 2. Soil Moisture */}
          <div className="bg-slate-50 border border-emerald-200 hover:border-emerald-400 rounded-xl p-3 space-y-2 transition shadow-sm">
            <div className="flex items-center justify-between">
              <Droplets className="w-5 h-5 text-emerald-600" />
              <span className="text-[9px] font-sans font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                GEO-02
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                SOIL MOISTURE DATA
              </div>
              <div className="text-[10px] text-emerald-700 font-medium">
                (IoT Sensors / API)
              </div>
            </div>
            <ul className="text-[10px] text-slate-600 space-y-1 font-sans pt-1 border-t border-slate-200">
              <li className="flex items-center gap-1">• Soil moisture (%)</li>
              <li className="flex items-center gap-1">• Depth</li>
              <li className="flex items-center gap-1">• Time, Location</li>
            </ul>
          </div>

          {/* 3. Water Level */}
          <div className="bg-slate-50 border border-sky-200 hover:border-sky-400 rounded-xl p-3 space-y-2 transition shadow-sm">
            <div className="flex items-center justify-between">
              <Waves className="w-5 h-5 text-sky-600" />
              <span className="text-[9px] font-sans font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded border border-sky-200">
                HYD-03
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                WATER LEVEL DATA
              </div>
              <div className="text-[10px] text-sky-700 font-medium">
                (River / Stream Sensors)
              </div>
            </div>
            <ul className="text-[10px] text-slate-600 space-y-1 font-sans pt-1 border-t border-slate-200">
              <li className="flex items-center gap-1">• Water level (m)</li>
              <li className="flex items-center gap-1">• Flow rate (m³/s)</li>
              <li className="flex items-center gap-1">• Time, Location</li>
            </ul>
          </div>

          {/* 4. Terrain Data */}
          <div className="bg-slate-50 border border-amber-200 hover:border-amber-400 rounded-xl p-3 space-y-2 transition shadow-sm">
            <div className="flex items-center justify-between">
              <Mountain className="w-5 h-5 text-amber-600" />
              <span className="text-[9px] font-sans font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                GIS-04
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                TERRAIN DATA
              </div>
              <div className="text-[10px] text-amber-700 font-medium">
                (DEM / GIS)
              </div>
            </div>
            <ul className="text-[10px] text-slate-600 space-y-1 font-sans pt-1 border-t border-slate-200">
              <li className="flex items-center gap-1">• Elevation</li>
              <li className="flex items-center gap-1">• Slope</li>
              <li className="flex items-center gap-1">• Aspect</li>
            </ul>
          </div>

          {/* 5. Historical Data */}
          <div className="bg-slate-50 border border-purple-200 hover:border-purple-400 rounded-xl p-3 space-y-2 transition shadow-sm">
            <div className="flex items-center justify-between">
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="text-[9px] font-sans font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200">
                CAT-05
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                HISTORICAL DATA
              </div>
              <div className="text-[10px] text-purple-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                (Past Floods/Landslides)
              </div>
            </div>
            <ul className="text-[10px] text-slate-600 space-y-1 font-sans pt-1 border-t border-slate-200">
              <li className="flex items-center gap-1">• Event type</li>
              <li className="flex items-center gap-1">• Date &amp; Time</li>
              <li className="flex items-center gap-1">• Location, Impact</li>
            </ul>
          </div>

          {/* 6. Satellite Data */}
          <div className="bg-slate-50 border border-teal-200 hover:border-teal-400 rounded-xl p-3 space-y-2 transition shadow-sm">
            <div className="flex items-center justify-between">
              <Layers className="w-5 h-5 text-teal-600" />
              <span className="text-[9px] font-sans font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded border border-teal-200">
                SAT-06
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                SATELLITE DATA
              </div>
              <div className="text-[10px] text-teal-700 font-medium">
                (Remote Sensing)
              </div>
            </div>
            <ul className="text-[10px] text-slate-600 space-y-1 font-sans pt-1 border-t border-slate-200">
              <li className="flex items-center gap-1">• Land Use / Cover</li>
              <li className="flex items-center gap-1">• NDVI</li>
              <li className="flex items-center gap-1">• Surface Water</li>
            </ul>
          </div>

          {/* 7. Weather Forecast */}
          <div className="bg-slate-50 border border-orange-200 hover:border-orange-400 rounded-xl p-3 space-y-2 transition shadow-sm">
            <div className="flex items-center justify-between">
              <Sun className="w-5 h-5 text-orange-600" />
              <span className="text-[9px] font-sans font-bold text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded border border-orange-200">
                NWP-07
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                WEATHER FORECAST
              </div>
              <div className="text-[10px] text-orange-700 font-medium">
                (API / Model)
              </div>
            </div>
            <ul className="text-[10px] text-slate-600 space-y-1 font-sans pt-1 border-t border-slate-200">
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
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 font-sans">
            2. EXAMPLE — HOW DATA IS GIVEN (RAW FORMAT)
          </h2>
          <span className="text-xs font-sans text-slate-500">Authentic Ingestion Payloads</span>
        </div>

        {/* 7-Card Grid Matching Reference Image 1 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          
          {/* A. RAINFALL DATA (API JSON) */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between space-y-2.5 shadow-sm">
            <div>
              <div className="text-xs font-bold text-blue-700 font-sans uppercase tracking-tight">
                A. RAINFALL DATA (API JSON)
              </div>
              {/* Raw JSON snippet */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-mono text-slate-800 mt-2 overflow-x-auto leading-relaxed">
                <span className="text-slate-400">&#123;</span><br />
                &nbsp;&nbsp;<span className="text-blue-700 font-semibold">&quot;location&quot;</span>: <span className="text-amber-800">&quot;Bhatwari&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-blue-700 font-semibold">&quot;latitude&quot;</span>: <span className="text-emerald-700">30.7171</span>,<br />
                &nbsp;&nbsp;<span className="text-blue-700 font-semibold">&quot;longitude&quot;</span>: <span className="text-emerald-700">78.5648</span>,<br />
                &nbsp;&nbsp;<span className="text-blue-700 font-semibold">&quot;datetime&quot;</span>: <span className="text-amber-800">&quot;2025-05-20T10:00:00Z&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-blue-700 font-semibold">&quot;rainfall_mm&quot;</span>: <span className="text-emerald-700 font-bold">48.6</span>,<br />
                &nbsp;&nbsp;<span className="text-blue-700 font-semibold">&quot;duration_min&quot;</span>: <span className="text-emerald-700">60</span>,<br />
                &nbsp;&nbsp;<span className="text-blue-700 font-semibold">&quot;source&quot;</span>: <span className="text-amber-800">&quot;IMD_API&quot;</span><br />
                <span className="text-slate-400">&#125;</span>
              </div>
            </div>

            {/* Rainfall Bar Chart */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 space-y-1">
              <div className="text-[10px] font-sans font-medium text-slate-600 flex items-center justify-between">
                <span>Rainfall (mm)</span>
                <span className="text-blue-700 font-bold">Max 48.6</span>
              </div>
              <svg viewBox="0 0 100 45" className="w-full h-11">
                <line x1="10" y1="40" x2="95" y2="40" stroke="#cbd5e1" strokeWidth="0.5" />
                <rect x="15" y="24" width="8" height="16" fill="#60a5fa" rx="0.5" />
                <rect x="32" y="28" width="8" height="12" fill="#60a5fa" rx="0.5" />
                <rect x="49" y="25" width="8" height="15" fill="#60a5fa" rx="0.5" />
                <rect x="66" y="22" width="8" height="18" fill="#60a5fa" rx="0.5" />
                <rect x="83" y="10" width="8" height="30" fill="#2563eb" rx="0.5" />
                <text x="19" y="44" fontSize="5" fill="#64748b" textAnchor="middle">06:00</text>
                <text x="36" y="44" fontSize="5" fill="#64748b" textAnchor="middle">07:00</text>
                <text x="53" y="44" fontSize="5" fill="#64748b" textAnchor="middle">08:00</text>
                <text x="70" y="44" fontSize="5" fill="#64748b" textAnchor="middle">09:00</text>
                <text x="87" y="44" fontSize="5" fill="#1d4ed8" fontWeight="bold" textAnchor="middle">10:00</text>
              </svg>
            </div>
          </div>

          {/* B. SOIL MOISTURE (SENSOR JSON) */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between space-y-2.5 shadow-sm">
            <div>
              <div className="text-xs font-bold text-emerald-700 font-sans uppercase tracking-tight">
                B. SOIL MOISTURE (SENSOR JSON)
              </div>
              {/* Raw JSON snippet */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-mono text-slate-800 mt-2 overflow-x-auto leading-relaxed">
                <span className="text-slate-400">&#123;</span><br />
                &nbsp;&nbsp;<span className="text-emerald-700 font-semibold">&quot;sensor_id&quot;</span>: <span className="text-amber-800">&quot;SMT-001&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-emerald-700 font-semibold">&quot;location&quot;</span>: <span className="text-amber-800">&quot;Bhatwari&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-emerald-700 font-semibold">&quot;latitude&quot;</span>: <span className="text-emerald-700">30.7171</span>,<br />
                &nbsp;&nbsp;<span className="text-emerald-700 font-semibold">&quot;longitude&quot;</span>: <span className="text-emerald-700">78.5648</span>,<br />
                &nbsp;&nbsp;<span className="text-emerald-700 font-semibold">&quot;depth_cm&quot;</span>: <span className="text-emerald-700">20</span>,<br />
                &nbsp;&nbsp;<span className="text-emerald-700 font-semibold">&quot;soil_moisture_percent&quot;</span>: <span className="text-emerald-700 font-bold">72.5</span>,<br />
                &nbsp;&nbsp;<span className="text-emerald-700 font-semibold">&quot;timestamp&quot;</span>: <span className="text-amber-800">&quot;2025-05-20T10:00:00Z&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-emerald-700 font-semibold">&quot;battery_percent&quot;</span>: <span className="text-emerald-700">87</span><br />
                <span className="text-slate-400">&#125;</span>
              </div>
            </div>

            {/* Soil Moisture Bar Chart */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 space-y-1">
              <div className="text-[10px] font-sans font-medium text-slate-600 flex items-center justify-between">
                <span>Soil Moisture (%)</span>
                <span className="text-emerald-700 font-bold">72.5%</span>
              </div>
              <svg viewBox="0 0 100 45" className="w-full h-11">
                <line x1="10" y1="40" x2="95" y2="40" stroke="#cbd5e1" strokeWidth="0.5" />
                <rect x="15" y="27" width="8" height="13" fill="#34d399" rx="0.5" />
                <rect x="32" y="24" width="8" height="16" fill="#34d399" rx="0.5" />
                <rect x="49" y="20" width="8" height="20" fill="#34d399" rx="0.5" />
                <rect x="66" y="16" width="8" height="24" fill="#34d399" rx="0.5" />
                <rect x="83" y="11" width="8" height="29" fill="#059669" rx="0.5" />
                <text x="19" y="44" fontSize="5" fill="#64748b" textAnchor="middle">06:00</text>
                <text x="36" y="44" fontSize="5" fill="#64748b" textAnchor="middle">07:00</text>
                <text x="53" y="44" fontSize="5" fill="#64748b" textAnchor="middle">08:00</text>
                <text x="70" y="44" fontSize="5" fill="#64748b" textAnchor="middle">09:00</text>
                <text x="87" y="44" fontSize="5" fill="#047857" fontWeight="bold" textAnchor="middle">10:00</text>
              </svg>
            </div>
          </div>

          {/* C. WATER LEVEL (SENSOR JSON) */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between space-y-2.5 shadow-sm">
            <div>
              <div className="text-xs font-bold text-sky-700 font-sans uppercase tracking-tight">
                C. WATER LEVEL (SENSOR JSON)
              </div>
              {/* Raw JSON snippet */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-mono text-slate-800 mt-2 overflow-x-auto leading-relaxed">
                <span className="text-slate-400">&#123;</span><br />
                &nbsp;&nbsp;<span className="text-sky-700 font-semibold">&quot;sensor_id&quot;</span>: <span className="text-amber-800">&quot;WL-002&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-sky-700 font-semibold">&quot;location&quot;</span>: <span className="text-amber-800">&quot;Alaknanda River&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-sky-700 font-semibold">&quot;latitude&quot;</span>: <span className="text-emerald-700">30.6502</span>,<br />
                &nbsp;&nbsp;<span className="text-sky-700 font-semibold">&quot;longitude&quot;</span>: <span className="text-emerald-700">78.5210</span>,<br />
                &nbsp;&nbsp;<span className="text-sky-700 font-semibold">&quot;water_level_m&quot;</span>: <span className="text-emerald-700 font-bold">2.85</span>,<br />
                &nbsp;&nbsp;<span className="text-sky-700 font-semibold">&quot;flow_rate_cms&quot;</span>: <span className="text-emerald-700">215.6</span>,<br />
                &nbsp;&nbsp;<span className="text-sky-700 font-semibold">&quot;timestamp&quot;</span>: <span className="text-amber-800">&quot;2025-05-20T10:00:00Z&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-sky-700 font-semibold">&quot;status&quot;</span>: <span className="text-rose-600 font-bold">&quot;RISING&quot;</span><br />
                <span className="text-slate-400">&#125;</span>
              </div>
            </div>

            {/* Water Level Line Chart */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 space-y-1">
              <div className="text-[10px] font-sans font-medium text-slate-600 flex items-center justify-between">
                <span>Water Level (m)</span>
                <span className="text-sky-700 font-bold">2.85 m</span>
              </div>
              <svg viewBox="0 0 100 45" className="w-full h-11">
                <line x1="10" y1="40" x2="95" y2="40" stroke="#cbd5e1" strokeWidth="0.5" />
                <path d="M 15,34 L 32,30 L 49,24 L 66,19 L 85,11" fill="none" stroke="#0284c7" strokeWidth="1.5" />
                <circle cx="15" cy="34" r="1.5" fill="#0284c7" />
                <circle cx="32" cy="30" r="1.5" fill="#0284c7" />
                <circle cx="49" cy="24" r="1.5" fill="#0284c7" />
                <circle cx="66" cy="19" r="1.5" fill="#0284c7" />
                <circle cx="85" cy="11" r="2" fill="#dc2626" />
                <text x="15" y="44" fontSize="5" fill="#64748b" textAnchor="middle">06:00</text>
                <text x="32" y="44" fontSize="5" fill="#64748b" textAnchor="middle">07:00</text>
                <text x="49" y="44" fontSize="5" fill="#64748b" textAnchor="middle">08:00</text>
                <text x="66" y="44" fontSize="5" fill="#64748b" textAnchor="middle">09:00</text>
                <text x="85" y="44" fontSize="5" fill="#0284c7" fontWeight="bold" textAnchor="middle">10:00</text>
              </svg>
            </div>
          </div>

          {/* D. TERRAIN DATA (GIS SHAPEFILE/RASTER) */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between space-y-2.5 shadow-sm">
            <div>
              <div className="text-xs font-bold text-amber-800 font-sans uppercase tracking-tight">
                D. TERRAIN DATA (GIS RASTER)
              </div>
              
              {/* Raster Elevation Map Visualization */}
              <div className="relative w-full h-24 bg-gradient-to-tr from-emerald-100 via-amber-100 to-rose-100 rounded-lg border border-slate-200 mt-2 overflow-hidden flex items-center justify-center">
                {/* Contour Iso-lines */}
                <svg viewBox="0 0 100 60" className="w-full h-full opacity-60">
                  <path d="M 0,15 Q 40,35 70,10 T 100,25" fill="none" stroke="#78350f" strokeWidth="0.8" strokeDasharray="2,2" />
                  <path d="M 0,30 Q 30,50 60,30 T 100,45" fill="none" stroke="#92400e" strokeWidth="0.8" strokeDasharray="2,2" />
                  <path d="M 0,45 Q 40,55 80,45 T 100,55" fill="none" stroke="#065f46" strokeWidth="0.8" strokeDasharray="2,2" />
                </svg>

                {/* Elevation Legend Scale */}
                <div className="absolute top-1 right-1 bg-white/90 border border-slate-200 px-1.5 py-0.5 rounded text-[8px] font-sans font-medium text-slate-700 shadow-xs">
                  <span className="text-amber-700 font-bold">3500m</span><br />
                  <span className="text-emerald-700">500m</span>
                </div>
              </div>
            </div>

            {/* Attributes Table */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 space-y-1">
              <div className="text-[9px] font-sans text-amber-800 font-bold">Attributes (Example)</div>
              <table className="w-full text-[9px] font-mono text-slate-700 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-0.5 text-left font-sans">Grid</th>
                    <th className="py-0.5 text-right font-sans">Ele(m)</th>
                    <th className="py-0.5 text-right font-sans">Slope</th>
                    <th className="py-0.5 text-right font-sans">Aspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-0.5 text-blue-700 font-semibold">101</td>
                    <td className="py-0.5 text-right">2450</td>
                    <td className="py-0.5 text-right text-rose-600 font-bold">32.6°</td>
                    <td className="py-0.5 text-right">120°</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 text-blue-700 font-semibold">102</td>
                    <td className="py-0.5 text-right">2270</td>
                    <td className="py-0.5 text-right text-amber-700">28.1°</td>
                    <td className="py-0.5 text-right">135°</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 text-blue-700 font-semibold">103</td>
                    <td className="py-0.5 text-right">2100</td>
                    <td className="py-0.5 text-right text-emerald-700">25.4°</td>
                    <td className="py-0.5 text-right">110°</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* E. HISTORICAL DATA (CSV) */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between space-y-2.5 shadow-sm">
            <div>
              <div className="text-xs font-bold text-purple-700 font-sans uppercase tracking-tight">
                E. HISTORICAL DATA (CSV)
              </div>

              {/* CSV table preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-[9px] font-sans text-slate-700 mt-2 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="py-0.5 text-left">id</th>
                      <th className="py-0.5 text-left">type</th>
                      <th className="py-0.5 text-left">date</th>
                      <th className="py-0.5 text-left">loc</th>
                      <th className="py-0.5 text-right">impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[8.5px]">
                    <tr>
                      <td className="py-0.5 text-purple-700 font-bold">101</td>
                      <td className="py-0.5 text-rose-600 font-sans font-medium">Flood</td>
                      <td className="py-0.5">07-15</td>
                      <td className="py-0.5 font-sans">Bhatwari</td>
                      <td className="py-0.5 text-right text-rose-600 font-bold font-sans">High</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 text-purple-700 font-bold">102</td>
                      <td className="py-0.5 text-amber-600 font-sans font-medium">Slide</td>
                      <td className="py-0.5">08-04</td>
                      <td className="py-0.5 font-sans">Taluka</td>
                      <td className="py-0.5 text-right text-amber-600 font-medium font-sans">Med</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 text-purple-700 font-bold">103</td>
                      <td className="py-0.5 text-rose-600 font-sans font-medium">Flood</td>
                      <td className="py-0.5">07-21</td>
                      <td className="py-0.5 font-sans">Uttarkashi</td>
                      <td className="py-0.5 text-right text-rose-600 font-bold font-sans">High</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Spatial Location Map Graphic */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 space-y-1">
              <div className="text-[9px] font-sans text-slate-600 font-medium">Past Hazard Incidents</div>
              <svg viewBox="0 0 100 40" className="w-full h-9 bg-slate-100 rounded border border-slate-200">
                <circle cx="20" cy="25" r="3" fill="#ef4444" />
                <circle cx="45" cy="18" r="3" fill="#f59e0b" />
                <circle cx="65" cy="28" r="3" fill="#ef4444" />
                <circle cx="85" cy="15" r="3" fill="#f59e0b" />
              </svg>
              <div className="flex items-center justify-between text-[8px] font-sans text-slate-500 font-medium">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Flood</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Landslide</span>
              </div>
            </div>
          </div>

          {/* F. SATELLITE DATA (TIFF / RASTER) */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between space-y-2.5 shadow-sm">
            <div>
              <div className="text-xs font-bold text-teal-800 font-sans uppercase tracking-tight">
                F. SATELLITE DATA (RASTER)
              </div>

              {/* False Color NDVI raster representation */}
              <div className="relative w-full h-24 bg-gradient-to-br from-emerald-100 via-teal-100 to-sky-100 rounded-lg border border-slate-200 mt-2 overflow-hidden flex items-center justify-center">
                {/* Topographic pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:8px_8px] opacity-25" />
                <div className="absolute top-1 left-1 bg-white/90 border border-slate-200 px-1.5 py-0.5 rounded text-[8px] font-sans font-semibold text-teal-800 shadow-xs">
                  NDVI Spectral Index
                </div>

                {/* NDVI Scale */}
                <div className="absolute right-1.5 top-1.5 bottom-1.5 w-2 bg-gradient-to-b from-emerald-500 via-amber-500 to-rose-600 rounded" />
              </div>
            </div>

            {/* Satellite Metadata info */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-[9px] font-sans text-slate-700 space-y-0.5">
              <div>Resolution: <span className="text-teal-700 font-bold">10m</span></div>
              <div>Date: <span className="text-slate-900 font-medium">2025-05-20</span></div>
              <div>Source: <span className="text-teal-700">Sentinel-2 MSI</span></div>
            </div>
          </div>

          {/* G. WEATHER FORECAST (API JSON) */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between space-y-2.5 shadow-sm">
            <div>
              <div className="text-xs font-bold text-orange-700 font-sans uppercase tracking-tight">
                G. WEATHER FORECAST (JSON)
              </div>
              {/* Raw JSON snippet */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-mono text-slate-800 mt-2 overflow-x-auto leading-relaxed">
                <span className="text-slate-400">&#123;</span><br />
                &nbsp;&nbsp;<span className="text-orange-700 font-semibold">&quot;location&quot;</span>: <span className="text-amber-800">&quot;Bhatwari&quot;</span>,<br />
                &nbsp;&nbsp;<span className="text-orange-700 font-semibold">&quot;forecast&quot;</span>: [<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&#123;<span className="text-slate-600">&quot;rain&quot;</span>: <span className="text-orange-600 font-bold">35.0</span>&#125;,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&#123;<span className="text-slate-600">&quot;rain&quot;</span>: <span className="text-orange-600 font-bold">42.0</span>&#125;,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&#123;<span className="text-slate-600">&quot;rain&quot;</span>: <span className="text-orange-600 font-bold">28.0</span>&#125;<br />
                &nbsp;&nbsp;],<br />
                &nbsp;&nbsp;<span className="text-orange-700 font-semibold">&quot;temp_c&quot;</span>: <span className="text-emerald-700">22.4</span>,<br />
                &nbsp;&nbsp;<span className="text-orange-700 font-semibold">&quot;humidity&quot;</span>: <span className="text-emerald-700">91%</span><br />
                <span className="text-slate-400">&#125;</span>
              </div>
            </div>

            {/* Forecast Rainfall Bar Chart */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 space-y-1">
              <div className="text-[10px] font-sans font-medium text-slate-600 flex items-center justify-between">
                <span>Forecast Rain (mm)</span>
                <span className="text-orange-600 font-bold">42 mm max</span>
              </div>
              <svg viewBox="0 0 100 45" className="w-full h-11">
                <line x1="10" y1="40" x2="95" y2="40" stroke="#cbd5e1" strokeWidth="0.5" />
                <rect x="25" y="16" width="12" height="24" fill="#fb923c" rx="0.5" />
                <rect x="48" y="11" width="12" height="29" fill="#ea580c" rx="0.5" />
                <rect x="71" y="21" width="12" height="19" fill="#fb923c" rx="0.5" />
                <text x="31" y="44" fontSize="5" fill="#64748b" textAnchor="middle">11:00</text>
                <text x="54" y="44" fontSize="5" fill="#ea580c" fontWeight="bold" textAnchor="middle">12:00</text>
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
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 font-sans">
            3. HOW DATA FLOWS INTO THE SYSTEM
          </h2>
          <span className="text-xs font-sans text-slate-500">Sequential Ingestion Architecture</span>
        </div>

        {/* 7-Step Pipeline Diagram matching Reference Image 1 */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5 relative">
          
          {/* 1. DATA COLLECTION */}
          <div className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-3 text-center space-y-2 transition flex flex-col justify-between shadow-sm">
            <div className="text-[11px] font-sans font-bold text-blue-700 uppercase">
              1. DATA COLLECTION
            </div>
            <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <CloudRain className="w-5 h-5" />
            </div>
            <p className="text-[11px] text-slate-600 leading-snug font-sans">
              APIs, IoT Sensors, Satellite, Historical Records
            </p>
            <span className="text-[9px] font-sans text-slate-400 uppercase font-medium">Input Layer</span>
          </div>

          {/* 2. DATA INGESTION */}
          <div className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-3 text-center space-y-2 transition flex flex-col justify-between shadow-sm">
            <div className="text-[11px] font-sans font-bold text-blue-700 uppercase">
              2. DATA INGESTION
            </div>
            <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <p className="text-[11px] text-slate-600 leading-snug font-sans">
              Data is received in raw format (JSON, CSV, TIFF, Shapefile, etc.)
            </p>
            <span className="text-[9px] font-sans text-slate-400 uppercase font-medium">Gateway Ingest</span>
          </div>

          {/* 3. PREPROCESSING */}
          <div className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-3 text-center space-y-2 transition flex flex-col justify-between shadow-sm">
            <div className="text-[11px] font-sans font-bold text-amber-700 uppercase">
              3. PREPROCESSING
            </div>
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <p className="text-[11px] text-slate-600 leading-snug font-sans">
              Cleaning, validation, handling missing values, format conversion
            </p>
            <span className="text-[9px] font-sans text-slate-400 uppercase font-medium">Data Hygiene</span>
          </div>

          {/* 4. DATA FUSION */}
          <div className="bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-3 text-center space-y-2 transition flex flex-col justify-between shadow-sm">
            <div className="text-[11px] font-sans font-bold text-indigo-700 uppercase">
              4. DATA FUSION
            </div>
            <div className="w-10 h-10 mx-auto rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <p className="text-[11px] text-slate-600 leading-snug font-sans">
              Combine all datasets (spatial + temporal) into unified format
            </p>
            <span className="text-[9px] font-sans text-slate-400 uppercase font-medium">Space-Time Mesh</span>
          </div>

          {/* 5. FEATURE ENGINEERING */}
          <div className="bg-white border border-slate-200 hover:border-teal-400 rounded-xl p-3 text-center space-y-2 transition flex flex-col justify-between shadow-sm">
            <div className="text-[11px] font-sans font-bold text-teal-700 uppercase">
              5. FEATURE ENGINEERING
            </div>
            <div className="w-10 h-10 mx-auto rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-[11px] text-slate-600 leading-snug font-sans">
              Extract important features like rainfall intensity, slope, soil saturation, etc.
            </p>
            <span className="text-[9px] font-sans text-slate-400 uppercase font-medium">27-Feature Vector</span>
          </div>

          {/* 6. AI / ML MODEL */}
          <div className="bg-white border border-purple-200 hover:border-purple-400 rounded-xl p-3 text-center space-y-2 transition flex flex-col justify-between shadow-sm">
            <div className="text-[11px] font-sans font-bold text-purple-700 uppercase">
              6. AI / ML MODEL
            </div>
            <div className="w-10 h-10 mx-auto rounded-full bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-[11px] text-slate-600 leading-snug font-sans">
              Model predicts risk score, flood probability, lead time at village/ward level
            </p>
            <span className="text-[9px] font-sans text-purple-700 uppercase font-bold">Inference Core</span>
          </div>

          {/* 7. OUTPUT */}
          <div className="bg-white border border-emerald-200 hover:border-emerald-400 rounded-xl p-3 text-center space-y-2 transition flex flex-col justify-between shadow-sm">
            <div className="text-[11px] font-sans font-bold text-emerald-700 uppercase">
              7. OUTPUT
            </div>
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <p className="text-[11px] text-slate-600 leading-snug font-sans">
              Risk Map, Alerts, Dashboards, Reports, Evacuation Vectors
            </p>
            <span className="text-[9px] font-sans text-emerald-700 uppercase font-bold">Actionable Output</span>
          </div>

        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* HERO SECTION: REAL EXAMPLE (ONE RECORD FLOW)                           */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-blue-600">
              END-TO-END EXECUTION TRACE (BHATWARI DISASTER RECORD)
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase font-sans">
              REAL EXAMPLE (ONE RECORD FLOW)
            </h3>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlaySimulation}
              disabled={isPlaying}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-sans font-semibold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPlaying ? 'RUNNING TRACE…' : 'PLAY TRACE'}</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveStep(6); setIsPlaying(false); }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans text-xs flex items-center gap-1 transition"
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
            className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between min-h-[95px] ${
              activeStep >= 0
                ? 'bg-blue-50 border-blue-400 text-slate-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <CloudRain className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-sans text-blue-700 font-bold">10:00 AM</span>
            </div>
            <div className="text-[11px] font-sans font-semibold text-slate-800 leading-snug">
              Rainfall API sends <span className="text-blue-700 font-bold">48.6 mm</span> for Bhatwari
            </div>
            <div className="text-[9px] font-sans text-slate-500">IMD AWS Station #42114</div>
          </div>

          {/* Step 2: Soil Moisture */}
          <div
            onClick={() => setActiveStep(1)}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between min-h-[95px] ${
              activeStep >= 1
                ? 'bg-emerald-50 border-emerald-400 text-slate-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <Droplets className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-sans text-emerald-700 font-bold">TDR Probe</span>
            </div>
            <div className="text-[11px] font-sans font-semibold text-slate-800 leading-snug">
              Soil moisture sensor sends <span className="text-emerald-700 font-bold">72.5%</span>
            </div>
            <div className="text-[9px] font-sans text-slate-500">Near Zero Infiltration Buffer</div>
          </div>

          {/* Step 3: Water Level */}
          <div
            onClick={() => setActiveStep(2)}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between min-h-[95px] ${
              activeStep >= 2
                ? 'bg-sky-50 border-sky-400 text-slate-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <Waves className="w-4 h-4 text-sky-600" />
              <span className="text-[10px] font-sans text-rose-600 font-bold">RISING</span>
            </div>
            <div className="text-[11px] font-sans font-semibold text-slate-800 leading-snug">
              Water level sensor sends <span className="text-sky-700 font-bold">2.85 m</span>
            </div>
            <div className="text-[9px] font-sans text-slate-500">+0.40 m/h Surge Velocity</div>
          </div>

          {/* Step 4: DEM Slope */}
          <div
            onClick={() => setActiveStep(3)}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between min-h-[95px] ${
              activeStep >= 3
                ? 'bg-amber-50 border-amber-400 text-slate-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <Mountain className="w-4 h-4 text-amber-600" />
              <span className="text-[10px] font-sans text-amber-800 font-bold">CartoDEM 10m</span>
            </div>
            <div className="text-[11px] font-sans font-semibold text-slate-800 leading-snug">
              DEM shows high slope <span className="text-amber-800 font-bold">(32.6°)</span>
            </div>
            <div className="text-[9px] font-sans text-slate-500">FoS = 1.04 Imminent Failure</div>
          </div>

          {/* Step 5: Past Data */}
          <div
            onClick={() => setActiveStep(4)}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between min-h-[95px] ${
              activeStep >= 4
                ? 'bg-purple-50 border-purple-400 text-slate-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="text-[10px] font-sans text-purple-700 font-bold">Catalog #101</span>
            </div>
            <div className="text-[11px] font-sans font-semibold text-slate-800 leading-snug">
              Past data shows <span className="text-purple-700 font-bold">floods</span> in same area
            </div>
            <div className="text-[9px] font-sans text-slate-500">84% Cosine Match (2021)</div>
          </div>

          {/* Step 6: Model Calculates Risk */}
          <div
            onClick={() => setActiveStep(5)}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between min-h-[95px] ${
              activeStep >= 5
                ? 'bg-rose-50 border-rose-400 text-slate-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span className="text-[10px] font-sans text-rose-700 font-bold">ML Tier C</span>
            </div>
            <div className="text-[11px] font-sans font-semibold text-slate-800 leading-snug">
              Model calculates <span className="text-rose-600 font-bold">Risk = 87%</span>
            </div>
            <div className="text-[9px] font-sans text-slate-500">Lead Time: 38 mins</div>
          </div>

          {/* Step 7: Critical Alert Dispatch */}
          <div
            onClick={() => setActiveStep(6)}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between min-h-[95px] ${
              activeStep >= 6
                ? 'bg-red-600 border-red-700 text-white shadow-md animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <ShieldAlert className="w-4 h-4 text-white" />
              <span className="text-[9px] font-sans text-white font-bold bg-red-800 px-1.5 py-0.5 rounded">
                CAP v1.2
              </span>
            </div>
            <div className="text-xs font-black uppercase tracking-tight leading-snug">
              System sends CRITICAL ALERT
            </div>
            <div className="text-[9px] font-sans text-red-100">CMAS + Siren + NDRF EOC</div>
          </div>

        </div>

        {/* Live Mathematical Proof State Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-sans">
          <div className="flex items-center gap-2.5 text-slate-800">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong className="text-blue-700">Active Pipeline State:</strong> {
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
            <span className="text-slate-500 text-[11px] font-mono">Audit Hash: 0x7c49...b821</span>
            <Link
              href="/portal/alerts"
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
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
