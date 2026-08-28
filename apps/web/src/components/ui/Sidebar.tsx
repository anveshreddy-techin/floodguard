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
} from 'lucide-react';

export const Sidebar: React.FC<{ activeTab?: string }> = ({ activeTab = 'overview' }) => {
  const navItems = [
    { id: 'overview', label: 'Command Center', href: '/', icon: ShieldAlert },
    { id: 'map', label: 'Hyper-Local GIS', href: '/map', icon: Map },
    { id: 'cascade', label: 'Upstream Cascade', href: '/cascade', icon: Layers },
    { id: 'upload', label: 'Data Ingestion & Quarantine', href: '/upload', icon: UploadCloud },
    { id: 'simulation', label: 'Scenario Simulator', href: '/simulation', icon: PlayCircle },
    { id: 'incidents', label: 'Incident Command Post', href: '/incidents', icon: FileText },
  ];

  return (
    <aside className="w-64 border-r border-[#3a506b] bg-[#0e1630] flex flex-col justify-between p-4 hidden lg:flex shrink-0">
      <div className="space-y-1">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          OPERATIONAL SUITE
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 text-cyan-400" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-slate-800 pt-4 space-y-2">
        <div className="text-[11px] text-slate-400 px-3">
          <div className="font-semibold text-slate-300">Target Region</div>
          <div>Upper Catchment Hilly Basin</div>
        </div>
        <div className="bg-slate-900/80 rounded p-2 text-[11px] text-slate-400 border border-slate-800 font-mono">
          <div className="text-amber-400 font-semibold">TRUTHFULNESS LOCK</div>
          <div>All synthetic demo & simulation streams labeled. Zero fake claims.</div>
        </div>
      </div>
    </aside>
  );
};
