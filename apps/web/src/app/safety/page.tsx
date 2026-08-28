'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import { 
  Compass, 
  MapPin, 
  ShieldAlert, 
  AlertTriangle, 
  Navigation, 
  CheckCircle2, 
  Home, 
  PhoneCall, 
  Radio, 
  Activity, 
  RefreshCw,
  Eye,
  Sliders,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap
} from 'lucide-react';
import { RiskBadge, UncertaintyBadge, DataModeBadge } from '@/components/ui/Badges';
import { GuidanceLevel, ExposureStatus, RiskLevel } from '@/types';

export default function MySafetyPage() {
  const [locationMode, setLocationMode] = useState<'DEMO' | 'BROWSER' | 'MANUAL'>('DEMO');
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number }>({ lat: 30.5050, lon: 79.1550 });
  const [sensorFailure, setSensorFailure] = useState<boolean>(false);
  const [hazardDistanceKm, setHazardDistanceKm] = useState<number>(0.85);
  const [simulatedExposureStage, setSimulatedExposureStage] = useState<number>(2); // 0: Outside, 1: Near, 2: High, 3: Extreme
  const [rescueRequested, setRescueRequested] = useState<boolean>(false);
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);
  const [pulseAnim, setPulseAnim] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnim((prev) => (prev + 1) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, []);

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
      status: sensorFailure ? 'ROUTE_SAFETY_NOT_VERIFIED' : 'LOWER_EXPOSURE_CANDIDATE',
      note: 'Ascends ridge above modeled flood contour. Surface safety not verified.',
      blocked: false,
    },
    {
      id: 'rt-2',
      name: 'Upper Panchayat Bhavan Connector',
      distance: '2.1 km',
      elevation: '+85m',
      status: 'CANDIDATE_ROUTE',
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
          alert('Location permission denied or unavailable. Using manual/demo position.');
          setLocationMode('DEMO');
        }
      );
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-[#050a17] text-slate-100 transition-all duration-500 select-none ${
      emergencyMode ? 'ring-8 ring-rose-600/80 shadow-[0_0_80px_rgba(244,63,94,0.4)]' : ''
    }`}>
      <Header dataMode={locationMode === 'DEMO' ? 'DEMO' : 'LIVE'} systemStatus="OPERATIONAL" />
      <div className="flex flex-1">
        {!emergencyMode && <Sidebar activeTab="safety" />}

        <main className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
          {/* Top Title & Emergency Mode Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#223354] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">
                  DECISION SUPPORT
                </span>
                <h1 className="text-xl font-black text-slate-100 flex items-center gap-2 tracking-tight">
                  <Compass className="w-6 h-6 text-cyan-400 animate-spin-slow" />
                  MY SAFETY & ESCAPE GUIDANCE HUD
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Conservative exposure assessment relative to modeled flood boundaries and terrain
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setEmergencyMode(!emergencyMode)}
                className={`px-3.5 py-2 rounded-xl font-mono text-[11px] font-bold flex items-center gap-2 transition transform active:scale-95 shadow-xl ${
                  emergencyMode
                    ? 'btn-glow-rose text-white animate-pulse'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700 hover:border-rose-500'
                }`}
              >
                {emergencyMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4 text-rose-400" />}
                <span>{emergencyMode ? 'EXIT EMERGENCY HUD' : '🚨 EMERGENCY MODE'}</span>
              </button>

              <button
                onClick={handleRequestBrowserLocation}
                className="btn-glow-cyan px-3.5 py-2 text-white rounded-xl flex items-center gap-2 font-mono text-[11px] font-bold transition shadow-xl active:scale-95"
              >
                <MapPin className="w-4 h-4 text-cyan-300" />
                <span>{locationMode === 'BROWSER' ? 'Using Device GPS' : 'Allow Device Location'}</span>
              </button>
            </div>
          </div>

          {/* Official Emergency Priority Banner */}
          <div className="bg-amber-950/70 border-2 border-amber-500/80 rounded-2xl p-4 text-xs space-y-1.5 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-300 uppercase tracking-wider flex items-center gap-2 font-mono text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                OFFICIAL STATE DISASTER MANAGEMENT GUIDANCE PRIORITY
              </span>
              <span className="px-2 py-0.5 bg-amber-900/90 text-amber-200 text-[10px] font-mono font-bold rounded-lg border border-amber-700">
                AUTHORITY DIRECTIVE
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed font-sans text-xs">
              "Local administration advises all residents in low-lying riverbanks of Upper Catchment to stay alert, avoid crossing swollen streams, and monitor local siren broadcasts."
            </p>
          </div>

          {/* Master Visual Evacuation Vector Schematic Diagram */}
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  LOCATION-AWARE EVACUATION VECTOR
                </span>
                <h2 className="text-xl font-black text-slate-100 mt-0.5 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-orange-400" />
                  {currentExp.title}
                </h2>
              </div>
              <RiskBadge level={currentExp.risk} />
            </div>

            {/* Glowing Escape Vector Path with Animated Pulse */}
            <div className="bg-[#050a17] p-8 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row items-center justify-around gap-6 shadow-inner relative overflow-hidden">
              {/* YOU Node */}
              <div className="flex flex-col items-center text-center space-y-1 z-10">
                <div className="w-16 h-16 rounded-full bg-blue-600/30 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-mono font-black text-xl animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.8)]">
                  🔵
                </div>
                <div className="font-black text-slate-100 text-sm mt-1">YOU</div>
                <div className="text-[10px] font-mono text-cyan-300">Accuracy: ±15m</div>
              </div>

              {/* Glowing Vector Connector with Travelling Wave */}
              <div className="flex-1 flex flex-col items-center justify-center space-y-2 w-full max-w-xs z-10">
                <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                  <span>1.4 km Elevated Route</span>
                </div>
                <div className="w-full h-2 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full relative shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                  <div
                    className="w-3.5 h-3.5 rounded-full bg-white absolute top-1/2 -translate-y-1/2 shadow-[0_0_12px_rgba(255,255,255,1)]"
                    style={{ left: `${pulseAnim}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-slate-400">Via North Ridge Trail</div>
              </div>

              {/* CANDIDATE SHELTER Node */}
              <div className="flex flex-col items-center text-center space-y-1 z-10">
                <div className="w-16 h-16 rounded-full bg-emerald-600/30 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 font-mono font-black text-xl shadow-[0_0_20px_rgba(16,185,129,0.8)]">
                  🟢
                </div>
                <div className="font-black text-emerald-300 text-sm mt-1">CANDIDATE SHELTER</div>
                <div className="text-[10px] font-mono text-slate-300">Community High School</div>
              </div>
            </div>

            {/* Why Panel + Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-cyan-300 font-bold uppercase tracking-wider text-[11px]">
                  WHY IS RISK ELEVATED?
                </div>
                <ul className="space-y-1.5 text-slate-300 text-xs">
                  <li className="flex items-center gap-2"><span className="text-orange-400 font-bold">•</span> Heavy localized rainfall (48mm in 3h)</li>
                  <li className="flex items-center gap-2"><span className="text-orange-400 font-bold">•</span> River stage rising rapidly (+0.40 m/h)</li>
                  <li className="flex items-center gap-2"><span className="text-orange-400 font-bold">•</span> Saturated mountain catchment slopes (82%)</li>
                </ul>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  ROUTE STATUS & INTEGRITY
                </div>
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

          {/* Interactive Simulation Sandbox */}
          {!emergencyMode && (
            <div className="glass-panel rounded-2xl p-5 text-xs space-y-3 border border-cyan-500/20">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  SIMULATION & STRESS TEST CONTROLS (DEMO SANDBOX)
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
                            ? 'btn-glow-cyan text-white shadow-md'
                            : 'bg-slate-900/90 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
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

          {/* Candidate Routes List */}
          <div className="glass-panel-glow rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  CANDIDATE LOWER-EXPOSURE PATHS
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Route safety is NOT guaranteed. Evaluated against active flood boundaries and known bridge status.
                </p>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950 border border-amber-800 px-2.5 py-0.5 rounded-lg font-bold">
                NO 'SAFE ROUTE' CLAIMS
              </span>
            </div>

            <div className="space-y-3">
              {candidateRoutes.map((rt) => (
                <div
                  key={rt.id}
                  className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                    rt.blocked
                      ? 'bg-rose-950/30 border-rose-800/80 text-slate-300'
                      : rt.status === 'ROUTE_SAFETY_NOT_VERIFIED'
                      ? 'bg-amber-950/20 border-amber-700/60 text-slate-200'
                      : 'bg-slate-900/90 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">{rt.name}</span>
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

          {/* Rescue & Help Dispatch Button */}
          <div className="glass-panel-glow rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider">
                Emergency Assistance & Rescue Dispatch
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Share authorized coordinates with local disaster response team or call national emergency.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setRescueRequested(true); alert('Rescue request dispatched to local Emergency Operations Center (EOC).'); }}
                className="btn-glow-rose px-5 py-3 text-white rounded-xl text-xs font-black font-mono tracking-wider transition flex items-center gap-2 shadow-2xl active:scale-95"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>{rescueRequested ? 'HELP DISPATCHED' : 'I NEED HELP'}</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
