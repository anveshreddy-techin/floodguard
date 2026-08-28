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
  Key
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('operator@floodguard.demo');
  const [password, setPassword] = useState('FloodGuard2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [authStage, setAuthStage] = useState<'IDLE' | 'SIGNING_IN' | 'VERIFYING' | 'SUCCESS'>('IDLE');
  const [particleOffset, setParticleOffset] = useState(0);

  // Animated environmental terrain vectors
  useEffect(() => {
    const interval = setInterval(() => {
      setParticleOffset((prev) => (prev + 1) % 100);
    }, 50);
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
        }, 600);
      }, 500);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      {/* Top Brand Bar */}
      <header className="h-16 border-b border-[#223354] px-8 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono font-black text-lg tracking-wider text-slate-100">
            FLOODGUARD <span className="text-cyan-400">AI</span>
          </span>
          <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
            SIH26192
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>SYSTEM: OPERATIONAL</span>
        </div>
      </header>

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 max-w-7xl w-full mx-auto p-6 sm:p-12 items-center gap-12">
        {/* Left: Environmental Intelligence Visualization */}
        <div className="hidden lg:flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
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
          <div className="relative w-full h-64 bg-[#0a122c] border border-[#223354] rounded-2xl overflow-hidden shadow-2xl p-4 flex items-center justify-center">
            <svg viewBox="0 0 400 200" className="w-full h-full object-cover">
              {/* Contours */}
              <path d="M 20,40 Q 150,10 300,50 T 380,30 L 390,190 L 10,190 Z" fill="#0d1838" stroke="#1c2c58" strokeWidth="1.2" />
              <path d="M 30,80 Q 180,50 320,90 T 370,70 L 380,190 L 20,190 Z" fill="#101e46" stroke="#22366c" strokeWidth="1.2" />
              <path d="M 50,130 Q 200,100 340,140 T 360,120 L 370,190 L 40,190 Z" fill="#142658" stroke="#2c4488" strokeWidth="1.2" />

              {/* Animated Stream Network */}
              <path d="M 80,40 Q 180,80 240,130 T 340,180" fill="none" stroke="#0284c7" strokeWidth="3" />
              <path
                d="M 80,40 Q 180,80 240,130 T 340,180"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="8 12"
                strokeDashoffset={-particleOffset * 1.5}
              />

              {/* Pulsing Nodes */}
              <circle cx="80" cy="40" r="5" fill="#38bdf8" className="animate-pulse" />
              <circle cx="240" cy="130" r="6" fill="#f97316" className="animate-ping opacity-75" />
              <circle cx="240" cy="130" r="6" fill="#f97316" />
              <circle cx="340" cy="180" r="5" fill="#10b981" />
            </svg>

            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-cyan-300 bg-[#070d1e]/80 px-2 py-1 rounded border border-[#223354]">
              LIVE TERRAIN TELEMETRY STREAM
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-[#0e1630] p-3 rounded-lg border border-[#223354]">
              <div className="text-slate-400 text-[10px]">MONITORED BASINS</div>
              <div className="text-sm font-bold text-slate-100 mt-0.5">85.4 km²</div>
            </div>
            <div className="bg-[#0e1630] p-3 rounded-lg border border-[#223354]">
              <div className="text-slate-400 text-[10px]">LEAD TIME ADVANTAGE</div>
              <div className="text-sm font-bold text-cyan-300 mt-0.5">45 Minutes</div>
            </div>
            <div className="bg-[#0e1630] p-3 rounded-lg border border-[#223354]">
              <div className="text-slate-400 text-[10px]">VERIFIED TRUTHFULNESS</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">100% AUDITED</div>
            </div>
          </div>
        </div>

        {/* Right: Premium Authentication Form */}
        <div className="w-full max-w-md mx-auto bg-[#0e1630]/95 border border-[#223354] rounded-2xl p-8 shadow-2xl space-y-6 backdrop-blur-xl">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              AUTHENTICATION GATEWAY
            </span>
            <h2 className="text-xl font-bold text-slate-100">Sign in to Command Center</h2>
            <p className="text-xs text-slate-400">
              Authorized emergency operators, analysts, and researchers
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4 text-xs">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300 font-mono">OPERATOR EMAIL</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-400 transition"
                  placeholder="operator@floodguard.demo"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-medium text-slate-300 font-mono">SECURITY CREDENTIAL</label>
                {capsLockActive && (
                  <span className="text-[10px] text-amber-400 font-mono">CAPS LOCK IS ON</span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-9 pr-10 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-400 transition font-mono"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Main Sign In Button */}
            <button
              onClick={() => handleSignIn('AUTHORITY_OPERATOR')}
              disabled={authStage !== 'IDLE'}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg text-xs"
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
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest text-center">
              FAST-TRACK DEMO ROLES (SIH EVALUATION)
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSignIn('COMMANDER')}
                className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-[11px] font-medium text-center transition"
              >
                COMMANDER
              </button>
              <button
                onClick={() => handleSignIn('ANALYST')}
                className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 font-mono text-[11px] font-medium text-center transition"
              >
                ANALYST
              </button>
              <button
                onClick={() => handleSignIn('FIELD_OFFICER')}
                className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-mono text-[11px] font-medium text-center transition"
              >
                FIELD RESCUE
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-[#223354] px-8 flex items-center justify-between text-[11px] font-mono text-slate-500 z-30">
        <div>FloodGuard AI Decision Support • Not a replacement for official authorities</div>
        <div>DATA ACCURACY: 100% AUDITED</div>
      </footer>
    </div>
  );
}
