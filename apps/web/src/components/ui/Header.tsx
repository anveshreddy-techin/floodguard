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
        className="border-b border-slate-200 bg-white sticky top-0 z-40 select-none safe-top shrink-0 shadow-sm"
      >
        {/* Row 1: Primary Navigation Bar (56px) */}
        <div className="h-14 px-2 sm:px-4 lg:px-6 flex items-center justify-between gap-1.5 sm:gap-3 max-w-full relative">
          
          {/* Left: Hamburger (mobile) + Brand Wordmark + Mode Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition shrink-0 shadow-sm"
              aria-label="Open Navigation Menu"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
              >
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition truncate">
                FloodGuard <span className="text-blue-600 font-extrabold">AI</span>
              </div>
            </Link>

            {/* Mode Toggle (Demo vs Live Pilot) */}
            <div className="hidden lg:flex items-center gap-0.5 bg-slate-100 border border-slate-200 rounded-lg p-0.5 shrink-0 ml-1">
              <button
                onClick={() => setOperatingMode('DEMO')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  operatingMode === 'DEMO'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Demo
              </button>
              <button
                onClick={() => setOperatingMode('REAL_PILOT')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  operatingMode === 'REAL_PILOT'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Live Pilot
              </button>
            </div>
          </div>

          {/* Center: SOS Emergency Rescue Button + Location Quick View */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                }
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all shadow-sm shrink-0 border border-red-700"
              title="Immediate Emergency Rescue & Disaster Helpline Dispatch (Hotkey: E)"
            >
              <PhoneCall className="w-3.5 h-3.5 text-white animate-bounce shrink-0" />
              <span>SOS 112</span>
              <span className="px-1.5 py-0.2 text-[10px] bg-red-800 rounded text-white font-semibold">
                Rescue
              </span>
            </button>

            {/* Quick Location Selector in Header */}
            <button
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold transition shadow-2xs"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="max-w-[140px] truncate">{selectedLocation?.name || 'Location'}</span>
              <span className="text-[10px] text-slate-400">▾</span>
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
              className="md:hidden flex items-center gap-1 px-3 py-1 rounded-full font-bold text-xs text-white bg-red-600 active:scale-95 shadow-sm shrink-0 border border-red-700"
              title="Immediate Emergency Rescue (112)"
            >
              <PhoneCall className="w-3 h-3 text-white shrink-0" />
              <span>SOS 112</span>
            </button>

            {/* Public Information Portal Switcher */}
            <Link
              href="/portal"
              className="flex px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 border border-amber-600 text-slate-950 items-center gap-1.5 shadow-2xs active:scale-95 transition shrink-0"
              title="Switch to Government-Style Public Information Portal"
            >
              <Globe className="w-3.5 h-3.5 text-slate-950 shrink-0" />
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
              className="flex px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 border border-blue-700 text-white items-center gap-1.5 shadow-2xs active:scale-95 transition shrink-0"
              title="Open Grounded AI Disaster Copilot"
            >
              <Bot className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="hidden md:inline">AI Copilot</span>
            </button>

            {/* Desktop Role Selector Dropdown */}
            <div className="hidden md:flex items-center gap-1 bg-white border border-slate-300 px-2.5 py-1.5 rounded-xl text-xs shrink-0 shadow-2xs">
              <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="bg-transparent text-xs text-slate-900 font-semibold focus:outline-none cursor-pointer max-w-[130px] truncate"
              >
                {ROLES_LIST.map((r) => (
                  <option key={r.id} value={r.id} className="bg-white text-slate-900 font-medium">
                    {r.iconBadge} {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-white border border-slate-300 px-2.5 py-1.5 rounded-xl text-xs shrink-0 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs text-slate-900 font-semibold focus:outline-none cursor-pointer"
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
              className="hidden sm:flex p-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition shrink-0 active:scale-95 shadow-2xs"
              title="Search commands and locations (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Sub-Bar Context & Breadcrumbs */}
        <div className="h-8 border-t border-slate-200 bg-slate-100/90 px-3 sm:px-4 flex items-center justify-between gap-2 text-xs font-sans select-none overflow-x-auto no-scrollbar">
          {isCitizen ? (
            /* Citizen Context Strip */
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setLocationModalOpen(true)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-95 transition shrink-0 shadow-sm"
                title="Tap to change location or detect your GPS location"
              >
                <MapPin className="w-3 h-3 text-white animate-pulse" />
                <span>{hierarchy.district || hierarchy.state || selectedLocation?.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-white/20 text-white font-mono font-bold">
                  GPS
                </span>
              </button>
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300 font-bold shrink-0">
                Risk: {selectedLocation.riskLevel} ({selectedLocation.riskScore}/100)
              </span>
              <Link
                href="/safety"
                className="px-2.5 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-1 shrink-0 shadow-sm"
              >
                <Compass className="w-3 h-3" /> {t('what_to_do')}
              </Link>
              <Link
                href="/safety"
                className="px-2.5 py-0.5 rounded bg-white hover:bg-slate-100 text-blue-700 font-bold border border-slate-300 transition shrink-0 shadow-sm"
              >
                {t('nearby_shelters')}
              </Link>
              <Link
                href="/upload"
                className="px-2.5 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold transition shrink-0 shadow-sm"
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
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white text-blue-700 border border-slate-300 font-bold hover:bg-blue-50 active:scale-95 transition shrink-0 shadow-sm"
                  title="Click to switch state/basin or filter geography"
                >
                  <MapPin className="w-3 h-3 text-blue-600 animate-pulse" />
                  <span className="text-slate-900 font-bold">{selectedLocation.name}</span>
                  <span className="text-[10px] text-slate-400">▾</span>
                </button>

                <span className="text-slate-300">|</span>
                <span className="text-slate-600 font-medium">State: <strong className="text-slate-900">{selectedLocation.state}</strong></span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium truncate max-w-[240px]">Region: <strong className="text-slate-900">{selectedLocation.region}</strong></span>
              </div>

              {/* Status Badges on the right */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                  {dataMode} MODE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
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
