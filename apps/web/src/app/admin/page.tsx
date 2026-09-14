'use client';

import { RelatedAppsBar } from '@/components/ui/RelatedAppsBar';
import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import {
  ShieldCheck, Server, Key, Lock, Users,
  Activity, RefreshCw, Database, AlertTriangle, CheckCircle2,
  FileCode, Terminal, Clock, ShieldAlert
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function AdminControlPage() {
  const [demoMode, setDemoMode] = useState(true);
  const [defaultDataMode, setDefaultDataMode] = useState('DEMO');

  return (
    <div className="flex flex-col h-screen bg-[#F0F4F8] text-slate-900 overflow-hidden font-sans select-none">
      <Header />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="system" />
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-6">
          <RelatedAppsBar activeAppId="admin" />
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-sans font-medium mb-1">
                <span>SYSTEM</span>
                <span>/</span>
                <span className="text-blue-700 font-bold uppercase">ADMINISTRATION &amp; GOVERNANCE</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                <ShieldCheck className="w-7 h-7 text-blue-600" />
                Platform Administration &amp; System Controls
              </h1>
              <p className="text-xs md:text-sm text-slate-600 mt-1 font-sans">
                System Governance | Role-Based Access Control (RBAC) | Provider Key Boundaries | Audit Security
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold font-sans">
                ROLE: SYSTEM ADMIN
              </span>
              <DataModeBadge mode="DEMO" />
            </div>
          </div>

          {/* System Mode Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900 font-sans uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Demo Mode Governor
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${demoMode ? 'bg-amber-50 text-amber-800 border border-amber-300' : 'bg-emerald-50 text-emerald-800 border border-emerald-300'}`}>
                  {demoMode ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-4 font-sans leading-relaxed">
                Forces all endpoints to serve deterministic demonstration scenarios without requiring live institutional gateway authorization.
              </p>
              <button
                onClick={() => setDemoMode(!demoMode)}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-sans text-blue-700 font-bold transition border border-slate-200"
              >
                TOGGLE DEMO GOVERNOR
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900 font-sans uppercase flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  Default Data Mode
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {defaultDataMode}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-4 font-sans leading-relaxed">
                Active global pipeline telemetry categorization tag applied to inbound telemetry and inference payloads.
              </p>
              <div className="flex gap-2">
                {['DEMO', 'SIMULATION', 'LIVE'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDefaultDataMode(mode)}
                    className={`flex-1 py-2 rounded-xl text-xs font-sans font-bold transition border ${
                      defaultDataMode === mode
                        ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900 font-sans uppercase flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  Security &amp; Audit
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  AUDITED
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-4 font-sans leading-relaxed">
                SHA-256 hash chains and cryptographic ledger records sealed with immutable timestamps for NDMA compliance.
              </p>
              <Link
                href="/audit"
                className="block text-center w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-sans text-emerald-800 font-bold transition border border-emerald-200"
              >
                OPEN AUDIT TRAIL
              </Link>
            </div>
          </div>

          {/* Provider Credentials & Boundaries Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans uppercase flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-600" />
                  National Provider Gateway Authorization Boundaries
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-sans">
                  Institutional data providers require dedicated IP whitelisting &amp; authenticated API tokens for operational switchover.
                </p>
              </div>
              <Link
                href="/data-sources"
                className="text-xs font-sans text-blue-600 hover:underline font-bold"
              >
                VIEW FULL REGISTRY →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: 'IMD National AWS Weather Gateway', envVar: 'RAINFALL_API_KEY', status: 'NOT_CONFIGURED (Demo Fallback)', note: 'Requires MoU & Pune NDC static IP whitelist' },
                { name: 'CWC WRIS River Telemetry Portal', envVar: 'RIVER_API_KEY', status: 'NOT_CONFIGURED (Demo Fallback)', note: 'Requires Central Water Commission institutional key' },
                { name: 'CAP XML Emergency Gateway', envVar: 'CAP_GATEWAY_URL', status: 'NOT_CONFIGURED (Pilot Mode)', note: 'Public alert dispatch inhibited in prototype pilot' },
                { name: 'NRSC Bhuvan Inundation SAR Feed', envVar: 'BHUVAN_AUTH_TOKEN', status: 'NOT_CONFIGURED (Demo Fallback)', note: 'Requires ISRO/NRSC institutional credential' },
              ].map((prov) => (
                <div key={prov.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 font-sans">{prov.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                      {prov.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans text-slate-600">
                    <span>Variable: <code className="text-blue-700 font-mono text-xs">{prov.envVar}</code></span>
                  </div>
                  <p className="text-xs text-slate-600 font-sans">{prov.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* User Roles & Access Control */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 font-sans uppercase flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-purple-600" />
              Role-Based Access Control (RBAC) Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <th className="py-2.5 px-3 font-semibold">Role</th>
                    <th className="py-2.5 px-3 font-semibold">Access Scope</th>
                    <th className="py-2.5 px-3 font-semibold">Incident Command</th>
                    <th className="py-2.5 px-3 font-semibold">Victim PII</th>
                    <th className="py-2.5 px-3 font-semibold">System Config</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-bold text-purple-800 font-mono">ADMIN</td>
                    <td className="px-3">Full System &amp; Master Ledger</td>
                    <td className="px-3 text-emerald-700 font-medium">Full Control</td>
                    <td className="px-3 text-emerald-700 font-medium">Authorized</td>
                    <td className="px-3 text-emerald-700 font-medium">Read / Write</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-bold text-blue-700 font-mono">OPERATOR</td>
                    <td className="px-3">State / District SEOC Hubs</td>
                    <td className="px-3 text-emerald-700 font-medium">Dispatch &amp; Triage</td>
                    <td className="px-3 text-emerald-700 font-medium">Authorized</td>
                    <td className="px-3 text-slate-500">Read Only</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-bold text-indigo-700 font-mono">FIELD ANALYST</td>
                    <td className="px-3">Sensor Calibration &amp; Hindcast</td>
                    <td className="px-3 text-amber-700 font-medium">Task Update Only</td>
                    <td className="px-3 text-slate-500">Masked</td>
                    <td className="px-3 text-slate-500">None</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-bold text-slate-600 font-mono">VIEWER / DEMO</td>
                    <td className="px-3">Public Advisories &amp; Candidate Evacuation Routes</td>
                    <td className="px-3 text-slate-500">Read Only</td>
                    <td className="px-3 text-red-600 font-medium">Masked / Anonymized</td>
                    <td className="px-3 text-slate-500">None</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
