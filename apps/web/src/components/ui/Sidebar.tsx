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
  Users,
  Waves,
  CloudRain,
  AlertTriangle
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  shortcut?: string;
  badge?: string;
  badgeColor?: 'red' | 'blue' | 'green' | 'amber' | 'purple';
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
      title: 'PUBLIC INFORMATION INTERFACE',
      phaseDesc: 'Citizen Portal & Community Advisory',
      phaseColor: 'text-amber-400',
      items: [
        { id: 'public-portal', label: 'Public Information Portal', href: '/portal', icon: Globe, badge: 'GOV-PORTAL', badgeColor: 'amber' },
        { id: 'data-flow', label: 'How Data is Given', href: '/data-flow', icon: Database, badge: 'ARCHITECTURE', badgeColor: 'blue' },
      ],
    },
    {
      title: 'DURING • RESPONSE & RESCUE',
      phaseDesc: 'Disaster In-Progress Operations',
      phaseColor: 'text-rose-400',
      items: [
        { id: 'overview', label: 'Command Center', href: '/', icon: ShieldAlert, shortcut: 'M', badge: 'LIVE', badgeColor: 'red' },
        { id: 'dashboard-alerts', label: 'Live Dashboard & Alerts', href: '/dashboard', icon: AlertTriangle, badge: '4. LIVE', badgeColor: 'red' },
        { id: 'role-workspace', label: 'Role Workspaces', href: '/role-workspace', icon: Users, badge: '10 ROLES', badgeColor: 'blue' },
        { id: 'safety', label: 'My Safety & Guidance', href: '/safety', icon: Compass, shortcut: 'S', badge: 'EVAC', badgeColor: 'green' },
        { id: 'incidents', label: 'Incident Command', href: '/incidents', icon: FileText },
      ],
    },
    {
      title: 'BEFORE • PLANNING & MITIGATION',
      phaseDesc: 'Pre-Disaster Risk Reduction',
      phaseColor: 'text-sky-400',
      items: [
        { id: 'map', label: 'Hyper-Local GIS', href: '/map', icon: Map, badge: 'GIS' },
        { id: 'weather', label: 'Weather Intelligence', href: '/weather', icon: CloudRain },
        { id: 'river-basins', label: 'National River Map', href: '/river-basins', icon: Waves },
        { id: 'cascade', label: 'Upstream Cascade', href: '/cascade', icon: Layers },
        { id: 'village', label: 'Village Dossier', href: '/village/demo-village-003', icon: Map },
        { id: 'simulation', label: 'Scenario Simulator', href: '/simulation', icon: PlayCircle },
        { id: 'sensors', label: 'IoT & Telemetry', href: '/sensors', icon: Activity },
        { id: 'upload', label: 'Data Ingestion', href: '/upload', icon: UploadCloud },
      ],
    },
    {
      title: 'AFTER • AUDIT, MEMORY & LEARNING',
      phaseDesc: 'Post-Disaster Forensic Review',
      phaseColor: 'text-purple-400',
      items: [
        { id: 'flight-recorder', label: 'Flight Recorder', href: '/flight-recorder', icon: Radio },
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
      title: 'INDIA-WIDE • NATIONAL INTELLIGENCE',
      phaseDesc: 'Provider Registry, Pipeline & Analytics',
      phaseColor: 'text-emerald-400',
      items: [
        { id: 'data-sources', label: 'Data Sources', href: '/data-sources', icon: Server },
        { id: 'ingestion', label: 'Ingestion Jobs', href: '/ingestion', icon: RefreshCw },
        { id: 'model-monitoring', label: 'NDRF ML Studio', href: '/model-monitoring', icon: Brain },
        { id: 'recovery', label: 'Recovery', href: '/recovery', icon: Zap },
        { id: 'cross-border', label: 'Cross-Border Basins', href: '/cross-border', icon: Globe },
      ],
    },
  ];

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
      {/* ── Fixed Brand Header at Top (Never scrolls away, circle logo perfectly centered and visible) ── */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#162332]">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 min-w-0">
            {/* The Logo Circle Badge with clean padding and no clipping */}
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
                Safer Communities
              </div>
            </div>
          </div>
        ) : (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center mx-auto shadow-md ring-2 ring-blue-400/30 shrink-0"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
            title="FloodGuard AI • Safer Communities"
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

      {/* ── Scrollable Navigation Items Container ── */}
      <div className="p-3 space-y-4 overflow-y-auto flex-1 custom-sidebar-scroll">


        {/* 5-Phase Categorized Navigation Sections (ALL OPTIONS PRESERVED) */}
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <div className="px-2 pt-1.5">
                <div className={`text-[10px] font-mono font-bold tracking-wider ${section.phaseColor || 'text-slate-400'}`}>
                  {section.title}
                </div>
                {section.phaseDesc && (
                  <div className="text-[9px] font-mono" style={{ color: '#6A889C' }}>
                    {section.phaseDesc}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-0.5 mt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                let badgeStyle = { background: 'rgba(255,255,255,0.1)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.15)' };
                if (item.badgeColor === 'red') {
                  badgeStyle = { background: '#EF4444', color: '#FFFFFF', border: '1px solid #DC2626' };
                } else if (item.badgeColor === 'blue') {
                  badgeStyle = { background: '#2563EB', color: '#FFFFFF', border: '1px solid #1D4ED8' };
                } else if (item.badgeColor === 'green') {
                  badgeStyle = { background: '#16A34A', color: '#FFFFFF', border: '1px solid #15803D' };
                } else if (item.badgeColor === 'amber') {
                  badgeStyle = { background: '#D97706', color: '#FFFFFF', border: '1px solid #B45309' };
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition group"
                    style={{
                      background: isActive ? '#2563EB' : 'transparent',
                      color: isActive ? '#FFFFFF' : '#CBD5E1',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.color = '#FFFFFF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#CBD5E1';
                      }
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className="w-4 h-4 shrink-0 transition"
                        style={{ color: isActive ? '#FFFFFF' : '#88A4B8' }}
                      />
                      {!collapsed && <span className="truncate text-xs">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0"
                        style={badgeStyle}
                      >
                        {item.badge}
                      </span>
                    )}

                    {!collapsed && item.shortcut && !item.badge && (
                      <span
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 opacity-70"
                        style={{ background: 'rgba(255,255,255,0.1)', color: '#CBD5E1' }}
                      >
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

      {/* Footer Badge matching reference SIH theme */}
      {!collapsed && (
        <div
          className="p-3 border-t text-[10px] font-mono flex items-center justify-between"
          style={{
            borderColor: 'rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.2)',
            color: '#88A4B8',
          }}
        >
          <span className="font-bold text-blue-400">SIH26192 • THEME 4</span>
          <span className="text-emerald-400 font-bold">100% AUDITED</span>
        </div>
      )}
    </aside>
  );
};
