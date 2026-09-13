'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import {
  FileText, CheckCircle2, Clock, AlertTriangle,
  Radio, Users, MapPin, ChevronRight, ArrowRight,
  ShieldAlert, Zap
} from 'lucide-react';
import { useEnvironment } from '@/context/EnvironmentContext';
import { DataModeBadge } from '@/components/ui/Badges';

const STAGE_DATA = [
  { id: 'DETECTED',     color: '#3b82f6', desc: 'Hazard signature identified by sensor network' },
  { id: 'TRIAGE',       color: '#a855f7', desc: 'Automated severity classification in progress' },
  { id: 'INVESTIGATING',color: '#f59e0b', desc: 'Field team + copilot cross-verification' },
  { id: 'RESPONSE',     color: '#f97316', desc: 'Multi-agency resource deployment active' },
  { id: 'RECOVERY',     color: '#10b981', desc: 'Post-surge stabilization and relief operations' },
  { id: 'CLOSED',       color: '#6b7280', desc: 'Incident archived and ledger sealed' },
];

const INCIDENTS = [
  {
    id: 'INC-2026-001',
    title: 'Flash Surge — Sunderbans Nagar Alluvial Fan',
    severity: 'HIGH' as const,
    stage: 2, // INVESTIGATING
    location: 'Sunderbans Nagar (Alluvial Fan Base)',
    time: '2026-08-28 13:45 UTC',
    teams: ['Search & Rescue Alpha', 'NDRF Team 4', 'District EOC'],
    tasks: [
      { label: 'Activate Siren Network (Sector 4-7)', done: true },
      { label: 'Deploy NDRF rescue team to low culvert KM 0.6', done: true },
      { label: 'Notify District Collector + SP Office', done: false },
      { label: 'Coordinate helicopter reconnaissance', done: false },
    ],
    leadTime: '42 min',
  },
  {
    id: 'INC-2021-002',
    title: 'GLOF Surge — Tapovan Vishnugad Corridor',
    severity: 'EXTREME' as const,
    stage: 5, // CLOSED
    location: 'Tapovan Vishnugad, Chamoli District',
    time: '2021-02-07 05:15 UTC (Historical)',
    teams: ['NDRF Battalion 5', 'ITBP', 'SDRF'],
    tasks: [
      { label: 'Evacuate Tapovan project workers (140 persons)', done: true },
      { label: 'Shut downstream hydropower projects', done: true },
      { label: 'Establish coordination with ISRO SAR imagery', done: true },
      { label: 'Post-event geomorphic survey (NRSC)', done: true },
    ],
    leadTime: '10 min',
  },
];

export default function IncidentCommandPage() {
  const { setPage, setMode } = useEnvironment();
  const [selectedId, setSelectedId] = useState('INC-2026-001');
  const [incidents, setIncidents] = useState(INCIDENTS);

  useEffect(() => { setPage('incidents'); setMode('DEMO'); }, []);

  const toggleTask = (incId: string, taskIdx: number) => {
    setIncidents(prev => prev.map(inc =>
      inc.id !== incId ? inc :
      { ...inc, tasks: inc.tasks.map((t, i) => i === taskIdx ? { ...t, done: !t.done } : t) }
    ));
  };

  const incident = incidents.find(i => i.id === selectedId)!
  const stageColor = STAGE_DATA[incident.stage]?.color || '#6b7280';

  return (
    <div className="flex flex-col min-h-screen select-none bg-[#F0F4F8]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="incidents" />
        <main className="flex-1 p-3.5 sm:p-5 max-w-7xl mx-auto w-full pb-24 md:pb-6 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-300 text-[10px] font-mono font-bold">ACTIVE COMMAND</span>
                <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  INCIDENT COMMAND BOARD
                </h1>
              </div>
              <p className="text-xs text-slate-600 font-medium">Multi-agency coordination, lifecycle staging, and task dispatch</p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">

            {/* ── LEFT: Incident selector list ── */}
            <div className="lg:col-span-4 space-y-3">
              {INCIDENTS.map(inc => (
                <button
                  key={inc.id}
                  onClick={() => setSelectedId(inc.id)}
                  className={`w-full text-left p-4 rounded-2xl bg-white border transition-all shadow-sm ${
                    selectedId === inc.id ? 'border-2 border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-blue-700 font-bold">{inc.id}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      inc.severity === 'EXTREME' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>{inc.severity}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 leading-snug">{inc.title}</div>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 font-mono">
                    <Clock className="w-3 h-3" /> {inc.time}
                  </div>
                  {/* Mini stage progress */}
                  <div className="flex items-center gap-1 mt-2.5">
                    {STAGE_DATA.map((s, i) => (
                      <div key={i} className="flex-1 h-1.5 rounded-full" style={{
                        background: i <= inc.stage ? s.color : '#e2e8f0'
                      }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* ── RIGHT: Incident detail + full lifecycle ── */}
            <div className="lg:col-span-8 space-y-4">

              {/* Stage Pipeline — visual hero */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="text-[10px] font-mono text-blue-700 uppercase tracking-widest mb-4 font-bold">
                  INCIDENT LIFECYCLE PIPELINE
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {STAGE_DATA.map((s, i) => {
                    const isActive = i === incident.stage;
                    const isPast = i < incident.stage;
                    return (
                      <React.Fragment key={s.id}>
                        <div className={`flex flex-col items-center gap-1.5 min-w-[80px] transition-all`}>
                          <div className="relative">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-mono border-2 transition-all ${
                                isActive ? 'scale-110 shadow-md' : ''
                              }`}
                              style={{
                                borderColor: isPast || isActive ? s.color : '#cbd5e1',
                                backgroundColor: isPast ? `${s.color}20` : isActive ? `${s.color}` : '#f8fafc',
                                color: isActive ? '#ffffff' : isPast ? s.color : '#64748b',
                              }}
                            >
                              {isPast ? '✓' : i + 1}
                            </div>
                            {isActive && (
                              <div className="absolute inset-0 rounded-full animate-ping opacity-30"
                                style={{ backgroundColor: s.color }} />
                            )}
                          </div>
                          <div className={`text-[10px] font-mono font-bold text-center leading-tight ${
                            isActive ? 'text-slate-900 font-black' : isPast ? 'text-slate-600' : 'text-slate-400'
                          }`}>{s.id}</div>
                        </div>
                        {i < STAGE_DATA.length - 1 && (
                          <ChevronRight className="w-4 h-4 shrink-0 text-slate-300" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-600 mt-3 font-mono">
                  {STAGE_DATA[incident.stage]?.desc}
                </p>
              </div>

              {/* Incident details + tasks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">ACTIVE RESPONSE TEAMS</div>
                  {incident.teams.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-800 font-medium">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      {t}
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-3 text-[11px] font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Location:</span>
                      <span className="text-blue-700 font-bold">{incident.location}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 mt-1">
                      <span>Lead Time Advantage:</span>
                      <span className="text-emerald-700 font-bold">{incident.leadTime}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-sm">
                  <div className="text-[10px] font-mono text-blue-700 uppercase tracking-wider font-bold flex items-center justify-between">
                    <span>TASK CHECKLIST (INTERACTIVE)</span>
                    <span className="text-slate-500 font-semibold">{incident.tasks.filter(t=>t.done).length}/{incident.tasks.length} done</span>
                  </div>
                  {incident.tasks.map((task, i) => (
                    <button
                      key={i}
                      onClick={() => toggleTask(incident.id, i)}
                      className={`flex items-center gap-2.5 text-xs p-2.5 rounded-xl w-full text-left transition active:scale-98 cursor-pointer ${
                        task.done ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        task.done ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {task.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className={task.done ? 'line-through opacity-80' : 'font-medium'}>{task.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action bar with Stage Progression Buttons */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center gap-3 shadow-sm">
                <Link href="/safety" className="btn-danger px-4 py-2 rounded-xl text-white text-xs font-bold font-mono flex items-center gap-2 shadow-sm active:scale-95">
                  <ShieldAlert className="w-3.5 h-3.5" /> CITIZEN GUIDANCE HUD
                </Link>
                <Link href="/ledger" className="btn-primary px-4 py-2 rounded-xl text-white text-xs font-bold font-mono flex items-center gap-2 shadow-sm active:scale-95">
                  <FileText className="w-3.5 h-3.5" /> AUDIT TRAIL
                </Link>
                <Link href="/flight-recorder" className="px-4 py-2 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold font-mono flex items-center gap-2 active:scale-95">
                  <Radio className="w-3.5 h-3.5 text-blue-600" /> FLIGHT RECORDER
                </Link>

                {incident.stage < 5 && (
                  <button
                    onClick={() => setIncidents(prev => prev.map(inc =>
                      inc.id !== selectedId ? inc : { ...inc, stage: Math.min(5, inc.stage + 1) }
                    ))}
                    className="ml-auto btn-success px-4 py-2 rounded-xl text-white text-xs font-bold font-mono flex items-center gap-2 shadow-sm active:scale-95 transition"
                  >
                    <ArrowRight className="w-3.5 h-3.5" /> ADVANCE STAGE
                  </button>
                )}
                {incident.stage > 0 && (
                  <button
                    onClick={() => setIncidents(prev => prev.map(inc =>
                      inc.id !== selectedId ? inc : { ...inc, stage: Math.max(0, inc.stage - 1) }
                    ))}
                    className={`px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold font-mono flex items-center gap-2 active:scale-95 transition hover:text-slate-900 ${incident.stage >= 5 ? 'ml-auto' : ''}`}
                  >
                    PREV STAGE
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
