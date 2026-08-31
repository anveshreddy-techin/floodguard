'use client';

import React, { useRef, useEffect } from 'react';

export type FloodStage = 'MODERATE_FLOW' | 'WARNING_SURGE' | 'FLASH_FLOOD_EXTREME';

interface AnimatedRiverSceneProps {
  sceneType: 'HIMALAYAN_MIST' | 'BRAHMAPUTRA_SURGE' | 'RADAR_CYBER';
  floodStage?: FloodStage;
  mousePos: { x: number; y: number };
  isPlaying?: boolean;
}

export const AnimatedRiverScene: React.FC<AnimatedRiverSceneProps> = ({
  sceneType,
  floodStage = 'FLASH_FLOOD_EXTREME',
  mousePos,
  isPlaying = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // ── 1. RAINDROP & SPLASH SYSTEM ──
    interface Raindrop {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      width: number;
    }

    interface Splash {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
    }

    const raindrops: Raindrop[] = [];
    const splashes: Splash[] = [];
    const rainCount = floodStage === 'FLASH_FLOOD_EXTREME' ? 160 : floodStage === 'WARNING_SURGE' ? 110 : 70;

    for (let i = 0; i < rainCount; i++) {
      raindrops.push({
        x: Math.random() * (width + 250) - 100,
        y: Math.random() * height,
        length: 20 + Math.random() * 32,
        speed: 16 + Math.random() * 16,
        opacity: 0.3 + Math.random() * 0.45,
        width: 1 + Math.random() * 1.2,
      });
    }

    // ── 2. FLOOD SURGE PARTICLES (Whitewater Foam, Spray & Vortices) ──
    interface SurgeParticle {
      t: number; // position along flood channel (0 to 1)
      offset: number; // lateral offset (-1 to 1)
      speed: number;
      size: number;
      alpha: number;
      type: 'FOAM' | 'SPRAY' | 'VORTEX';
    }

    const surgeParticles: SurgeParticle[] = [];
    const surgeParticleCount = floodStage === 'FLASH_FLOOD_EXTREME' ? 120 : floodStage === 'WARNING_SURGE' ? 70 : 40;

    for (let i = 0; i < surgeParticleCount; i++) {
      surgeParticles.push({
        t: Math.random(),
        offset: (Math.random() - 0.5) * 1.8,
        speed: 0.003 + Math.random() * 0.006,
        size: 2 + Math.random() * 5,
        alpha: 0.4 + Math.random() * 0.6,
        type: Math.random() > 0.8 ? 'SPRAY' : Math.random() > 0.4 ? 'FOAM' : 'VORTEX',
      });
    }

    let time = 0;

    const render = () => {
      time += isPlaying ? 0.025 : 0;

      ctx.clearRect(0, 0, width, height);

      // Flood stage intensity multipliers
      const isExtreme = floodStage === 'FLASH_FLOOD_EXTREME';
      const isWarning = floodStage === 'WARNING_SURGE';
      const surgeMultiplier = isExtreme ? 2.2 : isWarning ? 1.5 : 1.0;
      const surgeSpeed = isExtreme ? 5.5 : isWarning ? 3.8 : 2.5;

      // ── A. ATMOSPHERIC STORM SKY GRADIENT ──
      let skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isExtreme) {
        skyGrad.addColorStop(0, '#040b17');
        skyGrad.addColorStop(0.3, '#0c1f38');
        skyGrad.addColorStop(0.6, '#132e4f');
        skyGrad.addColorStop(1, '#051020');
      } else if (sceneType === 'BRAHMAPUTRA_SURGE') {
        skyGrad.addColorStop(0, '#1a102b');
        skyGrad.addColorStop(0.4, '#311a47');
        skyGrad.addColorStop(0.7, '#4e2359');
        skyGrad.addColorStop(1, '#080312');
      } else {
        skyGrad.addColorStop(0, '#0a192f');
        skyGrad.addColorStop(0.35, '#102a4e');
        skyGrad.addColorStop(0.7, '#1b3f69');
        skyGrad.addColorStop(1, '#040c18');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // ── B. ATMOSPHERIC STORM LIGHTING & GOD RAYS ──
      const sunX = width * 0.5 + mousePos.x * 0.7;
      const sunY = height * 0.12 + mousePos.y * 0.4;
      const stormGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, width * 0.55);
      stormGrad.addColorStop(0, isExtreme ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 245, 220, 0.22)');
      stormGrad.addColorStop(0.4, isExtreme ? 'rgba(6, 182, 212, 0.12)' : 'rgba(56, 189, 248, 0.08)');
      stormGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = stormGrad;
      ctx.fillRect(0, 0, width, height);

      // ── C. DISTANT MOUNTAIN RIDGES ──
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.52);
      const mtnBackSegments = 12;
      for (let i = 0; i <= mtnBackSegments; i++) {
        const x = (width / mtnBackSegments) * i;
        const peakHeight = (i % 2 === 0 ? 0.35 : 0.47) * height;
        ctx.lineTo(x, peakHeight);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const backMtnGrad = ctx.createLinearGradient(0, height * 0.3, 0, height);
      backMtnGrad.addColorStop(0, isExtreme ? '#1c375c' : '#274b75');
      backMtnGrad.addColorStop(1, '#071220');
      ctx.fillStyle = backMtnGrad;
      ctx.fill();
      ctx.restore();

      // ── D. MID-GROUND CATCHMENT SLOPES ──
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.62);
      const mtnMidSegments = 8;
      for (let i = 0; i <= mtnMidSegments; i++) {
        const x = (width / mtnMidSegments) * i;
        const peakHeight = (i % 2 === 1 ? 0.44 : 0.56) * height;
        ctx.lineTo(x, peakHeight);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const midMtnGrad = ctx.createLinearGradient(0, height * 0.4, 0, height);
      midMtnGrad.addColorStop(0, isExtreme ? '#132c4a' : '#183659');
      midMtnGrad.addColorStop(1, '#040b15');
      ctx.fillStyle = midMtnGrad;
      ctx.fill();
      ctx.restore();

      // ── E. FOREGROUND CANYON GORGE WALLS ──
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.68);
      ctx.bezierCurveTo(width * 0.22, height * 0.62, width * 0.4, height * 0.72, width * 0.48, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = '#081729';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(width, height * 0.65);
      ctx.bezierCurveTo(width * 0.78, height * 0.58, width * 0.68, height * 0.75, width * 0.55, height);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = '#061322';
      ctx.fill();
      ctx.restore();

      // ── F. DYNAMIC FLOOD SURGE & INUNDATION TORRENT ──
      const getFloodCenter = (tVal: number) => {
        const startX = width * 0.75;
        const startY = height * 0.48;
        const cp1X = width * 0.42;
        const cp1Y = height * 0.65;
        const cp2X = width * 0.65;
        const cp2Y = height * 0.8;
        const endX = width * 0.25;
        const endY = height * 1.08;

        const u = 1 - tVal;
        const x = u * u * u * startX + 3 * u * u * tVal * cp1X + 3 * u * tVal * tVal * cp2X + tVal * tVal * tVal * endX;
        const y = u * u * u * startY + 3 * u * u * tVal * cp1Y + 3 * u * tVal * tVal * cp2Y + tVal * tVal * tVal * endY;
        
        const baseWidth = (20 + tVal * tVal * 160) * surgeMultiplier;
        return { x, y, baseWidth };
      };

      ctx.save();
      const floodSteps = 55;
      const leftBank: { x: number; y: number }[] = [];
      const rightBank: { x: number; y: number }[] = [];

      for (let i = 0; i <= floodSteps; i++) {
        const progress = i / floodSteps;
        const { x, y, baseWidth } = getFloodCenter(progress);

        const surgeWave = Math.sin(progress * 16 - time * surgeSpeed) * (progress * 8 * surgeMultiplier);
        const chopWave = Math.cos(progress * 28 + time * surgeSpeed * 1.4) * (progress * 4);

        leftBank.push({ x: x - baseWidth * 0.5 + surgeWave + chopWave, y });
        rightBank.push({ x: x + baseWidth * 0.5 + surgeWave - chopWave, y });
      }

      // Flood Inundation Overflow Area
      if (isExtreme || isWarning) {
        ctx.beginPath();
        ctx.moveTo(leftBank[0].x - 30, leftBank[0].y);
        for (let i = 0; i < leftBank.length; i++) {
          ctx.lineTo(leftBank[i].x - (isExtreme ? 50 : 25) * (i / floodSteps), leftBank[i].y);
        }
        for (let i = rightBank.length - 1; i >= 0; i--) {
          ctx.lineTo(rightBank[i].x + (isExtreme ? 50 : 25) * (i / floodSteps), rightBank[i].y);
        }
        ctx.closePath();

        const inunGrad = ctx.createLinearGradient(0, height * 0.5, 0, height);
        inunGrad.addColorStop(0, isExtreme ? 'rgba(225, 29, 72, 0.15)' : 'rgba(245, 158, 11, 0.15)');
        inunGrad.addColorStop(1, isExtreme ? 'rgba(225, 29, 72, 0.35)' : 'rgba(245, 158, 11, 0.25)');
        ctx.fillStyle = inunGrad;
        ctx.fill();

        ctx.strokeStyle = isExtreme ? 'rgba(244, 63, 94, 0.6)' : 'rgba(245, 158, 11, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Main Flood Body
      ctx.beginPath();
      ctx.moveTo(leftBank[0].x, leftBank[0].y);
      for (let i = 1; i < leftBank.length; i++) {
        ctx.lineTo(leftBank[i].x, leftBank[i].y);
      }
      for (let i = rightBank.length - 1; i >= 0; i--) {
        ctx.lineTo(rightBank[i].x, rightBank[i].y);
      }
      ctx.closePath();

      const floodGrad = ctx.createLinearGradient(width * 0.75, height * 0.48, width * 0.25, height);
      if (isExtreme) {
        floodGrad.addColorStop(0, '#0284c7');
        floodGrad.addColorStop(0.35, '#0ea5e9');
        floodGrad.addColorStop(0.7, '#0284c7');
        floodGrad.addColorStop(1, '#0369a1');
      } else if (sceneType === 'BRAHMAPUTRA_SURGE') {
        floodGrad.addColorStop(0, '#0369a1');
        floodGrad.addColorStop(0.5, '#38bdf8');
        floodGrad.addColorStop(1, '#b45309');
      } else {
        floodGrad.addColorStop(0, '#0284c7');
        floodGrad.addColorStop(0.4, '#00A8E8');
        floodGrad.addColorStop(1, '#0369a1');
      }
      ctx.fillStyle = floodGrad;
      ctx.fill();

      // Surging White-Water Wavefronts
      for (let i = 2; i < floodSteps - 1; i += 2) {
        const progress = i / floodSteps;
        const { x, y, baseWidth } = getFloodCenter(progress);
        
        const waveX = x + Math.sin(progress * 24 - time * (surgeSpeed + 1)) * (baseWidth * 0.35);
        const waveWidth = baseWidth * (0.4 + Math.sin(progress * 14 + time * surgeSpeed) * 0.3);
        const waveHeight = Math.max(2.5, progress * 6 * surgeMultiplier);

        ctx.beginPath();
        ctx.ellipse(waveX, y, waveWidth * 0.5, waveHeight, 0, 0, Math.PI * 2);
        
        const foamAlpha = isExtreme ? 0.7 + Math.sin(progress * 12 - time * 4) * 0.3 : 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${foamAlpha})`;
        ctx.fill();
      }

      // Flood Surge Particles
      surgeParticles.forEach((p) => {
        if (isPlaying) {
          p.t = (p.t + p.speed * surgeMultiplier) % 1;
        }

        const { x, y, baseWidth } = getFloodCenter(p.t);
        const particleX = x + (p.offset * (baseWidth * 0.45));
        const particleSize = p.size * (0.8 + p.t * 1.6);

        ctx.beginPath();
        if (p.type === 'FOAM') {
          ctx.arc(particleX, y, particleSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.85})`;
          ctx.fill();
        } else if (p.type === 'SPRAY') {
          const sprayY = y - Math.sin(p.t * 20 + time * 6) * (10 * surgeMultiplier);
          ctx.arc(particleX, sprayY, particleSize * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(224, 242, 254, ${p.alpha * 0.9})`;
          ctx.fill();
        } else {
          ctx.ellipse(particleX, y, particleSize * 1.5, particleSize * 0.6, time + p.t * 10, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.6})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Flood Hazard Water Level Meter
      const meterPoint = getFloodCenter(0.42);
      ctx.beginPath();
      ctx.arc(meterPoint.x, meterPoint.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = isExtreme ? '#f43f5e' : isWarning ? '#fbbf24' : '#38bdf8';
      ctx.fill();

      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = isExtreme ? '#fda4af' : isWarning ? '#fde68a' : '#7dd3fc';
      ctx.textAlign = 'center';
      const stageText = isExtreme ? 'STAGE: 6.8m (FLASH FLOOD SURGE)' : isWarning ? 'STAGE: 4.2m (WARNING)' : 'STAGE: 2.4m (NORMAL)';
      ctx.fillText(stageText, meterPoint.x, meterPoint.y - 10);
      ctx.restore();

      // ── G. REALISTIC RAINDROPS & SPLASH RIPPLES (Falling over Floodwaters) ──
      ctx.save();
      const rainAngle = 0.22; // ~12.5 degree slant
      const cosAngle = Math.cos(rainAngle);
      const sinAngle = Math.sin(rainAngle);

      raindrops.forEach((drop) => {
        if (isPlaying) {
          drop.x += sinAngle * drop.speed;
          drop.y += cosAngle * drop.speed;

          // When drop hits surging floodwater or lower valley, generate water splash ripple
          if (drop.y > height * 0.6 && Math.random() < 0.05) {
            splashes.push({
              x: drop.x,
              y: drop.y,
              radius: 1,
              maxRadius: 8 + Math.random() * 12,
              opacity: 0.6,
            });
          }

          // Reset raindrop at top when leaving screen
          if (drop.y > height + 50 || drop.x > width + 100) {
            drop.y = -drop.length - Math.random() * 80;
            drop.x = Math.random() * (width + 250) - 100;
          }
        }

        // Draw raindrop streak
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + sinAngle * drop.length, drop.y + cosAngle * drop.length);
        ctx.strokeStyle = `rgba(186, 230, 253, ${drop.opacity})`;
        ctx.lineWidth = drop.width;
        ctx.lineCap = 'round';
        ctx.stroke();
      });

      // Draw water ripple splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        if (isPlaying) {
          s.radius += 0.7;
          s.opacity -= 0.035;
        }

        if (s.opacity <= 0 || s.radius >= s.maxRadius) {
          splashes.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.ellipse(s.x, s.y, s.radius, s.radius * 0.35, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(224, 242, 254, ${s.opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      ctx.restore();

      // ── H. DEEP VIGNETTE CONTRAST ──
      const vignette = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.35, width * 0.5, height * 0.5, width * 0.8);
      vignette.addColorStop(0, 'rgba(2, 7, 20, 0)');
      vignette.addColorStop(1, 'rgba(2, 7, 20, 0.7)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [sceneType, floodStage, mousePos, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700"
    />
  );
};
