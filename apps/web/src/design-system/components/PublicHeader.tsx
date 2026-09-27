'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdaptive } from '@/context/AdaptiveContext';
import { LANGUAGES, SupportedLanguage } from '@/data/i18n';
import {
  Shield,
  Bell,
  User,
  ChevronDown,
  Eye,
  ArrowUpRight,
  Clock,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { StateEmblem } from './StateEmblem';

export const PublicHeader: React.FC = () => {
  const {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    language,
    setLanguage,
    operatingMode,
    setOperatingMode,
    role,
  } = useAdaptive();

  const [currentTime, setCurrentTime] = useState('05 Sep 2026 | 01:25 PM IST');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      setCurrentTime(`${dateStr} | ${timeStr} IST`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-white text-slate-900 border-b border-slate-200 select-none">
      {/* 1. Government-Format Top Utility Bar (Clean & Responsive on Mobile) */}
      <div className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] py-1 px-3 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2">
          {/* Left: Government Sovereignty Label */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
            <span className="font-bold text-slate-800 tracking-wide text-[11px] sm:text-xs truncate">
              भारत सरकार <span className="hidden sm:inline">&nbsp;GOVERNMENT OF INDIA</span>
            </span>
            <span className="text-slate-300 hidden md:inline">|</span>
            <span className="text-slate-500 hidden md:inline text-[10px] font-mono">
              SIH26192 Multi-Source Early Warning System
            </span>
          </div>

          {/* Right: Accessibility Utilities */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a
              href="#main-portal-content"
              className="text-slate-600 hover:text-slate-900 focus:not-sr-only focus:bg-amber-200 px-1 py-0.5 rounded transition font-medium hidden lg:inline"
            >
              Skip to Main Content
            </a>
            <span className="text-slate-300 hidden lg:inline">|</span>

            <button
              type="button"
              onClick={() => alert('Screen reader accessibility layer active (WCAG 2.1 AAA conformant).')}
              className="hidden sm:inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition"
              title="Screen Reader Access"
            >
              <Volume2 className="w-3 h-3 text-slate-500" />
              <span className="hidden md:inline">Screen Reader Access</span>
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>

            {/* Font Zoom A- A A+ */}
            <div className="flex items-center gap-0.5 sm:gap-1 font-mono font-bold text-xs" role="group" aria-label="Font Scaling">
              <button
                type="button"
                onClick={() => setFontSize('NORMAL')}
                className={`px-1 py-0.2 rounded hover:bg-slate-200 transition ${fontSize === 'NORMAL' ? 'text-blue-900 font-extrabold' : 'text-slate-600'}`}
                title="Default Font Size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('LARGE')}
                className={`px-1 py-0.2 rounded hover:bg-slate-200 transition ${fontSize === 'LARGE' ? 'text-blue-900 font-extrabold' : 'text-slate-600'}`}
                title="Medium Font Size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('XLARGE')}
                className={`px-1 py-0.2 rounded hover:bg-slate-200 transition ${fontSize === 'XLARGE' ? 'text-blue-900 font-extrabold' : 'text-slate-600'}`}
                title="Large Font Size"
              >
                A+
              </button>
            </div>
            <span className="text-slate-300">|</span>

            {/* High Contrast Toggle Icon */}
            <button
              type="button"
              onClick={() => setHighContrast((prev) => !prev)}
              className="p-1 rounded hover:bg-slate-200 text-slate-700 transition"
              title="Toggle High Contrast (WCAG AAA)"
              aria-label="Toggle High Contrast"
            >
              <div className="w-3.5 h-3.5 rounded-full border border-slate-700 overflow-hidden flex" aria-hidden="true">
                <div className="w-1/2 h-full bg-slate-800" />
                <div className="w-1/2 h-full bg-white" />
              </div>
            </button>
            <span className="text-slate-300">|</span>

            {/* Multi-Language Selector (7 Languages Supported) */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-slate-800 text-[11px] font-bold focus:outline-none cursor-pointer max-w-[85px] sm:max-w-none truncate"
                aria-label="Select Language"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.native}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Institutional Identity Banner */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        {/* Desktop Layout (md and up) */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Left Column: Official Emblem & Ministry Header */}
          <div className="flex items-center gap-3.5 shrink-0">
            <Link href="/portal" className="flex-shrink-0" aria-label="Home">
              <div className="p-0.5">
                <StateEmblem size={44} className="text-slate-800" />
              </div>
            </Link>

            <div>
              <div className="text-xs uppercase font-extrabold text-slate-900 tracking-wider font-serif">
                MINISTRY OF HOME AFFAIRS
              </div>
              <div className="text-[11px] uppercase font-bold text-slate-700 tracking-wide mt-0.5">
                NATIONAL DISASTER RESPONSE FORCE (NDRF)
              </div>
              <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                DM DIVISION
              </div>
            </div>
          </div>

          {/* Center Column: Large Bold Title */}
          <div className="text-center px-2">
            <h1 className="text-base sm:text-lg lg:text-xl font-black tracking-tight text-[#0c1f38] uppercase font-serif">
              FLASH FLOOD PREDICTION SYSTEM
            </h1>
            <p className="text-xs text-slate-600 font-medium tracking-wide mt-0.5">
              For Hilly Regions using Multi-Source Data
            </p>
          </div>

          {/* Right Column: Notifications, User Profile & Live Timestamp */}
          <div className="flex items-center justify-end gap-3 shrink-0">
            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => alert('Active Alerts: 3 high-severity flash flood advisories active in Uttarakhand (Dharali, Bhatwari, Rudraprayag).')}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition"
                title="3 Active System Advisories"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
                  3
                </span>
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-500 leading-none">Welcome,</div>
                <div className="font-bold text-[#0c1f38] leading-tight flex items-center gap-0.5">
                  <span>Control Room</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Real-time IST Timestamp */}
            <div className="hidden xl:block text-right pl-3 border-l border-slate-200">
              <div className="text-xs font-mono font-bold text-slate-800 whitespace-nowrap">
                {currentTime}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout (< md) — Clean, Compact & Space-Efficient */}
        <div className="md:hidden space-y-1.5">
          {/* Row 1: Emblem + Ministry Name + Notification & Profile */}
          <div className="flex items-center justify-between gap-2">
            <Link href="/portal" className="flex items-center gap-2 min-w-0" aria-label="Home">
              <StateEmblem size={32} className="text-slate-800 shrink-0" />
              <div className="min-w-0 leading-tight">
                <div className="text-[10px] uppercase font-black text-slate-900 tracking-tight truncate">
                  MINISTRY OF HOME AFFAIRS
                </div>
                <div className="text-[9px] uppercase font-bold text-slate-600 truncate">
                  NDRF · DM DIVISION
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Notification Bell */}
              <button
                type="button"
                onClick={() => alert('Active Alerts: 3 high-severity flash flood advisories active in Uttarakhand (Dharali, Bhatwari, Rudraprayag).')}
                className="relative p-1.5 rounded-lg bg-slate-100 text-slate-700 active:scale-95"
                title="3 Active System Advisories"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-600 text-white rounded-full text-[8px] font-mono font-bold flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Avatar */}
              <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                CR
              </div>
            </div>
          </div>

          {/* Row 2: Title & Subtitle */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1 text-center">
            <h1 className="text-xs font-black tracking-tight text-[#0c1f38] uppercase font-serif">
              FLASH FLOOD PREDICTION SYSTEM
            </h1>
            <p className="text-[9px] text-slate-600 font-medium">
              Multi-Source Early Warning · Hilly Regions
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
