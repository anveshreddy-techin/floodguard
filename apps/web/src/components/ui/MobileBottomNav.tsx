'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  Compass, 
  PlayCircle, 
  FileText, 
  Menu, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenDrawer }) => {
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#070f24]/95 backdrop-blur-2xl border-t border-cyan-500/30 safe-bottom select-none shadow-[0_-8px_30px_rgba(0,0,0,0.85)]"
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
                  ? 'text-cyan-300 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.9)]' : ''
                } ${item.highlight && !isActive ? 'text-amber-400' : ''}`} />

                {item.badge && (
                  <span className={`absolute -top-1.5 -right-3 text-[8px] font-mono px-1 rounded-full font-bold ${
                    item.badge === 'LIVE' 
                      ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]' 
                      : 'bg-cyan-400 text-slate-950 font-black'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] font-mono mt-0.5 tracking-tight ${
                isActive ? 'text-cyan-300 font-bold' : 'text-slate-400'
              }`}>
                {item.label}
              </span>

              {isActive && (
                <div className="w-6 h-0.5 bg-gradient-to-r from-cyan-400 to-sky-300 rounded-full mt-0.5 shadow-[0_0_8px_rgba(6,182,212,1)]" />
              )}
            </Link>
          );
        })}

        {/* 5th Action: Full Disaster Menu Drawer */}
        <button
          onClick={onOpenDrawer}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-slate-400 hover:text-cyan-300 active:scale-90 transition"
        >
          <div className="w-5 h-5 rounded-lg bg-slate-900/90 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm">
            <Menu className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-mono mt-0.5 text-slate-400">
            More
          </span>
        </button>
      </div>
    </nav>
  );
};
