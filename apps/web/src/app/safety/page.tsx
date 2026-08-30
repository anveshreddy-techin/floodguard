'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
import dynamic from 'next/dynamic';
import {
  Compass, MapPin, ShieldAlert, AlertTriangle, Navigation,
  CheckCircle2, PhoneCall, Radio, Activity, RefreshCw,
  Sliders, Maximize2, Minimize2, Zap, ArrowRight, ShieldCheck, Map
} from 'lucide-react';
import { RiskBadge } from '@/components/ui/Badges';
import { GuidanceLevel, ExposureStatus, RiskLevel } from '@/types';

// Dynamically import Leaflet map (avoid SSR in Next.js static export)
const EvacuationLeafletMap = dynamic(
  () => import('@/components/ui/EvacuationLeafletMap').then((m) => m.EvacuationLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[430px] rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-cyan-300 text-xs font-mono font-bold animate-pulse">LOADING REAL-WORLD MAP…</p>
          <p className="text-slate-500 text-[10px] font-mono">Fetching OpenStreetMap tiles · Projecting flood perimeters</p>
        </div>
      </div>
    ),
  }
);

export default function MySafetyPage() {
  const { setPage, setMode, setRiskState } = useEnvironment();
  const [locationMode, setLocationMode] = useState<'DEMO' | 'BROWSER' | 'MANUAL'>('DEMO');
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number }>({ lat: 30.5050, lon: 79.1550 });
  const [sensorFailure, setSensorFailure] = useState<boolean>(false);
  const [simulatedExposureStage, setSimulatedExposureStage] = useState<number>(2);
  const [rescueRequested, setRescueRequested] = useState<boolean>(false);
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);

  // ── Real-world geographic coordinates (Chamoli district, Uttarakhand) ──
  const shelterCoords = { lat: 30.5183, lon: 79.1435 }; // Community High School ridge

  const safeRoutePoints: [number, number][] = [
    [30.5050, 79.1550], // User start position
    [30.5090, 79.1515], // Trail fork — avoid river side
    [30.5130, 79.1480], // Mid-ridge crest
    [30.5160, 79.1455], // Final descent approach
    [30.5183, 79.1435], // Shelter gate
  ];

  const blockedRoutePoints: [number, number][] = [
    [30.5050, 79.1550], // Same start
    [30.5020, 79.1590], // Heads toward river channel
    [30.4990, 79.1625], // Culvert KM 0.6 — BLOCKED by active flood
  ];

  useEffect(() => {
    setPage('safety');
    setMode('DEMO');
    setRiskState('HIGH');
  }, [setPage, setMode, setRiskState]);

  const exposureLevels: Array<{
    status: ExposureStatus;
    risk: RiskLevel;
    guidanceLvl: GuidanceLevel;
    title: string;
    msg: string;
  }> = [
    {
      status: 'OUTSIDE_RISK_AREA',
      risk: 'LOW',
      guidanceLvl: 0,
      title: 'OUTSIDE MODELED RISK ZONE',
      msg: 'Your coordinates are ~3.2 km away from active river channels. Continue routine monitoring.',
    },
    {
      status: 'NEAR_RISK_AREA',
      risk: 'MODERATE',
      guidanceLvl: 1,
      title: 'PROXIMITY WARNING — NEAR RISK ZONE',
      msg: 'You are within 1.8 km of the modeled flash-flood corridor. Stay alert and review candidate routes.',
    },
    {
      status: 'INSIDE_HIGH_RISK_AREA',
      risk: 'HIGH',
      guidanceLvl: 2,
      title: 'HIGH MODEL-ESTIMATED FLOOD RISK',
      msg: 'Your authorized location appears to be within a modeled high-risk area on pre-saturated slopes.',
    },
    {
      status: 'INSIDE_EXTREME_RISK_AREA',
      risk: 'EXTREME',
      guidanceLvl: 3,
      title: 'EXTREME SURGE RISK DETECTED',
      msg: 'Location is inside primary debris surge path. Move immediately to candidate higher ground.',
    },
  ];

  const currentExp = exposureLevels[simulatedExposureStage];

  const candidateRoutes = [
    {
      id: 'rt-1',
      name: 'North Ridge Elevated Trail (Towards High School)',
      distance: '1.4 km',
      elevation: '+120m',
      status: sensorFailure ? 'ROUTE_SAFETY_NOT_VERIFIED' : 'CANDIDATE LOWER EXPOSURE',
      note: 'Ascends ridge above modeled flood contour. Surface safety not verified.',
      blocked: false,
    },
    {
      id: 'rt-2',
      name: 'Upper Panchayat Bhavan Connector',
      distance: '2.1 km',
      elevation: '+85m',
      status: 'CANDIDATE ROUTE',
      note: 'Avoids low culvert KM 0.6 bottleneck.',
      blocked: false,
    },
    {
      id: 'rt-3',
      name: 'Riverbed Bypass NH Link',
      distance: '0.9 km',
      elevation: '+5m',
      status: 'BLOCKED',
      note: 'HIGH INUNDATION RISK — Intersects active river surge channel. Avoid completely.',
      blocked: true,
    },
  ];

  const handleRequestBrowserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setLocationMode('BROWSER');
        },
        () => {
          alert('Location permission denied or unavailable. Using demo position.');
          setLocationMode('DEMO');
        }
      );
    }
  };

  return (
    <div className={`flex flex-col min-h-screen transition-all duration-500 select-none ${
      emergencyMode ? 'ring-8 ring-rose-600/80' : ''
    }`}>
      <Header dataMode={locationMode === 'DEMO' ? 'DEMO' : 'LIVE'} systemStatus="OPERATIONAL" />
      <div className="flex flex-1 min-h-0 relative">
        {!emergencyMode && <Sidebar activeTab="safety" />}

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-7xl mx-auto space-y-5 pb-24 md:pb-6 overflow-y-auto">

          {/* ── Top Bar ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="chip chip-live">DECISION SUPPORT</span>
                <h1 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
                  <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                  MY SAFETY &amp; CONSERVATIVE ESCAPE GUIDANCE
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Conservative exposure assessment relative to modeled flood perimeters and terrain topography
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-xs font-mono">
              <button
                onClick={() => setEmergencyMode(!emergencyMode)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition transform active:scale-95 shadow-xl ${
                  emergencyMode
                    ? 'btn-danger text-white animate-pulse'
                    : 'fp text-slate-300 hover:text-white hover:border-rose-500'
                }`}
              >
                {emergencyMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4 text-rose-400" />}
                <span>{emergencyMode ? 'EXIT EMERGENCY HUD' : '🚨 EMERGENCY MODE'}</span>
              </button>

              <button
                onClick={handleRequestBrowserLocation}
                className="btn-primary px-3.5 py-2 text-white rounded-xl flex items-center gap-2 font-bold transition shadow-xl active:scale-95"
              >
                <MapPin className="w-4 h-4 text-cyan-300" />
                <span>{locationMode === 'BROWSER' ? '📍 Using Device GPS' : 'Allow Device Location'}</span>
              </button>
            </div>
          </div>

          {/* ── Official Emergency Priority Directive ── */}
          <div className="fp fp-critical rounded-2xl p-4 text-xs space-y-1.5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-300 uppercase tracking-wider flex items-center gap-2 font-mono text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                STATE DISASTER MANAGEMENT GUIDANCE PRIORITY
              </span>
              <span className="chip chip-live">AUTHORITY DIRECTIVE</span>
            </div>
            <p className="text-slate-200 leading-relaxed font-sans text-xs">
              &quot;Local administration advises all residents in low-lying riverbanks of Upper Catchment to stay alert, avoid crossing swollen streams, and monitor siren broadcasts.&quot;
            </p>
          </div>

          {/* ── REAL-WORLD INTERACTIVE EVACUATION MAP ── */}
          <div className="fp fp-operational rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  REAL-WORLD INTERACTIVE EVACUATION MAP
                </span>
                <h2 className="text-xl font-black text-white mt-0.5 flex items-center gap-2">
                  <Map className="w-5 h-5 text-cyan-400" />
                  {currentExp.title}
                </h2>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Live terrain — tap any marker for details · pinch/scroll to zoom · OpenStreetMap tiles
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <RiskBadge level={currentExp.risk} />
              </div>
            </div>

            {/* THE REAL LEAFLET MAP */}
            <EvacuationLeafletMap
              userLat={userCoords.lat}
              userLon={userCoords.lon}
              shelterLat={shelterCoords.lat}
              shelterLon={shelterCoords.lon}
              routePoints={safeRoutePoints}
              blockedPoints={blockedRoutePoints}
              riskZoneCenter={[userCoords.lat, userCoords.lon]}
              riskRadiusM={650}
              emergencyMode={emergencyMode}
              locationMode={locationMode}
            />

            {/* Info strip below map */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Nearest Shelter</div>
                <div className="font-bold text-white mt-0.5">Community High School</div>
                <div className="text-[10px] text-emerald-400">+120m · 1.4 km away</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">River Stage</div>
                <div className="font-bold text-rose-400 mt-0.5 text-base">3.80 m</div>
                <div className="text-[10px] text-rose-300">+0.40m/h RISING</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">NDRF Response</div>
                <div className="font-bold text-purple-300 mt-0.5">8th Battalion</div>
                <div className="text-[10px] text-purple-400">6 Boats · ETA 8 min</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Your Position</div>
                <div className="font-bold text-cyan-300 mt-0.5 text-[11px]">{userCoords.lat.toFixed(4)}°N</div>
                <div className="text-[10px] text-cyan-400">{userCoords.lon.toFixed(4)}°E · ±15m</div>
              </div>
            </div>

            {/* Why elevated + route status panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="fp rounded-xl p-4 space-y-2">
                <div className="text-cyan-300 font-bold uppercase tracking-wider text-[11px]">WHY IS RISK ELEVATED?</div>
                <ul className="space-y-1.5 text-slate-300 text-xs">
                  <li className="flex items-center gap-2"><span className="text-orange-400 font-bold">•</span> Heavy localized rainfall (48mm in 3h)</li>
                  <li className="flex items-center gap-2"><span className="text-orange-400 font-bold">•</span> River stage rising rapidly (+0.40 m/h)</li>
                  <li className="flex items-center gap-2"><span className="text-orange-400 font-bold">•</span> Saturated mountain catchment slopes (82%)</li>
                </ul>
              </div>
              <div className="fp rounded-xl p-4 space-y-2">
                <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">ROUTE STATUS &amp; INTEGRITY</div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Route Classification:</span>
                    <span className="font-bold text-emerald-400">CANDIDATE ROUTE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Surface Safety:</span>
                    <span className="text-amber-300 font-bold">SAFETY NOT VERIFIED</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>Data Freshness:</span>
                    <span className="text-cyan-300 font-bold">UPDATED 3 MIN AGO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Interactive Simulation Sandbox ── */}
          {!emergencyMode && (
            <div className="fp rounded-2xl p-5 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  SIMULATION &amp; STRESS TEST CONTROLS (DEMO SANDBOX)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">SECTION 78 COMPLIANCE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 mb-1.5 block">Simulate User Exposure Level:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Outside', 'Near', 'High', 'Extreme'].map((lbl, idx) => (
                      <button
                        key={lbl}
                        onClick={() => setSimulatedExposureStage(idx)}
                        className={`p-2 rounded-xl text-[11px] font-bold font-mono transition transform active:scale-95 ${
                          simulatedExposureStage === idx
                            ? 'btn-primary text-white shadow-md'
                            : 'fp text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer fp p-2.5 rounded-xl">
                    <input
                      type="checkbox"
                      checked={sensorFailure}
                      onChange={(e) => setSensorFailure(e.target.checked)}
                      className="w-4 h-4 accent-cyan-400 rounded"
                    />
                    <span className="text-slate-200 text-[11px]">Simulate Upstream Sensor Blackout (Degraded Guidance)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ── Candidate Routes List ── */}
          <div className="fp fp-operational rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  CANDIDATE LOWER-EXPOSURE PATHS
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Route safety is NOT guaranteed. Evaluated against active flood boundaries and known bridge status.
                </p>
              </div>
              <span className="chip chip-demo">NO &apos;SAFE ROUTE&apos; CLAIMS</span>
            </div>

            <div className="space-y-3">
              {candidateRoutes.map((rt) => (
                <div
                  key={rt.id}
                  className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                    rt.blocked
                      ? 'fp-critical text-slate-300'
                      : rt.status === 'ROUTE_SAFETY_NOT_VERIFIED'
                      ? 'fp text-amber-200'
                      : 'fp text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{rt.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-lg font-mono text-[10px] font-bold ${
                      rt.blocked
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : rt.status === 'ROUTE_SAFETY_NOT_VERIFIED'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                    }`}>
                      {rt.status}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono">
                    Distance: {rt.distance} | Gradient: {rt.elevation}
                  </div>
                  <div className="text-slate-300 text-xs italic bg-slate-950/60 p-2.5 rounded-xl">
                    {rt.note}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Rescue & Help Dispatch ── */}
          <div className="fp rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Emergency Assistance &amp; Rescue Dispatch
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Share authorized coordinates with local disaster response team or call national emergency.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setRescueRequested(true);
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('open-emergency-modal'));
                  }
                }}
                className="btn-danger px-5 py-3 text-white rounded-xl text-xs font-black font-mono tracking-wider transition flex items-center gap-2 shadow-2xl active:scale-95 animate-pulse"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>🚨 DISPATCH RESCUE &amp; CALL HELPLINE</span>
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
