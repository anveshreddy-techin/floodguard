'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Activity,
  Compass,
  AlertTriangle,
  Map,
  FileText,
  Folder,
  Settings,
  ChevronDown,
  ArrowUpRight,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';

export const PublicNavigation: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <nav className="w-full bg-[#0c1f38] text-white sticky top-0 z-40 border-b border-[#162f50] shadow-md select-none">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-1 text-xs font-medium">
            {/* 1. Dashboard */}
            <Link
              href="/portal"
              className={`px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition ${
                pathname === '/portal'
                  ? 'bg-[#1b3a63] text-white font-bold shadow-xs'
                  : 'text-slate-200 hover:text-white hover:bg-[#162e4e]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            {/* 2. Monitoring Dropdown */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => toggleDropdown('monitoring')}
                className={`px-3 py-1.5 rounded-sm flex items-center gap-1 transition ${
                  pathname?.startsWith('/portal/weather')
                    ? 'bg-[#1b3a63] text-white font-bold'
                    : 'text-slate-200 hover:text-white hover:bg-[#162e4e]'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Monitoring</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <div className="hidden group-hover:block absolute left-0 top-full w-52 bg-[#0c1f38] border border-slate-700 shadow-lg py-1 z-50 text-xs">
                <Link href="/portal/weather" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  Rainfall Analysis & Radar
                </Link>
                <Link href="/sensors" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  IoT Sensor Telemetry
                </Link>
                <Link href="/cascade" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  Slope & Drainage Stability
                </Link>
              </div>
            </div>

            {/* 3. Prediction Dropdown */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => toggleDropdown('prediction')}
                className="px-3 py-1.5 rounded-sm flex items-center gap-1 text-slate-200 hover:text-white hover:bg-[#162e4e] transition"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Prediction</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <div className="hidden group-hover:block absolute left-0 top-full w-56 bg-[#0c1f38] border border-slate-700 shadow-lg py-1 z-50 text-xs">
                <Link href="/simulation" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  Scenario Simulator (What-If)
                </Link>
                <Link href="/model-monitoring" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  Ensemble ML Model Registry
                </Link>
                <Link href="/hindcast" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  Historical Hindcast Lab
                </Link>
              </div>
            </div>

            {/* 4. Alerts */}
            <Link
              href="/portal/alerts"
              className={`px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition ${
                pathname === '/portal/alerts'
                  ? 'bg-[#1b3a63] text-white font-bold'
                  : 'text-slate-200 hover:text-white hover:bg-[#162e4e]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Alerts</span>
              <span className="bg-red-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                12
              </span>
            </Link>

            {/* 5. Risk Map */}
            <Link
              href="/map"
              className="px-3 py-1.5 rounded-sm flex items-center gap-1.5 text-slate-200 hover:text-white hover:bg-[#162e4e] transition"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Risk Map</span>
            </Link>

            {/* 6. Reports Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className={`px-3 py-1.5 rounded-sm flex items-center gap-1 transition ${
                  pathname?.startsWith('/portal/documents')
                    ? 'bg-[#1b3a63] text-white font-bold'
                    : 'text-slate-200 hover:text-white hover:bg-[#162e4e]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Reports</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <div className="hidden group-hover:block absolute left-0 top-full w-52 bg-[#0c1f38] border border-slate-700 shadow-lg py-1 z-50 text-xs">
                <Link href="/portal/documents" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  Situation Bulletins & SOPs
                </Link>
                <Link href="/incidents" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  Incident History Ledger
                </Link>
                <Link href="/audit" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  Audit Provenance Log
                </Link>
              </div>
            </div>

            {/* 7. Resources Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className={`px-3 py-1.5 rounded-sm flex items-center gap-1 transition ${
                  pathname?.startsWith('/portal/resources')
                    ? 'bg-[#1b3a63] text-white font-bold'
                    : 'text-slate-200 hover:text-white hover:bg-[#162e4e]'
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Resources</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <div className="hidden group-hover:block absolute left-0 top-full w-56 bg-[#0c1f38] border border-slate-700 shadow-lg py-1 z-50 text-xs">
                <Link href="/portal/resources" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  Download CSV / GeoJSON Templates
                </Link>
                <Link href="/portal/preparedness" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  Disaster Preparedness Checklists
                </Link>
                <Link href="/portal/shelters" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  High-Ground Shelter Directory
                </Link>
                <Link href="/portal/report" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  Citizen Incident Reporting Form
                </Link>
              </div>
            </div>

            {/* 8. Administration Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="px-3 py-1.5 rounded-sm flex items-center gap-1 text-slate-200 hover:text-white hover:bg-[#162e4e] transition"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Administration</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <div className="hidden group-hover:block absolute left-0 top-full w-52 bg-[#0c1f38] border border-slate-700 shadow-lg py-1 z-50 text-xs">
                <Link href="/data-sources" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  Data Provider Registry
                </Link>
                <Link href="/ingestion" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  Ingestion Jobs Pipeline
                </Link>
                <Link href="/admin" className="block px-3 py-2 text-slate-200 hover:bg-[#1b3a63] hover:text-white">
                  System Settings & Roles
                </Link>
              </div>
            </div>
          </div>

          {/* Right Action: Command Center Switcher Button */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-3 py-1 rounded text-xs transition active:scale-95 shadow-sm"
              title="Switch to Tactical Operations Command Center"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tactical Command Center</span>
              <span className="sm:hidden">Command</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 rounded lg:hidden text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a172a] border-t border-slate-800 px-4 py-3 space-y-2 text-xs">
          <Link href="/portal" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-200">
            Dashboard
          </Link>
          <Link href="/portal/alerts" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-200">
            Alerts (12 Active)
          </Link>
          <Link href="/portal/weather" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-200">
            Weather & Rainfall Analysis
          </Link>
          <Link href="/map" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-200">
            Risk Map
          </Link>
          <Link href="/portal/shelters" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-200">
            Evacuation Shelters
          </Link>
          <Link href="/portal/report" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-200">
            Report an Incident
          </Link>
          <Link href="/portal/documents" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-200">
            Documents & SOPs
          </Link>
        </div>
      )}
    </nav>
  );
};
