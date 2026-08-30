'use client';

import React from 'react';
import { Users, CheckCircle2, XCircle, AlertTriangle, Radio, ShieldCheck, MapPin, Clock, FileText } from 'lucide-react';

interface CommunityReportCardProps {
  reports: any[];
  onVerify?: (reportId: string, status: string) => void;
  isOperator?: boolean;
}

export const CommunityReportCard: React.FC<CommunityReportCardProps> = ({
  reports = [],
  onVerify,
  isOperator = false,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED_BY_AUTHORITY':
        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">VERIFIED BY AUTHORITY</span>;
      case 'CORROBORATED':
        return <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">CORROBORATED BY SENSORS</span>;
      case 'NEEDS_REVIEW':
        return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">NEEDS REVIEW</span>;
      case 'REJECTED':
        return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">REJECTED</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold">UNVERIFIED COMMUNITY REPORT</span>;
    }
  };

  return (
    <div className="fp fp-operational p-4 sm:p-5 rounded-2xl space-y-4 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-black font-mono text-white tracking-wide uppercase">
            COMMUNITY & FIELD HAZARD INTELLIGENCE STREAM ({reports.length})
          </h3>
        </div>
        <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
          Unverified reports require sensor / authority confirmation
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-6 text-slate-500 font-mono text-xs">
          No field hazard reports filed for this sector in the current window.
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {reports.map((rep) => (
            <div
              key={rep.report_id}
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5 hover:border-slate-700 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-300 uppercase">
                    {rep.report_type.replace(/_/g, ' ')}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    rep.severity === 'HIGH' || rep.severity === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {rep.severity} SEVERITY
                  </span>
                </div>

                {getStatusBadge(rep.verification_status)}
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {rep.description}
              </p>

              {/* Sensor Corroboration & Operator Notes Strip */}
              {(rep.corroborating_sensor_id || rep.operator_notes) && (
                <div className="p-2 rounded-lg bg-slate-950/90 border border-cyan-900/60 text-[11px] font-mono space-y-1">
                  {rep.corroborating_sensor_id && (
                    <div className="text-cyan-300 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-cyan-400" />
                      <span>Corroborating Telemetry: <strong>{rep.corroborating_sensor_id}</strong> ({rep.corroborating_weather_signal})</span>
                    </div>
                  )}
                  {rep.operator_notes && (
                    <div className="text-slate-300 flex items-start gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Review: {rep.operator_notes}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Footer & Verification Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {rep.location?.location_name || `${rep.location?.district}, ${rep.location?.state}`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {new Date(rep.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span>Reporter: {rep.is_anonymous ? 'Anonymous Citizen' : rep.reporter_contact_masked}</span>
                </div>

                {/* Operator Actions (Verification / Rejection) */}
                {isOperator && rep.verification_status === 'UNVERIFIED' && onVerify && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onVerify(rep.report_id, 'CORROBORATED')}
                      className="px-2 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-600 text-emerald-300 font-bold text-[10px] flex items-center gap-1 active:scale-95 transition"
                    >
                      <CheckCircle2 className="w-3 h-3" /> CORROBORATE
                    </button>
                    <button
                      onClick={() => onVerify(rep.report_id, 'REJECTED')}
                      className="px-2 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-600 text-rose-300 font-bold text-[10px] flex items-center gap-1 active:scale-95 transition"
                    >
                      <XCircle className="w-3 h-3" /> REJECT
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
