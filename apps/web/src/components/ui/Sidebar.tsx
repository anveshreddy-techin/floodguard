'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, Map, Layers, History, Activity, Database, 
  Radio, UploadCloud, FileText, Compass, BarChart3, 
  PlayCircle, ChevronLeft, ChevronRight, ChevronDown,
  ShieldCheck, Zap, Globe, Brain, RefreshCw, Server, 
  Users, Waves, CloudRain, AlertTriangle, MapPin, LucideIcon
} from 'lucide-react';

export interface SubApp {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  tag?: string;
  badgeColor?: 'red' | 'blue' | 'green' | 'amber' | 'purple';
}

export interface AppHubOption {
  id: string;
  title: string;
  shortTitle: string;
  desc: string;
  icon: LucideIcon;
  badge: string;
  accentColor: string;
  defaultHref: string;
  relatedApps: SubApp[];
}

export const APP_HUB_OPTIONS: AppHubOption[] = [
  {
    id: 'hub-ops',
    title: 'Operations & Emergency Hub',
    shortTitle: 'Operations',
    desc: 'Live Command, Alerts, Roles & Evacuation',
    icon: ShieldAlert,
    badge: 'Response',
    accentColor: '#DC2626',
    defaultHref: '/',
    relatedApps: [
      { id: 'overview', label: 'Command Center', href: '/', icon: ShieldAlert, tag: 'Live Ops', badgeColor: 'red' },
      { id: 'dashboard-alerts', label: 'Live Dashboard & Alerts', href: '/dashboard', icon: AlertTriangle, tag: 'Alerts', badgeColor: 'red' },
      { id: 'role-workspace', label: 'Role Workspaces & SOPs', href: '/role-workspace', icon: Users, tag: 'Roles & SOP' },
      { id: 'safety', label: 'Evacuation & Safety HUD', href: '/safety', icon: Compass, tag: 'Rescue', badgeColor: 'green' },
    ],
  },
  {
    id: 'hub-gis',
    title: 'Geospatial & Hydrology Lab',
    shortTitle: 'Geospatial Lab',
    desc: 'Terrain GIS, River Basins, Cascade & Simulation',
    icon: Map,
    badge: 'GIS Lab',
    accentColor: '#2563EB',
    defaultHref: '/map',
    relatedApps: [
      { id: 'map', label: 'Hyper-Local GIS Map', href: '/map', icon: Map, tag: 'Satellite', badgeColor: 'blue' },
      { id: 'river-basins', label: 'National River Basins', href: '/river-basins', icon: Waves, tag: 'Surge Map' },
      { id: 'cascade', label: 'Cascade Physics & Simulation', href: '/cascade', icon: Layers, tag: 'Physics & Lab' },
      { id: 'village', label: 'Village Dossier Inspector', href: '/village/loc-uk-chamoli', icon: MapPin, tag: 'Ground' },
    ],
  },
  {
    id: 'hub-met',
    title: 'Meteorology & Ingestion Pipeline',
    shortTitle: 'Meteorology',
    desc: 'Weather, IoT Sensors & Data Ingestion',
    icon: CloudRain,
    badge: 'Telemetry',
    accentColor: '#059669',
    defaultHref: '/weather',
    relatedApps: [
      { id: 'weather', label: 'Weather & Radar Intelligence', href: '/weather', icon: CloudRain, tag: 'Radar/NWP', badgeColor: 'blue' },
      { id: 'sensors', label: 'IoT & Telemetry Network', href: '/sensors', icon: Activity, tag: 'LoRaWAN' },
      { id: 'upload', label: 'Data Ingestion & Providers', href: '/upload', icon: UploadCloud, tag: 'Intake & CWC' },
    ],
  },
  {
    id: 'hub-forensics',
    title: 'Forensics, Hindcast & Audit',
    shortTitle: 'Forensics',
    desc: 'Historical Replay, Benchmarking & Audit',
    icon: History,
    badge: 'Forensics',
    accentColor: '#7C3AED',
    defaultHref: '/hindcast',
    relatedApps: [
      { id: 'hindcast', label: 'Historical Hindcast & Replay', href: '/hindcast', icon: History, tag: '2000-2026', badgeColor: 'purple' },
      { id: 'ledger', label: 'Prediction Ledger & Flight Recorder', href: '/ledger', icon: Database, tag: 'Ledger & Audit' },
      { id: 'benchmark', label: 'Benchmark & Accuracy Metrics', href: '/benchmark', icon: BarChart3, tag: 'Holdout' },
    ],
  },
  {
    id: 'hub-gov',
    title: 'Governance & Public Administration',
    shortTitle: 'Governance',
    desc: 'NDRF ML Models, Admin RBAC & Citizen Services',
    icon: Brain,
    badge: 'Gov & ML',
    accentColor: '#D97706',
    defaultHref: '/model-monitoring',
    relatedApps: [
      { id: 'model-monitoring', label: 'NDRF ML Model Studio', href: '/model-monitoring', icon: Brain, tag: 'AI Eval', badgeColor: 'blue' },
      { id: 'admin', label: 'Admin Governance & Cross-Border', href: '/admin', icon: ShieldCheck, tag: 'Admin & Basins' },
      { id: 'public-portal', label: 'Public Citizen Portal & Recovery', href: '/portal', icon: Globe, tag: 'Public & Rehab', badgeColor: 'amber' },
    ],
  },
];

interface SidebarProps {
  activeTab?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = '' }) => {
  const [collapsed, setCollapsed] = useState(false);

  const [expandedHubs, setExpandedHubs] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    APP_HUB_OPTIONS.forEach((h) => {
      initial[h.id] = true;
    });
    return initial;
  });

  const toggleHub = (hubId: string) => {
    setExpandedHubs((prev) => ({
      ...prev,
      [hubId]: !prev[hubId],
    }));
  };

  return (
    <aside
      className={`hidden md:flex flex-col justify-between transition-all duration-300 select-none z-30 shrink-0 bg-white border-r border-slate-200/90 shadow-[1px_0_6px_rgba(0,0,0,0.03)] h-full ${
        collapsed ? 'w-16' : 'w-64 xl:w-72'
      }`}
    >
      {/* ── Top Bar with Section Title & Collapse Toggle ── */}
      <div className="px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/80">
        {!collapsed && (
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
            DISASTER HUBS
          </span>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition active:scale-95 ml-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Scrollable Application Hubs Container ── */}
      <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1 min-h-0 custom-sidebar-scroll">
        {APP_HUB_OPTIONS.map((hub) => {
          const HubIcon = hub.icon;
          const isHubExpanded = !!expandedHubs[hub.id];
          const hasActiveChild = hub.relatedApps.some(
            (a) => a.id === activeTab || (activeTab.startsWith('village') && a.id === 'village')
          );

          return (
            <div 
              key={hub.id}
              className={`rounded-2xl transition-all border ${
                hasActiveChild 
                  ? 'bg-blue-50/60 border-blue-200 shadow-2xs' 
                  : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/60'
              }`}
            >
              {/* Hub Option Header */}
              {!collapsed ? (
                <div className="p-2 flex items-center justify-between gap-1.5">
                  <Link
                    href={hub.defaultHref}
                    className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-90 group"
                    title={hub.desc}
                  >
                    <div 
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ background: `${hub.accentColor}18`, color: hub.accentColor }}
                    >
                      <HubIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800 tracking-normal truncate group-hover:text-blue-600 transition">
                        {hub.shortTitle}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate font-medium">
                        {hub.badge}
                      </div>
                    </div>
                  </Link>

                  {/* Expand/Collapse Toggle for Related Apps */}
                  <button
                    onClick={() => toggleHub(hub.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
                    title={isHubExpanded ? 'Collapse related applications' : 'Expand related applications'}
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isHubExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ) : (
                /* Collapsed Icon-Only Option */
                <Link
                  href={hub.defaultHref}
                  className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all my-1.5 shadow-2xs"
                  style={{
                    background: hasActiveChild ? '#2563EB' : '#F1F5F9',
                    color: hasActiveChild ? '#FFFFFF' : '#475569',
                  }}
                  title={`${hub.title} (${hub.relatedApps.length} related apps)`}
                >
                  <HubIcon className="w-4 h-4" />
                </Link>
              )}

              {/* Related Sub-Applications (Nested in the same option) */}
              {!collapsed && isHubExpanded && (
                <div className="px-2 pb-2 pt-0.5 space-y-1 border-t border-slate-200/60 font-sans">
                  {hub.relatedApps.map((subApp) => {
                    const SubIcon = subApp.icon;
                    const isActive = activeTab === subApp.id || (activeTab.startsWith('village') && subApp.id === 'village');

                    let badgeBg = 'bg-slate-100 text-slate-600 border-slate-200';
                    if (subApp.badgeColor === 'red') badgeBg = 'bg-red-50 text-red-700 border-red-200';
                    else if (subApp.badgeColor === 'blue') badgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
                    else if (subApp.badgeColor === 'green') badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    else if (subApp.badgeColor === 'amber') badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
                    else if (subApp.badgeColor === 'purple') badgeBg = 'bg-purple-50 text-purple-700 border-purple-200';

                    return (
                      <Link
                        key={subApp.id}
                        href={subApp.href}
                        className={`flex items-center justify-between pl-2.5 pr-2 py-1.5 rounded-lg text-xs transition group relative ${
                          isActive 
                            ? 'bg-blue-600 text-white font-bold shadow-xs' 
                            : 'text-slate-600 hover:bg-white hover:text-blue-700 hover:border-slate-200/90 border border-transparent font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                          <span className="truncate text-xs">{subApp.label}</span>
                        </div>

                        {subApp.tag && (
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0 border ${
                            isActive ? 'bg-blue-700 text-blue-100 border-blue-500/40' : badgeBg
                          }`}>
                            {subApp.tag}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-200 bg-slate-50/80 text-xs font-sans flex items-center justify-between text-slate-500 shrink-0">
          <span className="font-semibold text-slate-700">SIH26192 • Theme 4</span>
          <span className="text-emerald-700 font-bold">5 Unified Hubs</span>
        </div>
      )}
    </aside>
  );
};
