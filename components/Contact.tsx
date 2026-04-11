"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import AnimatedText from "./AnimatedText";
import MagneticButton from "./MagneticButton";

const SOCIALS = [
  { name: "GitHub", href: "https://github.com/vincenthirtz", icon: "GH" },
  { name: "LinkedIn", href: "https://linkedin.com/in/hirtzvincent", icon: "IN" },
  { name: "Pulse JS", href: "https://pulse-js.fr", icon: "↳" },
  { name: "Email", href: "mailto:hirtzvincent@free.fr", icon: "@" },
];

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const descInView = useInView(descRef, { once: true });

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const nextErrors: FieldErrors = {};
    if (!name) nextErrors.name = "Merci d'indiquer votre nom.";
    if (!email) nextErrors.email = "Merci d'indiquer votre email.";
    else if (!EMAIL_RE.test(email)) nextErrors.email = "Format d'email invalide.";
    if (!message) nextErrors.message = "Le message ne peut pas être vide.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstErrorId = nextErrors.name ? "name" : nextErrors.email ? "email" : "message";
      document.getElementById(firstErrorId)?.focus();
      return;
    }

    setSent(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setSent(false), 4000);
  }

  return (
    <section id="contact" className="relative scroll-mt-32 py-32 px-6">
      {/* Halo accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px]"
        style={{
          background:
            "radial-gradient(800px circle at 50% 0%, rgba(200,255,0,0.06), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="font-mono text-xs text-[var(--color-accent)]">07</span>
          <span className="block h-[1px] w-10 bg-[var(--border-strong)]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
            Contact
          </span>
        </div>

        <AnimatedText
          el="h2"
          text="Travaillons ensemble."
          highlight="ensemble."
          className="font-serif text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] tracking-tight"
        />
        <p
          ref={descRef}
          className="mt-6 max-w-2xl text-lg text-[var(--fg-muted)]"
          style={{
            opacity: descInView ? 1 : 0,
            transform: descInView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
          }}
        >
          Un projet en tête ? Une équipe à structurer ? Une architecture à challenger ? Discutons-en
          — promis, je réponds vite.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Formulaire */}
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-describedby="contact-status"
            className="card space-y-5 p-8 lg:col-span-3"
          >
            <div>
              <label
                htmlFor="name"
                className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]"
              >
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Votre nom"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="mt-2 w-full border-b bg-transparent py-2 text-base outline-none transition-colors focus:border-[var(--color-accent)]"
                style={{ borderColor: errors.name ? "#ff6b6b" : "var(--border-strong)" }}
              />
              {errors.name && (
                <p
                  id="name-error"
                  role="alert"
                  className="mt-2 font-mono text-[11px] text-[#ff8a8a]"
                >
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="vous@entreprise.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="mt-2 w-full border-b bg-transparent py-2 text-base outline-none transition-colors focus:border-[var(--color-accent)]"
                style={{ borderColor: errors.email ? "#ff6b6b" : "var(--border-strong)" }}
              />
              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="mt-2 font-mono text-[11px] text-[#ff8a8a]"
                >
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="message"
                className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Parlez-moi de votre projet…"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
                className="mt-2 w-full border-b bg-transparent py-2 text-base outline-none transition-colors focus:border-[var(--color-accent)] resize-none"
                style={{ borderColor: errors.message ? "#ff6b6b" : "var(--border-strong)" }}
              />
              {errors.message && (
                <p
                  id="message-error"
                  role="alert"
                  className="mt-2 font-mono text-[11px] text-[#ff8a8a]"
                >
                  {errors.message}
                </p>
              )}
            </div>
            <div className="pt-2">
              <p id="contact-status" role="status" aria-live="polite" className="sr-only">
                {sent ? "Message envoyé avec succès." : ""}
              </p>
              <MagneticButton as="button" type="submit" className="btn-accent">
                {sent ? "Message envoyé ✓" : "Envoyer"}
                {!sent && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
              </MagneticButton>
            </div>
          </form>

          {/* CTA email + socials */}
          <div className="space-y-8 lg:col-span-2">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
                Ou directement
              </div>
              <a
                href="mailto:hirtzvincent@free.fr"
                className="mt-3 block break-words font-serif text-2xl leading-tight transition-colors hover:text-[var(--color-accent)] md:text-3xl"
              >
                hirtzvincent
                <br />
                @free.fr
              </a>
              <a
                href="tel:+33769167612"
                className="mt-3 block font-mono text-xs uppercase tracking-widest text-[var(--fg-muted)] transition-colors hover:text-[var(--color-accent)]"
              >
                07 69 16 76 12
              </a>
            </div>

            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
                Réseaux
              </div>
              <ul className="mt-4 space-y-2">
                {SOCIALS.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between border-b py-3 text-sm transition-colors hover:text-[var(--color-accent)]"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span>{social.name}</span>
                      <span className="font-mono text-xs text-[var(--fg-dim)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                        {social.icon} ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
