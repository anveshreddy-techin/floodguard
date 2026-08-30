'use client';

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
  COMPLETED: 'text-green-400 bg-green-500/10',
  IN_PROGRESS: 'text-blue-400 bg-blue-500/10',
  PENDING: 'text-gray-400 bg-gray-800',
};

export default function RecoveryPage() {
  const [activePhase, setActivePhase] = useState<Phase>('RESPONSE');
  const tasks = TASKS_BY_PHASE[activePhase];

  return (
    <div className="flex h-screen bg-[#0a0f1e] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 space-y-4">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-green-400" />
                Recovery Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Recovery phase tracking, damage assessment, task management, and lessons learned.
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Damage summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {DAMAGE_SUMMARY.map(d => (
              <div key={d.label} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                <p className={`text-xl font-bold ${d.color}`}>{d.value}</p>
                <p className="text-gray-500 text-xs">{d.label}</p>
              </div>
            ))}
          </div>

          {/* Phase selector */}
          <div className="flex gap-2 flex-wrap">
            {PHASES.map(phase => (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  activePhase === phase
                    ? 'bg-green-600/20 border-green-500/50 text-green-300'
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800'
                }`}
              >
                {PHASE_LABELS[phase]}
              </button>
            ))}
          </div>

          {/* Tasks */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg divide-y divide-gray-800">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full ${task.status === 'COMPLETED' ? 'bg-green-400' : task.status === 'IN_PROGRESS' ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{task.task}</p>
                  <p className="text-gray-500 text-xs">{task.category} · {task.owner}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${STATUS_STYLES[task.status]}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>

          {/* Lessons learned */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h2 className="text-white font-semibold flex items-center gap-2 mb-3">
              <ClipboardList className="w-4 h-4 text-amber-400" />
              Lessons Learned
            </h2>
            <div className="space-y-3">
              {LESSONS.map(l => (
                <div key={l.id} className="bg-gray-800/50 rounded p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white text-sm font-medium">{l.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${l.priority === 'HIGH' ? 'text-red-400 bg-red-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                      {l.priority}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">{l.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Export */}
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 text-sm transition-colors">
            <FileText className="w-4 h-4" />
            Export Incident & Recovery Report (DEMO)
          </button>

        </main>
      </div>
    </div>
  );
}
