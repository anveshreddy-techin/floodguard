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
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'MODERATE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="flex h-screen bg-[#070b14] text-slate-100 overflow-hidden font-sans">
      <Sidebar activeTab="map" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Top Breadcrumb & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
                <Link href="/" className="hover:text-cyan-400 transition">INDIA NATIONAL</Link>
                <span>/</span>
                <span className="text-cyan-300 uppercase">STATE SEOC COMMAND</span>
                <span>/</span>
                <span className="text-white font-bold">{stateMeta.name.toUpperCase()}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                <Building className="w-7 h-7 text-cyan-400" />
                {stateMeta.name} State Disaster Operations
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5 font-mono">
                State Code: <span className="text-cyan-300 font-bold">{stateMeta.code}</span> | Zone: <span className="text-indigo-300 font-bold">{stateMeta.zone}</span> | Capital SEOC: <span className="text-slate-200">{stateMeta.capital}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <DataModeBadge mode="DEMO" />
              <Link
                href="/map"
                className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-bold font-mono flex items-center gap-1.5 hover:bg-cyan-900 transition"
              >
                <Compass className="w-3.5 h-3.5" /> NATIONAL MAP
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>COMPOSITE RISK</span>
                <ShieldAlert className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">{avgRisk}<span className="text-xs text-slate-500 font-normal">/100</span></div>
              <div className="text-[10px] text-orange-400 font-mono mt-1">ELEVATED MONSOON ALERT</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>MONITORED BASINS</span>
                <Droplets className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-cyan-300 font-mono">{stateMeta.rivers.length}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">Key River Channels Active</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>ACTIVE DOSSIERS</span>
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-black text-indigo-300 font-mono">{stateLocations.length}</div>
              <div className="text-[10px] text-indigo-400/80 font-mono mt-1">Hyper-local village nodes</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>STATE SEOC DISPATCH</span>
                <PhoneCall className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">1070</div>
              <div className="text-[10px] text-emerald-400/80 font-mono mt-1">Direct State Emergency Line</div>
            </div>
          </div>

          {/* Key Rivers & Hazard Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 md:p-5">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2 mb-3">
                <Droplets className="w-4 h-4 text-cyan-400" />
                Principal River Basins Monitored
              </h3>
              <div className="flex flex-wrap gap-2">
                {stateMeta.rivers.map((river) => (
                  <span
                    key={river}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-cyan-200 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    {river} River Catchment
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 md:p-5">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Primary Hazard Applications
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                State disaster classification for <strong className="text-white">{stateMeta.name}</strong> incorporates automated cascade physics modeling for rapid orographic runoff, cloudburst triggering, and upstream dam-break propagation.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800/50 text-[11px] font-mono text-rose-300">
                  SDMA TELEMETRY: SIMULATED (DEMO)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-mono text-slate-300">
                  REFRESH: 60s
                </span>
              </div>
            </div>
          </div>

          {/* Hyper-Local Village Dossiers in this State */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Hyper-Local Locations in {stateMeta.name}
              </h2>
              <span className="text-xs text-slate-500 font-mono">{stateLocations.length} registered zones</span>
            </div>

            {stateLocations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stateLocations.map((loc) => (
                  <Link
                    key={loc.id}
                    href={`/village/${loc.id}`}
                    className="bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl p-4 transition duration-200 group flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                          {loc.name}
                        </h4>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${getRiskBadge(loc.riskLevel)}`}>
                          {loc.riskLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">{loc.region}</p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{loc.primaryHazard}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                      <div>
                        <span className="text-slate-500">Risk Score:</span>{' '}
                        <span className="text-white font-bold">{loc.riskScore}/100</span>
                      </div>
                      <span className="text-cyan-400 group-hover:translate-x-0.5 transition flex items-center gap-1 font-bold">
                        OPEN DOSSIER <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl p-8 text-center">
                <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-mono">No localized village nodes currently registered for {stateMeta.name}.</p>
                <p className="text-xs text-slate-600 mt-1">Upload CSV boundary datasets in Data Ingestion to register new village clusters.</p>
                <Link
                  href="/upload"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 font-bold transition"
                >
                  <FileText className="w-3.5 h-3.5" /> GO TO UPLOAD CENTER
                </Link>
              </div>
            )}
          </div>

          {/* Quick State Switcher */}
          <div className="border-t border-slate-800/80 pt-4">
            <p className="text-xs text-slate-500 font-mono uppercase mb-2">SWITCH INDIAN STATE SEOC</p>
            <div className="flex flex-wrap gap-1.5">
              {INDIAN_STATES.map((s) => (
                <Link
                  key={s.id}
                  href={`/state/${s.id}`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                    s.id === params.id
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
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
