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

    // ── RAINDROP ENGINE (Clean realistic precipitation streaks) ──
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
    const rainCount = 140;

    for (let i = 0; i < rainCount; i++) {
      raindrops.push({
        x: Math.random() * (width + 200) - 100,
        y: Math.random() * height,
        length: 18 + Math.random() * 28,
        speed: 16 + Math.random() * 14,
        opacity: 0.25 + Math.random() * 0.5,
        width: 1 + Math.random() * 1.2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;

      ctx.clearRect(0, 0, width, height);

      // ── 1. CLEAN ALPINE SKY GRADIENT ──
      let skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (sceneType === 'HIMALAYAN_MIST') {
        skyGrad.addColorStop(0, '#0a192f');
        skyGrad.addColorStop(0.3, '#102a4e');
        skyGrad.addColorStop(0.65, '#1e4470');
        skyGrad.addColorStop(1, '#040b15');
      } else if (sceneType === 'BRAHMAPUTRA_SURGE') {
        skyGrad.addColorStop(0, '#1c1335');
        skyGrad.addColorStop(0.4, '#341d52');
        skyGrad.addColorStop(0.7, '#592c63');
        skyGrad.addColorStop(1, '#06030c');
      } else {
        skyGrad.addColorStop(0, '#020d1c');
        skyGrad.addColorStop(0.5, '#071e36');
        skyGrad.addColorStop(1, '#01060e');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // ── 2. SUNLIGHT & ATMOSPHERIC GLOW ──
      const sunX = width * 0.45 + mousePos.x * 0.8;
      const sunY = height * 0.15 + mousePos.y * 0.5;
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, width * 0.5);
      sunGrad.addColorStop(0, 'rgba(255, 250, 235, 0.25)');
      sunGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.12)');
      sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);

      // ── 3. CRISP DISTANT MOUNTAIN RIDGES (No blurry fog blobs) ──
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.55);
      const mtnBackSegments = 12;
      for (let i = 0; i <= mtnBackSegments; i++) {
        const x = (width / mtnBackSegments) * i;
        const peakHeight = (i % 2 === 0 ? 0.36 : 0.48) * height;
        ctx.lineTo(x, peakHeight);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const backMtnGrad = ctx.createLinearGradient(0, height * 0.3, 0, height);
      backMtnGrad.addColorStop(0, sceneType === 'HIMALAYAN_MIST' ? '#274b75' : '#2b1d44');
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
        const peakHeight = (i % 2 === 1 ? 0.46 : 0.58) * height;
        ctx.lineTo(x, peakHeight);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const midMtnGrad = ctx.createLinearGradient(0, height * 0.4, 0, height);
      midMtnGrad.addColorStop(0, sceneType === 'HIMALAYAN_MIST' ? '#183659' : '#1e1436');
      midMtnGrad.addColorStop(1, '#040b15');
      ctx.fillStyle = midMtnGrad;
      ctx.fill();
      ctx.restore();

      // ── 5. FOREGROUND ROCKY CANYON GORGE SLOPES ──
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height * 0.72);
      ctx.bezierCurveTo(width * 0.25, height * 0.65, width * 0.45, height * 0.75, width * 0.55, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = '#0b1d33';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(width, height * 0.68);
      ctx.bezierCurveTo(width * 0.75, height * 0.62, width * 0.65, height * 0.78, width * 0.5, height);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = '#081729';
      ctx.fill();
      ctx.restore();

      // ── 6. CRISP FLOWING RIVER WITH GLISTENING WAVES ──
      const getRiverPoint = (tVal: number) => {
        const startX = width * 0.75;
        const startY = height * 0.52;
        const cp1X = width * 0.45;
        const cp1Y = height * 0.68;
        const cp2X = width * 0.68;
        const cp2Y = height * 0.82;
        const endX = width * 0.15;
        const endY = height * 1.05;

        const u = 1 - tVal;
        const x = u * u * u * startX + 3 * u * u * tVal * cp1X + 3 * u * tVal * tVal * cp2X + tVal * tVal * tVal * endX;
        const y = u * u * u * startY + 3 * u * u * tVal * cp1Y + 3 * u * tVal * tVal * cp2Y + tVal * tVal * tVal * endY;
        const riverWidth = 14 + tVal * tVal * 110;
        return { x, y, riverWidth };
      };

      ctx.save();
      const riverSteps = 50;
      const leftPoints: { x: number; y: number }[] = [];
      const rightPoints: { x: number; y: number }[] = [];

      for (let i = 0; i <= riverSteps; i++) {
        const progress = i / riverSteps;
        const { x, y, riverWidth } = getRiverPoint(progress);
        const waveOffset = Math.sin(progress * 18 - time * 3.5) * (progress * 4);
        leftPoints.push({ x: x - riverWidth * 0.5 + waveOffset, y });
        rightPoints.push({ x: x + riverWidth * 0.5 + waveOffset, y });
      }

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
        riverGrad.addColorStop(0.35, '#00A8E8');
        riverGrad.addColorStop(0.75, '#38bdf8');
        riverGrad.addColorStop(1, '#0369a1');
      } else if (sceneType === 'BRAHMAPUTRA_SURGE') {
        riverGrad.addColorStop(0, '#0369a1');
        riverGrad.addColorStop(0.5, '#38bdf8');
        riverGrad.addColorStop(1, '#d97706');
      } else {
        riverGrad.addColorStop(0, '#00A8E8');
        riverGrad.addColorStop(0.5, '#38bdf8');
        riverGrad.addColorStop(1, '#0284c7');
      }
      ctx.fillStyle = riverGrad;
      ctx.fill();

      // Specular Water Shimmer & Wave Flow
      for (let i = 2; i < riverSteps - 1; i += 2) {
        const progress = i / riverSteps;
        const { x, y, riverWidth } = getRiverPoint(progress);
        const rippleX = x + Math.sin(progress * 22 - time * 4.5) * (riverWidth * 0.3);
        const rippleWidth = riverWidth * (0.35 + Math.sin(progress * 12 + time * 2) * 0.25);

        ctx.beginPath();
        ctx.ellipse(rippleX, y, rippleWidth * 0.5, Math.max(1.5, progress * 3.5), 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.45 + Math.sin(progress * 10 - time * 3.5) * 0.35})`;
        ctx.fill();
      }
      ctx.restore();

      // ── 7. REALISTIC RAINDROPS (Diagonal Precipitation Streaks) ──
      ctx.save();
      const rainAngle = 0.22; // ~12.5 degree slant
      const cosAngle = Math.cos(rainAngle);
      const sinAngle = Math.sin(rainAngle);

      raindrops.forEach((drop) => {
        if (isPlaying) {
          drop.x += sinAngle * drop.speed;
          drop.y += cosAngle * drop.speed;

          // When drop hits bottom area or river, trigger small ripple splash
          if (drop.y > height * 0.65 && Math.random() < 0.04) {
            splashes.push({
              x: drop.x,
              y: drop.y,
              radius: 1,
              maxRadius: 8 + Math.random() * 10,
              opacity: 0.6,
            });
          }

          // Reset raindrop to top when leaving screen
          if (drop.y > height + 50 || drop.x > width + 100) {
            drop.y = -drop.length - Math.random() * 80;
            drop.x = Math.random() * (width + 200) - 100;
          }
        }

        // Draw individual raindrop streak
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
          s.radius += 0.6;
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

      // ── 8. SUBTLE VIGNETTE FOR CLEAN CONTRAST ──
      const vignette = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.35, width * 0.5, height * 0.5, width * 0.8);
      vignette.addColorStop(0, 'rgba(2, 7, 20, 0)');
      vignette.addColorStop(1, 'rgba(2, 7, 20, 0.65)');
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
      className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700"
    />
  );
};
