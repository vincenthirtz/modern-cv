import type { ReactNode } from "react";

interface MarqueeProps {
  items: string[];
  speed?: number;
  className?: string;
  separator?: ReactNode;
}

/**
 * Bande défilante horizontale infinie. Le contenu est dupliqué pour
 * que le loop CSS soit transparent.
 */
export default function Marquee({ items, speed = 40, className = "", separator }: MarqueeProps) {
  const sep = separator ?? (
    <span className="mx-8 inline-block h-2 w-2 rounded-full bg-[var(--color-accent)]" />
  );

  return (
    <div
      className={`relative w-full overflow-hidden border-y py-6 ${className}`}
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex w-max animate-marquee" style={{ animationDuration: `${speed}s` }}>
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
            {items.map((item, i) => (
              <div key={`${dup}-${i}`} className="flex items-center">
                <span className="font-serif text-3xl md:text-5xl whitespace-nowrap">{item}</span>
                {sep}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
