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
import { Bot, Layers, ChevronRight, Activity, ChevronUp, ChevronDown, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CommandCenterPage() {
  const router = useRouter();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const { setPage, setMode, setRiskState, setRainfallMm, setRiverStage } = useEnvironment();

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

          {/* ── Floating Copilot Trigger Button (Top Right, z-[750]) ── */}
          <button
            onClick={() => setCopilotOpen(true)}
            className="absolute top-3 right-3 z-[750] btn-primary px-3 py-1.5 sm:px-4 sm:py-2 text-white rounded-xl text-xs font-black font-mono flex items-center gap-1.5 sm:gap-2 shadow-2xl active:scale-95 transition"
          >
            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 animate-pulse" />
            <span>COPILOT</span>
          </button>

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
