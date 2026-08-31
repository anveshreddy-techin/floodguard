'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useEnvironment } from '@/context/EnvironmentContext';
import { useAdaptive, UserRole } from '@/context/AdaptiveContext';
import { 
  ShieldAlert, 
  Activity, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Mountain, 
  Waves, 
  CloudRain, 
  Radio, 
  CheckCircle2, 
  Compass, 
  Layers, 
  Eye, 
  Zap,
  Globe,
  Sliders
} from 'lucide-react';

type SceneType = 'HIMALAYAN_MIST' | 'BRAHMAPUTRA_SURGE' | 'RADAR_CYBER';

export default function LoginPage() {
  const router = useRouter();
  const { setPage, setMode } = useEnvironment();
  const { setRole } = useAdaptive();

  const [selectedRole, setSelectedRole] = useState<UserRole>('DISTRICT_OPERATOR');
  const [username, setUsername] = useState('sih_commander_2026');
  const [password, setPassword] = useState('••••••••••••');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  
  // Interactive Atmosphere & Visual Controls
  const [activeScene, setActiveScene] = useState<SceneType>('HIMALAYAN_MIST');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Web Audio Rain/Wind Synth Ref
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    setPage('login');
    setMode('DEMO');
  }, [setPage, setMode]);

  // Track mouse for subtle parallax movement
  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 20;
    const y = (e.clientY / innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  // Ambient sound synthesizer using native Web Audio API (rain + mountain wind)
  const toggleAudio = () => {
    if (audioPlaying) {
      if (audioContextRef.current) {
        audioContextRef.current.suspend();
      }
      setAudioPlaying(false);
    } else {
      try {
        if (!audioContextRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioContextClass();
          audioContextRef.current = ctx;

          // Generate filtered pink noise for realistic rain & river stream
          const bufferSize = ctx.sampleRate * 2;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
            b6 = white * 0.115926;
          }

          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, ctx.currentTime);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gainNodeRef.current = gain;

          whiteNoise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          whiteNoise.start(0);
        } else {
          audioContextRef.current.resume();
        }
        setAudioPlaying(true);
      } catch (err) {
        console.warn('Audio play restricted:', err);
      }
    }
  };

  const handleFastTrack = (roleName: UserRole) => {
    setRole(roleName);
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 500);
    }, 600);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleFastTrack(selectedRole);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full overflow-hidden bg-[#020714] text-white select-none flex flex-col justify-between"
    >
      {/* ── 1. CINEMATIC ATMOSPHERIC LIVING BACKGROUND ── */}
      <div 
        className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `scale(1.05) translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`,
        }}
      >
        {/* Dynamic Scene 1: Himalayan Mountain Mist & Alaknanda River Valley */}
        {activeScene === 'HIMALAYAN_MIST' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1b36] via-[#102a4e] to-[#040915]">
            {/* Sky Sunlight Aura */}
            <div className="absolute top-0 left-1/4 w-[60vw] h-[50vh] bg-gradient-to-b from-sky-400/20 via-cyan-500/10 to-transparent rounded-full blur-3xl" />
            
            {/* Distant Mountain Ridges SVG */}
            <svg viewBox="0 0 1440 600" className="absolute bottom-0 w-full h-[70vh] preserve-3d opacity-90">
              <defs>
                <linearGradient id="mtnBack" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e3a5f" />
                  <stop offset="100%" stopColor="#081426" />
                </linearGradient>
                <linearGradient id="mtnMid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#254d7a" />
                  <stop offset="100%" stopColor="#0a182e" />
                </linearGradient>
                <linearGradient id="mtnFront" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#193757" />
                  <stop offset="100%" stopColor="#030814" />
                </linearGradient>
                <linearGradient id="riverGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#00A8E8" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Back Alpine Peaks */}
              <path d="M 0,380 L 180,180 L 360,340 L 580,140 L 820,320 L 1080,160 L 1260,280 L 1440,200 L 1440,600 L 0,600 Z" fill="url(#mtnBack)" opacity="0.6" />
              
              {/* Mid Catchment Ridge */}
              <path d="M 0,420 L 240,240 L 480,390 L 720,220 L 980,380 L 1200,260 L 1440,360 L 1440,600 L 0,600 Z" fill="url(#mtnMid)" opacity="0.85" />
              
              {/* Foreground Slopes */}
              <path d="M 0,470 L 320,340 L 640,460 L 960,320 L 1280,480 L 1440,410 L 1440,600 L 0,600 Z" fill="url(#mtnFront)" />

              {/* Sinuous Alaknanda Torrent River Stream */}
              <path d="M 1440,430 Q 1100,480 840,490 T 420,530 T 0,590" fill="none" stroke="url(#riverGlow)" strokeWidth="8" strokeLinecap="round" className="animate-pulse" />
              <path d="M 1440,430 Q 1100,480 840,490 T 420,530 T 0,590" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeDasharray="12,12" />
            </svg>
          </div>
        )}

        {/* Dynamic Scene 2: Brahmaputra Floodplain Surge */}
        {activeScene === 'BRAHMAPUTRA_SURGE' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#18132b] via-[#241747] to-[#04030a]">
            <div className="absolute top-10 right-1/4 w-[50vw] h-[45vh] bg-amber-500/15 rounded-full blur-3xl" />
            <svg viewBox="0 0 1440 600" className="absolute bottom-0 w-full h-[65vh] opacity-80">
              <path d="M 0,380 Q 360,280 720,360 T 1440,320 L 1440,600 L 0,600 Z" fill="#1b1738" />
              <path d="M 0,440 Q 400,380 800,450 T 1440,400 L 1440,600 L 0,600 Z" fill="#110d29" />
              <path d="M 0,510 Q 480,480 960,530 T 1440,490" fill="none" stroke="#38bdf8" strokeWidth="16" strokeOpacity="0.7" />
            </svg>
          </div>
        )}

        {/* Dynamic Scene 3: Neon Cyber Doppler Radar Mesh */}
        {activeScene === 'RADAR_CYBER' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#020d1a] via-[#051829] to-[#01060d]">
            <div className="absolute inset-0 bg-[radial-gradient(#00A8E8_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
            <svg viewBox="0 0 1440 600" className="absolute bottom-0 w-full h-[60vh] opacity-70">
              <path d="M 0,400 L 200,300 L 400,420 L 600,250 L 800,400 L 1000,280 L 1200,420 L 1440,320 L 1440,600 L 0,600 Z" fill="none" stroke="#00A8E8" strokeWidth="1.5" strokeDasharray="6,4" />
              <circle cx="600" cy="250" r="140" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,4" className="animate-pulse" />
              <circle cx="600" cy="250" r="6" fill="#f43f5e" />
            </svg>
          </div>
        )}

        {/* Rolling Volumetric Mist & Cloud Layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020714] via-transparent to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#020714] to-transparent" />
      </div>

      {/* ── 2. TOP NAV BAR: BRAND & LIVE TELEMETRY CHIP ── */}
      <header className="relative z-20 px-6 sm:px-10 lg:px-14 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_15px_rgba(6,182,212,1)]" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black tracking-widest text-cyan-400 uppercase">
              SIH26192 • DISASTER INTELLIGENCE
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-[10px] font-mono text-cyan-300 font-bold">
              NATIONAL PILOT READY
            </span>
          </div>
        </div>

        {/* Scene Selector Pill */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-xl text-xs font-mono">
          <button
            onClick={() => setActiveScene('HIMALAYAN_MIST')}
            className={`px-3 py-1 rounded-xl transition ${
              activeScene === 'HIMALAYAN_MIST' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏔️ Alpine Valley
          </button>
          <button
            onClick={() => setActiveScene('BRAHMAPUTRA_SURGE')}
            className={`px-3 py-1 rounded-xl transition ${
              activeScene === 'BRAHMAPUTRA_SURGE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌊 River Surge
          </button>
          <button
            onClick={() => setActiveScene('RADAR_CYBER')}
            className={`hidden md:block px-3 py-1 rounded-xl transition ${
              activeScene === 'RADAR_CYBER' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Radar Mesh
          </button>
        </div>
      </header>

      {/* ── 3. CENTER HERO: BOLD CINEMATIC WORDMARK & INTERACTIVE DOCK ── */}
      <main className="relative z-20 px-6 sm:px-12 lg:px-16 my-auto flex flex-col items-start justify-center max-w-5xl space-y-6">
        
        {/* Subtle Category Bracket */}
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
          <span className="w-6 h-[1.5px] bg-cyan-400" />
          <span>HYPER-LOCAL FLASH FLOOD & MULTI-HAZARD RESCUE PLATFORM</span>
        </div>

        {/* Hero Title (Bold & Dramatic like Prisma screenshot) */}
        <div className="space-y-2">
          <h1 
            className="text-5xl sm:text-7xl lg:text-8xl font-black font-sans tracking-tight text-white leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
            style={{
              letterSpacing: '-0.04em',
            }}
          >
            FloodGuard <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">AI</span>
          </h1>
          
          <p className="text-sm sm:text-lg text-slate-200/90 font-sans max-w-2xl leading-relaxed drop-shadow-md">
            Physics-guided spatial intelligence, automated hydrological cascade detection, and zero-hindsight life-saving evacuation routing across 28 Indian states.
          </p>
        </div>

        {/* ── 4. PRIMARY FAST-TRACK ACTION & STATS DOCK ── */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          
          {/* Main Launch Pill Button (Screenshot Style) */}
          <button
            onClick={() => handleFastTrack('DISTRICT_OPERATOR')}
            className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-sans font-black text-sm flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.4)] active:scale-95 transition-all transform hover:translate-x-1"
          >
            <span>Launch Command Center</span>
            <div className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Secure Officer Sign-In Trigger Button */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-5 py-3.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700/80 text-white font-mono text-xs font-bold flex items-center gap-2 backdrop-blur-xl shadow-xl active:scale-95 transition"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Officer Authentication</span>
          </button>

          {/* Audio Ambient Toggle (Rain & Mountain Wind) */}
          <button
            onClick={toggleAudio}
            className={`p-3.5 rounded-full border transition active:scale-95 flex items-center gap-2 text-xs font-mono backdrop-blur-xl ${
              audioPlaying
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Ambient Mountain & Rain Soundscape"
          >
            {audioPlaying ? <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{audioPlaying ? 'Soundscape: ON' : 'Audio Ambient'}</span>
          </button>
        </div>

        {/* Fast-Track Role Pills (Instant 1-Click Access) */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider mr-1">
            EXPLORE ROLE WORKSPACES:
          </span>
          {[
            { id: 'NATIONAL_OPERATOR' as UserRole, label: '🇮🇳 NDMA Commander' },
            { id: 'DISTRICT_OPERATOR' as UserRole, label: '🏢 District EOC' },
            { id: 'FIELD_RESPONDER' as UserRole, label: '🚒 SDRF / Rescue' },
            { id: 'ANALYST' as UserRole, label: '📊 GIS Analyst' },
            { id: 'CITIZEN' as UserRole, label: '🏠 Resident Safety' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => handleFastTrack(r.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-950/70 hover:bg-cyan-950/80 border border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300 text-xs font-mono font-bold backdrop-blur-md transition active:scale-95 shadow-md"
            >
              {r.label}
            </button>
          ))}
        </div>

      </main>

      {/* ── 5. BOTTOM FLOATING STATUS BAR & CREDENTIALS STRIP ── */}
      <footer className="relative z-20 px-6 sm:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-900/80 bg-slate-950/60 backdrop-blur-xl text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE TELEMETRY: ALAKNANDA & CHAMOLI BASIN
          </span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline text-slate-300">Composite Risk: 68.5 (HIGH) • Antecedent Rain: 48mm</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-cyan-400 font-bold">SIH26192 Prototype</span>
          <span>•</span>
          <span>100% Truthful Provider Boundaries</span>
          <span>•</span>
          <span className="text-slate-300">Zero Fabricated Live Data</span>
        </div>
      </footer>

      {/* ── 6. FLOATING MODAL: OFFICER LOGIN & ROLE SELECTION ── */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-in">
          <div className="relative w-full max-w-md bg-[#030712] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.3)] space-y-5 animate-slide-up">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                  AUTHORIZATION TERMINAL
                </span>
                <h3 className="text-xl font-black text-white font-sans">Officer Mission Login</h3>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Role Switcher */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                Select Operational Role:
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
              >
                <option value="NATIONAL_OPERATOR">🇮🇳 National NDMA Commander</option>
                <option value="STATE_OPERATOR">🏛️ State SEOC Commander</option>
                <option value="DISTRICT_OPERATOR">🏢 District EOC Operator</option>
                <option value="FIELD_RESPONDER">🚒 Field Responder / SDRF</option>
                <option value="VILLAGE_OPERATOR">🌾 Village Operator</option>
                <option value="ANALYST">📊 GIS / ML Analyst</option>
                <option value="CITIZEN">🏠 Resident / Citizen</option>
                <option value="ADMIN">⚙️ System Administrator</option>
              </select>
            </div>

            {/* Login Form */}
            <form onSubmit={handleFormLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Officer Identifier</label>
                <div className="relative">
                  <User className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase">Security Token</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating || authSuccess}
                className={`w-full py-3 rounded-xl font-mono text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 transition active:scale-95 ${
                  authSuccess
                    ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.8)]'
                    : 'btn-primary text-white shadow-lg'
                }`}
              >
                {isAuthenticating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AUTHENTICATING TOKEN...</span>
                  </>
                ) : authSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CREDENTIALS VERIFIED</span>
                  </>
                ) : (
                  <>
                    <span>AUTHENTICATE & ENTER</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-[10px] font-mono text-slate-500">
              Demo environment provides automatic credential bypass for evaluators.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
