'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useEnvironment, RiskState, PageId, EnvMode } from '@/context/EnvironmentContext';

/* ── Topographic contour paths (pre-computed mountain silhouettes) ── */
const CONTOUR_PATHS = [
  "M-50,380 C100,340 200,310 350,290 S500,270 700,280 S900,300 1050,320 S1300,360 1450,380",
  "M-50,340 C80,300 180,265 320,248 S480,235 680,242 S870,258 1020,275 S1280,315 1450,340",
  "M-50,300 C60,256 150,218 300,200 S460,188 650,196 S840,214 990,232 S1260,272 1450,300",
  "M-50,260 C40,212 130,172 280,155 S440,145 620,150 S800,168 960,188 S1240,230 1450,260",
  "M-50,220 C20,168 110,128 260,110 S420,98 590,104 S770,122 940,144 S1220,188 1450,220",
  "M-50,180 C0,124 90,84 230,66 S400,54 560,60 S740,78 920,100 S1200,146 1450,180",
  "M-50,150 C-20,90 70,50 200,34 S380,22 530,28 S710,46 890,68 S1180,112 1450,150",
  "M-50,120 C-40,56 40,18 170,4 S350,0 490,8 S680,28 860,50 S1150,94 1450,120",
];

const ACCENT_CONTOURS = [3, 6]; // indices of accent-weight contours

/* ── Risk contour config per state ── */
const RISK_CONFIG: Record<RiskState, { color: string; opacity: number; pulseScale: number }> = {
  UNKNOWN:  { color: '#475569', opacity: 0.08, pulseScale: 1.0 },
  LOW:      { color: '#10b981', opacity: 0.10, pulseScale: 1.05 },
  MODERATE: { color: '#eab308', opacity: 0.14, pulseScale: 1.08 },
  HIGH:     { color: '#f97316', opacity: 0.18, pulseScale: 1.12 },
  EXTREME:  { color: '#ef4444', opacity: 0.24, pulseScale: 1.18 },
};

/* ── Page-specific environment accent ── */
const PAGE_ACCENT: Partial<Record<PageId, string>> = {
  'command-center': '#06b6d4',
  'safety':         '#10b981',
  'cascade':        '#3b82f6',
  'simulation':     '#8b5cf6',
  'hindcast':       '#a855f7',
  'replay':         '#7c3aed',
  'ledger':         '#06b6d4',
  'audit':          '#f59e0b',
  'incidents':      '#ef4444',
  'sensors':        '#06b6d4',
  'flight-recorder':'#f59e0b',
  'default':        '#06b6d4',
};

export const EnvironmentLayer: React.FC = () => {
  const { riskState, rainfallMm, riverStage, page, mode } = useEnvironment();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const prefersReduced = useRef<boolean>(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  /* ── Particle system (mist + rainfall) ── */
  const PARTICLE_COUNT = prefersReduced.current ? 0 : Math.min(35, 15 + Math.floor((rainfallMm / 150) * 20));

  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }>>([]);

  const initParticles = useCallback((w: number, h: number) => {
    const accent = PAGE_ACCENT[page] || PAGE_ACCENT['default']!;
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: Math.random() * 0.18 + 0.04, // slight downward drift (rainfall feel)
      r: Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.3 + 0.08,
      color: accent,
    }));
  }, [PARTICLE_COUNT, page]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      initParticles(w, h);
    };
    window.addEventListener('resize', onResize);
    initParticles(w, h);

    /* ── Page Visibility pause ── */
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      } else {
        render();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const rCfg = RISK_CONFIG[riskState];
    const accent = PAGE_ACCENT[page] || PAGE_ACCENT['default']!;

    const render = () => {
      timeRef.current += 1;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      // On command-center, the full opaque vector map already fills the viewport — don't waste CPU/GPU
      if (prefersReduced.current || page === 'command-center') {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      /* ── Layer 4: Atmospheric particles (lightweight) ── */
      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > h) { p.y = -4; p.x = Math.random() * w; }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      /* ── Layer 5: River flow (river stage drives speed) ── */
      const flowSpeed = 0.4 + (riverStage / 8) * 1.2;
      const flowOffset = (t * flowSpeed) % 28;
      const riverY = h * 0.72;

      ctx.beginPath();
      ctx.moveTo(-20, riverY);
      for (let x = 0; x <= w + 20; x += 8) {
        const waveMag = 1.5 + (riverStage / 8) * 3;
        ctx.lineTo(x, riverY + Math.sin((x * 0.015) + (t * 0.02)) * waveMag);
      }
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.06 + (riverStage / 8) * 0.08})`;
      ctx.lineWidth = 1 + (riverStage / 8) * 2;
      ctx.setLineDash([8, 6]);
      ctx.lineDashOffset = -flowOffset;
      ctx.stroke();
      ctx.setLineDash([]);

      /* ── Layer 6: Risk contour illumination (subtle pulsing ellipse) ── */
      const pulsePhase = 0.5 + 0.5 * Math.sin(t * 0.03);
      const cx = w * 0.62, cy = h * 0.58;
      const rx = 120 + pulsePhase * 20 * rCfg.pulseScale;
      const ry = 80 + pulsePhase * 12 * rCfg.pulseScale;

      const riskGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx * 1.5);
      riskGrad.addColorStop(0, `${rCfg.color}${Math.floor(rCfg.opacity * 255).toString(16).padStart(2, '0')}`);
      riskGrad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = riskGrad;
      ctx.fill();

      /* ── Layer 7: Data signal nodes ── */
      const nodes = [
        { x: w * 0.18, y: h * 0.22, label: 'AWS-01' },
        { x: w * 0.32, y: h * 0.38, label: 'RWL-01' },
        { x: w * 0.55, y: h * 0.55, label: 'GEO-02' },
        { x: w * 0.74, y: h * 0.42, label: 'AWS-03' },
        { x: w * 0.88, y: h * 0.65, label: 'SEN-04' },
      ];

      nodes.forEach((nd, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.04 + i * 1.3);
        const nr = 3 + pulse * 2;
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, nr, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.25 + pulse * 0.3;
        ctx.shadowBlur = 8;
        ctx.shadowColor = accent;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        /* connect to next node */
        if (i < nodes.length - 1) {
          const next = nodes[i + 1];
          ctx.beginPath();
          ctx.moveTo(nd.x, nd.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(56,189,248,0.06)`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      });

      rafRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [riskState, rainfallMm, riverStage, page, initParticles]);

  const rCfg = RISK_CONFIG[riskState];

  /* ── Mode-specific desaturation (historical looks sepia/muted) ── */
  const modeFilter: Record<EnvMode, string> = {
    LIVE:       'none',
    DEMO:       'none',
    SIMULATION: 'hue-rotate(20deg) saturate(0.9)',
    HINDCAST:   'sepia(0.25) saturate(0.75) brightness(0.85)',
    REPLAY:     'sepia(0.3) saturate(0.7) brightness(0.82)',
  };

  return (
    <div className="env-layer" style={{ filter: modeFilter[mode] }}>
      {/* ── Layer 1: Deep atmospheric base ── */}
      <div className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 50% at 50% -5%, rgba(56,189,248,0.06) 0%, transparent 65%),
            radial-gradient(ellipse 70% 90% at 80% 60%, rgba(30,58,138,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 5% 95%, rgba(6,78,112,0.08) 0%, transparent 60%),
            linear-gradient(170deg, #04091a 0%, #020810 55%, #010409 100%)
          `
        }}
      />

      {/* ── Layer 2: Topographic SVG contours ── */}
      <svg
        className="absolute inset-0 w-full h-full animate-contour-drift"
        viewBox="0 0 1400 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {CONTOUR_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={ACCENT_CONTOURS.includes(i) ? 'rgba(56,189,248,0.08)' : 'rgba(56,189,248,0.04)'}
            strokeWidth={ACCENT_CONTOURS.includes(i) ? 1.2 : 0.7}
            strokeLinecap="round"
            style={{ animationDelay: `${i * -1.8}s` }}
          />
        ))}

        {/* Mountain silhouette fill — very subtle */}
        <path
          d="M-50,600 L-50,340 C60,256 150,218 300,200 S460,188 650,196 S840,214 990,232 S1260,272 1450,300 L1450,600 Z"
          fill="rgba(56,189,248,0.018)"
        />
      </svg>

      {/* ── Layer 3: Geospatial coordinate grid ── */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56,189,248,0.6) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56,189,248,0.6) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
        }}
      />

      {/* ── Layers 4–7: Canvas (particles, flow, risk, nodes) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* ── Ambient risk glow orb (CSS — no canvas cost) ── */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-1000"
        style={{
          width: '40vw',
          height: '28vw',
          left: '45%',
          top: '40%',
          background: `radial-gradient(ellipse, ${rCfg.color}${Math.floor(rCfg.opacity * 0.7 * 255).toString(16).padStart(2,'0')} 0%, transparent 70%)`,
          filter: 'blur(40px)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* ── Page-mode label (bottom-right corner, subtle) ── */}
      {mode !== 'LIVE' && mode !== 'DEMO' && (
        <div className="absolute bottom-4 right-4 font-mono text-[10px] font-bold tracking-[0.2em] opacity-20 text-purple-300 pointer-events-none">
          {mode} MODE
        </div>
      )}
    </div>
  );
};
