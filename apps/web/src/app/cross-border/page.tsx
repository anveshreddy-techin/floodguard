'use client';

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
    <div className="flex h-screen bg-[#0a0f1e] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 space-y-4">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-400" />
                India Cross-Border Basin View
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Shared river basins with Nepal, Bhutan, and Bangladesh — upstream data integration status.
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Upstream data gap warning */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-amber-300 font-semibold">Upstream Data Gap — All Cross-Border Basins</p>
              <p className="text-amber-200/70 mt-0.5">
                Upstream data from Nepal depends on DHM Nepal API integration (NOT_CONFIGURED). 
                Bhutan DHMS API is also not configured. China upstream data is not accessible. 
                Manual data upload or simulation available as fallback. Cross-border notification channels are all NOT_CONFIGURED.
              </p>
            </div>
          </div>

          {/* Basin cards */}
          <div className="space-y-3">
            {SHARED_BASINS.map(basin => (
              <div key={basin.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{basin.name}</h3>
                    <p className="text-gray-400 text-xs mt-0.5">{basin.countries}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    basin.risk === 'EXTREME' ? 'text-red-400 bg-red-500/10' : 'text-amber-400 bg-amber-500/10'
                  }`}>
                    {basin.risk} RISK
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Upstream Status</p>
                    <div className="flex items-center gap-1">
                      <WifiOff className="w-3 h-3 text-amber-400" />
                      <span className="text-amber-300 text-xs">{basin.upstream_status}</span>
                    </div>
                    <p className="text-gray-600 text-xs">{basin.upstream_country}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Downstream Status</p>
                    <div className="flex items-center gap-1">
                      <span className="text-blue-300 text-xs">{basin.downstream_status}</span>
                    </div>
                    <p className="text-gray-600 text-xs">{basin.downstream_country}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Data Authority</p>
                    <p className="text-gray-300 text-xs">{basin.data_authority}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Notification</p>
                    <div className="flex items-center gap-1">
                      <WifiOff className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-400 text-xs">NOT_CONFIGURED</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 bg-gray-800/50 rounded p-2">
                  <p className="text-gray-400 text-xs">{basin.note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Historical timeline */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h2 className="text-white font-semibold flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gray-400" />
              Cross-Border Historical Events Timeline
            </h2>
            <div className="space-y-2">
              {EVENTS.map(e => (
                <div key={e.date} className="flex items-start gap-3 text-sm">
                  <span className="text-blue-400 font-mono text-xs flex-shrink-0 pt-0.5">{e.date}</span>
                  <div>
                    <p className="text-gray-300">{e.event}</p>
                    <p className="text-gray-500 text-xs">{e.countries}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Protocol note */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-400 text-sm">
              <strong className="text-gray-300">Cross-Border Notification Protocol: </strong>
              FloodGuard AI is in PILOT_MODE. No international notifications are dispatched.
              Operational protocol would require bilateral MoU between NDMA (India) and DHM (Nepal) / DHMS (Bhutan).
              Upstream data upload pathway: manually upload Nepal DHM gauge CSVs via the{' '}
              <span className="text-blue-400">Upload Center</span>.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
