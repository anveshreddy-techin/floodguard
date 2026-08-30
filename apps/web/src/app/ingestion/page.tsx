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
  QUEUED:    { bg: 'bg-gray-600/20 border-gray-600/30', text: 'text-gray-300', icon: <Clock className="w-3 h-3" /> },
  RUNNING:   { bg: 'bg-blue-500/20 border-blue-500/30', text: 'text-blue-300', icon: <Activity className="w-3 h-3 animate-pulse" /> },
  SUCCEEDED: { bg: 'bg-green-500/20 border-green-500/30', text: 'text-green-300', icon: <CheckCircle2 className="w-3 h-3" /> },
  PARTIAL:   { bg: 'bg-amber-500/20 border-amber-500/30', text: 'text-amber-300', icon: <AlertTriangle className="w-3 h-3" /> },
  RETRYING:  { bg: 'bg-orange-500/20 border-orange-500/30', text: 'text-orange-300', icon: <RefreshCw className="w-3 h-3" /> },
  FAILED:    { bg: 'bg-red-500/20 border-red-500/30', text: 'text-red-300', icon: <XCircle className="w-3 h-3" /> },
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
    <div className="flex h-screen bg-[#0a0f1e] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 space-y-4">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-blue-400" />
                Ingestion Pipeline Monitor
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Data ingestion jobs across all configured providers — status, records, and provenance.
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Total Jobs', value: summary.total, color: 'text-white' },
              { label: 'Running', value: summary.running, color: 'text-blue-400' },
              { label: 'Succeeded', value: summary.succeeded, color: 'text-green-400' },
              { label: 'Partial', value: summary.partial, color: 'text-amber-400' },
              { label: 'Failed', value: summary.failed, color: 'text-red-400' },
            ].map(c => (
              <div key={c.label} className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
                <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
                <p className="text-gray-500 text-xs">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500" />
            {['ALL', 'RUNNING', 'SUCCEEDED', 'PARTIAL', 'FAILED'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Jobs table */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Job ID</th>
                  <th className="text-left px-4 py-3">Provider</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Region</th>
                  <th className="text-left px-4 py-3">Data Mode</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3 hidden md:table-cell">Accepted</th>
                  <th className="text-right px-4 py-3 hidden md:table-cell">Rejected</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job, i) => {
                  const style = STATUS_STYLES[job.status] || STATUS_STYLES['QUEUED'];
                  return (
                    <tr key={job.job_id} className={`border-b border-gray-800/50 ${i % 2 === 0 ? '' : 'bg-gray-900/30'}`}>
                      <td className="px-4 py-3">
                        <span className="font-mono text-blue-400 text-xs">{job.job_id}</span>
                        <p className="text-gray-500 text-xs mt-0.5 hidden md:block">{job.note}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{job.provider}</td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{job.region}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300">{job.data_mode}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded border text-xs font-semibold ${style.bg} ${style.text}`}>
                          {style.icon} {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-green-400 font-mono hidden md:table-cell">{job.records_accepted}</td>
                      <td className="px-4 py-3 text-right text-red-400 font-mono hidden md:table-cell">{job.records_rejected}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Explanation */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm text-gray-400">
            <p className="font-semibold text-gray-300 mb-1">About PARTIAL Status</p>
            <p>
              <strong>PARTIAL</strong> jobs indicate that the provider is <strong>NOT_CONFIGURED</strong> — the ingestion
              pipeline detected a missing credential or authorization and fell back to deterministic DEMO data.
              No live data was silently dropped. Every fallback is logged with an explicit <code>NOT_CONFIGURED</code> note.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
