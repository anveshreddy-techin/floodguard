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
        return <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">VERIFIED BY AUTHORITY</span>;
      case 'CORROBORATED':
        return <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold">CORROBORATED BY SENSORS</span>;
      case 'NEEDS_REVIEW':
        return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold">NEEDS REVIEW</span>;
      case 'REJECTED':
        return <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-300 text-[10px] font-bold">REJECTED</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-bold">UNVERIFIED COMMUNITY REPORT</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm p-4 sm:p-5 rounded-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black font-mono text-slate-900 tracking-wide uppercase">
            COMMUNITY & FIELD HAZARD INTELLIGENCE STREAM ({reports.length})
          </h3>
        </div>
        <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300 w-fit">
          Unverified reports require sensor / authority confirmation
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-8 text-slate-500 font-mono text-xs">
          No field hazard reports filed for this sector in the current window.
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {reports.map((rep) => (
            <div
              key={rep.report_id}
              className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200 space-y-2.5 hover:border-blue-300 hover:shadow-xs transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-blue-800 uppercase">
                    {rep.report_type.replace(/_/g, ' ')}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                    rep.severity === 'HIGH' || rep.severity === 'CRITICAL'
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : 'bg-slate-200 text-slate-800 border-slate-300'
                  }`}>
                    {rep.severity} SEVERITY
                  </span>
                </div>

                {getStatusBadge(rep.verification_status)}
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-sans font-medium">
                {rep.description}
              </p>

              {/* Sensor Corroboration & Operator Notes Strip */}
              {(rep.corroborating_sensor_id || rep.operator_notes) && (
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono space-y-1 shadow-xs">
                  {rep.corroborating_sensor_id && (
                    <div className="text-blue-800 flex items-center gap-1.5 font-bold">
                      <Radio className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Corroborating Telemetry: <span className="text-slate-900">{rep.corroborating_sensor_id}</span> ({rep.corroborating_weather_signal})</span>
                    </div>
                  )}
                  {rep.operator_notes && (
                    <div className="text-slate-700 flex items-start gap-1.5 font-sans">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Review: <strong className="text-slate-900">{rep.operator_notes}</strong></span>
                    </div>
                  )}
                </div>
              )}

              {/* Footer & Verification Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {rep.location?.location_name || `${rep.location?.district}, ${rep.location?.state}`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {new Date(rep.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span>Reporter: {rep.is_anonymous ? 'Anonymous Citizen' : rep.reporter_contact_masked}</span>
                </div>

                {/* Operator Actions (Verification / Rejection) */}
                {isOperator && rep.verification_status === 'UNVERIFIED' && onVerify && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onVerify(rep.report_id, 'CORROBORATED')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 active:scale-95 transition shadow-xs"
                    >
                      <CheckCircle2 className="w-3 h-3" /> CORROBORATE
                    </button>
                    <button
                      onClick={() => onVerify(rep.report_id, 'REJECTED')}
                      className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] flex items-center gap-1 active:scale-95 transition shadow-xs"
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
