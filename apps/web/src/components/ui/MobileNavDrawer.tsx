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

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

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
      title: 'PUBLIC INFORMATION INTERFACE',
      phaseColor: 'text-amber-400',
      items: [
        { id: 'public-portal', label: 'Public Information Portal', href: '/portal', icon: Globe, badge: 'GOV-STYLE' },
      ],
    },
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
        { id: 'village', label: 'Village Dossier', href: '/village/loc-uk-chamoli', icon: Map },
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

      {/* Modern Aero Slide-out Drawer Sheet */}
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#0c1836] via-[#081229] to-[#040a18] border-r border-cyan-500/30 flex flex-col h-full z-[10000] animate-slide-right shadow-[0_0_60px_rgba(6,182,212,0.25)] safe-top safe-bottom">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-cyan-500/20 bg-[#0c1836]/90 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_rgba(6,182,212,1)]" />
            <div>
              <div className="text-sm font-black text-white font-sans tracking-wide">
                FLOODGUARD <span className="text-cyan-400 font-mono font-normal">AI</span>
              </div>
              <div className="text-[9px] font-mono text-rose-400 font-bold">
                SIH26192 • DISASTER PORTAL
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-center text-cyan-300 hover:text-white active:scale-95 transition shadow-sm"
            aria-label="Close Navigation Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Sections Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 bg-transparent">
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
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/90 border border-cyan-500/30 text-cyan-300 font-bold shadow-sm">
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

        {/* Drawer Bottom Actions: SOS Emergency & AI Assistant */}
        <div className="p-3 border-t border-cyan-500/20 bg-[#070f24]/95 backdrop-blur-xl flex gap-2">
          <button
            onClick={() => {
              onClose();
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-emergency-modal'));
              }
            }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-black flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-95 transition animate-pulse"
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
            className="flex-1 py-2.5 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95 transition"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>AI COPILOT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
