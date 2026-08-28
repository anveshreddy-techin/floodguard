'use client';

import React from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { FileText, Shield, Key, History } from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

export default function AuditLogPage() {
  const auditLogs = [
    { id: "AUD-104", action: "ALERT_ACTIVATION", actor: "RiskEngineDaemon", role: "SYSTEM", entity: "Alert: Sunderbans Flash Flood Watch", timestamp: "2026-08-28 14:15:00 UTC", dataMode: "DEMO", traceId: "tr-7f82b1" },
    { id: "AUD-103", action: "TASK_ASSIGNED", actor: "operator@floodguard.demo", role: "AUTHORITY_OPERATOR", entity: "IncidentTask: T-1 (Activate Shelter 1)", timestamp: "2026-08-28 14:02:18 UTC", dataMode: "DEMO", traceId: "tr-3d91c4" },
    { id: "AUD-102", action: "UPLOAD_QUARANTINE", actor: "system_validator", role: "SYSTEM", entity: "DataUpload: 2 anomalous records isolated", timestamp: "2026-08-28 13:48:50 UTC", dataMode: "UPLOAD", traceId: "tr-5e21a0" },
    { id: "AUD-101", action: "DATABASE_SEED", actor: "admin@floodguard.demo", role: "ADMIN", entity: "Seed: Initialized deterministic scenario", timestamp: "2026-08-28 12:00:00 UTC", dataMode: "DEMO", traceId: "tr-0a11ff" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="audit" />

        <main className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-[#3a506b] pb-4">
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                IMMUTABLE AUDIT & PROVENANCE TRAIL
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Every risk scoring decision, operator acknowledgment, alert escalation, and upload mutation is recorded
              </p>
            </div>
            <span className="text-xs font-mono bg-slate-900 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
              IMMUTABLE LOGS
            </span>
          </div>

          <div className="bg-[#1c2541] border border-[#3a506b] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141d38] border-b border-slate-700 text-slate-300 font-mono text-[11px]">
                  <tr>
                    <th className="p-3">Log ID</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Actor / Role</th>
                    <th className="p-3">Entity Description</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Trace ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/50 transition">
                      <td className="p-3 text-cyan-400 font-bold">{log.id}</td>
                      <td className="p-3">
                        <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">
                        <div>{log.actor}</div>
                        <div className="text-[10px] text-slate-500">{log.role}</div>
                      </td>
                      <td className="p-3 text-slate-200">{log.entity}</td>
                      <td className="p-3 text-slate-400 text-[11px]">{log.timestamp}</td>
                      <td className="p-3 text-slate-500 text-[11px]">{log.traceId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
