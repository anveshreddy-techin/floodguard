'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DataModeBadge } from './Badges';
import { DataMode } from '@/types';
import { CommandPalette } from './CommandPalette';
import { MobileNavDrawer } from './MobileNavDrawer';
import { useLocation, LOCATIONS } from '@/context/LocationContext';
import { useAdaptive, UserRole, OperatingMode } from '@/context/AdaptiveContext';
import { INDIAN_STATES } from '@/data/states';
import { LANGUAGES, SupportedLanguage } from '@/data/i18n';
import {
  Search, Globe, Menu, Bot, Download, UserCheck, ShieldAlert,
  ChevronDown, MapPin, Radio, Shield, Zap, AlertTriangle,
  Building, PhoneCall, Layers, CheckCircle2
} from 'lucide-react';

export const Header: React.FC<{
  dataMode?: DataMode;
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
    setBasinFilter,
    resetToNational,
    activeHazards,
    regionalModel,
    breadcrumb,
    t,
    isCitizen,
    isOperator,
    isResponder,
    isAnalyst,
    isAdmin,
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

  return (
    <>
      <header 
        className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-2.5 sm:px-4 lg:px-6 sticky top-0 z-40 select-none safe-top shrink-0"
        style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
      >
        {/* Main Upper Bar */}
        <div className="h-14 flex items-center justify-between gap-2 min-w-0">
          {/* Left: Mobile Nav + Brand + Global Mode Selector */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden w-8 h-8 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-cyan-400 active:scale-95 transition shrink-0"
              aria-label="Open Navigation Menu"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Logo Brand */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_rgba(6,182,212,1)] shrink-0" />
              <div className="text-xs sm:text-sm font-black tracking-wider bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent group-hover:brightness-125 transition">
                FLOODGUARD <span className="text-slate-100 font-mono font-normal">AI</span>
              </div>
            </Link>

            {/* 1. Global Operating Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-xl p-0.5 shrink-0">
              <button
                onClick={() => setOperatingMode('DEMO')}
                className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold transition ${
                  operatingMode === 'DEMO'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="DEMO MODE: Deterministic simulation, historical replay, synthetic sensors"
              >
                DEMO MODE
              </button>
              <button
                onClick={() => setOperatingMode('REAL_PILOT')}
                className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold transition ${
                  operatingMode === 'REAL_PILOT'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="REAL/PILOT MODE: Configured telemetry feeds, authenticated sensors, operator workflow"
              >
                REAL/PILOT
              </button>
            </div>

            {/* 2. National Geography Selector (Desktop/Tablet) */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-xl text-xs font-mono text-slate-200 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              
              {/* State Dropdown */}
              <select
                value={hierarchy.state}
                onChange={(e) => {
                  if (e.target.value === 'ALL') {
                    resetToNational();
                  } else {
                    setStateFilter(e.target.value);
                  }
                }}
                className="bg-transparent text-xs text-cyan-300 font-bold focus:outline-none cursor-pointer max-w-[130px] truncate"
              >
                <option value="ALL" className="bg-slate-950 text-slate-400">🇮🇳 Pan-India (All)</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st.id} value={st.name} className="bg-slate-950 text-slate-200">
                    {st.name}
                  </option>
                ))}
              </select>

              <span className="text-slate-600">/</span>

              {/* Village/District Quick Dossier */}
              <select
                value={selectedLocation.id}
                onChange={(e) => {
                  selectLocationById(e.target.value);
                  const loc = LOCATIONS.find(l => l.id === e.target.value);
                  if (loc) {
                    setStateFilter(loc.state);
                    setDistrictFilter(loc.region.split(' ')[0]);
                  }
                }}
                className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-slate-950 text-slate-200">
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Controls: Role Switcher, Language Switcher, SOS, Copilot, Login */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 3. Role Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-700/80 px-2 py-1 rounded-xl text-xs font-mono shrink-0">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="bg-transparent text-xs text-indigo-200 font-bold focus:outline-none cursor-pointer max-w-[130px] truncate"
              >
                {ROLES_LIST.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-950 text-slate-200">
                    {r.iconBadge} {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Multilingual Selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 px-2 py-1 rounded-xl text-xs font-mono shrink-0">
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

            {/* Emergency SOS Rescue Button */}
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

            {/* AI Copilot Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-copilot'));
                }
              }}
              className="px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-mono font-bold bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] active:scale-95 transition shrink-0"
              title="Open Grounded AI Disaster Intelligence Assistant (Hotkey: A)"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden sm:inline">AI COPILOT</span>
            </button>

            {/* Command Palette Search Trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-400 hover:text-slate-200 transition shrink-0"
              title="Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Contextual Adaptive Banner */}
        <div className="py-1.5 border-t border-slate-850 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          {isCitizen ? (
            /* Citizen Adaptive Context */
            <div className="flex flex-wrap items-center gap-2 text-slate-300 w-full justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  {operatingMode === 'DEMO' ? 'DEMO' : 'PILOT'}
                </span>
                <span className="text-slate-400">
                  Location: <strong className="text-white">{hierarchy.district || hierarchy.state}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold">
                  Risk: {selectedLocation.riskLevel} ({selectedLocation.riskScore}/100)
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Link
                  href="/safety"
                  className="px-2.5 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" /> {t('what_to_do')}
                </Link>
                <Link
                  href="/safety"
                  className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold transition"
                >
                  {t('nearby_shelters')}
                </Link>
                <Link
                  href="/upload"
                  className="px-2.5 py-0.5 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold transition"
                >
                  {t('report_flood')}
                </Link>
              </div>
            </div>
          ) : (
            /* Operator / Command Adaptive Context */
            <div className="flex flex-wrap items-center gap-2 text-slate-300 w-full justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-cyan-400 font-bold truncate">
                  {breadcrumb}
                </span>
                <span className="hidden md:inline text-slate-500">|</span>
                <span className="hidden md:inline text-indigo-300 truncate">
                  Model: {regionalModel.split(' ')[0]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40">
                  <Radio className="w-3 h-3 animate-pulse" /> {t('upstream_anomaly')}: ACTIVE
                </span>
                <Link
                  href="/alerts"
                  className="px-2 py-0.5 rounded bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-800/40 font-bold"
                >
                  {t('active_alerts')}: 2
                </Link>
                <Link
                  href="/incidents"
                  className="px-2 py-0.5 rounded bg-blue-950/60 hover:bg-blue-900 text-blue-300 border border-blue-800/40 font-bold"
                >
                  {t('response_tasks')}: 4
                </Link>
                <Link
                  href="/data-sources"
                  className="hidden xs:inline px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  {t('source_health')}: DEGRADED
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Global Mobile Drawer */}
      <MobileNavDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </>
  );
};
