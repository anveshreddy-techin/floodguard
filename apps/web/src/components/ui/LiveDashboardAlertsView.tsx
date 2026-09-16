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
  Clock,
  Radio,
  Mountain,
  CheckCircle2
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAdaptive } from '@/context/AdaptiveContext';
import { useLocation, LOCATIONS } from '@/context/LocationContext';

const DashboardRealMap = dynamic(() => import('./DashboardRealMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 font-mono text-xs border border-slate-200">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
        <span>Loading Satellite GIS Map...</span>
      </div>
    </div>
  ),
});

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
  const loc = adaptiveLocation || ctxLocation || LOCATIONS.find(l => l.id === 'loc-uk-chamoli') || LOCATIONS[0];

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

    // Default matching Chamoli / Rishiganga 2021 surge
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
  const needleAngle = -90 + (summary.riskPercent / 100) * 180;

  return (
    <div className="w-full h-full bg-[#F0F4F8] text-slate-900 flex flex-col overflow-y-auto select-none rounded-2xl border border-slate-200 shadow-sm p-2 sm:p-4 font-sans">
      {/* ── TOP HEADER: 4. LIVE DASHBOARD & ALERTS ── */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-ping shrink-0" />
          <h1 className="text-base sm:text-lg md:text-xl font-black font-mono tracking-wider text-slate-900 uppercase flex items-center gap-2">
            <span className="text-blue-600">4.</span> LIVE DASHBOARD &amp; ALERTS
          </h1>
          {loc && (
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
              {loc.name.split('/')[0].trim()} ({loc.state})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>REAL-TIME STREAM</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition border border-slate-200"
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
          
          {/* Card 1: OVERALL RISK & EXECUTIVE SPEEDOMETER GAUGE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-500 font-bold tracking-wider uppercase">
                OVERALL RISK
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-800 border border-red-300">
                LEVEL 3
              </span>
            </div>

            {/* Red Pill Banner */}
            <div className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 border border-red-500 text-white font-black font-sans flex items-center justify-between shadow-sm mb-2">
              <span className="text-xs sm:text-sm tracking-wider">HIGH RISK</span>
              <span className="text-sm sm:text-base font-mono">{summary.riskPercent}%</span>
            </div>

            {/* Precision Speedometer Gauge with Clear Calibration Zones */}
            <div className="relative w-44 h-26 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 200 120" className="w-full h-full">
                {/* 4 Colored Band Sectors with Exact Calibrated Ranges */}
                <path
                  d="M 20,105 A 80,80 0 0,1 53.6,38.4"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                <path
                  d="M 53.6,38.4 A 80,80 0 0,1 115,26.5"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="18"
                />
                <path
                  d="M 115,26.5 A 80,80 0 0,1 161,51"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="18"
                />
                <path
                  d="M 161,51 A 80,80 0 0,1 180,105"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="18"
                  strokeLinecap="round"
                />

                {/* Tick Mark Lines */}
                <line x1="20" y1="105" x2="30" y2="105" stroke="#ffffff" strokeWidth="1.5" />
                <line x1="100" y1="25" x2="100" y2="35" stroke="#ffffff" strokeWidth="1.5" />
                <line x1="180" y1="105" x2="170" y2="105" stroke="#ffffff" strokeWidth="1.5" />

                {/* Numeric Scale */}
                <text x="24" y="118" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">0%</text>
                <text x="94" y="20" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">50%</text>
                <text x="166" y="118" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">100%</text>

                {/* Needle */}
                <g transform={`rotate(${needleAngle}, 100, 105)`}>
                  <line
                    x1="100"
                    y1="105"
                    x2="100"
                    y2="32"
                    stroke="#0f172a"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <polygon points="97,42 100,26 103,42" fill="#dc2626" />
                  <circle cx="100" cy="105" r="9" fill="#0f172a" />
                  <circle cx="100" cy="105" r="4" fill="#ffffff" />
                </g>
              </svg>
            </div>

            {/* Dial Readout */}
            <div className="flex flex-col items-center -mt-1">
              <span className="text-2xl font-black font-mono text-red-600 leading-tight">
                {summary.riskPercent}%
              </span>
              <span className="text-[11px] font-black text-red-700 font-sans tracking-wider">
                HIGH RISK · LEVEL-3 DIRECTIVE
              </span>
              <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                Calibrated against IMD AWS & CWC Gauge data
              </span>
            </div>
          </div>

          {/* Card 2: CONFIDENCE LEVEL (WITH EXPLAINABLE BREAKDOWN) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-mono text-slate-500 font-bold tracking-wider uppercase">
                CONFIDENCE LEVEL
              </span>
              <span className="text-xs font-mono font-bold text-blue-700">
                {summary.confidencePercent}%
              </span>
            </div>
            
            {/* Blue Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200 p-0.5">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-700"
                style={{ width: `${summary.confidencePercent}%` }}
              />
            </div>

            {/* Explainable Telemetry Coverage Breakdown */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5 text-[10px] font-mono text-slate-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>IoT Sensors Online:</span>
                </span>
                <span className="font-bold text-slate-900">3 of 4 (75%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Radar Corroboration:</span>
                </span>
                <span className="font-bold text-blue-700">IMD AWS Active</span>
              </div>
              <div className="flex items-center justify-between text-amber-700">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Mid-Slope Soil-02:</span>
                </span>
                <span className="font-bold">Degraded (Fallback API)</span>
              </div>
            </div>
          </div>

          {/* Card 3: TREND (WITH ACTIONABLE TIMELINE PROGRESSION) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-slate-500 font-bold tracking-wider uppercase">
                  TREND (3-HOUR SURGE)
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-mono font-bold">
                  +14% / 3h
                </span>
              </div>
              <div className="text-xs font-black font-sans text-red-600 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-red-600" />
                <span>RAPIDLY ESCALATING</span>
              </div>
            </div>

            {/* Sparkline Chart */}
            <div className="w-full h-14 my-1 relative">
              <svg viewBox="0 0 160 46" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon
                  points="5,42 35,38 70,32 110,24 150,10 150,44 5,44"
                  fill="url(#trendGradient)"
                />
                <polyline
                  points="5,42 35,38 70,32 110,24 150,10"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="150" cy="10" r="3.5" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Lead-Time Trajectory Steps */}
            <div className="grid grid-cols-4 gap-1 text-center font-mono text-[9px] pt-1.5 border-t border-slate-100">
              <div className="bg-slate-50 p-1 rounded">
                <span className="text-slate-400 block">T-3h</span>
                <span className="font-bold text-slate-700">68%</span>
              </div>
              <div className="bg-slate-50 p-1 rounded">
                <span className="text-slate-400 block">T-2h</span>
                <span className="font-bold text-slate-700">74%</span>
              </div>
              <div className="bg-slate-50 p-1 rounded">
                <span className="text-slate-400 block">T-1h</span>
                <span className="font-bold text-amber-700">78%</span>
              </div>
              <div className="bg-red-50 border border-red-200 p-1 rounded">
                <span className="text-red-600 block font-bold">NOW</span>
                <span className="font-black text-red-700">82%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CENTER SECTION: REALISTIC SATELLITE MAP WITH VIBRANT DANGER OVERLAYS ── */}
        <div className="lg:col-span-6 flex flex-col gap-3 min-h-0">
          <DashboardRealMap
            location={loc}
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
          />

          {/* BOTTOM ROW: 4-FACTOR SCIENTIFIC EXPLANATION + RED EMERGENCY DIRECTIVE */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Left Box: 4 PHYSICAL DRIVERS (SIH26192 COMPLIANT & EASY TO UNDERSTAND) */}
            <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                <span className="text-[11px] font-mono text-blue-700 font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <span>EXPLANATION (WHY RISK IS HIGH)</span>
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-500">SIH26192 MODEL</span>
              </div>

              {/* 4 Multi-Hazard Factors Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-1 text-[10px] text-blue-800 font-bold">
                    <CloudRain className="w-3 h-3 text-blue-600" />
                    <span>RAINFALL (3h)</span>
                  </div>
                  <div className="font-mono font-black text-slate-900 text-sm mt-0.5">
                    48.2 mm <span className="text-[10px] text-blue-600 font-normal">(+26 pts, 35%)</span>
                  </div>
                  <div className="text-[9px] text-slate-600 leading-tight mt-0.5">
                    Extreme cloudburst cell over ridge
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-1 text-[10px] text-amber-800 font-bold">
                    <Droplets className="w-3 h-3 text-amber-600" />
                    <span>SOIL SATURATION</span>
                  </div>
                  <div className="font-mono font-black text-slate-900 text-sm mt-0.5">
                    82.4% <span className="text-[10px] text-amber-600 font-normal">(+20 pts, 25%)</span>
                  </div>
                  <div className="text-[9px] text-slate-600 leading-tight mt-0.5">
                    Zero infiltration buffer remaining
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-1 text-[10px] text-purple-800 font-bold">
                    <Mountain className="w-3 h-3 text-purple-600" />
                    <span>SLOPE STABILITY</span>
                  </div>
                  <div className="font-mono font-black text-slate-900 text-sm mt-0.5">
                    28.4° Mean <span className="text-[10px] text-purple-600 font-normal">(+11 pts, 20%)</span>
                  </div>
                  <div className="text-[9px] text-slate-600 leading-tight mt-0.5">
                    Steep canyon funnels rapid runoff
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="flex items-center gap-1 text-[10px] text-rose-800 font-bold">
                    <Waves className="w-3 h-3 text-rose-600" />
                    <span>RIVER SURGE RATE</span>
                  </div>
                  <div className="font-mono font-black text-slate-900 text-sm mt-0.5">
                    +0.40 m/h <span className="text-[10px] text-rose-600 font-normal">(+6 pts, 15%)</span>
                  </div>
                  <div className="text-[9px] text-slate-600 leading-tight mt-0.5">
                    Rising to 4.2m danger mark
                  </div>
                </div>
              </div>

              {/* Concluding physical insight */}
              <div className="mt-2 text-[10px] text-slate-600 font-mono bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                💡 <strong>PHYSICS SUMMARY:</strong> Heavy rainfall forecast → High soil saturation → Steep terrain → Rising river levels → High probability of flash flood in this area.
              </div>
            </div>

            {/* Right Box: ALERT DIRECTIVE (SOLID RED CARD) */}
            <div className="md:col-span-5 bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white rounded-2xl p-3.5 shadow-md flex flex-col justify-between border border-red-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-white animate-bounce" />
                  </div>
                  <div>
                    <span className="text-xs font-black font-mono tracking-wider uppercase block">
                      ALERT
                    </span>
                    <span className="text-[10px] text-red-200 font-mono">
                      LEAD TIME: {summary.leadTimeHours} HOURS
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-red-950/80 text-white font-mono text-[9px] font-bold border border-red-400/40">
                  ACTIVE
                </span>
              </div>

              <div className="my-2 bg-red-950/40 rounded-xl p-2.5 border border-red-400/30 text-xs text-red-50 font-medium leading-relaxed">
                🚨 <strong>High risk of flash flood in {summary.leadTimeHours} hours.</strong> Prepare for evacuation and rescue immediately.
              </div>

              <div className="flex items-center justify-between text-[10px] text-red-200 font-mono pt-1 border-t border-red-400/30">
                <span>⚠️ Bridge KM 0.6: OVERTOPPED</span>
                <span>NDRF / SDRF ALERTED</span>
              </div>
            </div>

          </div>

        </div>

        {/* ── RIGHT COLUMN (AFFECTED SUMMARY & RESCUE CORRIDORS) ── */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              <span className="text-xs sm:text-sm font-mono text-slate-900 font-black tracking-wider uppercase border-b border-slate-200 pb-2 flex items-center justify-between">
                <span>AFFECTED SUMMARY</span>
                <span className="text-[10px] text-blue-700 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  SIMULATION
                </span>
              </span>

              {/* Metrics List */}
              <div className="space-y-2.5 mt-3 text-xs sm:text-sm font-sans font-medium">
                {/* 1. Villages at Risk */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-700">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 font-bold">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-bold">Villages at Risk</span>
                      <span className="text-[10px] text-slate-500 font-mono">Raini, Reni, Tapovan...</span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-slate-900 text-base sm:text-lg">
                    {summary.villagesAtRisk}
                  </span>
                </div>

                {/* 2. Roads at Risk */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-700">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 font-mono text-xs font-bold">
                      🛣️
                    </div>
                    <div>
                      <span className="block font-bold">Roads at Risk</span>
                      <span className="text-[10px] text-slate-500 font-mono">NH-58 Malari Corridor</span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-slate-900 text-base sm:text-lg">
                    {summary.roadsAtRisk}
                  </span>
                </div>

                {/* 3. Bridges at Risk */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-700">
                    <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 shrink-0 font-mono text-xs font-bold">
                      🌉
                    </div>
                    <div>
                      <span className="block font-bold">Bridges at Risk</span>
                      <span className="text-[10px] text-slate-500 font-mono">1 Overtopped, 4 Monitored</span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-slate-900 text-base sm:text-lg">
                    {summary.bridgesAtRisk}
                  </span>
                </div>

                {/* 4. People Exposed */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-700">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-bold">People Exposed</span>
                      <span className="text-[10px] text-slate-500 font-mono">Priority Evacuation Roster</span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-slate-900 text-base sm:text-lg">
                    {summary.peopleExposed}
                  </span>
                </div>

                {/* 5. Nearest Shelters */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-700">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 font-mono text-xs font-bold">
                      🏕️
                    </div>
                    <div>
                      <span className="block font-bold">Nearest Shelters</span>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold">Primary: Lata High School</span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-slate-900 text-base sm:text-lg">
                    {summary.nearestShelters}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Link */}
            <div className="pt-3 border-t border-slate-200 mt-3">
              <a
                href="/safety"
                className="w-full py-2.5 px-3 rounded-xl font-mono text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm transition active:scale-95 bg-amber-500 hover:bg-amber-600 text-slate-950 border border-amber-600"
              >
                <Compass className="w-4 h-4" />
                <span>VIEW EVACUATION CORRIDORS</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveDashboardAlertsView;
