'use client';

import React, { useEffect } from 'react';
import { useAdaptive } from '@/context/AdaptiveContext';
import { PublicHeader, PublicNavigation, PublicFooter } from '@/design-system/components';

export default function PublicPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fontSize, highContrast, setExperience } = useAdaptive();

  useEffect(() => {
    setExperience('PUBLIC_PORTAL');
  }, [setExperience]);

  const fontClass =
    fontSize === 'XLARGE'
      ? 'text-base leading-relaxed'
      : fontSize === 'LARGE'
      ? 'text-sm leading-normal'
      : 'text-xs leading-normal';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
        highContrast
          ? 'bg-black text-white selection:bg-yellow-400 selection:text-black'
          : 'bg-[#f0f3f7] text-[#0f172a] selection:bg-slate-200'
      } ${fontClass}`}
    >
      {/* Top Utility + Institutional Branding Header */}
      <PublicHeader />

      {/* Dark Navy Navigation Bar */}
      <PublicNavigation />

      {/* Main Canvas Area */}
      <main id="main-portal-content" className="flex-1 w-full max-w-[1600px] mx-auto">
        {children}
      </main>

      {/* Institutional Footer */}
      <PublicFooter />
    </div>
  );
}
