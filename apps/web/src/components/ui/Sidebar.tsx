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
  Settings, 
  UploadCloud, 
  AlertTriangle, 
  FileText, 
  Compass, 
  Cpu, 
  BarChart3, 
  Award,
  PlayCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  LucideIcon
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  shortcut?: string;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  activeTab: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navSections: NavSection[] = [
    {
      title: 'COMMAND',
      items: [
        { id: 'overview', label: 'Command Center', href: '/', icon: ShieldAlert, shortcut: 'M' },
        { id: 'safety', label: 'My Safety & Guidance', href: '/safety', icon: Compass, shortcut: 'S', badge: 'V10' },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'map', label: 'Hyper-Local GIS', href: '/map', icon: Map },
        { id: 'cascade', label: 'Upstream Cascade', href: '/cascade', icon: Layers },
        { id: 'village', label: 'Village Dossier', href: '/village/demo-village-003', icon: Map },
        { id: 'ledger', label: 'Prediction Ledger', href: '/ledger', icon: Database },
        { id: 'events', label: 'Event Memory', href: '/events', icon: History },
        { id: 'hindcast', label: 'Historical Hindcast', href: '/hindcast', icon: History, shortcut: 'H' },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'incidents', label: 'Incident Command', href: '/incidents', icon: FileText },
        { id: 'flight-recorder', label: 'Flight Recorder', href: '/flight-recorder', icon: Radio },
      ],
    },
    {
      title: 'LABS',
      items: [
        { id: 'simulation', label: 'Scenario Simulator', href: '/simulation', icon: PlayCircle },
        { id: 'replay', label: 'Historical Replay', href: '/replay', icon: History, shortcut: 'R' },
        { id: 'sensors', label: 'IoT & Telemetry', href: '/sensors', icon: Activity },
        { id: 'upload', label: 'Data Ingestion', href: '/upload', icon: UploadCloud },
      ],
    },
    {
      title: 'GOVERNANCE',
      items: [
        { id: 'audit', label: 'Audit & Provenance', href: '/audit', icon: FileText },
        { id: 'system', label: 'System Health', href: '/system', icon: HeartPulse },
        { id: 'benchmark', label: 'Event Benchmark', href: '/benchmark', icon: BarChart3 },
      ],
    },
    {
      title: 'SIGNATURE & EVALUATION',
      items: [
        { id: 'predict-save-prove', label: 'Predict · Save · Prove', href: '/predict-save-prove', icon: Award, badge: 'FLAGSHIP' },
        { id: 'challenge', label: 'Judge Challenge Mode', href: '/challenge', icon: HelpCircle, badge: 'EVAL' },
      ],
    },
  ];

  return (
    <aside
      className={`border-r border-[#223354] bg-[#070d1e] flex flex-col justify-between transition-all duration-300 select-none z-30 ${
        collapsed ? 'w-16' : 'w-60 xl:w-64'
      }`}
    >
      <div className="p-3 space-y-4 overflow-y-auto flex-1">
        {/* Collapse Toggle Button */}
        <div className="flex items-center justify-between px-1">
          {!collapsed && (
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              NAVIGATION
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition ml-auto"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Sections */}
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <div className="text-[9px] font-mono font-semibold text-slate-500 px-2 uppercase tracking-wider">
                {section.title}
              </div>
            )}
            <div className="space-y-0.5">
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
                        ? 'bg-blue-600/30 text-cyan-300 font-bold border border-cyan-400/40 shadow-inner'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      {!collapsed && <span className="truncate text-xs">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0 font-bold">
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

      {/* Footer / Shortcut Help */}
      {!collapsed && (
        <div className="p-3 border-t border-[#223354] text-[10px] font-mono text-slate-500 flex items-center justify-between bg-[#050914]">
          <span>SIH26192 • V10.0</span>
          <span className="text-emerald-400">100% AUDITED</span>
        </div>
      )}
    </aside>
  );
};
