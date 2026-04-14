# Vincent Hirtz — Portfolio

Site personnel / portfolio de **Vincent Hirtz**, Lead Developer Front-End basé
à Lyon. Construit avec **Next.js 15**, **React 19** et **Tailwind CSS v4**.

## ✨ Features

- **Next.js 15** App Router + TypeScript strict
- **React 19** stable
- **Tailwind CSS v4** (configuration via `@theme` dans le CSS)
- **Animations CSS natives** (transitions, keyframes, IntersectionObserver)
- **Dark mode** par défaut + toggle dark/light persisté
- **Responsive** mobile-first
- **Cursor follower** lumineux qui suit le curseur
- **Magnetic buttons** au hover
- **Scroll progress bar** fine en haut de page
- **Texte animé** mot par mot avec stagger et flou
- **Compteurs animés** au scroll
- **Marquee infini** pour les technos
- **Grain SVG** en overlay pour donner de la texture
- **Easter egg** : Konami Code (↑↑↓↓←→←→ B A)
- **Accessibilité** : `prefers-reduced-motion`, focus visible, aria-labels
- **SEO** : meta tags + Open Graph + favicon SVG

## 🚀 Lancement

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## 📁 Sections

1. **Hero** — Lead Developer Front-End, Lyon
2. **À propos** — Bio + valeurs (Clean Code, Architecture First, Team Player, Continuous Learner)
3. **Expertise** — React/Vue/Angular, NestJS/Laravel, Cypress, Storybook, Docker, Lead
4. **Projets** — Pulse JS Framework, SAPIENDO, Horoquartz, Docapost, Rally
5. **Expérience** — SAPIENDO (2021-2025), Horoquartz (2020-2021), Docapost Agility (2016-2020) + Formation
6. **Notes** — Articles autour de Pulse JS, Vue/Laravel, Cypress
7. **Contact** — Formulaire + email `hirtzvincent@free.fr` + tél + GitHub + LinkedIn + Pulse JS

## 🎨 Design system

| Token            | Valeur           | Usage                         |
| ---------------- | ---------------- | ----------------------------- |
| `--color-ink`    | `#0a0a0b`        | Fond principal (dark)         |
| `--color-bone`   | `#f0efe9`        | Texte principal               |
| `--color-accent` | `#c8ff00`        | Accent vert citron électrique |
| `--font-serif`   | Instrument Serif | Titres                        |
| `--font-sans`    | DM Sans          | Corps de texte                |
| `--font-mono`    | JetBrains Mono   | Éléments techniques           |

## 🪄 Easter egg

Tapez le [Konami Code](https://en.wikipedia.org/wiki/Konami_Code) sur le clavier
n'importe où sur la page : `↑ ↑ ↓ ↓ ← → ← → B A`. La couleur d'accent passe en
magenta pendant 6 secondes.

## ☁️ Déploiement Vercel

```bash
npx vercel
```

Aucune variable d'environnement n'est requise. Le formulaire de contact est en
mode démo — pour le brancher en vrai, ajouter une route API qui appelle
[Resend](https://resend.com), [Formspree](https://formspree.io) ou similaire.

## 📝 Sources des données

- **CV PDF** fourni par Vincent → expériences, compétences, formation, contact
- **GitHub** [@vincenthirtz](https://github.com/vincenthirtz) → projets open source (Pulse JS, Rally)
- **Blog / framework** : [pulse-js.fr](https://pulse-js.fr)

Les articles de la section "Notes" sont des sujets plausibles basés sur les vrais
centres d'intérêt de Vincent (à remplacer par ses propres articles quand publiés).

---

Fait avec ♥ et beaucoup de café.
