'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { LiveRiskMap } from '@/components/ui/LiveRiskMap';
import { VillageIntelligenceDrawer } from '@/components/ui/VillageIntelligenceDrawer';
import { CommandTimeline } from '@/components/ui/CommandTimeline';
import { CopilotDrawer } from '@/components/ui/CopilotDrawer';
import { MobileBottomSheet } from '@/components/ui/MobileBottomSheet';
import { DesktopIntelligencePanel } from '@/components/ui/DesktopIntelligencePanel';
import { useLocation } from '@/context/LocationContext';
import { useEnvironment } from '@/context/EnvironmentContext';
import { useAdaptive } from '@/context/AdaptiveContext';
import { 
  Bot, 
  Layers, 
  ChevronRight, 
  Activity, 
  ChevronUp, 
  ChevronDown, 
  ShieldAlert, 
  MapPin, 
  PhoneCall, 
  AlertTriangle, 
  Compass, 
  Users,
  Database,
  Brain,
  Map as MapIcon,
  Bell,
  Home
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CommandCenterPage() {
  const router = useRouter();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const { setPage, setMode, setRiskState, setRainfallMm, setRiverStage } = useEnvironment();
  const { isCitizen, t } = useAdaptive();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('NOW');
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [mobileBottomSheetOpen, setMobileBottomSheetOpen] = useState(false);

  useEffect(() => {
    setPage('command-center');
    setMode('DEMO');
    setRiskState('HIGH');
    setRainfallMm(48);
    setRiverStage(3.8);
  }, [setPage, setMode, setRiskState, setRainfallMm, setRiverStage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'w' || e.key === 'W') router.push('/role-workspace');
      if (e.key === 's' || e.key === 'S') router.push('/safety');
      if (e.key === 'm' || e.key === 'M') router.push('/map');
      if (e.key === 'h' || e.key === 'H') router.push('/hindcast');
      if (e.key === 'r' || e.key === 'R') router.push('/replay');
      if (e.key === 'l' || e.key === 'L') {
        window.dispatchEvent(new CustomEvent('open-location-selector'));
      }
      if (e.key === 'Escape') { setDrawerOpen(false); setCopilotOpen(false); setMobileBottomSheetOpen(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <div className="flex flex-col h-screen overflow-hidden select-none bg-[#F0F4F8]">
      {/* ── TOP HEADER (Clean professional light bar with all options) ── */}
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />

      <div className="flex flex-1 min-h-0 relative">
        {/* ── DESKTOP SIDEBAR (All 28 options across 5 categories in clean navy #1B2A3B) ── */}
        <Sidebar activeTab="overview" />

        {/* ── MAIN COMMAND HERO AREA ── */}
        <main className="flex-1 relative min-h-0 overflow-hidden flex flex-col">

          {/* Core Prediction Architecture Strip: 4 Physical Pillars + IoT Real-Time + Ward Warnings + Lead Time */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-white text-slate-800 border-b border-slate-200 z-10 shrink-0 shadow-sm text-xs overflow-x-auto no-scrollbar gap-2.5 select-none">
            
            {/* Left: Core Mission Focus Tagline + AI Video Trigger */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono text-[10px] font-bold tracking-wider">
                CORE MANDATE
              </span>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('open-how-it-works-modal'));
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 border border-cyan-400 text-cyan-700 font-mono font-bold text-[11px] shadow-sm active:scale-95 transition"
                title="Watch AI Video & Interactive Simulation of How FloodGuard AI Prevents Disasters"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                <span>▶ AI VIDEO: HOW IT WORKS</span>
              </button>
            </div>

            {/* Middle: The 4 Physical Pillars + IoT Telemetry */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href="/weather"
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[11px] font-semibold transition"
                title="Pillar 1: Rainfall (AWS Telemetry & Radar NWP Accumulation)"
              >
                <span>🌧️ Rainfall</span>
                <span className="text-[10px] text-blue-800 font-mono bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200 font-bold">48mm/3h</span>
              </Link>

              <Link
                href="/sensors"
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[11px] font-semibold transition"
                title="Pillar 2: Soil Moisture (TDR Probe & Catchment Saturation)"
              >
                <span>🌱 Soil Saturation</span>
                <span className="text-[10px] text-amber-800 font-mono bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 font-bold">82%</span>
              </Link>

              <Link
                href="/cascade"
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-[11px] font-semibold transition"
                title="Pillar 3: Slope Stability (Topographic DEM Angle & Factor of Safety)"
              >
                <span>⛰️ Slope FoS</span>
                <span className="text-[10px] text-red-800 font-mono bg-red-100 px-1.5 py-0.5 rounded border border-red-200 font-bold">0.94</span>
              </Link>

              <Link
                href="/benchmark"
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[11px] font-semibold transition"
                title="Pillar 4: Historical Disaster Data (18 Disasters 2000-2026 LOOCV Verified)"
              >
                <span>📚 Historical Data</span>
                <span className="text-[10px] text-indigo-800 font-mono bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200 font-bold">18 Events</span>
              </Link>

              <Link
                href="/sensors"
                className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 text-[11px] font-semibold transition"
                title="IoT Sensor Network: FMCW Radar, AWS Rain, TDR Soil, Geophone"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>IoT Mesh: LIVE</span>
              </Link>
            </div>

            {/* Right: Hyper-Local Ward Warning & Actionable Lead Time */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href="/village/loc-uk-chamoli"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-700 text-[11px] font-bold transition shadow-sm"
                title="Hyper-Local Village / Ward Level Early Warnings"
              >
                <span>🏘️ Ward Warning:</span>
                <span className="text-amber-600 font-mono font-black">Level 3</span>
              </Link>

              <Link
                href="/safety"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 border border-red-500 text-white text-[11px] font-bold transition shadow-sm animate-pulse"
                title="Actionable Early Lead Time for Safe Evacuation"
              >
                <span>⏱️ Lead Time:</span>
                <span className="text-white font-mono font-black">42 Min</span>
              </Link>
            </div>

          </div>

          {/* Master Interactive Spatial GIS Map Container */}
          <div className="flex-1 relative min-h-0 overflow-hidden">
            <LiveRiskMap
              onSelectLocation={(loc) => {
                setSelectedLocation(loc);
                setDrawerOpen(true);
              }}
              selectedLocationId={selectedLocation?.id}
              simulatedTimeStep={currentStep}
            />

            {/* ── TOP-LEFT: ROLES Button (always visible, small) ── */}
            <div className="hidden md:flex absolute top-3 left-3 z-[750] pointer-events-none">
              <Link
                href="/role-workspace"
                className="pointer-events-auto bg-white/95 hover:bg-white border border-slate-200 px-3 py-1.5 text-slate-800 hover:text-blue-600 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 shadow-md active:scale-95 transition"
                title="Open Role-Adaptive Mission Workspace for 10 Statutory Roles (Hotkey: W)"
              >
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>ROLES</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold">10</span>
              </Link>
            </div>

            {/* ── TOP-LEFT (below ROLES): Citizen Guidance HUD — only shown for citizen role ── */}
            {isCitizen && (
              <div className="hidden md:block pointer-events-auto absolute top-12 left-3 z-[750] w-72 bg-white/95 border border-slate-200 rounded-2xl p-3.5 shadow-xl backdrop-blur-md space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-800 font-bold flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" /> {t('what_to_do')}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-100 text-red-700 border border-red-200">
                    {selectedLocation?.riskLevel || 'HIGH'} RISK
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {t('action_evacuate')}. River stage is rising rapidly (+0.40m/h). Do not attempt bridge crossings.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/safety"
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-mono text-center flex items-center justify-center gap-1 shadow transition active:scale-95"
                  >
                    <Compass className="w-3.5 h-3.5" /> SAFE ROUTE
                  </Link>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-mono text-center flex items-center justify-center gap-1 shadow transition active:scale-95 animate-pulse"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> CALL 112
                  </button>
                </div>
                <div className="pt-1 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                  <span>Nearest Shelter: </span>
                  <strong className="text-slate-800">Govt. High School (1.4 km)</strong>
                </div>
              </div>
            )}

            {/* Mobile Citizen HUD */}
            {isCitizen && (
              <div className="md:hidden absolute top-14 left-2 right-2 z-[450] bg-white/95 border border-slate-200 rounded-2xl p-3.5 shadow-xl backdrop-blur-md space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-800 font-bold flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" /> {t('what_to_do')}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-100 text-red-700 border border-red-200">
                    {selectedLocation?.riskLevel || 'HIGH'} RISK
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/safety" className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-mono text-center flex items-center justify-center gap-1 shadow transition active:scale-95">
                    <Compass className="w-3.5 h-3.5" /> SAFE ROUTE
                  </Link>
                  <button
                    onClick={() => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('open-emergency-modal')); }}
                    className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-mono text-center flex items-center justify-center gap-1 shadow transition active:scale-95 animate-pulse"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> CALL 112
                  </button>
                </div>
              </div>
            )}


            {/* ── RIGHT: Desktop Dockable Intelligence Panel (starts minimized) ── */}
            <DesktopIntelligencePanel
              score={selectedLocation?.riskScore || 68.5}
              level={selectedLocation?.riskLevel || 'HIGH'}
              rainfall={48}
              riverStage={3.8}
              locationName={selectedLocation?.name || 'Sunderbans Nagar'}
            />

            {/* ── Mobile Bottom Sheet ── */}
            <MobileBottomSheet
              score={selectedLocation?.riskScore || 68.5}
              level={selectedLocation?.riskLevel || 'HIGH'}
              rainfall={48}
              riverStage={3.8}
              isOpen={mobileBottomSheetOpen}
              onToggle={() => setMobileBottomSheetOpen(!mobileBottomSheetOpen)}
              onClose={() => setMobileBottomSheetOpen(false)}
            />

            {/* ── Command Timeline Strip (absolute bottom-0, always visible) ── */}
            <div className="absolute bottom-0 left-0 right-0 z-[600]">
              <CommandTimeline
                currentStep={currentStep}
                onStepChange={(step) => setCurrentStep(step)}
              />
            </div>
          </div>

        </main>

        {/* ── Slide-in Village Intelligence Drawer ── */}
        {drawerOpen && selectedLocation && (
          <VillageIntelligenceDrawer
            location={selectedLocation}
            onClose={() => setDrawerOpen(false)}
          />
        )}

        {/* ── AI Disaster Copilot Drawer ── */}
        <CopilotDrawer
          isOpen={copilotOpen}
          onClose={() => setCopilotOpen(false)}
        />
      </div>
    </div>
  );
}
