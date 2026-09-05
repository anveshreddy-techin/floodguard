'use client';

import React from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { DataArchitectureFlow } from '@/design-system/components/DataArchitectureFlow';
import { PublicHeader, PublicNavigation, PublicFooter } from '@/design-system/components';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Cpu, Layers } from 'lucide-react';

export default function DataFlowPage() {
  return (
    <div className="min-h-screen bg-[#071322] text-slate-100 flex flex-col font-sans select-none">
      {/* Top Government Institutional Header */}
      <PublicHeader />
      <PublicNavigation />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/portal" className="hover:text-cyan-400 transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Portal</span>
            </Link>
            <span>/</span>
            <span className="text-cyan-400 font-bold">Data Architecture &amp; Ingestion Flow</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ingestion"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Live Ingestion Pipeline</span>
              <span>→</span>
            </Link>
            <Link
              href="/data-sources"
              className="text-xs font-mono text-slate-400 hover:text-white transition"
            >
              Provider Registry
            </Link>
          </div>
        </div>

        {/* The Full Master Visualizer matching Reference Image 1 */}
        <DataArchitectureFlow />
      </main>

      {/* Official Government Footer */}
      <PublicFooter />
    </div>
  );
}
