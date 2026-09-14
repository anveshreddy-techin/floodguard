'use client';

import { RelatedAppsBar } from '@/components/ui/RelatedAppsBar';
import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import {
  RefreshCw, CheckCircle2, Clock, AlertTriangle,
  ClipboardList, Hammer, Zap, FileText, Users
} from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';

const PHASES = ['RESPONSE', 'EARLY_RECOVERY', 'RECOVERY', 'REHABILITATION'] as const;
type Phase = typeof PHASES[number];

const PHASE_LABELS: Record<Phase, string> = {
  RESPONSE: 'Immediate Response',
  EARLY_RECOVERY: 'Early Recovery',
  RECOVERY: 'Recovery',
  REHABILITATION: 'Rehabilitation',
};

const TASKS_BY_PHASE: Record<Phase, Array<{ id: string; category: string; task: string; status: string; owner: string }>> = {
  RESPONSE: [
    { id: 'T-001', category: 'Evacuation', task: 'Evacuate Raini Village high-risk zone', status: 'COMPLETED', owner: 'SDRF Alpha' },
    { id: 'T-002', category: 'Rescue', task: 'SAR sweep — Tapovan left bank', status: 'COMPLETED', owner: 'NDRF Team 4' },
    { id: 'T-003', category: 'Shelter', task: 'Open Community High School Shelter', status: 'COMPLETED', owner: 'District Admin' },
    { id: 'T-004', category: 'Sensor', task: 'Deploy emergency river radar at Tapovan', status: 'IN_PROGRESS', owner: 'FloodGuard IoT' },
  ],
  EARLY_RECOVERY: [
    { id: 'T-005', category: 'Infrastructure', task: 'Assess Raini suspension bridge damage', status: 'IN_PROGRESS', owner: 'NHAI Survey' },
    { id: 'T-006', category: 'Utility', task: 'Restore road access KM 0-4 Raini Road', status: 'PENDING', owner: 'PWD Chamoli' },
    { id: 'T-007', category: 'Sensor', task: 'Repair flood-damaged AWS at Joshimath', status: 'PENDING', owner: 'IMD Field Team' },
  ],
  RECOVERY: [
    { id: 'T-008', category: 'Infrastructure', task: 'Begin temporary bridge construction Raini', status: 'PENDING', owner: 'BRO' },
    { id: 'T-009', category: 'Shelter', task: 'Begin shelter closure process (residents return)', status: 'PENDING', owner: 'District Admin' },
    { id: 'T-010', category: 'Documentation', task: 'After-action review — NDMA report', status: 'PENDING', owner: 'SDMA Uttarakhand' },
  ],
  REHABILITATION: [
    { id: 'T-011', category: 'Infrastructure', task: 'Permanent road reconstruction KM 0-8', status: 'PENDING', owner: 'PWD Chamoli' },
    { id: 'T-012', category: 'Sensor', task: 'Expand sensor network — 4 additional nodes', status: 'PENDING', owner: 'FloodGuard IoT' },
    { id: 'T-013', category: 'Documentation', task: 'Lessons learned — SIH submission update', status: 'PENDING', owner: 'FloodGuard Team' },
  ],
};

const DAMAGE_SUMMARY = [
  { label: 'Roads Blocked', value: '3 sections', color: 'text-red-400' },
  { label: 'Bridges Damaged', value: '1 (Raini)', color: 'text-orange-400' },
  { label: 'Sensors Offline', value: '2 units', color: 'text-amber-400' },
  { label: 'Shelters Active', value: '1 (45 pax)', color: 'text-blue-400' },
  { label: 'Missing Persons', value: '2 (active search)', color: 'text-purple-400' },
  { label: 'Estimated Recovery', value: '14-21 days', color: 'text-gray-300' },
];

const LESSONS = [
  { id: 'LL-001', title: 'Upstream sensor gap exposed', detail: 'No gauge at Ronti nala — GLOF signature arrived at Tapovan only 12 min before impact. Recommend upstream sensor placement at high-risk glacier zones.', priority: 'HIGH' },
  { id: 'LL-002', title: 'Cross-agency notification delay', detail: 'NDRF alerting took 22 minutes from event detection. Recommend pre-authorized auto-dispatch for GLOF signature events above EXTREME threshold.', priority: 'MEDIUM' },
  { id: 'LL-003', title: 'Shelter capacity adequate, route not communicated', detail: 'Evacuation route to Community High School shelter was not pre-distributed to villages. Recommend pre-event pamphlet distribution.', priority: 'MEDIUM' },
];

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
  IN_PROGRESS: 'text-blue-700 bg-blue-50 border border-blue-200',
  PENDING: 'text-slate-600 bg-slate-100 border border-slate-200',
};

export default function RecoveryPage() {
  const [activePhase, setActivePhase] = useState<Phase>('RESPONSE');
  const tasks = TASKS_BY_PHASE[activePhase];

  return (
    <div className="flex flex-col h-screen bg-[#F0F4F8] text-slate-900 overflow-hidden font-sans select-none">
      <Header />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab="public-portal" />
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-6">
          <RelatedAppsBar activeAppId="recovery" />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 font-sans">
                <RefreshCw className="w-7 h-7 text-emerald-600" />
                Recovery & Rehabilitation Dashboard
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-sans">
                Post-disaster recovery phase tracking, damage assessment, inter-agency task management, and institutional lessons learned.
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Damage summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {DAMAGE_SUMMARY.map(d => (
              <div key={d.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <p className={`text-lg font-bold font-sans ${d.color.replace('-400', '-600')}`}>{d.value}</p>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1 font-sans">{d.label}</p>
              </div>
            ))}
          </div>

          {/* Phase selector */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-2">Disaster Phase:</span>
            {PHASES.map(phase => (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                  activePhase === phase
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {PHASE_LABELS[phase]}
              </button>
            ))}
          </div>

          {/* Tasks */}
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-sm overflow-hidden">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-3.5 p-4 transition-colors hover:bg-slate-50/70">
                <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${task.status === 'COMPLETED' ? 'bg-emerald-500' : task.status === 'IN_PROGRESS' ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-sm font-semibold font-sans">{task.task}</p>
                  <p className="text-slate-500 text-xs font-medium font-sans mt-0.5">{task.category} · <span className="text-slate-700">{task.owner}</span></p>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold font-sans flex-shrink-0 shadow-sm ${STATUS_STYLES[task.status]}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>

          {/* Lessons learned */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-slate-900 font-bold font-sans flex items-center gap-2 text-base">
              <ClipboardList className="w-5 h-5 text-amber-600" />
              Institutional Lessons Learned & Action Items
            </h2>
            <div className="space-y-3">
              {LESSONS.map(l => (
                <div key={l.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <p className="text-slate-900 text-sm font-bold font-sans">{l.title}</p>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold font-sans shadow-sm ${l.priority === 'HIGH' ? 'text-red-700 bg-red-50 border border-red-200' : 'text-amber-800 bg-amber-50 border border-amber-200'}`}>
                      {l.priority} PRIORITY
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs font-sans leading-relaxed">{l.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Export */}
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-sm shadow-sm transition-all active:scale-[0.99]">
            <FileText className="w-4 h-4 text-blue-600" />
            Export Incident & Recovery Report (PDF / DOCX Demo)
          </button>

        </main>
      </div>
    </div>
  );
}
