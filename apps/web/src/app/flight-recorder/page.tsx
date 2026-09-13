'use client';

import { RelatedAppsBar } from '@/components/ui/RelatedAppsBar';
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
import { Radio, Activity, Cpu, ShieldAlert, UserCheck, Compass, CheckCircle2, ArrowDown, Fingerprint } from 'lucide-react';
import { DataModeBadge } from '@/components/ui/Badges';
import { FlightEventType } from '@/types';

export default function FlightRecorderPage() {
  const { setPage, setMode } = useEnvironment();
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(1);

  useEffect(() => {
    setPage('flight-recorder');
    setMode('DEMO');
  }, [setPage, setMode]);

  const flightEvents = [
    {
      index: 1,
      type: 'DATA_ARRIVED' as FlightEventType,
      time: '13:45:00 UTC',
      title: 'AWS-001 High-Altitude Telemetry Ingested',
      desc: 'Ground AWS station reported 48.0mm in 3 hours on upper ridge slopes.',
      traceId: 'tr-flt-01',
      actor: 'IngestionPipeline',
      color: '#38bdf8',
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
      color: '#a855f7',
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
      color: '#f97316',
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
      color: '#ef4444',
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
      color: '#10b981',
      evidence: ['Action: ACKNOWLEDGE_AND_DISPATCH', 'Shelter: Community High School (Cap 450)'],
    },
  ];

  const selected = flightEvents[selectedEventIndex];

  return (
    <div className="flex flex-col min-h-screen select-none bg-[#F0F4F8] text-slate-900">
      <Header dataMode="DEMO" systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0">
        <Sidebar activeTab="flight-recorder" />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-6xl mx-auto space-y-5 pb-24 md:pb-6">
          <RelatedAppsBar activeAppId="flight-recorder" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300 text-xs font-semibold">BLACK BOX AUDIT</span>
                <h1 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-amber-600" />
                  FLOODGUARD FLIGHT RECORDER
                </h1>
              </div>
              <p className="text-sm text-slate-600 mt-1 font-sans">
                Synchronized audit stream of telemetry arrival, model execution, risk transitions, and operator interventions
              </p>
            </div>
            <DataModeBadge mode="DEMO" />
          </div>

          {/* Chronological Step Sequence */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-3">
              {flightEvents.map((evt, idx) => {
                const isSelected = selectedEventIndex === idx;
                return (
                  <div
                    key={evt.index}
                    onClick={() => setSelectedEventIndex(idx)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 flex items-start gap-3.5 border ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-400/30 bg-blue-50/40 shadow-sm scale-[1.01]'
                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0"
                      style={{
                        backgroundColor: `${evt.color}20`,
                        color: evt.color,
                        border: `1px solid ${evt.color}60`
                      }}
                    >
                      {evt.index}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans font-bold uppercase" style={{ color: evt.color }}>
                          {evt.type}
                        </span>
                        <span className="text-xs font-mono text-slate-500">{evt.time}</span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs font-sans leading-snug">{evt.title}</div>
                      <div className="text-xs text-slate-600 font-sans line-clamp-2 leading-relaxed">{evt.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Trace Details */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm animate-slide-up">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-xs font-sans text-amber-700 uppercase tracking-wider font-bold">
                    EVENT RECORD #{selected.index}
                  </span>
                  <h3 className="text-base font-bold font-sans text-slate-900 mt-1">{selected.title}</h3>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500">Timestamp:</span>
                    <span className="font-mono font-bold text-blue-700">{selected.time}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500">Trace ID:</span>
                    <span className="font-mono text-purple-700 font-bold">{selected.traceId}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500">Executing Actor:</span>
                    <span className="text-slate-900 font-medium">{selected.actor}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-xs font-sans font-bold text-slate-600 uppercase tracking-wider block">
                    CRYPTOGRAPHIC EVIDENCE INPUTS
                  </span>
                  <div className="space-y-1.5 text-xs font-sans">
                    {selected.evidence.map((ev, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
