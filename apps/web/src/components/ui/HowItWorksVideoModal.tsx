'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Play, Pause, RotateCcw, X, ShieldAlert, CheckCircle2,
  Volume2, VolumeX, Sparkles, Video, ArrowRight,
  Database, Activity, Bell, Compass, Building2, MapPin, Copy, Check
} from 'lucide-react';

const STAGES = [
  {
    time: 'T - 60 Min',
    phase: '1. PHYSICAL CONVERGENCE',
    icon: '🌧️',
    title: 'Extreme Rainfall + Soil Saturation + Steep Terrain',
    desc: 'Intense orographic precipitation (48mm in 3h) falls on 28° steep mountain slopes. Catchment soil saturation reaches 82%, leaving zero infiltration buffer and causing 85% of rainfall to become rapid overland runoff.',
    pillar: 'Rainfall + Soil Saturation + Slope FoS'
  },
  {
    time: 'T - 42 Min',
    phase: '2. IOT REAL-TIME DETECTION',
    icon: '📡',
    title: 'Hardware Sensor Mesh Detects Upstream Surge',
    desc: 'Ridge AWS-001 rain gauges, mid-slope TDR soil moisture probes, and river FMCW radar detect rapid stage rise (+0.40 m/h) and geophone seismic vibrations. Low-latency LoRaWAN telemetry streams directly to the AI Engine.',
    pillar: 'Hardware IoT Telemetry Mesh'
  },
  {
    time: 'T - 35 Min',
    phase: '3. HYPER-LOCAL WARD WARNING',
    icon: '🚨',
    title: 'Village & Ward-Level Multi-Stage Alert Issued',
    desc: 'The AI model computes a composite 88% Flash Flood Risk and transmits targeted Common Alerting Protocol (CAP) messages. Ward 1 (Riverbed Cluster) and Ward 4 receive Level 4 Evacuation Orders, while high ground receives advisory alerts.',
    pillar: 'Ward-Level Micro Warnings'
  },
  {
    time: 'T - 15 Min',
    phase: '4. EVACUATION & SAFE HAVEN',
    icon: '🛡️',
    title: 'Citizens Evacuate via Verified Non-Inundated Routes',
    desc: 'Citizens follow real-time dynamic escape vectors (North Ridge Trail, avoiding flooded culverts) to reach the designated Govt. High School shelter (+120m elevation gain, 650 capacity). Zero casualties recorded.',
    pillar: 'Actionable Lead Time & Prevention'
  }
];

export const HowItWorksVideoModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-how-it-works-modal', handleOpen);
    return () => window.removeEventListener('open-how-it-works-modal', handleOpen);
  }, []);

  // Auto-advance timeline when playing
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  const copyScriptPrompt = () => {
    const script = `AI VIDEO GENERATION PROMPT (Runway Gen-3 / Sora / Luma / Kling):

Title: FloodGuard AI - Himalayan Flash Flood Prevention Workflow
Style: Photorealistic, cinematic documentary, 4k 60fps, Unreal Engine 5 aesthetic, dynamic camera pans.

Scene 1 (0-15s): Extreme high-altitude Himalayan storm clouds. Torrents of rain lash mountain ridges. Soil moisture sensors glow with volumetric moisture data. Steep mountain slopes funnel runoff into narrow river gorge.
Scene 2 (15-30s): Extreme close-up of IoT sensor constellation: non-contact radar gauging surging river water, solar-powered LoRaWAN transmitter pulsing cyan telemetry waves to cloud satellite.
Scene 3 (30-45s): Himalayan stone village. Smartphones in villagers' hands light up simultaneously with emergency siren: "FLOODGUARD AI ALERT: Flash Flood in 42 Minutes - Evacuate Ward 1 & 4". Local village sarpanch activates community sirens.
Scene 4 (45-60s): Wide drone shot showing villagers walking peacefully along an elevated green illuminated mountain trail up toward a solid concrete hilltop high school shelter. Below them in the valley, violent brown debris flood waters surge harmlessly past empty riverbanks. Text overlay: "Predict. Alert. Save. Prove. 0 Casualties."`;
    navigator.clipboard.writeText(script);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  if (!isOpen) return null;

  const current = STAGES[activeStage];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#091124] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-[#070f24] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-wide text-white flex items-center gap-2">
                HOW FLOODGUARD AI PREVENTS DISASTERS
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-mono font-bold">
                  AI SIMULATION
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Physical Convergence • Real-Time IoT Telemetry • Hyper-Local Evacuation
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Main Hero Visual Video Screen */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-video shadow-2xl group">
            <Image
              src="/images/floodguard_prevention_workflow.jpg"
              alt="FloodGuard AI Disaster Prevention Workflow"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />

            {/* Glowing Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />

            {/* Top Stage Indicator Pill */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-cyan-500/50 text-cyan-300 text-xs font-mono font-black flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>{current.time}</span>
                <span className="text-slate-500">|</span>
                <span>{current.phase}</span>
              </span>
            </div>

            {/* Video Controls Bar */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-slate-700 p-1 rounded-xl">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition active:scale-95"
                title={isPlaying ? 'Pause simulation' : 'Play simulation'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
              <button
                onClick={() => { setActiveStage(0); setIsPlaying(true); }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95"
                title="Restart simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Current Narrative Subtitle Overlay */}
            <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <span>{current.icon}</span>
                  <span>{current.title}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-500/40 text-[10px] font-bold">
                  {current.pillar}
                </span>
              </div>
              <p className="text-slate-200 text-xs sm:text-[13px] leading-relaxed font-sans">
                {current.desc}
              </p>
            </div>
          </div>

          {/* Interactive 4-Stage Timeline Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {STAGES.map((st, idx) => {
              const isActive = activeStage === idx;
              return (
                <button
                  key={idx}
                  onClick={() => { setActiveStage(idx); setIsPlaying(false); }}
                  className={`p-2.5 rounded-xl border text-left transition-all relative ${
                    isActive
                      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/40'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                  <span className="text-[10px] font-mono font-bold text-cyan-300 block">{st.time}</span>
                  <span className="text-xs font-bold text-white block mt-0.5 leading-tight">{st.phase}</span>
                </button>
              );
            })}
          </div>

          {/* Prevention Impact Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block font-mono">ACTIONABLE LEAD TIME</span>
              <span className="text-lg font-black text-cyan-300 font-mono">42 Minutes</span>
              <span className="text-[9px] text-slate-500 block">Surge pre-warning</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block font-mono">PHYSICAL ACCURACY</span>
              <span className="text-lg font-black text-emerald-400 font-mono">4 Physical Pillars</span>
              <span className="text-[9px] text-slate-500 block">Rain + Soil + Slope + History</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block font-mono">WARD RESOLUTION</span>
              <span className="text-lg font-black text-amber-300 font-mono">Micro-Ward</span>
              <span className="text-[9px] text-slate-500 block">Sub-village precision</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block font-mono">CASUALTY REDUCTION</span>
              <span className="text-lg font-black text-rose-400 font-mono">0 Casualties Target</span>
              <span className="text-[9px] text-slate-500 block">Safe shelter arrival</span>
            </div>
          </div>

          {/* Copy Prompt for AI Video Generator */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Want to generate this in Runway Gen-3, Luma Dream Machine, Sora, or Kling?
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Copy our production-ready, scene-by-scene 60-second video generation prompt.
              </p>
            </div>

            <button
              onClick={copyScriptPrompt}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
              <span>{isCopied ? 'Copied Prompt!' : 'Copy Video Prompt'}</span>
            </button>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-slate-800 bg-[#070f24] shrink-0 text-xs">
          <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
            SIH26192 Disaster Intelligence Platform
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Link
              href="/safety"
              onClick={() => setIsOpen(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
            >
              View Evacuation Routes
            </Link>
            <Link
              href="/village/loc-uk-chamoli"
              onClick={() => setIsOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1 shadow-sm"
            >
              <span>Explore Village Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
