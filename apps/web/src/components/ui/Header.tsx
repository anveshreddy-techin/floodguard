'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DataModeBadge } from './Badges';
import { DataMode } from '@/types';
import { CommandPalette } from './CommandPalette';
import { useLocation, LOCATIONS } from '@/context/LocationContext';
import { Search, Bot, ShieldAlert, Radio, Activity, Clock, Globe, Sparkles, ShieldCheck } from 'lucide-react';

export const Header: React.FC<{
  dataMode?: DataMode;
  systemStatus?: string;
  onOpenCopilot?: () => void;
}> = ({ dataMode = 'DEMO', systemStatus = 'OPERATIONAL', onOpenCopilot }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { selectedLocation, selectLocationById } = useLocation();

  return (
    <>
      <header className="h-14 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none" style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
        {/* Left: Brand Identity, Theme 4 Badge & Region Selector */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_rgba(6,182,212,1)]" />
            <div className="text-base font-black tracking-wider bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent group-hover:brightness-125 transition">
              FLOODGUARD <span className="text-slate-100 font-mono font-normal">AI</span>
            </div>
          </Link>

          {/* Official SIH Theme 4 Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-950/80 border border-rose-700/80 text-[10px] font-mono text-rose-300 font-bold shadow-[0_0_10px_rgba(244,63,94,0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span>THEME 4: DISASTER MANAGEMENT</span>
          </div>

          {/* Region Dropdown Synced Globally */}
          <div className="hidden md:flex items-center gap-1.5 fp px-3 py-1 rounded-xl text-xs font-mono text-slate-200">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedLocation.id}
              onChange={(e) => selectLocationById(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-bold"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-slate-900 text-slate-200">
                  {loc.name} ({loc.region})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Command Palette Trigger Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden lg:flex items-center gap-2.5 fp hover:border-cyan-400/60 px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition font-mono shadow-inner group"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition" />
          <span>Search disaster views & tools...</span>
          <span className="bg-slate-900/80 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] text-cyan-300 font-bold">
            Ctrl+K
          </span>
        </button>

        {/* Right: Mode Badge & Live System Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          <DataModeBadge mode={dataMode} />

          <div className="flex items-center gap-2 px-2.5 py-1 fp rounded-xl text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            <span className="font-mono text-[11px] text-slate-300 font-bold">SYS: {systemStatus}</span>
          </div>

          <Link
            href="/login"
            className="btn-primary px-3 py-1 rounded-xl text-xs font-mono font-bold text-white transition shadow-md"
          >
            LOGIN
          </Link>
        </div>
      </header>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
};
