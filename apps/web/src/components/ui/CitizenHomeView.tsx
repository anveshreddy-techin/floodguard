'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert, MapPin, Phone, CloudRain, AlertTriangle,
  Navigation, Home, Bell, CheckCircle2, Siren,
  HeartPulse, Truck, Flame, Info, ChevronRight,
  Wind, Droplets, Thermometer, Eye, Compass
} from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { useAdaptive } from '@/context/AdaptiveContext';
import { getRolePermissions } from '@/lib/rolePermissions';

const EMERGENCY_CONTACTS = [
  { name: 'NDMA / NDRF Helpline', number: '1078', icon: ShieldAlert, color: 'bg-red-600', label: 'TOLL-FREE 24/7' },
  { name: 'Ambulance', number: '108', icon: HeartPulse, color: 'bg-rose-500', label: 'MEDICAL' },
  { name: 'Fire & Rescue', number: '101', icon: Flame, color: 'bg-orange-500', label: 'RESCUE' },
  { name: 'Police Control Room', number: '100', icon: Truck, color: 'bg-blue-600', label: 'LAW & ORDER' },
];

const MOCK_ALERTS = [
  { id: 1, level: 'RED', title: 'Flash Flood Warning', area: 'Chamoli District', time: '12 min ago', detail: 'Water level rising rapidly. Move to higher ground immediately.' },
  { id: 2, level: 'ORANGE', title: 'Heavy Rainfall Advisory', area: 'Alaknanda Basin', time: '1 hr ago', detail: 'Expected 80–120mm rain in next 6 hours. Avoid river banks.' },
  { id: 3, level: 'YELLOW', title: 'Landslide Watch', area: 'NH-7 Chamoli', time: '3 hr ago', detail: 'Debris possible on mountain roads. Drive with caution.' },
];

const NEARBY_SHELTERS = [
  { name: 'Govt. Higher Secondary School', distance: '0.8 km', capacity: '350 people', status: 'OPEN', direction: 'North' },
  { name: 'Community Hall, Gopeshwar', distance: '1.4 km', capacity: '200 people', status: 'OPEN', direction: 'East' },
  { name: 'NDRF Relief Camp, Pipalkoti', distance: '3.2 km', capacity: '500 people', status: 'OPEN', direction: 'South' },
];

export const CitizenHomeView: React.FC<{ onViewAll?: () => void }> = ({ onViewAll }) => {
  const { selectedLocation } = useLocation();
  const { role } = useAdaptive();
  const perms = getRolePermissions(role);
  const [reportSent, setReportSent] = useState(false);
  const [reportText, setReportText] = useState('');

  const riskLevel = selectedLocation.riskLevel || 'HIGH';
  const riskScore = selectedLocation.riskScore || 82;

  const riskConfig = {
    HIGH: { color: 'bg-red-600', textColor: 'text-red-700', bgLight: 'bg-red-50', border: 'border-red-300', label: 'HIGH RISK', advice: 'Be ready to evacuate immediately if authorities advise. Keep emergency bag ready.' },
    MEDIUM: { color: 'bg-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-50', border: 'border-amber-300', label: 'MEDIUM RISK', advice: 'Stay alert. Monitor alerts and avoid low-lying areas near rivers.' },
    LOW: { color: 'bg-emerald-600', textColor: 'text-emerald-700', bgLight: 'bg-emerald-50', border: 'border-emerald-300', label: 'LOW RISK', advice: 'Conditions are currently safe. Stay informed via local authorities.' },
  };
  const risk = riskConfig[riskLevel as keyof typeof riskConfig] || riskConfig.HIGH;

  const handleReport = () => {
    if (!reportText.trim()) return;
    setReportSent(true);
    setReportText('');
    setTimeout(() => setReportSent(false), 4000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 min-h-0">
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4 pb-24 md:pb-6">

        {/* ── Welcome Banner ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{perms.emoji}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{perms.label}</span>
              </div>
              <h1 className="text-lg font-black text-slate-900">My Safety Dashboard</h1>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="font-medium truncate">{selectedLocation.name}</span>
              </div>
            </div>
            {onViewAll && (
              <button
                onClick={onViewAll}
                className="shrink-0 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition"
              >
                <Eye className="w-3 h-3" />
                View All
              </button>
            )}
          </div>
        </div>

        {/* ── My Area Risk Status ── */}
        <div className={`rounded-2xl border ${risk.border} ${risk.bgLight} p-4`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className={`w-5 h-5 ${risk.textColor}`} />
              <span className="text-sm font-black text-slate-900">Your Area Risk Level</span>
            </div>
            <span className={`${risk.color} text-white text-xs font-black px-3 py-1 rounded-full shadow-sm`}>
              {risk.label}
            </span>
          </div>
          <div className="w-full bg-white/70 rounded-full h-2.5 mb-2 overflow-hidden">
            <div
              className={`h-2.5 rounded-full ${risk.color} transition-all`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
          <p className="text-sm text-slate-700 font-medium">{risk.advice}</p>
        </div>

        {/* ── Active Alerts ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-red-600" />
              <span className="text-sm font-black text-slate-900">Active Alerts</span>
            </div>
            <Link href="/portal/alerts" className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5 hover:underline">
              See all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_ALERTS.map((alert) => {
              const colors = {
                RED: 'bg-red-100 text-red-800 border-red-200',
                ORANGE: 'bg-orange-100 text-orange-800 border-orange-200',
                YELLOW: 'bg-amber-100 text-amber-800 border-amber-200',
              };
              return (
                <div key={alert.id} className="px-4 py-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${
                      alert.level === 'RED' ? 'text-red-600' : alert.level === 'ORANGE' ? 'text-orange-500' : 'text-amber-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-sm font-bold text-slate-900">{alert.title}</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${colors[alert.level as keyof typeof colors]}`}>
                          {alert.level}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mb-1">{alert.area} • {alert.time}</div>
                      <p className="text-xs text-slate-700">{alert.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Weather Summary ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <CloudRain className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-black text-slate-900">Current Weather</span>
            <span className="ml-auto text-[10px] text-slate-500 font-medium">Updated 5 min ago</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { icon: Droplets, label: 'Rainfall', value: '48 mm/hr', color: 'text-blue-600' },
              { icon: Wind, label: 'Wind', value: '32 km/h NE', color: 'text-slate-600' },
              { icon: Thermometer, label: 'Temperature', value: '18°C', color: 'text-orange-500' },
              { icon: CloudRain, label: 'Humidity', value: '94%', color: 'text-teal-600' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                <Icon className={`w-4 h-4 ${color} mb-1`} />
                <div className="text-[10px] text-slate-500 font-medium">{label}</div>
                <div className="text-xs font-black text-slate-900">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Nearest Shelters ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
            <Home className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-black text-slate-900">Nearest Evacuation Shelters</span>
          </div>
          <div className="divide-y divide-slate-100">
            {NEARBY_SHELTERS.map((shelter, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <Navigation className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{shelter.name}</div>
                    <div className="text-xs text-slate-500">{shelter.distance} · {shelter.direction} · {shelter.capacity}</div>
                  </div>
                </div>
                <span className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {shelter.status}
                </span>
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100">
            <Link href="/safety" className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline">
              <Compass className="w-3.5 h-3.5" />
              Open full Evacuation & Safety Map
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ── Emergency Contacts ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-600" />
            <span className="text-sm font-black text-slate-900">Emergency Contacts</span>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {EMERGENCY_CONTACTS.map((c) => {
              const Icon = c.icon;
              return (
                <a
                  key={c.number}
                  href={`tel:${c.number}`}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-98 transition group"
                >
                  <div className={`w-9 h-9 rounded-xl ${c.color} flex items-center justify-center shrink-0 shadow-sm`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition">{c.number}</div>
                    <div className="text-[10px] text-slate-500 truncate">{c.name}</div>
                    <div className="text-[9px] font-bold text-slate-400">{c.label}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* ── Report an Incident ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-black text-slate-900">Report an Incident</span>
          </div>
          {reportSent ? (
            <div className="flex items-center gap-2 py-3 px-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-800">Report submitted. Authorities have been notified.</span>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Describe what you see — flooded road, damaged bridge, people stranded..."
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-slate-800 placeholder:text-slate-400 bg-slate-50"
                rows={3}
              />
              <button
                onClick={handleReport}
                disabled={!reportText.trim()}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 active:scale-99 transition shadow-sm"
              >
                Submit Report
              </button>
            </div>
          )}
        </div>

        {/* ── Info Banner ── */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-3.5 flex items-start gap-2.5">
          <Siren className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 font-medium leading-relaxed">
            <strong>Stay tuned to local radio (AIR) and SMS alerts.</strong> Follow evacuation instructions from officials only. Do not cross flooded roads.
          </p>
        </div>

      </div>
    </div>
  );
};

