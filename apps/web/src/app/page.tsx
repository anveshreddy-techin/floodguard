'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { LiveRiskMap } from '@/components/ui/LiveRiskMap';
import { RiskDial } from '@/components/ui/RiskDial';
import { InteractiveAlertStream } from '@/components/ui/InteractiveAlertStream';
import { WhyRiskChangedPanel } from '@/components/ui/WhyRiskChangedPanel';
import { VillageIntelligenceDrawer } from '@/components/ui/VillageIntelligenceDrawer';
import { CommandTimeline } from '@/components/ui/CommandTimeline';
import { CopilotDrawer } from '@/components/ui/CopilotDrawer';
import { useLocation } from '@/context/LocationContext';
import { useEnvironment } from '@/context/EnvironmentContext';
import { Bot, Layers, ChevronRight } from 'lucide-react';
import { DataMode } from '@/types';
import { useRouter } from 'next/navigation';

export default function CommandCenterPage() {
  const router = useRouter();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const { setPage, setMode, setRiskState, setRainfallMm, setRiverStage } = useEnvironment();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('NOW');
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    setPage('command-center');
    setMode('DEMO');
    setRiskState('HIGH');
    setRainfallMm(48);
    setRiverStage(3.8);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 's' || e.key === 'S') router.push('/safety');
      if (e.key === 'h' || e.key === 'H') router.push('/hindcast');
      if (e.key === 'r' || e.key === 'R') router.push('/replay');
      if (e.key === 'Escape') { setDrawerOpen(false); setCopilotOpen(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    /* Full-viewport — map fills everything, content floats over */
    <div className="flex flex-col h-screen overflow-hidden">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />

      <div className="flex flex-1 min-h-0 relative">
        {/* Sidebar floats over left edge — translucent */}
        <Sidebar activeTab="overview" />

        {/* ── HERO: Full-bleed GIS Map ── */}
        <main className="flex-1 relative min-h-0">
          <LiveRiskMap
            onSelectLocation={(loc) => {
              setSelectedLocation(loc);
              setDrawerOpen(true);
            }}
            selectedLocationId={selectedLocation?.id}
            simulatedTimeStep={currentStep}
          />

          {/* ── Floating Copilot Button ── */}
          <button
            onClick={() => setCopilotOpen(true)}
            className="absolute top-4 right-4 z-30 btn-primary px-4 py-2 text-white rounded-xl text-xs font-black font-mono flex items-center gap-2 shadow-2xl"
          >
            <Bot className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>COPILOT</span>
          </button>

          {/* ── Floating Intelligence Stack (RIGHT, over map) ── */}
          <div className="absolute top-4 right-4 bottom-20 w-80 xl:w-[340px] z-20 flex flex-col gap-3 pt-14 pointer-events-none">
            <div className="pointer-events-auto">
              <RiskDial
                score={selectedLocation?.riskScore || 68.5}
                level={selectedLocation?.riskLevel || 'HIGH'}
                trendDelta={14.2}
                primaryDriver="Rainfall 48mm/3h + Soil 82% Saturation"
                dataFreshness="Updated 3 min ago"
              />
            </div>
            <div className="pointer-events-auto flex-1 min-h-0 overflow-y-auto space-y-3">
              <InteractiveAlertStream />
              <WhyRiskChangedPanel />
            </div>
          </div>

          {/* ── Floating Hotkey Hint (bottom-left over map) ── */}
          <div className="absolute bottom-20 left-4 z-20 fp rounded-xl px-3 py-2 text-[10px] font-mono text-slate-400 flex items-center gap-2">
            <span className="text-cyan-400 font-bold">HOTKEYS:</span>
            <span className="bg-slate-900/80 px-1.5 py-0.5 rounded text-cyan-300 border border-slate-700">S</span>
            <span>Safety</span>
            <span className="bg-slate-900/80 px-1.5 py-0.5 rounded text-cyan-300 border border-slate-700">H</span>
            <span>Hindcast</span>
            <span className="bg-slate-900/80 px-1.5 py-0.5 rounded text-cyan-300 border border-slate-700">R</span>
            <span>Replay</span>
          </div>

          {/* ── Bottom Command Timeline strip ── */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <CommandTimeline
              currentStep={currentStep}
              onStepChange={(step) => setCurrentStep(step)}
            />
          </div>
        </main>

        {/* ── Slide-in Intelligence Drawer ── */}
        {drawerOpen && selectedLocation && (
          <VillageIntelligenceDrawer
            location={selectedLocation}
            onClose={() => setDrawerOpen(false)}
          />
        )}

        {/* ── Copilot Drawer ── */}
        <CopilotDrawer
          isOpen={copilotOpen}
          onClose={() => setCopilotOpen(false)}
        />
      </div>
    </div>
  );
}
