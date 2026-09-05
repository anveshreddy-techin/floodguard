'use client';

import React, { useState } from 'react';
import {
  Shield,
  Radio,
  Users,
  LifeBuoy,
  Anchor,
  PhoneCall,
  CheckCircle2,
  Clock,
  Compass,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export const NdrfDeploymentCard: React.FC = () => {
  const [selectedBattalion, setSelectedBattalion] = useState<string>('8-BN');

  const battalions = [
    {
      id: '8-BN',
      name: '8th Battalion NDRF (Ghaziabad / Northern Command)',
      commandant: 'Commandant P. K. Srivastava',
      totalPersonnel: 85,
      bases: [
        {
          team: 'TEAM 8-ALPHA',
          location: 'Joshimath / Raini Sector, Chamoli',
          strength: 45,
          equipment: ['4x Inflatable Motor Boats (IRB)', '2x Victim Location Cameras', 'VHF Comms Mast'],
          status: 'FORWARD_STAGED',
          statusColor: 'text-red-700 bg-red-100 border-red-200',
          contact: '01372-251437',
        },
        {
          team: 'TEAM 8-BRAVO',
          location: 'Guptkashi / Mandakini Corridor, Rudraprayag',
          strength: 40,
          equipment: ['3x Inflatable Rescue Boats', 'Deep Diving Set', 'Pneumatic Lifting Bags'],
          status: 'ACTIVE_PATROL',
          statusColor: 'text-amber-700 bg-amber-100 border-amber-200',
          contact: '01364-267210',
        },
      ],
    },
    {
      id: '14-BN',
      name: '14th Battalion NDRF (Jaspur / Uttarakhand Command)',
      commandant: 'Commandant Rajesh Kumar',
      totalPersonnel: 80,
      bases: [
        {
          team: 'TEAM 14-CHARLIE',
          location: 'Bhatwari / Harsil Sector, Uttarkashi',
          strength: 45,
          equipment: ['4x Inflatable Motor Boats', 'Canine Search Squad (2 Dogs)', 'Satellite Phone BGAN'],
          status: 'FORWARD_STAGED',
          statusColor: 'text-red-700 bg-red-100 border-red-200',
          contact: '01374-222123',
        },
        {
          team: 'TEAM 14-DELTA',
          location: 'Srinagar Garhwal / Alaknanda Bridge Point',
          strength: 35,
          equipment: ['2x High-Volume Dewatering Pumps', 'Emergency Lighting Towers'],
          status: 'STANDBY_RESERVE',
          statusColor: 'text-blue-700 bg-blue-100 border-blue-200',
          contact: '01346-252110',
        },
      ],
    },
  ];

  const activeBat = battalions.find((b) => b.id === selectedBattalion) || battalions[0];

  return (
    <div className="bg-white border border-slate-300 rounded shadow-xs overflow-hidden text-slate-900 mb-6">
      {/* ── HEADER ── */}
      <div className="bg-slate-900 text-white px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-red-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
            NDRF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide">
                National Disaster Response Force (NDRF) Tactical Staging
              </h3>
              <span className="bg-red-600 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded">
                DEFCON ORANGE
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Disaster Response Division · Ministry of Home Affairs (MHA) Forward Operating Bases
            </p>
          </div>
        </div>

        {/* Battalion Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded border border-slate-700 text-xs">
          {battalions.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBattalion(b.id)}
              className={`px-2.5 py-1 rounded font-mono font-bold transition cursor-pointer ${
                selectedBattalion === b.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {b.id}
            </button>
          ))}
        </div>
      </div>

      {/* ── BATTALION SUMMARY & FORWARD OPERATING TEAMS ── */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {activeBat.name}
            </h4>
            <div className="text-xs text-slate-500">
              Command: <strong className="text-slate-800">{activeBat.commandant}</strong> · Staged Personnel: <strong className="text-red-700 font-mono">{activeBat.totalPersonnel} Officers &amp; Rescuers</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
              13 Rescue Boats Active
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold">
              Comms Link: 100% Online
            </span>
          </div>
        </div>

        {/* ── FORWARD OPERATING TEAMS CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeBat.bases.map((base, i) => (
            <div
              key={i}
              className="bg-slate-50 border border-slate-200 rounded p-3.5 space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {base.team}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${base.statusColor}`}>
                    {base.status}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <span>{base.location}</span>
                </div>

                <div className="text-xs text-slate-600 mt-1">
                  Strength: <strong className="text-slate-900 font-mono">{base.strength} Personnel</strong>
                </div>

                <div className="mt-2">
                  <div className="text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">
                    Specialized Staged Equipment:
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    {base.equipment.map((eq, j) => (
                      <span
                        key={j}
                        className="bg-white text-slate-800 px-2 py-0.5 rounded border border-slate-200 font-medium"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">
                  Tel: {base.contact}
                </span>
                <a
                  href={`tel:${base.contact.replace(/-/g, '')}`}
                  className="text-blue-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call Ops Desk</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ── ACTIVE SEARCH & RESCUE DISPATCH LOG ── */}
        <div className="pt-1">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
            RECENT TACTICAL DISPATCH MISSIONS
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-emerald-50/60 border border-emerald-200 rounded p-2.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">
                    Pre-evacuation escort for 140 residents in lower Raini terrace to GIC Shelter
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono">
                    Team: TEAM 8-ALPHA · Initiated: 13:30 IST · Status: COMPLETED
                  </div>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded shrink-0">
                140 Relocated
              </span>
            </div>

            <div className="bg-blue-50/60 border border-blue-200 rounded p-2.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">
                    Roadblock clearance and spotter stationing along Bhatwari highway corridor
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono">
                    Team: TEAM 14-CHARLIE · Initiated: 14:00 IST · Status: IN PROGRESS
                  </div>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded shrink-0">
                45 Relocated
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
