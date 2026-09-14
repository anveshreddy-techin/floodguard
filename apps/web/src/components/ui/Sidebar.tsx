'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, Map, Layers, History, Activity, Database, 
  UploadCloud, Compass, BarChart3, ChevronLeft, ChevronRight, ChevronDown,
  ShieldCheck, Globe, Brain, Users, Waves, CloudRain, AlertTriangle, LucideIcon
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
    accentColor: '#EF4444',
    defaultHref: '/',
    relatedApps: [
      { id: 'overview', label: 'Command Center', href: '/', icon: ShieldAlert, tag: 'Live Ops', badgeColor: 'red' },
      { id: 'dashboard-alerts', label: 'Live Dashboard & Alerts', href: '/dashboard', icon: AlertTriangle, tag: 'Alerts', badgeColor: 'red' },
      { id: 'role-workspace', label: 'Role Workspaces & SOPs', href: '/role-workspace', icon: Users, tag: 'Roles & SOP', badgeColor: 'blue' },
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
    accentColor: '#3B82F6',
    defaultHref: '/map',
    relatedApps: [
      { id: 'map', label: 'Hyper-Local GIS Map', href: '/map', icon: Map, tag: 'Satellite', badgeColor: 'blue' },
      { id: 'river-basins', label: 'National River Basins', href: '/river-basins', icon: Waves, tag: 'Surge Map', badgeColor: 'blue' },
      { id: 'cascade', label: 'Cascade Physics & Simulation', href: '/cascade', icon: Layers, tag: 'Physics & Lab', badgeColor: 'purple' },
      { id: 'village', label: 'Village Dossier Inspector', href: '/village/loc-uk-chamoli', icon: Map, tag: 'Ground', badgeColor: 'green' },
    ],
  },
  {
    id: 'hub-met',
    title: 'Meteorology & Ingestion Pipeline',
    shortTitle: 'Meteorology',
    desc: 'Weather, IoT Sensors & Data Ingestion',
    icon: CloudRain,
    badge: 'Telemetry',
    accentColor: '#10B981',
    defaultHref: '/weather',
    relatedApps: [
      { id: 'weather', label: 'Weather & Radar Intelligence', href: '/weather', icon: CloudRain, tag: 'Radar/NWP', badgeColor: 'blue' },
      { id: 'sensors', label: 'IoT & Telemetry Network', href: '/sensors', icon: Activity, tag: 'LoRaWAN', badgeColor: 'green' },
      { id: 'upload', label: 'Data Ingestion & Providers', href: '/upload', icon: UploadCloud, tag: 'Intake & CWC', badgeColor: 'amber' },
    ],
  },
  {
    id: 'hub-forensics',
    title: 'Forensics, Hindcast & Audit',
    shortTitle: 'Forensics',
    desc: 'Historical Replay, Benchmarking & Audit',
    icon: History,
    badge: 'Forensics',
    accentColor: '#8B5CF6',
    defaultHref: '/hindcast',
    relatedApps: [
      { id: 'hindcast', label: 'Historical Hindcast & Replay', href: '/hindcast', icon: History, tag: '2000-2026', badgeColor: 'purple' },
      { id: 'ledger', label: 'Prediction Ledger & Flight Recorder', href: '/ledger', icon: Database, tag: 'Ledger & Audit', badgeColor: 'blue' },
      { id: 'benchmark', label: 'Benchmark & Accuracy Metrics', href: '/benchmark', icon: BarChart3, tag: 'Holdout', badgeColor: 'amber' },
    ],
  },
  {
    id: 'hub-gov',
    title: 'Governance & Public Administration',
    shortTitle: 'Governance',
    desc: 'NDRF ML Models, Admin RBAC & Citizen Services',
    icon: Brain,
    badge: 'Gov & ML',
    accentColor: '#F59E0B',
    defaultHref: '/model-monitoring',
    relatedApps: [
      { id: 'model-monitoring', label: 'NDRF ML Model Studio', href: '/model-monitoring', icon: Brain, tag: 'AI Eval', badgeColor: 'blue' },
      { id: 'admin', label: 'Admin Governance & Cross-Border', href: '/admin', icon: ShieldCheck, tag: 'Admin & Basins', badgeColor: 'purple' },
      { id: 'public-portal', label: 'Public Citizen Portal & Recovery', href: '/portal', icon: Globe, tag: 'Public & Rehab', badgeColor: 'amber' },
    ],
  },
];

const HUB_CARD_STYLES: Record<string, {
  cardBorderActive: string;
  cardBorderDefault: string;
  cardBgActive: string;
  cardBgDefault: string;
  iconBg: string;
  hubTitleActive: string;
  badgeActive: string;
  badgeDefault: string;
  activeItemGradient: string;
}> = {
  'hub-ops': {
    cardBorderActive: 'border-red-300 ring-1 ring-red-200 shadow-sm',
    cardBorderDefault: 'border-red-100 hover:border-red-200',
    cardBgActive: 'bg-gradient-to-br from-red-50/90 to-rose-50/40',
    cardBgDefault: 'bg-white hover:bg-red-50/30',
    iconBg: 'bg-red-600 text-white shadow-xs',
    hubTitleActive: 'text-red-950',
    badgeActive: 'bg-red-100 text-red-800 border-red-200',
    badgeDefault: 'bg-red-50 text-red-700 border-red-100',
    activeItemGradient: 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm',
  },
  'hub-gis': {
    cardBorderActive: 'border-blue-300 ring-1 ring-blue-200 shadow-sm',
    cardBorderDefault: 'border-blue-100 hover:border-blue-200',
    cardBgActive: 'bg-gradient-to-br from-blue-50/90 to-sky-50/40',
    cardBgDefault: 'bg-white hover:bg-blue-50/30',
    iconBg: 'bg-blue-600 text-white shadow-xs',
    hubTitleActive: 'text-blue-950',
    badgeActive: 'bg-blue-100 text-blue-800 border-blue-200',
    badgeDefault: 'bg-blue-50 text-blue-700 border-blue-100',
    activeItemGradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm',
  },
  'hub-met': {
    cardBorderActive: 'border-emerald-300 ring-1 ring-emerald-200 shadow-sm',
    cardBorderDefault: 'border-emerald-100 hover:border-emerald-200',
    cardBgActive: 'bg-gradient-to-br from-emerald-50/90 to-teal-50/40',
    cardBgDefault: 'bg-white hover:bg-emerald-50/30',
    iconBg: 'bg-emerald-600 text-white shadow-xs',
    hubTitleActive: 'text-emerald-950',
    badgeActive: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    badgeDefault: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    activeItemGradient: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm',
  },
  'hub-forensics': {
    cardBorderActive: 'border-purple-300 ring-1 ring-purple-200 shadow-sm',
    cardBorderDefault: 'border-purple-100 hover:border-purple-200',
    cardBgActive: 'bg-gradient-to-br from-purple-50/90 to-violet-50/40',
    cardBgDefault: 'bg-white hover:bg-purple-50/30',
    iconBg: 'bg-purple-600 text-white shadow-xs',
    hubTitleActive: 'text-purple-950',
    badgeActive: 'bg-purple-100 text-purple-800 border-purple-200',
    badgeDefault: 'bg-purple-50 text-purple-700 border-purple-100',
    activeItemGradient: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm',
  },
  'hub-gov': {
    cardBorderActive: 'border-amber-300 ring-1 ring-amber-200 shadow-sm',
    cardBorderDefault: 'border-amber-100 hover:border-amber-200',
    cardBgActive: 'bg-gradient-to-br from-amber-50/90 to-orange-50/40',
    cardBgDefault: 'bg-white hover:bg-amber-50/30',
    iconBg: 'bg-amber-600 text-white shadow-xs',
    hubTitleActive: 'text-amber-950',
    badgeActive: 'bg-amber-100 text-amber-800 border-amber-200',
    badgeDefault: 'bg-amber-50 text-amber-700 border-amber-100',
    activeItemGradient: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm',
  },
};

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
      className={`hidden md:flex flex-col justify-between transition-all duration-300 select-none z-30 shrink-0 bg-[#F8FAFC] border-r border-slate-200 shadow-[1px_0_6px_rgba(0,0,0,0.03)] h-full ${
        collapsed ? 'w-16' : 'w-64 xl:w-72'
      }`}
    >
      {/* ── Top Bar with Section Title & Collapse Toggle ── */}
      <div className="px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white shadow-2xs">
        {!collapsed && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-[11px] font-mono font-black tracking-wider text-slate-700 uppercase">
              DISASTER HUBS
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition active:scale-95 ml-auto border border-slate-200/80"
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
          const style = HUB_CARD_STYLES[hub.id] || HUB_CARD_STYLES['hub-ops'];

          return (
            <div 
              key={hub.id}
              className={`rounded-2xl transition-all border ${
                hasActiveChild 
                  ? `${style.cardBgActive} ${style.cardBorderActive}` 
                  : `${style.cardBgDefault} ${style.cardBorderDefault}`
              }`}
            >
              {/* Hub Option Header */}
              {!collapsed ? (
                <div className="p-2 flex items-center justify-between gap-1.5">
                  <Link
                    href={hub.defaultHref}
                    className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-95 group"
                    title={hub.desc}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${style.iconBg}`}>
                      <HubIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-xs font-black tracking-normal truncate transition ${
                        hasActiveChild ? style.hubTitleActive : 'text-slate-900 group-hover:text-blue-600'
                      }`}>
                        {hub.shortTitle}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                          hasActiveChild ? style.badgeActive : style.badgeDefault
                        }`}>
                          {hub.badge}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Expand/Collapse Toggle */}
                  <button
                    onClick={() => toggleHub(hub.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
                    title={isHubExpanded ? 'Collapse related applications' : 'Expand related applications'}
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isHubExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ) : (
                /* Collapsed Icon-Only Option */
                <Link
                  href={hub.defaultHref}
                  className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all my-1.5 shadow-xs"
                  style={{
                    background: hasActiveChild ? hub.accentColor : '#FFFFFF',
                    color: hasActiveChild ? '#FFFFFF' : '#475569',
                    border: hasActiveChild ? 'none' : '1px solid #E2E8F0',
                  }}
                  title={`${hub.title} (${hub.relatedApps.length} related apps)`}
                >
                  <HubIcon className="w-4 h-4" />
                </Link>
              )}

              {/* Related Sub-Applications */}
              {!collapsed && isHubExpanded && (
                <div className="px-2 pb-2 pt-0.5 space-y-1 border-t border-slate-200/60 font-sans">
                  {hub.relatedApps.map((subApp) => {
                    const SubIcon = subApp.icon;
                    const isActive = activeTab === subApp.id || (activeTab.startsWith('village') && subApp.id === 'village');

                    let badgeColorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
                    if (subApp.badgeColor === 'red') badgeColorClasses = 'bg-red-100 text-red-800 border-red-200';
                    else if (subApp.badgeColor === 'blue') badgeColorClasses = 'bg-blue-100 text-blue-800 border-blue-200';
                    else if (subApp.badgeColor === 'green') badgeColorClasses = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                    else if (subApp.badgeColor === 'amber') badgeColorClasses = 'bg-amber-100 text-amber-800 border-amber-200';
                    else if (subApp.badgeColor === 'purple') badgeColorClasses = 'bg-purple-100 text-purple-800 border-purple-200';

                    return (
                      <Link
                        key={subApp.id}
                        href={subApp.href}
                        className={`flex items-center justify-between pl-2.5 pr-2 py-1.5 rounded-xl text-xs transition group relative ${
                          isActive 
                            ? style.activeItemGradient 
                            : 'text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-2xs border border-transparent hover:border-slate-200 font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
                          <span className="truncate text-xs">{subApp.label}</span>
                        </div>

                        {subApp.tag && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 border ${
                            isActive ? 'bg-white/20 text-white border-white/30' : badgeColorClasses
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
        <div className="p-3 border-t border-slate-200 bg-white text-xs font-sans flex items-center justify-between shadow-2xs shrink-0">
          <span className="font-bold text-blue-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            SIH26192 • Theme 4
          </span>
          <span className="text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
            5 Unified Hubs
          </span>
        </div>
      )}
    </aside>
  );
};
