"use client";

import MagneticButton from "../MagneticButton";
import Story from "../Story";

const CODE = `<MagneticButton
  href="/contact"
  className="btn btn-primary"
  strength={0.35}
>
  Me contacter →
</MagneticButton>`;

const SOURCE = `export function MagneticButton({ children, strength = 0.35, ...rest }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  function onMove(e) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    setOffset({
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
    });
  }

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      style={{
        transform: \`translate(\${offset.x}px, \${offset.y}px)\`,
        transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
      {...rest}
    >
      {children}
    </button>
  );
}`;

const CSS = `/* Le wrapper est translaté via style inline en JS.
   On confie seulement la transition au CSS pour un
   retour fluide quand le curseur quitte la zone. */
.magnetic {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .magnetic {
    transform: none !important;
  }
}`;

export default function MagneticButtonStory() {
  return (
    <Story
      name="MagneticButton"
      description="Bouton attiré par le curseur. Coefficient d’amplitude configurable."
      code={CODE}
      source={SOURCE}
      css={CSS}
    >
      <div className="flex justify-center">
        <MagneticButton
          as="button"
          onClick={() => {}}
          className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-widest"
          ariaLabel="Exemple bouton magnétique"
        >
          <span style={{ color: "var(--color-accent)", borderColor: "var(--border-strong)" }}>
            Hover me →
          </span>
        </MagneticButton>
      </div>
    </Story>
  );
}
