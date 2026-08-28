'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, Map, Layers, PlayCircle, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b132b] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[#1c2541] border border-[#3a506b] rounded-xl p-8 shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-950/80 border border-rose-700 text-rose-400 flex items-center justify-center mx-auto animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            HTTP 404 — ROUTE UNKNOWN
          </div>
          <h1 className="text-2xl font-black text-slate-100">
            Location Coordinate Not Found
          </h1>
          <p className="text-xs text-slate-300 mt-2">
            The requested operations page does not exist or has been relocated within the FloodGuard AI emergency suite.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <Link
            href="/"
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center gap-1.5 font-medium transition"
          >
            <Home className="w-4 h-4" /> Command Center
          </Link>
          <Link
            href="/map"
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center justify-center gap-1.5 font-medium transition"
          >
            <Map className="w-4 h-4" /> GIS Map
          </Link>
          <Link
            href="/cascade"
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center justify-center gap-1.5 font-medium transition"
          >
            <Layers className="w-4 h-4" /> Upstream Cascade
          </Link>
          <Link
            href="/challenge"
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-800/80 rounded-lg flex items-center justify-center gap-1.5 font-medium transition"
          >
            <HelpCircle className="w-4 h-4" /> Judge Mode
          </Link>
        </div>
      </div>
    </div>
  );
}
