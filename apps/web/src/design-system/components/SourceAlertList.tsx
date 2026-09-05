'use client';

import React from 'react';
import { AlertTriangle, Bell, Clock, MapPin, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface PublicAlertItem {
  id: string;
  title: string;
  hazardType: 'FLASH_FLOOD' | 'LANDSLIDE' | 'CLOUDBURST' | 'RIVER_SURGE' | 'DAM_RELEASE';
  severity: 'WARNING' | 'ALERT' | 'WATCH';
  location: string;
  state: string;
  district: string;
  issuedAt: string;
  sourceAgency: string;
  verificationStatus: 'VERIFIED_OFFICIAL' | 'MODEL_ESTIMATED' | 'CITIZEN_REPORTED';
  actionGuidance: string;
  authorityContact?: string;
}

export const SAMPLE_PUBLIC_ALERTS: PublicAlertItem[] = [
  {
    id: 'ALT-UK-2026-041',
    title: 'Flash Flood Runoff Advisory — Upper Alaknanda Basin',
    hazardType: 'FLASH_FLOOD',
    severity: 'WARNING',
    location: 'Joshimath to Vishnuprayag Stretch',
    state: 'Uttarakhand',
    district: 'Chamoli',
    issuedAt: '2026-09-05 14:15 IST',
    sourceAgency: 'IMD AWS Telemetry + FloodGuard Model v2.4',
    verificationStatus: 'MODEL_ESTIMATED',
    actionGuidance: 'Avoid riverbank trails, relocate vehicles from low-lying culverts, and monitor local village warning horns.',
    authorityContact: 'Chamoli DEOC: 01372-251437 / 1077',
  },
  {
    id: 'ALT-HP-2026-029',
    title: 'Rapid River Stage Surge — Beas River Upper Catchment',
    hazardType: 'RIVER_SURGE',
    severity: 'ALERT',
    location: 'Manali - Kullu Riparian Corridor',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    issuedAt: '2026-09-05 13:40 IST',
    sourceAgency: 'CWC Hydro Gauge Station + Open-Meteo QPF',
    verificationStatus: 'MODEL_ESTIMATED',
    actionGuidance: 'Stay clear of temporary river bridges and low ghats. Fishermen and riverside campsites must evacuate to higher tiers.',
    authorityContact: 'Kullu DEOC: 01902-225630 / 1077',
  },
  {
    id: 'ALT-AS-2026-088',
    title: 'Heavy Rainfall Inundation Precursor — Jia Bhareli Catchment',
    hazardType: 'CLOUDBURST',
    severity: 'WATCH',
    location: 'Sonitpur & Biswanath Foothills',
    state: 'Assam',
    district: 'Sonitpur',
    issuedAt: '2026-09-05 12:00 IST',
    sourceAgency: 'IMD Regional Radar & Satellite Cloudburst Screening',
    verificationStatus: 'VERIFIED_OFFICIAL',
    actionGuidance: 'Inspect village drainage chokepoints and prepare livestock for high-ground movement if rain exceeds 60mm/h.',
    authorityContact: 'Sonitpur Control Room: 03712-230978 / 1077',
  },
  {
    id: 'ALT-SK-2026-015',
    title: 'Slope Saturation & Debris Slide Watch — Teesta Basin',
    hazardType: 'LANDSLIDE',
    severity: 'ALERT',
    location: 'Chungthang - Dikchu Highway Corridor',
    state: 'Sikkim',
    district: 'North Sikkim (Mangan)',
    issuedAt: '2026-09-05 11:20 IST',
    sourceAgency: 'GSI Slope Susceptibility Map + Antecedent Rain Index',
    verificationStatus: 'MODEL_ESTIMATED',
    actionGuidance: 'Restricted vehicular movement along NH-10. Drivers must observe roadside spotters and avoid stoppage under steep scree cliffs.',
    authorityContact: 'Mangan DEOC: 03592-234244 / 1077',
  },
];

export const SourceAlertList: React.FC<{ filterState?: string }> = ({ filterState }) => {
  const alerts = filterState
    ? SAMPLE_PUBLIC_ALERTS.filter((a) => a.state.toLowerCase() === filterState.toLowerCase())
    : SAMPLE_PUBLIC_ALERTS;

  const getSeverityBadge = (severity: PublicAlertItem['severity']) => {
    switch (severity) {
      case 'WARNING':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'ALERT':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'WATCH':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getStatusBadge = (status: PublicAlertItem['verificationStatus']) => {
    switch (status) {
      case 'VERIFIED_OFFICIAL':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Official Verified
          </span>
        );
      case 'MODEL_ESTIMATED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-300 px-2 py-0.5 rounded font-mono">
            Model-Estimated
          </span>
        );
      case 'CITIZEN_REPORTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded">
            Citizen Unverified
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="p-6 bg-white border border-slate-300 rounded text-center text-slate-500 text-xs">
          No active public advisories or warnings registered for the selected region.
        </div>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white border border-slate-300 rounded shadow-xs p-4 transition hover:border-slate-400"
          >
            {/* Top row: ID, Severity, Status, Time */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5 mb-2.5">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${getSeverityBadge(alert.severity)}`}>
                  {alert.severity}
                </span>
                {getStatusBadge(alert.verificationStatus)}
                <span className="text-[11px] font-mono text-slate-500 font-semibold">
                  {alert.id}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{alert.issuedAt}</span>
              </div>
            </div>

            {/* Title & Location */}
            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              {alert.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 mb-3">
              <MapPin className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
              <span>{alert.location} ({alert.district}, {alert.state})</span>
            </div>

            {/* Action Guidance */}
            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-800 mb-3">
              <span className="font-semibold text-slate-900">Recommended Public Action: </span>
              <span>{alert.actionGuidance}</span>
            </div>

            {/* Source & Authority Contacts */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <div>
                <span className="font-semibold text-slate-700">Source: </span>
                <span>{alert.sourceAgency}</span>
              </div>
              {alert.authorityContact && (
                <div className="font-mono text-slate-700">
                  <span className="font-semibold">Local EOC: </span>
                  <span>{alert.authorityContact}</span>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
