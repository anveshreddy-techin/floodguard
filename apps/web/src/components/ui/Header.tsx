'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DataModeBadge } from './Badges';
import { DataMode } from '@/types';
import { CommandPalette } from './CommandPalette';
import { Search, Bot, ShieldAlert, Radio, Activity, Clock, Globe } from 'lucide-react';

export const Header: React.FC<{
  dataMode?: DataMode;
  systemStatus?: string;
  onOpenCopilot?: () => void;
}> = ({ dataMode = 'DEMO', systemStatus = 'OPERATIONAL', onOpenCopilot }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('UPPER_HIMALAYAN_BASIN');

  return (
    <>
      <header className="h-14 border-b border-[#223354] bg-[#070d1e] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
        {/* Left: Brand Identity & Region Selector */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            <div className="text-base font-black tracking-wider bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent group-hover:brightness-125 transition">
              FLOODGUARD <span className="text-slate-100 font-mono font-normal">AI</span>
            </div>
          </Link>

          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            SIH26192
          </span>

          {/* Region Dropdown */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#0e1630] border border-[#223354] px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="UPPER_HIMALAYAN_BASIN" className="bg-[#0e1630]">Upper Himalayan Catchment (Sunderbans Basin)</option>
              <option value="GARHWAL_MANDAKINI" className="bg-[#0e1630]">Garhwal Mandakini / Alaknanda Corridor</option>
              <option value="RISHIGANGA_CHAMOLI" className="bg-[#0e1630]">Rishiganga - Dhauliganga (Chamoli)</option>
              <option value="BHOTE_KOSHI_RASUWA" className="bg-[#0e1630]">Bhote Koshi / Trishuli (Nepal)</option>
            </select>
          </div>
        </div>

        {/* Center: Command Palette Trigger Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden lg:flex items-center gap-2 bg-[#0e1630] border border-[#223354] hover:border-cyan-400/50 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition font-mono shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick command or view...</span>
          <span className="bg-slate-900 border border-slate-700 px-1.5 py-0.2 rounded text-[10px] text-slate-400">
            Ctrl+K
          </span>
        </button>

        {/* Right: Mode Badge & Live System Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          <DataModeBadge mode={dataMode} />

          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-slate-300">SYS: {systemStatus}</span>
          </div>

          <Link
            href="/login"
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-cyan-300 transition"
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
