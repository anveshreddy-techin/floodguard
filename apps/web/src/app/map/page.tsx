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
      <div className="w-full h-full flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-cyan-300 text-xs font-mono font-bold animate-pulse">LOADING HYPER-LOCAL REAL MAP…</p>
          <p className="text-slate-500 text-[10px] font-mono">Fetching Satellite Imagery &amp; Topographic Contours</p>
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
      <div className="w-full h-full flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-cyan-300 text-xs font-mono font-bold animate-pulse">INITIALIZING 3D TERRAIN…</p>
          <p className="text-slate-500 text-[10px] font-mono">Loading WebGL &amp; SRTM Terrarium DEM</p>
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
    <div className="flex flex-col h-screen overflow-hidden select-none bg-slate-950">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />

      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="map" />

        <main className="flex-1 relative flex flex-col min-h-0 overflow-hidden bg-slate-950">
          {/* Top Floating Spatial GIS Command Bar (Clean, Single-Row Responsive Layout) */}
          <div className="absolute top-2.5 left-2.5 right-2.5 z-30 flex items-center justify-between gap-2 pointer-events-none">
            {/* View Switcher: Real Map vs 3D Schematic vs National River Map */}
            <div className="pointer-events-auto flex items-center gap-1.5 glass-panel p-1 rounded-xl shadow-2xl border border-cyan-500/30">
              <button
                onClick={() => {
                  setActiveMapView('HYPER_LOCAL');
                  setGisRenderMode('REAL_MAP');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] md:text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  activeMapView === 'HYPER_LOCAL' && gisRenderMode === 'REAL_MAP'
                    ? 'bg-cyan-500 text-slate-950 shadow font-black'
                    : 'text-slate-400 hover:text-white'
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
                className={`px-2.5 py-1 rounded-lg text-[11px] md:text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  activeMapView === 'HYPER_LOCAL' && gisRenderMode === 'SCHEMATIC'
                    ? 'bg-cyan-500 text-slate-950 shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mountain className="w-3.5 h-3.5" />
                <span>⛰️ REAL 3D TERRAIN</span>
              </button>
              <button
                onClick={() => setActiveMapView('NATIONAL_RIVERS')}
                className={`px-2.5 py-1 rounded-lg text-[11px] md:text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  activeMapView === 'NATIONAL_RIVERS'
                    ? 'bg-cyan-500 text-slate-950 shadow font-black'
                    : 'text-cyan-300 hover:text-cyan-100'
                }`}
              >
                <Waves className="w-3.5 h-3.5 animate-pulse" />
                <span>🇮🇳 NATIONAL RIVERS</span>
              </button>
              <button
                onClick={() => setActiveMapView('DASHBOARD_ALERTS')}
                className={`px-2.5 py-1 rounded-lg text-[11px] md:text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  activeMapView === 'DASHBOARD_ALERTS'
                    ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow font-black border border-red-400/50'
                    : 'text-rose-300 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>📊 LIVE DASHBOARD &amp; ALERTS</span>
              </button>
            </div>

            {/* Right: Viewport Mode Toggle & Info Triggers */}
            <div className="pointer-events-auto flex items-center gap-1.5">
              {/* Bilingual Hindi/English GIS Toggle */}
              <button
                onClick={() => setGisLang(gisLang === 'en' ? 'hi' : 'en')}
                className="fp px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl text-[10px] md:text-xs font-mono font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/10 shadow-xl transition active:scale-95 flex items-center gap-1.5"
                title={gisLang === 'en' ? 'Switch to Hindi (हिन्दी)' : 'Switch to English'}
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{gisLang === 'en' ? 'हिन्दी' : 'ENG'}</span>
              </button>
            </div>
          </div>

          {/* Conditional View Render Overlay for Live Dashboard & Alerts */}
          {activeMapView === 'DASHBOARD_ALERTS' && (
            <div className="absolute inset-0 pt-14 p-1 sm:p-4 overflow-y-auto pb-20 md:pb-4 min-h-0 bg-slate-950 z-40">
              <LiveDashboardAlertsView onClose={() => setActiveMapView('HYPER_LOCAL')} />
            </div>
          )}

          {/* Conditional View Render Overlay for National River Map */}
          {activeMapView === 'NATIONAL_RIVERS' && (
            <div className="absolute inset-0 pt-14 p-1 sm:p-4 overflow-y-auto pb-28 md:pb-4 min-h-0 bg-slate-950 z-20">
              <NationalRiverRiskMap />
            </div>
          )}

          {/* Master Full-Bleed Spatial Vector GIS Canvas: REAL MAP vs SCHEMATIC */}
          {activeMapView === 'HYPER_LOCAL' && (
            gisRenderMode === 'REAL_MAP' ? (
              <div className="flex-1 relative w-full h-full bg-slate-950 overflow-hidden">
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
              <Real3DTerrainCatchment location={selectedLocation} />
            )
          )}


          {/* Mobile GIS Bottom Sheet — Proper bottom sheet, NOT full-screen overlay */}
          {mobileSheetOpen && (
            <div
              className="md:hidden fixed inset-x-0 bottom-16 z-[650] animate-slide-up"
              style={{ maxHeight: '48vh' }}
            >
              <div className="h-full bg-[#060e1c]/96 backdrop-blur-2xl border-t-2 border-cyan-500/50 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,168,232,0.25)] flex flex-col overflow-hidden">
                {/* Header: Tab Switcher + Close */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/60 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <MapIcon className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-black text-white">GIS WORKSPACE</span>
                  </div>
                  <button
                    onClick={() => setMobileSheetOpen(false)}
                    className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 active:scale-95"
                  >
                    ✕ Hide
                  </button>
                </div>

                {/* Mobile Tab Bar */}
                <div className="flex gap-1 px-3 py-2 shrink-0 overflow-x-auto no-scrollbar">
                  {(['INSPECTOR', 'LAYERS', 'PROFILE', 'ISOCHRONES', 'MORPHOMETRY'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMobileSheetTab(tab)}
                      className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[10px] whitespace-nowrap transition active:scale-95 ${
                        mobileSheetTab === tab ? 'btn-glow-cyan text-white' : 'fp text-slate-400'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Mobile Tab Contents (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
                  {mobileSheetTab === 'INSPECTOR' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm">{selectedNode?.name}</h4>
                          <span className="text-[11px] text-slate-400 font-mono">{selectedNode?.elevation}</span>
                        </div>
                        <RiskBadge level={selectedNode?.risk || 'HIGH'} />
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{selectedNode?.desc}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="fp p-2.5 rounded-xl">
                          <div className="text-slate-400 text-[10px]">Rainfall (3h)</div>
                          <div className="font-bold text-cyan-300 mt-0.5">{selectedLocation.rainfall3h}</div>
                        </div>
                        <div className="fp p-2.5 rounded-xl">
                          <div className="text-slate-400 text-[10px]">River / Water Stage</div>
                          <div className="font-bold text-blue-400 mt-0.5">{selectedLocation.riverStage}</div>
                        </div>
                      </div>
                      <Link
                        href="/safety"
                        className="w-full py-2.5 btn-primary text-white rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2"
                      >
                        <Compass className="w-4 h-4 text-cyan-300" />
                        <span>OPEN CITIZEN GUIDANCE HUD</span>
                      </Link>
                    </div>
                  )}

                  {mobileSheetTab === 'LAYERS' && (
                    <div className="space-y-2">
                      <div className="gis-panel-header">ACTIVE GIS LAYERS</div>
                      {[
                        { key: 'DEM' as GisLayerKey, label: 'Digital Elevation Model (SRTM 30m)', color: 'bg-indigo-500', source: 'USGS' },
                        { key: 'SURGE' as GisLayerKey, label: 'Modeled Flood Inundation (100-yr)', color: 'bg-orange-500', source: 'HEC-RAS' },
                        { key: 'RIVER' as GisLayerKey, label: 'Strahler Stream Vector Network', color: 'bg-cyan-400', source: 'NRSC' },
                        { key: 'SENSORS' as GisLayerKey, label: 'IoT Gauges & Settlements (25 live)', color: 'bg-blue-500', source: 'CWC' },
                        { key: 'SHELTERS' as GisLayerKey, label: 'Shelter Isochrones (10-30 min)', color: 'bg-emerald-400', source: 'NDMA' },
                        { key: 'SLOPE' as GisLayerKey, label: 'Slope Steepness Heatmap', color: 'bg-rose-500', source: 'ALOS 12.5m' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => toggleLayer(item.key)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl font-mono text-[11px] transition active:scale-[0.98] ${
                            layers[item.key]
                              ? 'bg-slate-900/90 text-slate-200 border border-slate-700/80'
                              : 'opacity-40 text-slate-500 fp'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.color}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          <div className="flex flex-col items-end shrink-0 gap-0.5 ml-2">
                            <span className={`font-bold text-[10px] ${layers[item.key] ? 'text-cyan-300' : 'text-slate-600'}`}>
                              {layers[item.key] ? 'ON' : 'OFF'}
                            </span>
                            <span className="text-[9px] text-slate-500">{item.source}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {mobileSheetTab === 'PROFILE' && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-purple-300 font-bold uppercase">Cross-Section (Ridge to Valley)</div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <svg viewBox="0 0 280 100" className="w-full h-20">
                          <path d="M 10,20 Q 80,45 150,75 T 270,95" fill="none" stroke="#a78bfa" strokeWidth="2.5" />
                          <line x1="120" y1="82" x2="270" y2="82" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
                          <circle cx="200" cy="85" r="4.5" fill="#f97316" />
                          <circle cx="90" cy="48" r="4.5" fill="#10b981" />
                          <text x="200" y="103" textAnchor="middle" fill="#f97316" fontSize="8" fontFamily="monospace">Village 1,180m</text>
                          <text x="90" y="40" textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="monospace">Shelter 1,300m (+120m)</text>
                          <text x="200" y="76" fill="#38bdf8" fontSize="7" fontFamily="monospace">Surge: 3.80m</text>
                        </svg>
                      </div>
                    </div>
                  )}

                  {mobileSheetTab === 'ISOCHRONES' && (
                    <div className="space-y-2 text-xs font-mono">
                      <div className="text-emerald-400 font-bold uppercase text-[11px]">Evacuation Isochrones</div>
                      <div className="fp p-3 rounded-xl space-y-2">
                        <div className="flex justify-between text-slate-300"><span>10 min buffer:</span><span className="text-emerald-400 font-bold">500m (Community Shelter)</span></div>
                        <div className="flex justify-between text-slate-300"><span>20 min buffer:</span><span className="text-cyan-300 font-bold">1.2km (High Ridge Spur)</span></div>
                        <div className="flex justify-between text-slate-300"><span>30 min buffer:</span><span className="text-purple-300 font-bold">2.0km (Panchayat Bhavan)</span></div>
                      </div>
                    </div>
                  )}

                  {mobileSheetTab === 'MORPHOMETRY' && (
                    <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                      <div className="fp p-2.5 rounded-xl">
                        <div className="text-slate-400 text-[10px]">Catchment Area</div>
                        <div className="font-bold text-cyan-300 mt-0.5">85.4 km²</div>
                      </div>
                      <div className="fp p-2.5 rounded-xl">
                        <div className="text-slate-400 text-[10px]">Drainage Density</div>
                        <div className="font-bold text-blue-300 mt-0.5">2.4 km/km²</div>
                      </div>
                      <div className="fp p-2.5 rounded-xl">
                        <div className="text-slate-400 text-[10px]">Time to Peak</div>
                        <div className="font-bold text-amber-300 mt-0.5">42 min</div>
                      </div>
                      <div className="fp p-2.5 rounded-xl">
                        <div className="text-slate-400 text-[10px]">Mean Slope</div>
                        <div className="font-bold text-rose-300 mt-0.5">28.4°</div>
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
