"use client";

import { useEffect, useId } from "react";

/**
 * Injecte un script JSON-LD dans <head> via DOM direct (hors arbre React).
 * Évite le bug React 19 HostHoistable removeChild null lors de la navigation.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  const id = useId();

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = `jsonld-${id}`;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [data, id]);

  return null;
}
