import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import EffectsProvider from "@/components/EffectsProvider";
import PageTransition from "@/components/PageTransition";
import A11yAnnouncer from "@/components/A11yAnnouncer";
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Vincent Hirtz — Lead Developer",
    description: "Lead Developer basé à Lyon. Créateur de Pulse JS Framework.",
    creator: "@vincenthirtz",
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
      className={`${dmSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      // Toggle dark/light géré côté client
      suppressHydrationWarning
    >
      <head>
        {/* Flux RSS */}
        <link rel="alternate" type="application/rss+xml" title="Vincent Hirtz — Notes" href="/feed.xml" />
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
        <style>{`
          :root {
            --font-sans: var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif;
            --font-serif: var(--font-instrument-serif), ui-serif, Georgia, serif;
            --font-mono: var(--font-jetbrains-mono), ui-monospace, Menlo, monospace;
          }
        `}</style>
        {/* Skip-to-content pour les utilisateurs au clavier / lecteur d'écran */}
        <a href="#main" className="skip-link">
          Aller au contenu principal
        </a>
        {/* Provider global des effets visuels (mode lecture / reduced effects) */}
        <A11yAnnouncer>
          <EffectsProvider>
            <PageTransition>{children}</PageTransition>
          </EffectsProvider>
        </A11yAnnouncer>
      </body>
    </html>
  );
}
