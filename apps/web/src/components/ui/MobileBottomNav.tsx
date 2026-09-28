'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Map as MapIcon, 
  Compass, 
  Bell, 
  PhoneCall 
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenConfig?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = () => {
  const pathname = usePathname();

  const handleOpenEmergency = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-emergency-modal'));
    }
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      id: 'map',
      label: 'Map',
      href: '/map',
      icon: MapIcon,
      isActive: pathname === '/map',
    },
    {
      id: 'safety',
      label: 'Safety',
      href: '/safety',
      icon: Compass,
      isActive: pathname === '/safety',
      badge: 'SAFE',
    },
    {
      id: 'alerts',
      label: 'Alerts',
      href: '/incidents',
      icon: Bell,
      isActive: pathname === '/incidents' || pathname?.startsWith('/portal/alerts'),
      badge: '2',
      badgeColor: 'bg-red-600',
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-[800] bg-white/95 backdrop-blur-xl border-t border-slate-200/90 select-none shadow-[0_-4px_25px_rgba(0,0,0,0.08)] safe-bottom"
    >
      <div className="flex items-center justify-between px-2 h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-150 active:scale-90 ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-110 text-blue-600 stroke-[2.4]' : 'stroke-[1.8]'
                }`} />

                {item.badge && (
                  <span className={`absolute -top-1.5 -right-3 text-[9px] font-sans px-1.5 py-0.2 rounded-full font-black text-white shadow-xs ${
                    item.badgeColor || 'bg-blue-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[11px] font-sans mt-1 tracking-tight ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-600 font-medium'
              }`}>
                {item.label}
              </span>

              {isActive && (
                <div className="w-5 h-1 bg-blue-600 rounded-full mt-0.5 shadow-sm" />
              )}
            </Link>
          );
        })}

        {/* 5th Tab: SOS 112 Emergency Action Button */}
        <button
          onClick={handleOpenEmergency}
          type="button"
          className="flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl text-red-600 active:scale-90 transition group cursor-pointer"
          title="Emergency Help & SOS 112 Dispatch"
        >
          <div className="relative w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-500/30 ring-2 ring-red-400/40">
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="text-[11px] font-sans font-black mt-1 text-red-600 tracking-tight">
            SOS 112
          </span>
        </button>
      </div>
    </nav>
  );
};
