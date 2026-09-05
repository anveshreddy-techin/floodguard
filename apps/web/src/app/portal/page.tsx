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
  RefreshCw,
  X,
  Filter
} from 'lucide-react';

interface DistrictRisk {
  name: string;
  level: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW' | 'NO_RISK';
  color: string;
  population: string;
  rainfall: string;
  soilMoisture: string;
  slopeRisk: string;
  activeSensors: number;
}

const UTTARAKHAND_DISTRICTS: Record<string, DistrictRisk> = {
  Uttarkashi: { name: 'Uttarkashi', level: 'VERY_HIGH', color: '#ef4444', population: '330,000', rainfall: '245 mm', soilMoisture: '86%', slopeRisk: 'Critical (FoS 1.02)', activeSensors: 24 },
  Rudraprayag: { name: 'Rudraprayag', level: 'VERY_HIGH', color: '#dc2626', population: '242,000', rainfall: '210 mm', soilMoisture: '84%', slopeRisk: 'Critical (FoS 1.04)', activeSensors: 18 },
  Chamoli: { name: 'Chamoli', level: 'HIGH', color: '#f97316', population: '391,000', rainfall: '185 mm', soilMoisture: '79%', slopeRisk: 'High (FoS 1.12)', activeSensors: 32 },
  Tehri: { name: 'Tehri Garhwal', level: 'HIGH', color: '#fb923c', population: '618,000', rainfall: '160 mm', soilMoisture: '75%', slopeRisk: 'High (FoS 1.15)', activeSensors: 22 },
  Bageshwar: { name: 'Bageshwar', level: 'MODERATE', color: '#f59e0b', population: '259,000', rainfall: '110 mm', soilMoisture: '68%', slopeRisk: 'Moderate (FoS 1.28)', activeSensors: 14 },
  Pauri: { name: 'Pauri Garhwal', level: 'MODERATE', color: '#facc15', population: '687,000', rainfall: '95 mm', soilMoisture: '62%', slopeRisk: 'Moderate (FoS 1.32)', activeSensors: 28 },
  Pithoragarh: { name: 'Pithoragarh', level: 'LOW', color: '#86efac', population: '483,000', rainfall: '45 mm', soilMoisture: '51%', slopeRisk: 'Stable (FoS 1.55)', activeSensors: 20 },
  Almora: { name: 'Almora', level: 'LOW', color: '#4ade80', population: '622,000', rainfall: '35 mm', soilMoisture: '46%', slopeRisk: 'Stable (FoS 1.62)', activeSensors: 16 },
  Dehradun: { name: 'Dehradun', level: 'LOW', color: '#86efac', population: '1,696,000', rainfall: '28 mm', soilMoisture: '42%', slopeRisk: 'Stable (FoS 1.70)', activeSensors: 45 },
};

interface AlertItem {
  id: string;
  location: string;
  district: string;
  riskLevel: 'VERY_HIGH' | 'HIGH' | 'MODERATE';
  type: string;
  issuedAt: string;
  leadTime: string;
  status: 'Active' | 'Monitoring';
  trigger: string;
  action: string;
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALRT-2026-5287',
    location: 'Dharali / Harsil Ward',
    district: 'Uttarkashi',
    riskLevel: 'VERY_HIGH',
    type: 'Flash Flood Surge',
    issuedAt: '05 Sep 2026 01:15 PM',
    leadTime: '24 mins',
    status: 'Active',
    trigger: 'Orographic burst (48mm/3h) + Saturated debris mantle',
    action: 'Immediate vertical evacuation to Dharali Community Shelter (+120m).'
  },
  {
    id: 'ALRT-2026-5286',
    location: 'Bhatwari Confluence',
    district: 'Uttarkashi',
    riskLevel: 'HIGH',
    type: 'Flash Flood Watch',
    issuedAt: '05 Sep 2026 01:10 PM',
    leadTime: '45 mins',
    status: 'Active',
    trigger: 'Bhagirathi river stage rising at +0.38m/h',
    action: 'Clear low-lying riverbank agricultural workers and livestock.'
  },
  {
    id: 'ALRT-2026-5285',
    location: 'Rudraprayag Sangam',
    district: 'Rudraprayag',
    riskLevel: 'HIGH',
    type: 'River Surge Warning',
    issuedAt: '05 Sep 2026 01:05 PM',
    leadTime: '35 mins',
    status: 'Active',
    trigger: 'Mandakini surge wave arriving from upstream catchment',
    action: 'Cordon off pedestrian suspension bridges and low ghats.'
  },
  {
    id: 'ALRT-2026-5284',
    location: 'Joshimath / Raini Corridor',
    district: 'Chamoli',
    riskLevel: 'MODERATE',
    type: 'Debris Flow Advisory',
    issuedAt: '05 Sep 2026 12:50 PM',
    leadTime: '60 mins',
    status: 'Active',
    trigger: 'Geophone acoustic threshold exceeded at Dhauliganga culvert',
    action: 'Pre-position SDRF rescue boats and drone aerial reconnaissance.'
  },
  {
    id: 'ALRT-2026-5283',
    location: 'Srinagar Low Bank',
    district: 'Pauri Garhwal',
    riskLevel: 'MODERATE',
    type: 'Reservoir Inflow Advisory',
    issuedAt: '05 Sep 2026 12:45 PM',
    leadTime: '90 mins',
    status: 'Monitoring',
    trigger: 'Dam spillway flow rate increased to 450 m³/s',
    action: 'Alert downstream ward councilors via automated SMS.'
  },
];

export default function PublicPortalDashboardPage() {
  const { hierarchy } = useAdaptive();

  // Selected district & state
  const [selectedState, setSelectedState] = useState<string>('Uttarakhand');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Uttarkashi');
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [portalView, setPortalView] = useState<'ALL' | 'OVERVIEW' | 'DATA_FLOW' | 'PIPELINE' | 'OPERATIONS'>('ALL');
  
  // Alert filtering & interaction
  const [alertFilter, setAlertFilter] = useState<'ALL' | 'VERY_HIGH' | 'HIGH' | 'MODERATE'>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  // Rainfall trend timeframe
  const [rainfallTimeframe, setRainfallTimeframe] = useState<'24H' | '48H' | '7D'>('24H');
  
  // Interactive Modal States
  const [modalEarlyWarningOpen, setModalEarlyWarningOpen] = useState(false);
  const [modalBroadcastOpen, setModalBroadcastOpen] = useState(false);
  const [modalFieldReportOpen, setModalFieldReportOpen] = useState(false);
  const [modalDistrictDossierOpen, setModalDistrictDossierOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [isSyncingFeeds, setIsSyncingFeeds] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('05 Sep 2026 01:25 PM IST');

  // Multi-layer toggles
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

  const filteredAlerts = INITIAL_ALERTS.filter(alert => {
    if (alertFilter === 'ALL') return true;
    return alert.riskLevel === alertFilter;
  });

  // Data source refresh simulation
  const handleRefreshFeeds = () => {
    setIsSyncingFeeds(true);
    setTimeout(() => {
      setIsSyncingFeeds(false);
      setLastUpdatedTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST (Real-Time Synchronized)');
      setActionSuccessMsg('Successfully synchronized 1,256 IoT telemetry nodes, IMD AWS radar grids, and CWC telemetry streams.');
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-130px)] bg-[#f0f3f7] select-none text-slate-900 font-sans">
      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-full lg:w-64 bg-white border-r border-slate-200 shrink-0 p-3 space-y-5 shadow-xs">
        {/* SECTION 1: MAIN MENU */}
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1.5 flex items-center justify-between">
            <span>MAIN MENU</span>
            <span className="text-[9px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-bold">PORTAL</span>
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
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-800 font-bold border-l-4 border-blue-700 shadow-xs'
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

        {/* SECTION 2: QUICK ACTIONS (ALL 100% FUNCTIONAL) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1.5 flex items-center justify-between">
            <span>QUICK ACTIONS</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-1 text-xs">
            <button
              type="button"
              onClick={() => setModalEarlyWarningOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50/70 hover:bg-blue-100/80 text-blue-900 font-bold border border-blue-200/80 transition text-left cursor-pointer active:scale-98 shadow-xs"
            >
              <Send className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span>Send Early Warning</span>
            </button>
            <button
              type="button"
              onClick={() => setModalBroadcastOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-50 hover:text-red-900 text-slate-700 transition text-left cursor-pointer active:scale-98"
            >
              <Volume2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>Broadcast Siren Alert</span>
            </button>
            <Link
              href="/portal/shelters"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 transition text-left cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Evacuation Shelters &amp; Routes</span>
            </Link>
            <Link
              href="/data-flow"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-cyan-50 hover:text-cyan-900 text-slate-700 transition text-left cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
              <span>How Data is Given (Architecture)</span>
            </Link>
            <button
              type="button"
              onClick={() => setModalFieldReportOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 text-slate-700 transition text-left cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Submit Ground Field Report</span>
            </button>
          </div>
        </div>

        {/* SECTION 3: EMERGENCY CONTACTS */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 px-2.5">
            EMERGENCY 24x7 HELPLINES
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-800">
              <PhoneCall className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <div className="flex-1">
                <div className="text-[10px] text-slate-500">NDRF National Control Room</div>
                <a href="tel:01124363260" className="font-mono font-bold text-slate-900 hover:underline">
                  011-24363260
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-800">
              <PhoneCall className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <div className="flex-1">
                <div className="text-[10px] text-slate-500">Uttarakhand SDRF SEOC</div>
                <a href="tel:1070" className="font-mono font-bold text-slate-900 hover:underline">
                  1070 / 0135-2710334
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-red-100/70 p-2 rounded-lg border border-red-300">
              <PhoneCall className="w-4 h-4 text-red-700 animate-bounce shrink-0" />
              <div className="flex-1">
                <div className="text-[9px] uppercase font-bold text-red-800">National Emergency Response</div>
                <a href="tel:112" className="font-mono font-black text-sm text-red-950 hover:underline">
                  DIAL 112 (TOLL-FREE)
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 p-4 sm:p-5 space-y-4 overflow-y-auto">
        {/* Success / Feedback Toast Banner */}
        {actionSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button
              onClick={() => setActionSuccessMsg(null)}
              className="text-emerald-700 hover:text-emerald-950 p-1 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* ── GOV DESK VIEW TABS ── */}
        <div className="bg-white border border-slate-200 rounded-xl p-1.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 px-2">
              Gov Desk Views:
            </span>
            <button
              type="button"
              onClick={() => setPortalView('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                portalView === 'ALL'
                  ? 'bg-[#1b3a63] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              All Integrated Desk
            </button>
            <button
              type="button"
              onClick={() => setPortalView('DATA_FLOW')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                portalView === 'DATA_FLOW'
                  ? 'bg-[#1b3a63] text-white shadow-xs'
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
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                portalView === 'PIPELINE'
                  ? 'bg-[#1b3a63] text-white shadow-xs'
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
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                portalView === 'OPERATIONS'
                  ? 'bg-[#1b3a63] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              MHA NDMIS &amp; NDRF Operations
            </button>
            <button
              type="button"
              onClick={() => setPortalView('OVERVIEW')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                portalView === 'OVERVIEW'
                  ? 'bg-[#1b3a63] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              District Situation &amp; Map
            </button>
          </div>

          {/* Real-Time Sync Action */}
          <div className="flex items-center gap-2 pr-2 text-[11px] font-mono text-slate-600">
            <button
              type="button"
              onClick={handleRefreshFeeds}
              disabled={isSyncingFeeds}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold transition cursor-pointer active:scale-95"
              title="Click to fetch latest IMD/CWC/IoT sensor feeds"
            >
              <RefreshCw className={`w-3 h-3 text-blue-700 ${isSyncingFeeds ? 'animate-spin' : ''}`} />
              <span>{isSyncingFeeds ? 'Syncing...' : 'Sync Feeds'}</span>
            </button>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">SACHET · NDMIS · NDRF Live</span>
          </div>
        </div>

        {/* ── SACHET BILINGUAL OASIS CAP v1.2 ALERT BANNER ── */}
        <SachetAlertBanner district={selectedDistrict} state={selectedState} severity="RED" />

        {/* ── HOW DATA IS GIVEN (DATA ARCHITECTURE & MULTI-SOURCE INGESTION) ── */}
        {(portalView === 'ALL' || portalView === 'DATA_FLOW') && (
          <DataArchitectureFlow />
        )}

        {/* ── 9-STAGE PHYSICAL PREDICTION PIPELINE (SIH26192) ── */}
        {(portalView === 'ALL' || portalView === 'PIPELINE') && (
          <PipelineVisualizer />
        )}

        {/* ── ROW 1: TOP 6 METRIC CARDS ── */}
        {(portalView === 'ALL' || portalView === 'OVERVIEW') && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
              {/* Card 1: Active Alerts */}
              <button
                type="button"
                onClick={() => setAlertFilter('ALL')}
                className="bg-white border border-slate-200 hover:border-red-400 rounded-xl p-3 shadow-xs flex items-center justify-between text-left transition hover:shadow-sm cursor-pointer"
              >
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600">
                    ACTIVE ALERTS
                  </div>
                  <div className="text-2xl font-black text-red-600 font-mono mt-0.5">
                    12
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    High Risk Wards
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </button>

              {/* Card 2: At Risk Population */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600">
                    AT RISK POPULATION
                  </div>
                  <div className="text-2xl font-black text-amber-600 font-mono mt-0.5">
                    28,450
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    People Monitored
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
              </div>

              {/* Card 3: Rainfall 24h */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700">
                    RAINFALL (24 HRS)
                  </div>
                  <div className="text-2xl font-black text-blue-800 font-mono mt-0.5">
                    212.4 <span className="text-xs font-normal">mm</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Catchment Average
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <CloudRain className="w-4 h-4" />
                </div>
              </div>

              {/* Card 4: Soil Moisture */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                    SOIL MOISTURE
                  </div>
                  <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                    78%
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Saturation Index
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
              </div>

              {/* Card 5: Slope Stability */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700">
                    SLOPE STABILITY
                  </div>
                  <div className="text-2xl font-black text-purple-800 font-serif mt-0.5">
                    Unstable
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    18 Risk Corridors
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <Mountain className="w-4 h-4" />
                </div>
              </div>

              {/* Card 6: IoT Sensors */}
              <button
                type="button"
                onClick={handleRefreshFeeds}
                className="bg-white border border-slate-200 hover:border-cyan-400 rounded-xl p-3 shadow-xs flex items-center justify-between text-left transition hover:shadow-sm cursor-pointer"
              >
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-700">
                    IoT SENSORS
                  </div>
                  <div className="text-2xl font-black text-cyan-800 font-mono mt-0.5">
                    1,256
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Online &amp; Active</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                  <Radio className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* ── ROW 2: MIDDLE SPLIT (MAP 58% + RECENT ALERTS 42%) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* LEFT 7 COLS: RISK MAP - CURRENT SITUATION */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col justify-between">
                {/* Map Header Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5 mb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold text-slate-900 tracking-tight uppercase font-mono">
                      RISK MAP — CURRENT SITUATION
                    </h2>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded">
                      {currentDistData.name} ({currentDistData.level})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="bg-white border border-slate-300 text-xs font-semibold rounded px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
                    >
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Assam">Assam</option>
                      <option value="Sikkim">Sikkim</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setModalDistrictDossierOpen(true)}
                      className="bg-[#1b3a63] hover:bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded transition active:scale-95 shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <span>District Dossier</span>
                      <ArrowRight className="w-3 h-3" />
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

                {/* Vector Map Canvas (Uttarakhand District Geometry with Interactive Clicks) */}
                <div className="relative w-full h-[320px] bg-slate-50 border border-slate-200 rounded overflow-hidden flex items-center justify-center">
                  {/* Zoom Controls */}
                  <div className="absolute top-2.5 left-2.5 z-10 bg-white border border-slate-300 rounded shadow-xs flex flex-col overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
                      className="p-1.5 hover:bg-slate-100 text-slate-700 border-b border-slate-200 cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                      className="p-1.5 hover:bg-slate-100 text-slate-700 border-b border-slate-200 cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(1)}
                      className="p-1.5 hover:bg-slate-100 text-slate-700 cursor-pointer"
                      title="Reset View"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* SVG District Representation of Uttarakhand */}
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

                    {/* 1. Dehradun */}
                    <polygon
                      points="50,150 90,130 130,155 120,200 70,210 40,180"
                      fill={selectedDistrict === 'Dehradun' ? '#2563eb' : '#86efac'}
                      stroke="#ffffff"
                      strokeWidth={selectedDistrict === 'Dehradun' ? '3' : '1.5'}
                      onClick={() => setSelectedDistrict('Dehradun')}
                      className="transition hover:opacity-80"
                    />
                    <text x="75" y="175" fontSize="10" fontWeight="600" fill={selectedDistrict === 'Dehradun' ? '#ffffff' : '#1e293b'}>Dehradun</text>

                    {/* 2. Uttarkashi (VERY HIGH - Red) */}
                    <polygon
                      points="110,50 190,30 240,70 210,120 150,135 100,105"
                      fill={selectedDistrict === 'Uttarkashi' ? '#991b1b' : '#ef4444'}
                      stroke="#ffffff"
                      strokeWidth={selectedDistrict === 'Uttarkashi' ? '3' : '1.5'}
                      onClick={() => setSelectedDistrict('Uttarkashi')}
                      className="transition hover:opacity-80"
                    />
                    <text x="145" y="80" fontSize="11" fontWeight="bold" fill="#ffffff">Uttarkashi</text>

                    {/* 3. Tehri Garhwal */}
                    <polygon
                      points="130,135 210,120 220,165 170,185 125,160"
                      fill={selectedDistrict === 'Tehri' ? '#c2410c' : '#fb923c'}
                      stroke="#ffffff"
                      strokeWidth={selectedDistrict === 'Tehri' ? '3' : '1.5'}
                      onClick={() => setSelectedDistrict('Tehri')}
                      className="transition hover:opacity-80"
                    />
                    <text x="145" y="155" fontSize="10" fontWeight="bold" fill="#ffffff">Tehri Garhwal</text>

                    {/* 4. Rudraprayag (VERY HIGH) */}
                    <polygon
                      points="210,110 255,100 270,145 225,155"
                      fill={selectedDistrict === 'Rudraprayag' ? '#7f1d1d' : '#dc2626'}
                      stroke="#ffffff"
                      strokeWidth={selectedDistrict === 'Rudraprayag' ? '3' : '1.5'}
                      onClick={() => setSelectedDistrict('Rudraprayag')}
                      className="transition hover:opacity-80"
                    />
                    <text x="215" y="130" fontSize="9" fontWeight="bold" fill="#ffffff">Rudraprayag</text>

                    {/* 5. Chamoli */}
                    <polygon
                      points="240,60 360,40 370,125 310,150 255,120"
                      fill={selectedDistrict === 'Chamoli' ? '#c2410c' : '#f97316'}
                      stroke="#ffffff"
                      strokeWidth={selectedDistrict === 'Chamoli' ? '3' : '1.5'}
                      onClick={() => setSelectedDistrict('Chamoli')}
                      className="transition hover:opacity-80"
                    />
                    <text x="285" y="95" fontSize="11" fontWeight="bold" fill="#ffffff">Chamoli</text>

                    {/* 6. Pauri Garhwal */}
                    <polygon
                      points="170,185 240,165 260,225 180,240 140,205"
                      fill={selectedDistrict === 'Pauri' ? '#b45309' : '#facc15'}
                      stroke="#ffffff"
                      strokeWidth={selectedDistrict === 'Pauri' ? '3' : '1.5'}
                      onClick={() => setSelectedDistrict('Pauri')}
                      className="transition hover:opacity-80"
                    />
                    <text x="185" y="205" fontSize="10" fontWeight="bold" fill="#422006">Pauri Garhwal</text>

                    {/* 7. Bageshwar */}
                    <polygon
                      points="310,140 360,130 375,175 320,185"
                      fill={selectedDistrict === 'Bageshwar' ? '#92400e' : '#f59e0b'}
                      stroke="#ffffff"
                      strokeWidth={selectedDistrict === 'Bageshwar' ? '3' : '1.5'}
                      onClick={() => setSelectedDistrict('Bageshwar')}
                      className="transition hover:opacity-80"
                    />
                    <text x="325" y="165" fontSize="9" fontWeight="bold" fill="#ffffff">Bageshwar</text>

                    {/* 8. Pithoragarh */}
                    <polygon
                      points="360,40 460,50 480,160 380,170 365,110"
                      fill={selectedDistrict === 'Pithoragarh' ? '#166534' : '#4ade80'}
                      stroke="#ffffff"
                      strokeWidth={selectedDistrict === 'Pithoragarh' ? '3' : '1.5'}
                      onClick={() => setSelectedDistrict('Pithoragarh')}
                      className="transition hover:opacity-80"
                    />
                    <text x="395" y="115" fontSize="11" fontWeight="bold" fill="#064e3b">Pithoragarh</text>

                    {/* 9. Almora */}
                    <polygon
                      points="265,185 330,180 340,230 270,240"
                      fill={selectedDistrict === 'Almora' ? '#166534' : '#86efac'}
                      stroke="#ffffff"
                      strokeWidth={selectedDistrict === 'Almora' ? '3' : '1.5'}
                      onClick={() => setSelectedDistrict('Almora')}
                      className="transition hover:opacity-80"
                    />
                    <text x="285" y="215" fontSize="10" fontWeight="bold" fill="#14532d">Almora</text>

                    {/* Dynamic NDEM Layers */}
                    {gisLayers.inundation && (
                      <g id="ndem-inundation-layer">
                        <path d="M 120,70 Q 150,110 180,130 T 250,140" fill="none" stroke="#0284c7" strokeWidth="14" strokeOpacity="0.4" className="animate-pulse" />
                        <path d="M 270,75 Q 310,105 340,120" fill="none" stroke="#0284c7" strokeWidth="14" strokeOpacity="0.4" className="animate-pulse" />
                        <ellipse cx="160" cy="115" rx="22" ry="12" fill="#38bdf8" fillOpacity="0.6" stroke="#0284c7" strokeWidth="1" />
                        <ellipse cx="305" cy="102" rx="28" ry="16" fill="#38bdf8" fillOpacity="0.6" stroke="#0284c7" strokeWidth="1" />
                      </g>
                    )}

                    {gisLayers.drainage && (
                      <g id="ndem-drainage-network">
                        <path d="M 115,40 Q 140,80 160,130 T 170,185 T 150,230" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                        <path d="M 330,45 Q 310,90 280,120 T 235,160 T 170,185" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                        <path d="M 235,105 Q 240,130 235,160" fill="none" stroke="#0ea5e9" strokeWidth="1.8" strokeDasharray="4,2" />
                      </g>
                    )}

                    {gisLayers.analogs && (
                      <g id="ndem-historical-analogs">
                        <circle cx="235" cy="105" r="4.5" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="235" y="98" textAnchor="middle" fill="#991b1b" fontSize="6" fontWeight="bold">★ 2013 Kedarnath</text>
                        <circle cx="340" cy="80" r="4.5" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5" />
                        <text x="340" y="73" textAnchor="middle" fill="#c2410c" fontSize="6" fontWeight="bold">★ 2021 Chamoli GLOF</text>
                      </g>
                    )}
                  </svg>

                  {/* Floating Legend */}
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
                  </div>

                  {/* Timestamp */}
                  <div className="absolute bottom-2 right-2 bg-white/90 border border-slate-200 px-2 py-0.5 rounded text-[9px] font-mono text-slate-500">
                    Last Updated: {lastUpdatedTime}
                  </div>
                </div>
              </div>

              {/* RIGHT 5 COLS: RECENT ALERTS TABLE (WITH FILTERING & CLICKABLE DETAILS) */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                    <h2 className="text-xs font-bold text-slate-900 tracking-tight uppercase font-mono flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      <span>RECENT ALERTS</span>
                    </h2>
                    
                    {/* Severity Filters */}
                    <div className="flex items-center gap-1 text-[10px] font-mono">
                      {(['ALL', 'VERY_HIGH', 'HIGH', 'MODERATE'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setAlertFilter(lvl)}
                          className={`px-1.5 py-0.5 rounded transition cursor-pointer font-bold ${
                            alertFilter === lvl
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {lvl === 'ALL' ? 'ALL' : lvl === 'VERY_HIGH' ? 'RED' : lvl === 'HIGH' ? 'ORANGE' : 'YELLOW'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-semibold">
                          <th className="py-1.5 px-2">Alert ID</th>
                          <th className="py-1.5 px-2">Location</th>
                          <th className="py-1.5 px-2">Risk Level</th>
                          <th className="py-1.5 px-2">Type</th>
                          <th className="py-1.5 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px]">
                        {filteredAlerts.map((alert) => (
                          <tr
                            key={alert.id}
                            onClick={() => setSelectedAlert(alert)}
                            className="hover:bg-blue-50/70 transition cursor-pointer group"
                            title="Click to view official alert dossier and protocol"
                          >
                            <td className="py-2 px-2 font-mono font-bold text-slate-800 group-hover:text-blue-700">
                              {alert.id}
                            </td>
                            <td className="py-2 px-2 font-medium text-slate-900">
                              {alert.location}
                            </td>
                            <td className="py-2 px-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                alert.riskLevel === 'VERY_HIGH'
                                  ? 'bg-red-100 text-red-800 border-red-200'
                                  : alert.riskLevel === 'HIGH'
                                  ? 'bg-orange-100 text-orange-800 border-orange-200'
                                  : 'bg-amber-100 text-amber-800 border-amber-200'
                              }`}>
                                {alert.riskLevel === 'VERY_HIGH' ? 'Very High' : alert.riskLevel === 'HIGH' ? 'High' : 'Moderate'}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-slate-600 truncate max-w-[90px]">
                              {alert.type}
                            </td>
                            <td className="py-2 px-2 text-right font-mono text-[10px] text-blue-700 font-bold group-hover:underline">
                              Inspect →
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Showing {filteredAlerts.length} of {INITIAL_ALERTS.length} active bulletins</span>
                  <Link href="/portal/alerts" className="text-blue-700 font-bold hover:underline">
                    Open Complete Alert Ledger →
                  </Link>
                </div>
              </div>
            </div>

            {/* ── ROW 3: BOTTOM 3 CARDS ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* BOTTOM CARD 1: RAINFALL TREND (INTERACTIVE 24H / 48H / 7D) */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                    <h2 className="text-xs font-bold text-slate-900 tracking-tight uppercase font-mono">
                      RAINFALL TREND (mm)
                    </h2>
                    
                    {/* Timeframe selector */}
                    <div className="flex items-center gap-1 font-mono text-[10px]">
                      {(['24H', '48H', '7D'] as const).map((tf) => (
                        <button
                          key={tf}
                          type="button"
                          onClick={() => setRainfallTimeframe(tf)}
                          className={`px-2 py-0.5 rounded font-bold cursor-pointer transition ${
                            rainfallTimeframe === tf
                              ? 'bg-blue-800 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SVG Rainfall Trend Chart */}
                  <div className="w-full h-44 pt-2">
                    <svg viewBox="0 0 320 150" className="w-full h-full" role="img" aria-label="Rainfall Trend Bar Chart">
                      <line x1="30" y1="20" x2="310" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="30" y1="50" x2="310" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="30" y1="80" x2="310" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="30" y1="110" x2="310" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="30" y1="130" x2="310" y2="130" stroke="#cbd5e1" strokeWidth="1" />

                      <text x="24" y="23" textAnchor="end" fontSize="8" fill="#94a3b8" fontFamily="monospace">250</text>
                      <text x="24" y="53" textAnchor="end" fontSize="8" fill="#94a3b8" fontFamily="monospace">200</text>
                      <text x="24" y="83" textAnchor="end" fontSize="8" fill="#94a3b8" fontFamily="monospace">150</text>
                      <text x="24" y="113" textAnchor="end" fontSize="8" fill="#94a3b8" fontFamily="monospace">100</text>
                      <text x="24" y="133" textAnchor="end" fontSize="8" fill="#94a3b8" fontFamily="monospace">0</text>

                      {rainfallTimeframe === '24H' ? (
                        <>
                          <rect x="45" y="115" width="10" height="15" fill="#3b82f6" rx="1" />
                          <rect x="68" y="105" width="10" height="25" fill="#3b82f6" rx="1" />
                          <rect x="91" y="90" width="10" height="40" fill="#3b82f6" rx="1" />
                          <rect x="114" y="80" width="10" height="50" fill="#3b82f6" rx="1" />
                          <rect x="137" y="65" width="10" height="65" fill="#3b82f6" rx="1" />
                          <rect x="160" y="50" width="10" height="80" fill="#3b82f6" rx="1" />
                          <rect x="183" y="38" width="10" height="92" fill="#2563eb" rx="1" />
                          <path d="M 188,38 Q 230,22 260,35 T 300,55" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,3" />
                          <circle cx="235" cy="24" r="3" fill="#0284c7" />
                          <circle cx="270" cy="38" r="3" fill="#0284c7" />
                          <text x="50" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">01 AM</text>
                          <text x="115" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">07 AM</text>
                          <text x="185" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">01 PM</text>
                          <text x="245" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">07 PM</text>
                          <text x="295" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">01 AM</text>
                        </>
                      ) : rainfallTimeframe === '48H' ? (
                        <>
                          <rect x="40" y="100" width="8" height="30" fill="#3b82f6" rx="1" />
                          <rect x="65" y="85" width="8" height="45" fill="#3b82f6" rx="1" />
                          <rect x="90" y="70" width="8" height="60" fill="#3b82f6" rx="1" />
                          <rect x="115" y="45" width="8" height="85" fill="#3b82f6" rx="1" />
                          <rect x="140" y="35" width="8" height="95" fill="#3b82f6" rx="1" />
                          <rect x="165" y="55" width="8" height="75" fill="#2563eb" rx="1" />
                          <rect x="190" y="75" width="8" height="55" fill="#2563eb" rx="1" />
                          <rect x="215" y="90" width="8" height="40" fill="#2563eb" rx="1" />
                          <text x="65" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">Yesterday</text>
                          <text x="140" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">Today</text>
                          <text x="200" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">Tomorrow</text>
                        </>
                      ) : (
                        <>
                          {[35, 55, 80, 110, 160, 95, 45].map((val, i) => (
                            <rect
                              key={i}
                              x={45 + i * 36}
                              y={130 - val * 0.6}
                              width="16"
                              height={val * 0.6}
                              fill="#2563eb"
                              rx="1.5"
                            />
                          ))}
                          <text x="53" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">Mon</text>
                          <text x="89" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">Tue</text>
                          <text x="125" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">Wed</text>
                          <text x="161" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">Thu</text>
                          <text x="197" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">Fri</text>
                          <text x="233" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">Sat</text>
                          <text x="269" y="143" textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">Sun</text>
                        </>
                      )}
                    </svg>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Peak: <strong>Joshimath AWS (48 mm/3h)</strong></span>
                  <Link href="/portal/weather" className="text-blue-700 font-bold hover:underline">
                    Radar Doppler →
                  </Link>
                </div>
              </div>

              {/* BOTTOM CARD 2: DATA SOURCE STATUS (WITH LIVE HEALTH PING) */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                    <h2 className="text-xs font-bold text-slate-900 tracking-tight uppercase font-mono">
                      DATA SOURCE STATUS
                    </h2>
                    <button
                      onClick={handleRefreshFeeds}
                      className="text-[10px] font-mono font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSyncingFeeds ? 'animate-spin' : ''}`} />
                      <span>Ping All</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700">
                        <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                        <span>Rainfall Stations (IMD)</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-slate-600 font-bold">156 / 162</span>
                        <span className="text-emerald-600 font-bold">Online</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Droplets className="w-3.5 h-3.5 text-blue-600" />
                        <span>Soil Moisture Sensors (TDR)</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-slate-600 font-bold">842 / 910</span>
                        <span className="text-emerald-600 font-bold">Online</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Activity className="w-3.5 h-3.5 text-blue-600" />
                        <span>IoT Water Level Gauges</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-slate-600 font-bold">216 / 230</span>
                        <span className="text-emerald-600 font-bold">Online</span>
                      </div>
                    </div>

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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        <span>Satellite Feed (GPM/MODIS)</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-slate-600 font-bold">Active</span>
                        <span className="text-emerald-600 font-bold">Online</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>Historical Disaster Archive</span>
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
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col justify-between">
                <div>
                  <div className="border-b border-slate-200 pb-2 mb-2">
                    <h2 className="text-xs font-bold text-slate-900 tracking-tight uppercase font-mono">
                      PREDICTION SUMMARY
                    </h2>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Home className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-red-950 leading-snug">
                        Very High flash flood risk predicted in Dharali, Harsil &amp; Bhagirathi basin
                      </div>
                      <span className="inline-block text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                        Next 6 Hours
                      </span>
                    </div>
                  </div>

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
                            🌧️ Heavy Rainfall (48mm/3h)
                          </span>
                          <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
                            💧 Saturated Soil (84%)
                          </span>
                          <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
                            ⛰️ FoS &lt; 1.05 Steep Slope
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 font-mono">Lead Time: <strong>24 mins</strong></span>
                  <Link href="/portal/alerts" className="text-red-700 font-bold hover:underline flex items-center gap-1">
                    <span>View Full Protocol</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── MHA NDMIS & NDRF TACTICAL OPERATIONS ── */}
        {(portalView === 'ALL' || portalView === 'OPERATIONS') && (
          <div className="space-y-4 pt-1">
            <NdmisReportCard />
            <NdrfDeploymentCard />
          </div>
        )}
      </div>

      {/* ── MODAL 1: SEND EARLY WARNING (INTERACTIVE) ── */}
      {modalEarlyWarningOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-base text-slate-900">DISPATCH OFFICIAL EARLY WARNING BULLETIN</h3>
              </div>
              <button
                onClick={() => setModalEarlyWarningOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target District &amp; Region:</label>
                <select
                  defaultValue={selectedDistrict}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold text-slate-800"
                >
                  {Object.keys(UTTARAKHAND_DISTRICTS).map(d => (
                    <option key={d} value={d}>{d} District (Uttarakhand)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Severity Level:</label>
                  <select className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-red-700">
                    <option>RED ALERT (Immediate Evacuation)</option>
                    <option>ORANGE WATCH (Prepare to Move)</option>
                    <option>YELLOW ADVISORY (Monitor Updates)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lead Time Window:</label>
                  <select className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold text-slate-800">
                    <option>24 Minutes (Immediate)</option>
                    <option>45 Minutes</option>
                    <option>2 Hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">CAP Advisory Text (Devanagari + English):</label>
                <textarea
                  defaultValue="अलर्ट: भागीरथी एवं ऋषिगंगा बेसिन में अचानक बाढ़ का खतरा। निचले इलाकों से तुरंत +120m ऊंचाई वाले शेल्टर की ओर निकलें। पुल पार न करें।"
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-sans text-xs text-slate-800"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-900 space-y-1">
                <strong>Dispatch Channels:</strong>
                <p>NDMA SACHET Gateway · Cell Broadcast SMS (Geo-targeted) · SDRF V-SAT Network · VHF Village Sirens</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalEarlyWarningOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalEarlyWarningOpen(false);
                  setActionSuccessMsg(`Official CAP Early Warning Bulletin dispatched to ${selectedDistrict} District Collectorate & SDRF.`);
                }}
                className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md cursor-pointer active:scale-95"
              >
                AUTHORIZE &amp; DISPATCH
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: BROADCAST SIREN ALERT (INTERACTIVE) ── */}
      {modalBroadcastOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-red-600 animate-pulse" />
                <h3 className="font-bold text-base text-red-900">PUBLIC EMERGENCY SIREN BROADCAST</h3>
              </div>
              <button
                onClick={() => setModalBroadcastOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              This triggers a <strong>120-second acoustic siren tone</strong> at 18 riparian village Panchayat Bhavans in <strong>{selectedDistrict}</strong> followed by an automated Devanagari voice advisory.
            </p>

            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs space-y-1.5 text-red-900">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Audio Wave Pattern: 120s Wailing High-Low Warning</span>
              </div>
              <div className="text-[11px]">Coverage: 14.5 km riverbank corridor · 18 acoustic towers ONLINE</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalBroadcastOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalBroadcastOpen(false);
                  setActionSuccessMsg(`Siren broadcast staged and active across 18 acoustic nodes in ${selectedDistrict}.`);
                }}
                className="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-md cursor-pointer active:scale-95 animate-pulse"
              >
                TRIGGER SIRENS NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: GROUND FIELD REPORT (INTERACTIVE) ── */}
      {modalFieldReportOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-base text-slate-900">SUBMIT GROUND FIELD OBSERVATION</h3>
              </div>
              <button
                onClick={() => setModalFieldReportOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reporter Agency / Role:</label>
                  <select className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold text-slate-800">
                    <option>SDRF Field Unit Commander</option>
                    <option>Gram Panchayat Pradhan</option>
                    <option>PWD Highway Engineer</option>
                    <option>Civil Defence Volunteer</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Incident Classification:</label>
                  <select className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold text-slate-800">
                    <option>Rapid River Stage Surge</option>
                    <option>Culvert / Bridge Blockage</option>
                    <option>Colluvial Landslide Obstruction</option>
                    <option>Road Breach / Scour</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location Coordinates &amp; Landmark:</label>
                <input
                  type="text"
                  defaultValue="Raini Culvert KM 0.6 (30.4850° N, 79.6925° E)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Field Description &amp; Eyewitness Severity:</label>
                <textarea
                  defaultValue="Water level has surged +0.45m in the last 30 minutes. Mud and heavy woody debris accumulating at the main bridge piers."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalFieldReportOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalFieldReportOpen(false);
                  setActionSuccessMsg('Field report verified and committed to cryptographic prediction audit ledger.');
                }}
                className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md cursor-pointer active:scale-95"
              >
                COMMIT FIELD REPORT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: DISTRICT DOSSIER (INTERACTIVE) ── */}
      {modalDistrictDossierOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-base text-slate-900 font-mono">
                  {currentDistData.name.toUpperCase()} DISTRICT HYDROLOGIC DOSSIER
                </h3>
              </div>
              <button
                onClick={() => setModalDistrictDossierOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Risk Classification</span>
                <span className="text-red-700 font-bold text-sm">{currentDistData.level} RISK</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Monitored Population</span>
                <span className="text-slate-900 font-bold text-sm">{currentDistData.population}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">24h Rainfall (IMD AWS)</span>
                <span className="text-blue-700 font-bold text-sm">{currentDistData.rainfall}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Soil Saturation</span>
                <span className="text-emerald-700 font-bold text-sm">{currentDistData.soilMoisture}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <span className="text-[10px] text-slate-500 block uppercase font-bold font-mono">Slope Stability &amp; Factor of Safety</span>
              <p className="text-slate-800 font-semibold">{currentDistData.slopeRisk} · {currentDistData.activeSensors} Real-time In-Situ Sensors Active</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <Link
                href="/map"
                className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs"
              >
                OPEN IN HYPER-LOCAL GIS MAP →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 5: ALERT DETAILS DOSSIER (INTERACTIVE) ── */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-red-600 font-bold uppercase tracking-wider">
                  {selectedAlert.id} · {selectedAlert.status}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-0.5">{selectedAlert.location}</h3>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-slate-400 hover:text-slate-700 p-1 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-red-50 rounded-xl border border-red-200">
                <span className="text-[10px] font-bold text-red-800 uppercase block">Hazard Type:</span>
                <span className="text-sm font-black text-red-950">{selectedAlert.type}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Physical Trigger:</span>
                <p className="text-slate-800 font-medium">{selectedAlert.trigger}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Mandatory Evacuation Action:</span>
                <p className="text-slate-900 font-bold bg-slate-100 p-2 rounded-lg border border-slate-200">{selectedAlert.action}</p>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 pt-1">
                <span>Issued: {selectedAlert.issuedAt}</span>
                <span>Lead Time: <strong className="text-red-600">{selectedAlert.leadTime}</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <Link
                href="/safety"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-xs"
              >
                VIEW ESCAPE ROUTE →
              </Link>
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
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
