'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Award,
  Globe,
  Database,
  ArrowRight,
} from 'lucide-react';

export default function PublicAboutPage() {
  return (
    <div className="space-y-8 text-slate-800 text-xs">
      {/* 1. Header Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-3.5 border-b border-slate-100 pb-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <span className="text-xs font-sans uppercase bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
              SIH26192 Research Project
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans mt-1">
              About FloodGuard AI Platform
            </h2>
            <p className="text-slate-600 text-xs font-sans mt-0.5">
              Hyper-Local Multi-Source Flash-Flood Intelligence & Multi-Hazard Decision Support
            </p>
          </div>
        </div>

        <p className="text-slate-700 leading-relaxed text-sm">
          FloodGuard AI is a disaster intelligence and operational decision-support platform engineered specifically for the <strong>Smart India Hackathon 2026</strong> under Problem Statement <strong>SIH26192</strong>: <em>&ldquo;Development of Early Warning and Predictive Response Systems for Flash Floods and Multi-Hazard Cascades in Hilly and Mountainous Catchments.&rdquo;</em>
        </p>
      </div>

      {/* 2. Strict Non-Impersonation Charter */}
      <section className="bg-amber-50 border-2 border-amber-300 rounded p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-950 font-bold text-sm border-b border-amber-200 pb-2">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
          <span>Non-Impersonation & Truthfulness Charter</span>
        </div>

        <p className="leading-relaxed text-amber-900">
          FloodGuard AI adheres to rigorous standards of public communication and institutional transparency:
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-amber-950">
          <li className="flex items-start gap-2 bg-white/70 p-2.5 rounded border border-amber-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>No Government Claim:</strong> FloodGuard AI never claims to be an official website of the Government of India, NDMA, NDRF, IMD, CWC, or any State Government.
            </span>
          </li>
          <li className="flex items-start gap-2 bg-white/70 p-2.5 rounded border border-amber-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Truth in Data:</strong> The platform distinguishes strictly between physically observed facts, numerical model projections, and simulated demo figures.
            </span>
          </li>
          <li className="flex items-start gap-2 bg-white/70 p-2.5 rounded border border-amber-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Emergency Primacy:</strong> In all hazardous scenarios, citizens are guided to follow district administration directives and dial National Emergency Helpline <strong>112</strong>.
            </span>
          </li>
          <li className="flex items-start gap-2 bg-white/70 p-2.5 rounded border border-amber-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Zero Fabricated Levels:</strong> Warning thresholds and river stages are attributed exclusively to validated CWC/IMD benchmarks or labeled as synthetic benchmarks.
            </span>
          </li>
        </ul>
      </section>

      {/* 3. 5-Source Multi-Hazard Fusion Architecture */}
      <section className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Layers className="w-5 h-5 text-blue-700" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            The 5-Source Multi-Hazard Fusion Framework
          </h3>
        </div>

        <p className="text-slate-600 leading-relaxed">
          Traditional early warning systems rely on single-parameter river gauges that trigger only after a flood surge has already entered the lower valley. FloodGuard AI integrates five distinct spatial and physical signals:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-slate-800">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="font-bold text-blue-900 text-xs">1. Satellite Radar</span>
            <p className="text-[11px] text-slate-600">
              GPM IMERG & INSAT-3D rapid precipitation estimation over high-altitude ridge crests.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="font-bold text-blue-900 text-xs">2. Physical AWS Gauges</span>
            <p className="text-[11px] text-slate-600">
              Automated tipping-bucket rain gauges measuring ground-truth hourly accumulation and intensity.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="font-bold text-blue-900 text-xs">3. Acoustic Stage</span>
            <p className="text-[11px] text-slate-600">
              Non-contact FMCW radar sensors detecting rapid hydrograph rising limbs (+m/hr rate).
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="font-bold text-blue-900 text-xs">4. Soil Moisture</span>
            <p className="text-[11px] text-slate-600">
              Antecedent precipitation indices and TDR probes evaluating remaining infiltration capacity.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
            <span className="font-bold text-blue-900 text-xs">5. Terrain Topography</span>
            <p className="text-[11px] text-slate-600">
              High-resolution digital elevation models calculating slope convergence and colluvial debris runouts.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Dual Operational Interface Paradigm */}
      <section className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Activity className="w-5 h-5 text-cyan-700" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Dual Experience: Public Portal & Tactical Command Center
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
            <span className="font-bold text-slate-900 text-sm">Public Information Portal</span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Designed with institutional restraint, high document readability, WCAG AAA accessibility, bilingual Hindi/English support, citizen incident submissions, and emergency 112 guidance for all citizens and community stakeholders.
            </p>
            <div className="text-[10px] text-slate-500 font-mono">
              Active Scope: You are currently viewing the Public Portal
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-sm">
            <span className="font-bold text-blue-700 text-sm font-sans">Authorized Tactical Command Center</span>
            <p className="text-slate-600 leading-relaxed text-[11px] font-sans">
              High-readiness tactical spatial dashboard featuring GIS multi-layer vector cartography, live IoT telemetry streams, hindcast time machines, black-box audit ledgers, scenario simulation lab, and ML drift monitors for authorized operators.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:text-blue-800 transition pt-1"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
