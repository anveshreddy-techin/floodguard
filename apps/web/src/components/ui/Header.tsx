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
  ChevronRight, Sparkles, Heart
} from 'lucide-react';
import { DonateModal } from '@/components/ui/donate/DonateModal';
import { LocationSelectorModal } from '@/components/ui/LocationSelectorModal';

export const Header: React.FC<{
  dataMode?: string;
  systemStatus?: string;
  onOpenCopilot?: () => void;
}> = ({ dataMode = 'DEMO', systemStatus = 'OPERATIONAL', onOpenCopilot }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileConfigOpen, setMobileConfigOpen] = useState(false);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
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

  // Cycle language on mobile single tap
  const toggleNextLanguage = () => {
    const currentIndex = LANGUAGES.findIndex(l => l.code === language);
    const nextIndex = (currentIndex + 1) % LANGUAGES.length;
    setLanguage(LANGUAGES[nextIndex].code);
  };

  React.useEffect(() => {
    const handleOpenDonate = () => setDonateModalOpen(true);
    const handleOpenLocation = () => setLocationModalOpen(true);
    window.addEventListener('open-donate-modal', handleOpenDonate);
    window.addEventListener('open-location-selector', handleOpenLocation);
    return () => {
      window.removeEventListener('open-donate-modal', handleOpenDonate);
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
          
          {/* Left: Hamburger (mobile) + Brand Wordmark */}
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
              <div className="text-xs sm:text-sm font-black tracking-wider bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-200 bg-clip-text text-transparent group-hover:brightness-125 transition truncate">
                FLOODGUARD <span className="text-slate-100 font-mono font-normal">AI</span>
              </div>
            </Link>

            {/* Desktop Mode Toggle (Large Screens) */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 shrink-0 ml-1">
              <button
                onClick={() => setOperatingMode('DEMO')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                  operatingMode === 'DEMO'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                DEMO
              </button>
              <button
                onClick={() => setOperatingMode('REAL_PILOT')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                  operatingMode === 'REAL_PILOT'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PILOT
              </button>
            </div>
          </div>

          {/* ── CENTER HERO: SOS EMERGENCY RESCUE BUTTON (Desktop prominent center, Mobile sleek compact) ── */}
          <div className="hidden sm:flex items-center justify-center shrink-0">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                }
              }}
              className="relative group flex items-center gap-1.5 md:gap-2 px-3 sm:px-4 md:px-5 py-1.5 md:py-2 rounded-full font-mono font-bold md:font-black text-xs md:text-sm text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 active:scale-95 transition-all shadow-[0_0_18px_rgba(239,68,68,0.7)] ring-2 ring-rose-400/60 ring-offset-1 ring-offset-slate-950 shrink-0"
              title="Immediate Emergency Rescue & Disaster Helpline Dispatch (Hotkey: E)"
            >
              <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-white" />
              </span>
              <PhoneCall className="w-3.5 h-3.5 md:w-4 md:h-4 text-white animate-bounce shrink-0" />
              <span className="tracking-wide">SOS 112</span>
              <span className="hidden md:inline-block px-1.5 py-0.2 text-[10px] bg-red-950/80 rounded-md text-red-200 border border-red-400/40 font-mono">
                CALL
              </span>
            </button>
          </div>

          {/* Right: Controls & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Mobile-Only SOS Button (Compact, Sleek Pill) */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                }
              }}
              className="sm:hidden flex items-center gap-1 px-2.5 py-1 rounded-full font-mono font-bold text-[11px] text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-600 active:scale-95 transition-all shadow-[0_0_14px_rgba(239,68,68,0.6)] ring-1 ring-rose-400/60 shrink-0"
              title="Immediate Emergency Rescue (112)"
            >
              <PhoneCall className="w-3 h-3 text-white animate-bounce shrink-0" />
              <span>SOS 112</span>
            </button>

            {/* Disaster Relief Donation Button (Desktop / Tablet) */}
            <button
              onClick={() => setDonateModalOpen(true)}
              className="hidden sm:flex px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-rose-950/80 hover:bg-rose-900 border border-rose-500/70 text-rose-300 items-center gap-1 shadow-[0_0_12px_rgba(244,63,94,0.3)] active:scale-95 transition shrink-0"
              title="Donate to Disaster Relief Funds (80G Tax Exempt)"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500/50 text-rose-400 animate-pulse" />
              <span className="hidden md:inline">DONATE</span>
            </button>

            {/* AI Copilot Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-copilot'));
                }
              }}
              className="flex px-2 sm:px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-300 items-center gap-1 shadow-[0_0_15px_rgba(6,182,212,0.35)] active:scale-95 transition shrink-0"
              title="Open Grounded AI Disaster Copilot (Hotkey: A)"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden md:inline">COPILOT</span>
            </button>

            {/* Desktop Role Selector Dropdown */}
            <div className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded-xl text-xs font-mono shrink-0">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="bg-transparent text-xs text-indigo-200 font-bold focus:outline-none cursor-pointer max-w-[125px] truncate"
              >
                {ROLES_LIST.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-950 text-slate-200">
                    {r.iconBadge} {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher (Desktop: Dropdown) */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded-xl text-xs font-mono shrink-0">
              <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs text-slate-200 font-bold focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-950 text-slate-200">
                    {l.native}
                  </option>
                ))}
              </select>
            </div>

            {/* Search (Ctrl+K) - Desktop */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition shrink-0 active:scale-95"
              title="Search commands and locations (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Sub-Bar Context & Breadcrumbs (Sleek horizontal scroll strip) */}
        <div className="h-8 border-t border-slate-900 bg-[#040a1a]/95 px-2.5 sm:px-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar text-[11px] font-mono select-none">
          {isCitizen ? (
            /* Citizen Context Strip */
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setLocationModalOpen(true)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold hover:bg-cyan-900 active:scale-95 transition shrink-0 shadow-sm"
                title="Tap to change location or detect your GPS location"
              >
                <MapPin className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>{hierarchy.district || hierarchy.state}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 font-mono font-bold">
                  GPS
                </span>
              </button>
              <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold shrink-0">
                Risk: {selectedLocation.riskLevel} ({selectedLocation.riskScore}/100)
              </span>
              <Link
                href="/safety"
                className="px-2.5 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center gap-1 shrink-0"
              >
                <Compass className="w-3 h-3" /> {t('what_to_do')}
              </Link>
              <Link
                href="/safety"
                className="px-2.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold border border-slate-800 transition shrink-0"
              >
                {t('nearby_shelters')}
              </Link>
              <Link
                href="/upload"
                className="px-2.5 py-0.5 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold transition shrink-0"
              >
                {t('report_flood')}
              </Link>
            </div>
          ) : (
            /* Command & Operator Context Strip */
            <div className="flex items-center gap-2 shrink-0">
              {/* Interactive Location Badge */}
              <button
                onClick={() => setLocationModalOpen(true)}
                className="text-cyan-300 font-bold shrink-0 flex items-center gap-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/50 px-2.5 py-0.5 rounded-lg active:scale-95 transition shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                title="Tap to select any of 41 Pan-India disaster sectors or detect your GPS location"
              >
                <MapPin className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span className="sm:hidden">{hierarchy.district ? `${hierarchy.state} • ${hierarchy.district}` : hierarchy.state}</span>
                <span className="hidden sm:inline">{breadcrumb}</span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-cyan-400/20 text-[9px] text-cyan-200 border border-cyan-400/40 ml-1 font-mono font-bold">
                  📍 CHANGE / GPS
                </span>
              </button>
              
              <span className="text-slate-700 shrink-0">|</span>
              
              <span className="text-indigo-300 shrink-0 bg-slate-900/90 px-2 py-0.5 rounded-lg border border-slate-800">
                {regionalModel.split(' ')[0]}
              </span>

              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800/40 shrink-0">
                <Radio className="w-3 h-3 animate-pulse text-rose-400" /> Upstream: ACTIVE
              </span>

              <Link
                href="/incidents"
                className="px-2 py-0.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-800/40 font-bold shrink-0"
              >
                {t('active_alerts')}: 2
              </Link>

              <Link
                href="/incidents"
                className="px-2 py-0.5 rounded-lg bg-blue-950/60 hover:bg-blue-900 text-blue-300 border border-blue-800/40 font-bold shrink-0"
              >
                {t('response_tasks')}: 4
              </Link>

              <Link
                href="/data-sources"
                className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 shrink-0"
              >
                Sources: DEGRADED
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Top-Left Menu: Disaster Navigation Portal Drawer (Zero Red Box Options) */}
      <MobileNavDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Sector, Role, Language & Mode Configuration Drawer (Red Box Options Only) */}
      <MobileConfigDrawer
        isOpen={mobileConfigOpen}
        onClose={() => setMobileConfigOpen(false)}
      />

      {/* Global Disaster Relief Donation Modal */}
      <DonateModal
        isOpen={donateModalOpen}
        onClose={() => setDonateModalOpen(false)}
      />

      {/* Pan-India Multi-Basin & GPS Location Selector Modal */}
      <LocationSelectorModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </>
  );
};
