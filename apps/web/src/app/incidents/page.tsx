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
    <div className="flex flex-col min-h-screen">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="incidents" />
        <main className="flex-1 p-3.5 sm:p-5 max-w-7xl mx-auto w-full pb-24 md:pb-6 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="chip chip-live">ACTIVE COMMAND</span>
                <h1 className="text-xl font-black text-gradient-cyan flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  INCIDENT COMMAND BOARD
                </h1>
              </div>
              <p className="text-xs text-slate-400">Multi-agency coordination, lifecycle staging, and task dispatch</p>
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
                  className={`w-full text-left p-4 rounded-2xl fp transition-all animate-slide-up ${
                    selectedId === inc.id ? 'fp-operational ring-1 ring-cyan-500/40' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-cyan-400 font-bold">{inc.id}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      inc.severity === 'EXTREME' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-orange-950 text-orange-300 border border-orange-800'
                    }`}>{inc.severity}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-100 leading-snug">{inc.title}</div>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3" /> {inc.time}
                  </div>
                  {/* Mini stage progress */}
                  <div className="flex items-center gap-1 mt-2.5">
                    {STAGE_DATA.map((s, i) => (
                      <div key={i} className="flex-1 h-1 rounded-full" style={{
                        background: i <= inc.stage ? s.color : 'rgba(255,255,255,0.06)'
                      }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* ── RIGHT: Incident detail + full lifecycle ── */}
            <div className="lg:col-span-8 space-y-4">

              {/* Stage Pipeline — visual hero */}
              <div className="fp fp-operational rounded-2xl p-5 animate-slide-up">
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-4 font-bold">
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
                                isActive ? 'scale-110' : ''
                              }`}
                              style={{
                                borderColor: isPast || isActive ? s.color : 'rgba(255,255,255,0.08)',
                                backgroundColor: isPast ? `${s.color}30` : isActive ? `${s.color}40` : 'rgba(255,255,255,0.03)',
                                color: isPast || isActive ? s.color : '#64748b',
                                boxShadow: isActive ? `0 0 20px ${s.color}60` : 'none',
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
                            isActive ? 'text-white' : isPast ? 'text-slate-400' : 'text-slate-600'
                          }`}>{s.id}</div>
                        </div>
                        {i < STAGE_DATA.length - 1 && (
                          <ChevronRight className="w-4 h-4 shrink-0 text-slate-700" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-400 mt-3 font-mono">
                  {STAGE_DATA[incident.stage]?.desc}
                </p>
              </div>

              {/* Incident details + tasks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="fp rounded-2xl p-4 space-y-3 animate-slide-up">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">ACTIVE RESPONSE TEAMS</div>
                  {incident.teams.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {t}
                    </div>
                  ))}
                  <div className="border-t border-slate-800 pt-3 text-[11px] font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Location:</span>
                      <span className="text-cyan-300 font-bold">{incident.location}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 mt-1">
                      <span>Lead Time Advantage:</span>
                      <span className="text-emerald-400 font-bold">{incident.leadTime}</span>
                    </div>
                  </div>
                </div>

                <div className="fp fp-operational rounded-2xl p-4 space-y-2.5 animate-slide-up">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold flex items-center justify-between">
                    <span>TASK CHECKLIST (INTERACTIVE)</span>
                    <span className="text-slate-400">{incident.tasks.filter(t=>t.done).length}/{incident.tasks.length} done</span>
                  </div>
                  {incident.tasks.map((task, i) => (
                    <button
                      key={i}
                      onClick={() => toggleTask(incident.id, i)}
                      className={`flex items-center gap-2.5 text-xs p-2.5 rounded-xl w-full text-left transition active:scale-98 cursor-pointer ${
                        task.done ? 'bg-emerald-950/20 text-emerald-300 border border-emerald-800/40' : 'bg-slate-900/60 text-slate-200 hover:text-white hover:bg-slate-800/60 border border-slate-800'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        task.done ? 'border-emerald-500 bg-emerald-900/60' : 'border-slate-600 bg-slate-800'
                      }`}>
                        {task.done && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      </div>
                      <span className={task.done ? 'line-through opacity-70' : 'font-medium'}>{task.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action bar with Stage Progression Buttons */}
              <div className="fp rounded-2xl p-4 flex flex-wrap items-center gap-3">
                <Link href="/safety" className="btn-danger px-4 py-2 rounded-xl text-white text-xs font-bold font-mono flex items-center gap-2 shadow-lg active:scale-95">
                  <ShieldAlert className="w-3.5 h-3.5" /> CITIZEN GUIDANCE HUD
                </Link>
                <Link href="/ledger" className="btn-primary px-4 py-2 rounded-xl text-white text-xs font-bold font-mono flex items-center gap-2 shadow-lg active:scale-95">
                  <FileText className="w-3.5 h-3.5" /> AUDIT TRAIL
                </Link>
                <Link href="/flight-recorder" className="btn-ghost px-4 py-2 rounded-xl text-slate-300 text-xs font-bold font-mono flex items-center gap-2 hover:text-white active:scale-95">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" /> FLIGHT RECORDER
                </Link>

                {incident.stage < 5 && (
                  <button
                    onClick={() => setIncidents(prev => prev.map(inc =>
                      inc.id !== selectedId ? inc : { ...inc, stage: Math.min(5, inc.stage + 1) }
                    ))}
                    className="ml-auto btn-primary px-4 py-2 rounded-xl text-white text-xs font-bold font-mono flex items-center gap-2 shadow-lg active:scale-95 transition"
                  >
                    <ArrowRight className="w-3.5 h-3.5" /> ADVANCE STAGE
                  </button>
                )}
                {incident.stage > 0 && (
                  <button
                    onClick={() => setIncidents(prev => prev.map(inc =>
                      inc.id !== selectedId ? inc : { ...inc, stage: Math.max(0, inc.stage - 1) }
                    ))}
                    className={`fp px-3 py-2 rounded-xl text-slate-400 text-xs font-bold font-mono flex items-center gap-2 active:scale-95 transition hover:text-slate-200 ${incident.stage >= 5 ? 'ml-auto' : ''}`}
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
