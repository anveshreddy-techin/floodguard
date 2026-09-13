'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert, Map, Activity, Bell, Compass, FileText,
  Settings, Home, Users, LucideIcon, Waves, CloudRain
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeColor?: 'red' | 'orange' | 'blue';
}

interface SidebarProps {
  activeTab?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',           label: 'Overview',               href: '/',               icon: Home },
  { id: 'map',                label: 'Risk Map',                href: '/map',            icon: Map },
  { id: 'safety',             label: 'Villages & Locations',    href: '/safety',         icon: Compass },
  { id: 'sensors',            label: 'Sensors',                 href: '/sensors',        icon: Activity },
  { id: 'dashboard-alerts',   label: 'Alerts',                  href: '/dashboard',      icon: Bell,   badge: 4,  badgeColor: 'red' },
  { id: 'role-workspace',     label: 'Role Workspaces',         href: '/role-workspace', icon: Users,  badge: '10 ROLES', badgeColor: 'blue' },
  { id: 'river-basins',       label: 'River Basins',            href: '/river-basins',   icon: Waves },
  { id: 'weather',            label: 'Weather',                 href: '/weather',        icon: CloudRain },
  { id: 'incidents',          label: 'Reports',                 href: '/incidents',      icon: FileText },
  { id: 'system',             label: 'Settings',                href: '/system',         icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = '' }) => {
  return (
    <aside
      className="hidden md:flex flex-col"
      style={{
        width: '220px',
        minWidth: '220px',
        background: '#1B2A3B',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
      }}
    >
      {/* Logo */}
      <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', boxShadow: '0 2px 8px rgba(37,99,235,0.4)' }}
          >
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">FloodGuard AI</div>
            <div className="text-[10px] leading-tight" style={{ color: '#64899E' }}>Safer Communities</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group"
              style={{
                background: isActive ? '#2563EB' : 'transparent',
                color: isActive ? '#FFFFFF' : '#94A3B8',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.color = '#E2E8F0';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94A3B8';
                }
              }}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  style={
                    item.badgeColor === 'red'
                      ? { background: '#EF4444', color: '#fff' }
                      : item.badgeColor === 'orange'
                      ? { background: '#F97316', color: '#fff' }
                      : { background: 'rgba(37,99,235,0.3)', color: '#93C5FD' }
                  }
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-3.5 h-3.5" style={{ color: '#2563EB' }} />
          <span className="text-xs font-bold" style={{ color: '#64899E' }}>SIH 2026</span>
        </div>
        <div className="text-[10px] leading-tight" style={{ color: '#4A6A7E' }}>
          Smart India Hackathon<br />Problem Statement: SIH26192
        </div>
        <div className="mt-2 text-[9px] font-semibold" style={{ color: '#2563EB' }}>
          Early Warning • Better Decisions • Safer Communities
        </div>
      </div>
    </aside>
  );
};
