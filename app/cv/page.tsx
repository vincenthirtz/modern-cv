import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import "./cv.css";

export const metadata: Metadata = {
  title: "CV — Vincent Hirtz, Lead Full-Stack Developer",
  description:
    "CV en ligne de Vincent Hirtz, Lead Full-Stack Developer basé à Lyon. 10+ ans d'expérience, du front (React, Vue, Angular) au back (Node.js, NestJS, Laravel).",
  alternates: { canonical: "https://vincenthirtz.fr/cv" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "profile",
    url: "https://vincenthirtz.fr/cv",
    title: "CV — Vincent Hirtz, Lead Full-Stack Developer",
    description:
      "CV en ligne de Vincent Hirtz, Lead Full-Stack Developer basé à Lyon. 10+ ans d'expérience, du front (React, Vue, Angular) au back (Node.js, NestJS, Laravel).",
    siteName: "Vincent Hirtz",
    locale: "fr_FR",
    firstName: "Vincent",
    lastName: "Hirtz",
    images: [
      {
        url: "/cv/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CV de Vincent Hirtz — Lead Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CV — Vincent Hirtz, Lead Full-Stack Developer",
    description:
      "CV en ligne de Vincent Hirtz, Lead Full-Stack Developer basé à Lyon. 10+ ans d'expérience, du front (React, Vue, Angular) au back (Node.js, NestJS, Laravel).",
    creator: "@vincenthirtz",
    images: ["/cv/opengraph-image"],
  },
};

/**
 * Page CV en ligne, autonome (pas d'effets visuels lourds, layout print-friendly).
 *
 * Le `EffectsProvider` du root layout est toujours actif mais aucun effet
 * visuel n'est rendu sur cette page (pas de CursorFollower, GrainOverlay, etc.).
 *
 * Imprime joliment en A4 grâce aux règles `@media print` dans cv.css.
 */
const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://vincenthirtz.fr/cv#profilepage",
  name: "CV — Vincent Hirtz, Lead Full-Stack Developer",
  description:
    "CV en ligne de Vincent Hirtz, Lead Full-Stack Developer basé à Lyon. 10+ ans d'expérience, du front (React, Vue, Angular) au back (Node.js, NestJS, Laravel).",
  url: "https://vincenthirtz.fr/cv",
  mainEntity: {
    "@id": "https://vincenthirtz.fr/#person",
  },
  isPartOf: {
    "@id": "https://vincenthirtz.fr/#website",
  },
  inLanguage: "fr",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Accueil",
      item: "https://vincenthirtz.fr",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "CV",
      item: "https://vincenthirtz.fr/cv",
    },
  ],
};

export default function CVPage() {
  return (
    <main id="main" className="cv-page relative z-[2] min-h-screen px-6 pt-32 pb-12">
      <JsonLd data={profilePageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {/* Fil d'Ariane + actions — masqués à l'impression */}
      <div className="cv-actions mx-auto mb-10 flex max-w-3xl items-center justify-between">
        <nav
          aria-label="Fil d'ariane"
          className="flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--fg-muted)]"
        >
          <Link href="/" className="transition-colors hover:text-[var(--color-accent)]">
            Accueil
          </Link>
          <span className="text-[var(--fg-dim)]">/</span>
          <span className="text-[var(--color-accent)]">CV</span>
        </nav>
        <div className="flex gap-2">
          <a
            href="/cv.pdf"
            download="Vincent-Hirtz-CV.pdf"
            className="rounded-full border px-4 py-2 font-mono text-[0.625rem] uppercase tracking-widest transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            style={{ borderColor: "var(--border-strong)" }}
          >
            Télécharger PDF
          </a>
          {/* Ouvre le PDF mis en page dans la visionneuse du navigateur pour
              l'imprimer : window.print() imprimerait la version web une colonne. */}
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border bg-[var(--color-accent)] px-4 py-2 font-mono text-[0.625rem] uppercase tracking-widest text-[var(--color-ink)] transition-transform hover:scale-105"
            style={{ borderColor: "var(--color-accent)" }}
          >
            Imprimer
            <span className="sr-only"> le CV (PDF, nouvel onglet)</span>
          </a>
        </div>
      </div>

      {/* CV en lui-même */}
      <article className="cv-doc mx-auto max-w-3xl">
        {/* Header */}
        <header className="cv-header">
          <div>
            <h1 className="cv-name">Vincent Hirtz</h1>
            <p className="cv-role">Lead Full-Stack Developer</p>
          </div>
          <ul className="cv-contact">
            <li>
              <span className="cv-icon">📍</span>
              Lyon (69), France
            </li>
            <li>
              <span className="cv-icon">📱</span>
              <a href="tel:+33769167612">07 69 16 76 12</a>
            </li>
            <li>
              <span className="cv-icon">✉</span>
              <a href="mailto:hirtzvincent@gmail.com">hirtzvincent@gmail.com</a>
            </li>
            <li>
              <span className="cv-icon">🌐</span>
              <a href="https://owwomenscup.fr" target="_blank" rel="noopener noreferrer">
                owwomenscup.fr
              </a>
            </li>
            <li>
              <span className="cv-icon">💼</span>
              <a
                href="https://linkedin.com/in/hirtzvincent"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/hirtzvincent
              </a>
            </li>
            <li>
              <span className="cv-icon">🔗</span>
              <a href="https://github.com/vincenthirtz" target="_blank" rel="noopener noreferrer">
                github.com/vincenthirtz
              </a>
            </li>
          </ul>
        </header>

        {/* Profil */}
        <section className="cv-section">
          <h2 className="cv-section-title">Profil professionnel</h2>
          <p>
            Développeur full-stack passionné avec plus de 10 ans d'expérience dans la création de
            solutions web modernes, robustes et performantes. Spécialisé aussi bien en front-end
            (React, Vue.js, Angular) qu'en back-end (Node.js, NestJS, Laravel), j'apporte une solide
            expertise en architecture scalable, en mise en place de tests E2E et en intégration
            continue. Leadership technique affirmé : encadrement d'équipes, mentorat de développeurs
            et pilotage des choix d'architecture.
          </p>
        </section>

        {/* Compétences */}
        <section className="cv-section">
          <h2 className="cv-section-title">Compétences</h2>
          <div className="cv-grid">
            <div>
              <h3 className="cv-skill-cat">Front-end</h3>
              <ul className="cv-skill-list">
                <li>React, Next.js, React Native</li>
                <li>Vue.js, Angular</li>
                <li>TypeScript</li>
                <li>SASS, Tailwind, Material UI</li>
                <li>Storybook</li>
              </ul>
            </div>
            <div>
              <h3 className="cv-skill-cat">Back-end</h3>
              <ul className="cv-skill-list">
                <li>Node.js, NestJS</li>
                <li>Laravel (PHP)</li>
                <li>API REST, GraphQL</li>
                <li>PostgreSQL, Supabase</li>
                <li>Java</li>
              </ul>
            </div>
            <div>
              <h3 className="cv-skill-cat">DevOps &amp; Quality</h3>
              <ul className="cv-skill-list">
                <li>Cypress, Jest, Selenium</li>
                <li>Docker</li>
                <li>GitLab CI/CD</li>
                <li>Lerna (monorepo)</li>
              </ul>
            </div>
            <div>
              <h3 className="cv-skill-cat">Pratiques &amp; encadrement</h3>
              <ul className="cv-skill-list">
                <li>Agile / Scrum</li>
                <li>Architecture scalable</li>
                <li>Mentorat</li>
                <li>Revue de code</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Expérience */}
        <section className="cv-section">
          <h2 className="cv-section-title">Expérience professionnelle</h2>

          <div className="cv-job">
            <div className="cv-job-head">
              <div>
                <h3 className="cv-job-title">Lead Full-Stack Developer</h3>
                <p className="cv-job-company">Docaposte Agility • Sotteville-lès-Rouen</p>
              </div>
              <span className="cv-job-period">Juil. 2021 — Oct. 2025</span>
            </div>
            <ul className="cv-job-list">
              <li>
                Technical Lead : pilotage de l'architecture globale et des choix technologiques du
                produit principal
              </li>
              <li>
                Conception et développement web/mobile multi-frameworks (React, React Native,
                Angular, NestJS, Java)
              </li>
              <li>
                Mise en place des environnements Docker, des pipelines GitLab CI/CD et
                automatisation des tests (Jest, Selenium)
              </li>
              <li>
                Gestion de la base de code en monorepo (Lerna) et conception de bibliothèques de
                composants réutilisables
              </li>
            </ul>
          </div>

          <div className="cv-job">
            <div className="cv-job-head">
              <div>
                <h3 className="cv-job-title">Full-Stack Developer</h3>
                <p className="cv-job-company">SAPIENDO • Lyon</p>
              </div>
              <span className="cv-job-period">Sept. 2020 — Juin 2021</span>
            </div>
            <ul className="cv-job-list">
              <li>
                Développement full-stack (Vue.js &amp; Laravel / PHP) d'applications de gestion de
                retraite et création d'une plateforme de services clients
              </li>
              <li>Conception d'API REST performantes et intégration de SPA réactives</li>
              <li>
                Mise en place intégrale des tests end-to-end avec Cypress et formation des équipes
                sur Laravel
              </li>
            </ul>
          </div>

          <div className="cv-job">
            <div className="cv-job-head">
              <div>
                <h3 className="cv-job-title">Front-End Developer</h3>
                <p className="cv-job-company">Horoquartz • Lyon</p>
              </div>
              <span className="cv-job-period">Mars 2016 — Sept. 2020</span>
            </div>
            <ul className="cv-job-list">
              <li>
                Développement de la solution web phare de l'éditeur, dédiée à la gestion des temps
                et à la planification d'entreprise, en React
              </li>
              <li>Conception d'un design system interne sous Storybook avec SASS et HTML5/CSS3</li>
            </ul>
          </div>
        </section>

        {/* Formation */}
        <section className="cv-section">
          <h2 className="cv-section-title">Formation</h2>
          <div className="cv-job">
            <div className="cv-job-head">
              <div>
                <h3 className="cv-job-title">BTS SIO option SLAM</h3>
                <p className="cv-job-company">Lycée Gustave Flaubert</p>
              </div>
              <span className="cv-job-period">2012 — 2014</span>
            </div>
            <p className="cv-job-detail">Solutions Logicielles et Applications Métiers</p>
          </div>
          <div className="cv-job">
            <div className="cv-job-head">
              <div>
                <h3 className="cv-job-title">Baccalauréat STG option GSI</h3>
                <p className="cv-job-company">Campus La Châtaigneraie</p>
              </div>
              <span className="cv-job-period">2010 — 2011</span>
            </div>
            <p className="cv-job-detail">Gestion des Systèmes d'Information</p>
          </div>
        </section>

        {/* Engagement associatif */}
        <section className="cv-section">
          <h2 className="cv-section-title">Engagement associatif</h2>
          <div className="cv-job">
            <div className="cv-job-head">
              <div>
                <h3 className="cv-job-title">Trésorier</h3>
                <p className="cv-job-company">OW Women&apos;s Cup • Association esport</p>
              </div>
              <span className="cv-job-period">Depuis janv. 2026</span>
            </div>
            <ul className="cv-job-list">
              <li>
                Gestion budgétaire et financière de l&apos;association, suivi et renouvellement des
                partenariats
              </li>
              <li>
                Co-organisation d&apos;un tournoi Overwatch 100 % féminin et francophone, de la
                production à la diffusion
              </li>
            </ul>
          </div>
        </section>

        {/* Projets & open source */}
        <section className="cv-section">
          <h2 className="cv-section-title">Projets &amp; open source</h2>
          <div className="cv-job">
            <div className="cv-job-head">
              <div>
                <h3 className="cv-job-title">Plateforme du tournoi OW Women&apos;s Cup</h3>
                <p className="cv-job-company">
                  <a href="https://owwomenscup.fr" target="_blank" rel="noopener noreferrer">
                    owwomenscup.fr
                  </a>
                </p>
              </div>
              <span className="cv-job-period">En cours</span>
            </div>
            <p className="cv-job-detail">
              Conception et développement de la plateforme du tournoi en Next.js et Supabase :
              inscriptions des équipes, classements et calendrier des matchs en temps réel,
              intégration Twitch, espace partenaires et site bilingue FR/EN.
            </p>
          </div>
          <div className="cv-job">
            <div className="cv-job-head">
              <div>
                <h3 className="cv-job-title">Contributions open source</h3>
                <p className="cv-job-company">
                  <a
                    href="https://github.com/vincenthirtz"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/vincenthirtz
                  </a>
                </p>
              </div>
            </div>
            <p className="cv-job-detail">
              Veille technologique continue et publication de projets et composants réutilisables
              (React, TypeScript, Node.js).
            </p>
          </div>
        </section>

        {/* Langues & intérêts */}
        <section className="cv-section cv-section--two">
          <div>
            <h2 className="cv-section-title">Langues</h2>
            <ul className="cv-skill-list">
              <li>Français — Langue maternelle</li>
              <li>Anglais — Professionnel</li>
            </ul>
          </div>
          <div>
            <h2 className="cv-section-title">Centres d'intérêt</h2>
            <ul className="cv-skill-list">
              <li>Veille technologique</li>
              <li>Open source</li>
              <li>Esport, gaming</li>
            </ul>
          </div>
        </section>
      </article>
    </main>
  );
}
