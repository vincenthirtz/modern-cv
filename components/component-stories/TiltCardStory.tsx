"use client";

import Story from "../Story";
import TiltCard from "../TiltCard";

const CODE = `<TiltCard intensity={8} spotlight>
  <div className="card p-6">
    <h4>Carte inclinable</h4>
    <p>Survolez-moi pour me voir basculer.</p>
  </div>
</TiltCard>`;

const SOURCE = `export function TiltCard({ children, intensity = 6 }) {
  const ref = useRef(null);
  const spot = useRef(null);

  function onMove(e) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform =
      \`perspective(1200px) rotateX(\${-py * intensity * 2}deg)\` +
      \` rotateY(\${px * intensity * 2}deg)\`;
    spot.current.style.background =
      \`radial-gradient(400px circle at \${(px + 0.5) * 100}% \${(py + 0.5) * 100}%,\` +
      \` rgba(200,255,0,0.12), transparent 60%)\`;
  }

  function onLeave() {
    ref.current.style.transform = "perspective(1200px) rotateX(0) rotateY(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
      <div ref={spot} aria-hidden className="absolute inset-0" />
    </div>
  );
}`;

const CSS = `/* Rotation 3D pilotée via style inline.
   Le CSS cadre la perspective et le spotlight. */
.tilt {
  position: relative;
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Spotlight qui suit le curseur (background radial-gradient
   mis à jour en JS sur ::after équivalent) */
.tilt__spot {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}`;

export default function TiltCardStory() {
  return (
    <Story
      name="TiltCard"
      description="Inclinaison 3D suivant le curseur, avec un spotlight d’accent."
      code={CODE}
      source={SOURCE}
      css={CSS}
    >
      <TiltCard intensity={8} className="mx-auto w-full max-w-xs">
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "var(--border-strong)", background: "var(--ink)" }}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
            3D Tilt
          </div>
          <div className="mt-2 font-serif text-2xl leading-tight">Survolez-moi.</div>
          <p className="mt-2 text-[12px] text-[var(--fg-muted)]">
            Rotation 3D avec spotlight d’accent.
          </p>
        </div>
      </TiltCard>
    </Story>
  );
}
