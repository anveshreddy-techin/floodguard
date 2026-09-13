'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  Compass, 
  PlayCircle, 
  FileText, 
  SlidersHorizontal,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenConfig: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenConfig }) => {
  const pathname = usePathname();

  const navItems = [
    {
      id: 'command',
      label: 'Command',
      href: '/',
      icon: ShieldAlert,
      isActive: pathname === '/',
      badge: 'LIVE',
    },
    {
      id: 'safety',
      label: 'My Safety',
      href: '/safety',
      icon: Compass,
      isActive: pathname === '/safety',
      badge: 'HUD',
      highlight: true,
    },
    {
      id: 'simulation',
      label: 'Simulate',
      href: '/simulation',
      icon: PlayCircle,
      isActive: pathname === '/simulation',
    },
    {
      id: 'incidents',
      label: 'Incidents',
      href: '/incidents',
      icon: FileText,
      isActive: pathname === '/incidents',
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 safe-bottom select-none shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around px-2 py-1.5 h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 relative group active:scale-90 ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 text-blue-600' : ''
                } ${item.highlight && !isActive ? 'text-amber-600' : ''}`} />

                {item.badge && (
                  <span className={`absolute -top-1.5 -right-3 text-[8px] font-sans px-1 rounded-full font-bold ${
                    item.badge === 'LIVE' 
                      ? 'bg-red-600 text-white animate-pulse shadow-sm' 
                      : 'bg-blue-600 text-white font-bold'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] font-sans mt-0.5 tracking-tight ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500'
              }`}>
                {item.label}
              </span>

              {isActive && (
                <div className="w-6 h-0.5 bg-blue-600 rounded-full mt-0.5 shadow-sm" />
              )}
            </Link>
          );
        })}

        {/* 5th Action: Sector & Mode Configuration Drawer */}
        <button
          onClick={onOpenConfig}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 hover:text-blue-600 active:scale-90 transition"
          title="Open Sector, Role, Language & Mode Settings"
        >
          <div className="w-5 h-5 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-sans mt-0.5 text-slate-500">
            Sector
          </span>
        </button>
      </div>
    </nav>
  );
};
