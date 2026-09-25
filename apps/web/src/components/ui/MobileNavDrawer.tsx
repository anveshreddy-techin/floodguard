'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronDown } from 'lucide-react';
import { APP_HUB_OPTIONS } from '@/components/ui/Sidebar';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const [expandedHubs, setExpandedHubs] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    APP_HUB_OPTIONS.forEach((h) => {
      // Auto-expand only the hub that contains the currently active route
      const hasActiveChild = h.relatedApps.some(
        (a) => pathname === a.href || (pathname.startsWith('/village') && a.id === 'village')
      );
      initial[h.id] = hasActiveChild;
    });
    return initial;
  });

  const toggleHub = (hubId: string) => {
    setExpandedHubs((prev) => ({
      ...prev,
      [hubId]: !prev[hubId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex md:hidden select-none font-sans">
      {/* 100% Solid Dark Backdrop overlay */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modern Slide-out Drawer Sheet */}
      <div className="relative w-full max-w-sm bg-white border-r border-slate-200 flex flex-col h-full z-[10000] animate-slide-right shadow-2xl safe-top safe-bottom text-slate-900 font-sans">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600 animate-ping shadow-sm" />
            <div>
              <div className="text-sm font-bold text-slate-900 font-sans tracking-wide">
                FLOODGUARD <span className="text-blue-600 font-bold">AI</span>
              </div>
              <div className="text-[10px] font-sans text-blue-700 font-semibold">
                SIH26192 • DISASTER PORTAL
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition shadow-sm"
            aria-label="Close Navigation Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Application Hubs Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
          {APP_HUB_OPTIONS.map((hub) => {
            const HubIcon = hub.icon;
            const isExpanded = !!expandedHubs[hub.id];
            const hasActiveChild = hub.relatedApps.some(
              (a) => pathname === a.href || (pathname.startsWith('/village') && a.id === 'village')
            );

            return (
              <div 
                key={hub.id}
                className={`bg-white rounded-2xl border transition shadow-xs overflow-hidden ${
                  hasActiveChild ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200'
                }`}
              >
                {/* Hub Header Button */}
                <div className="p-2.5 flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70">
                  <Link
                    href={hub.defaultHref}
                    onClick={onClose}
                    className="flex items-center gap-2 flex-1 min-w-0"
                  >
                    <div 
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                      style={{ background: `${hub.accentColor}18`, color: hub.accentColor }}
                    >
                      <HubIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {hub.shortTitle}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate font-medium">
                        {hub.badge} · {hub.relatedApps.length} tools
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={() => toggleHub(hub.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Related Apps List */}
                {isExpanded && (
                  <div className="p-1.5 space-y-0.5 font-sans">
                    {hub.relatedApps.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || (pathname.startsWith('/village') && item.id === 'village');

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition font-medium active:scale-98 ${
                            isActive
                              ? 'bg-blue-600 text-white font-bold shadow-xs'
                              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                            <span className="truncate text-xs">{item.label}</span>
                          </div>

                          {item.tag && (
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                              isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 border border-slate-200 text-slate-600'
                            }`}>
                              {item.tag}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 bg-white text-xs font-sans flex items-center justify-between">
          <span className="font-semibold text-blue-700">SIH26192 • Theme 4</span>
          <span className="text-emerald-700 font-semibold">5 Unified Hubs</span>
        </div>
      </div>
    </div>
  );
};
