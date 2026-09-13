'use client';

import { RelatedAppsBar } from '@/components/ui/RelatedAppsBar';
import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import {
  Database, Server, Globe, Wifi, WifiOff, CheckCircle2,
  AlertTriangle, Clock, BarChart3, RefreshCw, FileText,
  ExternalLink, Shield, Activity
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

const PROVIDERS = [
  {
    id: 'imd_national',
    name: 'IMD National AWS Network',
    agency: 'India Meteorological Department',
    status: 'NOT_CONFIGURED',
    data_mode: 'DEMO',
    products: ['District Rainfall', 'AWS Observations', 'QPF Forecasts', 'Warning Bulletins'],
    coverage: 'Pan-India (>680 AWS stations)',
    update_frequency: '15 minutes',
    integration_note: 'Requires formal MoU with IMD and static IP whitelisting at National Data Center, Pune.',
    link: 'https://mausam.imd.gov.in',
  },
  {
    id: 'cwc_national',
    name: 'CWC India-WRIS River Gauge Telemetry',
    agency: 'Central Water Commission',
    status: 'NOT_CONFIGURED',
    data_mode: 'DEMO',
    products: ['River Stage', 'Discharge', 'Warning / Danger Levels', 'Short-Range Forecasts'],
    coverage: 'Pan-India (>5000 gauge stations)',
    update_frequency: '15 minutes',
    integration_note: 'Requires institutional registration at indiawris.gov.in.',
    link: 'https://indiawris.gov.in',
  },
  {
    id: 'open_meteo',
    name: 'Open-Meteo Weather API',
    agency: 'Open-Meteo (OSS)',
    status: 'CONFIGURED',
    data_mode: 'LIVE',
    products: ['Weather Forecast', 'Temperature', 'Wind Speed', 'Precipitation Forecast'],
    coverage: 'Global (includes all India districts)',
    update_frequency: '1 hour',
    integration_note: 'Open-source API. No credentials required. Fully configured and active.',
    link: 'https://open-meteo.com',
  },
  {
    id: 'satellite_precip',
    name: 'GPM IMERG Satellite Precipitation',
    agency: 'NASA / JAXA',
    status: 'NOT_CONFIGURED',
    data_mode: 'DEMO',
    products: ['3h Areal Rainfall', 'Near-Real-Time Precipitation Estimates'],
    coverage: 'Pan-India (0.1° grid)',
    update_frequency: '3 hours',
    integration_note: 'Requires NASA EarthData OAuth2 credentials.',
    link: 'https://gpm.nasa.gov/data/imerg',
  },
  {
    id: 'nrsc_bhuvan',
    name: 'NRSC Bhuvan Flood Inundation',
    agency: 'NRSC / ISRO',
    status: 'NOT_CONFIGURED',
    data_mode: 'DEMO',
    products: ['Flood Extent Raster (SAR)', 'NDWI Change Detection'],
    coverage: 'India (selected basins, event-based)',
    update_frequency: '2–5 days (SAR revisit)',
    integration_note: 'Requires NRSC institutional registration and API key.',
    link: 'https://bhuvan.nrsc.gov.in',
  },
  {
    id: 'glacier_nrsc',
    name: 'Glacial Lake Monitoring (NRSC / GSI)',
    agency: 'NRSC / Geological Survey of India',
    status: 'NOT_CONFIGURED',
    data_mode: 'DEMO',
    products: ['Glacial Lake Extent', 'SAR Change Detection', 'GLOF Screening'],
    coverage: 'Himalayan basins',
    update_frequency: '5–10 days (satellite revisit)',
    integration_note: 'Requires NRSC/GSI institutional agreement. GLOF ML classifier not trained (insufficient events).',
    link: 'https://gsi.gov.in',
  },
  {
    id: 'reservoir_cwc',
    name: 'Reservoir Level Monitoring (CWC)',
    agency: 'Central Water Commission',
    status: 'NOT_CONFIGURED',
    data_mode: 'DEMO',
    products: ['Dam Level', 'Storage %', 'Spillway Status', 'Inflow/Outflow Forecast'],
    coverage: 'Major dams (national)',
    update_frequency: 'Daily (or event-triggered)',
    integration_note: 'Requires CWC institutional API key.',
    link: 'https://cwc.gov.in',
  },
  {
    id: 'iot_simulator',
    name: 'FloodGuard IoT Sensor Network',
    agency: 'FloodGuard AI (Internal)',
    status: 'SIMULATION_ONLY',
    data_mode: 'SIMULATION',
    products: ['Rainfall Rate (AWS)', 'River Stage (Radar)', 'Soil Moisture (TDR)', 'Vibration (Geophone)'],
    coverage: 'Chamoli Pilot Area (demo sensors)',
    update_frequency: '5 minutes',
    integration_note: 'Real IoT deployment requires LORA gateway hardware and SIM provisioning.',
    link: '',
  },
  {
    id: 'floodguard_demo',
    name: 'FloodGuard Demo Dataset',
    agency: 'FloodGuard AI (Internal)',
    status: 'OPERATIONAL',
    data_mode: 'DEMO',
    products: ['Historical Events', 'Model Scenarios', 'Training Cases', 'Template Files'],
    coverage: 'Pan-India (curated case studies)',
    update_frequency: 'On demand',
    integration_note: 'Always available. Used for demonstration, testing, and training.',
    link: '',
  },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    OPERATIONAL: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    CONFIGURED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    NOT_CONFIGURED: 'bg-amber-50 text-amber-800 border border-amber-200',
    SIMULATION_ONLY: 'bg-blue-50 text-blue-700 border border-blue-200',
    DEGRADED: 'bg-red-50 text-red-700 border border-red-200',
  };
  const icons: Record<string, React.ReactNode> = {
    OPERATIONAL: <CheckCircle2 className="w-3.5 h-3.5" />,
    CONFIGURED: <CheckCircle2 className="w-3.5 h-3.5" />,
    NOT_CONFIGURED: <WifiOff className="w-3.5 h-3.5" />,
    SIMULATION_ONLY: <Activity className="w-3.5 h-3.5" />,
    DEGRADED: <AlertTriangle className="w-3.5 h-3.5" />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans shadow-sm ${colors[status] || 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
      {icons[status]} {status.replace('_', ' ')}
    </span>
  );
}

export default function DataSourcesPage() {
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = filter === 'ALL'
    ? PROVIDERS
    : PROVIDERS.filter(p => p.status === filter);

  const configured = PROVIDERS.filter(p => p.status === 'OPERATIONAL' || p.status === 'CONFIGURED').length;
  const notConfigured = PROVIDERS.filter(p => p.status === 'NOT_CONFIGURED').length;
  const simulation = PROVIDERS.filter(p => p.status === 'SIMULATION_ONLY').length;

  return (
    <div className="flex h-screen bg-[#F0F4F8] text-slate-900 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <RelatedAppsBar activeAppId="data-sources" />

          {/* Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 font-sans">
                <Database className="w-7 h-7 text-blue-600" />
                National Data Source Registry
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-sans">
                All data providers for FloodGuard AI — honest operational status, boundary documentation, and credentials policy.
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Transparency Notice */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 flex items-start gap-3.5 shadow-sm">
            <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-amber-900 font-bold font-sans">Transparency Policy — Operational Provider Status</p>
              <p className="text-amber-800/90 mt-1 font-sans leading-relaxed">
                FloodGuard AI reports exact integration status for every data provider. <strong className="text-amber-900 font-semibold">NOT_CONFIGURED</strong> means the
                technical boundary (adapter, retry policy, schema normalization) is fully implemented, but formal institutional credentials or authorization
                agreements are required. No live operational data is ever synthesized or fabricated.
              </p>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Configured / Active', value: configured, color: 'text-emerald-700', bg: 'bg-white border-slate-200' },
              { label: 'Not Configured (MoU Needed)', value: notConfigured, color: 'text-amber-700', bg: 'bg-white border-slate-200' },
              { label: 'Simulation / Internal Only', value: simulation, color: 'text-blue-700', bg: 'bg-white border-slate-200' },
            ].map(c => (
              <div key={c.label} className={`rounded-xl border p-5 shadow-sm bg-white ${c.bg}`}>
                <p className={`text-3xl font-bold font-sans ${c.color}`}>{c.value}</p>
                <p className="text-slate-600 text-sm font-medium mt-1 font-sans">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-2">Filter Providers:</span>
            {['ALL', 'CONFIGURED', 'OPERATIONAL', 'NOT_CONFIGURED', 'SIMULATION_ONLY'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Provider cards */}
          <div className="space-y-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-slate-900 font-bold font-sans text-base">{p.name}</h3>
                      <StatusBadge status={p.status} />
                      <span className="text-xs font-semibold text-slate-600 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md">{p.data_mode}</span>
                    </div>
                    <p className="text-slate-500 text-xs font-medium mt-1 font-sans">{p.agency}</p>
                  </div>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md transition-colors"
                    >
                      <span>Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm border-t border-slate-100 pt-3">
                  <div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1.5 font-sans">Data Products</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.products.map(prod => (
                        <span key={prod} className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-md">{prod}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1 font-sans">Coverage</p>
                    <p className="text-slate-800 font-medium font-sans">{p.coverage}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1 font-sans">Update Frequency</p>
                    <p className="text-slate-800 font-medium font-sans">{p.update_frequency}</p>
                  </div>
                </div>

                <div className="mt-3.5 flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700 text-xs leading-relaxed font-sans">{p.integration_note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Fallback Notice */}
          <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-4 flex items-start gap-3.5 shadow-sm">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-900 font-bold font-sans">Standardized Upload Fallback Available</p>
              <p className="text-blue-800/90 mt-1 font-sans leading-relaxed">
                For all NOT_CONFIGURED providers, field personnel and analysts can ingest telemetry data using standardized CSV/GeoJSON templates via the{' '}
                <Link href="/upload" className="text-blue-700 font-semibold underline hover:text-blue-900">Data Upload Center</Link>.
                Pre-formatted templates and historical disaster datasets are provided with full schema validation.
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
