'use client';

import React, { useEffect } from 'react';
import { 
  X, 
  UserCheck, 
  Globe, 
  MapPin, 
  Map, 
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Radio,
  Navigation
} from 'lucide-react';
import { useLocation, LOCATIONS } from '@/context/LocationContext';
import { useAdaptive, UserRole, OperatingMode } from '@/context/AdaptiveContext';
import { LANGUAGES, SupportedLanguage } from '@/data/i18n';
import { INDIAN_STATES } from '@/data/states';

interface MobileConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileConfigDrawer: React.FC<MobileConfigDrawerProps> = ({ isOpen, onClose }) => {
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
  } = useAdaptive();

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center md:hidden select-none">
      {/* 100% Solid Dark Backdrop overlay */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
      />

      {/* Bottom Sheet / Modal for Configuration Controls */}
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0c1836] via-[#081229] to-[#040a18] border-t sm:border border-cyan-500/30 rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[90vh] z-[10000] animate-slide-up shadow-[0_0_60px_rgba(6,182,212,0.3)] safe-bottom">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-cyan-500/20 bg-[#0c1836]/90 backdrop-blur-xl flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-black text-white font-sans tracking-wide">
                FLOODGUARD <span className="text-cyan-400 font-mono font-normal">AI</span>
              </div>
              <div className="text-[9px] font-mono text-rose-400 font-bold">
                SIH26192 • NATIONAL PLATFORM
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-center text-cyan-300 hover:text-white active:scale-95 transition shadow-sm"
            aria-label="Close Sector Configuration"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Configuration Controls Body */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          
          {/* 1. Operating Mode Selector */}
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span>OPERATING MODE:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOperatingMode('DEMO')}
                className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold border transition flex items-center justify-center gap-1.5 ${
                  operatingMode === 'DEMO'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {operatingMode === 'DEMO' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                <span>DEMO MODE</span>
              </button>
              <button
                onClick={() => setOperatingMode('REAL_PILOT')}
                className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold border transition flex items-center justify-center gap-1.5 ${
                  operatingMode === 'REAL_PILOT'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {operatingMode === 'REAL_PILOT' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                <span>REAL/PILOT</span>
              </button>
            </div>
          </div>

          {/* 2. Active User Role Selector */}
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>ACTIVE USER ROLE:</span>
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-indigo-200 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer shadow-sm"
            >
              {ROLES_LIST.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-950 text-slate-200 py-1">
                  {r.iconBadge} {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Language Selector */}
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>LANGUAGE (भाषा):</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer shadow-sm"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-950 text-slate-200 py-1">
                  {l.native} ({l.label})
                </option>
              ))}
            </select>
          </div>

          {/* 4. State / UT Sector */}
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>STATE / UT SECTOR:</span>
            </div>
            <select
              value={hierarchy.state}
              onChange={(e) => {
                setStateFilter(e.target.value);
                const matched = LOCATIONS.find(
                  (l) => l.state.toLowerCase() === e.target.value.toLowerCase() ||
                         e.target.value.toLowerCase().includes(l.state.toLowerCase())
                );
                if (matched) {
                  selectLocationById(matched.id);
                }
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer shadow-sm"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st.id} value={st.name} className="bg-slate-950 text-slate-200 py-1">
                  {st.name} ({st.rivers[0]} Basin)
                </option>
              ))}
            </select>
          </div>

          {/* 5. Monitored Zone / Corridor */}
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-cyan-400" />
              <span>MONITORED ZONE / CORRIDOR:</span>
            </div>
            <select
              value={selectedLocation.id}
              onChange={(e) => {
                selectLocationById(e.target.value);
                const loc = LOCATIONS.find(l => l.id === e.target.value);
                if (loc) setStateFilter(loc.state);
                onClose();
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer shadow-sm"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-slate-950 text-slate-200 py-1">
                  {loc.name} ({loc.region})
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent('open-location-selector'));
              }}
              className="w-full mt-2.5 py-2.5 px-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>DETECT GPS OR BROWSE ALL {LOCATIONS.length} SECTORS</span>
            </button>
          </div>

        </div>

        {/* Footer Apply / Done Button */}
        <div className="p-3 border-t border-cyan-500/20 bg-[#070f24]/95 backdrop-blur-xl rounded-b-3xl">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transition"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>APPLY & CLOSE</span>
          </button>
        </div>

      </div>
    </div>
  );
};
