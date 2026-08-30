'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DataModeBadge } from './Badges';
import { DataMode } from '@/types';
import { CommandPalette } from './CommandPalette';
import { MobileNavDrawer } from './MobileNavDrawer';
import { useLocation, LOCATIONS } from '@/context/LocationContext';
import { Search, Globe, Menu, Bot, Download, UserCheck, ShieldAlert } from 'lucide-react';

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
        className="h-14 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-2.5 sm:px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40 select-none safe-top shrink-0"
        style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
      >
        {/* Left: Hamburger Button (Mobile) + Brand Identity + Theme 4 Badge + Region */}
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden w-8 h-8 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-cyan-400 active:scale-95 transition shrink-0"
            aria-label="Open Navigation Menu"
            title="Open Navigation Menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_rgba(6,182,212,1)] shrink-0" />
            <div className="text-xs sm:text-sm font-black tracking-wider bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent group-hover:brightness-125 transition">
              FLOODGUARD <span className="text-slate-100 font-mono font-normal">AI</span>
            </div>
          </Link>

          {/* Official SIH Theme 4 Badge (Large Desktops Only) */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-950/80 border border-rose-700/80 text-[10px] font-mono text-rose-300 font-bold shadow-[0_0_10px_rgba(244,63,94,0.3)] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span>THEME 4: DISASTER MANAGEMENT</span>
          </div>

          {/* Pan-India Basin & Region Dropdown (Tablet & Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 fp px-2.5 py-1 rounded-xl text-xs font-mono text-slate-200 shrink-0">
            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <select
              value={selectedLocation.id}
              onChange={(e) => selectLocationById(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-bold max-w-[200px] lg:max-w-[240px] truncate"
            >
              <optgroup label="🏔️ NORTHERN HIMALAYA" className="bg-slate-900 text-cyan-300 font-bold">
                {LOCATIONS.filter(l => l.zone === 'HIMALAYAN_NORTH').map(loc => (
                  <option key={loc.id} value={loc.id} className="bg-slate-950 text-slate-200">
                    {loc.name} ({loc.state})
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌊 NORTH-EAST & BRAHMAPUTRA" className="bg-slate-900 text-cyan-300 font-bold">
                {LOCATIONS.filter(l => l.zone === 'NORTHEAST_BRAHMAPUTRA').map(loc => (
                  <option key={loc.id} value={loc.id} className="bg-slate-950 text-slate-200">
                    {loc.name} ({loc.state})
                  </option>
                ))}
              </optgroup>
              <optgroup label="⛰️ WESTERN GHATS & COASTAL" className="bg-slate-900 text-cyan-300 font-bold">
                {LOCATIONS.filter(l => l.zone === 'WESTERN_GHATS_COASTAL').map(loc => (
                  <option key={loc.id} value={loc.id} className="bg-slate-950 text-slate-200">
                    {loc.name} ({loc.state})
                  </option>
                ))}
              </optgroup>
              <optgroup label="🏙️ URBAN METROPOLITAN" className="bg-slate-900 text-cyan-300 font-bold">
                {LOCATIONS.filter(l => l.zone === 'URBAN_METRO').map(loc => (
                  <option key={loc.id} value={loc.id} className="bg-slate-950 text-slate-200">
                    {loc.name} ({loc.state})
                  </option>
                ))}
              </optgroup>
              <optgroup label="🏞️ PENINSULAR & CENTRAL BASINS" className="bg-slate-900 text-cyan-300 font-bold">
                {LOCATIONS.filter(l => l.zone === 'PENINSULAR_CENTRAL').map(loc => (
                  <option key={loc.id} value={loc.id} className="bg-slate-950 text-slate-200">
                    {loc.name} ({loc.state})
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌾 EASTERN GANGETIC & DELTA" className="bg-slate-900 text-cyan-300 font-bold">
                {LOCATIONS.filter(l => l.zone === 'EASTERN_DELTA').map(loc => (
                  <option key={loc.id} value={loc.id} className="bg-slate-950 text-slate-200">
                    {loc.name} ({loc.state})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Center: Command Palette Trigger Button (Large Desktops) */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden lg:flex items-center gap-2 fp hover:border-cyan-400/60 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition font-mono shadow-inner group mx-2"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition shrink-0" />
          <span className="truncate max-w-[180px] xl:max-w-none">Search views & tools...</span>
          <span className="bg-slate-900/80 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] text-cyan-300 font-bold shrink-0">
            Ctrl+K
          </span>
        </button>

        {/* Right: SOS Rescue, AI Copilot, APK, Mode Badge, Live System Pill, & Login Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Emergency SOS Rescue Calling Button */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-emergency-modal'));
              }
            }}
            className="px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-mono font-black bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1 shadow-[0_0_15px_rgba(225,29,72,0.6)] active:scale-95 transition shrink-0 animate-pulse"
            title="Open Emergency Rescue & Helpline Dispatch (Hotkey: E)"
          >
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">SOS RESCUE</span>
            <span className="xs:hidden">SOS</span>
          </button>

          {/* AI Copilot Button (Responsive) */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-copilot'));
              }
            }}
            className="px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-mono font-bold bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] active:scale-95 transition shrink-0"
            title="Open Grounded AI Disaster Intelligence Assistant (Hotkey: A)"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">AI COPILOT</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* APK Download Button */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-apk-modal'));
              }
            }}
            className="px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-mono font-bold bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-600/80 text-emerald-300 flex items-center gap-1 shadow-[0_0_12px_rgba(16,185,129,0.3)] active:scale-95 transition shrink-0"
            title="Download Android APK / Install PWA"
          >
            <Download className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="hidden xs:inline">APK</span>
          </button>

          {/* Data Mode Badge (Auto-compact on mobile) */}
          <DataModeBadge mode={dataMode} />

          {/* Live System Pill (Tablet/Desktop) */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 fp rounded-xl text-xs shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)] shrink-0" />
            <span className="font-mono text-[10px] text-slate-300 font-bold">SYS: {systemStatus}</span>
          </div>

          {/* Login Button (Tablet/Desktop) */}
          <Link
            href="/login"
            className="hidden sm:inline-flex btn-primary px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-white transition shadow-md shrink-0"
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
