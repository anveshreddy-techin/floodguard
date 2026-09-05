'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdaptive } from '@/context/AdaptiveContext';
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
      {/* 1. Government-Format Top Utility Bar */}
      <div className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] py-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Research Platform Sovereignty & Identity */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">
              स्मार्ट इंडिया हैकाथॉन २०२६ | SMART INDIA HACKATHON 2026
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600 hidden md:inline">
              SIH26192 Research Demonstration Platform · Problem Statement Theme 4
            </span>
          </div>

          {/* Right: Accessibility Utilities */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <a
              href="#main-portal-content"
              className="text-slate-600 hover:text-slate-900 focus:not-sr-only focus:bg-amber-200 px-1 py-0.5 rounded transition"
            >
              Skip to Main Content
            </a>
            <span className="text-slate-300">|</span>

            <button
              type="button"
              onClick={() => alert('Screen reader accessibility layer active (WCAG 2.1 AAA conformant).')}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition"
              title="Screen Reader Access"
            >
              <Volume2 className="w-3 h-3 text-slate-500" />
              <span className="hidden sm:inline">Screen Reader Access</span>
            </button>
            <span className="text-slate-300">|</span>

            {/* Font Zoom A- A A+ */}
            <div className="flex items-center gap-1 font-mono font-bold text-xs" role="group" aria-label="Font Scaling">
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

            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-slate-800 text-[11px] font-semibold focus:outline-none cursor-pointer pr-4"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Institutional Identity Banner (3-Column Layout Matching Reference) */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Column: Emblem / Department Block */}
        <div className="flex items-center gap-3">
          <Link href="/portal" className="flex-shrink-0" aria-label="FloodGuard AI Home">
            <div className="w-11 h-11 rounded bg-[#0c1f38] text-white flex flex-col items-center justify-center border border-slate-800 shadow-sm">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="text-[7px] font-mono tracking-widest text-slate-300 font-extrabold">FGAI</span>
            </div>
          </Link>

          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-600">
              DISASTER MANAGEMENT & EARLY WARNING DIVISION
            </div>
            <div className="text-sm font-extrabold text-[#0c1f38] tracking-tight font-serif">
              FLOODGUARD AI PLATFORM
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              SIH26192 RESEARCH / PILOT DEMONSTRATION PLATFORM
            </div>
          </div>
        </div>

        {/* Center Column: Large Bold Problem Title */}
        <div className="text-center md:px-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-[#0c1f38] uppercase font-serif">
            FLASH FLOOD PREDICTION SYSTEM
          </h1>
          <p className="text-xs text-slate-600 font-medium tracking-wide mt-0.5">
            For Hilly Regions using Multi-Source Data
          </p>
        </div>

        {/* Right Column: Notifications, User Profile & Live Timestamp */}
        <div className="flex items-center justify-end gap-3 self-end md:self-center">
          {/* Notification Bell with Badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => alert('Active Alerts: 3 high-severity catchment advisories active in Uttarakhand.')}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition"
              title="3 Active System Advisories"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
                3
              </span>
            </button>
          </div>

          {/* User Profile / Role */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 text-xs">
            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 leading-none">Welcome,</div>
              <div className="font-bold text-[#0c1f38] leading-tight flex items-center gap-0.5">
                <span>Control Room</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </div>
            </div>
          </div>

          {/* Real-time IST Timestamp */}
          <div className="hidden xl:block text-right pl-3 border-l border-slate-200">
            <div className="text-[10px] text-slate-500 uppercase font-mono">System Time</div>
            <div className="text-xs font-mono font-bold text-slate-800 whitespace-nowrap">
              {currentTime}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
