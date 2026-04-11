"use client";

import { useEffect } from "react";

/**
 * Protège contre le bug React 19 / Next.js 15 "Cannot read properties of null
 * (reading 'removeChild')".
 *
 * Cause : des extensions navigateur (Grammarly, ColorZilla, LastPass…) ou des
 * scripts tiers injectent / déplacent des noeuds dans le DOM. Quand React
 * essaie ensuite de reconcilier et supprimer ces noeuds, il crashe car le
 * noeud n'est plus enfant du parent attendu.
 *
 * Fix : on patche removeChild et insertBefore pour ignorer silencieusement
 * les opérations sur des noeuds déjà détachés au lieu de lancer une erreur.
 *
 * Refs :
 * - https://github.com/vercel/next.js/discussions/52625
 * - https://github.com/vercel/next.js/issues/58055
 * - https://github.com/vercel/next.js/discussions/25049
 */
export default function DOMSafetyNet() {
  useEffect(() => {
    const originalRemoveChild = Node.prototype.removeChild;
    const originalInsertBefore = Node.prototype.insertBefore;

    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (child.parentNode !== this) {
        return child;
      }
      return originalRemoveChild.call(this, child) as T;
    };

    Node.prototype.insertBefore = function <T extends Node>(
      newNode: T,
      referenceNode: Node | null,
    ): T {
      if (referenceNode && referenceNode.parentNode !== this) {
        return originalInsertBefore.call(this, newNode, null) as T;
      }
      return originalInsertBefore.call(this, newNode, referenceNode) as T;
    };

    return () => {
      Node.prototype.removeChild = originalRemoveChild;
      Node.prototype.insertBefore = originalInsertBefore;
    };
  }, []);

  return null;
}
