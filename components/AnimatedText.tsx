"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import type { ElementType } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  el?: ElementType;
  delay?: number;
  staggerChildren?: number;
  splitBy?: "word" | "char";
  highlight?: string;
  highlightClassName?: string;
}

/**
 * Texte animé apparaissant mot par mot ou lettre par lettre,
 * avec stagger et léger flou. Une portion peut être mise en accent.
 */
export default function AnimatedText({
  text,
  className = "",
  el: Wrapper = "h1",
  delay = 0,
  staggerChildren = 0.06,
  splitBy = "word",
  highlight,
  highlightClassName = "text-[var(--color-accent)] italic",
}: AnimatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const tokens = splitBy === "word" ? text.split(" ") : Array.from(text);

  const norm = (s: string) => s.toLowerCase().replace(/[^a-zàâäéèêëîïôöùûüÿ]/gi, "");

  return (
    <Wrapper className={className}>
      <span ref={ref} style={{ display: "inline-block" }} aria-label={text}>
        {tokens.map((token, i) => {
          const isHighlight = !!highlight && splitBy === "word" && norm(token) === norm(highlight);
          const tokenDelay = delay + i * staggerChildren;
          return (
            <span
              key={`${token}-${i}`}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                willChange: "transform, opacity, filter",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                filter: inView ? "blur(0px)" : "blur(12px)",
                transition: `opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${tokenDelay}s, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${tokenDelay}s, filter 0.4s ease ${tokenDelay}s`,
              }}
              className={isHighlight ? highlightClassName : undefined}
            >
              {token}
              {splitBy === "word" && i < tokens.length - 1 ? "\u00A0" : ""}
            </span>
          );
        })}
      </span>
    </Wrapper>
  );
}
