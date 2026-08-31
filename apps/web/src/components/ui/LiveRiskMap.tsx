'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layers, 
  MapPin, 
  Radio, 
  Maximize2, 
  Eye, 
  Compass, 
  Waves, 
  CloudRain, 
  Mountain, 
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  Zap,
  Sliders,
  Droplets,
  TrendingUp,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { RiskBadge, UncertaintyBadge } from './Badges';
import { useAdaptive } from '@/context/AdaptiveContext';
import { useLocation, LOCATIONS } from '@/context/LocationContext';

export type MapLayerType = 'RISK' | 'RAINFALL' | 'SOIL' | 'TERRAIN' | 'RIVER' | 'EXPOSURE';

// Spec-Refined Color Palette Constants
export const SPEC_COLORS = {
  risk: {
    safe: '#2ECC71',      // Green (<25/100)
    alert: '#F39C12',     // Yellow (25-50/100)
    caution: '#E67E22',   // Orange (50-75/100)
    danger: '#E74C3C',    // Crimson Red (>75/100)
  },
  water: {
    channel: '#00A8E8',   // Brighter Cyan
    gauge: '#1E90FF',     // Dodger Blue
    inundation: '#0073E6',// Saturated Blue
    bgWater: '#001D3D',   // Dark Navy Blend
  }
};

interface LiveRiskMapProps {
  onSelectLocation?: (location: any) => void;
  selectedLocationId?: string;
  simulatedTimeStep?: string;
  isEmergencyMode?: boolean;
}

export const LiveRiskMap: React.FC<LiveRiskMapProps> = ({
  onSelectLocation,
  selectedLocationId = 'demo-village-003',
  simulatedTimeStep = 'NOW',
  isEmergencyMode = false,
}) => {
  const { selectedLocation: adaptiveLocation, hierarchy } = useAdaptive();
  const { selectedLocation: ctxLocation } = useLocation();
  const loc = adaptiveLocation || ctxLocation || LOCATIONS[0];

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('RISK');
  const [legendOpen, setLegendOpen] = useState<boolean>(false);
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [particleOffset, setParticleOffset] = useState<number>(0);
  const [layerOpacity, setLayerOpacity] = useState<number>(85); // 0-100% layer transparency control
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  // Smooth 60fps vector stream flow loop
  useEffect(() => {
    setMapLoaded(true);
    const interval = setInterval(() => {
      setParticleOffset((prev) => (prev + 1) % 100);
    }, 35);
    return () => clearInterval(interval);
  }, []);

  const mapNodes = useMemo(() => {
    const isSafe = loc.riskScore < 40;
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
        riskScore: Math.min(95, Math.round(loc.riskScore * 1.1)),
        riskLevel: loc.riskLevel,
        color: SPEC_COLORS.risk.caution,
        trend: '↑ Active Telemetry',
        desc: `Orographic precipitation collection point in upper ${loc.region.split('(')[0].trim()} watershed.`,
      },
      {
        id: `demo-village-001`,
        name: `${loc.region.split('(')[0].trim()} Catchment`,
        type: 'HISTORICAL_NODE',
        x: 320,
        y: 60,
        status: 'MONITORED',
        value: loc.primaryHazard.split('&')[0].trim(),
        riskScore: Math.round(loc.riskScore * 0.9),
        riskLevel: loc.riskLevel,
        color: SPEC_COLORS.risk.caution,
        trend: 'Drainage Basin',
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
        riskScore: loc.riskScore,
        riskLevel: loc.riskLevel,
        color: isSafe ? SPEC_COLORS.risk.safe : SPEC_COLORS.risk.caution,
        trend: isSafe ? 'Normal / Dry Terrain' : '↑ Rising Inundation',
        population: loc.population,
        desc: `Primary human settlement and infrastructure corridor in ${loc.region}.`,
      },
      {
        id: `demo-shelter-${loc.id}`,
        name: `${loc.name.split('/')[0].trim()} Community Shelter (+120m)`,
        type: 'SHELTER',
        x: 610,
        y: 210,
        status: 'READY',
        value: 'Elevation +120m',
        riskScore: 12.0,
        riskLevel: 'LOW',
        color: SPEC_COLORS.risk.safe,
        trend: 'SAFE ZONE',
        capacity: 450,
        desc: `Designated elevated assembly point on high ground in ${loc.state}.`,
      },
      {
        id: `demo-gauge-${loc.id}`,
        name: `${loc.name.split('/')[1] || loc.name} Radar Gauge`,
        type: 'GAUGE',
        x: 360,
        y: 220,
        status: 'ONLINE',
        value: loc.riverStage,
        riskScore: Math.min(98, Math.round(loc.riskScore * 1.15)),
        riskLevel: loc.riskLevel,
        color: isSafe ? SPEC_COLORS.risk.safe : SPEC_COLORS.risk.danger,
        trend: isSafe ? 'Normal Water Level' : '↑ RISING',
        desc: `Real-time river/drainage hydrodynamic stage monitoring station for ${loc.state}.`,
      },
    ];
  }, [loc]);

  const [fitMode, setFitMode] = useState<'MEET' | 'COVER'>('MEET');

  return (
    <div className={`relative w-full h-full bg-[#020714] overflow-hidden select-none flex flex-col justify-between transition-opacity duration-700 ${mapLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Top Floating Map Controls with Radiant Glow */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-1.5 pointer-events-none">
        {/* Layer Selector */}
        <div className="pointer-events-auto glass-panel-glow rounded-xl p-0.5 sm:p-1 flex items-center gap-0.5 sm:gap-1 shadow-2xl border border-cyan-500/30 overflow-x-auto no-scrollbar max-w-[calc(100%-100px)] sm:max-w-none">
          {(['RISK', 'RAINFALL', 'SOIL', 'TERRAIN', 'RIVER', 'EXPOSURE'] as MapLayerType[]).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-1.5 sm:px-2.5 py-1 rounded-lg text-[9px] sm:text-[11px] font-mono font-bold transition-all transform active:scale-95 whitespace-nowrap shrink-0 ${
                activeLayer === layer
                  ? 'btn-glow-cyan text-white shadow-lg'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>

        {/* Right Tools: 100% Full Map Toggle & Step Pill */}
        <div className="pointer-events-auto flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setFitMode(fitMode === 'MEET' ? 'COVER' : 'MEET')}
            className={`fp px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl text-[9px] sm:text-xs font-mono font-bold flex items-center gap-1 shadow-xl transition active:scale-95 shrink-0 ${
              fitMode === 'MEET' ? 'text-emerald-300 border-emerald-500/50 bg-emerald-950/60' : 'text-cyan-300 border-cyan-500/30'
            }`}
            title={fitMode === 'MEET' ? 'Currently viewing 100% Full Catchment' : 'Currently Zoomed Fill'}
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden xs:inline">{fitMode === 'MEET' ? '100% FULL' : 'FILL'}</span>
            <span className="xs:hidden">{fitMode === 'MEET' ? '100%' : 'FILL'}</span>
          </button>

          <div className="hidden sm:flex glass-panel px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] font-mono text-cyan-300 items-center gap-1.5 shadow-xl border border-cyan-500/30 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold">STEP: {simulatedTimeStep}</span>
          </div>
        </div>
      </div>

      {/* Primary Vector SVG Interactive Map Canvas */}
      <div className="w-full h-full flex items-center justify-center relative bg-[#020714]">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full cursor-crosshair"
          preserveAspectRatio={fitMode === 'MEET' ? 'xMidYMid meet' : 'xMidYMid slice'}
        >
          <defs>
            {/* Spec-Refined High-Risk Halo & Glow Gradients */}
            <radialGradient id="highRiskHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E67E22" stopOpacity="0.7" />
              <stop offset="35%" stopColor="#E74C3C" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#E67E22" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#E67E22" stopOpacity="0.0" />
            </radialGradient>

            <radialGradient id="rainHeatGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00A8E8" stopOpacity="0.65" />
              <stop offset="55%" stopColor="#0073E6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#001D3D" stopOpacity="0.0" />
            </radialGradient>

            <radialGradient id="safeShelterAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#2ECC71" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2ECC71" stopOpacity="0.0" />
            </radialGradient>

            {/* Realistic Stream Flow Linear Gradients */}
            <linearGradient id="streamFlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A8E8" />
              <stop offset="50%" stopColor="#1E90FF" />
              <stop offset="100%" stopColor="#0073E6" />
            </linearGradient>

            {/* Neon Glow Filters */}
            <filter id="neonWaterGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="riskHazardGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="marker3DShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background Topographic Multi-Layer Terrain Shading */}
          <g style={{ opacity: layerOpacity / 100 }}>
            <path d="M 50,50 Q 200,20 400,60 T 750,40 L 780,480 L 20,480 Z" fill="#060e22" stroke="#122045" strokeWidth="1.5" />
            <path d="M 80,120 Q 240,90 440,140 T 720,110 L 750,480 L 50,480 Z" fill="#091430" stroke="#162a5c" strokeWidth="1.2" />
            <path d="M 120,200 Q 300,160 500,220 T 700,190 L 720,480 L 100,480 Z" fill="#0c1b40" stroke="#1c3675" strokeWidth="1.2" />
            <path d="M 160,300 Q 350,260 550,310 T 680,280 L 700,480 L 140,480 Z" fill="#0f2252" stroke="#244594" strokeWidth="1.2" />
          </g>

          {/* Active Layer Dynamic Overlays with Transparency Slider Control */}
          <g style={{ opacity: layerOpacity / 100 }}>
            {activeLayer === 'RISK' && (
              <g>
                {/* Semi-transparent Halo around High-Risk Zone */}
                <ellipse cx="480" cy="280" rx="190" ry="120" fill="url(#highRiskHalo)" className="animate-halo-pulse" />
                <ellipse cx="480" cy="280" rx="190" ry="120" fill="none" stroke="#E67E22" strokeWidth="1.8" strokeDasharray="6,4" className="opacity-90" />
                <ellipse cx="480" cy="280" rx="240" ry="155" fill="none" stroke="#F39C12" strokeWidth="1.2" strokeDasharray="4,4" className="opacity-50" />
              </g>
            )}

            {activeLayer === 'RAINFALL' && (
              <circle cx="260" cy="130" r="210" fill="url(#rainHeatGradient)" filter="url(#neonWaterGlow)" className="animate-pulse" />
            )}

            {activeLayer === 'EXPOSURE' && (
              <g>
                <ellipse cx="480" cy="280" rx="140" ry="85" fill="none" stroke="#E74C3C" strokeWidth="2.5" strokeDasharray="6,4" className="animate-pulse" />
                <ellipse cx="480" cy="280" rx="220" ry="140" fill="none" stroke="#F39C12" strokeWidth="1.8" strokeDasharray="4,4" />
              </g>
            )}

            {activeLayer === 'SOIL' && (
              <g>
                <ellipse cx="340" cy="200" rx="220" ry="140" fill="#92400e" fillOpacity="0.32" className="animate-pulse" />
                <ellipse cx="340" cy="200" rx="220" ry="140" fill="none" stroke="#F39C12" strokeWidth="1.6" strokeDasharray="5,4" />
                <text x="340" y="195" textAnchor="middle" fill="#F39C12" fontSize="12" fontWeight="bold" fontFamily="monospace">SOIL SATURATION: 82%</text>
              </g>
            )}

            {activeLayer === 'TERRAIN' && (
              <g>
                <path d="M 50,50 Q 200,20 400,60 T 750,40" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4,3" />
                <path d="M 80,120 Q 240,90 440,140 T 720,110" fill="none" stroke="#a78bfa" strokeWidth="1.2" strokeDasharray="4,3" />
                <path d="M 120,200 Q 300,160 500,220 T 700,190" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" />
                <text x="560" y="225" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontFamily="monospace" fontWeight="bold">28° Mean Catchment Slope</text>
              </g>
            )}

            {activeLayer === 'RIVER' && (
              <g>
                <path d="M 180,90 Q 280,140 360,220 T 480,280 T 640,420" fill="none" stroke="#0073E6" strokeWidth="26" strokeOpacity="0.28" strokeLinecap="round" />
                <path d="M 180,90 Q 280,140 360,220 T 480,280 T 640,420" fill="none" stroke="#00A8E8" strokeWidth="10" strokeOpacity="0.65" strokeLinecap="round" />
                <path d="M 180,90 Q 280,140 360,220 T 480,280 T 640,420" fill="none" stroke="#E67E22" strokeWidth="2.5" strokeDasharray="6,4" className="animate-pulse" />
                <text x="360" y="248" textAnchor="middle" fill="#00A8E8" fontSize="12" fontWeight="bold" fontFamily="monospace">STAGE: 3.80m</text>
                <text x="360" y="264" textAnchor="middle" fill="#E67E22" fontSize="9" fontFamily="monospace">↑ RISING +0.40m/h (SURGE)</text>
              </g>
            )}
          </g>

          {/* River Stream Channel Vector Network with Bright Cyan Glow */}
          <g>
            {/* Primary River Channel (Order 3) */}
            <path
              d="M 180,90 Q 280,140 360,220 T 480,280 T 640,420"
              fill="none"
              stroke="#0073E6"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Glowing Bright Cyan Flow Vector Particles */}
            <path
              d="M 180,90 Q 280,140 360,220 T 480,280 T 640,420"
              fill="none"
              stroke="#00A8E8"
              strokeWidth="3.5"
              strokeDasharray="14 18"
              strokeDashoffset={-particleOffset * 2.2}
              filter="url(#neonWaterGlow)"
            />

            {/* Tributary 1 (Order 2) */}
            <path
              d="M 320,60 Q 330,140 360,220"
              fill="none"
              stroke="#1E90FF"
              strokeWidth="4"
            />
            <path
              d="M 320,60 Q 330,140 360,220"
              fill="none"
              stroke="#00A8E8"
              strokeWidth="2"
              strokeDasharray="8 14"
              strokeDashoffset={-particleOffset * 1.6}
            />

            {/* Tributary 2 (Order 1) */}
            <path
              d="M 520,110 Q 500,200 480,280"
              fill="none"
              stroke="#1E90FF"
              strokeWidth="3"
            />
          </g>

          {/* Candidate Escape Route with Traveling Particle */}
          <g>
            <path
              d="M 480,280 Q 540,250 610,210"
              fill="none"
              stroke="#2ECC71"
              strokeWidth="3.5"
              strokeDasharray="8 8"
              strokeDashoffset={-particleOffset * 1.2}
              filter="url(#neonWaterGlow)"
            />
            {/* Blocked Riverbed Link in Crimson Red */}
            <path
              d="M 480,280 Q 550,330 640,420"
              fill="none"
              stroke="#E74C3C"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              className="opacity-80"
            />
          </g>

          {/* Interactive Map Nodes with Adaptive Sizing & Spec Colors */}
          {mapNodes.map((node) => {
            const isSelected = selectedLocationId === node.id;
            const isHovered = hoveredNode?.id === node.id;
            const isHighRisk = node.riskScore >= 60;
            const isGauge = node.type === 'GAUGE';
            const isShelter = node.type === 'SHELTER';
            
            // Adaptive radius: high risk = 14px, gauge = 12px, shelter = 12px, normal = 10px
            const nodeRadius = isSelected ? 15 : isHighRisk ? 13 : isShelter ? 12 : 10;

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-all duration-300 group"
                onClick={() => onSelectLocation && onSelectLocation(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  opacity: hoveredNode && !isHovered ? 0.65 : 1,
                  transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                  transformOrigin: `${node.x}px ${node.y}px`,
                  transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'
                }}
              >
                {/* Outer Pulsing Aura for High Risk / Selected nodes */}
                {(isSelected || (isHighRisk && !isShelter)) && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? '28' : '22'}
                    fill="none"
                    stroke={isHighRisk ? '#E67E22' : '#00A8E8'}
                    strokeWidth="2"
                    className="animate-halo-pulse"
                  />
                )}

                {/* Shelter Green Aura */}
                {isShelter && (
                  <circle cx={node.x} cy={node.y} r="20" fill="url(#safeShelterAura)" className="animate-pulse" />
                )}

                {/* 3D Depth Shadow Circle */}
                <circle
                  cx={node.x}
                  cy={node.y + 2}
                  r={nodeRadius}
                  fill="rgba(0,0,0,0.5)"
                />

                {/* Node Symbol Body */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeRadius}
                  fill={node.color}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '3.5' : '2'}
                  filter="url(#neonWaterGlow)"
                  className={isHighRisk && !isShelter ? 'animate-color-shift' : ''}
                />

                {/* Inner Gauge Droplet Icon Marker */}
                {isGauge && (
                  <circle cx={node.x} cy={node.y} r="4" fill="#ffffff" />
                )}

                {/* Label Box Background */}
                <g className="pointer-events-none">
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
                    fill={node.color}
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.value}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Rich Interactive Floating Tooltip on Marker Hover */}
        {hoveredNode && (
          <div 
            className="absolute z-40 fp fp-operational rounded-2xl p-3.5 shadow-2xl text-xs space-y-2 pointer-events-none animate-scale-in"
            style={{
              left: `${Math.min(75, Math.max(15, (hoveredNode.x / 800) * 100))}%`,
              top: `${Math.min(70, Math.max(20, (hoveredNode.y / 500) * 100 - 15))}%`,
              transform: 'translate(-50%, -100%)',
              border: `1.5px solid ${hoveredNode.color}`
            }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5">
              <span className="font-bold text-white text-xs">{hoveredNode.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold" style={{ backgroundColor: `${hoveredNode.color}30`, color: hoveredNode.color }}>
                {hoveredNode.status}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 font-mono text-[11px]">
              <span className="text-slate-400">Live Reading:</span>
              <span className="font-bold text-cyan-300">{hoveredNode.value}</span>
            </div>
            <div className="flex items-center justify-between gap-4 font-mono text-[11px]">
              <span className="text-slate-400">Risk Trend:</span>
              <span className="font-bold" style={{ color: hoveredNode.color }}>{hoveredNode.trend}</span>
            </div>
            <p className="text-[10px] text-slate-300 font-sans leading-tight max-w-[220px]">
              {hoveredNode.desc}
            </p>
          </div>
        )}
      </div>

      {/* ── Sleek Unobtrusive Collapsible GIS Legend & Opacity (100% Clear Vision on Mobile) ── */}
      <div className="absolute bottom-20 left-3 sm:bottom-4 sm:left-4 z-30 pointer-events-auto">
        {!legendOpen ? (
          <button
            onClick={() => setLegendOpen(true)}
            className="px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-mono font-bold text-cyan-300 bg-slate-950/85 hover:bg-slate-900 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center gap-1.5 transition active:scale-95 group"
            title="Show GIS Map Legend & Layer Opacity"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-pulse shrink-0" />
            <span>LEGEND & OPACITY</span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-[9px] text-cyan-400 border border-cyan-800/80">
              {layerOpacity}%
            </span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>
        ) : (
          <div 
            className="rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] overflow-hidden text-xs transition-all duration-300 w-[260px] sm:w-[280px] max-w-[calc(100vw-24px)] animate-slide-up"
            style={{
              background: 'rgba(3, 7, 18, 0.92)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
            }}
          >
            <div
              onClick={() => setLegendOpen(false)}
              className="px-3 py-2 border-b border-slate-800 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-900/80 transition"
            >
              <span className="font-mono font-bold text-cyan-300 text-[10px] sm:text-[11px] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                GIS MAP OVERLAY & LEGEND
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); setLegendOpen(false); }}
                className="w-5 h-5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
                title="Collapse Legend"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 space-y-2.5 font-mono text-[10px] sm:text-[11px]">
              {/* Layer Transparency Control Slider */}
              <div className="space-y-1 pb-2 border-b border-slate-800/80">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Layer Opacity:</span>
                  <span className="text-cyan-300 font-bold">{layerOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={layerOpacity}
                  onChange={(e) => setLayerOpacity(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1 bg-slate-900 rounded-lg cursor-pointer"
                />
              </div>

              {/* Compact Color-Coded Legend Items */}
              <div className="grid grid-cols-1 gap-1 text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_6px_rgba(231,76,60,0.8)]" style={{ backgroundColor: SPEC_COLORS.risk.danger }} />
                  <span className="text-slate-200">Danger Risk (&gt;75/100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_6px_rgba(230,126,34,0.8)]" style={{ backgroundColor: SPEC_COLORS.risk.caution }} />
                  <span className="text-slate-200">Caution Risk (50-75/100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_6px_rgba(243,156,18,0.8)]" style={{ backgroundColor: SPEC_COLORS.risk.alert }} />
                  <span className="text-slate-200">Alert Threshold (25-50/100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_6px_rgba(46,204,113,0.8)]" style={{ backgroundColor: SPEC_COLORS.risk.safe }} />
                  <span className="text-slate-200">Safe Assembly Area (&lt;25/100)</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                  <span className="w-3.5 h-1 rounded shrink-0" style={{ backgroundColor: SPEC_COLORS.water.channel }} />
                  <span className="text-slate-300">Active River Surge Channel</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-0.5 border-b-2 border-dashed shrink-0" style={{ borderColor: SPEC_COLORS.risk.safe }} />
                  <span className="text-slate-300">Candidate Escape Route</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Coordinates & CRS Pill (Desktop Only to Avoid Mobile Clutter) */}
      <div className="hidden md:block absolute bottom-4 right-4 z-20 glass-panel px-3 py-1 rounded-xl text-[10px] font-mono text-cyan-300/80 shadow-xl border border-cyan-500/20">
        30.5050° N, 79.1550° E • WGS84 • EPSG:32644 (UTM Zone 44N)
      </div>
    </div>
  );
};
