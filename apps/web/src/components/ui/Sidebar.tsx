'use client';

import React, { useState, useEffect } from 'react';
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
    desc: 'Live Command, Alerts, 10 Roles & Evacuation',
    icon: ShieldAlert,
    badge: 'Response',
    accentColor: '#EF4444',
    defaultHref: '/',
    relatedApps: [
      { id: 'overview', label: 'Command Center', href: '/', icon: ShieldAlert, tag: 'Live Ops', badgeColor: 'red' },
      { id: 'dashboard-alerts', label: 'Live Dashboard & Alerts', href: '/dashboard', icon: AlertTriangle, tag: 'Alerts', badgeColor: 'red' },
      { id: 'role-workspace', label: '10 Role Workspaces', href: '/role-workspace', icon: Users, tag: 'Command', badgeColor: 'blue' },
      { id: 'incidents', label: 'Incident Command & SOP', href: '/incidents', icon: FileText, tag: 'SOP' },
      { id: 'safety', label: 'My Safety & Evacuation HUD', href: '/safety', icon: Compass, tag: 'Rescue', badgeColor: 'green' },
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
      { id: 'river-basins', label: 'National River Basins', href: '/river-basins', icon: Waves, tag: 'Surge Map' },
      { id: 'cascade', label: 'Upstream Cascade Physics', href: '/cascade', icon: Layers, tag: 'Physics' },
      { id: 'simulation', label: 'Scenario Simulator', href: '/simulation', icon: PlayCircle, tag: 'What-If' },
      { id: 'village', label: 'Village Dossier Inspector', href: '/village/loc-uk-chamoli', icon: MapPin, tag: 'Ground' },
    ],
  },
  {
    id: 'hub-met',
    title: 'Meteorology & Ingestion Pipeline',
    shortTitle: 'Meteorology',
    desc: 'Weather, IoT Sensors, Ingestion & Providers',
    icon: CloudRain,
    badge: 'Telemetry',
    accentColor: '#10B981',
    defaultHref: '/weather',
    relatedApps: [
      { id: 'weather', label: 'Weather Intelligence', href: '/weather', icon: CloudRain, tag: 'Radar/NWP', badgeColor: 'blue' },
      { id: 'sensors', label: 'IoT & Telemetry Network', href: '/sensors', icon: Activity, tag: 'LoRaWAN' },
      { id: 'upload', label: 'Data Ingestion Workbench', href: '/upload', icon: UploadCloud, tag: 'Intake' },
      { id: 'data-sources', label: 'Data Providers Registry', href: '/data-sources', icon: Server, tag: 'IMD/CWC' },
      { id: 'ingestion', label: 'Ingestion Jobs Queue', href: '/ingestion', icon: RefreshCw, tag: 'Pipeline' },
    ],
  },
  {
    id: 'hub-forensics',
    title: 'Forensics, Hindcast & Audit',
    shortTitle: 'Forensics',
    desc: 'Historical Replay, Prediction Ledger & Audit',
    icon: History,
    badge: 'Forensics',
    accentColor: '#A855F7',
    defaultHref: '/hindcast',
    relatedApps: [
      { id: 'hindcast', label: 'Historical Hindcast Lab', href: '/hindcast', icon: History, tag: '2000-2026', badgeColor: 'purple' },
      { id: 'replay', label: 'Strict Replay Studio', href: '/replay', icon: History, tag: 'Replay' },
      { id: 'events', label: 'Event Memory Archive', href: '/events', icon: History, tag: 'Archive' },
      { id: 'ledger', label: 'Prediction Ledger', href: '/ledger', icon: Database, tag: 'SHA-256' },
      { id: 'benchmark', label: 'Holdout Benchmark Suite', href: '/benchmark', icon: BarChart3, tag: 'Metrics' },
      { id: 'flight-recorder', label: 'Blackbox Flight Recorder', href: '/flight-recorder', icon: Radio, tag: 'Blackbox' },
    ],
  },
  {
    id: 'hub-gov',
    title: 'Governance & Public Portal',
    shortTitle: 'Governance',
    desc: 'ML Model Studio, Cross-Border & Public Citizen Portal',
    icon: Brain,
    badge: 'Gov & ML',
    accentColor: '#F59E0B',
    defaultHref: '/model-monitoring',
    relatedApps: [
      { id: 'model-monitoring', label: 'NDRF ML Model Studio', href: '/model-monitoring', icon: Brain, tag: 'AI Eval', badgeColor: 'blue' },
      { id: 'cross-border', label: 'Cross-Border River Basins', href: '/cross-border', icon: Globe, tag: 'Nepal/India' },
      { id: 'recovery', label: 'Disaster Recovery & Rehab', href: '/recovery', icon: Zap, tag: 'Post-Event' },
      { id: 'admin', label: 'Admin Governance & RBAC', href: '/admin', icon: ShieldCheck, tag: 'RBAC' },
      { id: 'public-portal', label: 'Public Citizen Portal', href: '/portal', icon: Globe, tag: 'Citizens', badgeColor: 'amber' },
      { id: 'data-flow', label: 'Data Architecture Flow', href: '/data-flow', icon: Database, tag: 'Specs' },
    ],
  },
];

interface SidebarProps {
  activeTab?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = '' }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Determine which hub contains the activeTab so it's open by default
  const findHubForTab = (tab: string): string => {
    for (const hub of APP_HUB_OPTIONS) {
      if (hub.relatedApps.some((a) => a.id === tab || (tab.startsWith('village') && a.id === 'village'))) {
        return hub.id;
      }
    }
    return 'hub-ops';
  };

  // Keep track of which hubs are expanded (all open or active one open)
  const [expandedHubs, setExpandedHubs] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    APP_HUB_OPTIONS.forEach((h) => {
      initial[h.id] = true; // Open all by default so user can quickly glance
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
      className={`hidden md:flex flex-col justify-between transition-all duration-300 select-none z-[200] shrink-0 h-full max-h-full ${
        collapsed ? 'w-16' : 'w-64 xl:w-72'
      }`}
      style={{
        background: '#1B2A3B',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '2px 0 16px rgba(0,0,0,0.15)',
      }}
    >
      {/* ── Fixed Brand Header at Top (Never scrolls away) ── */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#162332]">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-md ring-2 ring-blue-400/30"
              style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
            >
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-black text-white tracking-tight leading-tight truncate">
                FloodGuard AI
              </div>
              <div className="text-[10px] font-medium leading-tight text-blue-200 mt-0.5 truncate">
                Disaster Management Platform
              </div>
            </div>
          </div>
        ) : (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center mx-auto shadow-md ring-2 ring-blue-400/30 shrink-0"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
            title="FloodGuard AI"
          >
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition active:scale-95 ml-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Scrollable Application Hubs Container ── */}
      <div className="p-2.5 space-y-3 overflow-y-auto flex-1 custom-sidebar-scroll">
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
                  ? 'bg-slate-900/50 border-blue-500/40' 
                  : 'bg-slate-900/20 border-white/5'
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
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                      style={{ background: `${hub.accentColor}25`, color: hub.accentColor }}
                    >
                      <HubIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white tracking-normal truncate group-hover:text-blue-300 transition">
                        {hub.shortTitle}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate font-medium">
                        {hub.badge}
                      </div>
                    </div>
                  </Link>

                  {/* Expand/Collapse Toggle for Related Apps */}
                  <button
                    onClick={() => toggleHub(hub.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition"
                    title={isHubExpanded ? 'Collapse related applications' : 'Expand related applications'}
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isHubExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ) : (
                /* Collapsed Icon-Only Option */
                <Link
                  href={hub.defaultHref}
                  className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all my-1.5"
                  style={{
                    background: hasActiveChild ? '#2563EB' : 'rgba(255,255,255,0.06)',
                    color: hasActiveChild ? '#FFFFFF' : '#CBD5E1',
                  }}
                  title={`${hub.title} (${hub.relatedApps.length} related apps)`}
                >
                  <HubIcon className="w-4 h-4" />
                </Link>
              )}

              {/* Related Sub-Applications (Nested in the same option) */}
              {!collapsed && isHubExpanded && (
                <div className="px-2 pb-2 pt-0.5 space-y-0.5 border-t border-white/5 font-sans">
                  {hub.relatedApps.map((subApp) => {
                    const SubIcon = subApp.icon;
                    const isActive = activeTab === subApp.id || (activeTab.startsWith('village') && subApp.id === 'village');

                    let badgeBg = 'bg-white/10 text-slate-300 border-white/15';
                    if (subApp.badgeColor === 'red') badgeBg = 'bg-red-500 text-white border-red-600';
                    else if (subApp.badgeColor === 'blue') badgeBg = 'bg-blue-600 text-white border-blue-700';
                    else if (subApp.badgeColor === 'green') badgeBg = 'bg-emerald-600 text-white border-emerald-700';
                    else if (subApp.badgeColor === 'amber') badgeBg = 'bg-amber-600 text-white border-amber-700';
                    else if (subApp.badgeColor === 'purple') badgeBg = 'bg-purple-600 text-white border-purple-700';

                    return (
                      <Link
                        key={subApp.id}
                        href={subApp.href}
                        className={`flex items-center justify-between pl-3 pr-2 py-1.5 rounded-lg text-xs transition group relative ${
                          isActive 
                            ? 'bg-blue-600 text-white font-semibold shadow-xs' 
                            : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium'
                        }`}
                      >
                        {/* Sub-tree connecting indicator */}
                        <div className="flex items-center gap-2 min-w-0">
                          <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-300'}`} />
                          <span className="truncate text-xs">{subApp.label}</span>
                        </div>

                        {subApp.tag && (
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0 border ${badgeBg}`}>
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
        <div
          className="p-3 border-t text-xs font-sans flex items-center justify-between bg-black/20"
          style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#88A4B8' }}
        >
          <span className="font-semibold text-blue-400">SIH26192 • Theme 4</span>
          <span className="text-emerald-400 font-semibold">5 Unified Hubs</span>
        </div>
      )}
    </aside>
  );
};
