import { Children, isValidElement, type ReactNode } from "react";
import CopyButton from "./CopyButton";

/**
 * Briques typographiques réutilisables pour les articles.
 * Une seule source de vérité pour le rythme vertical et les styles de prose.
 */

/** Extrait le texte brut d'un ReactNode pour générer un slug d'ancre. */
function textContent(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (isValidElement(node)) return textContent((node.props as { children?: ReactNode }).children);
  if (Array.isArray(node)) return Children.toArray(node).map(textContent).join("");
  return "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="font-serif text-xl leading-snug text-[var(--fg)] md:text-2xl">{children}</p>;
}

export function H2({ children }: { children: ReactNode }) {
  const id = slugify(textContent(children));
  return (
    <h2 id={id} className="mt-16 mb-4 scroll-mt-24 font-serif text-3xl tracking-tight md:text-4xl">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  const id = slugify(textContent(children));
  return (
    <h3 id={id} className="mt-10 mb-3 scroll-mt-24 font-serif text-2xl tracking-tight">
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="my-5 text-base leading-relaxed text-[var(--fg-muted)] md:text-[17px] md:leading-[1.75]">
      {children}
    </p>
  );
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-[var(--fg)]">{children}</strong>;
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code
      className="rounded-md border px-1.5 py-0.5 font-mono text-[0.85em] text-[var(--color-accent)]"
      style={{
        background: "var(--elevated)",
        borderColor: "var(--border-strong)",
      }}
    >
      {children}
    </code>
  );
}

interface CodeBlockProps {
  children: string;
  lang?: string;
}
export function CodeBlock({ children, lang }: CodeBlockProps) {
  return (
    <div className="group relative my-8">
      <CopyButton text={children} />
      <pre
        className="overflow-x-auto rounded-2xl border p-5 text-[13px] leading-relaxed"
        style={{
          background: "var(--elevated)",
          borderColor: "var(--border-strong)",
        }}
      >
        {lang && (
          <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-dim)]">
            {lang}
          </div>
        )}
        <code className="font-mono text-[var(--fg)]">{children}</code>
      </pre>
    </div>
  );
}

export function Quote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure className="my-10 border-l-2 pl-6" style={{ borderColor: "var(--color-accent)" }}>
      <blockquote className="font-serif text-xl italic leading-snug text-[var(--fg)] md:text-2xl">
        « {children} »
      </blockquote>
      {cite && (
        <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
          — {cite}
        </figcaption>
      )}
    </figure>
  );
}

export function UList({ children }: { children: ReactNode }) {
  return (
    <ul className="my-6 space-y-2 pl-5 text-[var(--fg-muted)] md:text-[17px] md:leading-[1.75]">
      {children}
    </ul>
  );
}

export function OList({ children }: { children: ReactNode }) {
  return (
    <ol className="my-6 list-decimal space-y-2 pl-6 text-[var(--fg-muted)] md:text-[17px] md:leading-[1.75]">
      {children}
    </ol>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="relative pl-3 marker:text-[var(--color-accent)] before:absolute before:left-0 before:top-[0.85em] before:h-[1px] before:w-2 before:bg-[var(--color-accent)]">
      {children}
    </li>
  );
}

export function Divider() {
  return (
    <hr
      className="my-12 border-0"
      style={{
        height: "1px",
        background: "linear-gradient(to right, transparent, var(--border-strong), transparent)",
      }}
    />
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <aside
      className="my-8 rounded-2xl border-l-2 p-5 text-sm md:text-[15px]"
      style={{
        background: "var(--elevated)",
        borderColor: "var(--color-accent)",
      }}
    >
      <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
        Note
      </div>
      <div className="text-[var(--fg-muted)]">{children}</div>
    </aside>
  );
}
