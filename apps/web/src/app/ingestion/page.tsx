'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import {
  RefreshCw, CheckCircle2, XCircle, Clock, AlertTriangle,
  Play, Pause, Activity, BarChart3, Filter
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

const DEMO_JOBS = [
  { job_id: 'JOB-2026-001', provider: 'open_meteo', region: 'Pan-India', data_mode: 'LIVE', status: 'SUCCEEDED', started_at: '2026-08-30T06:00:00Z', completed_at: '2026-08-30T06:00:22Z', records_accepted: 1248, records_rejected: 0, note: 'Forecast ingestion completed' },
  { job_id: 'JOB-2026-002', provider: 'imd_national', region: 'Pan-India', data_mode: 'DEMO', status: 'PARTIAL', started_at: '2026-08-30T05:45:00Z', completed_at: '2026-08-30T05:45:08Z', records_accepted: 0, records_rejected: 0, note: 'NOT_CONFIGURED — demo fallback activated' },
  { job_id: 'JOB-2026-003', provider: 'cwc_national', region: 'Alaknanda Basin', data_mode: 'DEMO', status: 'PARTIAL', started_at: '2026-08-30T05:30:00Z', completed_at: '2026-08-30T05:30:05Z', records_accepted: 0, records_rejected: 0, note: 'NOT_CONFIGURED — demo fallback activated' },
  { job_id: 'JOB-2026-004', provider: 'floodguard_demo', region: 'Chamoli District', data_mode: 'DEMO', status: 'SUCCEEDED', started_at: '2026-08-30T00:00:00Z', completed_at: '2026-08-30T00:00:04Z', records_accepted: 42, records_rejected: 0, note: 'Demo scenario loaded' },
  { job_id: 'JOB-2026-005', provider: 'iot_simulator', region: 'Chamoli Pilot', data_mode: 'SIMULATION', status: 'RUNNING', started_at: '2026-08-30T11:00:00Z', completed_at: null, records_accepted: 144, records_rejected: 2, note: 'Sensor simulator active' },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  QUEUED:    { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-700', icon: <Clock className="w-3.5 h-3.5" /> },
  RUNNING:   { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: <Activity className="w-3.5 h-3.5 animate-pulse" /> },
  SUCCEEDED: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  PARTIAL:   { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  RETRYING:  { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-800', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  FAILED:    { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function IngestionPage() {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = filterStatus === 'ALL'
    ? DEMO_JOBS
    : DEMO_JOBS.filter(j => j.status === filterStatus);

  const summary = {
    total: DEMO_JOBS.length,
    running: DEMO_JOBS.filter(j => j.status === 'RUNNING').length,
    succeeded: DEMO_JOBS.filter(j => j.status === 'SUCCEEDED').length,
    partial: DEMO_JOBS.filter(j => j.status === 'PARTIAL').length,
    failed: DEMO_JOBS.filter(j => j.status === 'FAILED').length,
  };

  return (
    <div className="flex h-screen bg-[#F0F4F8] text-slate-900 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 font-sans">
                <RefreshCw className="w-7 h-7 text-blue-600" />
                Ingestion Pipeline Monitor
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-sans">
                Data ingestion jobs across all configured providers — operational status, record counts, and provenance tracking.
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            {[
              { label: 'Total Jobs', value: summary.total, color: 'text-slate-900' },
              { label: 'Running', value: summary.running, color: 'text-blue-700' },
              { label: 'Succeeded', value: summary.succeeded, color: 'text-emerald-700' },
              { label: 'Partial', value: summary.partial, color: 'text-amber-700' },
              { label: 'Failed', value: summary.failed, color: 'text-red-700' },
            ].map(c => (
              <div key={c.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
                <p className={`text-2xl md:text-3xl font-bold font-sans ${c.color}`}>{c.value}</p>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1 font-sans">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400 mr-1" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-2">Filter Jobs:</span>
            {['ALL', 'RUNNING', 'SUCCEEDED', 'PARTIAL', 'FAILED'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                  filterStatus === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Jobs table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider font-sans">
                  <th className="text-left px-4 py-3.5">Job ID</th>
                  <th className="text-left px-4 py-3.5">Provider</th>
                  <th className="text-left px-4 py-3.5 hidden md:table-cell">Region</th>
                  <th className="text-left px-4 py-3.5">Data Mode</th>
                  <th className="text-left px-4 py-3.5">Status</th>
                  <th className="text-right px-4 py-3.5 hidden md:table-cell">Accepted</th>
                  <th className="text-right px-4 py-3.5 hidden md:table-cell">Rejected</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job, i) => {
                  const style = STATUS_STYLES[job.status] || STATUS_STYLES['QUEUED'];
                  return (
                    <tr key={job.job_id} className={`border-b border-slate-100 transition-colors hover:bg-slate-50/80 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-blue-700 font-semibold text-xs">{job.job_id}</span>
                        <p className="text-slate-500 text-xs mt-0.5 hidden md:block font-sans">{job.note}</p>
                      </td>
                      <td className="px-4 py-3.5 text-slate-900 font-medium font-sans">{job.provider}</td>
                      <td className="px-4 py-3.5 text-slate-600 font-sans hidden md:table-cell">{job.region}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium font-sans">{job.data_mode}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold font-sans shadow-sm ${style.bg} ${style.text}`}>
                          {style.icon} {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-emerald-700 font-mono font-semibold hidden md:table-cell">{job.records_accepted.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-right text-red-600 font-mono font-semibold hidden md:table-cell">{job.records_rejected.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Explanation */}
          <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-4 text-sm text-slate-700 shadow-sm font-sans">
            <p className="font-bold text-blue-900 mb-1 font-sans">About PARTIAL Ingestion Status</p>
            <p className="text-blue-950/80 font-sans leading-relaxed">
              <strong className="text-blue-900 font-semibold">PARTIAL</strong> jobs indicate that the provider is <strong className="text-blue-900 font-semibold">NOT_CONFIGURED</strong> — the ingestion
              pipeline detected a missing institutional credential or authorization and automatically fell back to deterministic DEMO data.
              No live telemetry was silently discarded. Every fallback is recorded with an explicit <code className="bg-blue-100/70 px-1.5 py-0.5 rounded text-xs font-mono text-blue-800">NOT_CONFIGURED</code> trace note.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
