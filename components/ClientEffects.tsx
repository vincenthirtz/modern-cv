"use client";

import dynamic from "next/dynamic";

// Effets décoratifs chargés en lazy (ssr: false) pour alléger le First Load JS.
// Aucun n'est nécessaire au first paint ni au SEO.
const BackgroundShift = dynamic(() => import("@/components/BackgroundShift"), { ssr: false });
const CursorFollower = dynamic(() => import("@/components/CursorFollower"), { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"), { ssr: false });
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"), { ssr: false });
const GrainOverlay = dynamic(() => import("@/components/GrainOverlay"), { ssr: false });
const KonamiCode = dynamic(() => import("@/components/KonamiCode"), { ssr: false });
const ConsoleEgg = dynamic(() => import("@/components/ConsoleEgg"), { ssr: false });
const DynamicFavicon = dynamic(() => import("@/components/DynamicFavicon"), { ssr: false });

/**
 * Regroupe tous les effets visuels globaux en un seul composant client.
 * Chaque effet est chargé dynamiquement côté client uniquement,
 * ce qui les exclut du bundle initial SSR.
 */
export default function ClientEffects() {
  return (
    <>
      <BackgroundShift />
      <CursorFollower />
      <ScrollProgress />
      <ScrollToTop />
      <GrainOverlay />
      <KonamiCode />
      <ConsoleEgg />
      <DynamicFavicon />
    </>
  );
}
