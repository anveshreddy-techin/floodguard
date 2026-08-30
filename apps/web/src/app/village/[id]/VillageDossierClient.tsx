'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { 
  MapPin, 
  ShieldAlert, 
  Compass, 
  Activity, 
  Home, 
  Waves, 
  CloudRain, 
  Mountain, 
  History, 
  Radio, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Building,
  PhoneCall,
  Flame,
  Globe
} from 'lucide-react';
import { RiskBadge, UncertaintyBadge, DataModeBadge } from '@/components/ui/Badges';
import { LOCATIONS, LocationDossier } from '@/context/LocationContext';

export const VillageDossierClient: React.FC<{ params: { id: string } }> = ({ params }) => {
  const currentLoc = LOCATIONS.find((l) => l.id === params.id) || LOCATIONS[LOCATIONS.length - 1];

  const zoneLabels: Record<string, string> = {
    HIMALAYAN_NORTH: 'Northern Himalayan Zone (Cloudburst / GLOF)',
    NORTHEAST_BRAHMAPUTRA: 'North-Eastern Brahmaputra Basin',
    WESTERN_GHATS_COASTAL: 'Western Ghats & Southern Coastal Escarpment',
    PENINSULAR_CENTRAL: 'Peninsular & Central River Basins',
    URBAN_METRO: 'Urban Metropolitan Flash Inundation',
    EASTERN_DELTA: 'Eastern Gangetic & Deltaic Plains',
  };

  const appLabels: Record<string, string> = {
    FLASH_FLOOD_CLOUDBURST: 'Orographic Cloudburst & Flash Surge',
    GLOF_GLACIAL_OUTBURST: 'Glacial Lake Outburst Flood (GLOF)',
    URBAN_STORMWATER_INUNDATION: 'Urban Stormwater & Drainage Backflow',
    DEBRIS_LANDSLIDE_CASCADE: 'Saturated Colluvial Debris Flow',
    RESERVOIR_DAM_SPILL: 'Dam Spillway & Reservoir Wave Propagation',
    COASTAL_ESTUARINE_SURGE: 'Tidal Lock & Cyclone Storm Surge',
  };

  return (
    <div className="flex flex-col min-h-screen select-none bg-[#020714]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="village" />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-7xl mx-auto space-y-6 pb-24 md:pb-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="chip chip-demo">NATIONAL DISASTER DOSSIER</span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700">
                  {currentLoc.state}
                </span>
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  {currentLoc.name}
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                {currentLoc.region} • {zoneLabels[currentLoc.zone] || currentLoc.zone}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <RiskBadge level={currentLoc.riskLevel} />
              <DataModeBadge mode="DEMO" />
            </div>
          </div>

          {/* Primary Multi-Disaster Application Profile Banner */}
          <div className="fp fp-operational rounded-3xl p-5 sm:p-6 space-y-4 border border-cyan-500/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  PRIMARY DISASTER DISCIPLINE: {appLabels[currentLoc.application] || currentLoc.application}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Monitoring Authority: {currentLoc.authoritativeAgency}</span>
              </div>
              <div className="text-xs font-mono text-slate-300">
                Lat: <strong className="text-cyan-300">{currentLoc.lat.toFixed(4)}°N</strong> • Lon: <strong className="text-cyan-300">{currentLoc.lon.toFixed(4)}°E</strong>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="fp p-3 rounded-2xl">
                <span className="text-slate-500 block text-[10px]">RISK SCORE</span>
                <span className="text-2xl font-black text-rose-400">{currentLoc.riskScore}/100</span>
                <span className="text-[9px] text-slate-400 block">{currentLoc.riskLevel} EXPOSURE</span>
              </div>
              <div className="fp p-3 rounded-2xl">
                <span className="text-slate-500 block text-[10px]">3H PRECIPITATION</span>
                <span className="text-xl font-bold text-cyan-300">{currentLoc.rainfall3h}</span>
                <span className="text-[9px] text-slate-400 block">IMD Doppler QPE</span>
              </div>
              <div className="fp p-3 rounded-2xl">
                <span className="text-slate-500 block text-[10px]">SOIL / MATRIX SAT</span>
                <span className="text-xl font-bold text-amber-300">{currentLoc.soilMoisture}</span>
                <span className="text-[9px] text-slate-400 block">Antecedent Index</span>
              </div>
              <div className="fp p-3 rounded-2xl">
                <span className="text-slate-500 block text-[10px]">RIVER / SURGE STAGE</span>
                <span className="text-xl font-bold text-emerald-300">{currentLoc.riverStage}</span>
                <span className="text-[9px] text-slate-400 block">CWC Gauge Stream</span>
              </div>
            </div>
          </div>

          {/* Section: Evacuation Shelters & Emergency SOS Dispatch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Shelters */}
            <div className="fp fp-operational rounded-3xl p-5 space-y-3">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-400" />
                DESIGNATED HIGH-GROUND SHELTERS & ISOCHRONES
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Primary Community Center Shelter</div>
                    <div className="text-[11px] text-slate-400 font-mono">Distance: 1.4 km • Elevation: +120m • Capacity: 600 evacuees</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    READY
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Secondary Elevated School Facility</div>
                    <div className="text-[11px] text-slate-400 font-mono">Distance: 2.2 km • Elevation: +85m • Capacity: 450 evacuees</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                    STANDBY
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Rescue Calling & Action Hub */}
            <div className="fp fp-critical rounded-3xl p-5 space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-rose-400 animate-bounce" />
                  1-TAP RESCUE DISPATCH & NATIONAL HELPLINE
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Transmit authorized GPS coordinates directly to NDRF and State Emergency Operations Center.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                    }
                  }}
                  className="btn-danger w-full py-3 rounded-xl text-xs font-mono font-black text-white flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition animate-pulse"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>🚨 DISPATCH RESCUE UNIT (1078)</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
