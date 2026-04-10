"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Mini-sandbox interactif qui démontre l'API déclarative de Pulse JS.
 *
 * Affiche le markup HTML / le code JS Pulse à gauche, et un live preview
 * fonctionnel à droite. Le live preview est implémenté en React mais
 * mime exactement le comportement qu'aurait Pulse JS — l'idée est de
 * démontrer le mental model.
 */

const HTML_SNIPPET = `<div data-pulse="counter">
  <button data-pulse-on="click" data-pulse-do="dec">−</button>
  <span data-pulse-bind="count">0</span>
  <button data-pulse-on="click" data-pulse-do="inc">+</button>
</div>`;

const JS_SNIPPET = `Pulse.component("counter", {
  state: { count: 0 },
  actions: {
    inc(state) { state.count++ },
    dec(state) { state.count-- },
  },
});`;

type Tab = "html" | "js";

export default function PulseSandbox() {
  const [count, setCount] = useState(0);
  const [tab, setTab] = useState<Tab>("html");
  const snippet = tab === "html" ? HTML_SNIPPET : JS_SNIPPET;

  return (
    <div
      className="grid grid-cols-1 overflow-hidden rounded-xl border md:grid-cols-2"
      style={{ borderColor: "var(--border-strong)", background: "var(--color-ink-soft)" }}
    >
      {/* CODE */}
      <div className="border-b md:border-b-0 md:border-r" style={{ borderColor: "var(--border)" }}>
        {/* Tabs */}
        <div
          className="flex items-center justify-between border-b px-4 py-2"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex gap-1">
            {(["html", "js"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  tab === t
                    ? "bg-[var(--color-accent)] text-[var(--color-ink)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                {t === "html" ? "Markup" : "Component"}
              </button>
            ))}
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-dim)]">
            pulse-js · live demo
          </span>
        </div>

        <pre className="overflow-x-auto p-5 text-[12px] leading-relaxed">
          <AnimatePresence mode="wait">
            <motion.code
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="block font-mono text-[var(--fg)]"
            >
              {snippet}
            </motion.code>
          </AnimatePresence>
        </pre>
      </div>

      {/* LIVE PREVIEW */}
      <div className="relative flex flex-col">
        <div
          className="flex items-center justify-between border-b px-4 py-2"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
            Live preview
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[var(--color-accent)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent)]" />
            running
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center p-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCount((c) => c - 1)}
              aria-label="Décrémenter"
              className="flex h-12 w-12 items-center justify-center rounded-full border text-2xl transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] active:scale-95"
              style={{ borderColor: "var(--border-strong)" }}
            >
              −
            </button>
            <motion.span
              key={count}
              initial={{ scale: 0.7, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className="min-w-[3ch] text-center font-serif text-5xl text-[var(--color-accent)] tabular-nums"
            >
              {count}
            </motion.span>
            <button
              type="button"
              onClick={() => setCount((c) => c + 1)}
              aria-label="Incrémenter"
              className="flex h-12 w-12 items-center justify-center rounded-full border text-2xl transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] active:scale-95"
              style={{ borderColor: "var(--border-strong)" }}
            >
              +
            </button>
          </div>
        </div>

        <div
          className="border-t px-4 py-2 font-mono text-[9px] uppercase tracking-widest text-[var(--fg-dim)]"
          style={{ borderColor: "var(--border)" }}
        >
          state.count ={" "}
          <span className="text-[var(--color-accent)]">{count}</span>
        </div>
      </div>
    </div>
  );
}
