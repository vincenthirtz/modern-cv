"use client";

import { Fragment, useState, type CSSProperties, type ReactNode } from "react";
import AnimatedText from "./AnimatedText";
import Counter from "./Counter";
import MagneticButton from "./MagneticButton";
import Marquee from "./Marquee";
import TiltCard from "./TiltCard";

/* ─────────── Mini syntax highlighter (JSX + CSS) ─────────── */

const TOKEN_COLORS: Record<string, CSSProperties> = {
  comment: { color: "#6b7280", fontStyle: "italic" },
  string: { color: "#a3e635" },
  tag: { color: "#7dd3fc" },
  attr: { color: "#fca5a5" },
  keyword: { color: "#c4b5fd" },
  number: { color: "#fcd34d" },
  punct: { color: "#94a3b8" },
  atrule: { color: "#c4b5fd" },
  selector: { color: "#fca5a5" },
  prop: { color: "#7dd3fc" },
  hex: { color: "#fcd34d" },
  cssvar: { color: "#a3e635" },
  plain: { color: "inherit" },
};

const JSX_RE =
  /(?<comment>\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(?<string>`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(?<tag><\/?[A-Za-z][\w.]*|\/?>)|(?<attr>\b[a-zA-Z_][\w-]*(?==))|(?<keyword>\b(?:const|let|var|function|return|import|from|export|default|if|else|true|false|null|undefined|async|await|new|class|for|while|typeof|in|of|this)\b)|(?<number>\b\d+(?:\.\d+)?\b)|(?<punct>[{}()[\];,.=])/g;

const CSS_RE =
  /(?<comment>\/\*[\s\S]*?\*\/)|(?<atrule>@[\w-]+)|(?<string>"[^"]*"|'[^']*')|(?<hex>#[0-9a-fA-F]{3,8}\b)|(?<number>-?\d+(?:\.\d+)?(?:px|em|rem|ms|s|%|vh|vw|fr|deg)?)|(?<cssvar>--[\w-]+|\bvar\b)|(?<selector>(?:^|\n)\s*[.#&:][\w:\-.&[\]]*)|(?<prop>\b[a-z-]+(?=\s*:))|(?<punct>[{};])/g;

function tokenize(src: string, re: RegExp) {
  const out: { t: string; v: string }[] = [];
  let last = 0;
  for (const m of src.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ t: "plain", v: src.slice(last, i) });
    const g = m.groups ?? {};
    const t = Object.keys(g).find((k) => g[k] !== undefined) ?? "plain";
    out.push({ t, v: m[0] });
    last = i + m[0].length;
  }
  if (last < src.length) out.push({ t: "plain", v: src.slice(last) });
  return out;
}

function Highlighted({ code, lang }: { code: string; lang: "jsx" | "css" }) {
  const tokens = tokenize(code, lang === "jsx" ? JSX_RE : CSS_RE);
  return (
    <>
      {tokens.map((tok, i) => (
        <Fragment key={i}>
          <span style={TOKEN_COLORS[tok.t] ?? TOKEN_COLORS.plain}>{tok.v}</span>
        </Fragment>
      ))}
    </>
  );
}

interface StoryProps {
  name: string;
  description: string;
  code: string;
  source: string;
  css: string;
  children: ReactNode;
  /** Hauteur minimale du canvas de démo */
  minH?: string;
}

type Tab = "preview" | "code" | "source" | "css";

function Story({
  name,
  description,
  code,
  source,
  css,
  children,
  minH = "min-h-[180px]",
}: StoryProps) {
  const [tab, setTab] = useState<Tab>("preview");
  const [copied, setCopied] = useState(false);

  const currentSnippet = tab === "source" ? source : tab === "css" ? css : code;
  const currentLang: "jsx" | "css" = tab === "css" ? "css" : "jsx";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(currentSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "preview", label: "Preview" },
    { id: "code", label: "Usage" },
    { id: "source", label: "Core" },
    { id: "css", label: "CSS" },
  ];

  return (
    <article
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: "var(--border-strong)", background: "var(--elevated)" }}
    >
      {/* En-tête : titre + description + onglets */}
      <header
        className="flex flex-wrap items-start justify-between gap-4 border-b px-5 py-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg)]">
              {name}
            </h3>
          </div>
          <p className="mt-1 text-[13px] text-[var(--fg-muted)]">{description}</p>
        </div>
        <div
          className="inline-flex rounded-lg border p-0.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ borderColor: "var(--border-strong)", background: "var(--ink-soft)" }}
          role="tablist"
          aria-label={`Vue ${name}`}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className="rounded-md px-3 py-1 transition-colors"
              style={{
                background: tab === t.id ? "var(--color-accent)" : "transparent",
                color: tab === t.id ? "var(--color-accent-contrast)" : "var(--fg-muted)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Canvas */}
      {tab === "preview" ? (
        <div
          className={`relative flex ${minH} items-center justify-center p-8`}
          style={{
            background:
              "repeating-linear-gradient(45deg, transparent 0 12px, var(--border) 12px 13px), var(--ink-soft)",
          }}
        >
          <div className="relative z-10 w-full">{children}</div>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={handleCopy}
            aria-label={copied ? "Code copié" : "Copier le code"}
            className="absolute right-3 top-3 z-10 rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors"
            style={{
              borderColor: "var(--border-strong)",
              background: "var(--elevated)",
              color: copied ? "var(--color-accent)" : "var(--fg-muted)",
            }}
          >
            {copied ? "Copié" : "Copier"}
          </button>
          <pre
            className="overflow-x-auto p-5 font-mono text-[12px] leading-relaxed"
            style={{ background: "var(--ink)", color: "var(--fg-muted)" }}
          >
            <code>
              <Highlighted code={currentSnippet} lang={currentLang} />
            </code>
          </pre>
        </div>
      )}
    </article>
  );
}

export default function ComponentStories() {
  return (
    <section>
      <div className="mb-8 flex items-center gap-3">
        <span className="block h-[1px] w-10 bg-[var(--border-strong)]" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
          Composants · Storybook
        </span>
      </div>
      <p className="mb-8 max-w-2xl text-[var(--fg-muted)]">
        Les briques d&apos;interaction phares du site, isolées et jouables. Chaque composant gère
        lui-même l&apos;accessibilité et respecte{" "}
        <code className="font-mono text-[12px] text-[var(--color-accent)]">
          prefers-reduced-motion
        </code>
        .
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Story
          name="MagneticButton"
          description="Bouton attiré par le curseur. Coefficient d’amplitude configurable."
          code={`<MagneticButton
  href="/contact"
  className="btn btn-primary"
  strength={0.35}
>
  Me contacter →
</MagneticButton>`}
          source={`export function MagneticButton({ children, strength = 0.35, ...rest }) {
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
}`}
          css={`
            /* Le wrapper est translaté via style inline en JS.
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
            }
          `}
        >
          <div className="flex justify-center">
            <MagneticButton
              as="button"
              onClick={() => {}}
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[12px] uppercase tracking-widest"
              ariaLabel="Exemple bouton magnétique"
            >
              <span
                style={{
                  color: "var(--color-accent)",
                  borderColor: "var(--border-strong)",
                }}
              >
                Hover me →
              </span>
            </MagneticButton>
          </div>
        </Story>

        <Story
          name="TiltCard"
          description="Inclinaison 3D suivant le curseur, avec un spotlight d’accent."
          code={`<TiltCard intensity={8} spotlight>
  <div className="card p-6">
    <h4>Carte inclinable</h4>
    <p>Survolez-moi pour me voir basculer.</p>
  </div>
</TiltCard>`}
          source={`export function TiltCard({ children, intensity = 6 }) {
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
}`}
          css={`
            /* Rotation 3D pilotée via style inline.
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
              /* ex. radial-gradient(400px circle at 50% 50%,
           rgba(200,255,0,.12), transparent 60%) */
            }
          `}
        >
          <TiltCard intensity={8} className="mx-auto w-full max-w-xs">
            <div
              className="rounded-xl border p-5"
              style={{
                borderColor: "var(--border-strong)",
                background: "var(--ink)",
              }}
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

        <Story
          name="AnimatedText"
          description="Apparition mot par mot avec flou et stagger, via IntersectionObserver."
          code={`<AnimatedText
  el="h2"
  text="Design, code, émotion."
  highlight="émotion"
  splitBy="word"
/>`}
          source={`export function AnimatedText({ text, stagger = 0.06, splitBy = "word" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const tokens = splitBy === "word" ? text.split(" ") : Array.from(text);

  return (
    <span ref={ref} aria-label={text}>
      {tokens.map((tok, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            filter: inView ? "blur(0)" : "blur(12px)",
            transition: \`opacity .5s \${i * stagger}s, transform .5s \${i * stagger}s,\` +
              \` filter .4s \${i * stagger}s\`,
          }}
        >
          {tok}
          {splitBy === "word" && i < tokens.length - 1 ? "\\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}`}
          css={`
            /* Chaque token est rendu inline-block,
   puis animé en opacity + translateY + blur,
   avec un delay calculé (index × stagger). */
            .animated-word {
              display: inline-block;
              white-space: pre;
              opacity: 0;
              transform: translateY(24px);
              filter: blur(12px);
              transition:
                opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
                transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
                filter 0.4s ease;
            }

            .animated-word.is-visible {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          `}
        >
          <AnimatedText
            el="div"
            text="Design, code, émotion."
            highlight="émotion"
            splitBy="word"
            className="text-center font-serif text-3xl md:text-4xl"
          />
        </Story>

        <Story
          name="Counter"
          description="Compteur avec easing easeOutExpo, déclenché à la visibilité."
          code={`<Counter to={128} suffix="+" duration={1600} />`}
          source={`export function Counter({ to, suffix = "+", duration = 1600 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return <span ref={ref} className="tabular-nums">{value}{suffix}</span>;
}`}
          css={`
            /* Pas d'animation CSS — la valeur est incrémentée
   via requestAnimationFrame avec easeOutExpo.
   On force juste des chiffres à chasse fixe pour
   éviter que le layout ne tremble pendant le comptage. */
            .counter {
              font-variant-numeric: tabular-nums;
            }
          `}
        >
          <div className="flex items-baseline justify-center gap-6 font-serif">
            <span className="text-6xl text-[var(--color-accent)]">
              <Counter to={128} suffix="+" />
            </span>
            <span className="text-6xl text-[var(--fg-muted)]">
              <Counter to={42} suffix="%" duration={1400} />
            </span>
          </div>
        </Story>

        <Story
          name="Marquee"
          description="Bande défilante infinie, CSS pur, contenu dupliqué pour un loop invisible."
          code={`<Marquee
  items={["Next.js", "React 19", "Tailwind v4", "MDX"]}
  speed={32}
/>`}
          source={`export function Marquee({ items, speed = 40 }) {
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex w-max animate-marquee"
        style={{ animationDuration: \`\${speed}s\` }}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
            {items.map((item, i) => (
              <div key={i} className="flex items-center">
                <span className="font-serif text-3xl">{item}</span>
                <span className="mx-8 h-2 w-2 rounded-full bg-accent" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}`}
          css={`
            /* Le contenu est dupliqué dans le DOM, puis
   translaté de -50% : la boucle semble infinie. */
            @keyframes marquee {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }

            .animate-marquee {
              display: flex;
              width: max-content;
              animation: marquee 40s linear infinite;
            }

            @media (prefers-reduced-motion: reduce) {
              .animate-marquee {
                animation: none;
              }
            }
          `}
          minH="min-h-[140px]"
        >
          <div className="-mx-8">
            <Marquee
              items={["Next.js", "React 19", "Tailwind v4", "MDX", "TypeScript", "A11y"]}
              speed={32}
            />
          </div>
        </Story>

        <Story
          name="ThemeToggle · AccentPicker"
          description="Contrôles du dock, synchronisés avec localStorage et CSS custom properties."
          code={`<ThemeToggle />      // dark / light
<AccentPicker />     // Lime · Cyan · Rose · Orange · Violet`}
          source={`const ACCENTS = [
  { name: "Lime",   color: "#c8ff00", soft: "#d9ff4d" },
  { name: "Cyan",   color: "#00e5ff", soft: "#4df0ff" },
  { name: "Rose",   color: "#ff3c82", soft: "#ff6fa3" },
  { name: "Orange", color: "#ff8a00", soft: "#ffaa40" },
  { name: "Violet", color: "#a78bfa", soft: "#c4b5fd" },
];

function applyAccent(a) {
  const s = document.documentElement.style;
  s.setProperty("--color-accent", a.color);
  s.setProperty("--color-accent-soft", a.soft);
}

export function AccentPicker() {
  const [active, setActive] = useState(ACCENTS[0]);

  useEffect(() => {
    const stored = localStorage.getItem("accent");
    const match = ACCENTS.find((a) => a.name === stored) ?? ACCENTS[0];
    setActive(match);
    applyAccent(match);
  }, []);

  function pick(a) {
    setActive(a);
    applyAccent(a);
    localStorage.setItem("accent", a.name);
  }

  return (
    <div role="radiogroup" aria-label="Couleur d'accentuation">
      {ACCENTS.map((a) => (
        <button
          key={a.name}
          role="radio"
          aria-checked={active.name === a.name}
          onClick={() => pick(a)}
          style={{ background: a.color }}
        />
      ))}
    </div>
  );
}`}
          css={`
            /* Toutes les couleurs du site lisent des custom
   properties — on ne change que les variables,
   jamais les composants. */
            :root {
              --color-accent: #c8ff00; /* Lime par défaut */
              --color-accent-soft: #d9ff4d;
              --color-accent-contrast: #1a1a1a;
            }

            :root.light {
              --color-accent: #4a7a00; /* contrastes WCAG AA */
            }

            /* Le toggle applique simplement la classe .light
   sur <html>, le reste suit via var(). */
            html {
              transition: background-color 0.3s ease;
            }
          `}
        >
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
                style={{
                  borderColor: "var(--border-strong)",
                  background: "var(--elevated)",
                  color: "var(--color-accent)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-dim)]">
                Theme
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div
                className="inline-flex gap-1 rounded-full border px-2 py-1.5"
                style={{
                  borderColor: "var(--border-strong)",
                  background: "var(--elevated)",
                }}
              >
                {["#c8ff00", "#00e5ff", "#ff3c82", "#ff8a00", "#a78bfa"].map((c) => (
                  <span key={c} className="block h-5 w-5 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-dim)]">
                Accents
              </span>
            </div>
          </div>
        </Story>
      </div>
    </section>
  );
}
