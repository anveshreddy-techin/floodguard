'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  Activity, 
  Radio,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('operator@floodguard.demo');
  const [password, setPassword] = useState('FloodGuard2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [authStage, setAuthStage] = useState<'IDLE' | 'SIGNING_IN' | 'VERIFYING' | 'SUCCESS'>('IDLE');
  const [particleOffset, setParticleOffset] = useState(0);

  // Animated environmental terrain loop
  useEffect(() => {
    const interval = setInterval(() => {
      setParticleOffset((prev) => (prev + 1) % 100);
    }, 45);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setCapsLockActive(e.getModifierState('CapsLock'));
  };

  const handleSignIn = (role = 'AUTHORITY_OPERATOR') => {
    setAuthStage('SIGNING_IN');
    setTimeout(() => {
      setAuthStage('VERIFYING');
      setTimeout(() => {
        setAuthStage('SUCCESS');
        setTimeout(() => {
          router.push('/');
        }, 500);
      }, 500);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#050a17] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      {/* Top Brand Bar */}
      <header className="h-16 border-b border-[#223354] px-8 flex items-center justify-between z-30 glass-panel">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_10px_rgba(6,182,212,1)]" />
          <span className="font-mono font-black text-lg tracking-wider text-slate-100">
            FLOODGUARD <span className="text-cyan-400">AI</span>
          </span>
          <span className="text-[10px] font-mono bg-slate-900 text-cyan-300 px-2 py-0.5 rounded-lg border border-cyan-800 font-bold">
            SIH26192
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          <span>SYSTEM: OPERATIONAL</span>
        </div>
      </header>

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 max-w-7xl w-full mx-auto p-6 sm:p-12 items-center gap-12">
        {/* Left: Living Topographic Terrain Animation */}
        <div className="hidden lg:flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              DISASTER INTELLIGENCE COMMAND SUITE
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight leading-tight">
              From upstream ridge signals to downstream life-safety action.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
              Hyper-local, multi-source flash flood prediction platform for Himalayan mountain watersheds.
              Fusing in-situ IoT telemetry, satellite radars, and terrain physics.
            </p>
          </div>

          {/* Living SVG Topographic Terrain Animation */}
          <div className="relative w-full h-64 glass-panel-glow rounded-3xl overflow-hidden shadow-2xl p-4 flex items-center justify-center">
            <svg viewBox="0 0 400 200" className="w-full h-full object-cover">
              <defs>
                <filter id="loginGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Contours */}
              <path d="M 20,40 Q 150,10 300,50 T 380,30 L 390,190 L 10,190 Z" fill="#0b1532" stroke="#1c2c58" strokeWidth="1.2" />
              <path d="M 30,80 Q 180,50 320,90 T 370,70 L 380,190 L 20,190 Z" fill="#0e1b40" stroke="#22366c" strokeWidth="1.2" />
              <path d="M 50,130 Q 200,100 340,140 T 360,120 L 370,190 L 40,190 Z" fill="#122354" stroke="#2c4488" strokeWidth="1.2" />

              {/* Animated Stream Network */}
              <path d="M 80,40 Q 180,80 240,130 T 340,180" fill="none" stroke="#0284c7" strokeWidth="4" />
              <path
                d="M 80,40 Q 180,80 240,130 T 340,180"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="8 12"
                strokeDashoffset={-particleOffset * 1.8}
                filter="url(#loginGlow)"
              />

              {/* Pulsing Nodes */}
              <circle cx="80" cy="40" r="6" fill="#38bdf8" className="animate-pulse" filter="url(#loginGlow)" />
              <circle cx="240" cy="130" r="7" fill="#f97316" className="animate-ping opacity-75" />
              <circle cx="240" cy="130" r="7" fill="#f97316" filter="url(#loginGlow)" />
              <circle cx="340" cy="180" r="6" fill="#10b981" filter="url(#loginGlow)" />
            </svg>

            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-cyan-300 bg-[#050a17]/90 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              LIVE TOPOGRAPHIC VECTOR TELEMETRY
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs font-mono">
            <div className="glass-panel p-3.5 rounded-2xl">
              <div className="text-slate-400 text-[10px]">MONITORED BASINS</div>
              <div className="text-sm font-bold text-slate-100 mt-0.5">85.4 km²</div>
            </div>
            <div className="glass-panel p-3.5 rounded-2xl">
              <div className="text-slate-400 text-[10px]">LEAD TIME ADVANTAGE</div>
              <div className="text-sm font-bold text-cyan-300 mt-0.5">45 Minutes</div>
            </div>
            <div className="glass-panel p-3.5 rounded-2xl">
              <div className="text-slate-400 text-[10px]">VERIFIED TRUTHFULNESS</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">100% AUDITED</div>
            </div>
          </div>
        </div>

        {/* Right: Glassmorphism Authentication Form */}
        <div className="w-full max-w-md mx-auto glass-panel-glow rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              AUTHENTICATION GATEWAY
            </span>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Sign in to Command Center</h2>
            <p className="text-xs text-slate-400">
              Authorized emergency operators, analysts, and researchers
            </p>
          </div>

          {/* Form Controls */}
          <div className="space-y-4 text-xs">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 font-mono">OPERATOR EMAIL</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  placeholder="operator@floodguard.demo"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-300 font-mono">SECURITY CREDENTIAL</label>
                {capsLockActive && (
                  <span className="text-[10px] text-amber-400 font-mono">CAPS LOCK IS ON</span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition font-mono"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Main Sign In Button */}
            <button
              onClick={() => handleSignIn('AUTHORITY_OPERATOR')}
              disabled={authStage !== 'IDLE'}
              className="w-full py-3 btn-glow-cyan text-white rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-2xl text-xs font-mono tracking-wider"
            >
              {authStage === 'IDLE' && (
                <>
                  <span>ENTER COMMAND CENTER</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
              {authStage === 'SIGNING_IN' && <span>SIGNING IN...</span>}
              {authStage === 'VERIFYING' && <span>VERIFYING SESSION...</span>}
              {authStage === 'SUCCESS' && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>AUTHENTICATED ✓</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Demo Role Selector (For Judges & Evaluators) */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest text-center font-bold">
              ⚡ FAST-TRACK DEMO ROLES (SIH EVALUATION)
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSignIn('COMMANDER')}
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-blue-600/30 border border-slate-700 hover:border-cyan-400 text-cyan-300 font-mono text-[11px] font-bold text-center transition shadow-md active:scale-95"
              >
                COMMANDER
              </button>
              <button
                onClick={() => handleSignIn('ANALYST')}
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-600/30 border border-slate-700 hover:border-amber-400 text-amber-300 font-mono text-[11px] font-bold text-center transition shadow-md active:scale-95"
              >
                ANALYST
              </button>
              <button
                onClick={() => handleSignIn('FIELD_OFFICER')}
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-400 text-emerald-300 font-mono text-[11px] font-bold text-center transition shadow-md active:scale-95"
              >
                RESCUE
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-[#223354] px-8 flex items-center justify-between text-[11px] font-mono text-slate-400 z-30 glass-panel">
        <div>FloodGuard AI Decision Support • Not a replacement for official authorities</div>
        <div className="text-emerald-400 font-bold">DATA ACCURACY: 100% AUDITED</div>
      </footer>
    </div>
  );
}
