'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, Map, Layers, PlayCircle, HelpCircle, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-900 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-2xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1 font-sans">
            HTTP 404 — ROUTE UNKNOWN
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-sans">
            Location Coordinate Not Found
          </h1>
          <p className="text-xs text-slate-600 mt-2 font-sans leading-relaxed">
            The requested operations page does not exist or has been relocated within the FloodGuard AI emergency portal.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs font-sans">
          <Link
            href="/"
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-1.5 font-semibold transition shadow-sm"
          >
            <Home className="w-4 h-4" /> Command Center
          </Link>
          <Link
            href="/map"
            className="p-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl flex items-center justify-center gap-1.5 font-semibold transition shadow-sm"
          >
            <Map className="w-4 h-4 text-blue-600" /> GIS Map
          </Link>
          <Link
            href="/cascade"
            className="p-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl flex items-center justify-center gap-1.5 font-semibold transition shadow-sm"
          >
            <Layers className="w-4 h-4 text-indigo-600" /> Upstream Cascade
          </Link>
          <Link
            href="/safety"
            className="p-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl flex items-center justify-center gap-1.5 font-semibold transition shadow-sm"
          >
            <Compass className="w-4 h-4 text-emerald-600" /> Safety Guidance
          </Link>
        </div>
      </div>
    </div>
  );
}
