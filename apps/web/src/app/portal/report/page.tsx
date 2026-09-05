'use client';

import React from 'react';
import { ReportIncidentForm, EmergencyPanel } from '@/design-system/components';
import { Send, AlertTriangle, ShieldCheck, HelpCircle, PhoneCall } from 'lucide-react';

export default function PublicReportIncidentPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded p-5 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3 mb-3">
          <Send className="w-5 h-5 text-blue-700" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Submit Citizen Disaster Observation / Incident Report
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Public crowd-sourced telemetry and damage observation submission portal for Smart India Hackathon (SIH26192).
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Ground-truth field reports filed by local residents, panchayat sarpanches, and transport drivers provide indispensable early indicators of stream surges, debris logjams, and culvert breaches in mountain drainages where automated rain gauges may be sparse.
        </p>
      </div>

      {/* Main Reporting Form Component */}
      <ReportIncidentForm />

      {/* Verification Process FAQ */}
      <div className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-4 text-xs text-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <HelpCircle className="w-4 h-4 text-blue-700" />
          <h3 className="font-bold text-slate-900 uppercase tracking-wide">
            How Are Citizen Reports Processed in FloodGuard AI?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1">
            <span className="font-bold text-slate-900">1. Instant Audit Queuing</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Submissions receive a tamper-evident tracking receipt code and enter the situational triage queue labeled as <strong>UNVERIFIED CITIZEN REPORT</strong>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1">
            <span className="font-bold text-slate-900">2. Spatial Corroboration</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Our automated engine cross-checks the reported location against adjacent AWS rainfall radar clusters and CWC river stage gauge trends.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1">
            <span className="font-bold text-slate-900">3. EOC Telephonic Triage</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              District Emergency Operation Centre (DEOC) personnel verify high-severity reports via call-back before flagging them into the operational responder ledger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
