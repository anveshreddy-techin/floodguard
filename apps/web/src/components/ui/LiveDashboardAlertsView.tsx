'use client';

import React, { useState, useMemo } from 'react';
import { 
  Home, 
  MapPin, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CloudRain, 
  Waves, 
  Layers, 
  Droplets, 
  Compass,
  ArrowUpRight,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { useAdaptive } from '@/context/AdaptiveContext';
import { useLocation } from '@/context/LocationContext';

export type DashboardLayer = 'RISK' | 'RAINFALL' | 'RIVER' | 'SOIL' | 'LAYERS';

interface LiveDashboardAlertsViewProps {
  onClose?: () => void;
  standalone?: boolean;
}

export const LiveDashboardAlertsView: React.FC<LiveDashboardAlertsViewProps> = ({
  onClose,
  standalone = false,
}) => {
  const { selectedLocation: adaptiveLocation } = useAdaptive();
  const { selectedLocation: ctxLocation } = useLocation();
  const loc = adaptiveLocation || ctxLocation;

  const [activeLayer, setActiveLayer] = useState<DashboardLayer>('RISK');

  // Location-based summary figures with defaults matching the reference design
  const summary = useMemo(() => {
    const isAssam = loc?.state?.toLowerCase() === 'assam';
    const isChamoli = loc?.id === 'loc-uk-chamoli' || loc?.name?.toLowerCase().includes('raini');

    if (isAssam) {
      return {
        villagesAtRisk: 16,
        roadsAtRisk: '24 km',
        bridgesAtRisk: 6,
        peopleExposed: '14,200',
        nearestShelters: 12,
        riskPercent: 86,
        confidencePercent: 82,
        leadTimeHours: '2–4',
        explanation: 'Torrential Brahmaputra river surge + City drainage stormwater backflow + Saturated soil → Extreme waterlogging in riverside wards.',
      };
    }

    // Default matching reference image (Chamoli / Rishiganga 2021 surge)
    return {
      villagesAtRisk: 12,
      roadsAtRisk: '18 km',
      bridgesAtRisk: 5,
      peopleExposed: '8,450',
      nearestShelters: 9,
      riskPercent: 82,
      confidencePercent: 78,
      leadTimeHours: '3–6',
      explanation: 'Heavy rainfall forecast + High soil saturation + Steep terrain + Rising river levels → High probability of flash flood in this area.',
    };
  }, [loc]);

  // Speedometer Gauge Needle rotation angle (82% maps across 180 degrees from -90 to +90)
  // 0% = -90deg, 50% = 0deg, 100% = +90deg
  const needleAngle = -90 + (summary.riskPercent / 100) * 180;

  return (
    <div className="w-full h-full bg-[#050e1f] text-white flex flex-col overflow-y-auto select-none rounded-2xl border border-cyan-500/30 shadow-2xl p-2 sm:p-4 font-sans">
      {/* ── TOP HEADER: 4. LIVE DASHBOARD & ALERTS ── */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping shrink-0" />
          <h1 className="text-base sm:text-lg md:text-xl font-black font-mono tracking-wider text-white uppercase flex items-center gap-2">
            <span className="text-cyan-400">4.</span> LIVE DASHBOARD &amp; ALERTS
          </h1>
          {loc && (
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800">
              {loc.name.split('/')[0].trim()} ({loc.state})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>REAL-TIME STREAM</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Close Dashboard"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN THREE-COLUMN CONTAINER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
        
        {/* ── LEFT COLUMN (OVERALL RISK, CONFIDENCE, TREND) ── */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          
          {/* Card 1: OVERALL RISK & SPEEDOMETER GAUGE */}
          <div className="bg-[#0b1b36]/90 border border-cyan-500/30 rounded-2xl p-3.5 shadow-xl flex flex-col items-center text-center">
            <span className="text-[11px] font-mono text-slate-300 font-bold tracking-wider uppercase mb-2 self-start">
              OVERALL RISK
            </span>

            {/* Red Pill Banner */}
            <div className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 border border-rose-500 text-white font-black font-sans flex items-center justify-between shadow-lg mb-3">
              <span className="text-xs sm:text-sm tracking-wider">HIGH RISK</span>
              <span className="text-sm sm:text-base font-mono">{summary.riskPercent}%</span>
            </div>

            {/* SVG Speedometer Gauge matching media_1788886976760.png */}
            <div className="relative w-40 h-24 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 200 120" className="w-full h-full">
                {/* Gauge Background Arcs */}
                <defs>
                  {/* Outer drop shadow */}
                  <filter id="gaugeShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4" />
                  </filter>
                </defs>

                {/* 4 Colored Band Sectors: Green (0-25), Yellow (25-50), Orange (50-75), Red (75-100) */}
                {/* Green Sector (180deg to 135deg) */}
                <path
                  d="M 20,105 A 80,80 0 0,1 43.4,48.4"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                {/* Yellow Sector (135deg to 90deg) */}
                <path
                  d="M 43.4,48.4 A 80,80 0 0,1 100,25"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="20"
                />
                {/* Orange Sector (90deg to 45deg) */}
                <path
                  d="M 100,25 A 80,80 0 0,1 156.6,48.4"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="20"
                />
                {/* Red Sector (45deg to 0deg) */}
                <path
                  d="M 156.6,48.4 A 80,80 0 0,1 180,105"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="20"
                  strokeLinecap="round"
                />

                {/* Needle */}
                <g transform={`rotate(${needleAngle}, 100, 105)`}>
                  <line
                    x1="100"
                    y1="105"
                    x2="100"
                    y2="34"
                    stroke="#1e293b"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <polygon points="97,42 100,28 103,42" fill="#0f172a" />
                  <circle cx="100" cy="105" r="9" fill="#0f172a" />
                  <circle cx="100" cy="105" r="4" fill="#ffffff" />
                </g>
              </svg>
            </div>

            {/* Dial Label */}
            <div className="flex flex-col items-center -mt-2">
              <span className="text-2xl font-black font-mono text-red-500 leading-tight">
                {summary.riskPercent}%
              </span>
              <span className="text-[11px] font-black text-red-400 font-sans tracking-wider">
                HIGH RISK
              </span>
            </div>
          </div>

          {/* Card 2: CONFIDENCE LEVEL */}
          <div className="bg-[#0b1b36]/90 border border-cyan-500/30 rounded-2xl p-3.5 shadow-xl">
            <span className="text-[11px] font-mono text-slate-300 font-bold tracking-wider uppercase">
              CONFIDENCE LEVEL
            </span>
            <div className="text-2xl font-black font-mono text-white mt-1">
              {summary.confidencePercent}%
            </div>
            {/* Glowing cyan progress bar */}
            <div className="w-full bg-slate-900 rounded-full h-3 mt-2 overflow-hidden border border-slate-700/60 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-cyan-300 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-all duration-700"
                style={{ width: `${summary.confidencePercent}%` }}
              />
            </div>
          </div>

          {/* Card 3: TREND */}
          <div className="bg-[#0b1b36]/90 border border-cyan-500/30 rounded-2xl p-3.5 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono text-slate-300 font-bold tracking-wider uppercase">
                TREND
              </span>
              <div className="text-sm font-black font-sans text-rose-400 mt-1 flex items-center gap-1.5">
                <span>INCREASING</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 font-mono">
                  +14% / 3h
                </span>
              </div>
            </div>

            {/* Rising Sparkline Chart */}
            <div className="w-full h-16 mt-2 relative">
              <svg viewBox="0 0 160 50" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area fill */}
                <polygon
                  points="5,45 25,40 50,42 75,32 100,34 125,22 150,12 150,48 5,48"
                  fill="url(#trendGradient)"
                />
                {/* Trend line */}
                <polyline
                  points="5,45 25,40 50,42 75,32 100,34 125,22 150,12"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Upward Arrow at the tip */}
                <polygon points="144,8 154,12 148,19" fill="#ef4444" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── CENTER SECTION (MAP VIEW WITH COLOR OVERLAY + EXPLANATION & ALERT) ── */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          
          {/* MAP CONTAINER */}
          <div className="relative flex-1 min-h-[300px] sm:min-h-[360px] bg-[#071326] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Top Layer Control Bar */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-1 overflow-x-auto pb-1 pointer-events-auto">
              <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-xl">
                <button
                  onClick={() => setActiveLayer('RISK')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    activeLayer === 'RISK'
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>Risk Map</span>
                </button>
                <button
                  onClick={() => setActiveLayer('RAINFALL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    activeLayer === 'RAINFALL'
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <CloudRain className="w-3 h-3 text-cyan-400" />
                  <span>Rainfall</span>
                </button>
                <button
                  onClick={() => setActiveLayer('RIVER')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    activeLayer === 'RIVER'
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Waves className="w-3 h-3 text-blue-400" />
                  <span>River Levels</span>
                </button>
                <button
                  onClick={() => setActiveLayer('SOIL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    activeLayer === 'SOIL'
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Droplets className="w-3 h-3 text-amber-400" />
                  <span>Soil Moisture</span>
                </button>
                <button
                  onClick={() => setActiveLayer('LAYERS')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    activeLayer === 'LAYERS'
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Layers className="w-3 h-3 text-slate-300" />
                  <span>Layers</span>
                </button>
              </div>
            </div>

            {/* Realistic Topographic Valley Landscape SVG with Exact Red, Orange, Yellow, Green Colors Overlay */}
            <div className="w-full h-full relative overflow-hidden bg-[#133020]">
              <svg viewBox="0 0 700 420" className="w-full h-full object-cover">
                <defs>
                  {/* Mountain background gradient */}
                  <linearGradient id="mountainBg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e3a24" />
                    <stop offset="60%" stopColor="#2d5236" />
                    <stop offset="100%" stopColor="#25432b" />
                  </linearGradient>

                  {/* Red Risk Glow */}
                  <radialGradient id="redZoneGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                    <stop offset="70%" stopColor="#dc2626" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.65" />
                  </radialGradient>

                  {/* Orange Risk Glow */}
                  <radialGradient id="orangeZoneGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fb923c" stopOpacity="0.80" />
                    <stop offset="80%" stopColor="#f97316" stopOpacity="0.70" />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity="0.60" />
                  </radialGradient>

                  {/* Yellow Risk Glow */}
                  <radialGradient id="yellowZoneGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
                    <stop offset="80%" stopColor="#facc15" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#eab308" stopOpacity="0.55" />
                  </radialGradient>

                  {/* Green Safe Zone Glow */}
                  <radialGradient id="greenSafeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#86efac" stopOpacity="0.75" />
                    <stop offset="80%" stopColor="#4ade80" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.55" />
                  </radialGradient>
                </defs>

                {/* 1. Base Mountain & Valley Terrain Texture */}
                <rect width="700" height="420" fill="url(#mountainBg)" />

                {/* Mountain Ridge Contours */}
                <path d="M 0,160 Q 120,70 240,140 T 480,90 T 700,150 L 700,0 L 0,0 Z" fill="#1b3022" opacity="0.8" />
                <path d="M 0,220 Q 180,130 360,190 T 700,180 L 700,0 L 0,0 Z" fill="#24442e" opacity="0.6" />
                <path d="M 0,280 Q 200,210 400,270 T 700,240 L 700,420 L 0,420 Z" fill="#2d5236" opacity="0.7" />

                {/* 2. Road Network (Orange/Yellow connecting lines) */}
                <path d="M 20,380 Q 150,330 260,300 T 450,260 T 680,240" fill="none" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 120,40 Q 240,150 340,220 T 480,310 T 600,400" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6,4" />
                <path d="M 30,180 Q 180,200 320,240 T 560,200 T 690,140" fill="none" stroke="#b45309" strokeWidth="2" />

                {/* 3. Winding River Water Channel (Vibrant Blue Ribbon) */}
                <path
                  d="M 0,250 Q 80,240 140,270 T 260,220 T 360,240 T 480,180 T 600,120 T 700,90"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 0,250 Q 80,240 140,270 T 260,220 T 360,240 T 480,180 T 600,120 T 700,90"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Tributary River */}
                <path
                  d="M 360,240 Q 380,300 420,340 T 460,420"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M 360,240 Q 380,300 420,340 T 460,420"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* 4. EXACT MULTI-ZONE COLOR OVERLAYS FROM USER IMAGE */}
                {/* 🟩 GREEN ZONE (Lowest Risk / Safe Elevation Buffer) */}
                <ellipse
                  cx="540"
                  cy="320"
                  rx="65"
                  ry="45"
                  fill="url(#greenSafeGlow)"
                  stroke="#16a34a"
                  strokeWidth="2"
                  strokeDasharray="4,3"
                />

                {/* 🟨 YELLOW ZONE (Low Risk / Caution Perimeter) */}
                <path
                  d="M 440,190 C 490,170 570,180 590,230 C 600,270 540,290 480,270 C 440,260 410,210 440,190 Z"
                  fill="url(#yellowZoneGlow)"
                  stroke="#ca8a04"
                  strokeWidth="2"
                />

                {/* 🟧 ORANGE ZONE (Medium Risk / Surge Buffer) */}
                <path
                  d="M 320,180 C 390,160 470,190 460,250 C 450,290 380,300 330,270 C 290,250 280,200 320,180 Z"
                  fill="url(#orangeZoneGlow)"
                  stroke="#ea580c"
                  strokeWidth="2.5"
                />

                {/* 🟥 RED ZONE (High Risk / Inundation Core) */}
                <path
                  d="M 220,170 C 290,130 380,150 370,220 C 360,270 280,290 230,260 C 180,230 170,180 220,170 Z"
                  fill="url(#redZoneGlow)"
                  stroke="#dc2626"
                  strokeWidth="3"
                />
                {/* Secondary Red Spillover Pocket along riverbed */}
                <path
                  d="M 230,260 C 280,250 340,260 320,310 C 300,340 240,330 220,300 C 200,280 210,265 230,260 Z"
                  fill="url(#redZoneGlow)"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                />

                {/* 5. BRIDGES OVER THE RIVER */}
                {/* Bridge 1 at Confluence */}
                <g transform="translate(180, 240) rotate(15)">
                  <rect x="-14" y="-5" width="28" height="10" fill="#475569" rx="2" stroke="#e2e8f0" strokeWidth="1.5" />
                  <line x1="-12" y1="-5" x2="-12" y2="5" stroke="#f8fafc" strokeWidth="1.5" />
                  <line x1="12" y1="-5" x2="12" y2="5" stroke="#f8fafc" strokeWidth="1.5" />
                </g>
                {/* Bridge 2 */}
                <g transform="translate(420, 205) rotate(-25)">
                  <rect x="-14" y="-5" width="28" height="10" fill="#475569" rx="2" stroke="#e2e8f0" strokeWidth="1.5" />
                  <line x1="-12" y1="-5" x2="-12" y2="5" stroke="#f8fafc" strokeWidth="1.5" />
                  <line x1="12" y1="-5" x2="12" y2="5" stroke="#f8fafc" strokeWidth="1.5" />
                </g>

                {/* 6. VILLAGE / SETTLEMENT ICONS COLOR-CODED BY ZONE */}
                {/* Red Zone Houses (High Risk) */}
                <g transform="translate(260, 185)">
                  <circle cx="10" cy="10" r="14" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                  <text x="10" y="14" textAnchor="middle" fontSize="13" fill="#ffffff">🏠</text>
                </g>
                <g transform="translate(300, 160)">
                  <circle cx="10" cy="10" r="14" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                  <text x="10" y="14" textAnchor="middle" fontSize="13" fill="#ffffff">🏠</text>
                </g>
                <g transform="translate(270, 280)">
                  <circle cx="10" cy="10" r="14" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                  <text x="10" y="14" textAnchor="middle" fontSize="13" fill="#ffffff">🏠</text>
                </g>

                {/* Orange Zone Houses (Medium Risk) */}
                <g transform="translate(390, 220)">
                  <circle cx="10" cy="10" r="13" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                  <text x="10" y="14" textAnchor="middle" fontSize="12" fill="#ffffff">🏠</text>
                </g>

                {/* Yellow Zone Houses (Low Risk) */}
                <g transform="translate(510, 220)">
                  <circle cx="10" cy="10" r="13" fill="#eab308" stroke="#ffffff" strokeWidth="2" />
                  <text x="10" y="14" textAnchor="middle" fontSize="12" fill="#ffffff">🏠</text>
                </g>
                <g transform="translate(420, 310)">
                  <circle cx="10" cy="10" r="13" fill="#eab308" stroke="#ffffff" strokeWidth="2" />
                  <text x="10" y="14" textAnchor="middle" fontSize="12" fill="#ffffff">🏠</text>
                </g>

                {/* Outside Safe Houses (White/Green) */}
                <g transform="translate(140, 210)">
                  <circle cx="10" cy="10" r="12" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="10" y="14" textAnchor="middle" fontSize="11" fill="#ffffff">🏠</text>
                </g>
                <g transform="translate(230, 340)">
                  <circle cx="10" cy="10" r="12" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="10" y="14" textAnchor="middle" fontSize="11" fill="#ffffff">🏠</text>
                </g>
                <g transform="translate(570, 180)">
                  <circle cx="10" cy="10" r="12" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="10" y="14" textAnchor="middle" fontSize="11" fill="#ffffff">🏠</text>
                </g>

                {/* 7. SAFE SHELTER WITH BLUE BADGE (MATCHING USER IMAGE) */}
                <g transform="translate(615, 185)">
                  <circle cx="12" cy="12" r="15" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
                  <path d="M 6,17 L 12,8 L 18,17 Z" fill="#ffffff" />
                  <rect x="9" y="13" width="6" height="5" fill="#0284c7" />
                </g>

                {/* Evacuation Dashed Trail from Red to Blue Safe Shelter */}
                <path
                  d="M 310,165 Q 450,140 540,160 T 615,195"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeDasharray="6,5"
                />
              </svg>

              {/* Map Floating Badges Overlay */}
              <div className="absolute bottom-2 left-3 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-mono text-slate-300 backdrop-blur-md flex items-center gap-3">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-600 inline-block"/> High</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block"/> Medium</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-yellow-400 inline-block"/> Low</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"/> Safe</span>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: EXPLANATION + ALERT CARD */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Left Box: EXPLANATION (WHY RISK IS HIGH) */}
            <div className="md:col-span-7 bg-[#0b1c38]/95 border border-cyan-500/40 rounded-2xl p-3 sm:p-3.5 shadow-xl flex flex-col justify-center">
              <span className="text-[11px] font-mono text-cyan-300 font-bold tracking-wider uppercase mb-1 flex items-center gap-1.5">
                <span>EXPLANATION (WHY RISK IS HIGH)</span>
              </span>
              <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-sans">
                {summary.explanation}
              </p>
            </div>

            {/* Right Box: ALERT (SOLID RED CARD) */}
            <div className="md:col-span-5 bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl flex items-center justify-between gap-2.5 border border-red-400/50">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-black font-sans tracking-wide uppercase leading-tight">
                  ALERT
                </span>
                <span className="text-[11px] sm:text-xs text-red-50 leading-snug font-sans mt-0.5">
                  High risk of flash flood in {summary.leadTimeHours} hours. Prepare for evacuation and rescue.
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 hidden sm:flex">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </div>

          </div>

        </div>

        {/* ── RIGHT COLUMN (AFFECTED SUMMARY) ── */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="bg-[#0b1b36]/90 border border-cyan-500/30 rounded-2xl p-3.5 sm:p-4 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <span className="text-xs sm:text-sm font-mono text-white font-black tracking-wider uppercase border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>AFFECTED SUMMARY</span>
                <span className="text-[10px] text-cyan-400 font-mono">SIMULATION</span>
              </span>

              {/* Metrics List matching media_1788886962051.png */}
              <div className="space-y-3.5 mt-4 text-xs sm:text-sm font-sans font-medium">
                {/* 1. Villages at Risk */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Home className="w-4 h-4" />
                    </div>
                    <span>Villages at Risk</span>
                  </div>
                  <span className="font-mono font-black text-white text-base sm:text-lg">
                    {summary.villagesAtRisk}
                  </span>
                </div>

                {/* 2. Roads at Risk */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 font-mono text-xs font-bold">
                      🛣️
                    </div>
                    <span>Roads at Risk</span>
                  </div>
                  <span className="font-mono font-black text-white text-base sm:text-lg">
                    {summary.roadsAtRisk}
                  </span>
                </div>

                {/* 3. Bridges at Risk */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 font-mono text-xs font-bold">
                      🌉
                    </div>
                    <span>Bridges at Risk</span>
                  </div>
                  <span className="font-mono font-black text-white text-base sm:text-lg">
                    {summary.bridgesAtRisk}
                  </span>
                </div>

                {/* 4. People Exposed */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <span>People Exposed</span>
                  </div>
                  <span className="font-mono font-black text-white text-base sm:text-lg">
                    {summary.peopleExposed}
                  </span>
                </div>

                {/* 5. Nearest Shelters */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-mono text-xs font-bold">
                      🏕️
                    </div>
                    <span>Nearest Shelters</span>
                  </div>
                  <span className="font-mono font-black text-white text-base sm:text-lg">
                    {summary.nearestShelters}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Link */}
            <div className="pt-3 border-t border-slate-800/80 mt-3">
              <a
                href="/safety"
                className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-lg transition active:scale-95"
              >
                <Compass className="w-3.5 h-3.5" /> VIEW EVACUATION CORRIDORS
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveDashboardAlertsView;
