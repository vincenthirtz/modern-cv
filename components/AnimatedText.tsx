"use client";

import { motion, type Variants } from "motion/react";
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

const child: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      opacity: { type: "spring", damping: 14, stiffness: 100 },
      y: { type: "spring", damping: 14, stiffness: 100 },
      filter: { type: "tween", duration: 0.4, ease: "easeOut" },
    },
  },
};

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
  const tokens = splitBy === "word" ? text.split(" ") : Array.from(text);

  // Variants conteneur construit dynamiquement pour permettre un délai paramétré
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren, delayChildren: delay },
    },
  };

  return (
    <Wrapper className={className}>
      <motion.span
        style={{ display: "inline-block" }}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        aria-label={text}
      >
        {tokens.map((token, i) => {
          // Normalisation pour matcher un mot peu importe la ponctuation/casse
          const norm = (s: string) => s.toLowerCase().replace(/[^a-zàâäéèêëîïôöùûüÿ]/gi, "");
          const isHighlight = !!highlight && splitBy === "word" && norm(token) === norm(highlight);
          return (
            <motion.span
              key={`${token}-${i}`}
              variants={child}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                willChange: "transform, opacity, filter",
              }}
              className={isHighlight ? highlightClassName : undefined}
            >
              {token}
              {splitBy === "word" && i < tokens.length - 1 ? "\u00A0" : ""}
            </motion.span>
          );
        })}
      </motion.span>
    </Wrapper>
  );
}
