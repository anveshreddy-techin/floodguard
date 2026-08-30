'use client';

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
    <div className="flex h-screen bg-[#070b14] text-slate-100 overflow-hidden font-sans">
      <Sidebar activeTab="system" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
                <span>SYSTEM</span>
                <span>/</span>
                <span className="text-cyan-300 font-bold uppercase">ADMINISTRATION & GOVERNANCE</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                <ShieldCheck className="w-7 h-7 text-cyan-400" />
                Platform Administration & System Controls
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5 font-mono">
                System Governance | Role-Based Access Control (RBAC) | Provider Key Boundaries | Audit Security
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-bold font-mono">
                ROLE: SYSTEM ADMIN
              </span>
              <DataModeBadge mode="DEMO" />
            </div>
          </div>

          {/* System Mode Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Demo Mode Governor
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${demoMode ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300'}`}>
                  {demoMode ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Forces all endpoints to serve deterministic demonstration scenarios without requiring live institutional gateway authorization.
              </p>
              <button
                onClick={() => setDemoMode(!demoMode)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 font-bold transition border border-slate-700"
              >
                TOGGLE DEMO GOVERNOR
              </button>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-400" />
                  Default Data Mode
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {defaultDataMode}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Active global pipeline telemetry categorization tag applied to inbound telemetry and inference payloads.
              </p>
              <div className="flex gap-2">
                {['DEMO', 'SIMULATION', 'LIVE'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDefaultDataMode(mode)}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition border ${
                      defaultDataMode === mode
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  Security & Audit
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  AUDITED
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                SHA-256 hash chains and cryptographic ledger records sealed with immutable timestamps for NDMA compliance.
              </p>
              <Link
                href="/audit"
                className="block text-center w-full py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-xs font-mono text-emerald-300 font-bold transition border border-emerald-800/60"
              >
                OPEN AUDIT TRAIL
              </Link>
            </div>
          </div>

          {/* Provider Credentials & Boundaries Status */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white font-mono uppercase flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  National Provider Gateway Authorization Boundaries
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Institutional data providers require dedicated IP whitelisting & authenticated API tokens for operational switchover.
                </p>
              </div>
              <Link
                href="/data-sources"
                className="text-xs font-mono text-cyan-400 hover:underline font-bold"
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
                <div key={prov.name} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{prov.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 font-bold">
                      {prov.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Variable: <code className="text-cyan-300">{prov.envVar}</code></span>
                  </div>
                  <p className="text-[11px] text-slate-400">{prov.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* User Roles & Access Control */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
            <h3 className="text-base font-bold text-white font-mono uppercase flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-purple-400" />
              Role-Based Access Control (RBAC) Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Access Scope</th>
                    <th className="pb-2">Incident Command</th>
                    <th className="pb-2">Victim PII</th>
                    <th className="pb-2">System Config</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-2.5 font-bold text-purple-300">ADMIN</td>
                    <td>Full System & Master Ledger</td>
                    <td className="text-emerald-400">Full Control</td>
                    <td className="text-emerald-400">Authorized</td>
                    <td className="text-emerald-400">Read / Write</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-cyan-300">OPERATOR</td>
                    <td>State / District SEOC Hubs</td>
                    <td className="text-emerald-400">Dispatch & Triage</td>
                    <td className="text-emerald-400">Authorized</td>
                    <td className="text-slate-500">Read Only</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-indigo-300">FIELD ANALYST</td>
                    <td>Sensor Calibration & Hindcast</td>
                    <td className="text-amber-400">Task Update Only</td>
                    <td className="text-slate-500">Masked</td>
                    <td className="text-slate-500">None</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-400">VIEWER / DEMO</td>
                    <td>Public Advisories & Safe Routes</td>
                    <td className="text-slate-500">Read Only</td>
                    <td className="text-rose-400">Masked / Anonymized</td>
                    <td className="text-slate-500">None</td>
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
