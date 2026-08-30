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
import { Bot, Layers, ChevronRight, Activity, ChevronUp, ChevronDown, ShieldAlert, MapPin, PhoneCall, AlertTriangle, Compass, Users } from 'lucide-react';
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
      if (e.key === 'Escape') { setDrawerOpen(false); setCopilotOpen(false); setMobileBottomSheetOpen(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    /* Full-viewport — Map is the PRIMARY focal hero */
    <div className="flex flex-col h-screen overflow-hidden select-none bg-[#020714]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />

      <div className="flex flex-1 min-h-0 relative">
        {/* Desktop Sidebar: 250px collapsible — hidden on mobile */}
        <Sidebar activeTab="overview" />

        {/* ── HERO: Master Spatial GIS Vector Map (Unobstructed) ── */}
        <main className="flex-1 relative min-h-0 overflow-hidden">
          <LiveRiskMap
            onSelectLocation={(loc) => {
              setSelectedLocation(loc);
              setDrawerOpen(true);
            }}
            selectedLocationId={selectedLocation?.id}
            simulatedTimeStep={currentStep}
          />

          {/* ── Floating Role Workspaces Trigger Button (Top Left, z-[750]) ── */}
          <Link
            href="/role-workspace"
            className="absolute top-3 left-3 z-[750] fp fp-operational px-3 py-1.5 sm:px-3.5 sm:py-2 text-cyan-300 hover:text-white rounded-xl text-xs font-black font-mono flex items-center gap-1.5 shadow-2xl active:scale-95 transition border border-cyan-500/40"
            title="Open Role-Adaptive Mission Workspace for 10 Statutory Roles (Hotkey: W)"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xs:inline">ROLES</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-800">
              10
            </span>
          </Link>

          {/* ── Floating Copilot Trigger Button (Top Right, z-[750]) ── */}
          <button
            onClick={() => setCopilotOpen(true)}
            className="absolute top-3 right-3 z-[750] btn-primary px-3 py-1.5 sm:px-4 sm:py-2 text-white rounded-xl text-xs font-black font-mono flex items-center gap-1.5 sm:gap-2 shadow-2xl active:scale-95 transition"
          >
            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 animate-pulse" />
            <span>COPILOT</span>
          </button>

          {/* ── Citizen Role Floating Guidance HUD (When role is CITIZEN) ── */}
          {isCitizen && (
            <div className="absolute top-16 left-3 right-3 sm:right-auto sm:w-80 z-[700] bg-slate-950/95 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" /> {t('what_to_do')}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {selectedLocation?.riskLevel || 'HIGH'} RISK
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {t('action_evacuate')}. River stage is rising rapidly (+0.40m/h). Do not attempt bridge crossings.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/safety"
                  className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono text-center flex items-center justify-center gap-1 shadow-lg transition active:scale-95"
                >
                  <Compass className="w-3.5 h-3.5" /> SAFE ROUTE
                </Link>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono text-center flex items-center justify-center gap-1 shadow-lg transition active:scale-95 animate-pulse"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> CALL RESCUE
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                <span>Nearest Shelter: </span>
                <strong className="text-white">Community High School (1.4 km)</strong>
              </div>
            </div>
          )}

          {/* ── Desktop Dockable / Minimizable Right Panel (z-[700]) ── */}
          <DesktopIntelligencePanel
            score={selectedLocation?.riskScore || 68.5}
            level={selectedLocation?.riskLevel || 'HIGH'}
            rainfall={48}
            riverStage={3.8}
            locationName={selectedLocation?.name || 'Sunderbans Nagar'}
          />

          {/* ── Mobile Bottom Sheet (z-[650], 100% map visible when collapsed) ── */}
          <MobileBottomSheet
            score={selectedLocation?.riskScore || 68.5}
            level={selectedLocation?.riskLevel || 'HIGH'}
            rainfall={48}
            riverStage={3.8}
            isOpen={mobileBottomSheetOpen}
            onToggle={() => setMobileBottomSheetOpen(!mobileBottomSheetOpen)}
            onClose={() => setMobileBottomSheetOpen(false)}
          />

          {/* ── Desktop Floating Hotkey Hint (bottom-left over map, z-[600]) ── */}
          <div className="hidden md:flex absolute bottom-20 left-4 z-[600] fp rounded-xl px-3 py-2 text-[10px] font-mono text-slate-400 items-center gap-2">
            <span className="text-cyan-400 font-bold">HOTKEYS:</span>
            <span className="bg-slate-900/80 px-1.5 py-0.5 rounded text-cyan-300 border border-slate-700">W</span>
            <span>Roles</span>
            <span className="bg-slate-900/80 px-1.5 py-0.5 rounded text-cyan-300 border border-slate-700">M</span>
            <span>Map</span>
            <span className="bg-slate-900/80 px-1.5 py-0.5 rounded text-cyan-300 border border-slate-700">S</span>
            <span>Safety</span>
            <span className="bg-slate-900/80 px-1.5 py-0.5 rounded text-cyan-300 border border-slate-700">H</span>
            <span>Hindcast</span>
            <span className="bg-slate-900/80 px-1.5 py-0.5 rounded text-cyan-300 border border-slate-700">R</span>
            <span>Replay</span>
          </div>

          {/* ── Bottom Command Timeline strip (z-[600]) ── */}
          <div className="absolute bottom-0 left-0 right-0 z-[600]">
            <CommandTimeline
              currentStep={currentStep}
              onStepChange={(step) => setCurrentStep(step)}
            />
          </div>
        </main>

        {/* ── Slide-in Village Intelligence Drawer (z-[800]) ── */}
        {drawerOpen && selectedLocation && (
          <VillageIntelligenceDrawer
            location={selectedLocation}
            onClose={() => setDrawerOpen(false)}
          />
        )}

        {/* ── AI Copilot Drawer (z-[850]) ── */}
        <CopilotDrawer
          isOpen={copilotOpen}
          onClose={() => setCopilotOpen(false)}
        />
      </div>
    </div>
  );
}
