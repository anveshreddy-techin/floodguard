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

          {/* 5-Stage Process Pipeline Ribbon at top of main view */}
          <div className="hidden lg:flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 z-10 shrink-0 shadow-sm text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-xs">Flood Risk Command Center</span>
              <span className="text-slate-400">•</span>
              <span className="text-[11px] text-slate-500 font-medium">Monitor • Predict • Alert • Respond</span>
            </div>

            {/* 5 Connected Steps Ribbon */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <div className="flex items-center gap-1.5 bg-blue-50/90 border border-blue-200 px-2 py-1 rounded-md shrink-0">
                <Database className="w-3 h-3 text-blue-600" />
                <span className="font-bold text-slate-800 text-[11px]">Multi-Source Data</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

              <div className="flex items-center gap-1.5 bg-indigo-50/90 border border-indigo-200 px-2 py-1 rounded-md shrink-0">
                <Brain className="w-3 h-3 text-indigo-600" />
                <span className="font-bold text-slate-800 text-[11px]">AI Analysis</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

              <div className="flex items-center gap-1.5 bg-emerald-50/90 border border-emerald-200 px-2 py-1 rounded-md shrink-0">
                <MapIcon className="w-3 h-3 text-emerald-600" />
                <span className="font-bold text-slate-800 text-[11px]">GIS Mapping</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

              <div className="flex items-center gap-1.5 bg-amber-50/90 border border-amber-200 px-2 py-1 rounded-md shrink-0">
                <Bell className="w-3 h-3 text-amber-600" />
                <span className="font-bold text-slate-800 text-[11px]">Alerts</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

              <div className="flex items-center gap-1.5 bg-teal-50/90 border border-teal-200 px-2 py-1 rounded-md shrink-0">
                <Home className="w-3 h-3 text-teal-600" />
                <span className="font-bold text-slate-800 text-[11px]">Response Support</span>
              </div>
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

            {/* ── LEFT COLUMN OVER MAP: Roles Button + Citizen Guidance HUD ── */}
            <div className="hidden md:flex absolute top-3 left-3 z-[750] flex-col items-start gap-2 pointer-events-none">

              {/* ROLES Button (10 Statutory Roles Mission Workspaces) */}
              <Link
                href="/role-workspace"
                className="pointer-events-auto bg-white/95 hover:bg-white border border-slate-200 px-3.5 py-2 text-slate-800 hover:text-blue-600 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 shadow-md active:scale-95 transition"
                title="Open Role-Adaptive Mission Workspace for 10 Statutory Roles (Hotkey: W)"
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>ROLES</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-600 text-white font-bold">
                  10
                </span>
              </Link>

              {/* Citizen Guidance HUD */}
              {isCitizen && (
                <div className="pointer-events-auto w-80 bg-white/95 border border-slate-200 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
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
                      <Compass className="w-3.5 h-3.5" /> CANDIDATE ROUTE
                    </Link>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-mono text-center flex items-center justify-center gap-1 shadow transition active:scale-95 animate-pulse"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> CALL RESCUE
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                    <span>Nearest Shelter: </span>
                    <strong className="text-slate-800">Govt. High School (1.4 km)</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Citizen HUD */}
            {isCitizen && (
              <div className="md:hidden absolute top-3 left-3 right-3 z-[450] bg-white/95 border border-slate-200 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
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
                    <Compass className="w-3.5 h-3.5" /> CANDIDATE ROUTE
                  </Link>
                  <button
                    onClick={() => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('open-emergency-modal')); }}
                    className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-mono text-center flex items-center justify-center gap-1 shadow transition active:scale-95 animate-pulse"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> CALL RESCUE
                  </button>
                </div>
              </div>
            )}

            {/* ── Hotkey Hint Bar (bottom-left over map) ── */}
            <div className="hidden md:flex absolute bottom-20 left-3 z-[600] bg-white/90 backdrop-blur-md rounded-xl px-3 py-2 text-[10px] font-mono text-slate-600 items-center gap-2 border border-slate-200 shadow-md">
              <span className="text-blue-600 font-bold">HOTKEYS:</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-bold border border-slate-200">W</span>
              <span>Roles</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-bold border border-slate-200">M</span>
              <span>Map</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-bold border border-slate-200">S</span>
              <span>Safety</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-bold border border-slate-200">H</span>
              <span>Hindcast</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-bold border border-slate-200">R</span>
              <span>Replay</span>
            </div>

            {/* ── Desktop Dockable Intelligence Panel ── */}
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

            {/* ── Command Timeline Strip (T-60m to NOW with Speed, Reset & Play/Pause) ── */}
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
