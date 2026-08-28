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
  Info
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

  // Animated stream particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticleOffset((prev) => (prev + 1) % 100);
    }, 40);
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
    <div className="relative w-full h-full bg-[#070d1e] overflow-hidden select-none flex flex-col justify-between">
      {/* Top Floating Map Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <div className="bg-[#0e1630]/95 backdrop-blur-md border border-[#223354] rounded-lg p-1 flex items-center gap-1 shadow-2xl">
          {(['RISK', 'RAINFALL', 'SOIL', 'TERRAIN', 'RIVER', 'EXPOSURE'] as MapLayerType[]).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-all ${
                activeLayer === layer
                  ? 'bg-blue-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>

        <div className="bg-[#0e1630]/90 backdrop-blur-md border border-[#223354] px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300 flex items-center gap-2 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>STEP: {simulatedTimeStep}</span>
        </div>
      </div>

      {/* Primary SVG Interactive Canvas */}
      <div className="w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="highRiskHeat" cx="60%" cy="56%" r="45%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
            </radialGradient>

            <radialGradient id="rainHeat" cx="30%" cy="20%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </radialGradient>

            <linearGradient id="streamFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Topographic Contour Bands */}
          <path
            d="M 50,50 Q 200,20 400,60 T 750,40 L 780,480 L 20,480 Z"
            fill="#09122a"
            stroke="#162244"
            strokeWidth="1.5"
          />
          <path
            d="M 80,120 Q 240,90 440,140 T 720,110 L 750,480 L 50,480 Z"
            fill="#0c1836"
            stroke="#1b2a54"
            strokeWidth="1.2"
          />
          <path
            d="M 120,200 Q 300,160 500,220 T 700,190 L 720,480 L 100,480 Z"
            fill="#0f1f45"
            stroke="#23366a"
            strokeWidth="1.2"
          />
          <path
            d="M 160,300 Q 350,260 550,310 T 680,280 L 700,480 L 140,480 Z"
            fill="#122552"
            stroke="#2c4485"
            strokeWidth="1.2"
          />

          {/* Active Layer Dynamic Overlays */}
          {activeLayer === 'RISK' && (
            <ellipse
              cx="480"
              cy="280"
              rx="170"
              ry="110"
              fill="url(#highRiskHeat)"
              className="animate-pulse"
            />
          )}

          {activeLayer === 'RAINFALL' && (
            <circle
              cx="260"
              cy="130"
              r="190"
              fill="url(#rainHeat)"
              className="animate-pulse"
            />
          )}

          {activeLayer === 'EXPOSURE' && (
            <g>
              <ellipse cx="480" cy="280" rx="140" ry="85" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="6,4" className="animate-pulse" />
              <ellipse cx="480" cy="280" rx="220" ry="140" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="4,4" />
            </g>
          )}

          {/* River & Tributary Vector Network (Strahler Orders) */}
          <g>
            {/* Primary River Channel (Order 3) */}
            <path
              d="M 180,90 Q 280,140 360,220 T 480,280 T 640,420"
              fill="none"
              stroke="#0284c7"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Animated Flow Highlight */}
            <path
              d="M 180,90 Q 280,140 360,220 T 480,280 T 640,420"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="12 18"
              strokeDashoffset={-particleOffset * 2}
              filter="url(#glow)"
            />

            {/* Tributary 1 (Order 2) */}
            <path
              d="M 320,60 Q 330,140 360,220"
              fill="none"
              stroke="#0369a1"
              strokeWidth="3"
            />
            <path
              d="M 320,60 Q 330,140 360,220"
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="1.5"
              strokeDasharray="8 12"
              strokeDashoffset={-particleOffset * 1.5}
            />

            {/* Tributary 2 (Order 1) */}
            <path
              d="M 520,110 Q 500,200 480,280"
              fill="none"
              stroke="#0369a1"
              strokeWidth="2.5"
            />
          </g>

          {/* Candidate Evacuation Vector Path (North Ridge Trail) */}
          <g>
            <path
              d="M 480,280 Q 540,250 610,210"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeDasharray="6 6"
              strokeDashoffset={-particleOffset}
            />
            {/* Blocked Riverbed Link */}
            <path
              d="M 480,280 Q 550,330 640,420"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
          </g>

          {/* Village & Sensor Nodes */}
          {mapNodes.map((node) => {
            const isSelected = selectedLocationId === node.id;
            return (
              <g
                key={node.id}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectLocation && onSelectLocation(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Outer Pulsing Ping for Selected / High Risk */}
                {isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="22"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    className="animate-ping opacity-60"
                  />
                )}

                {/* Node Symbol */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? '12' : '9'}
                  fill={
                    node.type === 'SHELTER'
                      ? '#10b981'
                      : node.risk === 'HIGH'
                      ? '#f97316'
                      : '#38bdf8'
                  }
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '3' : '1.5'}
                  filter="url(#glow)"
                />

                {/* Node Label Text */}
                <text
                  x={node.x}
                  y={node.y + 22}
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize={isSelected ? '12' : '10'}
                  fontWeight={isSelected ? 'bold' : '500'}
                  className="pointer-events-none drop-shadow-md font-mono"
                >
                  {node.name.split(' (')[0]}
                </text>

                <text
                  x={node.x}
                  y={node.y + 34}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                  className="pointer-events-none font-mono"
                >
                  {node.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Modern Collapsible Map Legend */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-[#0e1630]/95 backdrop-blur-md border border-[#223354] rounded-lg shadow-2xl overflow-hidden text-xs">
          <div
            onClick={() => setLegendOpen(!legendOpen)}
            className="px-3 py-2 border-b border-slate-800 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/50"
          >
            <span className="font-mono font-bold text-slate-300 text-[11px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              GIS MAP LEGEND
            </span>
            {legendOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
          </div>

          {legendOpen && (
            <div className="p-3 space-y-2 text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />
                <span className="text-slate-300">High Flash Flood Risk (&gt;55/100)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-cyan-400 shrink-0" />
                <span className="text-slate-300">Active River Surge Channel</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 border-b-2 border-dashed border-emerald-400 shrink-0" />
                <span className="text-slate-300">Candidate Lower-Exposure Path</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 border-b-2 border-dashed border-rose-500 shrink-0" />
                <span className="text-slate-300">Blocked / Inundated Link</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-300">Candidate Shelter Facility</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Right Floating Coordinates Pill */}
      <div className="absolute bottom-4 right-4 z-20 bg-[#0e1630]/90 backdrop-blur-md border border-[#223354] px-3 py-1.5 rounded-lg text-[11px] font-mono text-slate-400 shadow-xl">
        30.5050° N, 79.1550° E • DATUM: WGS84 • PROJECTION: UTM 44N
      </div>
    </div>
  );
};
