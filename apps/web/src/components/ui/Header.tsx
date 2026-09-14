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
  MapPin, PhoneCall, Compass, AlertTriangle
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
        className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 select-none safe-top shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        {/* Row 1: Primary Navigation Bar (56px) */}
        <div className="h-14 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-3 max-w-full relative">
          
          {/* Left: Hamburger (mobile) + Brand Wordmark + Mode Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition shrink-0"
              aria-label="Open Navigation Menu"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition shrink-0">
                <ShieldAlert className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition truncate">
                  FLOODGUARD
                </span>
                <span className="text-[10px] font-mono font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200">
                  AI
                </span>
              </div>
            </Link>

            {/* Mode Toggle (Demo vs Live Pilot) */}
            <div className="hidden lg:flex items-center gap-0.5 bg-slate-100 border border-slate-200 rounded-xl p-0.5 shrink-0 ml-1">
              <button
                onClick={() => setOperatingMode('DEMO')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  operatingMode === 'DEMO'
                    ? 'bg-white text-amber-800 border border-amber-300 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Demo
              </button>
              <button
                onClick={() => setOperatingMode('REAL_PILOT')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  operatingMode === 'REAL_PILOT'
                    ? 'bg-white text-emerald-800 border border-emerald-300 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Live Pilot
              </button>
            </div>
          </div>

          {/* Center: SOS Emergency Rescue Button */}
          <div className="hidden md:flex items-center justify-center">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                }
              }}
              className="relative group flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 active:scale-95 transition-all shadow-sm ring-2 ring-red-400/40 ring-offset-1 shrink-0"
              title="Immediate Emergency Rescue & Disaster Helpline Dispatch (Hotkey: E)"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <PhoneCall className="w-3.5 h-3.5 text-white animate-bounce shrink-0" />
              <span className="tracking-wide font-black">SOS 112</span>
              <span className="hidden md:inline-block px-1.5 py-0.2 text-[10px] bg-red-950/40 rounded-md text-white border border-white/20 font-bold">
                Rescue
              </span>
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
              className="md:hidden flex items-center gap-1 px-3 py-1 rounded-full font-bold text-xs text-white bg-red-600 active:scale-95 shadow-sm ring-1 ring-red-300 shrink-0"
              title="Immediate Emergency Rescue (112)"
            >
              <PhoneCall className="w-3 h-3 text-white animate-bounce shrink-0" />
              <span>SOS 112</span>
            </button>

            {/* Public Information Portal Switcher */}
            <Link
              href="/portal"
              className="flex px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 items-center gap-1.5 active:scale-95 transition shrink-0 shadow-2xs"
              title="Switch to Government-Style Public Information Portal"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600 shrink-0" />
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
              className="flex px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 border border-blue-700 text-white items-center gap-1.5 shadow-xs active:scale-95 transition shrink-0"
              title="Open Grounded AI Disaster Copilot"
            >
              <Bot className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="hidden md:inline">AI Copilot</span>
            </button>

            {/* Desktop Role Selector Dropdown */}
            <div className="hidden md:flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs shrink-0 shadow-2xs transition">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer max-w-[130px] truncate"
              >
                {ROLES_LIST.map((r) => (
                  <option key={r.id} value={r.id} className="bg-white text-slate-900 font-medium">
                    {r.iconBadge} {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs shrink-0 shadow-2xs transition">
              <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-white text-slate-900 font-medium">
                    {l.native}
                  </option>
                ))}
              </select>
            </div>

            {/* Search (Ctrl+K) */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 transition shrink-0 active:scale-95 shadow-2xs"
              title="Search commands and locations (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Sub-Bar Context & Breadcrumbs */}
        <div className="h-8 border-t border-slate-200 bg-slate-50/90 px-3 sm:px-4 flex items-center justify-between gap-2 text-xs select-none overflow-x-auto no-scrollbar">
          {isCitizen ? (
            /* Citizen Context Strip */
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setLocationModalOpen(true)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold hover:bg-blue-100 active:scale-95 transition shrink-0"
                title="Tap to change location or detect your GPS location"
              >
                <MapPin className="w-3 h-3 text-blue-600 animate-pulse" />
                <span>{hierarchy.district || hierarchy.state || selectedLocation?.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-blue-600 text-white font-mono font-bold">
                  GPS
                </span>
              </button>
              <span className="px-2 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold shrink-0">
                Risk: {selectedLocation.riskLevel} ({selectedLocation.riskScore}/100)
              </span>
              <Link
                href="/safety"
                className="px-2.5 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition flex items-center gap-1 shrink-0 shadow-2xs"
              >
                <Compass className="w-3 h-3" /> {t('what_to_do')}
              </Link>
              <Link
                href="/safety"
                className="px-2.5 py-0.5 rounded-lg bg-white hover:bg-slate-100 text-blue-700 text-[11px] font-bold border border-slate-200 transition shrink-0"
              >
                {t('nearby_shelters')}
              </Link>
              <Link
                href="/upload"
                className="px-2.5 py-0.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-[11px] font-bold transition shrink-0"
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
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-700 border border-slate-200 hover:border-blue-300 font-bold active:scale-95 transition shrink-0 text-[11px] shadow-2xs"
                  title="Click to switch state/basin or filter geography"
                >
                  <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                  <span className="font-bold">{selectedLocation.name}</span>
                  <span className="text-[9px] text-slate-400">▾</span>
                </button>

                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-medium text-[11px]">State: <strong className="text-slate-800">{selectedLocation.state}</strong></span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium text-[11px] truncate max-w-[280px]">Region: <strong className="text-slate-800">{selectedLocation.region}</strong></span>
              </div>

              {/* Status Badges on the right */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  {dataMode} MODE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
