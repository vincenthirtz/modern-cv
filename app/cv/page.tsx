import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "./PrintButton";
import "./cv.css";

export const metadata: Metadata = {
  title: "CV — Vincent Hirtz, Lead Developer Front-End",
  description:
    "CV en ligne de Vincent Hirtz, Lead Developer Front-End basé à Lyon. 10+ ans d'expérience React, Vue et Angular.",
  alternates: { canonical: "https://vincenthirtz.fr/cv" },
  robots: { index: true, follow: true },
};

/**
 * Page CV en ligne, autonome (pas d'effets visuels lourds, layout print-friendly).
 *
 * Le `EffectsProvider` du root layout est toujours actif mais aucun effet
 * visuel n'est rendu sur cette page (pas de CursorFollower, GrainOverlay, etc.).
 *
 * Imprime joliment en A4 grâce aux règles `@media print` dans cv.css.
 */
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
    <main id="main" className="cv-page relative z-[2] min-h-screen px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Fil d'Ariane + actions — masqués à l'impression */}
      <div className="cv-actions mx-auto mb-10 flex max-w-3xl items-center justify-between">
        <nav
          aria-label="Fil d'ariane"
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]"
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
            className="rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            style={{ borderColor: "var(--border-strong)" }}
          >
            Télécharger PDF
          </a>
          <PrintButton />
        </div>
      </div>

      {/* CV en lui-même */}
      <article className="cv-doc mx-auto max-w-3xl">
        {/* Header */}
        <header className="cv-header">
          <div>
            <h1 className="cv-name">Vincent Hirtz</h1>
            <p className="cv-role">Lead Developer Front-End</p>
          </div>
          <ul className="cv-contact">
            <li>
              <span className="cv-icon">📱</span>
              <a href="tel:+33769167612">07 69 16 76 12</a>
            </li>
            <li>
              <span className="cv-icon">✉</span>
              <a href="mailto:hirtzvincent@free.fr">hirtzvincent@free.fr</a>
            </li>
            <li>
              <span className="cv-icon">🌐</span>
              <a href="https://pulse-js.fr" target="_blank" rel="noopener noreferrer">
                pulse-js.fr
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
            Développeur front-end passionné avec plus de 10 ans d'expérience dans la création de
            solutions web modernes et performantes. Expert en ReactJS, VueJS et Angular, avec une
            forte capacité à diriger des équipes techniques et à former les développeurs juniors.
            Spécialisé dans le développement d'applications SPA complexes, la mise en place de tests
            end-to-end et l'architecture front-end scalable.
          </p>
        </section>

        {/* Compétences */}
        <section className="cv-section">
          <h2 className="cv-section-title">Compétences techniques</h2>
          <div className="cv-grid">
            <div>
              <h3 className="cv-skill-cat">Frameworks &amp; Bibliothèques</h3>
              <ul className="cv-skill-list">
                <li>React, React Native</li>
                <li>VueJS, Angular</li>
                <li>NestJS, NodeJS</li>
                <li>Storybook</li>
              </ul>
            </div>
            <div>
              <h3 className="cv-skill-cat">Outils &amp; Technologies</h3>
              <ul className="cv-skill-list">
                <li>Docker, GitLab</li>
                <li>Cypress (tests E2E)</li>
                <li>Jest, Enzyme, Selenium</li>
                <li>SASS, Bootstrap, Material UI</li>
                <li>Lerna (monorepo)</li>
              </ul>
            </div>
            <div>
              <h3 className="cv-skill-cat">Langages</h3>
              <ul className="cv-skill-list">
                <li>JavaScript / TypeScript</li>
                <li>HTML5 / CSS3</li>
                <li>PHP, Java</li>
              </ul>
            </div>
            <div>
              <h3 className="cv-skill-cat">Méthodologies</h3>
              <ul className="cv-skill-list">
                <li>Agile / Scrum</li>
                <li>CI/CD</li>
                <li>Architecture SPA</li>
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
                <h3 className="cv-job-title">Lead Developer Front-End</h3>
                <p className="cv-job-company">SAPIENDO • Lyon</p>
              </div>
              <span className="cv-job-period">Juil. 2021 — Oct. 2025</span>
            </div>
            <ul className="cv-job-list">
              <li>
                Développement de solutions web avec VueJS et Laravel pour des applications de
                gestion de la retraite
              </li>
              <li>Création d'une plateforme SPA de services pour les clients du cabinet</li>
              <li>Mise en place et maintenance de tests end-to-end avec Cypress</li>
              <li>Formation technique des équipes sur Laravel et les bonnes pratiques front-end</li>
              <li>
                Lead technique sur l'architecture et les choix technologiques du produit principal
              </li>
            </ul>
          </div>

          <div className="cv-job">
            <div className="cv-job-head">
              <div>
                <h3 className="cv-job-title">Développeur Front-End</h3>
                <p className="cv-job-company">Horoquartz • Lyon</p>
              </div>
              <span className="cv-job-period">Sept. 2020 — Juin 2021</span>
            </div>
            <ul className="cv-job-list">
              <li>
                Développement de solutions web avec ReactJS pour la gestion des temps et
                planification
              </li>
              <li>Maintenance et évolution du produit principal de l'éditeur</li>
              <li>Création de composants réutilisables avec Storybook</li>
              <li>Intégration de l'UI interne avec SASS et HTML5/CSS3</li>
            </ul>
          </div>

          <div className="cv-job">
            <div className="cv-job-head">
              <div>
                <h3 className="cv-job-title">Développeur Full-Stack</h3>
                <p className="cv-job-company">Docapost Agility • Sotteville-lès-Rouen</p>
              </div>
              <span className="cv-job-period">Mars 2016 — Sept. 2020</span>
            </div>
            <ul className="cv-job-list">
              <li>
                Développement d'applications web et mobile avec React, React Native et Angular
              </li>
              <li>Architecture et développement back-end avec NestJS, NodeJS, PHP et Java</li>
              <li>Mise en place d'environnements Docker et pipelines CI/CD</li>
              <li>Implémentation de tests unitaires et d'intégration (Jest, Enzyme, Selenium)</li>
              <li>Gestion de monorepo avec Lerna et création de bibliothèques de composants</li>
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
                <p className="cv-job-company">Campus La Chataigneraie</p>
              </div>
              <span className="cv-job-period">2012 — 2014</span>
            </div>
            <p className="cv-job-detail">Solutions Logicielles et Applications Métiers</p>
          </div>
          <div className="cv-job">
            <div className="cv-job-head">
              <div>
                <h3 className="cv-job-title">Baccalauréat STG option GSI</h3>
                <p className="cv-job-company">Lycée Gustave Flaubert</p>
              </div>
              <span className="cv-job-period">2010 — 2011</span>
            </div>
            <p className="cv-job-detail">Gestion des Systèmes d'Information</p>
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
              <li>Veille technologique web</li>
              <li>Contribution open source</li>
            </ul>
          </div>
        </section>
      </article>
    </main>
  );
}
