'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Bot, ShieldAlert, Layers, Compass, HelpCircle, Sparkles } from 'lucide-react';
import { DataMode } from '@/types';

export default function CommandCenterPage() {
  const router = useRouter();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>('NOW');
  const [copilotOpen, setCopilotOpen] = useState<boolean>(false);
  const [dataMode, setDataMode] = useState<DataMode>('DEMO');

  // Keyboard shortcut listener (Section 46)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'm' || e.key === 'M') router.push('/map');
      if (e.key === 's' || e.key === 'S') router.push('/safety');
      if (e.key === 'h' || e.key === 'H') router.push('/hindcast');
      if (e.key === 'r' || e.key === 'R') router.push('/replay');
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        setCopilotOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#050a17] text-slate-100 overflow-hidden select-none">
      {/* Top Application Header */}
      <Header dataMode={dataMode} systemStatus="OPERATIONAL" />

      {/* Main Command Workspace (100vh Split) */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Navigation Sidebar */}
        <Sidebar activeTab="overview" />

        {/* Center Hero: Live Interactive GIS Map */}
        <main className="flex-1 relative flex flex-col min-h-0 border-r border-[#223354]">
          {/* GIS Map Canvas (Visual Hero) */}
          <div className="flex-1 relative min-h-0">
            <LiveRiskMap
              onSelectLocation={(loc) => {
                setSelectedLocation(loc);
                setDrawerOpen(true);
              }}
              selectedLocationId={selectedLocation?.id}
              simulatedTimeStep={currentStep}
            />

            {/* Floating Grounded Copilot Launcher Button */}
            <button
              onClick={() => setCopilotOpen(true)}
              className="absolute top-4 right-4 z-20 btn-glow-cyan px-4 py-2 text-white rounded-xl text-xs font-black font-mono flex items-center gap-2 shadow-2xl transition border border-cyan-400/50"
            >
              <Bot className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span>GROUNDED COPILOT</span>
            </button>
          </div>

          {/* Bottom Operational Timeline & Subsystem Health */}
          <CommandTimeline
            currentStep={currentStep}
            onStepChange={(step) => setCurrentStep(step)}
          />
        </main>

        {/* Right Command Intelligence Stack */}
        <aside className="w-80 xl:w-96 bg-[#070d1e]/95 flex flex-col justify-between p-3.5 gap-3.5 overflow-y-auto shrink-0 border-l border-[#223354] backdrop-blur-xl">
          <div className="space-y-3.5">
            {/* Risk Dial Trajectory */}
            <RiskDial
              score={selectedLocation?.riskScore || 68.5}
              level={selectedLocation?.riskLevel || 'HIGH'}
              trendDelta={14.2}
              primaryDriver="Rainfall Accumulation (48mm/3h)"
              dataFreshness="Updated 3 min ago"
            />

            {/* Interactive Alert Stream */}
            <InteractiveAlertStream />

            {/* Why Risk Changed / What Changed / What's Missing */}
            <WhyRiskChangedPanel />
          </div>

          {/* Keyboard Navigation Tooltip Helper */}
          <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span className="font-bold text-cyan-400">HOTKEYS:</span>
            <div className="flex items-center gap-1.5">
              <span className="bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-cyan-300">M Map</span>
              <span className="bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-cyan-300">S Safety</span>
              <span className="bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-cyan-300">H Hindcast</span>
            </div>
          </div>
        </aside>

        {/* Slide-in Location Intelligence Drawer */}
        {drawerOpen && selectedLocation && (
          <VillageIntelligenceDrawer
            location={selectedLocation}
            onClose={() => setDrawerOpen(false)}
          />
        )}

        {/* Grounded Copilot Slide-in Drawer */}
        <CopilotDrawer
          isOpen={copilotOpen}
          onClose={() => setCopilotOpen(false)}
        />
      </div>
    </div>
  );
}
