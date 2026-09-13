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
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Bottom Sheet / Modal for Configuration Controls */}
      <div className="relative w-full max-w-lg bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[90vh] z-[10000] animate-slide-up shadow-2xl safe-bottom text-slate-900 font-sans">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 font-sans tracking-wide">
                FLOODGUARD <span className="text-blue-600 font-sans font-bold">AI</span>
              </div>
              <div className="text-[10px] font-sans font-bold text-blue-700">
                SIH26192 • NATIONAL PLATFORM
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition shadow-sm"
            aria-label="Close Sector Configuration"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Configuration Controls Body */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          
          {/* 1. Operating Mode Selector */}
          <div>
            <div className="text-[11px] font-sans font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-600" />
              <span>OPERATING MODE:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOperatingMode('DEMO')}
                className={`py-2.5 px-3 rounded-xl text-xs font-sans font-bold border transition flex items-center justify-center gap-1.5 ${
                  operatingMode === 'DEMO'
                    ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {operatingMode === 'DEMO' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                <span>DEMO MODE</span>
              </button>
              <button
                onClick={() => setOperatingMode('REAL_PILOT')}
                className={`py-2.5 px-3 rounded-xl text-xs font-sans font-bold border transition flex items-center justify-center gap-1.5 ${
                  operatingMode === 'REAL_PILOT'
                    ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-sm font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {operatingMode === 'REAL_PILOT' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                <span>REAL/PILOT</span>
              </button>
            </div>
          </div>

          {/* 2. Active User Role Selector */}
          <div>
            <div className="text-[11px] font-sans font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>ACTIVE USER ROLE:</span>
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-sans text-slate-800 font-bold focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
            >
              {ROLES_LIST.map((r) => (
                <option key={r.id} value={r.id} className="bg-white text-slate-800 py-1">
                  {r.iconBadge} {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Language Selector */}
          <div>
            <div className="text-[11px] font-sans font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>LANGUAGE (भाषा):</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-sans text-slate-800 font-bold focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-white text-slate-800 py-1">
                  {l.native} ({l.label})
                </option>
              ))}
            </select>
          </div>

          {/* 4. State / UT Sector */}
          <div>
            <div className="text-[11px] font-sans font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
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
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-sans text-slate-800 font-bold focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st.id} value={st.name} className="bg-white text-slate-800 py-1">
                  {st.name} ({st.rivers[0]} Basin)
                </option>
              ))}
            </select>
          </div>

          {/* 5. Monitored Zone / Corridor */}
          <div>
            <div className="text-[11px] font-sans font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-blue-600" />
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
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-sans text-slate-800 font-bold focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-white text-slate-800 py-1">
                  {loc.name} ({loc.region})
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent('open-location-selector'));
              }}
              className="w-full mt-2.5 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-sans text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
              <span>DETECT GPS OR BROWSE ALL {LOCATIONS.length} SECTORS</span>
            </button>
          </div>

        </div>

        {/* Footer Apply / Done Button */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>APPLY &amp; CLOSE</span>
          </button>
        </div>

      </div>
    </div>
  );
};
