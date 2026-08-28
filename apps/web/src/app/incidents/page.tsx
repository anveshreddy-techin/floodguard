'use client';

import React from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { ShieldAlert, CheckSquare, Users, Home, AlertTriangle, ArrowRight } from 'lucide-react';
import { SeverityBadge } from '@/components/ui/Badges';

export default function IncidentCommandPage() {
  const incidents = [
    {
      id: "INC-2026-001",
      title: "Flash Flood Surge Watch: Sunderbans Nagar Downstream Lowland",
      severity: "HIGH" as const,
      status: "ACTIVE_RESPONSE",
      commander: "Duty Officer (DDMA Uttarakhand)",
      detectedAt: "2026-08-28 13:45 UTC",
      tasks: [
        { id: "T-1", title: "Activate Community High School Shelter", assignedTo: "Relief Team Alpha", status: "COMPLETED" },
        { id: "T-2", title: "Verify Bridge Passability at KM 0.6 Culvert", assignedTo: "Field Officer Sharma", status: "IN_PROGRESS" },
        { id: "T-3", title: "Disseminate CAP SMS to Sunderbans Nagar Ward 3 & 4", assignedTo: "Telecom Unit", status: "PENDING" },
      ],
      shelters: [
        { name: "Community High School Shelter", capacity: 450, occupancy: 0, status: "READY" },
        { name: "Panchayat Bhavan Relief Center", capacity: 250, occupancy: 0, status: "STANDBY" },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="incidents" />

        <main className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-[#3a506b] pb-4">
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
                INCIDENT COMMAND & OPERATIONAL RESPONSE POST
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Standardized disaster incident lifecycle: Detection $\rightarrow$ Verification $\rightarrow$ Response $\rightarrow$ Evacuation
              </p>
            </div>
            <span className="px-2.5 py-1 bg-rose-950 text-rose-300 border border-rose-700 rounded text-xs font-mono font-bold">
              1 ACTIVE INCIDENT
            </span>
          </div>

          {incidents.map((inc) => (
            <div key={inc.id} className="bg-[#1c2541] border border-[#3a506b] rounded-lg p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-xs font-mono text-cyan-400 font-bold">{inc.id}</span>
                    <SeverityBadge severity={inc.severity} />
                    <span className="text-xs font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                      {inc.status}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-100">{inc.title}</h2>
                </div>
                <div className="text-xs text-slate-400 text-left sm:text-right font-mono">
                  <div>Commander: {inc.commander}</div>
                  <div>Detected: {inc.detectedAt}</div>
                </div>
              </div>

              {/* Tasks Checklist Grid */}
              <div>
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  Operational Action Tasks
                </h3>
                <div className="space-y-2">
                  {inc.tasks.map((task) => (
                    <div key={task.id} className="bg-slate-900/80 p-3 rounded border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-cyan-400 font-bold">{task.id}</span>
                        <span className="text-slate-200">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">{task.assignedTo}</span>
                        <span className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                          task.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          task.status === 'IN_PROGRESS' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Designated Evacuation Shelters */}
              <div>
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Home className="w-4 h-4 text-emerald-400" />
                  Designated Relief Shelters & High-Ground Safe Points
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {inc.shelters.map((sh, idx) => (
                    <div key={idx} className="bg-slate-900/80 p-3 rounded border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-200">{sh.name}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">Capacity: {sh.capacity} persons</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[11px]">
                        {sh.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
