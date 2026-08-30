'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CommandPalette } from './CommandPalette';
import { MobileNavDrawer } from './MobileNavDrawer';
import { useLocation, LOCATIONS } from '@/context/LocationContext';
import { useAdaptive, UserRole, OperatingMode } from '@/context/AdaptiveContext';
import { INDIAN_STATES } from '@/data/states';
import { LANGUAGES, SupportedLanguage } from '@/data/i18n';
import {
  Search, Globe, Menu, Bot, UserCheck, ShieldAlert,
  MapPin, Radio, PhoneCall, Compass, AlertTriangle,
  ChevronRight, Sparkles
} from 'lucide-react';

export const Header: React.FC<{
  dataMode?: string;
  systemStatus?: string;
  onOpenCopilot?: () => void;
}> = ({ dataMode = 'DEMO', systemStatus = 'OPERATIONAL', onOpenCopilot }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
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

  return (
    <>
      <header 
        className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl sticky top-0 z-40 select-none safe-top shrink-0"
        style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
      >
        {/* Row 1: Primary Navigation Bar (56px) */}
        <div className="h-14 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 max-w-full overflow-hidden">
          
          {/* Left: Hamburger (mobile) + Brand Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 active:scale-95 transition shrink-0"
              aria-label="Open Navigation Menu"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_rgba(6,182,212,1)] shrink-0" />
              <div className="text-xs sm:text-sm font-black tracking-wider bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent group-hover:brightness-125 transition truncate">
                FLOODGUARD <span className="text-slate-100 font-mono font-normal">AI</span>
              </div>
            </Link>

            {/* Desktop Mode Toggle (Large Screens) */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-0.5 shrink-0 ml-2">
              <button
                onClick={() => setOperatingMode('DEMO')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                  operatingMode === 'DEMO'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                DEMO MODE
              </button>
              <button
                onClick={() => setOperatingMode('REAL_PILOT')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                  operatingMode === 'REAL_PILOT'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                REAL/PILOT
              </button>
            </div>

            {/* Desktop State Quick Filter */}
            <div className="hidden xl:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-xl text-xs font-mono text-slate-200 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <select
                value={hierarchy.state}
                onChange={(e) => {
                  if (e.target.value === 'ALL') {
                    resetToNational();
                  } else {
                    setStateFilter(e.target.value);
                  }
                }}
                className="bg-transparent text-xs text-cyan-300 font-bold focus:outline-none cursor-pointer max-w-[120px] truncate"
              >
                <option value="ALL" className="bg-slate-950 text-slate-400">🇮🇳 All States</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st.id} value={st.name} className="bg-slate-950 text-slate-200">
                    {st.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: Controls & Actions (Cleanly separated) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Mobile Mode Switcher Pill */}
            <button
              onClick={() => setOperatingMode(operatingMode === 'DEMO' ? 'REAL_PILOT' : 'DEMO')}
              className={`lg:hidden px-2 py-1 rounded-lg text-[10px] font-mono font-bold border shrink-0 transition active:scale-95 ${
                operatingMode === 'DEMO'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              }`}
              title="Tap to switch mode (DEMO / REAL_PILOT)"
            >
              {operatingMode === 'DEMO' ? 'DEMO' : 'PILOT'}
            </button>

            {/* Desktop Role Selector Dropdown */}
            <div className="hidden md:flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded-xl text-xs font-mono shrink-0">
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

            {/* Language Switcher (Desktop: Dropdown | Mobile: Clean 1-Tap Pill) */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded-xl text-xs font-mono shrink-0">
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

            {/* Mobile 1-Tap Language Pill */}
            <button
              onClick={toggleNextLanguage}
              className="sm:hidden flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 active:scale-95 transition shrink-0"
              title="Tap to switch language"
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span className="font-bold">{language.toUpperCase()}</span>
            </button>

            {/* Search (Ctrl+K) */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition shrink-0 active:scale-95"
              title="Search commands and locations (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* AI Copilot Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-copilot'));
                }
              }}
              className="px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-mono font-bold bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-300 flex items-center gap-1 shadow-[0_0_12px_rgba(6,182,212,0.3)] active:scale-95 transition shrink-0"
              title="Open Grounded AI Disaster Copilot (Hotkey: A)"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden sm:inline">COPILOT</span>
            </button>

            {/* SOS Emergency Rescue Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                }
              }}
              className="px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-mono font-black bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1 shadow-[0_0_15px_rgba(225,29,72,0.6)] active:scale-95 transition shrink-0 animate-pulse"
              title="Open Emergency Rescue & Helpline Dispatch (Hotkey: E)"
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">SOS</span>
            </button>
          </div>
        </div>

        {/* Row 2: Sub-Bar Context & Breadcrumbs (Clean horizontal scroll strip) */}
        <div className="h-8 border-t border-slate-900 px-3 sm:px-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none text-[11px] font-mono select-none">
          {isCitizen ? (
            /* Citizen Context Strip */
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold shrink-0">
                {hierarchy.district || hierarchy.state}
              </span>
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
              <span className="text-cyan-400 font-bold shrink-0 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {breadcrumb}
              </span>
              
              <span className="text-slate-600 shrink-0">|</span>
              
              <span className="text-indigo-300 shrink-0 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {regionalModel.split(' ')[0]}
              </span>

              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40 shrink-0">
                <Radio className="w-3 h-3 animate-pulse text-rose-400" /> Upstream: ACTIVE
              </span>

              <Link
                href="/alerts"
                className="px-2 py-0.5 rounded bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-800/40 font-bold shrink-0"
              >
                {t('active_alerts')}: 2
              </Link>

              <Link
                href="/incidents"
                className="px-2 py-0.5 rounded bg-blue-950/60 hover:bg-blue-900 text-blue-300 border border-blue-800/40 font-bold shrink-0"
              >
                {t('response_tasks')}: 4
              </Link>

              <Link
                href="/data-sources"
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 shrink-0"
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

      {/* Global Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </>
  );
};
