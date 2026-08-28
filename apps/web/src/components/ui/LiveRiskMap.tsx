'use client';

import React, { useState, useEffect } from 'react';
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
  Zap
} from 'lucide-react';
import { RiskBadge, UncertaintyBadge } from './Badges';

export type MapLayerType = 'RISK' | 'RAINFALL' | 'SOIL' | 'TERRAIN' | 'RIVER' | 'EXPOSURE';

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
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('RISK');
  const [legendOpen, setLegendOpen] = useState<boolean>(true);
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [particleOffset, setParticleOffset] = useState<number>(0);

  // Smooth vector flow particle loop
  useEffect(() => {
    const interval = setInterval(() => {
      setParticleOffset((prev) => (prev + 1) % 100);
    }, 35);
    return () => clearInterval(interval);
  }, []);

  const mapNodes = [
    {
      id: 'demo-aws-001',
      name: 'Ridge AWS Station (1,450m)',
      type: 'SENSOR',
      x: 180,
      y: 90,
      status: 'ONLINE',
      value: '48.0 mm / 3h',
      risk: 'HIGH',
      desc: 'Orographic precipitation collection point in upper gorge.',
    },
    {
      id: 'demo-village-001',
      name: 'Kedarnath Base (3,583m)',
      type: 'HISTORICAL_NODE',
      x: 320,
      y: 60,
      status: 'MONITORED',
      value: 'Chorabari Catchment',
      risk: 'HIGH',
      desc: 'Glacial cirque and moraine impoundment zone.',
    },
    {
      id: 'demo-village-003',
      name: 'Sunderbans Nagar (Exposure Target)',
      type: 'VILLAGE',
      x: 480,
      y: 280,
      status: 'HIGH_RISK',
      value: 'Risk: 68.5/100',
      risk: 'HIGH',
      population: 3400,
      desc: 'Alluvial fan settlement at river channel confluence. Primary exposure zone.',
    },
    {
      id: 'demo-shelter-001',
      name: 'Community High School (Candidate Shelter)',
      type: 'SHELTER',
      x: 610,
      y: 210,
      status: 'READY',
      value: 'Elevation +120m',
      risk: 'LOW',
      capacity: 450,
      desc: 'Designated elevated assembly point on north ridge.',
    },
    {
      id: 'demo-gauge-001',
      name: 'Radar Water Level Gauge #1',
      type: 'GAUGE',
      x: 360,
      y: 220,
      status: 'ONLINE',
      value: '3.80m (+0.40m/h)',
      risk: 'HIGH',
      desc: 'Mid-catchment river stage monitoring station.',
    },
  ];

  return (
    <div className="relative w-full h-full bg-[#050a17] overflow-hidden select-none flex flex-col justify-between">
      {/* Top Floating Map Controls with Radiant Glow */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2.5">
        <div className="glass-panel-glow rounded-xl p-1.5 flex items-center gap-1.5 shadow-2xl">
          {(['RISK', 'RAINFALL', 'SOIL', 'TERRAIN', 'RIVER', 'EXPOSURE'] as MapLayerType[]).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all transform active:scale-95 ${
                activeLayer === layer
                  ? 'btn-glow-cyan text-white shadow-lg'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>

        <div className="glass-panel px-3.5 py-1.5 rounded-xl text-xs font-mono text-cyan-300 flex items-center gap-2 shadow-xl border border-cyan-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold">STEP: {simulatedTimeStep}</span>
        </div>
      </div>

      {/* Primary Vector SVG Interactive Map Canvas */}
      <div className="w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="highRiskHeat" cx="60%" cy="56%" r="45%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.65" />
              <stop offset="40%" stopColor="#f97316" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
            </radialGradient>

            <radialGradient id="rainHeat" cx="30%" cy="20%" r="50%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </radialGradient>

            <linearGradient id="streamFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="hazardGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Topographic Contour Shading */}
          <path
            d="M 50,50 Q 200,20 400,60 T 750,40 L 780,480 L 20,480 Z"
            fill="#081024"
            stroke="#132042"
            strokeWidth="1.5"
          />
          <path
            d="M 80,120 Q 240,90 440,140 T 720,110 L 750,480 L 50,480 Z"
            fill="#0a1530"
            stroke="#172750"
            strokeWidth="1.2"
          />
          <path
            d="M 120,200 Q 300,160 500,220 T 700,190 L 720,480 L 100,480 Z"
            fill="#0d1b3d"
            stroke="#1e3268"
            strokeWidth="1.2"
          />
          <path
            d="M 160,300 Q 350,260 550,310 T 680,280 L 700,480 L 140,480 Z"
            fill="#10224d"
            stroke="#264082"
            strokeWidth="1.2"
          />

          {/* Active Layer Dynamic Heat Overlays */}
          {activeLayer === 'RISK' && (
            <g>
              <ellipse
                cx="480"
                cy="280"
                rx="180"
                ry="115"
                fill="url(#highRiskHeat)"
                filter="url(#hazardGlow)"
                className="animate-pulse"
              />
              <ellipse cx="480" cy="280" rx="180" ry="115" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="6,4" className="opacity-80" />
            </g>
          )}

          {activeLayer === 'RAINFALL' && (
            <circle
              cx="260"
              cy="130"
              r="200"
              fill="url(#rainHeat)"
              filter="url(#neonGlow)"
              className="animate-pulse"
            />
          )}

          {activeLayer === 'EXPOSURE' && (
            <g>
              <ellipse cx="480" cy="280" rx="140" ry="85" fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray="6,4" className="animate-pulse" />
              <ellipse cx="480" cy="280" rx="220" ry="140" fill="none" stroke="#eab308" strokeWidth="1.8" strokeDasharray="4,4" />
            </g>
          )}

          {/* River & Tributary Vector Network (Strahler Orders) */}
          <g>
            {/* Primary River Channel (Order 3) */}
            <path
              d="M 180,90 Q 280,140 360,220 T 480,280 T 640,420"
              fill="none"
              stroke="#0369a1"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Glowing Flow Vector Particles */}
            <path
              d="M 180,90 Q 280,140 360,220 T 480,280 T 640,420"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeDasharray="14 18"
              strokeDashoffset={-particleOffset * 2.2}
              filter="url(#neonGlow)"
            />

            {/* Tributary 1 (Order 2) */}
            <path
              d="M 320,60 Q 330,140 360,220"
              fill="none"
              stroke="#0284c7"
              strokeWidth="3.5"
            />
            <path
              d="M 320,60 Q 330,140 360,220"
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="2"
              strokeDasharray="8 14"
              strokeDashoffset={-particleOffset * 1.6}
            />

            {/* Tributary 2 (Order 1) */}
            <path
              d="M 520,110 Q 500,200 480,280"
              fill="none"
              stroke="#0284c7"
              strokeWidth="3"
            />
          </g>

          {/* Candidate Evacuation Vector Path (North Ridge Trail) with Travelling Energy Particle */}
          <g>
            <path
              d="M 480,280 Q 540,250 610,210"
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeDasharray="8 8"
              strokeDashoffset={-particleOffset * 1.2}
              filter="url(#neonGlow)"
            />
            {/* Blocked Riverbed Link */}
            <path
              d="M 480,280 Q 550,330 640,420"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              className="opacity-75"
            />
          </g>

          {/* Interactive Village & Sensor Nodes */}
          {mapNodes.map((node) => {
            const isSelected = selectedLocationId === node.id;
            return (
              <g
                key={node.id}
                className="cursor-pointer transition-all duration-300 group"
                onClick={() => onSelectLocation && onSelectLocation(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Outer Pulsing Aura */}
                {isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="26"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Node Symbol */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? '13' : '10'}
                  fill={
                    node.type === 'SHELTER'
                      ? '#10b981'
                      : node.risk === 'HIGH'
                      ? '#f97316'
                      : '#38bdf8'
                  }
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '3.5' : '2'}
                  filter="url(#neonGlow)"
                  className="transition-all duration-200 group-hover:scale-125"
                />

                {/* Label Box */}
                <text
                  x={node.x}
                  y={node.y + 24}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize={isSelected ? '12' : '10'}
                  fontWeight={isSelected ? 'bold' : '600'}
                  className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-mono"
                >
                  {node.name.split(' (')[0]}
                </text>

                <text
                  x={node.x}
                  y={node.y + 36}
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize="9"
                  fontWeight="bold"
                  className="pointer-events-none font-mono"
                >
                  {node.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Collapsible GIS Legend with Glassmorphism */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="glass-panel-glow rounded-xl shadow-2xl overflow-hidden text-xs">
          <div
            onClick={() => setLegendOpen(!legendOpen)}
            className="px-3.5 py-2.5 border-b border-cyan-500/20 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/60 transition"
          >
            <span className="font-mono font-bold text-cyan-300 text-[11px] flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400 animate-pulse" />
              GIS MAP OVERLAY CONTROLS
            </span>
            {legendOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
          </div>

          {legendOpen && (
            <div className="p-3.5 space-y-2 text-[11px] font-mono">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] shrink-0" />
                <span className="text-slate-200">High Model Risk (&gt;55/100)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-1.5 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] shrink-0 rounded" />
                <span className="text-slate-200">Active River Surge Channel</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-1.5 border-b-2 border-dashed border-emerald-400 shrink-0" />
                <span className="text-slate-200">Candidate Lower-Exposure Path</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-1.5 border-b-2 border-dashed border-rose-500 shrink-0" />
                <span className="text-slate-200">Blocked / Inundated Link</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0" />
                <span className="text-slate-200">Candidate Shelter Facility</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Coordinates Pill */}
      <div className="absolute bottom-4 right-4 z-20 glass-panel px-3.5 py-1.5 rounded-xl text-[11px] font-mono text-cyan-300 shadow-xl border border-cyan-500/20">
        30.5050° N, 79.1550° E • WGS84 • EPSG:32644
      </div>
    </div>
  );
};
