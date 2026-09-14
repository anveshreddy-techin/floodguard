'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
import { useLocation, LOCATIONS } from '@/context/LocationContext';
import { useAdaptive } from '@/context/AdaptiveContext';
import {
  Map as MapIcon,
  Layers,
  Compass,
  Radio,
  ShieldAlert,
  Crosshair,
  ArrowRight,
  Mountain,
  Waves,
  Activity,
  Sliders,
  TrendingUp,
  Clock,
  CheckCircle2,
  Maximize2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Home,
  Info,
  Zap,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { RiskBadge, DataModeBadge } from '@/components/ui/Badges';
import { NationalRiverRiskMap } from '@/components/ui/NationalRiverRiskMap';
import { LiveDashboardAlertsView } from '@/components/ui/LiveDashboardAlertsView';
import dynamic from 'next/dynamic';

const HyperLocalRealMap = dynamic(
  () => import('@/components/ui/HyperLocalRealMap').then((m) => m.HyperLocalRealMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#F0F4F8]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-blue-700 text-xs font-sans font-bold animate-pulse">LOADING HYPER-LOCAL REAL MAP…</p>
          <p className="text-slate-500 text-xs font-sans">Fetching Satellite Imagery &amp; Topographic Contours</p>
        </div>
      </div>
    ),
  }
);

const Real3DTerrainCatchment = dynamic(
  () => import('@/components/ui/Real3DTerrainCatchment'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#F0F4F8]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-blue-700 text-xs font-sans font-bold animate-pulse">INITIALIZING 3D TERRAIN…</p>
          <p className="text-slate-500 text-xs font-sans">Loading WebGL &amp; SRTM Terrarium DEM</p>
        </div>
      </div>
    ),
  }
);

export type GisToolMode = 'EXPLORE' | 'PROFILE' | 'ISOCHRONES' | 'MORPHOMETRY';
export type GisLayerKey = 'DEM' | 'RIVER' | 'SURGE' | 'SENSORS' | 'SHELTERS' | 'SLOPE';

export default function HyperLocalGISPage() {
  const { setPage, setMode, setRiskState, setRainfallMm, setRiverStage } = useEnvironment();
  const { selectedLocation: adaptiveLocation, hierarchy, setLocationFilter, setStateFilter } = useAdaptive();
  const { selectedLocation: ctxLocation, setSelectedLocation, selectLocationById } = useLocation();
  const selectedLocation = adaptiveLocation || ctxLocation || LOCATIONS[0];

  const [activeMapView, setActiveMapView] = useState<'HYPER_LOCAL' | 'NATIONAL_RIVERS' | 'DASHBOARD_ALERTS'>('HYPER_LOCAL');
  const [gisRenderMode, setGisRenderMode] = useState<'REAL_MAP' | 'SCHEMATIC'>('REAL_MAP');
  const [panelsOpen, setPanelsOpen] = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<GisToolMode>('EXPLORE');
  const [layers, setLayers] = useState<Record<GisLayerKey, boolean>>({
    DEM: true,
    RIVER: true,
    SURGE: true,
    SENSORS: true,
    SHELTERS: true,
    SLOPE: false,
  });

  const [flowThreshold, setFlowThreshold] = useState<number>(35); // km² accumulation
  const [hoveredCoord, setHoveredCoord] = useState<{ x: number; y: number; lat: string; lon: string; ele: string; slope: string } | null>(null);
  const [gisLang, setGisLang] = useState<'en' | 'hi'>('en');

  // Dynamically compute 3D Catchment nodes for the chosen location
  const mapNodes = useMemo(() => {
    const loc = selectedLocation;
    const baseEle = parseInt(loc.elevation.replace(/[^0-9]/g, '')) || 500;

    return [
      {
        id: `demo-aws-${loc.id}`,
        name: `${loc.name.split('/')[0].trim()} AWS Station`,
        type: 'SENSOR',
        x: 180,
        y: 90,
        status: 'ONLINE',
        value: `${loc.rainfall3h} / 3h`,
        elevation: `${Math.round(baseEle * 1.35)} m ASL`,
        slope: '34° ridge slope',
        risk: loc.riskLevel,
        desc: `Orographic precipitation collection station in upper ${loc.region.split('(')[0].trim()} catchment.`,
      },
      {
        id: `demo-headwater-${loc.id}`,
        name: `${loc.region.split('(')[0].trim()} (Headwaters Catchment)`,
        type: 'HISTORICAL_NODE',
        x: 320,
        y: 60,
        status: 'MONITORED',
        value: loc.primaryHazard.split('&')[0].trim(),
        elevation: `${Math.round(baseEle * 1.8)} m ASL`,
        slope: '41° upper basin slope',
        risk: loc.riskLevel,
        desc: `Upstream drainage basin & runoff accumulation zone for ${loc.state}.`,
      },
      {
        id: loc.id,
        name: `${loc.name} (Exposure Target)`,
        type: 'VILLAGE',
        x: 480,
        y: 280,
        status: `${loc.riskLevel}_RISK`,
        value: `Risk: ${loc.riskScore}/100`,
        elevation: loc.elevation,
        slope: '28° colluvial slope',
        risk: loc.riskLevel,
        population: loc.population,
        desc: `Primary human settlement and infrastructure corridor in ${loc.region}. Authoritative: ${loc.authoritativeAgency}.`,
      },
      {
        id: `demo-shelter-${loc.id}`,
        name: `${loc.name.split('/')[0].trim()} Community Shelter (+120m)`,
        type: 'SHELTER',
        x: 610,
        y: 210,
        status: 'READY',
        value: 'Elevation +120m',
        elevation: `${Math.round(baseEle + 120)} m ASL`,
        slope: '14° stable spur',
        risk: 'LOW',
        capacity: 450,
        desc: `Designated elevated assembly point on high ground in ${loc.state}.`,
      },
      {
        id: `demo-gauge-${loc.id}`,
        name: `${loc.name.split('/')[1] ? loc.name.split('/')[1].trim() : loc.name} Radar Gauge`,
        type: 'GAUGE',
        x: 360,
        y: 220,
        status: 'ONLINE',
        value: loc.riverStage,
        elevation: `${Math.round(baseEle * 1.05)} m ASL`,
        slope: '22° river channel',
        risk: loc.riskLevel,
        desc: `Real-time hydrodynamic river/drainage stage monitoring station for ${loc.state}.`,
      },
    ];
  }, [selectedLocation]);

  const [selectedNode, setSelectedNode] = useState<any>(mapNodes[2]);

  // Update selectedNode whenever location/mapNodes change
  useEffect(() => {
    if (mapNodes && mapNodes.length > 2) {
      setSelectedNode(mapNodes[2]);
    }
  }, [mapNodes]);

  const [mobileSheetTab, setMobileSheetTab] = useState<'INSPECTOR' | 'LAYERS' | 'PROFILE' | 'ISOCHRONES' | 'MORPHOMETRY'>('INSPECTOR');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  useEffect(() => {
    setPage('map');
    setMode('DEMO');
    setRiskState('HIGH');
    setRainfallMm(48);
    setRiverStage(3.8);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === '3d') {
        setGisRenderMode('SCHEMATIC');
      } else if (params.get('view') === 'dashboard' || params.get('view') === 'alerts' || params.get('tab') === 'alerts') {
        setActiveMapView('DASHBOARD_ALERTS');
      }
    }
  }, [setPage, setMode, setRiskState, setRainfallMm, setRiverStage]);

  const toggleLayer = (key: GisLayerKey) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 800;
    const y = ((e.clientY - rect.top) / rect.height) * 500;
    const baseLat = selectedLocation.lat;
    const baseLon = selectedLocation.lon;
    const baseEle = parseInt(selectedLocation.elevation.replace(/[^0-9]/g, '')) || 500;
    const lat = (baseLat + (250 - y) * 0.0004).toFixed(4);
    const lon = (baseLon + (x - 400) * 0.0005).toFixed(4);
    const ele = Math.round(baseEle * 0.8 + (500 - y) * (baseEle * 0.003));
    const slope = Math.round(18 + Math.sin(x * 0.02) * 12);
    setHoveredCoord({ x, y, lat: `${lat}° N`, lon: `${lon}° E`, ele: `${ele} m`, slope: `${slope}°` });
  };

  const [fitMode, setFitMode] = useState<'MEET' | 'COVER'>('MEET');

  return (
    <div className="flex flex-col h-screen overflow-hidden select-none bg-[#F0F4F8]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />

      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="map" />

        <main className="flex-1 relative flex flex-col min-h-0 overflow-hidden bg-[#F0F4F8]">
          {/* Top Dedicated GIS Workspace Command Bar (In-Flow Header, Zero Collision) */}
          <div className="h-11 bg-white border-b border-slate-200 px-3 flex items-center justify-between shrink-0 z-20 font-sans shadow-2xs">
            {/* Left: View Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  setActiveMapView('HYPER_LOCAL');
                  setGisRenderMode('REAL_MAP');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition flex items-center gap-1.5 ${
                  activeMapView === 'HYPER_LOCAL' && gisRenderMode === 'REAL_MAP'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>🛰️ REAL MAP (GIS)</span>
              </button>
              <button
                onClick={() => {
                  setActiveMapView('HYPER_LOCAL');
                  setGisRenderMode('SCHEMATIC');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition flex items-center gap-1.5 ${
                  activeMapView === 'HYPER_LOCAL' && gisRenderMode === 'SCHEMATIC'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Mountain className="w-3.5 h-3.5" />
                <span>⛰️ REAL 3D TERRAIN</span>
              </button>
              <button
                onClick={() => setActiveMapView('NATIONAL_RIVERS')}
                className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition flex items-center gap-1.5 ${
                  activeMapView === 'NATIONAL_RIVERS'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                <span>🇮🇳 NATIONAL RIVERS</span>
              </button>
              <button
                onClick={() => setActiveMapView('DASHBOARD_ALERTS')}
                className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition flex items-center gap-1.5 ${
                  activeMapView === 'DASHBOARD_ALERTS'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-red-700 hover:bg-red-50'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>📊 LIVE DASHBOARD &amp; ALERTS</span>
              </button>
            </div>

            {/* Right: Active Location Breadcrumb + Bilingual Hindi/English GIS Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono">
                <MapPin className="w-3 h-3 text-blue-600" />
                <span className="font-bold">{selectedLocation.name}</span>
                <span className="text-slate-400">({selectedLocation.elevation})</span>
              </div>

              <button
                onClick={() => setGisLang(gisLang === 'en' ? 'hi' : 'en')}
                className="bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-sans font-bold text-slate-800 border border-slate-200 shadow-2xs transition active:scale-95 flex items-center gap-1.5"
                title={gisLang === 'en' ? 'Switch to Hindi (हिन्दी)' : 'Switch to English'}
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>{gisLang === 'en' ? 'हिन्दी' : 'ENG'}</span>
              </button>
            </div>
          </div>

          {/* Conditional View Render for Live Dashboard & Alerts */}
          {activeMapView === 'DASHBOARD_ALERTS' && (
            <div className="flex-1 p-2 sm:p-4 overflow-y-auto min-h-0 bg-[#F0F4F8] z-10">
              <LiveDashboardAlertsView onClose={() => setActiveMapView('HYPER_LOCAL')} />
            </div>
          )}

          {/* Conditional View Render for National River Map */}
          {activeMapView === 'NATIONAL_RIVERS' && (
            <div className="flex-1 p-2 sm:p-4 overflow-y-auto min-h-0 bg-[#F0F4F8] z-10">
              <NationalRiverRiskMap />
            </div>
          )}

          {/* Master Full-Bleed Spatial Vector GIS Canvas: REAL MAP vs SCHEMATIC */}
          {activeMapView === 'HYPER_LOCAL' && (
            gisRenderMode === 'REAL_MAP' ? (
              <div className="flex-1 relative w-full h-full bg-slate-100 min-h-0 overflow-hidden">
                <HyperLocalRealMap
                  location={selectedLocation}
                  selectedNodeId={selectedNode?.id}
                  onSelectNode={(node) => {
                    setSelectedNode(node);
                    setMobileSheetTab('INSPECTOR');
                    setMobileSheetOpen(true);
                  }}
                  gisLang={gisLang}
                  className="w-full h-full"
                  showControlBar={true}
                />
              </div>
            ) : (
              <div className="flex-1 relative w-full h-full min-h-0 overflow-hidden">
                <Real3DTerrainCatchment location={selectedLocation} />
              </div>
            )
          )}


          {/* Mobile GIS Bottom Sheet — Proper bottom sheet, NOT full-screen overlay */}
          {mobileSheetOpen && (
            <div
              className="md:hidden fixed inset-x-0 bottom-16 z-[650] animate-slide-up"
              style={{ maxHeight: '48vh' }}
            >
              <div className="h-full bg-white/95 backdrop-blur-2xl border-t border-slate-200 rounded-t-3xl shadow-xl flex flex-col overflow-hidden text-slate-900 font-sans">
                {/* Header: Tab Switcher + Close */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <MapIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">GIS WORKSPACE</span>
                  </div>
                  <button
                    onClick={() => setMobileSheetOpen(false)}
                    className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 active:scale-95"
                  >
                    ✕ Hide
                  </button>
                </div>

                {/* Mobile Tab Bar */}
                <div className="flex gap-1.5 px-3 py-2 shrink-0 overflow-x-auto no-scrollbar bg-slate-50 border-b border-slate-100">
                  {(['INSPECTOR', 'LAYERS', 'PROFILE', 'ISOCHRONES', 'MORPHOMETRY'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMobileSheetTab(tab)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition active:scale-95 shadow-xs ${
                        mobileSheetTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Mobile Tab Contents (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  {mobileSheetTab === 'INSPECTOR' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{selectedNode?.name}</h4>
                          <span className="text-xs text-slate-500 font-sans">{selectedNode?.elevation}</span>
                        </div>
                        <RiskBadge level={selectedNode?.risk || 'HIGH'} />
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">{selectedNode?.desc}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl shadow-2xs">
                          <div className="text-slate-500 text-xs font-medium">Rainfall (3h)</div>
                          <div className="font-bold text-blue-700 font-mono mt-0.5">{selectedLocation.rainfall3h}</div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl shadow-2xs">
                          <div className="text-slate-500 text-xs font-medium">River / Water Stage</div>
                          <div className="font-bold text-blue-700 font-mono mt-0.5">{selectedLocation.riverStage}</div>
                        </div>
                      </div>
                      <Link
                        href="/safety"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Compass className="w-4 h-4 text-white" />
                        <span>OPEN CITIZEN GUIDANCE HUD</span>
                      </Link>
                    </div>
                  )}

                  {mobileSheetTab === 'LAYERS' && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">ACTIVE GIS LAYERS</div>
                      {[
                        { key: 'DEM' as GisLayerKey, label: 'Digital Elevation Model (SRTM 30m)', color: 'bg-indigo-500', source: 'USGS' },
                        { key: 'SURGE' as GisLayerKey, label: 'Modeled Flood Inundation (100-yr)', color: 'bg-orange-500', source: 'HEC-RAS' },
                        { key: 'RIVER' as GisLayerKey, label: 'Strahler Stream Vector Network', color: 'bg-blue-500', source: 'NRSC' },
                        { key: 'SENSORS' as GisLayerKey, label: 'IoT Gauges & Settlements (25 live)', color: 'bg-cyan-600', source: 'CWC' },
                        { key: 'SHELTERS' as GisLayerKey, label: 'Shelter Isochrones (10-30 min)', color: 'bg-emerald-600', source: 'NDMA' },
                        { key: 'SLOPE' as GisLayerKey, label: 'Slope Steepness Heatmap', color: 'bg-rose-600', source: 'ALOS 12.5m' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => toggleLayer(item.key)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl text-xs transition active:scale-[0.98] ${
                            layers[item.key]
                              ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                              : 'opacity-50 bg-slate-50 text-slate-500 border border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.color}`} />
                            <span className="truncate font-medium">{item.label}</span>
                          </div>
                          <div className="flex flex-col items-end shrink-0 gap-0.5 ml-2">
                            <span className={`font-bold text-xs ${layers[item.key] ? 'text-blue-700' : 'text-slate-500'}`}>
                              {layers[item.key] ? 'ON' : 'OFF'}
                            </span>
                            <span className="text-[10px] text-slate-400">{item.source}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {mobileSheetTab === 'PROFILE' && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-700 uppercase">Cross-Section (Ridge to Valley)</div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <svg viewBox="0 0 280 100" className="w-full h-20">
                          <path d="M 10,20 Q 80,45 150,75 T 270,95" fill="none" stroke="#6366f1" strokeWidth="2.5" />
                          <line x1="120" y1="82" x2="270" y2="82" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,3" />
                          <circle cx="200" cy="85" r="4.5" fill="#ea580c" />
                          <circle cx="90" cy="48" r="4.5" fill="#059669" />
                          <text x="200" y="103" textAnchor="middle" fill="#ea580c" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Village 1,180m</text>
                          <text x="90" y="40" textAnchor="middle" fill="#059669" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Shelter 1,300m (+120m)</text>
                          <text x="200" y="76" fill="#0284c7" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Surge: 3.80m</text>
                        </svg>
                      </div>
                    </div>
                  )}

                  {mobileSheetTab === 'ISOCHRONES' && (
                    <div className="space-y-2 text-xs">
                      <div className="text-emerald-700 font-bold uppercase text-xs">Evacuation Isochrones</div>
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2">
                        <div className="flex justify-between text-slate-700"><span>10 min buffer:</span><span className="text-emerald-700 font-bold">500m (Community Shelter)</span></div>
                        <div className="flex justify-between text-slate-700"><span>20 min buffer:</span><span className="text-blue-700 font-bold">1.2km (High Ridge Spur)</span></div>
                        <div className="flex justify-between text-slate-700"><span>30 min buffer:</span><span className="text-purple-700 font-bold">2.0km (Panchayat Bhavan)</span></div>
                      </div>
                    </div>
                  )}

                  {mobileSheetTab === 'MORPHOMETRY' && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl shadow-2xs">
                        <div className="text-slate-500 text-xs font-medium">Catchment Area</div>
                        <div className="font-bold text-blue-700 font-mono mt-0.5">85.4 km²</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl shadow-2xs">
                        <div className="text-slate-500 text-xs font-medium">Drainage Density</div>
                        <div className="font-bold text-blue-700 font-mono mt-0.5">2.4 km/km²</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl shadow-2xs">
                        <div className="text-slate-500 text-xs font-medium">Time to Peak</div>
                        <div className="font-bold text-amber-800 font-mono mt-0.5">42 min</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl shadow-2xs">
                        <div className="text-slate-500 text-xs font-medium">Mean Slope</div>
                        <div className="font-bold text-red-600 font-mono mt-0.5">28.4°</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
