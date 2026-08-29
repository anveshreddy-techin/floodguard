'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DataModeBadge } from './Badges';
import { DataMode } from '@/types';
import { CommandPalette } from './CommandPalette';
import { MobileNavDrawer } from './MobileNavDrawer';
import { useLocation, LOCATIONS } from '@/context/LocationContext';
import { Search, Globe, Menu, ShieldCheck } from 'lucide-react';

export const Header: React.FC<{
  dataMode?: DataMode;
  systemStatus?: string;
  onOpenCopilot?: () => void;
}> = ({ dataMode = 'DEMO', systemStatus = 'OPERATIONAL', onOpenCopilot }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { selectedLocation, selectLocationById } = useLocation();

  return (
    <>
      <header 
        className="h-14 border-b border-slate-800/60 bg-slate-950/85 backdrop-blur-xl px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none safe-top"
        style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
      >
        {/* Left: Hamburger Button (Mobile) + Brand Identity + Theme 4 Badge + Region */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden w-8 h-8 rounded-xl fp flex items-center justify-center text-cyan-400 active:scale-95 transition"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_rgba(6,182,212,1)] shrink-0" />
            <div className="text-sm sm:text-base font-black tracking-wider bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent group-hover:brightness-125 transition">
              FLOODGUARD <span className="text-slate-100 font-mono font-normal">AI</span>
            </div>
          </Link>

          {/* Official SIH Theme 4 Badge (Hidden on very small screens) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-950/80 border border-rose-700/80 text-[10px] font-mono text-rose-300 font-bold shadow-[0_0_10px_rgba(244,63,94,0.3)]">
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

        {/* Right: AI Copilot, APK, Mode Badge, Live System Pill, & Login Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* AI Copilot Button */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-copilot'));
              }
            }}
            className="px-2.5 sm:px-3 py-1 rounded-xl text-xs font-mono font-bold bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] active:scale-95 transition"
            title="Open Grounded AI Disaster Intelligence Assistant (Hotkey: A)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <span>AI COPILOT</span>
          </button>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-apk-modal'));
              }
            }}
            className="px-2.5 sm:px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/80 text-emerald-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] active:scale-95 transition"
            title="Download Android APK / Install PWA"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>APK</span>
          </button>

          <DataModeBadge mode={dataMode} />

          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 fp rounded-xl text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            <span className="font-mono text-[11px] text-slate-300 font-bold">SYS: {systemStatus}</span>
          </div>

          <Link
            href="/login"
            className="btn-primary px-2.5 sm:px-3 py-1 rounded-xl text-xs font-mono font-bold text-white transition shadow-md"
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

      {/* Global Mobile Drawer */}
      <MobileNavDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </>
  );
};
