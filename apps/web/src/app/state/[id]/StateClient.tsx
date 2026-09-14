'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import {
  MapPin, ShieldAlert, Activity, Droplets, Wind,
  AlertTriangle, ArrowUpRight, Compass, PhoneCall,
  ExternalLink, Building, ChevronRight, Layers, FileText
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';
import { LOCATIONS, LocationDossier } from '@/data/locations';
import { INDIAN_STATES } from '@/data/states';

export function StateClient({ params }: { params: { id: string } }) {
  const stateMeta = INDIAN_STATES.find((s) => s.id === params.id) || INDIAN_STATES[0];
  const stateLocations = LOCATIONS.filter((l) =>
    l.state.toLowerCase().includes(stateMeta.name.toLowerCase()) ||
    stateMeta.name.toLowerCase().includes(l.state.toLowerCase())
  );

  const avgRisk = stateLocations.length > 0
    ? Math.round(stateLocations.reduce((acc, curr) => acc + curr.riskScore, 0) / stateLocations.length)
    : 62;

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'EXTREME':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'MODERATE':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="flex h-screen bg-[#F0F4F8] text-slate-900 overflow-hidden font-sans">
      <Sidebar activeTab="map" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Top Breadcrumb & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-sans mb-1">
                <Link href="/" className="hover:text-blue-600 transition font-medium">INDIA NATIONAL</Link>
                <span>/</span>
                <span className="text-blue-700 font-semibold uppercase">STATE SEOC COMMAND</span>
                <span>/</span>
                <span className="text-slate-900 font-bold">{stateMeta.name.toUpperCase()}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3 font-sans">
                <Building className="w-7 h-7 text-blue-600" />
                {stateMeta.name} State Disaster Operations
              </h1>
              <p className="text-xs md:text-sm text-slate-600 mt-1 font-sans">
                State Code: <span className="text-blue-700 font-bold">{stateMeta.code}</span> | Zone: <span className="text-slate-800 font-bold">{stateMeta.zone}</span> | Capital SEOC: <span className="text-slate-800 font-medium">{stateMeta.capital}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <DataModeBadge mode="DEMO" />
              <Link
                href="/map"
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold font-sans flex items-center gap-1.5 hover:bg-slate-50 hover:text-blue-600 transition shadow-sm"
              >
                <Compass className="w-4 h-4 text-blue-600" /> NATIONAL MAP
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 font-sans">
                <span>COMPOSITE RISK</span>
                <ShieldAlert className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 font-sans">{avgRisk}<span className="text-xs text-slate-500 font-normal">/100</span></div>
              <div className="text-xs text-amber-800 font-semibold font-sans mt-1">ELEVATED MONSOON ALERT</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 font-sans">
                <span>MONITORED BASINS</span>
                <Droplets className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-700 font-sans">{stateMeta.rivers.length}</div>
              <div className="text-xs text-slate-500 font-sans mt-1">Key River Channels Active</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 font-sans">
                <span>ACTIVE DOSSIERS</span>
                <Layers className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-bold text-indigo-700 font-sans">{stateLocations.length}</div>
              <div className="text-xs text-slate-500 font-sans mt-1">Hyper-local village nodes</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 font-sans">
                <span>STATE SEOC DISPATCH</span>
                <PhoneCall className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-700 font-sans">1070</div>
              <div className="text-xs text-emerald-700 font-semibold font-sans mt-1">Direct State Emergency Line</div>
            </div>
          </div>

          {/* Key Rivers & Hazard Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 font-sans uppercase tracking-wider flex items-center gap-2 mb-3">
                <Droplets className="w-4 h-4 text-blue-600" />
                Principal River Basins Monitored
              </h3>
              <div className="flex flex-wrap gap-2">
                {stateMeta.rivers.map((river) => (
                  <span
                    key={river}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-sans text-slate-800 font-medium flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    {river} River Catchment
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 font-sans uppercase tracking-wider flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Primary Hazard Applications
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                State disaster classification for <strong className="text-slate-900 font-semibold">{stateMeta.name}</strong> incorporates automated cascade physics modeling for rapid orographic runoff, cloudburst triggering, and upstream dam-break propagation.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-xs font-sans font-semibold text-red-700">
                  SDMA TELEMETRY: SIMULATED (DEMO)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-sans font-medium text-slate-700">
                  REFRESH: 60s
                </span>
              </div>
            </div>
          </div>

          {/* Hyper-Local Village Dossiers in this State */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 font-sans uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Hyper-Local Locations in {stateMeta.name}
              </h2>
              <span className="text-xs text-slate-500 font-sans font-medium">{stateLocations.length} registered zones</span>
            </div>

            {stateLocations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {stateLocations.map((loc) => (
                  <Link
                    key={loc.id}
                    href={`/village/${loc.id}`}
                    className="bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-blue-300 rounded-xl p-4 transition duration-200 shadow-sm group flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition font-sans">
                          {loc.name}
                        </h4>
                        <span className={`text-xs font-sans px-2.5 py-0.5 rounded-full border font-bold shadow-sm ${getRiskBadge(loc.riskLevel)}`}>
                          {loc.riskLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-sans">{loc.region}</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 font-sans">{loc.primaryHazard}</p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-sans text-slate-500">
                      <div>
                        <span className="text-slate-500">Risk Score:</span>{' '}
                        <span className="text-slate-900 font-bold">{loc.riskScore}/100</span>
                      </div>
                      <span className="text-blue-600 group-hover:translate-x-0.5 transition flex items-center gap-1 font-bold">
                        OPEN DOSSIER <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center shadow-sm">
                <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-700 font-medium font-sans">No localized village nodes currently registered for {stateMeta.name}.</p>
                <p className="text-xs text-slate-500 mt-1 font-sans">Upload CSV boundary datasets in Data Ingestion to register new village clusters.</p>
                <Link
                  href="/upload"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-xs font-sans text-blue-700 font-bold transition"
                >
                  <FileText className="w-3.5 h-3.5" /> GO TO UPLOAD CENTER
                </Link>
              </div>
            )}
          </div>

          {/* Quick State Switcher */}
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2.5 font-sans">SWITCH INDIAN STATE SEOC</p>
            <div className="flex flex-wrap gap-1.5">
              {INDIAN_STATES.map((s) => (
                <Link
                  key={s.id}
                  href={`/state/${s.id}`}
                  className={`px-3 py-1 rounded-lg text-xs font-sans font-medium transition shadow-sm ${
                    s.id === params.id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
