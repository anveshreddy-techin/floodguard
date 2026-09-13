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
      phaseColor: 'text-amber-700',
      items: [
        { id: 'public-portal', label: 'Public Information Portal', href: '/portal', icon: Globe, badge: 'GOV-STYLE' },
      ],
    },
    {
      title: 'DURING • RESPONSE & RESCUE',
      phaseColor: 'text-red-700',
      items: [
        { id: 'overview', label: 'Command Center', href: '/', icon: ShieldAlert, badge: 'LIVE' },

        { id: 'safety', label: 'My Safety & Guidance', href: '/safety', icon: Compass, badge: 'HUD' },
        { id: 'incidents', label: 'Incident Command', href: '/incidents', icon: FileText },
      ],
    },
    {
      title: 'BEFORE • PLANNING & MITIGATION',
      phaseColor: 'text-blue-700',
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
      phaseColor: 'text-purple-700',
      items: [
        { id: 'flight-recorder', label: 'Flight Recorder', href: '/flight-recorder', icon: Radio },
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
      phaseColor: 'text-emerald-700',
      items: [
        { id: 'data-sources', label: 'Data Sources', href: '/data-sources', icon: Server },
        { id: 'ingestion', label: 'Ingestion Jobs', href: '/ingestion', icon: RefreshCw },
        { id: 'model-monitoring', label: 'ML Models', href: '/model-monitoring', icon: Brain },
        { id: 'recovery', label: 'Recovery', href: '/recovery', icon: Zap },
        { id: 'cross-border', label: 'Cross-Border Basins', href: '/cross-border', icon: Globe },
        { id: 'admin', label: 'Admin Governance', href: '/admin', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex md:hidden select-none font-sans">
      {/* 100% Solid Dark Backdrop overlay with zero bleed */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modern Aero Slide-out Drawer Sheet */}
      <div className="relative w-full max-w-sm bg-white border-r border-slate-200 flex flex-col h-full z-[10000] animate-slide-right shadow-2xl safe-top safe-bottom text-slate-900 font-sans">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600 animate-ping shadow-sm" />
            <div>
              <div className="text-sm font-bold text-slate-900 font-sans tracking-wide">
                FLOODGUARD <span className="text-blue-600 font-bold">AI</span>
              </div>
              <div className="text-[10px] font-sans text-blue-700 font-semibold">
                SIH26192 • DISASTER PORTAL
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition shadow-sm"
            aria-label="Close Navigation Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Sections Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 bg-white">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <div className={`text-[10px] font-sans font-bold px-2 tracking-wider ${sec.phaseColor}`}>
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
                          ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-sm'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold shadow-sm">
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
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex gap-2">
          <button
            onClick={() => {
              onClose();
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-emergency-modal'));
              }
            }}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
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
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
          >
            <Bot className="w-4 h-4 text-white" />
            <span>AI COPILOT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
