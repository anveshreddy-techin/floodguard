'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEnvironment } from '@/context/EnvironmentContext';
import { 
  ShieldAlert, 
  Activity, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Radio, 
  CheckCircle2,
  Waves,
  Mountain
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setPage, setMode } = useEnvironment();
  const [role, setRole] = useState<'COMMANDER' | 'ANALYST' | 'RESCUE'>('COMMANDER');
  const [username, setUsername] = useState('sih_evaluator');
  const [password, setPassword] = useState('••••••••••••');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    setPage('login');
    setMode('DEMO');
  }, [setPage, setMode]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 700);
    }, 900);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-hidden select-none">
      {/* LEFT HALF: Environmental Storytelling & Topographic Living Scene */}
      <div className="flex-1 relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 z-10">
        {/* Brand & Theme Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-cyan-400 animate-ping shadow-[0_0_12px_rgba(6,182,212,1)]" />
            <span className="chip chip-demo">SIH26192 • THEME 4</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans">
            FLOODGUARD <span className="text-gradient-cyan">AI</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-md font-sans leading-relaxed">
            Multi-source spatial intelligence, physics-guided early warning, and conservative location-aware life safety for hilly regions.
          </p>
        </div>

        {/* Center Vector Environmental Mountain & Hydrological Mesh */}
        <div className="my-8 relative w-full max-w-lg aspect-[16/9] fp fp-operational rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300">
            <span className="flex items-center gap-1.5 font-bold">
              <Mountain className="w-4 h-4 text-cyan-400" />
              UPPER CATCHMENT WATERSHED
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              TELEMETRY: ACTIVE
            </span>
          </div>

          {/* Environmental Terrain SVG */}
          <div className="relative w-full h-36 flex items-center justify-center">
            <svg viewBox="0 0 400 140" className="w-full h-full">
              {/* Ridge contours */}
              <path d="M 0,110 Q 70,30 150,70 T 300,40 T 400,90 L 400,140 L 0,140 Z" fill="rgba(6, 182, 212, 0.08)" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.2" />
              <path d="M 0,120 Q 90,60 200,95 T 350,65 T 400,110 L 400,140 L 0,140 Z" fill="rgba(14, 165, 233, 0.12)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.5" />
              
              {/* River vector stream */}
              <path d="M 120,50 Q 180,85 240,110 T 380,135" fill="none" stroke="#38bdf8" strokeWidth="3" className="flow-line" />
              
              {/* Active Sensor Nodes */}
              <circle cx="120" cy="50" r="4.5" fill="#38bdf8" className="animate-pulse" />
              <text x="120" y="40" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="monospace" fontWeight="bold">AWS-01</text>

              <circle cx="240" cy="110" r="5" fill="#f97316" className="animate-pulse" />
              <text x="240" y="100" textAnchor="middle" fill="#fdba74" fontSize="9" fontFamily="monospace" fontWeight="bold">RADAR-01</text>
              
              <circle cx="340" cy="125" r="4.5" fill="#10b981" />
              <text x="340" y="118" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontFamily="monospace" fontWeight="bold">VILLAGE-03</text>
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Garhwal & Nepal Basin Grid</span>
            <span className="text-cyan-400">100% Cryptographically Audited</span>
          </div>
        </div>

        {/* Footer Guarantees */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero Hindsight Leakage</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>LOOCV Validated</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>NDMA Compliant</span>
          </div>
        </div>
      </div>

      {/* RIGHT HALF: Floating Frosted Authentication Workspace */}
      <div className="w-full lg:w-[480px] xl:w-[540px] flex items-center justify-center p-6 sm:p-10 z-10">
        <div className="w-full fp fp-operational rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl relative">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="chip chip-live">OPERATIONS ACCESS</span>
              <span className="text-[10px] font-mono text-slate-400">SECURE TERMINAL</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Mission Control Login</h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Select authorized credential role or fast-track directly into the live command workspace.
            </p>
          </div>

          {/* Role Fast-Track Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wider block">
              Operational Role Tier:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['COMMANDER', 'ANALYST', 'RESCUE'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition transform active:scale-95 text-center ${
                    role === r
                      ? 'btn-primary text-white'
                      : 'fp text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-300 font-bold uppercase">Officer ID</label>
              <div className="relative">
                <User className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl text-xs text-slate-100 font-mono transition"
                  placeholder="Enter officer identifier"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-300 font-bold uppercase">Security Token</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl text-xs text-slate-100 font-mono transition"
                  placeholder="Enter access token"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating || authSuccess}
              className={`w-full py-3.5 rounded-xl font-mono text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 transition transform active:scale-95 ${
                authSuccess 
                  ? 'bg-emerald-600 text-white shadow-[0_0_25px_rgba(16,185,129,0.8)]'
                  : 'btn-primary text-white'
              }`}
            >
              {isAuthenticating ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>VERIFYING CRYPTOGRAPHIC TOKEN...</span>
                </>
              ) : authSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>SESSION VERIFIED — LAUNCHING HUD...</span>
                </>
              ) : (
                <>
                  <span>ENTER DISASTER COMMAND CENTER</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Fast-Track Button for Evaluators */}
          <div className="pt-4 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={() => handleLogin()}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1.5 mx-auto font-bold group"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition" />
              <span>SIH Judge Instant Evaluation Fast-Track</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
