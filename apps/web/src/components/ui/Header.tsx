'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CommandPalette } from './CommandPalette';
import { MobileNavDrawer } from './MobileNavDrawer';
import { MobileConfigDrawer } from './MobileConfigDrawer';
import { useLocation, LOCATIONS } from '@/context/LocationContext';
import { useAdaptive, UserRole, OperatingMode } from '@/context/AdaptiveContext';
import { INDIAN_STATES } from '@/data/states';
import { LANGUAGES, SupportedLanguage } from '@/data/i18n';
import {
  Search, Globe, Menu, Bot, UserCheck, ShieldAlert,
  MapPin, Radio, PhoneCall, Compass, AlertTriangle,
  ChevronRight, Sparkles, Bell
} from 'lucide-react';
import { LocationSelectorModal } from '@/components/ui/LocationSelectorModal';

export const Header: React.FC<{
  dataMode?: string;
  systemStatus?: string;
  onOpenCopilot?: () => void;
}> = ({ dataMode = 'DEMO', systemStatus = 'OPERATIONAL', onOpenCopilot }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileConfigOpen, setMobileConfigOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  
  const { selectedLocation, selectLocationById } = useLocation();
  const {
    operatingMode,
    setOperatingMode,
    role,
    setRole,
    language,
    setLanguage,
    hierarchy,
    setStateFilter,
    setDistrictFilter,
    resetToNational,
    activeHazards,
    regionalModel,
    breadcrumb,
    t,
    isCitizen,
    isOperator,
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

  const toggleNextLanguage = () => {
    const currentIndex = LANGUAGES.findIndex(l => l.code === language);
    const nextIndex = (currentIndex + 1) % LANGUAGES.length;
    setLanguage(LANGUAGES[nextIndex].code);
  };

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
        className="border-b border-cyan-500/20 bg-[#070f24]/95 backdrop-blur-2xl sticky top-0 z-40 select-none safe-top shrink-0"
        style={{ boxShadow: '0 4px 25px rgba(0,0,0,0.6), inset 0 -1px 0 rgba(56,189,248,0.1)' }}
      >
        {/* Row 1: Primary Navigation Bar (56px) */}
        <div className="h-14 px-2 sm:px-4 lg:px-6 flex items-center justify-between gap-1.5 sm:gap-3 max-w-full relative">
          
          {/* Left: Hamburger (mobile) + Brand Wordmark + Mode Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden w-8 h-8 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-center text-cyan-400 active:scale-95 transition shrink-0 shadow-sm"
              aria-label="Open Navigation Menu"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-400 animate-ping shadow-[0_0_12px_rgba(6,182,212,1)] shrink-0" />
              <div className="text-sm sm:text-base font-black tracking-wide bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-200 bg-clip-text text-transparent group-hover:brightness-125 transition truncate">
                FLOODGUARD <span className="text-cyan-400 font-extrabold">AI</span>
              </div>
            </Link>

            {/* Mode Toggle (Demo vs Live Pilot) */}
            <div className="hidden lg:flex items-center gap-0.5 bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 shrink-0 ml-1">
              <button
                onClick={() => setOperatingMode('DEMO')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  operatingMode === 'DEMO'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Demo
              </button>
              <button
                onClick={() => setOperatingMode('REAL_PILOT')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  operatingMode === 'REAL_PILOT'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Live Pilot
              </button>
            </div>
          </div>

          {/* Center: SOS Emergency Rescue Button + Location Quick View */}
          {/* Center: SOS Emergency Rescue Button + Location Quick View */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                }
              }}
              className="relative group flex items-center gap-1.5 md:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full font-bold text-xs md:text-sm text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 active:scale-95 transition-all shadow-[0_0_18px_rgba(239,68,68,0.7)] ring-2 ring-rose-400/60 ring-offset-1 ring-offset-slate-950 shrink-0"
              title="Immediate Emergency Rescue & Disaster Helpline Dispatch (Hotkey: E)"
            >
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90" />
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-white" />
              </span>
              <PhoneCall className="w-3.5 h-3.5 md:w-4 md:h-4 text-white animate-bounce shrink-0" />
              <span className="tracking-wide">SOS 112</span>
              <span className="hidden md:inline-block px-1.5 py-0.2 text-[10px] bg-red-950/80 rounded-md text-red-200 border border-red-400/40 font-semibold">
                Rescue
              </span>
            </button>

            {/* Quick Location Selector in Header */}
            <button
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition shadow-xs hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              title="Change location or detect GPS"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
              <span className="max-w-[140px] truncate text-slate-100 font-bold">{selectedLocation?.name || 'Location'}</span>
              <span className="text-[10px] text-cyan-400/70">▾</span>
            </button>
          </div>

          {/* Right: Controls & Actions (Public Portal, AI Assistant, Role, Language, Search) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Mobile SOS Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                }
              }}
              className="md:hidden flex items-center gap-1 px-3 py-1 rounded-full font-bold text-xs text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 active:scale-95 shadow-[0_0_14px_rgba(239,68,68,0.6)] ring-1 ring-rose-400/60 shrink-0"
              title="Immediate Emergency Rescue (112)"
            >
              <PhoneCall className="w-3 h-3 text-white animate-bounce shrink-0" />
              <span>SOS 112</span>
            </button>

            {/* Public Information Portal Switcher */}
            <Link
              href="/portal"
              className="flex px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/50 text-amber-300 items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.2)] active:scale-95 transition shrink-0"
              title="Switch to Government-Style Public Information Portal"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Public Portal</span>
            </Link>

            {/* AI Assistant Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-copilot'));
                }
                onOpenCopilot?.();
              }}
              className="flex px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/60 text-white items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95 transition shrink-0"
              title="Open Grounded AI Disaster Copilot"
            >
              <Bot className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="hidden md:inline">AI Copilot</span>
            </button>

            {/* Desktop Role Selector Dropdown */}
            <div className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-xs shrink-0 shadow-xs">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="bg-transparent text-xs text-indigo-200 font-semibold focus:outline-none cursor-pointer max-w-[130px] truncate"
              >
                {ROLES_LIST.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-950 text-slate-200 font-medium">
                    {r.iconBadge} {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-xs shrink-0 shadow-xs">
              <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-950 text-slate-200 font-medium">
                    {l.native}
                  </option>
                ))}
              </select>
            </div>

            {/* Search (Ctrl+K) */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-slate-800 transition shrink-0 active:scale-95 shadow-xs"
              title="Search commands and locations (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Sub-Bar Context & Breadcrumbs */}
        <div className="h-8 border-t border-slate-800/80 bg-[#040a1a]/95 px-3 sm:px-4 flex items-center justify-between gap-2 text-xs select-none overflow-x-auto no-scrollbar">
          {isCitizen ? (
            /* Citizen Context Strip */
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setLocationModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-700/70 font-bold hover:bg-cyan-900 active:scale-95 transition shrink-0 shadow-sm"
                title="Tap to change location or detect your GPS location"
              >
                <MapPin className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>{hierarchy.district || hierarchy.state || selectedLocation?.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 font-mono font-bold">
                  GPS
                </span>
              </button>
              <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/60 font-bold shrink-0">
                Risk: {selectedLocation.riskLevel} ({selectedLocation.riskScore}/100)
              </span>
              <Link
                href="/safety"
                className="px-2.5 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center gap-1 shrink-0 shadow-sm"
              >
                <Compass className="w-3 h-3" /> {t('what_to_do')}
              </Link>
              <Link
                href="/safety"
                className="px-2.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold border border-slate-700 transition shrink-0 shadow-sm"
              >
                {t('nearby_shelters')}
              </Link>
              <Link
                href="/upload"
                className="px-2.5 py-0.5 rounded bg-rose-950/90 hover:bg-rose-900 border border-rose-700 text-rose-200 font-bold transition shrink-0 shadow-sm"
              >
                {t('report_flood')}
              </Link>
            </div>
          ) : (
            /* Command & Operator Context Strip */
            <div className="flex items-center justify-between gap-3 w-full">
              <div className="flex items-center gap-2 shrink-0">
                {/* Interactive Location Badge */}
                <button
                  onClick={() => setLocationModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 font-bold hover:bg-cyan-900 active:scale-95 transition shrink-0 shadow-xs"
                  title="Click to switch state/basin or filter geography"
                >
                  <MapPin className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span className="text-slate-100 font-bold">{selectedLocation.name}</span>
                  <span className="text-[10px] text-cyan-400/70">▾</span>
                </button>

                <span className="text-slate-700">|</span>
                <span className="text-slate-400 font-medium">State: <strong className="text-cyan-300">{selectedLocation.state}</strong></span>
                <span className="text-slate-700">•</span>
                <span className="text-slate-400 font-medium truncate max-w-[240px]">Region: <strong className="text-indigo-300">{selectedLocation.region}</strong></span>
              </div>

              {/* Status Badges on the right */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  {dataMode} MODE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{systemStatus}</span>
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
    </>
  );
};
