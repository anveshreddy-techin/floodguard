'use client';

import React, { useState } from 'react';
import { useAdaptive } from '@/context/AdaptiveContext';
import { INDIAN_STATES } from '@/data/states';
import { ShelterList, EmergencyPanel } from '@/design-system/components';
import { Home, ShieldCheck, MapPin, AlertTriangle, PhoneCall } from 'lucide-react';

export default function PublicSheltersPage() {
  const { hierarchy } = useAdaptive();
  const [selectedState, setSelectedState] = useState<string>(hierarchy.state || 'ALL');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-700" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Designated High-Ground Relief Shelters & Evacuation Centers
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Verified public assets (Govt Inter Colleges, Panchayat Bhawans, Indoor Stadiums) designated by District Disaster Management Authorities.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <label htmlFor="shelter-state-select" className="block text-[10px] font-semibold text-slate-700 uppercase mb-1">
              Filter by State
            </label>
            <select
              id="shelter-state-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All States (Pan-India)</option>
              {INDIAN_STATES.map((st) => (
                <option key={st.id} value={st.name}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-950 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Important Evacuation Route Notice:</span>
            <p className="leading-relaxed text-amber-900">
              Candidate escape routes displayed in FloodGuard AI represent topographic elevation contours. Actual road traversability is subject to flash flood landslides, bridge collapses, or debris flow. Always confirm routes with your local <strong>District Emergency Operation Centre (1077)</strong> or police personnel stationed along the highway.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Hotline Panel */}
      <EmergencyPanel />

      {/* Main Shelter Directory List */}
      <section aria-labelledby="shelter-directory-heading" className="space-y-3">
        <h3 id="shelter-directory-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Verified Shelter Directory ({selectedState === 'ALL' ? 'Pan-India' : selectedState})
        </h3>
        <ShelterList filterState={selectedState === 'ALL' ? undefined : selectedState} />
      </section>
    </div>
  );
}
