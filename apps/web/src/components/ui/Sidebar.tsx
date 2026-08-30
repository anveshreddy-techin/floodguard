'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
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
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  LucideIcon,
  ShieldCheck,
  Zap,
  Flame,
  LifeBuoy,
  Globe,
  Brain,
  RefreshCw,
  Server,
  Users

} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  shortcut?: string;
  badge?: string;
  phase?: 'BEFORE' | 'DURING' | 'AFTER';
}

interface NavSection {
  title: string;
  phaseDesc?: string;
  phaseColor?: string;
  items: NavItem[];
}

interface SidebarProps {
  activeTab?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = '' }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navSections: NavSection[] = [
    {
      title: 'DURING • RESPONSE & RESCUE',
      phaseDesc: 'Disaster In-Progress Operations',
      phaseColor: 'text-rose-400',
      items: [
        { id: 'overview', label: 'Command Center', href: '/', icon: ShieldAlert, shortcut: 'M', badge: 'LIVE' },
        { id: 'safety', label: 'My Safety & Guidance', href: '/safety', icon: Compass, shortcut: 'S', badge: 'HUD' },
        { id: 'incidents', label: 'Incident Command', href: '/incidents', icon: FileText },
      ],
    },
    {
      title: 'BEFORE • PLANNING & MITIGATION',
      phaseDesc: 'Pre-Disaster Risk Reduction',
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
      phaseDesc: 'Post-Disaster Forensic Review',
      phaseColor: 'text-purple-400',
      items: [
        { id: 'flight-recorder', label: 'Flight Recorder', href: '/flight-recorder', icon: Radio, badge: 'BLACK-BOX' },
        { id: 'hindcast', label: 'Historical Hindcast', href: '/hindcast', icon: History, shortcut: 'H' },
        { id: 'replay', label: 'Historical Replay', href: '/replay', icon: History, shortcut: 'R' },
        { id: 'ledger', label: 'Prediction Ledger', href: '/ledger', icon: Database },
        { id: 'events', label: 'Event Memory', href: '/events', icon: History },
        { id: 'benchmark', label: 'Event Benchmark', href: '/benchmark', icon: BarChart3 },
        { id: 'audit', label: 'Audit & Provenance', href: '/audit', icon: ShieldCheck },
        { id: 'system', label: 'System Health', href: '/system', icon: HeartPulse },
      ],
    },
    {
      title: 'SPECIAL • EVALUATION ARENA',
      phaseDesc: 'SIH26192 Flagship Features',
      phaseColor: 'text-amber-400',
      items: [
        { id: 'predict-save-prove', label: 'Predict · Save · Prove', href: '/predict-save-prove', icon: Award, badge: 'FLAGSHIP' },
        { id: 'challenge', label: 'Judge Challenge Mode', href: '/challenge', icon: HelpCircle, badge: 'ARENA' },
      ],
    },
    {
      title: 'INDIA-WIDE • NATIONAL INTELLIGENCE',
      phaseDesc: 'Provider Registry, Pipeline & Analytics',
      phaseColor: 'text-green-400',
      items: [
        { id: 'data-sources', label: 'Data Sources', href: '/data-sources', icon: Server },
        { id: 'ingestion', label: 'Ingestion Jobs', href: '/ingestion', icon: RefreshCw },
        { id: 'model-monitoring', label: 'ML Models', href: '/model-monitoring', icon: Brain },
        { id: 'recovery', label: 'Recovery', href: '/recovery', icon: Zap },
        { id: 'cross-border', label: 'Cross-Border Basins', href: '/cross-border', icon: Globe },
        { id: 'missing-persons', label: 'Missing Persons', href: '/missing-persons', icon: Users, badge: 'PROTECTED' },
      ],
    },

  ];

  return (
    <aside
      className={`hidden md:flex border-r border-slate-800/60 bg-slate-950/80 backdrop-blur-xl flex-col justify-between transition-all duration-300 select-none z-[200] ${
        collapsed ? 'w-16' : 'w-64 xl:w-72'
      }`}
      style={{ boxShadow: '2px 0 20px rgba(0,0,0,0.4)' }}
    >
      <div className="p-3 space-y-4 overflow-y-auto flex-1">
        {/* Collapse Toggle & Disaster Theme Tag */}
        <div className="flex items-center justify-between px-1">
          {!collapsed && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-wider">
                DISASTER MANAGEMENT
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition ml-auto active:scale-95"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 3-Phase Categorized Navigation Sections */}
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <div className="px-2 pt-1">
                <div className={`text-[9px] font-mono font-bold tracking-wider ${section.phaseColor || 'text-slate-400'}`}>
                  {section.title}
                </div>
                {section.phaseDesc && (
                  <div className="text-[8px] font-mono text-slate-500">
                    {section.phaseDesc}
                  </div>
                )}
              </div>
            )}
            <div className="space-y-0.5 mt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition font-medium group relative ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      {!collapsed && <span className="truncate text-xs">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 font-bold ${
                        item.badge === 'LIVE'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : item.badge === 'HUD'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'bg-slate-900 text-slate-300 border border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {!collapsed && item.shortcut && !item.badge && (
                      <span className="text-[9px] font-mono text-slate-600 border border-slate-800 px-1 rounded">
                        {item.shortcut}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Theme Badge */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800/60 text-[10px] font-mono text-slate-400 flex items-center justify-between bg-slate-950/60">
          <span className="font-bold text-cyan-300">SIH26192 • THEME 4</span>
          <span className="text-emerald-400 font-bold">100% AUDITED</span>
        </div>
      )}
    </aside>
  );
};
