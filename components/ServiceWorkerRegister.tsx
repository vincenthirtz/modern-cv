"use client";

import { useEffect } from "react";

/**
 * Enregistre le Service Worker pour le support offline (PWA).
 * Ne fait rien si le navigateur ne supporte pas les SW ou en dev.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silencieux — le SW est un bonus, pas critique
      });
    }
  }, []);

  return null;
}
