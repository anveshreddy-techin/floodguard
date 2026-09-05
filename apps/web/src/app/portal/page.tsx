'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdaptive } from '@/context/AdaptiveContext';
import {
  PipelineVisualizer,
  SachetAlertBanner,
  NdmisReportCard,
  NdrfDeploymentCard,
  DataArchitectureFlow,
} from '@/design-system/components';
import {
  Home,
  Activity,
  CloudRain,
  Droplets,
  Mountain,
  Radio,
  ShieldAlert,
  AlertTriangle,
  Users,
  Compass,
  FileText,
  Database,
  Clock,
  PhoneCall,
  Send,
  Volume2,
  MapPin,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Info,
  ChevronDown,
  Eye,
  Shield,
} from 'lucide-react';

interface DistrictRisk {
  name: string;
  level: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW' | 'NO_RISK';
  color: string;
  population: string;
  rainfall: string;
}

const UTTARAKHAND_DISTRICTS: Record<string, DistrictRisk> = {
  Uttarkashi: { name: 'Uttarkashi', level: 'VERY_HIGH', color: '#ef4444', population: '330,000', rainfall: '245 mm' },
  Rudraprayag: { name: 'Rudraprayag', level: 'VERY_HIGH', color: '#dc2626', population: '242,000', rainfall: '210 mm' },
  Chamoli: { name: 'Chamoli', level: 'HIGH', color: '#f97316', population: '391,000', rainfall: '185 mm' },
  Tehri: { name: 'Tehri Garhwal', level: 'HIGH', color: '#fb923c', population: '618,000', rainfall: '160 mm' },
  Bageshwar: { name: 'Bageshwar', level: 'MODERATE', color: '#f59e0b', population: '259,000', rainfall: '110 mm' },
  Pauri: { name: 'Pauri Garhwal', level: 'MODERATE', color: '#facc15', population: '687,000', rainfall: '95 mm' },
  Pithoragarh: { name: 'Pithoragarh', level: 'LOW', color: '#86efac', population: '483,000', rainfall: '45 mm' },
  Almora: { name: 'Almora', level: 'LOW', color: '#4ade80', population: '622,000', rainfall: '35 mm' },
  Dehradun: { name: 'Dehradun', level: 'LOW', color: '#86efac', population: '1,696,000', rainfall: '28 mm' },
};

export default function PublicPortalDashboardPage() {
  const { hierarchy, operatingMode } = useAdaptive();

  // Selected district on the map
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Uttarkashi');
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [modalAction, setModalAction] = useState<string | null>(null);
  const [portalView, setPortalView] = useState<'ALL' | 'OVERVIEW' | 'DATA_FLOW' | 'PIPELINE' | 'OPERATIONS'>('ALL');
  const [gisLayers, setGisLayers] = useState<{
    inundation: boolean;
    slope: boolean;
    drainage: boolean;
    analogs: boolean;
  }>({
    inundation: true,
    slope: true,
    drainage: true,
    analogs: true,
  });

  const currentDistData = UTTARAKHAND_DISTRICTS[selectedDistrict] || UTTARAKHAND_DISTRICTS['Uttarkashi'];

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-130px)] bg-[#f0f3f7] select-none text-slate-900">
      {/* ── LEFT SIDEBAR (Matching Reference Image) ── */}
      <aside className="w-full lg:w-64 bg-white border-r border-slate-200 shrink-0 p-3 space-y-5 shadow-xs">
        {/* SECTION 1: MAIN MENU */}
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1.5">
            MAIN MENU
          </div>
          <nav className="space-y-0.5 text-xs font-medium" aria-label="Portal Main Menu">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/portal' },
              { id: 'monitoring', label: 'Live Monitoring', icon: Activity, href: '/portal/weather' },
              { id: 'rainfall', label: 'Rainfall Analysis', icon: CloudRain, href: '/portal/weather' },
              { id: 'soil', label: 'Soil Moisture', icon: Droplets, href: '/sensors' },
              { id: 'slope', label: 'Slope Stability', icon: Mountain, href: '/cascade' },
              { id: 'iot', label: 'IoT Sensor Network', icon: Radio, href: '/sensors' },
              { id: 'risk', label: 'Risk Assessment', icon: ShieldAlert, href: '/portal/alerts' },
              { id: 'warnings', label: 'Early Warnings', icon: AlertTriangle, href: '/portal/alerts' },
              { id: 'evac', label: 'Evacuation Support', icon: Users, href: '/portal/shelters' },
              { id: 'history', label: 'Incident History', icon: Clock, href: '/incidents' },
              { id: 'reports', label: 'Reports & Analytics', icon: FileText, href: '/portal/documents' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-800 font-bold border-l-3 border-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* SECTION 2: QUICK ACTIONS */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1.5">
            QUICK ACTIONS
          </div>
          <div className="space-y-1 text-xs">
            <button
              type="button"
              onClick={() => setModalAction('Early Warning Bulletin issued to District Collectorates.')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-800 text-slate-700 transition text-left"
            >
              <Send className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Send Early Warning</span>
            </button>
            <button
              type="button"
              onClick={() => setModalAction('Emergency siren broadcast staged for 18 riparian wards.')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-800 text-slate-700 transition text-left"
            >
              <Volume2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Broadcast Alert</span>
            </button>
            <Link
              href="/portal/shelters"
              className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-800 text-slate-700 transition text-left"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Update Evacuation Plan</span>
            </Link>
            <Link
              href="/data-flow"
              className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-800 text-blue-900 bg-blue-50/60 font-bold transition text-left"
            >
              <Database className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span>How Data is Given (Architecture)</span>
            </Link>
            <Link
              href="/portal/report"
              className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-800 text-slate-700 transition text-left"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Add Field Report</span>
            </Link>
          </div>
        </div>

        {/* SECTION 3: EMERGENCY CONTACTS */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 px-2.5">
            EMERGENCY CONTACTS
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-800">
              <PhoneCall className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <div className="flex-1">
                <div className="text-[10px] text-slate-500">NDRF Control Room</div>
                <a href="tel:01124363260" className="font-mono font-bold text-slate-900 hover:underline">
                  011-24363260
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-800">
              <PhoneCall className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <div className="flex-1">
                <div className="text-[10px] text-slate-500">SDRF Control Room</div>
                <a href="tel:1070" className="font-mono font-bold text-slate-900 hover:underline">
                  1070
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-800">
              <PhoneCall className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <div className="flex-1">
                <div className="text-[10px] text-slate-500">Police Control Room</div>
                <a href="tel:112" className="font-mono font-bold text-slate-900 hover:underline">
                  112
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-red-100/60 p-1.5 rounded border border-red-200">
              <PhoneCall className="w-3.5 h-3.5 text-red-700 animate-pulse shrink-0" />
              <div className="flex-1">
                <div className="text-[9px] uppercase font-bold text-red-700">National Emergency No.</div>
                <a href="tel:112" className="font-mono font-black text-sm text-red-900">
                  112
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA (6 KPI CARDS + MAP + RECENT ALERTS + BOTTOM 3 TILES) ── */}
      <div className="flex-1 p-4 sm:p-5 space-y-4 overflow-y-auto">
        {/* ── GOV BENCHMARK PILLAR VIEW TABS ── */}
        <div className="bg-white border border-slate-200 rounded p-1.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 px-2">
              Gov Desk Views:
            </span>
            <button
              type="button"
              onClick={() => setPortalView('ALL')}
              className={`px-3 py-1.5 rounded font-semibold text-xs transition cursor-pointer ${
                portalView === 'ALL'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              All Integrated Desk
            </button>
            <button
              type="button"
              onClick={() => setPortalView('DATA_FLOW')}
              className={`px-3 py-1.5 rounded font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                portalView === 'DATA_FLOW'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>How Data Is Given</span>
              <span className="bg-cyan-500 text-slate-950 font-mono text-[9px] px-1.5 py-0.2 rounded font-black">
                FORMATS
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPortalView('PIPELINE')}
              className={`px-3 py-1.5 rounded font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                portalView === 'PIPELINE'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>9-Stage Prediction Pipeline</span>
              <span className="bg-blue-600 text-white font-mono text-[9px] px-1.5 py-0.2 rounded font-black">
                CORE
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPortalView('OPERATIONS')}
              className={`px-3 py-1.5 rounded font-semibold text-xs transition cursor-pointer ${
                portalView === 'OPERATIONS'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              MHA NDMIS &amp; NDRF Operations
            </button>
            <button
              type="button"
              onClick={() => setPortalView('OVERVIEW')}
              className={`px-3 py-1.5 rounded font-semibold text-xs transition cursor-pointer ${
                portalView === 'OVERVIEW'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              District Situation &amp; Map
            </button>
          </div>

          <div className="flex items-center gap-2 pr-2 text-[11px] font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NDMA SACHET · MHA NDMIS · NDRF · NDEM Active</span>
          </div>
        </div>

        {/* ── SACHET BILINGUAL OASIS CAP v1.2 ALERT BANNER ── */}
        <SachetAlertBanner district={selectedDistrict} state={hierarchy.state || 'Uttarakhand'} severity="RED" />

        {/* ── HOW DATA IS GIVEN (DATA ARCHITECTURE & MULTI-SOURCE INGESTION) ── */}
        {(portalView === 'ALL' || portalView === 'DATA_FLOW') && (
          <DataArchitectureFlow />
        )}

        {/* ── 9-STAGE PHYSICAL PREDICTION PIPELINE (SIH26192) ── */}
        {(portalView === 'ALL' || portalView === 'PIPELINE') && (
          <PipelineVisualizer />
        )}

        {/* ROW 1: TOP 6 METRIC CARDS */}
        {(portalView === 'ALL' || portalView === 'OVERVIEW') && (
        <>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {/* Card 1: Active Alerts */}
          <div className="bg-white border border-slate-200 rounded p-3 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600">
                ACTIVE ALERTS
              </div>
              <div className="text-2xl font-black text-red-600 font-mono mt-0.5">
                12
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                High Risk Villages/Wards
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: At Risk Population */}
          <div className="bg-white border border-slate-200 rounded p-3 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600">
                AT RISK POPULATION
              </div>
              <div className="text-2xl font-black text-amber-600 font-mono mt-0.5">
                28,450
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                People
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Rainfall 24h */}
          <div className="bg-white border border-slate-200 rounded p-3 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700">
                RAINFALL (24 HRS)
              </div>
              <div className="text-2xl font-black text-blue-800 font-mono mt-0.5">
                212.4 <span className="text-xs font-normal">mm</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Average
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>

          {/* Card 4: Soil Moisture */}
          <div className="bg-white border border-slate-200 rounded p-3 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                SOIL MOISTURE
              </div>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                78%
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Average
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
          </div>

          {/* Card 5: Slope Stability */}
          <div className="bg-white border border-slate-200 rounded p-3 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700">
                SLOPE STABILITY
              </div>
              <div className="text-2xl font-black text-purple-800 font-serif mt-0.5">
                Unstable
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                18 Locations
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Mountain className="w-4 h-4" />
            </div>
          </div>

          {/* Card 6: IoT Sensors */}
          <div className="bg-white border border-slate-200 rounded p-3 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-700">
                IoT SENSORS
              </div>
              <div className="text-2xl font-black text-cyan-800 font-mono mt-0.5">
                1,256
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Online
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* ROW 2: MIDDLE SPLIT (MAP 58% + RECENT ALERTS 42%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT 7 COLS: RISK MAP - CURRENT SITUATION */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded shadow-xs p-4 flex flex-col justify-between">
            {/* Map Header Controls */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2.5 mb-2">
              <h2 className="text-xs font-bold text-slate-900 tracking-tight uppercase">
                RISK MAP — CURRENT SITUATION
              </h2>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    className="bg-white border border-slate-300 text-xs font-semibold rounded px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    defaultValue="Uttarakhand"
                  >
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Sikkim">Sikkim</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Active Focus: ${currentDistData.name} District (Risk: ${currentDistData.level})`)}
                  className="bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold px-2.5 py-1 rounded transition active:scale-95 shadow-xs cursor-pointer"
                >
                  District View
                </button>
              </div>
            </div>

            {/* NDEM GIS Multi-Layer Toggles */}
            <div className="flex flex-wrap items-center gap-1.5 py-1 px-2 bg-slate-100 rounded text-[10px] font-mono mb-2 border border-slate-200">
              <span className="font-bold text-slate-500 uppercase tracking-wide mr-1">
                NDEM GIS Layers:
              </span>
              <button
                type="button"
                onClick={() => setGisLayers((p) => ({ ...p, inundation: !p.inundation }))}
                className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                  gisLayers.inundation
                    ? 'bg-blue-800 text-white border-blue-900 font-bold shadow-xs'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                🌊 Inundation Extent
              </button>
              <button
                type="button"
                onClick={() => setGisLayers((p) => ({ ...p, slope: !p.slope }))}
                className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                  gisLayers.slope
                    ? 'bg-purple-800 text-white border-purple-900 font-bold shadow-xs'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                ⛰️ Slope &gt;30° (FoS)
              </button>
              <button
                type="button"
                onClick={() => setGisLayers((p) => ({ ...p, drainage: !p.drainage }))}
                className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                  gisLayers.drainage
                    ? 'bg-cyan-800 text-white border-cyan-900 font-bold shadow-xs'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                💧 River Drainage
              </button>
              <button
                type="button"
                onClick={() => setGisLayers((p) => ({ ...p, analogs: !p.analogs }))}
                className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                  gisLayers.analogs
                    ? 'bg-amber-700 text-white border-amber-800 font-bold shadow-xs'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                📜 Historical Analogs
              </button>
            </div>

            {/* Vector Map Canvas (Uttarakhand District Geometry with Zoom Controls) */}
            <div className="relative w-full h-[320px] bg-slate-50 border border-slate-200 rounded overflow-hidden flex items-center justify-center">
              {/* Zoom Buttons (Top Left) */}
              <div className="absolute top-2.5 left-2.5 z-10 bg-white border border-slate-300 rounded shadow-xs flex flex-col overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                  className="p-1.5 hover:bg-slate-100 text-slate-700 border-b border-slate-200"
                  title="Zoom In"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
                  className="p-1.5 hover:bg-slate-100 text-slate-700 border-b border-slate-200"
                  title="Zoom Out"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 hover:bg-slate-100 text-slate-700"
                  title="Reset View"
                  aria-label="Reset zoom"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Schematic Accurate SVG District Representation of Uttarakhand */}
              <svg
                viewBox="0 0 540 300"
                className="w-full h-full cursor-pointer transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
                role="img"
                aria-label="Uttarakhand Flash Flood Risk Map"
              >
                {/* Background terrain relief contours */}
                <path d="M 40,20 Q 200,60 380,30 T 520,70" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3,3" />
                <path d="M 60,80 Q 240,110 400,90 T 500,140" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,3" />

                {/* District Polygons */}
                {/* 1. Dehradun (Low) */}
                <polygon
                  points="50,150 90,130 130,155 120,200 70,210 40,180"
                  fill={selectedDistrict === 'Dehradun' ? '#3b82f6' : '#86efac'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  onClick={() => setSelectedDistrict('Dehradun')}
                  className="transition hover:opacity-80"
                />
                <text x="75" y="175" fontSize="10" fontWeight="600" fill="#1e293b">Dehradun</text>

                {/* 2. Uttarkashi (VERY HIGH - Red) */}
                <polygon
                  points="110,50 190,30 240,70 210,120 150,135 100,105"
                  fill={selectedDistrict === 'Uttarkashi' ? '#b91c1c' : '#ef4444'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  onClick={() => setSelectedDistrict('Uttarkashi')}
                  className="transition hover:opacity-80"
                />
                <text x="145" y="80" fontSize="11" fontWeight="bold" fill="#ffffff">Uttarkashi</text>

                {/* 3. Tehri Garhwal (HIGH - Orange) */}
                <polygon
                  points="130,135 210,120 220,165 170,185 125,160"
                  fill={selectedDistrict === 'Tehri' ? '#c2410c' : '#fb923c'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  onClick={() => setSelectedDistrict('Tehri')}
                  className="transition hover:opacity-80"
                />
                <text x="145" y="155" fontSize="10" fontWeight="bold" fill="#ffffff">Tehri Garhwal</text>

                {/* 4. Rudraprayag (VERY HIGH - Red) */}
                <polygon
                  points="210,110 255,100 270,145 225,155"
                  fill={selectedDistrict === 'Rudraprayag' ? '#991b1b' : '#dc2626'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  onClick={() => setSelectedDistrict('Rudraprayag')}
                  className="transition hover:opacity-80"
                />
                <text x="215" y="130" fontSize="9" fontWeight="bold" fill="#ffffff">Rudraprayag</text>

                {/* 5. Chamoli (HIGH - Orange) */}
                <polygon
                  points="240,60 360,40 370,125 310,150 255,120"
                  fill={selectedDistrict === 'Chamoli' ? '#c2410c' : '#f97316'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  onClick={() => setSelectedDistrict('Chamoli')}
                  className="transition hover:opacity-80"
                />
                <text x="285" y="95" fontSize="11" fontWeight="bold" fill="#ffffff">Chamoli</text>

                {/* 6. Pauri Garhwal (MODERATE - Yellow) */}
                <polygon
                  points="170,185 240,165 260,225 180,240 140,205"
                  fill={selectedDistrict === 'Pauri' ? '#b45309' : '#facc15'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  onClick={() => setSelectedDistrict('Pauri')}
                  className="transition hover:opacity-80"
                />
                <text x="185" y="205" fontSize="10" fontWeight="bold" fill="#422006">Pauri Garhwal</text>

                {/* 7. Bageshwar (MODERATE - Amber) */}
                <polygon
                  points="310,140 360,130 375,175 320,185"
                  fill={selectedDistrict === 'Bageshwar' ? '#92400e' : '#f59e0b'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  onClick={() => setSelectedDistrict('Bageshwar')}
                  className="transition hover:opacity-80"
                />
                <text x="325" y="165" fontSize="9" fontWeight="bold" fill="#ffffff">Bageshwar</text>

                {/* 8. Pithoragarh (LOW - Light Green) */}
                <polygon
                  points="360,40 460,50 480,160 380,170 365,110"
                  fill={selectedDistrict === 'Pithoragarh' ? '#166534' : '#4ade80'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  onClick={() => setSelectedDistrict('Pithoragarh')}
                  className="transition hover:opacity-80"
                />
                <text x="395" y="115" fontSize="11" fontWeight="bold" fill="#064e3b">Pithoragarh</text>

                {/* 9. Almora (LOW - Green) */}
                <polygon
                  points="265,185 330,180 340,230 270,240"
                  fill={selectedDistrict === 'Almora' ? '#166534' : '#86efac'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  onClick={() => setSelectedDistrict('Almora')}
                  className="transition hover:opacity-80"
                />
                <text x="285" y="215" fontSize="10" fontWeight="bold" fill="#14532d">Almora</text>

                {/* Active Hazard Node Markers */}
                {/* Dharali Pin */}
                <g transform="translate(175, 75)">
                  <circle cx="0" cy="0" r="10" fill="#ffffff" fillOpacity="0.4" className="animate-ping" />
                  <circle cx="0" cy="0" r="6" fill="#991b1b" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">!</text>
                </g>

                {/* Rudraprayag Pin */}
                <g transform="translate(240, 135)">
                  <circle cx="0" cy="0" r="8" fill="#ffffff" fillOpacity="0.4" className="animate-ping" />
                  <circle cx="0" cy="0" r="5" fill="#991b1b" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="0" y="2.5" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold">!</text>
                </g>

                {/* Chamoli Pin */}
                <g transform="translate(325, 110)">
                  <circle cx="0" cy="0" r="6" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="0" y="2" textAnchor="middle" fill="#ffffff" fontSize="5" fontWeight="bold">!</text>
                </g>

                {/* ── NDEM SATELLITE & DISASTER INTELLIGENCE LAYERS (NRSC/ISRO) ── */}
                {gisLayers.inundation && (
                  <g id="ndem-inundation-layer">
                    {/* Inundation zone along riverbeds */}
                    <path
                      d="M 120,70 Q 150,110 180,130 T 250,140"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="14"
                      strokeOpacity="0.4"
                      className="animate-pulse"
                    />
                    <path
                      d="M 270,75 Q 310,105 340,120"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="14"
                      strokeOpacity="0.4"
                      className="animate-pulse"
                    />
                    <ellipse cx="160" cy="115" rx="22" ry="12" fill="#38bdf8" fillOpacity="0.6" stroke="#0284c7" strokeWidth="1" />
                    <ellipse cx="305" cy="102" rx="28" ry="16" fill="#38bdf8" fillOpacity="0.6" stroke="#0284c7" strokeWidth="1" />
                    <text x="305" y="105" textAnchor="middle" fill="#0369a1" fontSize="6.5" fontWeight="bold" fontFamily="monospace">
                      Depth: 1.8m
                    </text>
                    <text x="160" y="118" textAnchor="middle" fill="#0369a1" fontSize="6" fontWeight="bold" fontFamily="monospace">
                      Depth: 2.4m
                    </text>
                  </g>
                )}

                {gisLayers.slope && (
                  <g id="ndem-slope-layer">
                    {/* CartoDEM Slope >30° geotechnical danger polygons */}
                    <polygon
                      points="120,55 155,45 170,75 135,85"
                      fill="#a855f7"
                      fillOpacity="0.35"
                      stroke="#7e22ce"
                      strokeWidth="1.2"
                      strokeDasharray="3,2"
                    />
                    <polygon
                      points="265,65 315,50 330,85 285,100"
                      fill="#a855f7"
                      fillOpacity="0.35"
                      stroke="#7e22ce"
                      strokeWidth="1.2"
                      strokeDasharray="3,2"
                    />
                    <text x="145" y="65" textAnchor="middle" fill="#6b21a8" fontSize="6" fontWeight="bold" fontFamily="monospace">
                      DEM Slope 34° (FoS 1.04)
                    </text>
                    <text x="300" y="72" textAnchor="middle" fill="#6b21a8" fontSize="6" fontWeight="bold" fontFamily="monospace">
                      DEM Slope 31° (FoS 1.08)
                    </text>
                  </g>
                )}

                {gisLayers.drainage && (
                  <g id="ndem-drainage-network">
                    {/* River mainstems and tributaries */}
                    <path d="M 115,40 Q 140,80 160,130 T 170,185 T 150,230" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                    <path d="M 330,45 Q 310,90 280,120 T 235,160 T 170,185" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                    <path d="M 235,105 Q 240,130 235,160" fill="none" stroke="#0ea5e9" strokeWidth="1.8" strokeDasharray="4,2" />
                    <text x="120" y="68" fill="#1d4ed8" fontSize="6.5" fontWeight="bold">Bhagirathi</text>
                    <text x="310" y="58" fill="#1d4ed8" fontSize="6.5" fontWeight="bold">Alaknanda</text>
                    <text x="245" y="125" fill="#0284c7" fontSize="5.5" fontWeight="bold">Mandakini</text>
                  </g>
                )}

                {gisLayers.analogs && (
                  <g id="ndem-historical-analogs">
                    {/* 2013 Kedarnath Marker */}
                    <circle cx="235" cy="105" r="4.5" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="235" y="98" textAnchor="middle" fill="#991b1b" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
                      ★ 2013 Kedarnath
                    </text>

                    {/* 2021 Chamoli GLOF Marker */}
                    <circle cx="340" cy="80" r="4.5" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="340" y="73" textAnchor="middle" fill="#c2410c" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
                      ★ 2021 Chamoli GLOF
                    </text>
                  </g>
                )}
              </svg>

              {/* Floating Legend (Bottom Left) */}
              <div className="absolute bottom-2 left-2 bg-white/95 border border-slate-300 rounded p-2 text-[10px] space-y-1 shadow-xs font-medium">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[9px] mb-0.5">
                  Risk Level
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                  <span>Very High</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                  <span>High</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#facc15]" />
                  <span>Moderate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#86efac]" />
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e2e8f0]" />
                  <span>No Risk</span>
                </div>
              </div>

              {/* Timestamp (Bottom Right) */}
              <div className="absolute bottom-2 right-2 bg-white/90 border border-slate-200 px-2 py-0.5 rounded text-[9px] font-mono text-slate-500">
                Last Updated: 05 Sep 2026 01:20 PM IST
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: RECENT ALERTS TABLE (Matching Reference Image) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded shadow-xs p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <h2 className="text-xs font-bold text-slate-900 tracking-tight uppercase">
                  RECENT ALERTS
                </h2>
                <Link
                  href="/portal/alerts"
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900"
                >
                  View All
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-semibold">
                      <th className="py-1.5 px-2">Alert ID</th>
                      <th className="py-1.5 px-2">Location</th>
                      <th className="py-1.5 px-2">Risk Level</th>
                      <th className="py-1.5 px-2">Type</th>
                      <th className="py-1.5 px-2">Issued At</th>
                      <th className="py-1.5 px-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-2 font-mono font-bold text-slate-800">ALRT-2026-5287</td>
                      <td className="py-2 px-2 font-medium text-slate-900">Dharali, Uttarkashi</td>
                      <td className="py-2 px-2">
                        <span className="bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          Very High
                        </span>
                      </td>
                      <td className="py-2 px-2 text-slate-600">Flash Flood</td>
                      <td className="py-2 px-2 font-mono text-slate-500 whitespace-nowrap">05 Sep 2026 01:15 PM</td>
                      <td className="py-2 px-2 text-right font-bold text-emerald-600">Active</td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-2 font-mono font-bold text-slate-800">ALRT-2026-5286</td>
                      <td className="py-2 px-2 font-medium text-slate-900">Bhatwari, Uttarkashi</td>
                      <td className="py-2 px-2">
                        <span className="bg-orange-100 text-orange-800 border border-orange-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          High
                        </span>
                      </td>
                      <td className="py-2 px-2 text-slate-600">Flash Flood</td>
                      <td className="py-2 px-2 font-mono text-slate-500 whitespace-nowrap">05 Sep 2026 01:10 PM</td>
                      <td className="py-2 px-2 text-right font-bold text-emerald-600">Active</td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-2 font-mono font-bold text-slate-800">ALRT-2026-5285</td>
                      <td className="py-2 px-2 font-medium text-slate-900">Rudraprayag</td>
                      <td className="py-2 px-2">
                        <span className="bg-orange-100 text-orange-800 border border-orange-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          High
                        </span>
                      </td>
                      <td className="py-2 px-2 text-slate-600">Flash Flood</td>
                      <td className="py-2 px-2 font-mono text-slate-500 whitespace-nowrap">05 Sep 2026 01:05 PM</td>
                      <td className="py-2 px-2 text-right font-bold text-emerald-600">Active</td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-2 font-mono font-bold text-slate-800">ALRT-2026-5284</td>
                      <td className="py-2 px-2 font-medium text-slate-900">Joshimath, Chamoli</td>
                      <td className="py-2 px-2">
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          Moderate
                        </span>
                      </td>
                      <td className="py-2 px-2 text-slate-600">Landslide</td>
                      <td className="py-2 px-2 font-mono text-slate-500 whitespace-nowrap">05 Sep 2026 12:50 PM</td>
                      <td className="py-2 px-2 text-right font-bold text-emerald-600">Active</td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-2 font-mono font-bold text-slate-800">ALRT-2026-5283</td>
                      <td className="py-2 px-2 font-medium text-slate-900">Pauri Garhwal</td>
                      <td className="py-2 px-2">
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          Moderate
                        </span>
                      </td>
                      <td className="py-2 px-2 text-slate-600">Flash Flood</td>
                      <td className="py-2 px-2 font-mono text-slate-500 whitespace-nowrap">05 Sep 2026 12:45 PM</td>
                      <td className="py-2 px-2 text-right font-bold text-amber-600">Monitoring</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Showing 5 of 12 active alerts</span>
              <Link href="/portal/alerts" className="text-blue-700 font-bold hover:underline">
                Open Complete Alert Ledger →
              </Link>
            </div>
          </div>
        </div>

        {/* ROW 3: BOTTOM 3 CARDS (RAINFALL TREND + DATA SOURCE STATUS + PREDICTION SUMMARY) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* BOTTOM CARD 1: RAINFALL TREND (mm) */}
          <div className="bg-white border border-slate-200 rounded shadow-xs p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <h2 className="text-xs font-bold text-slate-900 tracking-tight uppercase">
                  RAINFALL TREND (mm)
                </h2>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-1 bg-blue-600" />
                    <span>Actual</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 border-b-2 border-dotted border-blue-500" />
                    <span>Forecast</span>
                  </div>
                </div>
              </div>

              {/* SVG Rainfall Trend Chart */}
              <div className="w-full h-44 pt-2">
                <svg viewBox="0 0 320 150" className="w-full h-full" role="img" aria-label="Rainfall Trend Bar Chart">
                  {/* Grid horizontal lines */}
                  <line x1="30" y1="20" x2="310" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="50" x2="310" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="80" x2="310" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="110" x2="310" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="30" y1="130" x2="310" y2="130" stroke="#cbd5e1" strokeWidth="1" />

                  {/* Y-axis Labels */}
                  <text x="24" y="23" textAnchor="end" fontSize="8" fill="#94a3b8" fontFamily="monospace">250</text>
                  <text x="24" y="53" textAnchor="end" fontSize="8" fill="#94a3b8" fontFamily="monospace">200</text>
                  <text x="24" y="83" textAnchor="end" fontSize="8" fill="#94a3b8" fontFamily="monospace">150</text>
                  <text x="24" y="113" textAnchor="end" fontSize="8" fill="#94a3b8" fontFamily="monospace">100</text>
                  <text x="24" y="133" textAnchor="end" fontSize="8" fill="#94a3b8" fontFamily="monospace">0</text>

                  {/* Actual Bars */}
                  {/* Bar 1: 05 Sep 01 AM */}
                  <rect x="45" y="115" width="10" height="15" fill="#3b82f6" rx="1" />
                  {/* Bar 2: 03 AM */}
                  <rect x="68" y="105" width="10" height="25" fill="#3b82f6" rx="1" />
                  {/* Bar 3: 05 AM */}
                  <rect x="91" y="90" width="10" height="40" fill="#3b82f6" rx="1" />
                  {/* Bar 4: 07 AM */}
                  <rect x="114" y="80" width="10" height="50" fill="#3b82f6" rx="1" />
                  {/* Bar 5: 09 AM */}
                  <rect x="137" y="65" width="10" height="65" fill="#3b82f6" rx="1" />
                  {/* Bar 6: 11 AM */}
                  <rect x="160" y="50" width="10" height="80" fill="#3b82f6" rx="1" />
                  {/* Bar 7: 01 PM */}
                  <rect x="183" y="38" width="10" height="92" fill="#2563eb" rx="1" />

                  {/* Dotted Forecast Polyline */}
                  <path
                    d="M 188,38 Q 230,22 260,35 T 300,55"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2"
                    strokeDasharray="4,3"
                  />
                  <circle cx="235" cy="24" r="3" fill="#0284c7" />
                  <circle cx="270" cy="38" r="3" fill="#0284c7" />

                  {/* X-axis Timestamps */}
                  <text x="50" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">05 Sep 01 AM</text>
                  <text x="115" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">05 Sep 07 AM</text>
                  <text x="185" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">05 Sep 01 PM</text>
                  <text x="245" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">05 Sep 07 PM</text>
                  <text x="295" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">06 Sep 01 AM</text>
                </svg>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500">
              Peak intensity observed at <strong>Joshimath AWS (48 mm/3h)</strong>
            </div>
          </div>

          {/* BOTTOM CARD 2: DATA SOURCE STATUS */}
          <div className="bg-white border border-slate-200 rounded shadow-xs p-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-200 pb-2 mb-2">
                <h2 className="text-xs font-bold text-slate-900 tracking-tight uppercase">
                  DATA SOURCE STATUS
                </h2>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* 1. Rainfall Stations */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                    <span>Rainfall Stations</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-600 font-bold">156 / 162</span>
                    <span className="text-emerald-600 font-bold">Online</span>
                  </div>
                </div>

                {/* 2. Soil Moisture Sensors */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Droplets className="w-3.5 h-3.5 text-blue-600" />
                    <span>Soil Moisture Sensors</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-600 font-bold">842 / 910</span>
                    <span className="text-emerald-600 font-bold">Online</span>
                  </div>
                </div>

                {/* 3. IoT Water Level Sensors */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    <span>IoT Water Level Sensors</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-600 font-bold">216 / 230</span>
                    <span className="text-emerald-600 font-bold">Online</span>
                  </div>
                </div>

                {/* 4. AWS */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Radio className="w-3.5 h-3.5 text-blue-600" />
                    <span>Automatic Weather Stations</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-600 font-bold">58 / 62</span>
                    <span className="text-emerald-600 font-bold">Online</span>
                  </div>
                </div>

                {/* 5. Satellite Data Feed */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Satellite Data Feed</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-600 font-bold">Active</span>
                    <span className="text-emerald-600 font-bold">Online</span>
                  </div>
                </div>

                {/* 6. Historical Data */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Historical Data</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-600 font-bold">Updated</span>
                    <span className="text-emerald-600 font-bold">Online</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span>National Sensor Mesh: <strong>94.2% Operational</strong></span>
              <Link href="/sensors" className="text-blue-700 font-bold hover:underline">
                Sensors Hub →
              </Link>
            </div>
          </div>

          {/* BOTTOM CARD 3: PREDICTION SUMMARY */}
          <div className="bg-white border border-slate-200 rounded shadow-xs p-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-200 pb-2 mb-2">
                <h2 className="text-xs font-bold text-slate-900 tracking-tight uppercase">
                  PREDICTION SUMMARY
                </h2>
              </div>

              {/* Red Callout Box Matching Reference Image */}
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-3 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Home className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-red-950 leading-snug">
                    Very High flash flood risk predicted in Dharali, Harsil &amp; surrounding areas
                  </div>
                  <span className="inline-block text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                    Next 6 Hours
                  </span>
                </div>
              </div>

              {/* Prediction Metrics List */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Prediction Window</span>
                    <span className="font-mono text-slate-900 font-semibold text-[11px]">
                      05 Sep 2026 01:00 PM — 05 Sep 2026 07:00 PM
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Model Confidence</span>
                    <span className="font-mono text-blue-900 font-bold text-[11px]">
                      85% (Calibrated Ensemble v2.4)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-slate-700">
                  <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Primary Factors</span>
                    <div className="flex flex-wrap gap-1.5 mt-1 text-[10px]">
                      <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
                        🌧️ Heavy Rainfall
                      </span>
                      <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
                        💧 High Soil Moisture
                      </span>
                      <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
                        ⛰️ Unstable Slopes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-mono">Lead Time: 24 mins</span>
              <Link href="/portal/alerts" className="text-red-700 font-bold hover:underline flex items-center gap-1">
                <span>View Full Protocol</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
        </>
        )}

        {/* ── MHA NDMIS & NDRF TACTICAL OPERATIONS (Theme 4 Benchmark) ── */}
        {(portalView === 'ALL' || portalView === 'OPERATIONS') && (
          <div className="space-y-4 pt-1">
            <NdmisReportCard />
            <NdrfDeploymentCard />
          </div>
        )}
      </div>

      {/* Action Notification Modal */}
      {modalAction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded shadow-xl max-w-md w-full p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Operation Queued Successfully</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {modalAction}
            </p>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono text-slate-600">
              Audit Hash: 0x9f82...7b31 · Status: DISPATCH_QUEUED
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setModalAction(null)}
                className="bg-slate-900 text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
