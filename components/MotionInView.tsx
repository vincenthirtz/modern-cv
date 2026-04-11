"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type HTMLTag = "div" | "p" | "section" | "article" | "span";

interface MotionInViewProps {
  children: ReactNode;
  /** Tag HTML rendu — par défaut "div" */
  as?: HTMLTag;
  className?: string;
  style?: CSSProperties;
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
}

const directionMap = {
  up: "translateY(30px)",
  down: "translateY(-30px)",
  left: "translateX(40px)",
  right: "translateX(-40px)",
  none: "none",
} as const;

/**
 * Wrapper client pour animer un élément à l'entrée dans le viewport.
 * Permet aux composants parents de rester en Server Component.
 */
export default function MotionInView({
  children,
  as: Tag = "div",
  className,
  style,
  delay = 0,
  duration = 0.6,
  direction = "up",
  once = true,
  amount = 0.3,
}: MotionInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={{
        ...style,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : directionMap[direction],
        transition: `opacity ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s, transform ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s`,
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * Item enfant pour les animations stagger.
 * Chaque item observe sa propre visibilité.
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity ${duration}s ease, transform ${duration}s ease`,
      }}
    >
      {children}
    </div>
  );
}
