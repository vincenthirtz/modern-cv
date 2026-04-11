import { useEffect, useState, type RefObject } from "react";

/**
 * Hook IntersectionObserver pour détecter quand un élément est visible.
 * Remplace useInView de Framer Motion.
 */
export function useInView(
  ref: RefObject<HTMLElement | null>,
  options?: { once?: boolean; amount?: number },
): boolean {
  const [inView, setInView] = useState(false);
  const once = options?.once ?? true;
  const amount = options?.amount ?? 0.3;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: amount },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once, amount]);

  return inView;
}
