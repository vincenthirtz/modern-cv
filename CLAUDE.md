# CLAUDE.md — zapp (vincenthirtz.fr)

## Projet

Portfolio personnel de Vincent Hirtz — Lead Developer Front-End basé à Lyon.
Site en français, déployé sur Vercel : https://vincenthirtz.fr

## Stack technique

- **Framework** : Next.js 15 (App Router) + React 19
- **Langage** : TypeScript (strict mode)
- **Styles** : Tailwind CSS v4 (`@import "tailwindcss"` + `@theme`)
- **Contenu** : MDX via `@next/mdx` (articles dans `lib/articles/`)
- **Animations** : CSS transitions, keyframes & IntersectionObserver
- **Scroll** : Lenis (smooth scroll)
- **Polices** : DM Sans, Instrument Serif, JetBrains Mono (via `next/font/google`)

## Commandes

```bash
npm run dev          # Serveur de dev
npm run build        # Build production
npm run lint         # ESLint
npm run lint:fix     # ESLint avec auto-fix
npm run format       # Prettier (écriture)
npm run format:check # Prettier (vérification)
npm run typecheck    # tsc --noEmit
npm run analyze      # Build avec bundle analyzer (ANALYZE=true)
```

## Vérification avant commit

Toujours lancer ces commandes avant de considérer un changement comme terminé :

```bash
npm run typecheck && npm run lint && npm run format:check
```

## Architecture

```
app/
  layout.tsx          # Layout racine (polices, metadata, providers)
  page.tsx            # Page d'accueil
  globals.css         # Tokens Tailwind (@theme) + styles globaux
  notes/              # Blog (MDX)
    [slug]/page.tsx   # Article dynamique
  cv/                 # Page CV
components/           # Composants React (un fichier = un composant)
lib/articles/         # Articles MDX + index.ts
types/                # Définitions TypeScript (mdx.d.ts)
```

## Conventions

- **Langue du code** : commentaires et noms de variables en français quand applicable (UI, metadata), anglais pour le code technique
- **Alias d'import** : `@/*` mappe vers la racine du projet
- **Composants** : un composant par fichier, PascalCase, extension `.tsx`
- **Pas de `"use client"` inutile** : rester en Server Component par défaut, n'ajouter `"use client"` que si le composant utilise des hooks ou des event handlers

## Accessibilité (a11y)

Le projet a des exigences fortes en accessibilité :

- Score Lighthouse accessibility minimum : **0.95** (erreur si inférieur)
- Composant `A11yAnnouncer` pour les annonces aux lecteurs d'écran
- Skip-link "Aller au contenu principal"
- Toujours utiliser des éléments HTML sémantiques, des attributs `aria-*` pertinents, et gérer le focus

## Performance

- Score Lighthouse performance minimum : **0.90** (warning)
- Animations en CSS pur (transitions, keyframes, IntersectionObserver) — pas de Framer Motion
- Tree-shaking agressif sur `lenis` (`optimizePackageImports`)
- Images : formats `avif`/`webp`, utiliser `next/image` pour les nouvelles images
- Pas de source maps en production
- Cache long sur les assets statiques

## Sécurité

- Headers OWASP configurés dans `next.config.mjs` (X-Frame-Options, CSP, etc.)
- `poweredByHeader: false`
- Ne jamais exposer de données sensibles côté client

## Thème

- Dark mode par défaut, toggle light/dark côté client
- Système d'accent colors (Lime, Cyan, Rose, Orange, Violet) via CSS custom properties
- Les variables d'accent sont injectées en inline script pour éviter le flash
