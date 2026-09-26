'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CommandPalette } from './CommandPalette';
import { MobileNavDrawer } from './MobileNavDrawer';
import { MobileConfigDrawer } from './MobileConfigDrawer';
import { useLocation } from '@/context/LocationContext';
import { useAdaptive, UserRole } from '@/context/AdaptiveContext';
import { LANGUAGES, SupportedLanguage } from '@/data/i18n';
import {
  Search, Globe, Menu, Bot, UserCheck, ShieldAlert,
  MapPin, PhoneCall, Compass, BarChart3, Sparkles
} from 'lucide-react';
import { LocationSelectorModal } from '@/components/ui/LocationSelectorModal';
import { ProductOnboardingTour } from '@/components/ui/ProductOnboardingTour';
import { TelemetryMetricsModal } from '@/components/ui/TelemetryMetricsModal';
import { useToast } from '@/context/ToastContext';
import { trackEvent } from '@/lib/analytics';

export const Header: React.FC<{
  dataMode?: string;
  systemStatus?: string;
  onOpenCopilot?: () => void;
}> = ({ dataMode = 'DEMO', systemStatus = 'OPERATIONAL', onOpenCopilot }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileConfigOpen, setMobileConfigOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  
  const { selectedLocation } = useLocation();
  const {
    operatingMode,
    setOperatingMode,
    role,
    setRole,
    language,
    setLanguage,
    hierarchy,
    t,
    isCitizen,
  } = useAdaptive();

  const ROLES_LIST: { id: UserRole; label: string; iconBadge: string }[] = [
    { id: 'CITIZEN', label: 'Citizen / Resident', iconBadge: '🏠' },
    { id: 'VILLAGE_OPERATOR', label: 'Village Operator', iconBadge: '🌾' },
    { id: 'FIELD_RESPONDER', label: 'Field Responder', iconBadge: '🚒' },
    { id: 'DISTRICT_OPERATOR', label: 'District EOC Operator', iconBadge: '🏢' },
    { id: 'STATE_OPERATOR', label: 'State SEOC Commander', iconBadge: '🏛️' },
    { id: 'NATIONAL_OPERATOR', label: 'National NDMA Commander', iconBadge: '🇮🇳' },
    { id: 'ANALYST', label: 'GIS / ML Analyst', iconBadge: '📊' },
    { id: 'RESEARCHER', label: 'Researcher', iconBadge: '🔬' },
    { id: 'ADMIN', label: 'System Administrator', iconBadge: '⚙️' },
    { id: 'VIEWER', label: 'Public Viewer', iconBadge: '👁️' },
  ];

  React.useEffect(() => {
    const handleOpenLocation = () => setLocationModalOpen(true);
    window.addEventListener('open-location-selector', handleOpenLocation);
    return () => {
      window.removeEventListener('open-location-selector', handleOpenLocation);
    };
  }, []);

  return (
    <>
      <header 
        className="sticky top-0 z-40 select-none safe-top shrink-0 border-b border-slate-800/80 shadow-md"
      >
        {/* Row 1: Executive Dark Navy Command Bar (56px) */}
        <div className="h-14 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-3 max-w-full relative bg-[#0C1527] text-white">
          
          {/* Left: Mobile Trigger + Brand Identity + Mode Switch */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 active:scale-95 transition shrink-0"
              aria-label="Open Navigation Menu"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition shrink-0 ring-1 ring-white/20">
                <ShieldAlert className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm sm:text-base font-black tracking-tight text-white group-hover:text-cyan-300 transition truncate">
                  FLOODGUARD
                </span>
                <span className="text-[10px] font-mono font-black text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded-md border border-cyan-500/40 shadow-xs">
                  AI
                </span>
              </div>
            </Link>

            {/* Mode Switcher */}
            <div className="hidden lg:flex items-center gap-0.5 bg-slate-800/90 border border-slate-700/80 rounded-xl p-0.5 shrink-0 ml-1">
              <button
                onClick={() => setOperatingMode('DEMO')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  operatingMode === 'DEMO'
                    ? 'bg-amber-500 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Demo
              </button>
              <button
                onClick={() => setOperatingMode('REAL_PILOT')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  operatingMode === 'REAL_PILOT'
                    ? 'bg-emerald-500 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Live Pilot
              </button>
            </div>
          </div>

          {/* Center: SOS 112 Emergency Button - Exactly Centered in Header */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                }
              }}
              className="pointer-events-auto relative group flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 active:scale-95 transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)] ring-2 ring-rose-400/50 ring-offset-1 ring-offset-slate-900 shrink-0"
              title="Immediate Emergency Rescue & Disaster Helpline Dispatch (Hotkey: E)"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <PhoneCall className="w-3.5 h-3.5 text-white animate-bounce shrink-0" />
              <span className="tracking-wide font-black">SOS 112</span>
              <span className="hidden md:inline-block px-1.5 py-0.2 text-[10px] bg-red-950/70 rounded-md text-red-200 border border-red-400/30 font-bold">
                Rescue
              </span>
            </button>
          </div>

          {/* Right: Actions & Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Mobile SOS Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                }
              }}
              className="md:hidden flex items-center gap-1 px-3 py-1 rounded-full font-bold text-xs text-white bg-red-600 active:scale-95 shadow-sm ring-1 ring-red-400 shrink-0"
              title="Immediate Emergency Rescue (112)"
            >
              <PhoneCall className="w-3 h-3 text-white animate-bounce shrink-0" />
              <span>SOS 112</span>
            </button>

            {/* Public Portal Button */}
            <Link
              href="/portal"
              className="flex px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 items-center gap-1.5 active:scale-95 transition shrink-0 shadow-xs"
              title="Switch to Government-Style Public Information Portal"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] font-sans font-bold">Portal</span>
            </Link>

            {/* AI Assistant Button (desktop only — mobile has floating GlobalAiAssistant) */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-copilot'));
                }
                onOpenCopilot?.();
              }}
              className="hidden md:flex px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/50 text-white items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] active:scale-95 transition shrink-0"
              title="Open Grounded AI Disaster Copilot"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-200 shrink-0" />
              <span>AI Copilot</span>
            </button>

            {/* Desktop Role Selector Dropdown */}
            <div className="hidden md:flex items-center gap-1 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 px-2.5 py-1.5 rounded-xl text-xs shrink-0 shadow-xs transition">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer max-w-[130px] truncate"
              >
                {ROLES_LIST.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-white font-medium">
                    {r.iconBadge} {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 px-2.5 py-1.5 rounded-xl text-xs shrink-0 shadow-xs transition">
              <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-white font-medium">
                    {l.native}
                  </option>
                ))}
              </select>
            </div>

            {/* Onboarding Tour / Judge Guide Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  trackEvent('Opened Onboarding Tour');
                  window.dispatchEvent(new CustomEvent('open-onboarding-tour'));
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition active:scale-95 shadow-xs"
              title="Launch 30-Second Animated Product Tour for Judges"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">Tour Guide</span>
            </button>

            {/* Platform Impact & Analytics Telemetry Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  trackEvent('Opened Platform Telemetry');
                  window.dispatchEvent(new CustomEvent('open-telemetry-metrics'));
                }
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold transition active:scale-95 shadow-xs"
              title="View Live Platform Analytics & Impact Metrics"
            >
              <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden xl:inline">Impact</span>
            </button>

            {/* Search (Ctrl+K) */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition shrink-0 active:scale-95 shadow-xs"
              title="Search commands and locations (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Crisp Geographic Context & Status Ribbon (32px) */}
        <div className="h-8 border-t border-slate-200 bg-[#EDF2F7] px-3 sm:px-4 flex items-center justify-between gap-2 text-xs select-none overflow-x-auto no-scrollbar shadow-xs">
          {isCitizen ? (
            /* Citizen Context Strip */
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setLocationModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 active:scale-95 transition shrink-0 shadow-xs"
                title="Tap to change location or detect your GPS location"
              >
                <MapPin className="w-3 h-3 text-white animate-pulse" />
                <span>{hierarchy.district || hierarchy.state || selectedLocation?.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-blue-800 text-white font-mono font-bold">
                  GPS ▾
                </span>
              </button>
              <span className="px-2.5 py-0.5 rounded-lg bg-red-100 text-red-800 border border-red-300 text-[11px] font-bold shrink-0">
                Risk: {selectedLocation.riskLevel} ({selectedLocation.riskScore}/100)
              </span>
              <Link
                href="/safety"
                className="px-2.5 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition flex items-center gap-1 shrink-0 shadow-xs"
              >
                <Compass className="w-3 h-3" /> {t('what_to_do')}
              </Link>
            </div>
          ) : (
            /* Command & Operator Context Strip */
            <div className="flex items-center justify-between gap-3 w-full overflow-hidden">
              <div className="flex items-center gap-2 shrink-0 min-w-0">
                {/* Single Location Picker Pill with clear affordance */}
                <button
                  onClick={() => setLocationModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold active:scale-95 transition shrink-0 text-[11px] shadow-xs"
                  title="Click to switch state/basin or filter geography"
                >
                  <MapPin className="w-3 h-3 text-blue-200 shrink-0" />
                  <span className="font-bold truncate max-w-[130px] sm:max-w-none">{selectedLocation.name}</span>
                  <span className="text-[9px] text-blue-200 font-semibold">Sector ▾</span>
                </button>

                <span className="text-slate-300 hidden sm:inline">|</span>
                <span className="text-slate-600 font-medium text-[11px] hidden sm:inline">
                  State: <strong className="text-blue-800 bg-blue-100/80 px-1.5 py-0.2 rounded border border-blue-200">{selectedLocation.state}</strong>
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-slate-600 font-medium text-[11px] hidden md:inline truncate max-w-[200px]">
                  Region: <strong className="text-indigo-800 bg-indigo-100/80 px-1.5 py-0.2 rounded border border-indigo-200">{selectedLocation.region}</strong>
                </span>
              </div>

              {/* Status Badges on the right — clear and descriptive */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 font-mono shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{dataMode} MODE</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 font-mono shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>LIVE</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Full Modals System */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <MobileNavDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
      <MobileConfigDrawer isOpen={mobileConfigOpen} onClose={() => setMobileConfigOpen(false)} />
      <LocationSelectorModal isOpen={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
      <ProductOnboardingTour />
      <TelemetryMetricsModal />
    </>
  );
};
