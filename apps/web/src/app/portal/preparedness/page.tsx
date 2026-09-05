'use client';

import React from 'react';
import Link from 'next/link';
import { PreparednessCard, EmergencyPanel } from '@/design-system/components';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Download,
  BookOpen,
  ArrowRight,
  LifeBuoy,
  Users,
  CheckCircle2,
} from 'lucide-react';

export default function PublicPreparednessPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded p-5 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3 mb-3">
          <ShieldCheck className="w-6 h-6 text-emerald-700" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Community Disaster Preparedness & Mitigation Protocols
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Practical, actionable guidelines for households and village panchayats in flood-prone and landslide-vulnerable catchments.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Flash floods in steep Himalayan catchments unfold with dramatic velocity: flood waves can travel downstream at speeds exceeding 25 to 40 km/h, leaving minutes between initial breach and downstream arrival. Preparation done prior to the monsoon season is the single most decisive factor in saving lives.
        </p>
      </div>

      {/* Emergency Hotline Alert */}
      <EmergencyPanel />

      {/* Interactive Checklists */}
      <PreparednessCard />

      {/* 3 Specific Mountain Hazard Guides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Guide 1: Flash Floods */}
        <div className="bg-white border border-slate-300 rounded p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm border-b border-slate-200 pb-2">
            <LifeBuoy className="w-4 h-4 text-blue-700" />
            <span>Flash Flood & Cloudburst Action</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            When sudden torrential downpours strike steep mountain gullies:
          </p>
          <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
            <li>Never stay near dry riverbeds or ravines during monsoon rains.</li>
            <li>If water suddenly turns muddy and increases in roar, run uphill immediately.</li>
            <li>Do not attempt to salvage cattle or vehicles if water crosses knee depth.</li>
            <li>Avoid concrete culvert bridges where debris logjams can violently collapse.</li>
          </ul>
        </div>

        {/* Guide 2: Landslides & Mudflows */}
        <div className="bg-white border border-slate-300 rounded p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm border-b border-slate-200 pb-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Landslide & Scree Precautions</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            In areas with saturated slopes, road cuttings, and steep escarpments:
          </p>
          <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
            <li>Inspect retaining walls and house foundations for new vertical cracks.</li>
            <li>Watch for tilting trees, telephone poles, or sudden muddy springs bursting out.</li>
            <li>If driving along hill highways (e.g. NH-58, NH-10), watch for falling stones.</li>
            <li>Never sleep in ground-floor rooms adjacent to steep exposed uphill slopes.</li>
          </ul>
        </div>

        {/* Guide 3: Family Communication Plan */}
        <div className="bg-white border border-slate-300 rounded p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm border-b border-slate-200 pb-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Family Communication Plan</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            When cellular towers fail during severe weather events:
          </p>
          <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
            <li>Designate an out-of-district contact relative whom everyone texts.</li>
            <li>Memorize critical phone numbers; do not rely entirely on smartphone contacts.</li>
            <li>Identify an agreed high-ground village landmark (school or community center).</li>
            <li>Teach all family members how to disconnect the household main breaker.</li>
          </ul>
        </div>
      </div>

      {/* ── NIDM COMMUNITY PREPAREDNESS & DISASTER RISK REDUCTION CURRICULUM ── */}
      <div className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-800" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wide">
                NIDM Community Preparedness &amp; Panchayat SOP Modules
              </h3>
              <p className="text-xs text-slate-500">
                National Institute of Disaster Management (NIDM) · Ministry of Home Affairs Training Standard
              </p>
            </div>
          </div>
          <span className="bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded self-start sm:self-auto">
            NIDM-DRR-2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                SOP 01 · PRE-MONSOON
              </span>
              <h4 className="font-bold text-slate-900 mt-1">Catchment Desiltation</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Village panchayats must inspect culverts at KM 0.6 and ensure natural storm runoff channels are free from logjams and scree deposits.
              </p>
            </div>
            <div className="pt-2 text-[10px] font-mono text-emerald-700 font-bold">
              ✓ Verified by BDO / Gram Pradhan
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                SOP 02 · EARLY WARNING
              </span>
              <h4 className="font-bold text-slate-900 mt-1">PA Siren &amp; Whistle Protocol</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Upon receiving RED SACHET alert, designated ward volunteers sound 3 long horn blasts and broadcast high-ground instructions via temple/mosque loudspeakers.
              </p>
            </div>
            <div className="pt-2 text-[10px] font-mono text-emerald-700 font-bold">
              ✓ Drill completed Aug 2026
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                SOP 03 · EVACUATION
              </span>
              <h4 className="font-bold text-slate-900 mt-1">High-Ground Staging</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Escort vulnerable households (elderly, children, infirm) along verified North Ridge Trail (+120m elevation) to GIC Shelter before road inundation.
              </p>
            </div>
            <div className="pt-2 text-[10px] font-mono text-blue-700 font-bold">
              NDRF 8th Bn Staged Escort
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                SOP 04 · RECOVERY
              </span>
              <h4 className="font-bold text-slate-900 mt-1">Water &amp; Silt Sanitation</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Disinfect open wells and stream intakes with chlorine tablets. Do not consume raw tap water until PHED releases water purity clearance.
              </p>
            </div>
            <div className="pt-2 text-[10px] font-mono text-slate-600 font-bold">
              RO Plants Functional
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-100 border border-slate-300 rounded p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900">Looking for safe high-ground facilities near your village?</span>
          <p className="text-slate-600">Access verified relief shelters with operational drinking water and emergency power.</p>
        </div>
        <Link
          href="/portal/shelters"
          className="inline-flex items-center gap-1.5 bg-[#0f172a] hover:bg-slate-800 text-white font-bold px-4 py-2 rounded text-xs transition whitespace-nowrap active:scale-95"
        >
          <span>Find Nearby Shelters</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
        </Link>
      </div>
    </div>
  );
}
