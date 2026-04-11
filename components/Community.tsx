"use client";

import { useRef } from "react";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import SectionTitle from "./SectionTitle";

interface CommunityItem {
  type: "open-source" | "talk" | "contribution";
  typeLabel: string;
  title: string;
  role: string;
  description: string;
  href: string;
  meta: string;
}

const ITEMS: CommunityItem[] = [
  {
    type: "open-source",
    typeLabel: "Open Source",
    title: "Pulse JS Framework",
    role: "Créateur & Mainteneur",
    description:
      "Framework JavaScript déclaratif zéro-dépendance basé sur les sélecteurs CSS. Documentation, tests, releases et accueil de la communauté.",
    href: "https://github.com/vincenthirtz/pulse-js-framework",
    meta: "MIT · JavaScript",
  },
  {
    type: "contribution",
    typeLabel: "Contribution",
    title: "AsyncAPI Conference Website",
    role: "Contributeur",
    description:
      "Contribution au site officiel de la conférence AsyncAPI, événement majeur de la communauté autour des APIs événementielles.",
    href: "https://github.com/vincenthirtz/conference-website",
    meta: "TypeScript · Open Source",
  },
  {
    type: "open-source",
    typeLabel: "Side project",
    title: "Rally — PWA scavenger hunt",
    role: "Créateur",
    description:
      "PWA de rally photo et chasse au trésor à travers la France. Géolocalisation, capture, mode offline. Un terrain de jeu personnel pour les APIs web modernes.",
    href: "https://github.com/vincenthirtz/rally",
    meta: "JavaScript · PWA",
  },
];

const TYPE_ICON: Record<CommunityItem["type"], string> = {
  "open-source": "◆",
  talk: "▲",
  contribution: "✦",
};

export default function Community() {
  const listRef = useRef<HTMLUListElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const listInView = useInView(listRef, { once: true, amount: 0.2 });
  const noteInView = useInView(noteRef, { once: true });

  return (
    <section id="community" className="relative scroll-mt-32 py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          number="05"
          label="Communauté"
          title="Au-delà du code de bureau."
          highlight="Au-delà"
          description="Quand le client n'attend rien, je code quand même. Open source, contributions, expérimentations — voilà ce qui vit en parallèle."
        />

        <ul ref={listRef} className="divide-y" style={{ borderColor: "var(--border)" }}>
          {ITEMS.map((item, i) => (
            <li
              key={item.title}
              style={{
                opacity: listInView ? 1 : 0,
                transform: listInView ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
              }}
            >
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.title} sur GitHub (nouvel onglet)`}
                className="group grid grid-cols-[auto_1fr_auto] items-start gap-6 py-8 transition-colors"
              >
                {/* Icône type */}
                <span
                  aria-hidden
                  className="mt-1 text-2xl text-[var(--color-accent)] transition-transform group-hover:rotate-12"
                >
                  {TYPE_ICON[item.type]}
                </span>

                {/* Contenu */}
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
                    <span
                      className="rounded-full border px-3 py-1 text-[var(--color-accent)]"
                      style={{ borderColor: "var(--color-accent)" }}
                    >
                      {item.typeLabel}
                    </span>
                    <span>{item.role}</span>
                  </div>
                  <h3 className="font-serif text-2xl leading-tight transition-colors group-hover:text-[var(--color-accent)] md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm text-[var(--fg-muted)]">
                    {item.description}
                  </p>
                  <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-dim)]">
                    {item.meta}
                  </div>
                </div>

                {/* Flèche */}
                <span
                  aria-hidden
                  className="self-center text-xl text-[var(--fg-dim)] transition-all group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Note discrète : invitation aux talks/meetups */}
        <p
          ref={noteRef}
          className="mt-12 max-w-2xl text-sm text-[var(--fg-muted)]"
          style={{
            opacity: noteInView ? 1 : 0,
            transition: "opacity 0.6s ease 0.4s",
          }}
        >
          <span className="text-[var(--color-accent)]">→</span> Vous organisez un meetup ou une
          conférence sur React, Vue, Cypress ou les frameworks DOM ?{" "}
          <Link
            href="/#contact"
            className="underline decoration-[var(--color-accent)] underline-offset-4 hover:text-[var(--color-accent)]"
          >
            On peut en parler
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
