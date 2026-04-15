"use client";

import Story from "../Story";

const CODE = `<ThemeToggle />      // dark / light
<AccentPicker />     // Lime · Cyan · Rose · Orange · Violet`;

const SOURCE = `const ACCENTS = [
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
}`;

const CSS = `/* Toutes les couleurs du site lisent des custom
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
html { transition: background-color 0.3s ease; }`;

const ACCENT_PREVIEWS = ["#c8ff00", "#00e5ff", "#ff3c82", "#ff8a00", "#a78bfa"];

export default function ThemeAccentStory() {
  return (
    <Story
      name="ThemeToggle · AccentPicker"
      description="Contrôles du dock, synchronisés avec localStorage et CSS custom properties."
      code={CODE}
      source={SOURCE}
      css={CSS}
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
          <span className="font-mono text-[0.625rem] uppercase tracking-widest text-[var(--fg-dim)]">
            Theme
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div
            className="inline-flex gap-1 rounded-full border px-2 py-1.5"
            style={{ borderColor: "var(--border-strong)", background: "var(--elevated)" }}
          >
            {ACCENT_PREVIEWS.map((c) => (
              <span key={c} className="block h-5 w-5 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <span className="font-mono text-[0.625rem] uppercase tracking-widest text-[var(--fg-dim)]">
            Accents
          </span>
        </div>
      </div>
    </Story>
  );
}
