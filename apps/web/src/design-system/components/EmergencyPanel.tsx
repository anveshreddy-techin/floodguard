'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneCall, ShieldAlert, AlertOctagon, CheckCircle2, ArrowRight } from 'lucide-react';

export const EmergencyPanel: React.FC = () => {
  return (
    <aside aria-label="Immediate Life-Safety Protocols" className="bg-red-50 border-2 border-red-300 rounded p-5 mb-6 text-red-950">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-200 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded bg-red-600 text-white flex items-center justify-center flex-shrink-0">
            <PhoneCall className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-700 font-bold">
              Immediate Life-Safety Priority
            </span>
            <h3 className="text-base sm:text-lg font-bold text-red-950">
              National Emergency Services Hotline: 112
            </h3>
          </div>
        </div>

        <a
          href="tel:112"
          className="inline-flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-extrabold px-5 py-2.5 rounded text-sm transition active:scale-95 shadow-sm font-mono"
        >
          <PhoneCall className="w-4 h-4" />
          <span>CALL 112 NOW</span>
        </a>
      </div>

      {/* 4 Golden Safety Protocols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs mb-4">
        <div className="bg-white/80 border border-red-200 p-3 rounded">
          <div className="font-bold text-red-900 mb-1 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>Never Cross Water</span>
          </div>
          <p className="text-red-800 text-[11px] leading-relaxed">
            Just 15 cm (6 inches) of rapid water can knock an adult down. 30 cm can float a vehicle. Avoid submerging causeways.
          </p>
        </div>

        <div className="bg-white/80 border border-red-200 p-3 rounded">
          <div className="font-bold text-red-900 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>Seek Ridge Elevation</span>
          </div>
          <p className="text-red-800 text-[11px] leading-relaxed">
            Move immediately to higher ground away from narrow mountain stream channels, dry ravines, and culvert exits.
          </p>
        </div>

        <div className="bg-white/80 border border-red-200 p-3 rounded">
          <div className="font-bold text-red-900 mb-1 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>Isolate Power Mains</span>
          </div>
          <p className="text-red-800 text-[11px] leading-relaxed">
            Turn off main electrical breaker and gas cylinders if water enters dwellings. Avoid touching downed wires or transformer poles.
          </p>
        </div>

        <div className="bg-white/80 border border-red-200 p-3 rounded">
          <div className="font-bold text-red-900 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>Designated Shelters</span>
          </div>
          <p className="text-red-800 text-[11px] leading-relaxed">
            Head towards designated high-ground schools and community shelters identified by the District Disaster Management Authority.
          </p>
        </div>
      </div>

      {/* Footer link to Shelters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-red-200 text-xs">
        <span className="text-red-800 font-medium">
          Need evacuation shelter directions in your catchment?
        </span>
        <Link
          href="/portal/shelters"
          className="inline-flex items-center gap-1 text-red-950 font-bold hover:underline"
        >
          <span>View Verified Relief Shelters</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
};
