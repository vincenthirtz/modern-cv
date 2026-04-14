"use client";

import { useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import Image from "next/image";

interface OGData {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
}

interface LinkPreviewProps {
  href: string;
  children: ReactNode;
}

/** Cache partagé entre toutes les instances pour éviter les requêtes dupliquées */
const ogCache = new Map<string, OGData | null>();

/**
 * Lien avec aperçu OG au survol. Affiche titre, description et image
 * récupérés via /api/og. Fallback gracieux : affiche simplement le lien
 * si les données sont indisponibles.
 *
 * Usage dans un fichier .mdx :
 * ```
 * <LinkPreview href="https://example.com">Texte du lien</LinkPreview>
 * ```
 */
export default function LinkPreview({ href, children }: LinkPreviewProps) {
  const [og, setOg] = useState<OGData | null>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<"above" | "below">("above");
  const linkRef = useRef<HTMLAnchorElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const fetchOg = useCallback(async () => {
    if (ogCache.has(href)) {
      setOg(ogCache.get(href) ?? null);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/og?url=${encodeURIComponent(href)}`);
      if (!res.ok) throw new Error();
      const data: OGData = await res.json();
      ogCache.set(href, data);
      setOg(data);
    } catch {
      ogCache.set(href, null);
    } finally {
      setLoading(false);
    }
  }, [href]);

  const handleEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
      if (!ogCache.has(href)) fetchOg();
      else setOg(ogCache.get(href) ?? null);

      // Calculer si le popover doit s'afficher au-dessus ou en-dessous
      if (linkRef.current) {
        const rect = linkRef.current.getBoundingClientRect();
        setPosition(rect.top > 320 ? "above" : "below");
      }
    }, 300);
  }, [href, fetchOg]);

  const handleLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const hasData = og && (og.title || og.description);

  const tooltipId = `link-preview-${href.replace(/[^a-z0-9]/gi, "-")}`;
  const announcement = loading
    ? "Chargement de l'aperçu du lien"
    : hasData
      ? `Aperçu : ${[og.siteName, og.title, og.description].filter(Boolean).join(". ")}`
      : "";

  return (
    <span className="link-preview-wrapper">
      <a
        ref={linkRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby={visible && hasData ? tooltipId : undefined}
        className="underline decoration-[var(--color-accent)] underline-offset-4 hover:text-[var(--color-accent)]"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
      >
        {children}
      </a>

      <span role="status" aria-live="polite" className="sr-only">
        {visible ? announcement : ""}
      </span>

      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          aria-hidden={!hasData}
          className={`link-preview-popover ${position === "below" ? "link-preview-below" : ""}`}
        >
          {loading && (
            <span className="flex items-center gap-2 p-4">
              <span
                aria-hidden="true"
                className="h-2 w-2 animate-pulse rounded-full"
                style={{ background: "var(--color-accent)" }}
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
                Chargement...
              </span>
            </span>
          )}

          {!loading && hasData && (
            <span className="flex gap-3 p-3">
              {og.image && (
                <span className="link-preview-img-wrapper">
                  <Image
                    src={og.image}
                    alt=""
                    className="link-preview-img"
                    fill
                    unoptimized
                    sizes="80px"
                  />
                </span>
              )}
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                {og.siteName && (
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-accent)]">
                    {og.siteName}
                  </span>
                )}
                {og.title && (
                  <span className="line-clamp-2 text-sm font-medium leading-tight text-[var(--fg)]">
                    {og.title}
                  </span>
                )}
                {og.description && (
                  <span className="line-clamp-2 text-xs leading-relaxed text-[var(--fg-muted)]">
                    {og.description}
                  </span>
                )}
              </span>
            </span>
          )}
        </span>
      )}
    </span>
  );
}
