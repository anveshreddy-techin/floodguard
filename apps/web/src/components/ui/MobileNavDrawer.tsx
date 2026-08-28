'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X, 
  ShieldAlert, 
  Map, 
  Layers, 
  History, 
  Activity, 
  Database, 
  Radio, 
  UploadCloud, 
  FileText, 
  Compass, 
  BarChart3, 
  Award, 
  PlayCircle, 
  HelpCircle, 
  HeartPulse, 
  ShieldCheck, 
  Globe, 
  PhoneCall,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useLocation, LOCATIONS } from '@/context/LocationContext';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { selectedLocation, selectLocationById } = useLocation();

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

  const navSections = [
    {
      title: 'DURING • RESPONSE & RESCUE',
      phaseColor: 'text-rose-400',
      items: [
        { id: 'overview', label: 'Command Center', href: '/', icon: ShieldAlert, badge: 'LIVE' },
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
      title: 'SPECIAL • EVALUATION ARENA',
      phaseColor: 'text-amber-400',
      items: [
        { id: 'predict-save-prove', label: 'Predict · Save · Prove', href: '/predict-save-prove', icon: Award, badge: 'FLAGSHIP' },
        { id: 'challenge', label: 'Judge Challenge Mode', href: '/challenge', icon: HelpCircle, badge: 'ARENA' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in select-none">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Slide-out drawer sheet */}
      <div className="relative w-full max-w-sm bg-slate-950/95 border-r border-slate-800 flex flex-col h-full z-10 animate-slide-right shadow-2xl safe-top safe-bottom">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            <div>
              <div className="text-sm font-black text-white font-sans tracking-wide">
                FLOODGUARD <span className="text-cyan-400 font-mono font-normal">AI</span>
              </div>
              <div className="text-[9px] font-mono text-rose-400 font-bold">
                SIH26192 • THEME 4 DISASTER MGMT
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white active:scale-95 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Region Switcher */}
        <div className="p-3 border-b border-slate-800/60 bg-slate-900/40">
          <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>OPERATIONAL SECTOR:</span>
          </div>
          <select
            value={selectedLocation.id}
            onChange={(e) => {
              selectLocationById(e.target.value);
              onClose();
            }}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 font-bold focus:outline-none focus:border-cyan-400"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id} className="bg-slate-950 text-slate-200">
                {loc.name} ({loc.region})
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Sections Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
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
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          item.badge === 'LIVE'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : item.badge === 'HUD'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : 'bg-slate-900 text-slate-300 border border-slate-700'
                        }`}>
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

        {/* Drawer Footer with Quick Emergency Call */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/90 space-y-2">
          <Link
            href="/safety"
            onClick={onClose}
            className="btn-danger w-full py-2.5 rounded-xl text-xs font-mono font-bold text-white flex items-center justify-center gap-2 shadow-lg"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>EMERGENCY ESCAPE HUD</span>
          </Link>

          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 px-1 pt-1">
            <span>v10.0 • Mobile HUD</span>
            <span className="text-emerald-400 font-bold">100% Cryptographic Audit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
