"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Page 404 enrichie avec animations Framer Motion,
 * un glitch sur le code 404 et un lien de retour bien visible.
 */
export default function NotFound() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Halo accent en fond */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(600px circle at 50% 40%, var(--color-accent), transparent 70%)",
        }}
      />

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

      {/* Grand 404 avec parallaxe souris */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        style={{ x: mousePos.x, y: mousePos.y }}
        className="relative select-none"
      >
        <span
          className="block font-serif text-[clamp(8rem,25vw,16rem)] leading-none tracking-tight"
          style={{ color: "var(--color-accent)", opacity: 0.12 }}
        >
          404
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center font-serif text-[clamp(3rem,10vw,7rem)] leading-none"
        >
          4
          <motion.span
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block text-[var(--color-accent)]"
          >
            0
          </motion.span>
          4
        </span>
      </motion.div>

      {/* Titre */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 font-serif text-[clamp(1.5rem,4vw,3rem)] leading-tight"
      >
        Cette page <span className="italic text-[var(--color-accent)]">n&apos;existe pas</span>.
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-4 max-w-md text-[var(--fg-muted)]"
      >
        Vous avez peut-être suivi un lien périmé, ou tapé une URL un peu trop créative.
      </motion.p>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
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
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-16 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-dim)]"
      >
        Appuyez sur{" "}
        <kbd className="rounded border px-1.5 py-0.5" style={{ borderColor: "var(--border-strong)" }}>
          Esc
        </kbd>{" "}
        ou naviguez avec le menu
      </motion.p>
    </main>
  );
}
