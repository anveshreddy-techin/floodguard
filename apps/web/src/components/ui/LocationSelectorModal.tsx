'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  MapPin,
  Navigation,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  LocateFixed
} from 'lucide-react';
import { useLocation, LOCATIONS, LocationDossier, findNearestLocation, getDistanceKm } from '@/context/LocationContext';
import { useAdaptive } from '@/context/AdaptiveContext';
import { INDIAN_STATES, getStateFromCoordinates } from '@/data/states';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({ isOpen, onClose }) => {
  const { selectedLocation, selectLocationById } = useLocation();
  const { hierarchy, setLocationFilter, setStateFilter } = useAdaptive();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [gpsInfo, setGpsInfo] = useState<{
    lat: number;
    lon: number;
    accuracy: number;
    nearestName: string;
    distanceKm: number;
    resolvedState: string;
  } | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle GPS detection using HTML5 Geolocation API
  const handleDetectGPS = () => {
    setLocationError(null);
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser or platform.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const nearest = findNearestLocation(latitude, longitude);
        const stateInfo = getStateFromCoordinates(latitude, longitude);

        setGpsInfo({
          lat: latitude,
          lon: longitude,
          accuracy: Math.round(accuracy),
          nearestName: nearest.location.name,
          distanceKm: nearest.distanceKm,
          resolvedState: stateInfo.state,
        });

        // Automatically switch to nearest monitored sector
        selectLocationById(nearest.location.id);
        setLocationFilter(nearest.location.id);
        setSortByDistance(true);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Unable to acquire location.';
        if (err.code === 1) {
          msg = 'Permission denied. Please enable location permissions in your browser or select your region below.';
        } else if (err.code === 2) {
          msg = 'Position unavailable. Check your device GPS or connection.';
        } else if (err.code === 3) {
          msg = 'GPS query timed out. Please try again or select from the list.';
        }
        setLocationError(msg);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  // Filter and sort locations
  const displayedLocations = useMemo(() => {
    let list = [...LOCATIONS];

    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.state.toLowerCase().includes(q) ||
          l.region.toLowerCase().includes(q) ||
          l.primaryHazard.toLowerCase().includes(q) ||
          l.application.toLowerCase().includes(q)
      );
    }

    // 2. Zone Filter
    if (selectedZone !== 'ALL') {
      list = list.filter((l) => l.zone === selectedZone);
    }

    // 3. State Filter
    if (selectedState !== 'ALL') {
      list = list.filter(
        (l) =>
          l.state.toLowerCase().includes(selectedState.toLowerCase()) ||
          selectedState.toLowerCase().includes(l.state.toLowerCase())
      );
    }

    // 4. Sort by Distance if GPS active
    if (sortByDistance && gpsInfo) {
      list.sort((a, b) => {
        const distA = getDistanceKm(gpsInfo.lat, gpsInfo.lon, a.lat, a.lon);
        const distB = getDistanceKm(gpsInfo.lat, gpsInfo.lon, b.lat, b.lon);
        return distA - distB;
      });
    }

    return list;
  }, [searchQuery, selectedZone, selectedState, sortByDistance, gpsInfo]);

  const handleSelectLocation = (loc: LocationDossier) => {
    selectLocationById(loc.id);
    setLocationFilter(loc.id);
    onClose();
  };

  if (!isOpen) return null;

  const ZONES_LIST = [
    { id: 'ALL', label: `All (${LOCATIONS.length})` },
    { id: 'HIMALAYAN_NORTH', label: '🏔️ Himalayan North' },
    { id: 'NORTHEAST_BRAHMAPUTRA', label: '🌊 Northeast & Hills' },
    { id: 'WESTERN_GHATS_COASTAL', label: '🌴 Western Ghats' },
    { id: 'PENINSULAR_CENTRAL', label: '🌾 Peninsular & Central' },
    { id: 'URBAN_METRO', label: '🏙️ Urban Metros' },
    { id: 'EASTERN_DELTA', label: '🌾 Eastern Delta' },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Dark Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-fade-in" 
      />

      {/* Main Dialog Modal */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-gradient-to-b from-[#0c1836] via-[#081229] to-[#040a18] border border-cyan-500/40 rounded-3xl flex flex-col z-[10000] shadow-[0_0_60px_rgba(6,182,212,0.3)] overflow-hidden animate-slide-up">
        
        {/* ── Modal Header ── */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/20 bg-[#0c1836]/90 backdrop-blur-xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] shrink-0">
              <MapPin className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-black text-white font-sans tracking-wide flex items-center gap-2 flex-wrap">
                <span>SELECT MONITORED DISASTER SECTOR</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shrink-0">
                  {LOCATIONS.length} PAN-INDIA SECTORS
                </span>
              </div>
              <div className="text-[10px] sm:text-xs font-mono text-slate-400 truncate">
                Current: <span className="text-cyan-300 font-bold">{hierarchy.state}</span> • <span className="text-white">{hierarchy.district}</span> ({hierarchy.basin})
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-center text-cyan-300 hover:text-white active:scale-95 transition shadow-sm shrink-0 ml-2"
            aria-label="Close Location Selector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Modal Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

          {/* 1. HERO: GPS AUTO-DETECTION ACCORDING TO USER'S LOCATION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-sky-950/70 to-indigo-950/80 border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.25)] space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <LocateFixed className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider">
                    LOCATION ACCORDING TO YOUR GPS
                  </h4>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 font-black">
                    INSTANT LOCK
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Query device sensors to automatically select your closest river basin, alert zone, and hydrological station across India.
                </p>
              </div>

              <button
                onClick={handleDetectGPS}
                disabled={isLocating}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-black flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95 transition shrink-0 disabled:opacity-50"
              >
                {isLocating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>ACQUIRING GPS FIX...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 text-white fill-white" />
                    <span>USE MY CURRENT LOCATION</span>
                  </>
                )}
              </button>
            </div>

            {/* GPS Feedback Result Banner */}
            {gpsInfo && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span>📍 GPS FIX LOCKED: </span>
                    <strong className="text-white">{gpsInfo.lat.toFixed(4)}°N, {gpsInfo.lon.toFixed(4)}°E</strong>
                    <span className="text-emerald-300"> ({gpsInfo.resolvedState})</span>
                    <span className="text-slate-400 text-[11px] block sm:inline sm:ml-2">Accuracy: ±{gpsInfo.accuracy}m</span>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-400/40 text-[11px] text-white font-bold">
                  Nearest: {gpsInfo.nearestName} ({gpsInfo.distanceKm} km)
                </div>
              </div>
            )}

            {/* Error Message */}
            {locationError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center gap-2 text-xs font-mono text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{locationError}</span>
              </div>
            )}
          </div>

          {/* 2. SEARCH & FILTER CONTROLS */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any state, district, river basin, or city (e.g. Kerala, Delhi, Kosi, Wayanad)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none transition shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* State / UT Dropdown Selector (All 36 States and UTs) */}
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  if (e.target.value !== 'ALL') {
                    setStateFilter(e.target.value);
                  }
                }}
                className="bg-slate-900/90 border border-cyan-500/40 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer shrink-0"
              >
                <option value="ALL" className="bg-slate-950 text-slate-200">
                  🌐 All 36 States & UTs
                </option>
                {INDIAN_STATES.map((st) => (
                  <option key={st.id} value={st.name} className="bg-slate-950 text-slate-200">
                    {st.isUT ? '🏛️ [UT] ' : '📍 '}{st.name} ({st.rivers[0]} Basin)
                  </option>
                ))}
              </select>
            </div>

            {/* Hazard Zone Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 touch-pan-x">
              {ZONES_LIST.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap shrink-0 transition active:scale-95 ${
                    selectedZone === z.id
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-slate-800'
                  }`}
                >
                  {z.label}
                </button>
              ))}
              {gpsInfo && (
                <button
                  onClick={() => setSortByDistance(!sortByDistance)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap shrink-0 transition active:scale-95 flex items-center gap-1 ${
                    sortByDistance
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/60'
                      : 'text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Navigation className="w-3 h-3" />
                  <span>Sort by Distance {sortByDistance ? '✓' : ''}</span>
                </button>
              )}
            </div>
          </div>

          {/* 3. LOCATION CARDS GRID */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
              <span>SHOWING {displayedLocations.length} SECTORS</span>
              {selectedLocation && (
                <span className="truncate max-w-[240px] sm:max-w-none">
                  Active: <strong className="text-cyan-300">{selectedLocation.name}</strong>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayedLocations.map((loc) => {
                const isCurrent = selectedLocation?.id === loc.id;
                const distance = gpsInfo
                  ? getDistanceKm(gpsInfo.lat, gpsInfo.lon, loc.lat, loc.lon).toFixed(1)
                  : null;

                const getRiskColor = (level: string) => {
                  switch (level) {
                    case 'EXTREME':
                      return 'bg-rose-500/20 text-rose-300 border-rose-500/50';
                    case 'HIGH':
                      return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
                    case 'MODERATE':
                      return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
                    default:
                      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
                  }
                };

                return (
                  <div
                    key={loc.id}
                    onClick={() => handleSelectLocation(loc)}
                    className={`p-4 rounded-2xl border transition text-left cursor-pointer active:scale-98 relative group flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/90 hover:border-cyan-500/40 shadow-md'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Top Row: State & Risk Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[10px] font-mono font-bold text-cyan-400 flex items-center gap-1.5 uppercase truncate">
                            <span>{loc.state}</span>
                            <span>•</span>
                            <span className="text-slate-400 truncate">{loc.region.split(' (')[0]}</span>
                          </div>
                          <h5 className="font-sans font-bold text-sm text-white group-hover:text-cyan-200 transition">
                            {loc.name}
                          </h5>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold border ${getRiskColor(loc.riskLevel)}`}>
                            {loc.riskLevel} {loc.riskScore}/100
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-mono font-bold text-cyan-300 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-700">
                              ACTIVE
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Primary Hazard Description */}
                      <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                        {loc.primaryHazard}
                      </p>

                      {/* Key Hydro Metrics */}
                      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                        <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                          <span className="block text-slate-500 text-[9px]">RAIN (3H)</span>
                          <span className="text-white font-bold">{loc.rainfall3h}</span>
                        </div>
                        <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                          <span className="block text-slate-500 text-[9px]">RIVER</span>
                          <span className="text-cyan-300 font-bold truncate block">{loc.riverStage.split(' (')[0]}</span>
                        </div>
                        <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                          <span className="block text-slate-500 text-[9px]">LEAD TIME</span>
                          <span className="text-amber-300 font-bold">{loc.leadTimeMinutes} min</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        {distance ? (
                          <span className="text-emerald-300 font-bold flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-emerald-400" />
                            {distance} km away from your GPS
                          </span>
                        ) : (
                          <span>{loc.elevation}</span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectLocation(loc);
                        }}
                        className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                          isCurrent
                            ? 'bg-cyan-500 text-slate-950 font-black'
                            : 'bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300'
                        }`}
                      >
                        <span>{isCurrent ? 'SELECTED' : 'SELECT'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {displayedLocations.length === 0 && (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
                <MapPin className="w-8 h-8 text-slate-600 mx-auto" />
                <h5 className="text-sm font-mono font-bold text-slate-300">No matching sectors found</h5>
                <p className="text-xs text-slate-500 font-sans">
                  Try searching for another Indian state, major river basin, or clear the active filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedZone('ALL');
                    setSelectedState('ALL');
                  }}
                  className="mt-2 px-4 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

        </div>

        {/* ── Modal Footer ── */}
        <div className="p-3.5 border-t border-cyan-500/20 bg-[#070f24]/95 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs font-mono shrink-0">
          <div className="text-slate-400 text-center sm:text-left text-[11px]">
            <span>SIH26192 Pan-India Disaster Early Warning Network • </span>
            <span className="text-cyan-400 font-bold">{LOCATIONS.length} Real-Time Calibrated Basins</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition active:scale-95"
          >
            DONE / CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
