"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

/* Symboles de code flottants */
const CODE_SYMBOLS = [
  "</>",
  "{ }",
  "=>",
  "404",
  "null",
  "???",
  "//",
  "/*",
  "0x0",
  "NaN",
  "undefined",
  "git lost",
  "rm -rf",
  ":()",
  "...",
  "¯\\_(ツ)_/¯",
];

interface Particle {
  id: number;
  symbol: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    symbol: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 10 + Math.random() * 14,
    duration: 8 + Math.random() * 16,
    delay: Math.random() * -20,
    opacity: 0.06 + Math.random() * 0.12,
  }));
}

/** Messages affichés en boucle dans la fausse console */
const CONSOLE_LINES = [
  "> Recherche de la page…",
  "> 404: fichier introuvable",
  "> Vérification du cache… vide",
  "> Tentative DNS… échec",
  "> Recherche dans /dev/null…",
  "> Résultat : ¯\\_(ツ)_/¯",
  "> Suggestion : retourner à l'accueil",
];

export default function NotFound() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [consoleIndex, setConsoleIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setParticles(generateParticles(18));
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  /* Console qui affiche les lignes une par une */
  useEffect(() => {
    if (consoleIndex >= CONSOLE_LINES.length) return;
    const timer = setTimeout(
      () => {
        setDisplayedLines((prev) => [...prev, CONSOLE_LINES[consoleIndex]]);
        setConsoleIndex((i) => i + 1);
      },
      consoleIndex === 0 ? 1200 : 1000 + Math.random() * 800,
    );
    return () => clearTimeout(timer);
  }, [consoleIndex]);

  const handleSecretClick = useCallback(() => {
    setClickCount((c) => c + 1);
  }, []);

  const secretMessage =
    clickCount >= 5
      ? "OK, tu as trouvé l'easter egg. Bravo, dev curieux."
      : clickCount >= 3
        ? "Continue de cliquer…"
        : null;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Halo accent en fond */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(600px circle at 50% 40%, var(--color-accent), transparent 70%)",
        }}
      />

      {/* Particules flottantes de code */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute font-mono select-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: p.size,
              opacity: p.opacity,
              color: "var(--color-accent)",
              animation: `not-found-float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.symbol}
          </span>
        ))}
      </div>

      {/* Label */}
      <div
        className="mb-8 flex items-center gap-3"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <span className="block h-[1px] w-10 bg-[var(--color-accent)]" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
          Page introuvable
        </span>
        <span className="block h-[1px] w-10 bg-[var(--color-accent)]" />
      </div>

      {/* Grand 404 avec glitch + parallaxe */}
      <div
        className="relative select-none cursor-pointer"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: "transform 0.3s ease",
        }}
        onClick={handleSecretClick}
        role="presentation"
      >
        {/* Couche ombre large */}
        <span
          className="block font-serif text-[clamp(8rem,25vw,16rem)] leading-none tracking-tight"
          style={{ color: "var(--color-accent)", opacity: 0.1 }}
        >
          404
        </span>

        {/* Couche glitch — copies décalées */}
        <span
          className="absolute inset-0 flex items-center justify-center font-serif text-[clamp(3rem,10vw,7rem)] leading-none glitch-text"
          aria-hidden="true"
        >
          404
        </span>

        {/* Couche principale */}
        <span className="absolute inset-0 flex items-center justify-center font-serif text-[clamp(3rem,10vw,7rem)] leading-none">
          4
          <span
            className="inline-block text-[var(--color-accent)]"
            style={{ animation: "not-found-wiggle 2.5s ease-in-out infinite 2s" }}
          >
            0
          </span>
          4
        </span>
      </div>

      {/* Easter egg message */}
      {secretMessage && (
        <p
          className="mt-2 font-mono text-xs text-[var(--color-accent)]"
          style={{ animation: "not-found-fade-in 0.3s ease" }}
        >
          {secretMessage}
        </p>
      )}

      {/* Titre */}
      <h1
        className="mt-6 font-serif text-[clamp(1.5rem,4vw,3rem)] leading-tight"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
        }}
      >
        Oups, cette page s&apos;est{" "}
        <span className="italic text-[var(--color-accent)]">volatilisée</span>.
      </h1>

      {/* Description */}
      <p
        className="mt-4 max-w-md text-[var(--fg-muted)]"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
        }}
      >
        Lien périmé, URL créative, ou passage secret pas encore codé.
      </p>

      {/* Mini console */}
      <div
        className="mt-8 w-full max-w-sm rounded-xl border p-4 text-left"
        style={{
          borderColor: "var(--border-strong)",
          background: "var(--elevated)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s",
        }}
        role="presentation"
        aria-hidden="true"
      >
        {/* Barre de fenêtre */}
        <div className="mb-3 flex items-center gap-1.5">
          <span className="block h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="block h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="block h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 font-mono text-[10px] text-[var(--fg-dim)]">terminal</span>
        </div>

        {/* Lignes de console */}
        <div className="space-y-1 font-mono text-xs">
          {displayedLines.map((line, i) => (
            <div
              key={i}
              style={{ animation: "not-found-line-in 0.3s ease" }}
              className={
                i === displayedLines.length - 1 && consoleIndex >= CONSOLE_LINES.length
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--fg-muted)]"
              }
            >
              {line}
            </div>
          ))}
          {/* Curseur clignotant */}
          {consoleIndex < CONSOLE_LINES.length && (
            <span
              className="inline-block text-[var(--color-accent)]"
              style={{ animation: "not-found-blink 0.6s step-end infinite" }}
            >
              _
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease 0.65s, transform 0.6s ease 0.65s",
        }}
      >
        <Link href="/" className="btn-accent">
          Retour à l&apos;accueil
        </Link>
        <Link href="/notes" className="btn-ghost">
          Lire les notes
        </Link>
      </div>

      {/* Hint clavier */}
      <p
        className="mt-16 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-dim)]"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.6s ease 1s",
        }}
      >
        Appuyez sur{" "}
        <kbd
          className="rounded border px-1.5 py-0.5"
          style={{ borderColor: "var(--border-strong)" }}
        >
          Esc
        </kbd>{" "}
        ou naviguez avec le menu
      </p>

      {/* Glitch + animations CSS */}
      <style>{`
        @keyframes glitch {
          0%, 90%, 100% {
            clip-path: inset(0 0 0 0);
            transform: translate(0);
          }
          92% {
            clip-path: inset(20% 0 40% 0);
            transform: translate(-4px, 2px);
          }
          94% {
            clip-path: inset(60% 0 10% 0);
            transform: translate(4px, -2px);
          }
          96% {
            clip-path: inset(30% 0 30% 0);
            transform: translate(-2px, 1px);
          }
          98% {
            clip-path: inset(10% 0 60% 0);
            transform: translate(2px, -1px);
          }
        }
        .glitch-text {
          color: var(--color-accent);
          opacity: 0.3;
          animation: glitch 4s ease-in-out infinite;
        }
        @keyframes not-found-float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(15px, -30px) rotate(5deg); }
          50% { transform: translate(-10px, 10px) rotate(-5deg); }
          75% { transform: translate(5px, -20px) rotate(3deg); }
        }
        @keyframes not-found-wiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          15% { transform: rotate(-15deg) scale(1.1); }
          30% { transform: rotate(15deg) scale(0.95); }
          45% { transform: rotate(-8deg) scale(1.05); }
          60% { transform: rotate(8deg) scale(1); }
        }
        @keyframes not-found-fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes not-found-line-in {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes not-found-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </main>
  );
}
