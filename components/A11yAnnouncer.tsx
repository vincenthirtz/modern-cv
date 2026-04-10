"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";

type AnnounceFunction = (message: string) => void;

const AnnounceContext = createContext<AnnounceFunction>(() => {});

/**
 * Hook pour annoncer un message aux lecteurs d'écran via aria-live.
 */
export function useAnnounce(): AnnounceFunction {
  return useContext(AnnounceContext);
}

/**
 * Provider + live region invisible. À placer une seule fois dans l'arbre
 * (par ex. dans EffectsProvider ou le layout).
 *
 * Utilise la technique du double-buffer : vide puis remplit le texte
 * après un tick pour garantir que le lecteur d'écran détecte le changement.
 */
export default function A11yAnnouncer({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const announce: AnnounceFunction = useCallback((msg: string) => {
    // Vider d'abord pour forcer la détection de changement
    setMessage("");
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMessage(msg), 50);
  }, []);

  return (
    <AnnounceContext.Provider value={announce}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          margin: -1,
          padding: 0,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {message}
      </div>
    </AnnounceContext.Provider>
  );
}
