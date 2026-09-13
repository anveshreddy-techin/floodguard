'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { CommandCenterMap, DEMO_VILLAGES, VillageData } from '@/components/ui/CommandCenterMap';
import { useLocation } from '@/context/LocationContext';
import { useEnvironment } from '@/context/EnvironmentContext';
import { useAdaptive } from '@/context/AdaptiveContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle,
  Clock,
  Home,
  Users,
  TrendingUp,
  Activity,
  Layers,
  Brain,
  Map as MapIcon,
  Bell,
  ShieldAlert,
  ArrowRight,
  ArrowUpRight,
  Droplets,
  CloudRain,
  ExternalLink,
  ChevronRight,
  Database,
  CheckCircle2,
  MoreVertical,
  ChevronDown,
  Compass,
  MapPin,
  Radio
} from 'lucide-react';

export default function CommandCenterPage() {
  const router = useRouter();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const { setPage, setMode, setRiskState } = useEnvironment();
  const { isCitizen, t } = useAdaptive();

  const [selectedVillage, setSelectedVillage] = useState<VillageData>(DEMO_VILLAGES[0]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SENSORS' | 'HISTORY'>('OVERVIEW');
  const [trendTimeRange, setTrendTimeRange] = useState<string>('Last 24 Hours');

  useEffect(() => {
    setPage('command-center');
    setMode('DEMO');
    setRiskState('HIGH');
  }, [setPage, setMode, setRiskState]);

  // Handle hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'm' || e.key === 'M') router.push('/map');
      if (e.key === 's' || e.key === 'S') router.push('/safety');
      if (e.key === 'w' || e.key === 'W') router.push('/role-workspace');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F4F8] text-slate-900 select-none">
      {/* ── 1. LEFT SIDEBAR (Dark navy #1B2A3B) ── */}
      <Sidebar activeTab="overview" />

      {/* ── 2. MAIN CONTENT AREA (Light #F0F4F8) ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Clean White Top Header */}
        <Header dataMode="DEMO" systemStatus="OPERATIONAL" />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-4">

          {/* ── TOP SECTION: TITLE & 5-STAGE PROCESS PIPELINE ── */}
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            {/* Title */}
            <div>
              <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
                Flood Risk Command Center
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Monitor • Predict • Alert • Respond
              </p>
            </div>

            {/* 5-Stage Process Pipeline Ribbon */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full xl:w-auto pb-1 xl:pb-0 text-xs">
              {/* Step 1: Multi-Source Data */}
              <div className="flex items-center gap-1.5 bg-blue-50/80 border border-blue-100 px-2.5 py-1.5 rounded-lg shrink-0">
                <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  <Database className="w-3 h-3" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-[11px] leading-tight">Multi-Source Data</div>
                  <div className="text-[9px] text-slate-500 leading-tight">Rainfall, Water, Terrain</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

              {/* Step 2: AI Analysis */}
              <div className="flex items-center gap-1.5 bg-blue-50/80 border border-blue-100 px-2.5 py-1.5 rounded-lg shrink-0">
                <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                  <Brain className="w-3 h-3" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-[11px] leading-tight">AI Analysis</div>
                  <div className="text-[9px] text-slate-500 leading-tight">Risk Assessment</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

              {/* Step 3: GIS Mapping */}
              <div className="flex items-center gap-1.5 bg-emerald-50/80 border border-emerald-100 px-2.5 py-1.5 rounded-lg shrink-0">
                <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                  <MapIcon className="w-3 h-3" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-[11px] leading-tight">GIS Mapping</div>
                  <div className="text-[9px] text-slate-500 leading-tight">Impact & Risk Zones</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

              {/* Step 4: Alerts */}
              <div className="flex items-center gap-1.5 bg-amber-50/80 border border-amber-100 px-2.5 py-1.5 rounded-lg shrink-0">
                <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center text-[10px]">
                  <Bell className="w-3 h-3" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-[11px] leading-tight">Alerts</div>
                  <div className="text-[9px] text-slate-500 leading-tight">Warnings & CAP</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

              {/* Step 5: Response Support */}
              <div className="flex items-center gap-1.5 bg-teal-50/80 border border-teal-100 px-2.5 py-1.5 rounded-lg shrink-0">
                <div className="w-5 h-5 rounded-md bg-teal-600 text-white flex items-center justify-center text-[10px]">
                  <Home className="w-3 h-3" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-[11px] leading-tight">Response Support</div>
                  <div className="text-[9px] text-slate-500 leading-tight">Shelters & Routes</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── MIDDLE GRID: MAP + ALERT & METRICS + VILLAGE DOSSIER ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* LEFT: Master Satellite Flood Risk Map (7 cols) */}
            <div className="lg:col-span-6 xl:col-span-6 h-[480px]">
              <CommandCenterMap
                selectedVillageId={selectedVillage.id}
                onSelectVillage={(v) => setSelectedVillage(v)}
              />
            </div>

            {/* CENTER: Hazard Alert Card + Donut Gauges + Safe Shelter (3 cols) */}
            <div className="lg:col-span-3 xl:col-span-3 flex flex-col justify-between gap-3 h-[480px]">

              {/* Red Hazard Alert Card */}
              <div className="bg-white rounded-xl border border-red-200 p-4 shadow-sm relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-red-600 leading-snug">
                      High flood risk detected in {selectedVillage.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Water level rising rapidly. Expected to reach critical level in {selectedVillage.leadTime}.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3.5">
                  <Link
                    href="/safety"
                    className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition active:scale-95"
                  >
                    View response plan
                  </Link>
                  <Link
                    href="/map"
                    className="flex-1 text-center border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-1.5 px-3 rounded-lg transition active:scale-95"
                  >
                    More details
                  </Link>
                </div>
              </div>

              {/* Row of 2 Metric Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Donut Risk Gauge */}
                <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-semibold text-slate-500 mb-1">Current Risk Level</span>
                  
                  {/* Donut ring SVG */}
                  <div className="relative w-16 h-16 my-1">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={selectedVillage.riskLevel === 'HIGH' ? 'text-orange-500' : 'text-amber-400'}
                        strokeDasharray={`${selectedVillage.riskScore * 10}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs font-black text-orange-600">
                        {selectedVillage.riskLevel === 'HIGH' ? 'High' : selectedVillage.riskLevel}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-full">
                    <span className="font-semibold text-slate-700">{selectedVillage.name}</span>
                    <br />
                    <span>Risk Score: {selectedVillage.riskScore} / 10</span>
                  </div>
                </div>

                {/* Warning Lead Time */}
                <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-semibold text-slate-500 mb-1">Warning Lead Time</span>
                  
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center my-1 text-blue-600">
                    <Clock className="w-6 h-6" />
                  </div>

                  <div className="text-sm font-black text-blue-600">
                    {selectedVillage.leadTime}
                  </div>
                  <div className="text-[9px] text-slate-400 leading-tight mt-0.5">
                    Estimated time before critical level
                  </div>
                </div>
              </div>

              {/* Safe Shelter (Nearest) */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <Home className="w-3.5 h-3.5 text-blue-600" />
                  <span>Safe Shelter (Nearest)</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Shelter Photo Thumbnail */}
                  <div className="w-16 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0 relative">
                    <div className="w-full h-full bg-gradient-to-tr from-blue-900 to-slate-700 flex items-center justify-center text-white text-[9px] font-bold">
                      🏫 SCHOOL
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {selectedVillage.shelterName}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {selectedVillage.name} • {selectedVillage.shelterCapacity} capacity
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                      {selectedVillage.shelterDistance} via Evacuation Route
                    </div>
                  </div>
                </div>

                <Link
                  href="/safety"
                  className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition"
                >
                  <span>View on Map</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

            </div>

            {/* RIGHT: Selected Village Details (3 cols) */}
            <div className="lg:col-span-3 xl:col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-[480px] flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Selected Village Details
                  </span>
                  <MoreVertical className="w-4 h-4 text-slate-400 cursor-pointer" />
                </div>

                {/* Village Hero Card with Lake/River photo */}
                <div className="relative rounded-lg overflow-hidden my-3 h-20 bg-gradient-to-r from-blue-900 to-emerald-800 p-3 flex flex-col justify-end text-white">
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600/90 text-white shadow">
                      {selectedVillage.riskLevel} RISK
                    </span>
                  </div>
                  <div className="font-bold text-base leading-tight">{selectedVillage.name}</div>
                  <div className="text-[11px] text-slate-200">Mandal: {selectedVillage.mandal}</div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 text-xs mb-3">
                  <button
                    onClick={() => setActiveTab('OVERVIEW')}
                    className={`pb-1.5 px-3 font-semibold transition border-b-2 ${
                      activeTab === 'OVERVIEW'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('SENSORS')}
                    className={`pb-1.5 px-3 font-semibold transition border-b-2 ${
                      activeTab === 'SENSORS'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Sensors
                  </button>
                  <button
                    onClick={() => setActiveTab('HISTORY')}
                    className={`pb-1.5 px-3 font-semibold transition border-b-2 ${
                      activeTab === 'HISTORY'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    History
                  </button>
                </div>

                {/* Demographics & Terrain Key-Value List */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> Population
                    </span>
                    <span className="font-bold text-slate-800">{selectedVillage.population.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-slate-400" /> Households
                    </span>
                    <span className="font-bold text-slate-800">{selectedVillage.households}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-slate-400" /> Elevation
                    </span>
                    <span className="font-bold text-slate-800">{selectedVillage.elevation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-slate-400" /> Nearest River
                    </span>
                    <span className="font-bold text-slate-800 truncate max-w-[140px]">{selectedVillage.riverDistance}</span>
                  </div>
                </div>
              </div>

              {/* Current Conditions Block */}
              <div className="border-t border-slate-100 pt-2.5">
                <div className="text-[11px] font-bold text-slate-800 mb-2">Current Conditions</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <CloudRain className="w-3.5 h-3.5 text-blue-500" /> Rainfall (1h)
                    </span>
                    <span className="font-bold text-slate-800">{selectedVillage.rainfall1h}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-blue-500" /> Water Level
                    </span>
                    <span className="font-bold text-red-600 flex items-center gap-0.5">
                      {selectedVillage.waterLevel} <span className="text-xs">↑</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" /> Soil Moisture
                    </span>
                    <span className="font-bold text-slate-800">{selectedVillage.soilMoisture}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ── BOTTOM ROW: 5 ANALYTICS & MONITORING CARDS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 pb-6">

            {/* CARD 1: Weather & Rainfall Trend (3 cols) */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <CloudRain className="w-4 h-4 text-blue-600" />
                    <span>Weather & Rainfall Trend</span>
                  </div>
                  <div className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                    <span>{trendTimeRange}</span>
                    <ChevronDown className="w-2.5 h-2.5" />
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> Rainfall (mm)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-1 rounded-full bg-orange-500"></span> Water Level (m)
                  </span>
                </div>

                {/* Interactive Dual Axis SVG Chart */}
                <div className="h-32 w-full pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 240 100">
                    {/* Grid lines */}
                    <line x1="20" y1="20" x2="230" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="20" y1="50" x2="230" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="20" y1="80" x2="230" y2="80" stroke="#F1F5F9" strokeWidth="1" />

                    {/* Y-axis labels left (Rainfall) */}
                    <text x="5" y="24" fontSize="7" fill="#94A3B8">60</text>
                    <text x="5" y="54" fontSize="7" fill="#94A3B8">30</text>
                    <text x="10" y="84" fontSize="7" fill="#94A3B8">0</text>

                    {/* Blue Bars: Rainfall (mm) */}
                    <rect x="35" y="65" width="8" height="15" rx="1" fill="#60A5FA" />
                    <rect x="65" y="55" width="8" height="25" rx="1" fill="#60A5FA" />
                    <rect x="95" y="45" width="8" height="35" rx="1" fill="#60A5FA" />
                    <rect x="125" y="32" width="8" height="48" rx="1" fill="#3B82F6" />
                    <rect x="155" y="48" width="8" height="32" rx="1" fill="#60A5FA" />
                    <rect x="185" y="58" width="8" height="22" rx="1" fill="#60A5FA" />
                    <rect x="215" y="38" width="8" height="42" rx="1" fill="#3B82F6" />

                    {/* Orange Line: Water Level curve */}
                    <path
                      d="M 39 74 Q 99 68 129 55 T 219 32"
                      fill="none"
                      stroke="#F97316"
                      strokeWidth="2.5"
                    />
                    {/* Curve nodes */}
                    <circle cx="39" cy="74" r="3" fill="#F97316" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="69" cy="70" r="3" fill="#F97316" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="99" cy="65" r="3" fill="#F97316" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="129" cy="55" r="3" fill="#F97316" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="159" cy="48" r="3" fill="#F97316" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="189" cy="42" r="3" fill="#F97316" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="219" cy="32" r="4" fill="#EF4444" stroke="#fff" strokeWidth="2" />

                    {/* X-axis time labels */}
                    <text x="32" y="96" fontSize="7" fill="#94A3B8">00:00</text>
                    <text x="62" y="96" fontSize="7" fill="#94A3B8">04:00</text>
                    <text x="92" y="96" fontSize="7" fill="#94A3B8">08:00</text>
                    <text x="122" y="96" fontSize="7" fill="#94A3B8">12:00</text>
                    <text x="152" y="96" fontSize="7" fill="#94A3B8">16:00</text>
                    <text x="182" y="96" fontSize="7" fill="#94A3B8">20:00</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* CARD 2: Affected Locations (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Affected Locations</span>
                </div>

                <div className="my-2">
                  <div className="text-3xl font-black text-slate-900 leading-none">5</div>
                  <div className="text-xs text-slate-500 font-medium">Villages at Risk</div>
                </div>

                <div className="space-y-1.5 text-xs pt-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical
                    </span>
                    <span className="font-bold text-slate-900">1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span> High
                    </span>
                    <span className="font-bold text-slate-900">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Moderate
                    </span>
                    <span className="font-bold text-slate-900">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low
                    </span>
                    <span className="font-bold text-slate-900">0</span>
                  </div>
                </div>
              </div>

              <Link
                href="/map"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition flex items-center gap-1 pt-2 border-t border-slate-100"
              >
                <span>View all villages</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* CARD 3: Active Alerts (3 cols) */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span>Active Alerts</span>
                  </div>
                  <Link href="/dashboard" className="text-[11px] font-semibold text-blue-600 hover:underline">
                    View all →
                  </Link>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Alert 1 */}
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                      ⚠️
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 text-[11px] truncate">High flood risk in Rangapur</div>
                      <div className="text-[10px] text-slate-400">22 Apr 14:20 • <span className="text-red-600 font-semibold">High</span></div>
                    </div>
                  </div>

                  {/* Alert 2 */}
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                      ⚠️
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 text-[11px] truncate">Water level rising in Veligonda</div>
                      <div className="text-[10px] text-slate-400">22 Apr 13:45 • <span className="text-orange-600 font-semibold">Moderate</span></div>
                    </div>
                  </div>

                  {/* Alert 3 */}
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                      ⚠️
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 text-[11px] truncate">Heavy rainfall in Kondapur</div>
                      <div className="text-[10px] text-slate-400">22 Apr 12:10 • <span className="text-amber-600 font-semibold">Moderate</span></div>
                    </div>
                  </div>

                  {/* Alert 4 */}
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                      ✓
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 text-[11px] truncate">Low water level - Peddapalli</div>
                      <div className="text-[10px] text-slate-400">22 Apr 10:32 • <span className="text-emerald-600 font-semibold">Low</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: Sensor Health (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>Sensor Health</span>
                  </div>
                  <Link href="/sensors" className="text-[11px] font-semibold text-blue-600 hover:underline">
                    View all →
                  </Link>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1.5 text-[11px]">
                      <CloudRain className="w-3 h-3 text-slate-400" /> Rainfall Sensors
                    </span>
                    <span className="text-slate-800 font-semibold text-[11px]">
                      4 / 5 <span className="text-emerald-500">● Online</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1.5 text-[11px]">
                      <Activity className="w-3 h-3 text-slate-400" /> Water Sensors
                    </span>
                    <span className="text-slate-800 font-semibold text-[11px]">
                      3 / 4 <span className="text-emerald-500">● Online</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1.5 text-[11px]">
                      <Droplets className="w-3 h-3 text-slate-400" /> Soil Sensors
                    </span>
                    <span className="text-slate-800 font-semibold text-[11px]">
                      4 / 4 <span className="text-emerald-500">● Online</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1.5 text-[11px]">
                      <Radio className="w-3 h-3 text-slate-400" /> Weather Station
                    </span>
                    <span className="text-slate-800 font-semibold text-[11px]">
                      2 / 3 <span className="text-emerald-500">● Online</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 5: Data Sources & AI Status (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800 mb-2 pb-1 border-b border-slate-100">
                  Data Sources & AI Status
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-[11px]">Weather API</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-[11px]">Sensor Network</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-[11px]">Historical Data</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-[11px]">AI Risk Engine</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">Running</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-[11px]">GIS Analysis</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">Running</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-center py-1 rounded bg-blue-50/70 border border-blue-100 text-[10px] font-medium text-blue-700">
                ⓘ Prototype / Demo Data
              </div>
            </div>

          </div>

          {/* ── FOOTER BAR ── */}
          <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 py-3 border-t border-slate-200 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-800">FloodGuard AI</span>
              <span>|</span>
              <span>Turning Data into Actionable Warnings</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-700">SIH 2026</span>
              <span>|</span>
              <span>Smart India Hackathon</span>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
