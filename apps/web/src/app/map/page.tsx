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
  Globe
} from 'lucide-react';
import { RiskBadge, DataModeBadge } from '@/components/ui/Badges';
import { NationalRiverRiskMap } from '@/components/ui/NationalRiverRiskMap';

export type GisToolMode = 'EXPLORE' | 'PROFILE' | 'ISOCHRONES' | 'MORPHOMETRY';
export type GisLayerKey = 'DEM' | 'RIVER' | 'SURGE' | 'SENSORS' | 'SHELTERS' | 'SLOPE';

export default function HyperLocalGISPage() {
  const { setPage, setMode, setRiskState, setRainfallMm, setRiverStage } = useEnvironment();
  const { selectedLocation: adaptiveLocation, hierarchy, setLocationFilter, setStateFilter } = useAdaptive();
  const { selectedLocation: ctxLocation, setSelectedLocation, selectLocationById } = useLocation();
  const selectedLocation = adaptiveLocation || ctxLocation || LOCATIONS[0];

  const [activeMapView, setActiveMapView] = useState<'HYPER_LOCAL' | 'NATIONAL_RIVERS'>('HYPER_LOCAL');
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
            {/* View Switcher: 3D Local GIS vs National River Map */}
            <div className="pointer-events-auto flex items-center gap-1.5 glass-panel p-1 rounded-xl shadow-2xl border border-cyan-500/30">
              <button
                onClick={() => setActiveMapView('HYPER_LOCAL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] md:text-xs font-mono font-bold transition flex items-center gap-1 ${
                  activeMapView === 'HYPER_LOCAL' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mountain className="w-3.5 h-3.5" />
                <span>3D CATCHMENT</span>
              </button>
              <button
                onClick={() => setActiveMapView('NATIONAL_RIVERS')}
                className={`px-2.5 py-1 rounded-lg text-[11px] md:text-xs font-mono font-bold transition flex items-center gap-1 ${
                  activeMapView === 'NATIONAL_RIVERS' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-cyan-300 hover:text-cyan-100'
                }`}
              >
                <Waves className="w-3.5 h-3.5 animate-pulse" />
                <span>🇮🇳 NATIONAL RIVERS</span>
              </button>
            </div>

            {/* Desktop: Tool Switcher (When in HYPER_LOCAL view) */}
            {activeMapView === 'HYPER_LOCAL' && (
              <div className="pointer-events-auto hidden md:flex items-center gap-2">
                <div className="glass-panel rounded-xl p-1 flex items-center gap-1 shadow-xl">
                  {(['EXPLORE', 'PROFILE', 'ISOCHRONES', 'MORPHOMETRY'] as GisToolMode[]).map((tool) => (
                    <button
                      key={tool}
                      onClick={() => {
                        setActiveTool(tool);
                        setMobileSheetTab(tool === 'EXPLORE' ? 'INSPECTOR' : tool);
                      }}
                      className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all transform active:scale-95 ${
                        activeTool === tool
                          ? 'btn-glow-cyan text-white shadow-lg'
                          : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Right: Viewport Mode Toggle & Info Triggers */}
            <div className="pointer-events-auto flex items-center gap-1.5">
              {/* Coords HUD (Desktop only) */}
              <div className="hidden lg:flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-xl text-[10px] font-mono text-cyan-300 shadow-xl border border-cyan-500/20">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                <span>{hoveredCoord ? `${hoveredCoord.lat}, ${hoveredCoord.lon} • ${hoveredCoord.ele} • ${hoveredCoord.slope}` : '30.5050° N, 79.1550° E • 1,180m • EPSG:32644'}</span>
              </div>

              {/* Bilingual Hindi/English GIS Toggle */}
              <button
                onClick={() => setGisLang(gisLang === 'en' ? 'hi' : 'en')}
                className="fp px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl text-[10px] md:text-xs font-mono font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/10 shadow-xl transition active:scale-95 flex items-center gap-1.5"
                title={gisLang === 'en' ? 'Switch to Hindi (हिन्दी)' : 'Switch to English'}
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{gisLang === 'en' ? 'हिन्दी' : 'ENG'}</span>
              </button>

              {/* 100% Full Map vs Zoom Focus Toggle */}
              {activeMapView === 'HYPER_LOCAL' && (
                <button
                  onClick={() => setFitMode(fitMode === 'MEET' ? 'COVER' : 'MEET')}
                  className={`fp px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl text-[10px] md:text-xs font-mono font-bold flex items-center gap-1.5 shadow-xl transition active:scale-95 ${
                    fitMode === 'MEET' ? 'text-emerald-300 border-emerald-500/50 bg-emerald-950/40' : 'text-cyan-300 border-cyan-500/30'
                  }`}
                  title={fitMode === 'MEET' ? 'Currently viewing 100% Full Catchment' : 'Currently Zoomed Fill'}
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>{fitMode === 'MEET' ? '100% FULL MAP' : 'ZOOM FILL'}</span>
                </button>
              )}

              {/* Mobile Drawer Trigger Button */}
              {activeMapView === 'HYPER_LOCAL' && (
                <button
                  onClick={() => setMobileSheetOpen(!mobileSheetOpen)}
                  className="md:hidden fp fp-operational px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold text-cyan-300 flex items-center gap-1 shadow-xl active:scale-95"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GIS INFO</span>
                  {mobileSheetOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>

          {/* Conditional View Render Overlay for National River Map */}
          {activeMapView === 'NATIONAL_RIVERS' && (
            <div className="absolute inset-0 pt-14 p-1 sm:p-4 overflow-y-auto pb-28 md:pb-4 min-h-0 bg-slate-950 z-20">
              <NationalRiverRiskMap />
            </div>
          )}

          {/* Master Full-Bleed Spatial Vector GIS Canvas */}
          <div className="flex-1 relative w-full h-full bg-slate-950 overflow-hidden flex items-center justify-center p-0">
            <svg
              viewBox="0 0 800 500"
              className="w-full h-full cursor-crosshair"
              preserveAspectRatio={fitMode === 'MEET' ? 'xMidYMid meet' : 'xMidYMid slice'}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredCoord(null)}
            >
              <defs>
                <radialGradient id="highRiskHaloGis" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E67E22" stopOpacity="0.75" />
                  <stop offset="35%" stopColor="#E74C3C" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#E67E22" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#E67E22" stopOpacity="0.0" />
                </radialGradient>

                <radialGradient id="safeShelterGis" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.5" />
                  <stop offset="60%" stopColor="#2ECC71" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#2ECC71" stopOpacity="0.0" />
                </radialGradient>

                <linearGradient id="slopeHeat" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E74C3C" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#F39C12" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2ECC71" stopOpacity="0.1" />
                </linearGradient>

                <filter id="gisNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Layer 1: Digital Elevation Model (DEM) Topographic Contours */}
              {layers.DEM && (
                <g>
                  <path d="M 50,50 Q 200,20 400,60 T 750,40 L 780,480 L 20,480 Z" fill="#060e22" stroke="#122045" strokeWidth="1.5" />
                  <path d="M 80,120 Q 240,90 440,140 T 720,110 L 750,480 L 50,480 Z" fill="#091430" stroke="#162a5c" strokeWidth="1.2" />
                  <path d="M 120,200 Q 300,160 500,220 T 700,190 L 720,480 L 100,480 Z" fill="#0c1b40" stroke="#1c3675" strokeWidth="1.2" />
                  <path d="M 160,300 Q 350,260 550,310 T 680,280 L 700,480 L 140,480 Z" fill="#0f2252" stroke="#244594" strokeWidth="1.2" />
                  
                  {/* Subtle Sub-Grid Gridlines */}
                  <line x1="0" y1="125" x2="800" y2="125" stroke="rgba(0, 168, 232, 0.08)" strokeDasharray="4 8" />
                  <line x1="0" y1="250" x2="800" y2="250" stroke="rgba(0, 168, 232, 0.08)" strokeDasharray="4 8" />
                  <line x1="0" y1="375" x2="800" y2="375" stroke="rgba(0, 168, 232, 0.08)" strokeDasharray="4 8" />
                  <line x1="200" y1="0" x2="200" y2="500" stroke="rgba(0, 168, 232, 0.08)" strokeDasharray="4 8" />
                  <line x1="400" y1="0" x2="400" y2="500" stroke="rgba(0, 168, 232, 0.08)" strokeDasharray="4 8" />
                  <line x1="600" y1="0" x2="600" y2="500" stroke="rgba(0, 168, 232, 0.08)" strokeDasharray="4 8" />

                  {/* Elevation Spot Contours */}
                  <text x="70" y="45" fill="#475569" fontSize="9" fontFamily="monospace">3,800m</text>
                  <text x="95" y="115" fill="#475569" fontSize="9" fontFamily="monospace">3,200m</text>
                  <text x="135" y="195" fill="#475569" fontSize="9" fontFamily="monospace">2,400m</text>
                  <text x="175" y="295" fill="#475569" fontSize="9" fontFamily="monospace">1,600m</text>
                </g>
              )}

              {/* Layer 2: Slope Gradient Heatmap */}
              {layers.SLOPE && (
                <g>
                  <path d="M 50,50 Q 200,20 400,60 T 750,40 L 720,110 L 80,120 Z" fill="url(#slopeHeat)" />
                  <text x="320" y="40" fill="#E74C3C" fontSize="10" fontWeight="bold" fontFamily="monospace">STEEP SLOPE: 38°-44°</text>
                </g>
              )}

              {/* Layer 3: Dynamic Surge Corridor & Inundation Flood Envelope */}
              {layers.SURGE && (
                <g>
                  <ellipse cx="480" cy="280" rx="190" ry="120" fill="url(#highRiskHaloGis)" className="animate-halo-pulse" />
                  <ellipse cx="480" cy="280" rx="190" ry="120" fill="none" stroke="#E67E22" strokeWidth="1.8" strokeDasharray="6,4" className="opacity-90" />
                  <ellipse cx="480" cy="280" rx="240" ry="155" fill="none" stroke="#F39C12" strokeWidth="1.2" strokeDasharray="4,4" className="opacity-60" />
                  <text x="480" y="380" textAnchor="middle" fill="#E67E22" fontSize="10" fontWeight="bold" fontFamily="monospace">100-YR MODELED INUNDATION BUFFER</text>
                </g>
              )}

              {/* Layer 4: Strahler River Stream Flow Network */}
              {layers.RIVER && (
                <g>
                  {/* Order 3 Primary Channel */}
                  <path d="M 180,90 Q 280,140 360,220 T 480,280 T 640,420" fill="none" stroke="#0073E6" strokeWidth="7" strokeLinecap="round" />
                  <path
                    d="M 180,90 Q 280,140 360,220 T 480,280 T 640,420"
                    fill="none"
                    stroke="#00A8E8"
                    strokeWidth="3.5"
                    strokeDasharray="14 18"
                    className="flow-stream"
                    filter="url(#gisNeonGlow)"
                  />

                  {/* Tributary 1 (Order 2) */}
                  <path d="M 320,60 Q 330,140 360,220" fill="none" stroke="#1E90FF" strokeWidth="4" />
                  <path
                    d="M 320,60 Q 330,140 360,220"
                    fill="none"
                    stroke="#00A8E8"
                    strokeWidth="2"
                    strokeDasharray="8 14"
                    className="flow-stream-fast"
                  />

                  {/* Tributary 2 (Order 1) */}
                  <path d="M 520,110 Q 500,200 480,280" fill="none" stroke="#1E90FF" strokeWidth="3" />
                </g>
              )}

              {/* Layer 5: Evacuation Isochrones (10m, 20m, 30m walk buffers) */}
              {(layers.SHELTERS || activeTool === 'ISOCHRONES') && (
                <g>
                  {/* Candidate Route Vector */}
                  <path
                    d="M 480,280 Q 540,250 610,210"
                    fill="none"
                    stroke="#2ECC71"
                    strokeWidth="3.5"
                    strokeDasharray="8 8"
                    className="flow-stream-slow"
                    filter="url(#gisNeonGlow)"
                  />
                  {/* Shelter Isochrone Bands */}
                  <circle cx="610" cy="210" r="50" fill="none" stroke="#2ECC71" strokeWidth="1.2" strokeDasharray="3,3" opacity="0.8" />
                  <circle cx="610" cy="210" r="90" fill="none" stroke="#2ECC71" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
                  <circle cx="610" cy="210" r="140" fill="none" stroke="#2ECC71" strokeWidth="0.8" strokeDasharray="5,5" opacity="0.3" />
                  <text x="610" y="155" textAnchor="middle" fill="#2ECC71" fontSize="9" fontFamily="monospace">10 min isochrone</text>
                  <text x="610" y="115" textAnchor="middle" fill="#2ECC71" fontSize="9" fontFamily="monospace">20 min isochrone</text>
                </g>
              )}

              {/* Interactive Point Nodes */}
              {layers.SENSORS &&
                mapNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isShelter = node.type === 'SHELTER';
                  const isHigh = node.risk === 'HIGH';
                  const nodeColor = isShelter ? '#2ECC71' : isHigh ? '#E67E22' : '#00A8E8';

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer transition-all duration-300 group"
                      onClick={() => {
                        setSelectedNode(node);
                        setMobileSheetTab('INSPECTOR');
                        setMobileSheetOpen(true);
                      }}
                    >
                      {/* Outer Pulsing Aura for High Risk / Selected */}
                      {(isSelected || (isHigh && !isShelter)) && (
                        <circle cx={node.x} cy={node.y} r={isSelected ? '28' : '22'} fill="none" stroke={isHigh ? '#E67E22' : '#00A8E8'} strokeWidth="2" className="animate-halo-pulse" />
                      )}

                      {/* Shelter Aura */}
                      {isShelter && (
                        <circle cx={node.x} cy={node.y} r="20" fill="url(#safeShelterGis)" className="animate-pulse" />
                      )}

                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? '14' : isHigh ? '13' : '10'}
                        fill={nodeColor}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? '3.5' : '2'}
                        filter="url(#gisNeonGlow)"
                        className={isHigh && !isShelter ? 'animate-color-shift' : ''}
                      />

                      {/* Label Box */}
                      <rect
                        x={node.x - 65}
                        y={node.y + 16}
                        width="130"
                        height="26"
                        rx="6"
                        fill="rgba(8, 15, 30, 0.85)"
                        stroke="rgba(0, 168, 232, 0.3)"
                        strokeWidth="0.8"
                      />
                      <text
                        x={node.x}
                        y={node.y + 28}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {node.name.split(' (')[0]}
                      </text>

                      <text
                        x={node.x}
                        y={node.y + 38}
                        textAnchor="middle"
                        fill={nodeColor}
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {node.value}
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>

          {/* Desktop Left-Floating GIS Layer Control Box */}
          <div className="hidden md:flex absolute top-16 left-4 bottom-6 w-72 z-[600] flex-col gap-3 pointer-events-none">
            <div className="pointer-events-auto fp fp-operational rounded-2xl p-4 space-y-3 shadow-2xl text-xs overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  {gisLang === 'hi' ? 'स्थानिक जीआईएस परतें (LAYERS)' : 'SPATIAL GIS LAYERS'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">EPSG:32644</span>
              </div>

              {/* Layer Toggles */}
              <div className="space-y-1.5">
                {[
                  { key: 'DEM' as GisLayerKey, label: gisLang === 'hi' ? 'डिजिटल एलिवेशन मॉडल (DEM)' : 'Digital Elevation Model (DEM)', color: 'bg-indigo-500' },
                  { key: 'SURGE' as GisLayerKey, label: gisLang === 'hi' ? 'अतिप्रवाह सिमुलेशन (SURGE)' : 'Modeled Flood Inundation', color: 'bg-orange-500' },
                  { key: 'RIVER' as GisLayerKey, label: gisLang === 'hi' ? 'स्ट्रालर नदी प्रवाह तंत्र' : 'Strahler Stream Vector Net', color: 'bg-cyan-400' },
                  { key: 'SENSORS' as GisLayerKey, label: gisLang === 'hi' ? 'सेंसर व बस्तियां (IoT)' : 'IoT Gauges & Settlements', color: 'bg-blue-500' },
                  { key: 'SHELTERS' as GisLayerKey, label: gisLang === 'hi' ? 'आश्रय स्थल समकालिक' : 'Shelter Isochrones (10-30m)', color: 'bg-emerald-400' },
                  { key: 'SLOPE' as GisLayerKey, label: gisLang === 'hi' ? 'ढलान प्रवणता हीटमैप' : 'Slope Steepness Heatmap', color: 'bg-rose-500' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => toggleLayer(item.key)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-[11px] font-mono transition text-left ${
                      layers[item.key]
                        ? 'bg-slate-900/90 text-slate-200 border border-slate-700/80 shadow-sm'
                        : 'opacity-40 text-slate-500 hover:opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] font-bold text-cyan-300">
                      {layers[item.key] ? (gisLang === 'hi' ? 'चालू' : 'ON') : (gisLang === 'hi' ? 'बंद' : 'OFF')}
                    </span>
                  </button>
                ))}
              </div>

              {/* Catchment Flow Accumulation Slider */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-400">{gisLang === 'hi' ? 'प्रवाह संचयन' : 'Flow Accumulation'}</span>
                  <span className="text-cyan-300 font-bold">{flowThreshold} km²</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={flowThreshold}
                  onChange={(e) => setFlowThreshold(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                />
              </div>

              {/* Preset Mountain Basin View Selector */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">FOCUS BASIN:</div>
                <select
                  value={selectedLocation.id}
                  onChange={(e) => {
                    selectLocationById(e.target.value);
                    setLocationFilter(e.target.value);
                    const loc = LOCATIONS.find(l => l.id === e.target.value);
                    if (loc) setStateFilter(loc.state);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-cyan-300 font-mono font-bold focus:border-cyan-400 focus:outline-none cursor-pointer"
                >
                  {LOCATIONS.map((l) => (
                    <option key={l.id} value={l.id} className="bg-slate-900 text-slate-200">
                      {l.name} ({l.region})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Right-Floating Spatial Node Inspector & Profile (Interactive) */}
          <div className="hidden md:flex absolute top-16 right-4 bottom-6 w-80 xl:w-96 z-[600] flex-col gap-3 pointer-events-none">
            <div className="pointer-events-auto fp fp-operational rounded-2xl p-5 space-y-4 shadow-2xl text-xs overflow-y-auto">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    {gisLang === 'hi' ? 'स्थानिक विवरण (SPATIAL DOSSIER)' : 'SPATIAL DOSSIER'} · {selectedLocation.state.toUpperCase()}
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5">{selectedNode?.name}</h3>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {selectedNode?.elevation} • {selectedNode?.slope}
                  </div>
                </div>
                <RiskBadge level={selectedNode?.risk || selectedLocation.riskLevel || 'HIGH'} />
              </div>

              {/* Dynamic Tool Content based on activeTool */}
              {activeTool === 'PROFILE' ? (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-purple-400 uppercase font-bold">
                    {gisLang === 'hi' ? 'ऊंचाई अनुप्रस्थ काट प्रोफाइल' : 'ELEVATION CROSS-SECTION PROFILE'}
                  </div>
                  <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800">
                    <svg viewBox="0 0 280 110" className="w-full h-24">
                      {/* Mountain Profile Path */}
                      <path d="M 10,20 Q 80,45 150,75 T 270,95" fill="none" stroke="#a78bfa" strokeWidth="2.5" />
                      {/* Flood Waterline */}
                      <line x1="120" y1="82" x2="270" y2="82" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
                      {/* Settlement Pin */}
                      <circle cx="200" cy="85" r="4.5" fill="#f97316" />
                      {/* Shelter Pin */}
                      <circle cx="90" cy="48" r="4.5" fill="#10b981" />
                      <text x="200" y="103" textAnchor="middle" fill="#f97316" fontSize="8" fontFamily="monospace">{selectedLocation.name.split('/')[0]} ({selectedLocation.elevation})</text>
                      <text x="90" y="40" textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="monospace">Shelter (+120m)</text>
                      <text x="200" y="78" fill="#38bdf8" fontSize="8" fontFamily="monospace">Stage: {selectedLocation.riverStage.split(' ')[0]}</text>
                    </svg>
                  </div>
                </div>
              ) : activeTool === 'MORPHOMETRY' ? (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                    {gisLang === 'hi' ? 'जलीय जलग्रहण मीट्रिक' : 'HYDROLOGICAL CATCHMENT METRICS'}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="fp p-2.5 rounded-xl">
                      <div className="text-slate-400 text-[10px]">{gisLang === 'hi' ? 'जलग्रहण क्षेत्र' : 'Catchment Area'}</div>
                      <div className="font-bold text-cyan-300 text-sm mt-0.5">85.4 km²</div>
                    </div>
                    <div className="fp p-2.5 rounded-xl">
                      <div className="text-slate-400 text-[10px]">{gisLang === 'hi' ? 'उच्चावच अनुपात' : 'Relief Ratio'}</div>
                      <div className="font-bold text-slate-200 text-sm mt-0.5">0.082</div>
                    </div>
                    <div className="fp p-2.5 rounded-xl">
                      <div className="text-slate-400 text-[10px]">{gisLang === 'hi' ? 'जल निकासी घनत्व' : 'Drainage Density'}</div>
                      <div className="font-bold text-blue-300 text-sm mt-0.5">2.4 km/km²</div>
                    </div>
                    <div className="fp p-2.5 rounded-xl">
                      <div className="text-slate-400 text-[10px]">{gisLang === 'hi' ? 'सांद्रता समय' : 'Concentration Time'}</div>
                      <div className="font-bold text-amber-300 text-sm mt-0.5">42 min</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-slate-300 leading-relaxed text-xs">{selectedNode?.desc}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="fp p-2.5 rounded-xl">
                      <div className="text-slate-400 text-[10px]">{gisLang === 'hi' ? 'वर्षा (3 घंटे)' : 'Rainfall (3h)'}</div>
                      <div className="font-bold text-cyan-300 mt-0.5">{selectedLocation.rainfall3h}</div>
                    </div>
                    <div className="fp p-2.5 rounded-xl">
                      <div className="text-slate-400 text-[10px]">{gisLang === 'hi' ? 'नदी / जल स्तर' : 'River / Water Stage'}</div>
                      <div className="font-bold text-blue-400 mt-0.5">{selectedLocation.riverStage}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Fast Action Guidance Jump Buttons */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <Link
                  href="/safety"
                  className="w-full py-2.5 btn-primary text-white rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
                >
                  <Compass className="w-4 h-4 text-cyan-300" />
                  <span>OPEN ESCAPE GUIDANCE HUD</span>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/simulation"
                    className="p-2 fp text-cyan-300 hover:text-white rounded-xl text-center font-mono text-[11px] font-bold transition"
                  >
                    STRESS LAB
                  </Link>
                  <Link
                    href="/cascade"
                    className="p-2 fp text-purple-300 hover:text-white rounded-xl text-center font-mono text-[11px] font-bold transition"
                  >
                    CASCADE
                  </Link>
                </div>
              </div>
            </div>
          </div>

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
