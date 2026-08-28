'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  Radio, 
  ArrowRight,
  Send,
  Plus
} from 'lucide-react';
import { SeverityBadge, DataModeBadge } from '@/components/ui/Badges';
import { AlertSeverity } from '@/types';

export default function IncidentCommandPage() {
  const [selectedIncidentIndex, setSelectedIncidentIndex] = useState<number>(0);

  const incidents = [
    {
      id: 'INC-2026-001',
      title: 'Flash Flood Watch & Stage Surge (Sunderbans Basin)',
      severity: 'HIGH' as AlertSeverity,
      stage: 'ACTIVE_RESPONSE',
      location: 'Sunderbans Nagar (demo-village-003)',
      declaredAt: '13:46:00 UTC (42 min ago)',
      commander: 'Duty Officer Sharma (District EOC)',
      desc: 'Rapid river stage rise (+0.40m/h) combined with 48mm rainfall on pre-saturated slopes. Active mitigation in progress.',
      stages: ['DETECTED', 'TRIAGED', 'INVESTIGATING', 'ACTIVE RESPONSE', 'RECOVERY', 'CLOSED'],
      tasks: [
        { id: 'TSK-01', title: 'Place Community High School Shelter on Standby', assignedTo: 'Shelter Coordinator', status: 'COMPLETED' },
        { id: 'TSK-02', title: 'Dispatch Road Barrier to Riverbed Bypass KM 0.6', assignedTo: 'Traffic Police Unit 4', status: 'IN_PROGRESS' },
        { id: 'TSK-03', title: 'Broadcast Vernacular Audio Sirens (Level 2)', assignedTo: 'Public Alert System', status: 'COMPLETED' },
      ],
    },
    {
      id: 'INC-2026-002',
      title: 'Culvert Debris Inundation & Culvert Jam',
      severity: 'MODERATE' as AlertSeverity,
      stage: 'TRIAGED',
      location: 'Bridge Culvert KM 0.6',
      declaredAt: '13:55:00 UTC (33 min ago)',
      commander: 'Field Officer Rawat',
      desc: 'Colluvial gravel and tree branch blockage causing backwater ponding on secondary road.',
      stages: ['DETECTED', 'TRIAGED', 'INVESTIGATING', 'ACTIVE RESPONSE', 'RECOVERY', 'CLOSED'],
      tasks: [
        { id: 'TSK-04', title: 'Deploy Heavy Earthmover (JCB) to Culvert Inlet', assignedTo: 'PWD Emergency Works', status: 'DISPATCHED' },
      ],
    },
  ];

  const current = incidents[selectedIncidentIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[#070d1e] text-slate-100 select-none">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="incidents" />

        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#223354] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono font-bold">
                  OPERATIONAL COMMAND
                </span>
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  INCIDENT COMMAND OPERATIONS BOARD
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Emergency response coordination, multi-agency task assignment, and lifecycle stage tracking
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Master 2-Column Command Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Incident Feed (4 Cols) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                ACTIVE INCIDENTS ({incidents.length})
              </div>

              {incidents.map((inc, idx) => {
                const isSelected = selectedIncidentIndex === idx;
                return (
                  <button
                    key={inc.id}
                    onClick={() => setSelectedIncidentIndex(idx)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all space-y-2 ${
                      isSelected
                        ? 'bg-blue-600/30 border-cyan-400 text-slate-100 ring-2 ring-cyan-500 shadow-2xl'
                        : 'bg-[#0e1630] border-[#223354] text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-cyan-400 text-[10px] font-bold">{inc.id}</span>
                      <SeverityBadge severity={inc.severity} />
                    </div>
                    <div className="font-bold text-slate-100 text-xs leading-snug">{inc.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{inc.location}</div>
                  </button>
                );
              })}
            </div>

            {/* Right: Active Incident Operations Detail (8 Cols) */}
            <div className="lg:col-span-8 bg-[#0e1630] border border-[#223354] rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{current.id}</span>
                  <h2 className="text-base font-bold text-slate-100 mt-0.5">{current.title}</h2>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Declared: {current.declaredAt} • Commander: {current.commander}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-blue-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold">
                  STAGE: {current.stage}
                </span>
              </div>

              {/* 6-Stage Visual Progression Stepper */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase">LIFECYCLE PROGRESSION</div>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 text-center font-mono text-[10px]">
                  {current.stages.map((stg, i) => {
                    const isPassed = i <= 3;
                    const isCurrent = i === 3;
                    return (
                      <div
                        key={i}
                        className={`p-2 rounded-lg border ${
                          isCurrent
                            ? 'bg-blue-600 text-white font-bold border-cyan-400 ring-1 ring-cyan-400 animate-pulse'
                            : isPassed
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                            : 'bg-slate-900/60 text-slate-500 border-slate-800'
                        }`}
                      >
                        {stg}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Tasks Assigned */}
              <div className="space-y-3">
                <div className="font-mono font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>DISPATCHED OPERATIONAL TASKS</span>
                  <span className="text-[10px] text-cyan-400">3 TOTAL</span>
                </div>

                <div className="space-y-2">
                  {current.tasks.map((tsk) => (
                    <div key={tsk.id} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-100 text-xs">{tsk.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">Assigned to: {tsk.assignedTo}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        tsk.status === 'COMPLETED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                      }`}>
                        {tsk.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
