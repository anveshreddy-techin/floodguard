'use client';

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
    OPERATIONAL: 'bg-green-500/20 text-green-300 border border-green-500/30',
    CONFIGURED: 'bg-green-500/20 text-green-300 border border-green-500/30',
    NOT_CONFIGURED: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    SIMULATION_ONLY: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    DEGRADED: 'bg-red-500/20 text-red-300 border border-red-500/30',
  };
  const icons: Record<string, React.ReactNode> = {
    OPERATIONAL: <CheckCircle2 className="w-3 h-3" />,
    CONFIGURED: <CheckCircle2 className="w-3 h-3" />,
    NOT_CONFIGURED: <WifiOff className="w-3 h-3" />,
    SIMULATION_ONLY: <Activity className="w-3 h-3" />,
    DEGRADED: <AlertTriangle className="w-3 h-3" />,
  };
  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${colors[status] || 'bg-gray-600 text-gray-300'}`}>
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
    <div className="flex h-screen bg-[#0a0f1e] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Database className="w-6 h-6 text-blue-400" />
                National Data Source Registry
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                All data providers for FloodGuard AI — honest status, boundary documentation, and configuration requirements.
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Transparency Notice */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-amber-300 font-semibold">Transparency — Provider Status</p>
              <p className="text-amber-200/80 mt-0.5">
                FloodGuard AI reports exact integration status for every data provider. <strong>NOT_CONFIGURED</strong> means the
                technical boundary (adapter, retry logic, normalization) is implemented, but institutional credentials or authorization
                are not yet provided. No live data is fabricated.
              </p>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Configured / Active', value: configured, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
              { label: 'Not Configured', value: notConfigured, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
              { label: 'Simulation Only', value: simulation, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
            ].map(c => (
              <div key={c.label} className={`rounded-lg border p-4 ${c.bg}`}>
                <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
                <p className="text-gray-400 text-sm">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'CONFIGURED', 'OPERATIONAL', 'NOT_CONFIGURED', 'SIMULATION_ONLY'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Provider table */}
          <div className="space-y-3">
            {filtered.map(p => (
              <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-semibold">{p.name}</h3>
                      <StatusBadge status={p.status} />
                      <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-800 rounded">{p.data_mode}</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">{p.agency}</p>
                  </div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Data Products</p>
                    <div className="flex flex-wrap gap-1">
                      {p.products.map(prod => (
                        <span key={prod} className="text-xs px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded">{prod}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Coverage</p>
                    <p className="text-gray-300">{p.coverage}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Update Frequency</p>
                    <p className="text-gray-300">{p.update_frequency}</p>
                  </div>
                </div>

                <div className="mt-2 flex items-start gap-2 bg-gray-800/50 rounded p-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-400 text-xs">{p.integration_note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Fallback Notice */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-300 font-semibold">Upload Fallback Available</p>
              <p className="text-blue-200/70 mt-0.5">
                For all NOT_CONFIGURED providers, users can upload data using standardized CSV/GeoJSON templates via the{' '}
                <Link href="/upload" className="text-blue-400 underline">Data Upload Center</Link>.
                Templates and sample files are available for download.
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
