"use client";

import { useEffect, useRef } from "react";

type Particle = {
  angle: number;
  radius: number;
  phase: number;
  speed: number;
  size: number;
  drift: number;
};

type ParticleVoiceOrbProps = {
  active?: boolean;
  className?: string;
};

const verticalPalette = ["#165282", "#3e8db0", "#55abc7", "#aadff2", "#fbfdff", "#edf7fb", "#d6edf6"];

export default function ParticleVoiceOrb({ active = false, className }: ParticleVoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let animationFrame = 0;
    let start = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const seeded = (index: number, offset: number) => {
      const value = Math.sin(index * 91.731 + offset * 47.113) * 43758.5453;
      return value - Math.floor(value);
    };

    const createParticles = () => {
      const count = Math.min(1050, Math.max(520, Math.round((width * height) / 185)));
      particles = Array.from({ length: count }, (_, index) => {
        const radiusSeed = Math.sqrt(seeded(index, 1));
        return {
          angle: seeded(index, 2) * Math.PI * 2,
          radius: radiusSeed,
          phase: seeded(index, 3) * Math.PI * 2,
          speed: .55 + seeded(index, 4) * .8,
          size: .42 + seeded(index, 6) * 1.18,
          drift: seeded(index, 7) * 2 - 1,
        };
      });
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createParticles();
    };

    const draw = (now: number) => {
      const time = (now - start) / 1000;
      const isActive = activeRef.current;
      const pulse = isActive ? Math.sin(time * 3.1) * .045 + .075 : Math.sin(time * .85) * .018 + .02;
      const rotation = time * (isActive ? .13 : .045);
      const centerX = width / 2;
      const centerY = height / 2;
      const globeRadius = Math.min(width, height) * .46;

      context.clearRect(0, 0, width, height);
      const backdrop = context.createLinearGradient(0, centerY - globeRadius, 0, centerY + globeRadius);
      backdrop.addColorStop(0, isActive ? "#0f4776" : "#165282");
      backdrop.addColorStop(.25, isActive ? "#3685ab" : "#3e8db0");
      backdrop.addColorStop(.46, "#73bad5");
      backdrop.addColorStop(.58, "#fbfcff");
      backdrop.addColorStop(.76, "#edf7fb");
      backdrop.addColorStop(1, "#d6edf6");
      context.fillStyle = backdrop;
      context.fillRect(0, 0, width, height);

      context.save();
      context.filter = `blur(${Math.max(12, width * .045)}px)`;
      context.fillStyle = isActive ? "rgba(255,255,255,.64)" : "rgba(255,255,255,.52)";
      context.beginPath();
      context.moveTo(-width * .08, centerY - height * .045);
      for (let step = 0; step <= 24; step += 1) {
        const x = (step / 24) * width;
        const wave = Math.sin(step * .38 + time * (isActive ? 1.4 : .48)) * height * .027;
        context.lineTo(x, centerY - height * .035 + wave);
      }
      for (let step = 24; step >= 0; step -= 1) {
        const x = (step / 24) * width;
        const wave = Math.sin(step * .38 + time * (isActive ? 1.4 : .48) + .8) * height * .022;
        context.lineTo(x, centerY + height * .13 + wave);
      }
      context.closePath();
      context.fill();
      context.restore();

      context.globalCompositeOperation = "lighter";
      particles.forEach((particle) => {
        const edge = particle.radius;
        const angle = particle.angle + rotation * particle.speed + particle.drift * Math.sin(time * .31 + particle.phase) * .05;
        const currentWave = Math.sin(angle * 3 + time * (isActive ? 2.25 : .72) + particle.phase) * (isActive ? .055 : .026);
        const innerWave = Math.sin(edge * 15 - time * (isActive ? 2.8 : .9) + particle.phase) * (isActive ? .035 : .014);
        const radius = globeRadius * edge * (1 + pulse + currentWave + innerWave);
        const sphereDepth = Math.sqrt(Math.max(0, 1 - edge * edge));
        const squash = .94 + sphereDepth * .06;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * squash + particle.drift * Math.sin(time * .7 + particle.phase) * globeRadius * .012;
        const alpha = Math.min(.72, .1 + sphereDepth * .36 + (isActive ? .12 : 0));
        const size = particle.size * (0.56 + sphereDepth * .56) * (isActive ? 1.08 : 1);
        const verticalPosition = Math.max(0, Math.min(.999, (y - (centerY - globeRadius)) / (globeRadius * 2)));
        const colorIndex = Math.min(verticalPalette.length - 1, Math.floor(verticalPosition * verticalPalette.length));

        context.globalAlpha = alpha;
        context.fillStyle = verticalPalette[colorIndex];
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();
      });

      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 1;
      const vignette = context.createRadialGradient(centerX * .88, centerY * .83, globeRadius * .18, centerX, centerY, globeRadius * 1.08);
      vignette.addColorStop(0, "rgba(18,68,101,0)");
      vignette.addColorStop(.74, "rgba(20,74,107,.025)");
      vignette.addColorStop(1, "rgba(11,52,84,.34)");
      context.fillStyle = vignette;
      context.fillRect(0, 0, width, height);

      if (!reduceMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    draw(start);

    return () => {
      observer.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
