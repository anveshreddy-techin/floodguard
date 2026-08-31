'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X, ShieldAlert, Map, Layers, History, Activity, Database, 
  Radio, UploadCloud, FileText, Compass, BarChart3, Award, 
  PlayCircle, HelpCircle, HeartPulse, ShieldCheck, Globe, 
  PhoneCall, Sparkles, ArrowRight, Download, UserCheck, RefreshCw,
  Server, Brain, Zap, Users, Bot, MapPin, CloudRain, Heart
} from 'lucide-react';
import { useLocation, LOCATIONS } from '@/context/LocationContext';
import { useAdaptive, UserRole, OperatingMode } from '@/context/AdaptiveContext';
import { LANGUAGES, SupportedLanguage } from '@/data/i18n';
import { INDIAN_STATES } from '@/data/states';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
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

  const navSections = [
    {
      title: 'DURING • RESPONSE & RESCUE',
      phaseColor: 'text-rose-400',
      items: [
        { id: 'overview', label: 'Command Center', href: '/', icon: ShieldAlert, badge: 'LIVE' },
        { id: 'donate', label: 'Disaster Relief Funds', href: '/donate', icon: Heart, badge: '80G EXEMPT' },
        { id: 'safety', label: 'My Safety & Guidance', href: '/safety', icon: Compass, badge: 'HUD' },
        { id: 'incidents', label: 'Incident Command', href: '/incidents', icon: FileText },
      ],
    },
    {
      title: 'BEFORE • PLANNING & MITIGATION',
      phaseColor: 'text-cyan-400',
      items: [
        { id: 'map', label: 'Hyper-Local GIS', href: '/map', icon: Map },
        { id: 'cascade', label: 'Upstream Cascade', href: '/cascade', icon: Layers },
        { id: 'weather', label: 'Weather Intelligence', href: '/weather', icon: CloudRain, badge: 'IMD+NWP' },
        { id: 'village', label: 'Village Dossier', href: '/village/demo-village-003', icon: Map },
        { id: 'simulation', label: 'Scenario Simulator', href: '/simulation', icon: PlayCircle, badge: 'WHAT-IF' },
        { id: 'sensors', label: 'IoT & Telemetry', href: '/sensors', icon: Activity },
        { id: 'upload', label: 'Data Ingestion', href: '/upload', icon: UploadCloud },
      ],
    },
    {
      title: 'AFTER • AUDIT, MEMORY & LEARNING',
      phaseColor: 'text-purple-400',
      items: [
        { id: 'flight-recorder', label: 'Flight Recorder', href: '/flight-recorder', icon: Radio, badge: 'BLACK-BOX' },
        { id: 'hindcast', label: 'Historical Hindcast', href: '/hindcast', icon: History },
        { id: 'replay', label: 'Historical Replay', href: '/replay', icon: History },
        { id: 'ledger', label: 'Prediction Ledger', href: '/ledger', icon: Database },
        { id: 'events', label: 'Event Memory', href: '/events', icon: History },
        { id: 'benchmark', label: 'Event Benchmark', href: '/benchmark', icon: BarChart3 },
        { id: 'audit', label: 'Audit & Provenance', href: '/audit', icon: ShieldCheck },
        { id: 'system', label: 'System Health', href: '/system', icon: HeartPulse },
      ],
    },
    {
      title: 'INDIA-WIDE • NATIONAL INTELLIGENCE',
      phaseColor: 'text-green-400',
      items: [
        { id: 'data-sources', label: 'Data Sources', href: '/data-sources', icon: Server },
        { id: 'ingestion', label: 'Ingestion Jobs', href: '/ingestion', icon: RefreshCw },
        { id: 'model-monitoring', label: 'ML Models', href: '/model-monitoring', icon: Brain },
        { id: 'recovery', label: 'Recovery', href: '/recovery', icon: Zap },
        { id: 'cross-border', label: 'Cross-Border Basins', href: '/cross-border', icon: Globe },
        { id: 'missing-persons', label: 'Missing Persons', href: '/missing-persons', icon: Users, badge: 'PROTECTED' },
        { id: 'admin', label: 'Admin Governance', href: '/admin', icon: ShieldCheck },
      ],
    },
    {
      title: 'SPECIAL • EVALUATION ARENA',
      phaseColor: 'text-amber-400',
      items: [
        { id: 'predict-save-prove', label: 'Predict · Save · Prove', href: '/predict-save-prove', icon: Award, badge: 'FLAGSHIP' },
        { id: 'challenge', label: 'Judge Challenge Mode', href: '/challenge', icon: HelpCircle, badge: 'ARENA' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex md:hidden select-none">
      {/* 100% Solid Dark Backdrop overlay with zero bleed */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
      />

      {/* 100% Solid Opaque Slide-out Drawer Sheet */}
      <div className="relative w-full max-w-sm bg-[#030712] border-r border-slate-800 flex flex-col h-full z-[10000] animate-slide-right shadow-[0_0_50px_rgba(0,0,0,0.95)] safe-top safe-bottom">
        {/* Drawer Header (Solid Opaque) */}
        <div className="p-4 border-b border-slate-800 bg-[#030712] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
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
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition"
            aria-label="Close Navigation Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Mode + Role + Language Controls Grid (Solid Opaque) */}
        <div className="p-3 border-b border-slate-800 bg-[#080f24] space-y-2.5">
          
          {/* Operating Mode Selector */}
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
              OPERATING MODE:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setOperatingMode('DEMO')}
                className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border transition ${
                  operatingMode === 'DEMO'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                DEMO MODE
              </button>
              <button
                onClick={() => setOperatingMode('REAL_PILOT')}
                className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border transition ${
                  operatingMode === 'REAL_PILOT'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                REAL/PILOT
              </button>
            </div>
          </div>

          {/* Role Selector */}
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-indigo-400" />
              <span>ACTIVE USER ROLE:</span>
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-indigo-200 font-bold focus:outline-none focus:border-cyan-400"
            >
              {ROLES_LIST.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-950 text-slate-200">
                  {r.iconBadge} {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>LANGUAGE (भाषा):</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 font-bold focus:outline-none focus:border-cyan-400"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-950 text-slate-200">
                  {l.native} ({l.label})
                </option>
              ))}
            </select>
          </div>

          {/* State / UT Selector */}
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
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
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st.id} value={st.name} className="bg-slate-950 text-slate-200">
                  {st.name} ({st.rivers[0]} Basin)
                </option>
              ))}
            </select>
          </div>

          {/* Location Sector Switcher */}
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
              <Map className="w-3 h-3 text-cyan-400" />
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
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 font-bold focus:outline-none focus:border-cyan-400"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-slate-950 text-slate-200">
                  {loc.name} ({loc.region})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Navigation Sections Scroll Area (100% Solid Opaque Background) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-[#030712]">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <div className={`text-[9px] font-mono font-bold px-2 tracking-wider ${sec.phaseColor}`}>
                {sec.title}
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition font-medium active:scale-98 ${
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Bottom Actions: SOS Emergency & AI Assistant (Solid Opaque) */}
        <div className="p-3 border-t border-slate-800 bg-[#030712] flex gap-2">
          <button
            onClick={() => {
              onClose();
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-emergency-modal'));
              }
            }}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-black flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>SOS RESCUE</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-copilot'));
              }
            }}
            className="flex-1 py-2.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>AI COPILOT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
