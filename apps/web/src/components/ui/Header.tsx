'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CommandPalette } from './CommandPalette';
import { MobileNavDrawer } from './MobileNavDrawer';
import { MobileConfigDrawer } from './MobileConfigDrawer';
import { useLocation } from '@/context/LocationContext';
import { useAdaptive } from '@/context/AdaptiveContext';
import { LocationSelectorModal } from '@/components/ui/LocationSelectorModal';
import {
  ShieldAlert, MapPin, Bell, ChevronDown, Menu, Search,
  Clock, User, Bot, Sparkles
} from 'lucide-react';

export const Header: React.FC<{
  dataMode?: string;
  systemStatus?: string;
  onOpenCopilot?: () => void;
}> = ({ dataMode = 'DEMO', systemStatus = 'OPERATIONAL', onOpenCopilot }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileConfigOpen, setMobileConfigOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const { selectedLocation } = useLocation();
  const { role } = useAdaptive();

  React.useEffect(() => {
    const handleOpenLocation = () => setLocationModalOpen(true);
    window.addEventListener('open-location-selector', handleOpenLocation);
    return () => window.removeEventListener('open-location-selector', handleOpenLocation);
  }, []);

  const now = new Date();
  const lastUpdated = now.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  return (
    <>
      <header
        className="sticky top-0 z-40 select-none safe-top shrink-0"
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div className="h-14 px-4 lg:px-6 flex items-center justify-between gap-3">

          {/* LEFT: Hamburger (mobile) + Logo */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              onClick={() => setMobileDrawerOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo — desktop only (sidebar already has logo) */}
            <Link href="/" className="hidden md:flex items-center gap-2 shrink-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
              >
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">FloodGuard AI</span>
            </Link>

            {/* Divider */}
            <div className="hidden md:block h-5 w-px bg-gray-200" />

            {/* Location Selector */}
            <button
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 border border-gray-200 text-sm text-gray-700 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="max-w-[160px] truncate font-medium">
                {selectedLocation?.name || 'Select Location'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </button>
          </div>

          {/* CENTER: Last Updated + Mode Badge */}
          <div className="hidden sm:flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">Last Updated: {lastUpdated}</span>
            </div>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}
            >
              {dataMode === 'LIVE' ? '🟢 LIVE' : 'Prototype / Demo Data'}
            </span>
            {systemStatus === 'OPERATIONAL' && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}
              >
                ● OPERATIONAL
              </span>
            )}
          </div>

          {/* RIGHT: Search, AI Copilot, Notifications, Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:bg-gray-50 border border-gray-200 transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-xs">Search…</span>
            </button>

            {/* AI Copilot */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-copilot'));
                }
                onOpenCopilot?.();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition"
              style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-xs">AI Copilot</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition">
              <Bell className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{ background: '#EF4444' }}
              >
                3
              </span>
            </button>

            {/* Profile */}
            <button
              onClick={() => setMobileConfigOpen(true)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 border border-gray-200 transition"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
              >
                {role === 'ADMIN' ? 'A' : role?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-gray-800 leading-tight">Admin</div>
                <div className="text-[10px] text-gray-400 leading-tight">Disaster Management</div>
              </div>
              <ChevronDown className="hidden md:block w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <MobileNavDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
      <MobileConfigDrawer isOpen={mobileConfigOpen} onClose={() => setMobileConfigOpen(false)} />
      <LocationSelectorModal isOpen={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
    </>
  );
};
