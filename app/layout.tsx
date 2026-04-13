import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import EffectsProvider from "@/components/EffectsProvider";
import A11yAnnouncer from "@/components/A11yAnnouncer";

import Navigation from "@/components/Navigation";
import ClientEffects from "@/components/ClientEffects";
import Footer from "@/components/Footer";
import "./globals.css";

// Polices Google — chargées via next/font pour optimisation
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vincent Hirtz — Lead Developer & Architecte Logiciel",
  description:
    "Lead Developer basé à Lyon. Curiosité infinie pour les nouvelles technos, créateur de Pulse JS Framework. Je transforme des idées complexes en produits élégants, scalables et performants.",
  keywords: [
    "Vincent Hirtz",
    "Lead Developer",
    "Lyon",
    "JavaScript",
    "TypeScript",
    "Next.js",
    "Vue",
    "Svelte",
    "Pulse JS",
    "Portfolio",
  ],
  authors: [{ name: "Vincent Hirtz" }],
  creator: "Vincent Hirtz",
  metadataBase: new URL("https://vincenthirtz.fr"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://vincenthirtz.fr",
    title: "Vincent Hirtz — Lead Developer & Architecte Logiciel",
    description:
      "Lead Developer basé à Lyon. Créateur de Pulse JS Framework. Curiosité infinie pour les nouvelles technos.",
    siteName: "Vincent Hirtz",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Vincent Hirtz — Lead Developer & Architecte Logiciel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vincent Hirtz — Lead Developer",
    description: "Lead Developer basé à Lyon. Créateur de Pulse JS Framework.",
    creator: "@vincenthirtz",
    images: ["/twitter-image"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      // Toggle dark/light géré côté client
      suppressHydrationWarning
    >
      <head>
        {/* Dé-enregistrement du Service Worker (supprimé — causait des bugs de navigation).
            Nettoie les SW existants chez les visiteurs qui l'avaient déjà installé. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if("serviceWorker"in navigator){navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(s){s.unregister()})})}`,
          }}
        />
        {/* Patch DOM pour éviter le crash React 19 HostHoistable (case 26).
            Pendant la navigation, React appelle parentNode.removeChild(n)
            sur des <title>/<link>/<meta>/<style> dont le parentNode est null
            (le navigateur les a déjà retirés). Comme parentNode est null,
            null.removeChild() throw un TypeError qui crash le commit phase
            et avorte la transition de page.

            Fix : on override le getter parentNode pour les éléments hoistable
            afin de retourner un objet no-op au lieu de null. On patche aussi
            removeChild/insertBefore pour le cas "wrong parent" (NotFoundError).
            Ref: vercel/next.js#58055, github.com/vercel/next.js/discussions/70048 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var H={TITLE:1,LINK:1,META:1,STYLE:1};var noop={removeChild:function(c){return c},insertBefore:function(n){return n}};var d=Object.getOwnPropertyDescriptor(Node.prototype,"parentNode");if(d&&d.get){var g=d.get;Object.defineProperty(Node.prototype,"parentNode",{get:function(){var p=g.call(this);if(p===null&&this.nodeName&&H[this.nodeName])return noop;return p},configurable:true})}var o=Node.prototype.removeChild;Node.prototype.removeChild=function(c){if(c.parentNode!==this)return c;return o.call(this,c)};var i=Node.prototype.insertBefore;Node.prototype.insertBefore=function(n,r){if(r&&r.parentNode!==this)return n;return i.call(this,n,r)}})();`,
          }}
        />
        {/* Flux RSS & Atom */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Vincent Hirtz — Notes (RSS)"
          href="/feed.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Vincent Hirtz — Notes (Atom)"
          href="/feed.atom"
        />
        {/* Évite le flash en chargeant la préférence avant le rendu React */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('theme');
                const prefersLight = stored === 'light';
                if (prefersLight) document.documentElement.classList.add('light');
                var _a = {Lime:['#c8ff00','#d9ff4d','#1a1a1a','#5a7a00','#4a7a00','#6b9a00'],Cyan:['#00e5ff','#4df0ff','#0a1a1f','#007a8a','#007a8a','#009aaa'],Rose:['#ff3c82','#ff6fa3','#ffffff','#d42265','#d42265','#e8447f'],Orange:['#ff8a00','#ffaa40','#1a1200','#b86200','#b86200','#d07400'],Violet:['#a78bfa','#c4b5fd','#1a1530','#6d47d9','#6d47d9','#8660ec']};
                var _c = _a[localStorage.getItem('accent')] || _a.Lime;
                var s=document.documentElement.style; s.setProperty('--color-accent',_c[0]); s.setProperty('--color-accent-soft',_c[1]); s.setProperty('--color-accent-contrast',_c[2]); s.setProperty('--color-accent-fg',_c[3]); s.setProperty('--color-accent-light',_c[4]); s.setProperty('--color-accent-light-soft',_c[5]);
              } catch (e) {}
            `,
          }}
        />
        {/* JSON-LD WebSite schema pour Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://vincenthirtz.fr",
              name: "Vincent Hirtz — Lead Developer & Architecte Logiciel",
              description:
                "Lead Developer basé à Lyon. Créateur de Pulse JS Framework. Curiosité infinie pour les nouvelles technos.",
              inLanguage: "fr",
              author: {
                "@type": "Person",
                name: "Vincent Hirtz",
                url: "https://vincenthirtz.fr",
              },
            }),
          }}
        />
        {/* JSON-LD Person schema pour Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Vincent Hirtz",
              jobTitle: "Lead Developer Front-End",
              description:
                "Lead Developer Front-End basé à Lyon, 10+ ans d'expérience React, Vue et Angular. Créateur de Pulse JS Framework.",
              url: "https://vincenthirtz.fr",
              image: "https://vincenthirtz.fr/icon.svg",
              email: "mailto:hirtzvincent@free.fr",
              telephone: "+33769167612",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Lyon",
                addressCountry: "FR",
              },
              sameAs: [
                "https://github.com/vincenthirtz",
                "https://linkedin.com/in/hirtzvincent",
                "https://pulse-js.fr",
              ],
              knowsAbout: [
                "React",
                "Vue.js",
                "Angular",
                "TypeScript",
                "NestJS",
                "Laravel",
                "Cypress",
                "Storybook",
              ],
            }),
          }}
        />
      </head>
      <body
        // Certaines extensions navigateur (ColorZilla, Grammarly, etc.)
        // injectent des attributs sur <body> avant l'hydratation React.
        // suppressHydrationWarning évite le warning sans cacher de vrais bugs.
        suppressHydrationWarning
        style={{
          fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
        }}
      >
        {/* Mise à jour des variables de polices pour matcher next/font */}
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--font-sans:var(--font-dm-sans),ui-sans-serif,system-ui,sans-serif;--font-serif:var(--font-instrument-serif),ui-serif,Georgia,serif;--font-mono:var(--font-jetbrains-mono),ui-monospace,Menlo,monospace}`,
          }}
        />
        {/* Skip-to-content pour les utilisateurs au clavier / lecteur d'écran */}
        <a href="#main" className="skip-link">
          Aller au contenu principal
        </a>
        {/* Provider global des effets visuels (mode lecture / reduced effects) */}
        <A11yAnnouncer>
          <EffectsProvider>
            <ClientEffects />
            <Navigation />
            {children}
            <Footer />
          </EffectsProvider>
        </A11yAnnouncer>
      </body>
    </html>
  );
}
