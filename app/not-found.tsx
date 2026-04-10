"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    setParticles(generateParticles(18));
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
          <motion.span
            key={p.id}
            className="absolute font-mono select-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: p.size,
              opacity: p.opacity,
              color: "var(--color-accent)",
            }}
            animate={{
              y: [0, -30, 10, -20, 0],
              x: [0, 15, -10, 5, 0],
              rotate: [0, 5, -5, 3, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          >
            {p.symbol}
          </motion.span>
        ))}
      </div>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex items-center gap-3"
      >
        <span className="block h-[1px] w-10 bg-[var(--color-accent)]" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
          Page introuvable
        </span>
        <span className="block h-[1px] w-10 bg-[var(--color-accent)]" />
      </motion.div>

      {/* Grand 404 avec glitch + parallaxe */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        style={{ x: mousePos.x, y: mousePos.y }}
        className="relative select-none cursor-pointer"
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
          <motion.span
            animate={{ rotate: [0, -15, 15, -8, 8, 0], scale: [1, 1.1, 0.95, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
            className="inline-block text-[var(--color-accent)]"
          >
            0
          </motion.span>
          4
        </span>
      </motion.div>

      {/* Easter egg message */}
      <AnimatePresence>
        {secretMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 font-mono text-xs text-[var(--color-accent)]"
          >
            {secretMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Titre */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 font-serif text-[clamp(1.5rem,4vw,3rem)] leading-tight"
      >
        Oups, cette page s&apos;est{" "}
        <span className="italic text-[var(--color-accent)]">volatilisée</span>.
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-4 max-w-md text-[var(--fg-muted)]"
      >
        Lien périmé, URL créative, ou passage secret pas encore codé.
      </motion.p>

      {/* Mini console */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-8 w-full max-w-sm rounded-xl border p-4 text-left"
        style={{
          borderColor: "var(--border-strong)",
          background: "var(--elevated)",
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
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={
                i === displayedLines.length - 1 && consoleIndex >= CONSOLE_LINES.length
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--fg-muted)]"
              }
            >
              {line}
            </motion.div>
          ))}
          {/* Curseur clignotant */}
          {consoleIndex < CONSOLE_LINES.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="inline-block text-[var(--color-accent)]"
            >
              _
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Link href="/" className="btn-accent">
          ← Retour à l&apos;accueil
        </Link>
        <Link href="/notes" className="btn-ghost">
          Lire les notes
        </Link>
      </motion.div>

      {/* Hint clavier */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-16 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-dim)]"
      >
        Appuyez sur{" "}
        <kbd
          className="rounded border px-1.5 py-0.5"
          style={{ borderColor: "var(--border-strong)" }}
        >
          Esc
        </kbd>{" "}
        ou naviguez avec le menu
      </motion.p>

      {/* Glitch CSS */}
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
      `}</style>
    </main>
  );
}
