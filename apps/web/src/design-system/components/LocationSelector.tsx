'use client';

import React, { useMemo } from 'react';
import { useAdaptive } from '@/context/AdaptiveContext';
import { INDIAN_STATES } from '@/data/states';
import { LOCATIONS } from '@/data/locations';
import { MapPin, RotateCcw, ChevronRight } from 'lucide-react';

export const LocationSelector: React.FC = () => {
  const {
    hierarchy,
    setStateFilter,
    setDistrictFilter,
    setBasinFilter,
    resetToNational,
    selectedLocation,
  } = useAdaptive();

  // All available states from INDIAN_STATES
  const states = useMemo(() => {
    return [...INDIAN_STATES].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Filter districts available for the selected state from LOCATIONS
  const availableDistricts = useMemo(() => {
    const matchingLocations = LOCATIONS.filter(
      (l) => l.state.toLowerCase() === hierarchy.state.toLowerCase()
    );
    const districtSet = new Set<string>();
    matchingLocations.forEach((l) => {
      // Extract district from region like "Chamoli District (Dhauliganga Basin)"
      const parts = l.region.split('(')[0].replace(/District/i, '').trim();
      if (parts) districtSet.add(parts);
    });
    // If empty, supply default for the state
    if (districtSet.size === 0) {
      districtSet.add('General Catchment');
    }
    return Array.from(districtSet).sort();
  }, [hierarchy.state]);

  // Available basins for current state/district
  const availableBasins = useMemo(() => {
    const matchingLocations = LOCATIONS.filter(
      (l) => l.state.toLowerCase() === hierarchy.state.toLowerCase()
    );
    const basinSet = new Set<string>();
    matchingLocations.forEach((l) => {
      // Extract basin if inside parentheses or from region
      const match = l.region.match(/\((.*?)\)/);
      if (match && match[1]) {
        basinSet.add(match[1]);
      } else {
        basinSet.add('Upper Catchment Basin');
      }
    });
    if (basinSet.size === 0) {
      basinSet.add('Primary Basin');
    }
    return Array.from(basinSet).sort();
  }, [hierarchy.state]);

  return (
    <div className="bg-white border border-slate-300 rounded shadow-xs p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-700" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Administrative Geographic Hierarchy
          </h2>
          <span className="text-[11px] text-slate-500 font-normal">
            (Filter risk data by jurisdiction)
          </span>
        </div>

        <button
          type="button"
          onClick={resetToNational}
          className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-medium self-start sm:self-auto"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset to Default</span>
        </button>
      </div>

      {/* Cascading Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Country */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Country
          </label>
          <input
            type="text"
            readOnly
            value="India (National Scope)"
            className="w-full bg-slate-100 border border-slate-300 text-slate-700 text-xs rounded px-2.5 py-1.5 font-medium cursor-not-allowed"
          />
        </div>

        {/* State / UT */}
        <div>
          <label htmlFor="state-select" className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
            State / Union Territory *
          </label>
          <select
            id="state-select"
            value={hierarchy.state}
            onChange={(e) => setStateFilter(e.target.value)}
            className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 font-medium"
          >
            {states.map((st) => (
              <option key={st.id} value={st.name}>
                {st.name} {st.isUT ? '(UT)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label htmlFor="district-select" className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
            District *
          </label>
          <select
            id="district-select"
            value={hierarchy.district}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 font-medium"
          >
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Basin / Catchment */}
        <div>
          <label htmlFor="basin-select" className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
            Basin / Watershed *
          </label>
          <select
            id="basin-select"
            value={hierarchy.basin}
            onChange={(e) => setBasinFilter(e.target.value)}
            className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 font-medium"
          >
            {availableBasins.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Jurisdiction Breadcrumb */}
      <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap items-center gap-1.5 text-xs text-slate-600 font-mono">
        <span className="font-semibold text-slate-800">Current Scope:</span>
        <span>India</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
          {hierarchy.state}
        </span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span>{hierarchy.district}</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span>{hierarchy.basin}</span>
        {selectedLocation && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-700 font-semibold italic">
              {selectedLocation.name}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
