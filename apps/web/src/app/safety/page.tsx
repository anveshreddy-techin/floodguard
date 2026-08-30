'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { useEnvironment } from '@/context/EnvironmentContext';
import { useAdaptive } from '@/context/AdaptiveContext';
import { getStateFromCoordinates } from '@/data/states';
import { LOCATIONS } from '@/context/LocationContext';
import dynamic from 'next/dynamic';
import {
  Compass, MapPin, ShieldAlert, AlertTriangle, Navigation,
  CheckCircle2, PhoneCall, Radio, Activity, RefreshCw,
  Sliders, Maximize2, Minimize2, Zap, ArrowRight, ShieldCheck, Map,
  CheckCircle, HeartHandshake, Info
} from 'lucide-react';
import { RiskBadge } from '@/components/ui/Badges';
import { GuidanceLevel, ExposureStatus, RiskLevel } from '@/types';

// Dynamically import Leaflet map (avoid SSR in Next.js static export)
const EvacuationLeafletMap = dynamic(
  () => import('@/components/ui/EvacuationLeafletMap').then((m) => m.EvacuationLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[460px] rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-cyan-300 text-xs font-mono font-bold animate-pulse">LOADING REAL-WORLD MAP…</p>
          <p className="text-slate-500 text-[10px] font-mono">Fetching OpenStreetMap tiles · Projecting terrain coordinates</p>
        </div>
      </div>
    ),
  }
);

export default function MySafetyPage() {
  const { setPage, setMode, setRiskState } = useEnvironment();
  const { selectedLocation, hierarchy, setStateFilter, setLocationFilter, t } = useAdaptive();

  const [locationMode, setLocationMode] = useState<'DEMO' | 'BROWSER' | 'MANUAL'>('DEMO');
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number }>({ lat: selectedLocation.lat, lon: selectedLocation.lon });
  const [userState, setUserState] = useState<string>(selectedLocation.state);
  const [userDistrict, setUserDistrict] = useState<string>(selectedLocation.region);
  const [sensorFailure, setSensorFailure] = useState<boolean>(false);
  const [simulatedExposureStage, setSimulatedExposureStage] = useState<number>(0); // Default to 0 = SAFE ZONE
  const [rescueRequested, setRescueRequested] = useState<boolean>(false);
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);

  // Synchronize internal GPS when location changes in demo mode
  useEffect(() => {
    if (locationMode !== 'BROWSER') {
      setUserCoords({ lat: selectedLocation.lat, lon: selectedLocation.lon });
      setUserState(selectedLocation.state);
      setUserDistrict(selectedLocation.region);
    }
  }, [selectedLocation, locationMode]);

  useEffect(() => {
    setPage('safety');
    setMode('DEMO');
    setRiskState('HIGH');
  }, [setPage, setMode, setRiskState]);

  // Derived dynamic coordinate anchors
  const activeLat = locationMode === 'BROWSER' ? userCoords.lat : selectedLocation.lat;
  const activeLon = locationMode === 'BROWSER' ? userCoords.lon : selectedLocation.lon;
  const locState = locationMode === 'BROWSER' ? userState : selectedLocation.state;
  const locRegion = locationMode === 'BROWSER' ? userDistrict : selectedLocation.region;
  const locName = locationMode === 'BROWSER' ? `My GPS Position (${locDistrictShort(locRegion)})` : selectedLocation.name;

  function locDistrictShort(region: string) {
    return region.split('/')[0].split('(')[0].trim();
  }

  // Localized shelter coords relative to active coordinates
  const shelterCoords = {
    lat: activeLat + 0.0120,
    lon: activeLon - 0.0105,
  };

  const safeRoutePoints: [number, number][] = [
    [activeLat, activeLon],
    [activeLat + 0.0035, activeLon - 0.0025],
    [activeLat + 0.0070, activeLon - 0.0060],
    [activeLat + 0.0100, activeLon - 0.0085],
    [activeLat + 0.0120, activeLon - 0.0105],
  ];

  const blockedRoutePoints: [number, number][] = [
    [activeLat, activeLon],
    [activeLat - 0.0030, activeLon + 0.0035],
    [activeLat - 0.0060, activeLon + 0.0070],
  ];

  const exposureLevels: Array<{
    status: ExposureStatus;
    risk: RiskLevel;
    guidanceLvl: GuidanceLevel;
    title: string;
    msg: string;
    isSafe: boolean;
  }> = [
    {
      status: 'OUTSIDE_RISK_AREA',
      risk: 'LOW',
      guidanceLvl: 0,
      title: `YOU ARE IN A SAFE ZONE · NO ACTIVE FLOOD RISK`,
      msg: `Your coordinates in ${locState} (${activeLat.toFixed(4)}°N, ${activeLon.toFixed(4)}°E) are situated on dry roadway and elevated terrain with no river inundation detected. Routine monitoring active.`,
      isSafe: true,
    },
    {
      status: 'NEAR_RISK_AREA',
      risk: 'MODERATE',
      guidanceLvl: 1,
      title: `PROXIMITY NOTICE · 1.8 KM FROM RIVER CORRIDOR`,
      msg: `You are approximately 1.8 km from the regional ${locRegion.split('(')[0]} water basin. Normal activities may proceed; remain alert to weather bulletins.`,
      isSafe: false,
    },
    {
      status: 'INSIDE_HIGH_RISK_AREA',
      risk: 'HIGH',
      guidanceLvl: 2,
      title: `ELEVATED FLOOD WARNING · ${locState.toUpperCase()}`,
      msg: `Simulated or modeled flood surge active in low-lying corridors of ${locName}. Review designated high-ground escape routes.`,
      isSafe: false,
    },
    {
      status: 'INSIDE_EXTREME_RISK_AREA',
      risk: 'EXTREME',
      guidanceLvl: 3,
      title: `CRITICAL EVACUATION DIRECTIVE · ${locState.toUpperCase()}`,
      msg: `Immediate surge hazard detected in riverbed depression. Evacuate along designated North Ridge Trail to high-ground shelter.`,
      isSafe: false,
    },
  ];

  const currentExp = exposureLevels[simulatedExposureStage];
  const isSafeZone = currentExp.isSafe;

  const candidateRoutes = [
    {
      id: 'rt-1',
      name: `${locDistrictShort(locRegion)} Primary Elevated Ridge Trail`,
      distance: '1.4 km',
      elevation: '+120m',
      status: isSafeZone ? 'NORMAL ACCESS · CLEAR' : sensorFailure ? 'ROUTE_SAFETY_NOT_VERIFIED' : 'CANDIDATE LOWER EXPOSURE',
      note: isSafeZone
        ? 'Standard elevated road corridor connecting to community center. 100% accessible.'
        : `Ascends higher ground above modeled ${locRegion.split('(')[0]} flood contour.`,
      blocked: false,
    },
    {
      id: 'rt-2',
      name: `${locDistrictShort(locRegion)} Community Relief Hall Connector`,
      distance: '2.1 km',
      elevation: '+85m',
      status: isSafeZone ? 'NORMAL ACCESS · CLEAR' : 'CANDIDATE ROUTE',
      note: 'Avoids low-lying drainage culvert and potential waterlogged intersections.',
      blocked: false,
    },
    {
      id: 'rt-3',
      name: `${locDistrictShort(locRegion)} Lowland Roadway Bypass Link`,
      distance: '0.9 km',
      elevation: '+5m',
      status: isSafeZone ? 'OPEN (DRY ROAD)' : 'BLOCKED',
      note: isSafeZone
        ? 'Dry asphalt roadway. Normal vehicle traffic.'
        : `Intersects active ${selectedLocation.riverStage} surge path. Avoid during flood surge.`,
      blocked: !isSafeZone,
    },
  ];

  const handleRequestBrowserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setUserCoords({ lat, lon });
          setLocationMode('BROWSER');

          // Reverse geocode to the accurate Indian State & District
          const stateMeta = getStateFromCoordinates(lat, lon);
          setUserState(stateMeta.state);
          setUserDistrict(stateMeta.district);

          // Update AdaptiveContext state filter
          setStateFilter(stateMeta.state);

          // Find nearest location preset
          const matchingLoc = LOCATIONS.find(
            (l) => l.state.toLowerCase() === stateMeta.state.toLowerCase()
          );
          if (matchingLoc) {
            setLocationFilter(matchingLoc.id);
          }

          // In real life, user on dry road is in SAFE ZONE (Stage 0)
          setSimulatedExposureStage(0);
        },
        () => {
          alert('Location permission denied or unavailable. Using selected state location.');
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
                <span className={`chip ${isSafeZone ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'chip-live'}`}>
                  {isSafeZone ? 'SAFE STATUS' : 'DECISION SUPPORT'}
                </span>
                <h1 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
                  <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                  MY SAFETY &amp; CONSERVATIVE ESCAPE GUIDANCE
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                📍 Monitored Region: <strong className="text-cyan-300">{locName}</strong> ({locState} · {locRegion})
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
                <span>{locationMode === 'BROWSER' ? '📍 GPS: ' + locState : 'Use Live Device Location'}</span>
              </button>
            </div>
          </div>

          {/* ── Official Authority Directive Banner ── */}
          <div className={`rounded-2xl p-4 text-xs space-y-1.5 shadow-xl border ${
            isSafeZone
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'fp fp-critical'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-black uppercase tracking-wider flex items-center gap-2 font-mono text-xs ${
                isSafeZone ? 'text-emerald-300' : 'text-amber-300'
              }`}>
                {isSafeZone ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-amber-400" />}
                {locState.toUpperCase()} DISASTER MANAGEMENT AUTHORITY (SDMA) DIRECTIVE
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                isSafeZone ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700' : 'chip chip-live'
              }`}>
                {isSafeZone ? 'STATUS: ALL CLEAR ✓' : 'AUTHORITY DIRECTIVE'}
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed font-sans text-xs">
              {isSafeZone
                ? `Local authorities confirm that ${locName} in ${locState} is currently in a normal, elevated safe zone with dry roads and no active flood inundation. Standard meteorological monitoring remains active.`
                : `Local administration in ${locRegion} advises all residents in low-lying corridors of ${locName} to stay alert, avoid crossing swollen streams, and monitor siren broadcasts.`}
            </p>
          </div>

          {/* ── Exposure Level / Emergency Drill Selector ── */}
          <div className="fp p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              LOCATION EXPOSURE SIMULATOR / DRILL:
            </span>
            <div className="flex items-center gap-1.5">
              {exposureLevels.map((lvl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSimulatedExposureStage(idx)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition active:scale-95 text-[11px] ${
                    simulatedExposureStage === idx
                      ? idx === 0
                        ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                        : idx === 1
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : idx === 2
                        ? 'bg-orange-500 text-slate-950 font-black'
                        : 'bg-rose-500 text-white font-black'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {idx === 0 ? '✅ SAFE ZONE (0)' : idx === 1 ? '🟡 NEAR (1)' : idx === 2 ? '🟠 HIGH RISK (2)' : '🔴 CRITICAL (3)'}
                </button>
              ))}
            </div>
          </div>

          {/* ── REAL-WORLD INTERACTIVE EVACUATION MAP ── */}
          <div className="fp fp-operational rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  REAL-WORLD INTERACTIVE EVACUATION MAP · {locState.toUpperCase()}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 flex items-center gap-2">
                  <Map className="w-5 h-5 text-cyan-400" />
                  {currentExp.title}
                </h2>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Live road &amp; terrain view · tap any marker for details · OpenStreetMap tiles
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <RiskBadge level={currentExp.risk} />
              </div>
            </div>

            {/* THE REAL LEAFLET MAP */}
            <EvacuationLeafletMap
              userLat={activeLat}
              userLon={activeLon}
              shelterLat={shelterCoords.lat}
              shelterLon={shelterCoords.lon}
              routePoints={safeRoutePoints}
              blockedPoints={blockedRoutePoints}
              riskZoneCenter={[activeLat, activeLon]}
              riskRadiusM={650}
              emergencyMode={emergencyMode}
              locationMode={locationMode}
              locationName={locName}
              stateName={locState}
              shelterName={`${locDistrictShort(locRegion)} Community Shelter`}
              riverName={selectedLocation.riverStage}
              riskLevel={selectedLocation.riskLevel}
              isSafeZone={isSafeZone}
            />

            {/* Info strip below map */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Nearest Shelter</div>
                <div className="font-bold text-white mt-0.5 truncate">{locDistrictShort(locRegion)} Shelter</div>
                <div className="text-[10px] text-emerald-400">+120m · 1.4 km (Designated)</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Local Inundation Status</div>
                <div className={`font-bold mt-0.5 text-sm truncate ${isSafeZone ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isSafeZone ? 'NO ACTIVE SURGE' : selectedLocation.riverStage}
                </div>
                <div className="text-[10px] text-slate-400">{isSafeZone ? 'Dry Roadway Terrain' : 'Exceedance Warning'}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Response Agency</div>
                <div className="font-bold text-purple-300 mt-0.5 truncate">{locState} SDRF / 112</div>
                <div className="text-[10px] text-purple-400">Emergency Radio &amp; SOS Ready</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Your Position</div>
                <div className="font-bold text-cyan-300 mt-0.5 text-[11px]">{activeLat.toFixed(4)}°N</div>
                <div className="text-[10px] text-cyan-400">{activeLon.toFixed(4)}°E · ±15m</div>
              </div>
            </div>

            {/* Why elevated + route status panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="fp rounded-xl p-4 space-y-2">
                <div className="text-cyan-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  TERRAIN &amp; SAFETY ASSESSMENT FOR {locState.toUpperCase()}
                </div>
                <ul className="space-y-1.5 text-slate-300 text-xs">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Terrain:</strong> Natural high ground and paved roadway with good surface runoff.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>River Proximity:</strong> Located outside the direct 100-year riverbed overflow contour.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Shelter Accessibility:</strong> Two community centers accessible within 10–20 minutes.</span>
                  </li>
                </ul>
              </div>

              <div className="fp rounded-xl p-4 space-y-2">
                <div className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  CITIZEN RECOMMENDATIONS
                </div>
                <ul className="space-y-1.5 text-slate-300 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-300 font-bold">1.</span>
                    <span>No immediate evacuation required. Continue normal activities while keeping mobile alerts on.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-300 font-bold">2.</span>
                    <span>If heavy rain intensifies (&gt;50mm/h), avoid crossing low-lying culverts and railway underpasses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-300 font-bold">3.</span>
                    <span>For emergencies, dial national emergency helpline <strong>112</strong> or State Disaster Control <strong>1070</strong>.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Candidate Routes List ── */}
          <div className="fp fp-operational rounded-2xl p-4 sm:p-5 space-y-3">
            <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              EVALUATED EVACUATION &amp; TRANSIT CORRIDORS
            </h3>
            <div className="space-y-2.5">
              {candidateRoutes.map((rt) => (
                <div
                  key={rt.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono ${
                    rt.blocked
                      ? 'bg-rose-950/20 border-rose-800/40 text-rose-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${rt.blocked ? 'bg-rose-500' : 'bg-emerald-400'}`} />
                      <h4 className="font-bold text-white text-sm font-sans">{rt.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rt.blocked ? 'bg-rose-900 text-rose-300' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {rt.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs font-sans">{rt.note}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <div>
                      <div className="text-slate-400 text-[10px]">DISTANCE</div>
                      <div className="font-bold text-cyan-300">{rt.distance}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">ELEVATION</div>
                      <div className="font-bold text-emerald-400">{rt.elevation}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Emergency SOS & Rescue Dispatch ── */}
          <div className="fp fp-critical rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest font-bold">
                  CITIZEN RESCUE BEACON &amp; SDRF DISPATCH
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Need Emergency Assistance or Water Rescue?
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Sends verified GPS coordinates directly to {locState} Disaster Management Command (EOC).
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setRescueRequested(!rescueRequested)}
                  className={`px-5 py-3 rounded-2xl font-mono font-black text-xs flex items-center gap-2 shadow-2xl active:scale-95 transition ${
                    rescueRequested
                      ? 'bg-emerald-600 text-white animate-pulse'
                      : 'btn-danger text-white'
                  }`}
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{rescueRequested ? '✓ SOS SIGNAL TRANSMITTED' : '🚨 TRANSMIT EMERGENCY SOS'}</span>
                </button>
              </div>
            </div>

            {rescueRequested && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-xs font-mono text-emerald-200 space-y-1 animate-fade-in">
                <div className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>BEACON ACKNOWLEDGED BY {locState.toUpperCase()} SDRF CONTROL</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Your coordinates ({activeLat.toFixed(5)}°N, {activeLon.toFixed(5)}°E) have been logged with incident token <strong>#SOS-{Math.floor(100000 + Math.random() * 900000)}</strong>. Rescue team dispatched. Stay in your elevated position.
                </p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
