"use client";

import { motion, type Variants } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

type HTMLTag = "div" | "p" | "section" | "article" | "span";

interface MotionInViewProps {
  children: ReactNode;
  /** Tag HTML rendu — par défaut "div" */
  as?: HTMLTag;
  className?: string;
  style?: CSSProperties;
  /** Variantes Framer Motion personnalisées */
  variants?: Variants;
  /** Délai avant le début de l'animation */
  delay?: number;
  /** Durée de l'animation — par défaut 0.6s */
  duration?: number;
  /** Direction d'entrée (slide) — par défaut "up" */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Déclencher une seule fois — par défaut true */
  once?: boolean;
  /** Fraction visible avant déclenchement — par défaut 0.3 */
  amount?: number;
  /** Stagger enfants (passer les variantes parent/enfant) */
  stagger?: number;
}

const directionMap = {
  up: { y: 30 },
  down: { y: -30 },
  left: { x: 40 },
  right: { x: -40 },
  none: {},
} as const;

/**
 * Wrapper client pour animer un élément à l'entrée dans le viewport.
 * Permet aux composants parents de rester en Server Component.
 */
export default function MotionInView({
  children,
  as = "div",
  className,
  style,
  variants,
  delay = 0,
  duration = 0.6,
  direction = "up",
  once = true,
  amount = 0.3,
  stagger,
}: MotionInViewProps) {
  const Tag = motion[as] as typeof motion.div;

  // Mode stagger : utilise des variantes parent/enfant
  if (stagger || variants) {
    return (
      <Tag
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount }}
        variants={
          variants ?? {
            hidden: {},
            visible: { transition: { staggerChildren: stagger ?? 0.1 } },
          }
        }
        className={className}
        style={style}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
}

/**
 * Item enfant pour les animations stagger.
 * À utiliser comme enfant direct de <MotionInView stagger={...}>.
 */
export function MotionInViewItem({
  children,
  className,
  style,
  duration = 0.6,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  duration?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration } },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
