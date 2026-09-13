'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, AlertTriangle, Users, FileText, Compass,
  Map, Waves, Layers, PlayCircle, MapPin,
  CloudRain, Activity, UploadCloud, Server, RefreshCw,
  History, Database, BarChart3, Radio,
  Brain, Globe, Zap, ShieldCheck
} from 'lucide-react';

export type AppHubKey = 'OPERATIONS' | 'GEOSPATIAL' | 'METEOROLOGY' | 'FORENSICS' | 'GOVERNANCE';

export interface HubAppItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
  badgeColor?: 'red' | 'blue' | 'green' | 'amber' | 'purple';
}

export interface AppHub {
  key: AppHubKey;
  label: string;
  desc: string;
  color: string;
  badge: string;
  primaryHref: string;
  apps: HubAppItem[];
}

export const APP_HUBS: Record<AppHubKey, AppHub> = {
  OPERATIONS: {
    key: 'OPERATIONS',
    label: 'Operations & Emergency Response',
    desc: 'Live Command, Field Operations, Role Workspaces & Evacuation',
    color: 'text-red-600',
    badge: 'Response Hub',
    primaryHref: '/',
    apps: [
      { id: 'overview', label: 'Command Center', href: '/', icon: ShieldAlert, tag: 'Live Ops', badgeColor: 'red' },
      { id: 'dashboard-alerts', label: 'Live Dashboard', href: '/dashboard', icon: AlertTriangle, tag: 'Alerts', badgeColor: 'red' },
      { id: 'role-workspace', label: 'Role Workspaces', href: '/role-workspace', icon: Users, tag: '10 Roles', badgeColor: 'blue' },
      { id: 'incidents', label: 'Incident Command', href: '/incidents', icon: FileText, tag: 'SOP' },
      { id: 'safety', label: 'My Safety & Guidance', href: '/safety', icon: Compass, tag: 'Rescue HUD', badgeColor: 'green' },
    ],
  },
  GEOSPATIAL: {
    key: 'GEOSPATIAL',
    label: 'Geospatial & Hydrology Lab',
    desc: 'Hyper-Local GIS, River Basins, Cascade Physics & Scenario Simulations',
    color: 'text-blue-600',
    badge: 'GIS Lab',
    primaryHref: '/map',
    apps: [
      { id: 'map', label: 'Hyper-Local GIS', href: '/map', icon: Map, tag: 'Satellite', badgeColor: 'blue' },
      { id: 'river-basins', label: 'National River Basins', href: '/river-basins', icon: Waves, tag: 'Surge Map' },
      { id: 'cascade', label: 'Upstream Cascade', href: '/cascade', icon: Layers, tag: 'Physics' },
      { id: 'simulation', label: 'Scenario Simulator', href: '/simulation', icon: PlayCircle, tag: 'What-If' },
      { id: 'village', label: 'Village Dossier', href: '/village/loc-uk-chamoli', icon: MapPin, tag: 'Ground' },
    ],
  },
  METEOROLOGY: {
    key: 'METEOROLOGY',
    label: 'Meteorology & Ingestion Pipeline',
    desc: 'Live Weather, Sensor Telemetry, CSV Pipelines & Provider Registry',
    color: 'text-emerald-600',
    badge: 'Telemetry Hub',
    primaryHref: '/weather',
    apps: [
      { id: 'weather', label: 'Weather Intelligence', href: '/weather', icon: CloudRain, tag: 'Radar/NWP', badgeColor: 'blue' },
      { id: 'sensors', label: 'IoT & Telemetry', href: '/sensors', icon: Activity, tag: 'LoRaWAN' },
      { id: 'upload', label: 'Data Ingestion Portal', href: '/upload', icon: UploadCloud, tag: 'Intake' },
      { id: 'data-sources', label: 'Data Providers Registry', href: '/data-sources', icon: Server, tag: 'IMD/CWC' },
      { id: 'ingestion', label: 'Ingestion Jobs Queue', href: '/ingestion', icon: RefreshCw, tag: 'Pipeline' },
    ],
  },
  FORENSICS: {
    key: 'FORENSICS',
    label: 'Forensics, Hindcast & Memory',
    desc: 'Historical Replay, Prediction Ledger, Event Archive & Audit Provenance',
    color: 'text-purple-600',
    badge: 'Forensics Hub',
    primaryHref: '/hindcast',
    apps: [
      { id: 'hindcast', label: 'Historical Hindcast', href: '/hindcast', icon: History, tag: '2000-2026', badgeColor: 'purple' },
      { id: 'replay', label: 'Historical Replay', href: '/replay', icon: History, tag: 'Replay' },
      { id: 'events', label: 'Event Memory Archive', href: '/events', icon: History, tag: 'Archive' },
      { id: 'ledger', label: 'Prediction Ledger', href: '/ledger', icon: Database, tag: 'SHA-256' },
      { id: 'benchmark', label: 'Holdout Benchmark', href: '/benchmark', icon: BarChart3, tag: 'Metrics' },
      { id: 'flight-recorder', label: 'Flight Recorder & Audit', href: '/flight-recorder', icon: Radio, tag: 'Blackbox' },
    ],
  },
  GOVERNANCE: {
    key: 'GOVERNANCE',
    label: 'National Governance & Public Portal',
    desc: 'ML Model Monitoring, Cross-Border Basins, Recovery & Public Interface',
    color: 'text-amber-600',
    badge: 'Governance Hub',
    primaryHref: '/model-monitoring',
    apps: [
      { id: 'model-monitoring', label: 'ML Model Studio', href: '/model-monitoring', icon: Brain, tag: 'AI Eval', badgeColor: 'blue' },
      { id: 'cross-border', label: 'Cross-Border Basins', href: '/cross-border', icon: Globe, tag: 'Nepal/India' },
      { id: 'recovery', label: 'Disaster Recovery', href: '/recovery', icon: Zap, tag: 'Post-Event' },
      { id: 'admin', label: 'Admin Governance', href: '/admin', icon: ShieldCheck, tag: 'RBAC' },
      { id: 'public-portal', label: 'Public Portal', href: '/portal', icon: Globe, tag: 'Citizens', badgeColor: 'amber' },
      { id: 'data-flow', label: 'Data Architecture Flow', href: '/data-flow', icon: Database, tag: 'Specs' },
    ],
  },
};

export const getHubForTab = (tabId: string): AppHub | undefined => {
  for (const hub of Object.values(APP_HUBS)) {
    if (hub.apps.some((a) => a.id === tabId || a.href === tabId || (tabId.startsWith('/village') && a.id === 'village'))) {
      return hub;
    }
  }
  return undefined;
};

interface RelatedAppsBarProps {
  activeAppId: string;
  hubKey?: AppHubKey;
  className?: string;
}

export const RelatedAppsBar: React.FC<RelatedAppsBarProps> = ({ activeAppId, hubKey, className = '' }) => {
  const hub = hubKey ? APP_HUBS[hubKey] : getHubForTab(activeAppId);
  if (!hub) return null;

  return (
    <div className={`bg-white border border-slate-200 shadow-xs rounded-2xl p-2 sm:p-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 select-none font-sans ${className}`}>
      {/* Left: Hub Title & Badge */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
          {hub.badge}
        </span>
        <span className="text-xs font-bold text-slate-800 hidden sm:inline">
          {hub.label}:
        </span>
      </div>

      {/* Right: Related Application Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {hub.apps.map((app) => {
          const Icon = app.icon;
          const isActive = activeAppId === app.id || (activeAppId.startsWith('/village') && app.id === 'village');

          return (
            <Link
              key={app.id}
              href={app.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all active:scale-95 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span className="whitespace-nowrap">{app.label}</span>
              {app.tag && (
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-700'
                }`}>
                  {app.tag}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
