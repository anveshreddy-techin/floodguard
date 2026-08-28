'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { Radio, Activity, Cpu, ShieldAlert, UserCheck, Compass, CheckCircle2, ArrowDown } from 'lucide-react';
import { RiskBadge, DataModeBadge } from '@/components/ui/Badges';
import { FlightEventType } from '@/types';

export default function FlightRecorderPage() {
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(1);

  const flightEvents = [
    {
      index: 1,
      type: 'DATA_ARRIVED' as FlightEventType,
      time: '13:45:00 UTC',
      title: 'AWS-001 High-Altitude Telemetry Ingested',
      desc: 'Ground AWS station reported 48.0mm in 3 hours on upper ridge slopes.',
      traceId: 'tr-flt-01',
      actor: 'IngestionPipeline',
      evidence: ['Rainfall rate: 16.0 mm/h', 'Barometric drop: -2.4 hPa', 'HMAC signature: valid'],
    },
    {
      index: 2,
      type: 'MODEL_RAN' as FlightEventType,
      time: '13:45:05 UTC',
      title: 'Hybrid Risk Engine Recomputed Composite Risk',
      desc: 'Multi-source fusion escalated composite score from 42.0 (MODERATE) to 68.5 (HIGH).',
      traceId: 'tr-flt-02',
      actor: 'RiskEngineDaemon',
      evidence: ['Precipitation factor: 75/100 (wt 0.35)', 'Soil Saturation: 82% (wt 0.25)', 'Terrain slope: 28° (wt 0.20)'],
    },
    {
      index: 3,
      type: 'ALERT_FIRED' as FlightEventType,
      time: '13:46:00 UTC',
      title: 'Automated Flash Flood Watch Dispatched',
      desc: 'Alert generated for Sunderbans Nagar micro-watershed. Warning pushed to Incident Command.',
      traceId: 'tr-flt-03',
      actor: 'AlertRouter',
      evidence: ['Severity: HIGH', 'Target: Sunderbans Nagar (demo-village-003)'],
    },
    {
      index: 4,
      type: 'GUIDANCE_ISSUED' as FlightEventType,
      time: '13:46:30 UTC',
      title: 'User Exposure Safety Guidance Evaluated',
      desc: 'Location engine detected demo user within 0.85 km of surge line. Generated Guidance Level 2.',
      traceId: 'tr-flt-04',
      actor: 'UserExposureEngine',
      evidence: ['Candidate route: North Ridge Elevated Trail', 'Blocked: Riverbed Bypass NH-58 Link'],
    },
    {
      index: 5,
      type: 'OPERATOR_ACTED' as FlightEventType,
      time: '13:50:12 UTC',
      title: 'Duty Officer Acknowledgment & Shelter Standby',
      desc: 'Operator confirmed alert; assigned Task T-1 to place Community High School shelter on standby.',
      traceId: 'tr-flt-05',
      actor: 'DutyOfficer@district.eoc',
      evidence: ['Action: ACKNOWLEDGE_AND_DISPATCH', 'Shelter: Community High School (Cap 450)'],
    },
  ];

  const selected = flightEvents[selectedEventIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[#0b132b]">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        <Sidebar activeTab="flight-recorder" />

        <main className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#3a506b] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold">
                  BLACK BOX AUDIT
                </span>
                <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-amber-400" />
                  FLOODGUARD FLIGHT RECORDER
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Synchronized audit stream of telemetry arrival, model execution, risk transitions, and operator interventions
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Chronological Step Sequence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              {flightEvents.map((evt, idx) => (
                <div
                  key={evt.index}
                  onClick={() => setSelectedEventIndex(idx)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition flex items-start gap-3.5 ${
                    selectedEventIndex === idx
                      ? 'bg-blue-600/20 border-cyan-400 text-slate-100 ring-1 ring-cyan-500'
                      : 'bg-[#1c2541] border-[#3a506b] text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-cyan-400 shrink-0">
                    {evt.index}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider">{evt.type}</span>
                      <span className="font-mono text-[10px] text-slate-400">{evt.time}</span>
                    </div>
                    <div className="font-bold text-slate-100 text-sm mt-0.5">{evt.title}</div>
                    <p className="text-slate-300 text-xs mt-1 leading-relaxed">{evt.desc}</p>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">Actor: {evt.actor} • Trace: {evt.traceId}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Event Deep Inspector */}
            <div className="bg-[#1c2541] border border-[#3a506b] rounded-xl p-5 space-y-4 text-xs h-fit sticky top-6">
              <div className="border-b border-slate-700 pb-3">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">FLIGHT RECORDER INSPECTOR</span>
                <h3 className="font-bold text-slate-100 text-sm mt-0.5">Event #{selected.index}: {selected.type}</h3>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{selected.time}</div>
              </div>

              <div className="space-y-2">
                <div className="text-slate-400 font-mono text-[10px] uppercase">Event Description:</div>
                <p className="text-slate-200 leading-relaxed bg-slate-900 p-2.5 rounded border border-slate-800">
                  {selected.desc}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-cyan-400 font-mono text-[10px] uppercase">Recorded Evidence Stack:</div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {selected.evidence.map((ev, i) => (
                    <div key={i} className="bg-slate-900/80 p-2 rounded border border-slate-800 text-slate-300 flex items-center gap-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 font-mono text-[10px] text-slate-400">
                Trace ID: <span className="text-slate-200">{selected.traceId}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
