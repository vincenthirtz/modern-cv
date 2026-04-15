"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Mini-sandbox interactif qui démontre l'API déclarative de Pulse JS.
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
  const [animating, setAnimating] = useState(false);
  const countRef = useRef<HTMLSpanElement>(null);
  const snippet = tab === "html" ? HTML_SNIPPET : JS_SNIPPET;

  // Trigger counter pop animation on change
  useEffect(() => {
    if (!countRef.current) return;
    const el = countRef.current;
    el.style.transform = "scale(0.7) translateY(8px)";
    el.style.opacity = "0";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transform = "scale(1) translateY(0)";
        el.style.opacity = "1";
      });
    });
  }, [count]);

  function handleTabChange(t: Tab) {
    if (t === tab) return;
    setAnimating(true);
    setTimeout(() => {
      setTab(t);
      setAnimating(false);
    }, 150);
  }

  return (
    <div
      className="grid grid-cols-1 overflow-hidden rounded-xl border md:grid-cols-2"
      style={{ borderColor: "var(--border-strong)", background: "var(--elevated)" }}
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
                onClick={() => handleTabChange(t)}
                className={`rounded-full px-3 py-1 font-mono text-[0.625rem] uppercase tracking-widest transition-colors ${
                  tab === t
                    ? "bg-[var(--color-accent)] text-[var(--color-ink)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                {t === "html" ? "Markup" : "Component"}
              </button>
            ))}
          </div>
          <span className="font-mono text-[0.5625rem] uppercase tracking-widest text-[var(--fg-dim)]">
            pulse-js · live demo
          </span>
        </div>

        <pre
          className="overflow-x-auto p-5 text-[0.75rem] leading-relaxed"
          tabIndex={0}
          role="region"
          aria-label="Extrait de code Pulse"
        >
          <code
            className="block font-mono text-[var(--fg)]"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(-6px)" : "translateY(0)",
              transition: "opacity 0.15s ease, transform 0.15s ease",
            }}
          >
            {snippet}
          </code>
        </pre>
      </div>

      {/* LIVE PREVIEW */}
      <div className="relative flex flex-col">
        <div
          className="flex items-center justify-between border-b px-4 py-2"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="font-mono text-[0.625rem] uppercase tracking-widest text-[var(--fg-muted)]">
            Live preview
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-widest text-[var(--color-accent)]">
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
            <span
              ref={countRef}
              className="min-w-[3ch] text-center font-serif text-5xl text-[var(--color-accent)] tabular-nums"
              style={{
                transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease",
              }}
            >
              {count}
            </span>
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
          className="border-t px-4 py-2 font-mono text-[0.5625rem] uppercase tracking-widest text-[var(--fg-dim)]"
          style={{ borderColor: "var(--border)" }}
        >
          state.count = <span className="text-[var(--color-accent)]">{count}</span>
        </div>
      </div>
    </div>
  );
}
