'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Map, 
  Layers, 
  Activity, 
  UploadCloud, 
  PlayCircle, 
  FileText,
  HelpCircle,
  Clock,
  MapPin,
  HeartPulse,
  Compass,
  History,
  Database,
  BookOpen,
  BarChart3,
  Radio,
  Award,
} from 'lucide-react';

export const Sidebar: React.FC<{ activeTab?: string }> = ({ activeTab = 'overview' }) => {
  const primaryNav = [
    { id: 'overview', label: 'Command Center', href: '/', icon: ShieldAlert },
    { id: 'safety', label: 'My Safety & Guidance', href: '/safety', icon: Compass, badge: 'V9' },
    { id: 'hindcast', label: 'Historical Hindcast Lab', href: '/hindcast', icon: History, badge: 'V9' },
    { id: 'predict-save-prove', label: 'Predict · Save · Prove', href: '/predict-save-prove', icon: Award, badge: 'FLAGSHIP' },
    { id: 'challenge', label: 'Judge Challenge Mode', href: '/challenge', icon: HelpCircle, highlight: true },
  ];

  const intelligenceNav = [
    { id: 'map', label: 'Hyper-Local GIS', href: '/map', icon: Map },
    { id: 'cascade', label: 'Upstream Cascade', href: '/cascade', icon: Layers },
    { id: 'village', label: 'Village Dossier', href: '/village/demo-village-003', icon: MapPin },
    { id: 'ledger', label: 'Prediction Ledger', href: '/ledger', icon: Database },
    { id: 'events', label: 'Event Memory', href: '/events', icon: BookOpen },
    { id: 'benchmark', label: 'Event Benchmark', href: '/benchmark', icon: BarChart3 },
    { id: 'flight-recorder', label: 'Flight Recorder', href: '/flight-recorder', icon: Radio },
  ];

  const operationsNav = [
    { id: 'simulation', label: 'Scenario Simulator', href: '/simulation', icon: PlayCircle },
    { id: 'replay', label: 'Historical Replay', href: '/replay', icon: Clock },
    { id: 'sensors', label: 'IoT & Telemetry', href: '/sensors', icon: Activity },
    { id: 'upload', label: 'Data Ingestion', href: '/upload', icon: UploadCloud },
    { id: 'incidents', label: 'Incident Command', href: '/incidents', icon: FileText },
    { id: 'audit', label: 'Audit & Provenance', href: '/audit', icon: FileText },
    { id: 'system', label: 'System Health', href: '/system', icon: HeartPulse },
  ];

  return (
    <aside className="w-64 border-r border-[#3a506b] bg-[#0e1630] flex flex-col justify-between p-3.5 hidden lg:flex shrink-0 overflow-y-auto max-h-screen">
      <div className="space-y-4">
        {/* Primary Suite */}
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5 font-mono">
            CORE DISASTER SUITE
          </div>
          <div className="space-y-1">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    item.highlight
                      ? 'bg-amber-950/70 text-amber-300 border border-amber-700/80 hover:bg-amber-900/60 font-bold'
                      : isActive
                      ? 'bg-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${item.highlight ? 'text-amber-400' : 'text-cyan-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      item.badge === 'FLAGSHIP' ? 'bg-amber-900 text-amber-200' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Intelligence & Hindcast */}
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5 font-mono">
            INTELLIGENCE & HINDCAST
          </div>
          <div className="space-y-1">
            {intelligenceNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Operations & Tooling */}
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5 font-mono">
            OPERATIONS & LABS
          </div>
          <div className="space-y-1">
            {operationsNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-3 space-y-2 mt-4">
        <div className="bg-slate-900/90 rounded p-2 text-[10px] text-slate-400 border border-slate-800 font-mono">
          <div className="text-amber-400 font-semibold">TRUTHFULNESS LOCK</div>
          <div>Strict hindsight lock active. Zero fake live or safe claims.</div>
        </div>
      </div>
    </aside>
  );
};
