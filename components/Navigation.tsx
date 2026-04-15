"use client";

import { useEffect, useState } from "react";
import Dock from "./navigation/Dock";
import TopBar from "./navigation/TopBar";
import { useDockVisible } from "@/hooks/useDockVisible";

/**
 * Navigation globale : top bar (logo + toggles) + dock macOS (liens).
 * Orchestre l'animation d'entrée et la persistance de la visibilité du dock.
 */
export default function Navigation() {
  const [entered, setEntered] = useState(false);
  const [dockVisible, toggleDock] = useDockVisible(true);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <TopBar entered={entered} dockVisible={dockVisible} onToggleDock={toggleDock} />
      <Dock entered={entered} visible={dockVisible} />
    </>
  );
}
