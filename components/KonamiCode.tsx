"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const CONFETTI_COLORS = ["#ff00d4", "#c8ff00", "#00d4ff", "#ff6b00", "#a855f7", "#f43f5e"];
const PARTICLE_COUNT = 120;
const DURATION = 6000;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: "rect" | "circle";
  opacity: number;
}

function createParticles(width: number, height: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: width / 2 + (Math.random() - 0.5) * width * 0.3,
    y: height * 0.4,
    vx: (Math.random() - 0.5) * 14,
    vy: -Math.random() * 18 - 4,
    size: Math.random() * 8 + 4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.3,
    shape: Math.random() > 0.5 ? "rect" : "circle",
    opacity: 1,
  }));
}

/**
 * Easter egg : Konami Code → party mode avec barrel roll, confettis et rainbow.
 */
export default function KonamiCode() {
  const [active, setActive] = useState(false);
  const [exiting, setExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const startConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = createParticles(canvas.width, canvas.height);
    const gravity = 0.4;
    const friction = 0.99;
    const startTime = performance.now();

    function animate(now: number) {
      if (!ctx || !canvas) return;
      const elapsed = now - startTime;
      const fadeOut = elapsed > DURATION - 1500 ? 1 - (elapsed - (DURATION - 1500)) / 1500 : 1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.vy += gravity;
        p.vx *= friction;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, fadeOut);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (elapsed < DURATION) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    let buffer: string[] = [];

    function onKey(e: KeyboardEvent) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer.push(key);
      if (buffer.length > SEQUENCE.length) buffer = buffer.slice(-SEQUENCE.length);
      const matches = buffer.every((k, i) => k === SEQUENCE[i]);
      if (matches && buffer.length === SEQUENCE.length) {
        setActive(true);
        setExiting(false);

        // Barrel roll
        document.documentElement.classList.add("konami-barrel-roll");

        // Rainbow accent cycling
        document.documentElement.classList.add("konami-rainbow");

        setTimeout(() => {
          setExiting(true);
          setTimeout(() => {
            setActive(false);
            setExiting(false);
            document.documentElement.classList.remove("konami-barrel-roll", "konami-rainbow");
          }, 400);
        }, DURATION - 400);

        buffer = [];
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Lancer les confettis quand le mode s'active
  useEffect(() => {
    if (active && !exiting) {
      startConfetti();
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [active, exiting, startConfetti]);

  if (!active) return null;

  return (
    <>
      {/* Canvas confettis plein écran */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[200]"
        aria-hidden="true"
      />

      {/* Toast message */}
      <div
        className="fixed bottom-8 left-1/2 z-[201] flex items-center gap-3 rounded-full border px-6 py-3 font-mono text-sm uppercase tracking-widest"
        style={{
          background: "var(--elevated)",
          borderColor: "#ff00d4",
          color: "#ff00d4",
          boxShadow: "0 0 60px rgba(255, 0, 212, 0.5), 0 0 120px rgba(200, 255, 0, 0.2)",
          transform: exiting
            ? "translateX(-50%) translateY(40px) scale(0.9)"
            : "translateX(-50%) translateY(0) scale(1)",
          opacity: exiting ? 0 : 1,
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <span className="text-lg" role="img" aria-label="fête">
          🎉
        </span>
        Party mode activé !
        <span className="text-lg" role="img" aria-label="fusée">
          🚀
        </span>
      </div>
    </>
  );
}
