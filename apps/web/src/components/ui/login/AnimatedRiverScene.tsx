'use client';

import React, { useRef, useEffect } from 'react';

interface AnimatedRiverSceneProps {
  sceneType: 'HIMALAYAN_MIST' | 'BRAHMAPUTRA_SURGE' | 'RADAR_CYBER';
  mousePos: { x: number; y: number };
  isPlaying?: boolean;
}

export const AnimatedRiverScene: React.FC<AnimatedRiverSceneProps> = ({
  sceneType,
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

    // Particle system for river foam and volumetric mist
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      phase: number;
      maxLife: number;
      life: number;
    }

    const mistParticles: Particle[] = [];
    const riverFoam: Particle[] = [];

    // Initialize mist clouds
    for (let i = 0; i < 45; i++) {
      mistParticles.push({
        x: Math.random() * width,
        y: height * 0.25 + Math.random() * (height * 0.45),
        vx: 0.15 + Math.random() * 0.35,
        vy: (Math.random() - 0.5) * 0.08,
        size: 120 + Math.random() * 180,
        alpha: 0.08 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
        maxLife: 800 + Math.random() * 600,
        life: Math.random() * 800,
      });
    }

    // Initialize river foam sparkles
    for (let i = 0; i < 60; i++) {
      riverFoam.push({
        x: Math.random(), // percentage along river curve
        y: (Math.random() - 0.5) * 20, // lateral offset
        vx: 0.0015 + Math.random() * 0.0025,
        vy: 0,
        size: 1.5 + Math.random() * 3,
        alpha: 0.4 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        maxLife: 200 + Math.random() * 200,
        life: Math.random() * 200,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;

      ctx.clearRect(0, 0, width, height);

      // ── 1. SKY GRADIENT ──
      let skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (sceneType === 'HIMALAYAN_MIST') {
        skyGrad.addColorStop(0, '#0c2242');
        skyGrad.addColorStop(0.35, '#173b66');
        skyGrad.addColorStop(0.65, '#295484');
        skyGrad.addColorStop(1, '#050c18');
      } else if (sceneType === 'BRAHMAPUTRA_SURGE') {
        skyGrad.addColorStop(0, '#1c1335');
        skyGrad.addColorStop(0.4, '#382057');
        skyGrad.addColorStop(0.7, '#643872');
        skyGrad.addColorStop(1, '#06030c');
      } else {
        skyGrad.addColorStop(0, '#020d1c');
        skyGrad.addColorStop(0.5, '#071e36');
        skyGrad.addColorStop(1, '#01060e');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // ── 2. SUNLIGHT DIFFUSION / GOD RAYS ──
      const sunX = width * 0.45 + mousePos.x * 0.8;
      const sunY = height * 0.15 + mousePos.y * 0.5;
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, width * 0.6);
      sunGrad.addColorStop(0, 'rgba(255, 245, 220, 0.35)');
      sunGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.15)');
      sunGrad.addColorStop(0.7, 'rgba(6, 182, 212, 0.05)');
      sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);

      // ── 3. DISTANT BACK MOUNTAIN PEAKS ──
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.55);
      const mtnBackSegments = 12;
      for (let i = 0; i <= mtnBackSegments; i++) {
        const x = (width / mtnBackSegments) * i;
        const peakHeight = (i % 2 === 0 ? 0.35 : 0.48) * height + Math.sin(i * 1.8 + time * 0.2) * 5;
        ctx.lineTo(x, peakHeight);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const backMtnGrad = ctx.createLinearGradient(0, height * 0.3, 0, height);
      backMtnGrad.addColorStop(0, sceneType === 'HIMALAYAN_MIST' ? '#2a4d77' : '#2b1d44');
      backMtnGrad.addColorStop(1, '#081424');
      ctx.fillStyle = backMtnGrad;
      ctx.fill();
      ctx.restore();

      // ── 4. MID-GROUND CATCHMENT MOUNTAIN RIDGES ──
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.65);
      const mtnMidSegments = 8;
      for (let i = 0; i <= mtnMidSegments; i++) {
        const x = (width / mtnMidSegments) * i;
        const peakHeight = (i % 2 === 1 ? 0.45 : 0.58) * height + Math.cos(i * 1.5) * 15;
        ctx.lineTo(x, peakHeight);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const midMtnGrad = ctx.createLinearGradient(0, height * 0.4, 0, height);
      midMtnGrad.addColorStop(0, sceneType === 'HIMALAYAN_MIST' ? '#1c395c' : '#201639');
      midMtnGrad.addColorStop(1, '#040b15');
      ctx.fillStyle = midMtnGrad;
      ctx.fill();
      ctx.restore();

      // ── 5. VOLUMETRIC ROLLING MIST & VALLEY CLOUDS (Dynamic Billow) ──
      ctx.save();
      mistParticles.forEach((p) => {
        if (isPlaying) {
          p.x += p.vx;
          p.y += p.vy + Math.sin(time + p.phase) * 0.12;
          p.life += 1;
          if (p.x - p.size > width) p.x = -p.size;
        }

        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        radGrad.addColorStop(0, `rgba(224, 242, 254, ${p.alpha * 1.2})`);
        radGrad.addColorStop(0.5, `rgba(186, 230, 253, ${p.alpha * 0.6})`);
        radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // ── 6. FOREGROUND CANYON SLOPES ──
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.72);
      ctx.bezierCurveTo(width * 0.25, height * 0.65, width * 0.45, height * 0.75, width * 0.55, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = '#0e233d';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(width, height * 0.68);
      ctx.bezierCurveTo(width * 0.75, height * 0.62, width * 0.65, height * 0.78, width * 0.5, height);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = '#0a1d33';
      ctx.fill();
      ctx.restore();

      // ── 7. ANIMATED FLOWING RIVER (Volumetric Water Waves & Foam) ──
      // Define Sinuous River Centerline
      const getRiverPoint = (tVal: number) => {
        // tVal from 0 (distant mountain gorge) to 1 (foreground)
        const startX = width * 0.75;
        const startY = height * 0.52;
        const cp1X = width * 0.45;
        const cp1Y = height * 0.68;
        const cp2X = width * 0.68;
        const cp2Y = height * 0.82;
        const endX = width * 0.15;
        const endY = height * 1.05;

        // Cubic Bezier curve formula
        const u = 1 - tVal;
        const x = u * u * u * startX + 3 * u * u * tVal * cp1X + 3 * u * tVal * tVal * cp2X + tVal * tVal * tVal * endX;
        const y = u * u * u * startY + 3 * u * u * tVal * cp1Y + 3 * u * tVal * tVal * cp2Y + tVal * tVal * tVal * endY;
        const riverWidth = 12 + tVal * tVal * 95; // expands as it approaches foreground
        return { x, y, riverWidth };
      };

      // Draw River Body with Animated Wavelets
      ctx.save();
      const riverSteps = 45;
      
      // Left river edge & Right river edge paths
      const leftPoints: { x: number; y: number }[] = [];
      const rightPoints: { x: number; y: number }[] = [];

      for (let i = 0; i <= riverSteps; i++) {
        const progress = i / riverSteps;
        const { x, y, riverWidth } = getRiverPoint(progress);

        // Add dynamic sine wave ripple to river banks
        const waveOffset = Math.sin(progress * 15 - time * 3) * (progress * 3.5);
        leftPoints.push({ x: x - riverWidth * 0.5 + waveOffset, y });
        rightPoints.push({ x: x + riverWidth * 0.5 + waveOffset, y });
      }

      // Fill River Bed
      ctx.beginPath();
      ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
      for (let i = 1; i < leftPoints.length; i++) {
        ctx.lineTo(leftPoints[i].x, leftPoints[i].y);
      }
      for (let i = rightPoints.length - 1; i >= 0; i--) {
        ctx.lineTo(rightPoints[i].x, rightPoints[i].y);
      }
      ctx.closePath();

      const riverGrad = ctx.createLinearGradient(width * 0.75, height * 0.52, width * 0.15, height);
      if (sceneType === 'HIMALAYAN_MIST') {
        riverGrad.addColorStop(0, '#0284c7');
        riverGrad.addColorStop(0.3, '#00A8E8');
        riverGrad.addColorStop(0.7, '#38bdf8');
        riverGrad.addColorStop(1, '#0369a1');
      } else if (sceneType === 'BRAHMAPUTRA_SURGE') {
        riverGrad.addColorStop(0, '#0369a1');
        riverGrad.addColorStop(0.5, '#38bdf8');
        riverGrad.addColorStop(1, '#f59e0b');
      } else {
        riverGrad.addColorStop(0, '#00A8E8');
        riverGrad.addColorStop(0.5, '#38bdf8');
        riverGrad.addColorStop(1, '#0284c7');
      }
      ctx.fillStyle = riverGrad;
      ctx.fill();

      // Specular Sunlight Glistening Waves on River Surface
      for (let i = 2; i < riverSteps - 1; i += 2) {
        const progress = i / riverSteps;
        const { x, y, riverWidth } = getRiverPoint(progress);
        const rippleX = x + Math.sin(progress * 20 - time * 4) * (riverWidth * 0.35);
        const rippleWidth = riverWidth * (0.3 + Math.sin(progress * 10 + time * 2) * 0.2);

        ctx.beginPath();
        ctx.ellipse(rippleX, y, rippleWidth * 0.5, Math.max(1.5, progress * 3), 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.sin(progress * 8 - time * 3) * 0.3})`;
        ctx.fill();
      }

      // Flowing Whitecap Foam Particles racing down the torrent
      riverFoam.forEach((f) => {
        if (isPlaying) {
          f.x = (f.x + f.vx) % 1;
        }
        const { x, y, riverWidth } = getRiverPoint(f.x);
        const foamPosX = x + (f.y / 20) * (riverWidth * 0.4);
        const foamSize = f.size * (0.6 + f.x * 1.4);

        ctx.beginPath();
        ctx.arc(foamPosX, y, foamSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha * (0.5 + Math.sin(f.x * 20 + time * 4) * 0.5)})`;
        ctx.fill();
      });

      ctx.restore();

      // ── 8. VIGNETTE & DEEP ATMOSPHERE CONTRAST ──
      const vignette = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.3, width * 0.5, height * 0.5, width * 0.75);
      vignette.addColorStop(0, 'rgba(2, 7, 20, 0)');
      vignette.addColorStop(1, 'rgba(2, 7, 20, 0.75)');
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
  }, [sceneType, mousePos, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000"
    />
  );
};
