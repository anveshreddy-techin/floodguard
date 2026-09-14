'use client';

import { RelatedAppsBar } from '@/components/ui/RelatedAppsBar';
import React from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import {
  Globe, AlertTriangle, WifiOff, Clock, MapPin,
  ArrowRight, Shield, Info
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

const SHARED_BASINS = [
  {
    id: 'kosi-nepal',
    name: 'Kosi Basin',
    countries: 'India (Bihar) ↔ Nepal',
    upstream_country: 'Nepal',
    downstream_country: 'India',
    upstream_status: 'NOT_CONFIGURED',
    downstream_status: 'CWC_DEMO',
    data_authority: 'CWC (India) / DHM Nepal',
    notification_status: 'NOT_CONFIGURED',
    risk: 'EXTREME',
    note: 'Major transboundary flood basin. DHM Nepal API not integrated. Manual upload fallback available.',
  },
  {
    id: 'gandak-nepal',
    name: 'Gandak / Narayani Basin',
    countries: 'India (Bihar, UP) ↔ Nepal',
    upstream_country: 'Nepal',
    downstream_country: 'India',
    upstream_status: 'NOT_CONFIGURED',
    downstream_status: 'CWC_DEMO',
    data_authority: 'CWC (India) / DHM Nepal',
    notification_status: 'NOT_CONFIGURED',
    risk: 'HIGH',
    note: 'Gandak Barrage India-Nepal treaty basin. Upstream Narayani gauge data not integrated.',
  },
  {
    id: 'bhote-koshi',
    name: 'Bhote Koshi / Arun Basin',
    countries: 'India (Sikkim) ↔ Nepal / China',
    upstream_country: 'Nepal / Tibet (China)',
    downstream_country: 'India',
    upstream_status: 'NOT_CONFIGURED',
    downstream_status: 'CWC_DEMO',
    data_authority: 'CWC / DHM Nepal',
    notification_status: 'NOT_CONFIGURED',
    risk: 'HIGH',
    note: '2026 Rasuwa-Bhote Koshi surge event. Upstream data fully dependent on Nepal DHM (NOT_CONFIGURED).',
  },
  {
    id: 'teesta-sikkim',
    name: 'Teesta Basin',
    countries: 'India (Sikkim, WB) ↔ Bhutan / Bangladesh',
    upstream_country: 'Bhutan / Sikkim',
    downstream_country: 'West Bengal / Bangladesh',
    upstream_status: 'NOT_CONFIGURED',
    downstream_status: 'CWC_DEMO',
    data_authority: 'CWC / NMCG',
    notification_status: 'NOT_CONFIGURED',
    risk: 'EXTREME',
    note: '2023 South Lhonak GLOF propagated through Teesta. Multi-country data gap.',
  },
];

const EVENTS = [
  { date: '2021-02-07', event: 'Chamoli GLOF — Ronti peak, no cross-border trigger', countries: 'India only' },
  { date: '2021-06-15', event: 'Melamchi Nepal debris flow — downstream impacts in Nepal only', countries: 'Nepal → Nepal' },
  { date: '2023-10-04', event: 'South Lhonak GLOF — propagated Teesta → Bangladesh border', countries: 'India → Bangladesh' },
  { date: '2026-06-12', event: 'Rasuwa-Bhote Koshi surge — transboundary upstream', countries: 'Nepal → India (Sikkim)' },
];

export default function CrossBorderPage() {
  return (
    <div className="flex flex-col h-screen bg-[#F0F4F8] text-slate-900 overflow-hidden font-sans select-none">
      <Header />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="admin" />
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-6">
          <RelatedAppsBar activeAppId="cross-border" />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 font-sans">
                <Globe className="w-7 h-7 text-blue-600" />
                India Cross-Border Transboundary Basin View
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-sans">
                Shared river basins with Nepal, Bhutan, and Bangladesh — upstream telemetry integration and warning protocols.
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Upstream data gap warning */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 flex items-start gap-3.5 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-amber-900 font-bold font-sans">Transboundary Upstream Telemetry Notice</p>
              <p className="text-amber-800/90 mt-1 font-sans leading-relaxed">
                Upstream river telemetry and precipitation from Nepal depends on DHM Nepal API integration (NOT_CONFIGURED). 
                Bhutan DHMS API is similarly awaiting bilateral data sharing treaties. Direct feeds from China (Tibet Autonomous Region) are restricted. 
                Field operators may utilize manual CSV/GeoJSON ingestion or hydrodynamic simulation. International early-warning CAP dispatch remains strictly non-operational in pilot mode.
              </p>
            </div>
          </div>

          {/* Basin cards */}
          <div className="space-y-4">
            {SHARED_BASINS.map(basin => (
              <div key={basin.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3.5 transition-all hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-slate-900 font-bold font-sans text-base">{basin.name}</h3>
                    <p className="text-slate-500 text-xs font-medium font-sans mt-0.5">{basin.countries}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-sans shadow-sm ${
                    basin.risk === 'EXTREME' ? 'text-red-700 bg-red-50 border border-red-200' : 'text-amber-800 bg-amber-50 border border-amber-200'
                  }`}>
                    {basin.risk} RISK
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t border-slate-100 pt-3">
                  <div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1 font-sans">Upstream Status</p>
                    <div className="flex items-center gap-1.5">
                      <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-amber-800 font-semibold text-xs font-sans">{basin.upstream_status}</span>
                    </div>
                    <p className="text-slate-500 text-xs font-medium font-sans mt-0.5">{basin.upstream_country}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1 font-sans">Downstream Status</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-700 font-semibold text-xs font-sans">{basin.downstream_status}</span>
                    </div>
                    <p className="text-slate-500 text-xs font-medium font-sans mt-0.5">{basin.downstream_country}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1 font-sans">Data Authority</p>
                    <p className="text-slate-800 text-xs font-medium font-sans">{basin.data_authority}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1 font-sans">Notification Gateway</p>
                    <div className="flex items-center gap-1.5">
                      <WifiOff className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-600 font-semibold text-xs font-sans">NOT_CONFIGURED</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-slate-700 text-xs font-sans leading-relaxed">{basin.note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Historical timeline */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="text-slate-900 font-bold font-sans flex items-center gap-2 text-base">
              <Clock className="w-5 h-5 text-slate-500" />
              Cross-Border Historical Events & Transboundary Cascades
            </h2>
            <div className="divide-y divide-slate-100">
              {EVENTS.map(e => (
                <div key={e.date} className="flex items-start gap-4 py-3 transition-colors hover:bg-slate-50/70">
                  <span className="text-blue-700 font-mono font-bold text-xs flex-shrink-0 pt-0.5 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{e.date}</span>
                  <div>
                    <p className="text-slate-900 font-medium font-sans text-sm">{e.event}</p>
                    <p className="text-slate-500 text-xs font-sans mt-0.5">{e.countries}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Protocol note */}
          <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-4 flex items-start gap-3.5 shadow-sm">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-blue-950/85 text-sm font-sans leading-relaxed">
              <strong className="text-blue-900 font-bold">Cross-Border Notification Protocol: </strong>
              FloodGuard AI operates strictly in PILOT_MODE. International automated early warnings are not dispatched to public channels.
              Operational bilateral warning dissemination requires signed memorandums between NDMA (India) and partner hydrometeorological departments (DHM Nepal, DHMS Bhutan).
              To ingest verified transboundary telemetry, field coordinators may upload standardized station CSVs in the{' '}
              <a href="/upload" className="text-blue-700 font-semibold underline hover:text-blue-900">Upload Center</a>.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
