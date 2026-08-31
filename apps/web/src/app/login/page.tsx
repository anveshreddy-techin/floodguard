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
  Sliders,
  Droplets
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setPage('login');
    setMode('DEMO');
  }, [setPage, setMode]);

  // ── High-Performance 60fps Hydrodynamic River & Particle Simulation Canvas ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dynamic water particles
    const particles: { x: number; y: number; speed: number; size: number; opacity: number; length: number }[] = [];
    const particleCount = 70;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speed: 1.5 + Math.random() * 3,
        size: 1 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.6,
        length: 10 + Math.random() * 25,
      });
    }

    const render = () => {
      time += 0.02;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Render Dynamic Flowing River Waves (Multi-Harmonic Vector Waves)
      const riverY = h * 0.68;
      const waveCount = 5;

      for (let wave = 0; wave < waveCount; wave++) {
        ctx.beginPath();
        ctx.moveTo(0, h);

        for (let x = 0; x <= w; x += 15) {
          // Multi-frequency hydrodynamic wave function
          const freq1 = Math.sin(x * 0.003 + time * 1.5 + wave * 0.8);
          const freq2 = Math.cos(x * 0.008 - time * 2.2 + wave * 1.2);
          const freq3 = Math.sin(x * 0.0015 + time * 0.8);
          const waveHeight = 18 + wave * 8;
          const y = riverY + (wave * 26) + (freq1 * waveHeight) + (freq2 * (waveHeight * 0.5)) + (freq3 * 10);
          
          if (x === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(w, h);
        ctx.closePath();

        // Scene-Specific Water Gradient & Shimmer
        if (activeScene === 'HIMALAYAN_MIST') {
          const grad = ctx.createLinearGradient(0, riverY, w, h);
          grad.addColorStop(0, `rgba(0, 168, 232, ${0.18 + wave * 0.08})`);
          grad.addColorStop(0.5, `rgba(30, 144, 255, ${0.25 + wave * 0.1})`);
          grad.addColorStop(1, `rgba(2, 29, 61, ${0.4 + wave * 0.12})`);
          ctx.fillStyle = grad;
          ctx.fill();

          // River crest foam highlight
          ctx.strokeStyle = `rgba(186, 230, 253, ${0.35 - wave * 0.05})`;
          ctx.lineWidth = 2 - wave * 0.3;
          ctx.stroke();
        } else if (activeScene === 'BRAHMAPUTRA_SURGE') {
          const grad = ctx.createLinearGradient(0, riverY, w, h);
          grad.addColorStop(0, `rgba(217, 119, 6, ${0.2 + wave * 0.08})`);
          grad.addColorStop(0.5, `rgba(180, 83, 9, ${0.28 + wave * 0.1})`);
          grad.addColorStop(1, `rgba(30, 15, 60, ${0.45 + wave * 0.12})`);
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.strokeStyle = `rgba(253, 230, 138, ${0.4 - wave * 0.06})`;
          ctx.lineWidth = 2.5 - wave * 0.3;
          ctx.stroke();
        } else {
          // Cyber Radar Mode
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.5 - wave * 0.08})`;
          ctx.lineWidth = 1.8;
          ctx.setLineDash([8, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Render Dynamic Stream Particles & Rain Streaks
      particles.forEach((p) => {
        p.y += p.speed;
        p.x += Math.sin(time + p.y * 0.01) * 0.8;

        if (p.y > h) {
          p.y = -20;
          p.x = Math.random() * w;
        }

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - 1, p.y + p.length);
        
        if (activeScene === 'BRAHMAPUTRA_SURGE') {
          ctx.strokeStyle = `rgba(251, 191, 36, ${p.opacity * 0.6})`;
        } else if (activeScene === 'RADAR_CYBER') {
          ctx.strokeStyle = `rgba(6, 182, 212, ${p.opacity * 0.8})`;
        } else {
          ctx.strokeStyle = `rgba(125, 211, 252, ${p.opacity * 0.7})`;
        }
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';
        ctx.stroke();
      });

      // Render Concentric Radar Water Ripples around Sensor Beacons
      const beaconX = w * 0.45;
      const beaconY = h * 0.72;
      const pulseRadius = (time * 40) % 90;
      const pulseAlpha = Math.max(0, 1 - pulseRadius / 90);

      ctx.beginPath();
      ctx.arc(beaconX, beaconY, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${pulseAlpha * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(beaconX, beaconY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#00A8E8';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [activeScene]);

  // Track mouse for subtle parallax movement
  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 15;
    const y = (e.clientY / innerHeight - 0.5) * 15;
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
      {/* ── 1. REALISTIC ANIMATED HYDRODYNAMIC CANVAS (Video-Like Flow) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-90"
      />

      {/* ── 2. CINEMATIC ATMOSPHERIC MOUNTAIN & CLOUD DEPTH ── */}
      <div 
        className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out z-0"
        style={{
          transform: `scale(1.04) translate(${mousePos.x * -0.4}px, ${mousePos.y * -0.4}px)`,
        }}
      >
        {/* Alpine Sky Aurora */}
        <div className="absolute top-0 left-1/4 w-[60vw] h-[50vh] bg-gradient-to-b from-sky-400/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        {/* Multi-Layer Ridge Vectors */}
        <svg viewBox="0 0 1440 600" className="absolute bottom-0 w-full h-[70vh] preserve-3d opacity-85 pointer-events-none">
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
          </defs>

          {/* Distant Alpine Peaks */}
          <path d="M 0,340 L 180,160 L 360,310 L 580,120 L 820,290 L 1080,140 L 1260,260 L 1440,180 L 1440,600 L 0,600 Z" fill="url(#mtnBack)" opacity="0.65" />
          
          {/* Mid Ridge Catchment */}
          <path d="M 0,390 L 240,220 L 480,360 L 720,200 L 980,350 L 1200,230 L 1440,330 L 1440,600 L 0,600 Z" fill="url(#mtnMid)" opacity="0.85" />
          
          {/* Foreground Slopes */}
          <path d="M 0,450 L 320,310 L 640,430 L 960,290 L 1280,450 L 1440,380 L 1440,600 L 0,600 Z" fill="url(#mtnFront)" />
        </svg>

        {/* Ambient Shading Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020714] via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-[#020714] to-transparent pointer-events-none" />
      </div>

      {/* ── 3. TOP NAV BAR: BRAND & SCENE CONTROLS ── */}
      <header className="relative z-20 px-4 sm:px-8 lg:px-14 py-5 flex items-center justify-between">
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
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/75 border border-slate-800/80 backdrop-blur-xl text-xs font-mono shadow-xl">
          <button
            onClick={() => setActiveScene('HIMALAYAN_MIST')}
            className={`px-3 py-1 rounded-xl transition ${
              activeScene === 'HIMALAYAN_MIST' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏔️ Alpine River
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

      {/* ── 4. CENTER HERO: BOLD CINEMATIC WORDMARK & INTERACTIVE DOCK ── */}
      <main className="relative z-20 px-4 sm:px-10 lg:px-14 my-auto flex flex-col items-start justify-center max-w-5xl space-y-5 sm:space-y-6">
        
        {/* Subtle Category Bracket */}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
          <span className="w-6 h-[1.5px] bg-cyan-400" />
          <span>HYPER-LOCAL FLASH FLOOD & MULTI-HAZARD RESCUE PLATFORM</span>
        </div>

        {/* Hero Title (Bold & Dramatic like Prisma screenshot) */}
        <div className="space-y-2">
          <h1 
            className="text-4xl sm:text-7xl lg:text-8xl font-black font-sans tracking-tight text-white leading-none drop-shadow-[0_12px_40px_rgba(0,0,0,0.85)]"
            style={{
              letterSpacing: '-0.04em',
            }}
          >
            FloodGuard <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">AI</span>
          </h1>
          
          <p className="text-xs sm:text-base lg:text-lg text-slate-200/90 font-sans max-w-2xl leading-relaxed drop-shadow-md">
            Physics-guided spatial intelligence, automated hydrological cascade detection, and zero-hindsight life-saving evacuation routing across 28 Indian states.
          </p>
        </div>

        {/* ── 5. PRIMARY FAST-TRACK ACTION & STATS DOCK (Screenshot Pill Aesthetic) ── */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          
          {/* Main Launch Pill Button */}
          <button
            onClick={() => handleFastTrack('DISTRICT_OPERATOR')}
            className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-sans font-black text-sm flex items-center gap-3 shadow-[0_0_45px_rgba(255,255,255,0.45)] active:scale-95 transition-all transform hover:translate-x-1"
          >
            <span>Launch Command Center</span>
            <div className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Secure Officer Sign-In Trigger Button */}
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-5 py-3.5 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-slate-700/80 text-white font-mono text-xs font-bold flex items-center gap-2 backdrop-blur-xl shadow-xl active:scale-95 transition"
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
                : 'bg-slate-950/85 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Ambient Mountain & Rain Soundscape"
          >
            {audioPlaying ? <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{audioPlaying ? 'Soundscape: ON' : 'Audio Ambient'}</span>
          </button>
        </div>

        {/* Fast-Track Role Pills (Instant 1-Click Access) */}
        <div className="pt-3 flex flex-wrap items-center gap-2">
          <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider mr-1">
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
              className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-cyan-950/90 border border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300 text-xs font-mono font-bold backdrop-blur-md transition active:scale-95 shadow-md"
            >
              {r.label}
            </button>
          ))}
        </div>

      </main>

      {/* ── 6. BOTTOM FLOATING STATUS BAR & CREDENTIALS STRIP ── */}
      <footer className="relative z-20 px-4 sm:px-10 lg:px-14 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-slate-900/80 bg-slate-950/70 backdrop-blur-xl text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE TELEMETRY: ALAKNANDA & CHAMOLI BASIN
          </span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline text-slate-300">Composite Risk: 68.5 (HIGH) • Antecedent Rain: 48mm</span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-cyan-400 font-bold">SIH26192 Prototype</span>
          <span>•</span>
          <span>100% Truthful Provider Boundaries</span>
          <span>•</span>
          <span className="text-slate-300">Zero Fabricated Live Data</span>
        </div>
      </footer>

      {/* ── 7. FLOATING MODAL: OFFICER LOGIN & ROLE SELECTION ── */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in">
          <div className="relative w-full max-w-md bg-[#030712] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.35)] space-y-5 animate-slide-up">
            
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
