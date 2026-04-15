/**
 * Statistiques d'articles générées automatiquement par
 * scripts/generate-articles-index.mjs. Ne pas modifier manuellement.
 */

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface ArticleStats {
  wordCount: number;
  /** Calculé automatiquement depuis le contenu (230 mots/min). Surcharge meta.readTime. */
  readTime: string;
  bodyPreview: string;
  /** Sommaire extrait des headings ## et ### du MDX. */
  headings: TocHeading[];
}

export const ARTICLE_STATS: Record<string, ArticleStats> = {
  "cypress-en-production-le-guide": {
    wordCount: 890,
    readTime: "~4 min",
    bodyPreview:
      "Les tests E2E ont une réputation de cauchemar à maintenir. Lents, flaky, cassés à la moindre refonte UI. Voici tout ce que j'ai appris en faisant tourner des suites Cypress en production sur plusieurs projets — et ce que je voudrais qu'on m'ait dit le premier jour. Pourquoi tant de monde déteste les E2E Quand un junior écrit son premier test E2E, il est conquis : il voit son application cliquée par une machine, c'est magique. Six mois plus tard, il les déteste. Parce qu'à 50 tests, ils prennent…",
    headings: [
      {
        id: "pourquoi-tant-de-monde-deteste-les-e2e",
        text: "Pourquoi tant de monde déteste les E2E",
        level: 2,
      },
      {
        id: "les-5-regles-que-je-mimpose-sur-tout-projet",
        text: "Les 5 règles que je m'impose sur tout projet",
        level: 2,
      },
      {
        id: "1-selecteurs-explicites-uniquement",
        text: "1. Sélecteurs explicites uniquement",
        level: 3,
      },
      {
        id: "2-cyintercept-pour-tout-ce-qui-sort",
        text: "2. cy.intercept pour tout ce qui sort",
        level: 3,
      },
      {
        id: "3-custom-commands-pour-tout-ce-qui-se-repete",
        text: "3. Custom commands pour tout ce qui se répète",
        level: 3,
      },
      {
        id: "4-pas-dattentes-arbitraires",
        text: "4. Pas d'attentes arbitraires",
        level: 3,
      },
      {
        id: "5-un-test-ne-depend-jamais-dun-autre",
        text: "5. Un test ne dépend jamais d'un autre",
        level: 3,
      },
      {
        id: "lorganisation-des-fichiers",
        text: "L'organisation des fichiers",
        level: 2,
      },
      {
        id: "faire-tenir-tout-ca-en-ci",
        text: "Faire tenir tout ça en CI",
        level: 2,
      },
      {
        id: "parallelisation",
        text: "Parallélisation",
        level: 3,
      },
      {
        id: "retry-sur-les-flaky-tests",
        text: "Retry sur les flaky tests",
        level: 3,
      },
      {
        id: "videos-et-screenshots-a-la-demande",
        text: "Vidéos et screenshots à la demande",
        level: 3,
      },
      {
        id: "conclusion",
        text: "Conclusion",
        level: 2,
      },
    ],
  },
  "pulse-js-framework-zero-dependance": {
    wordCount: 847,
    readTime: "~4 min",
    bodyPreview:
      "Il y a deux ans, j'ai installé un nouveau projet Next.js. Trois minutes plus tard, pesait 380 Mo. Je me suis dit qu'il devait y avoir mieux. C'est de là qu'est né Pulse JS. Le contexte : la fatigue des frameworks En 12 ans de carrière, j'ai construit des SPA avec à peu près tous les frameworks du marché. React, Vue, Angular, Svelte, Solid. Chacun avec ses forces, chacun avec sa courbe d'apprentissage, et chacun avec son écosystème gravitant autour : routeurs, stores, validateurs, builders. Le…",
    headings: [
      {
        id: "le-contexte-la-fatigue-des-frameworks",
        text: "Le contexte : la fatigue des frameworks",
        level: 2,
      },
      {
        id: "lidee-centrale-declaratif-via-selecteurs-css",
        text: "L'idée centrale : déclaratif via sélecteurs CSS",
        level: 2,
      },
      {
        id: "un-exemple-vaut-mieux-quun-long-discours",
        text: "Un exemple vaut mieux qu'un long discours",
        level: 3,
      },
      {
        id: "les-principes-que-je-me-suis-fixes",
        text: "Les principes que je me suis fixés",
        level: 2,
      },
      {
        id: "ce-que-pulse-js-nessaie-pas-detre",
        text: "Ce que Pulse JS n'essaie pas d'être",
        level: 2,
      },
      {
        id: "les-lecons-apprises-en-construisant-un-framework",
        text: "Les leçons apprises en construisant un framework",
        level: 2,
      },
      {
        id: "1-le-diff-est-plus-dur-quil-ny-parait",
        text: "1. Le diff est plus dur qu'il n'y paraît",
        level: 3,
      },
      {
        id: "2-lapi-publique-est-sacree",
        text: "2. L'API publique est sacrée",
        level: 3,
      },
      {
        id: "3-la-doc-compte-autant-que-le-code",
        text: "3. La doc compte autant que le code",
        level: 3,
      },
      {
        id: "la-suite",
        text: "La suite",
        level: 2,
      },
    ],
  },
  "react-19-removechild-nextjs": {
    wordCount: 1292,
    readTime: "~6 min",
    bodyPreview:
      "Si vous utilisez Next.js 15+ avec React 19 et le App Router, vous avez probablement vu cette erreur en naviguant entre vos pages : `Uncaught TypeError: Cannot read properties of null (reading 'removeChild')`. Voici le résultat de plusieurs jours d'investigation, la cause racine exacte dans le code de React, et la solution qui fait passer tous les tests. Le symptôme L'erreur apparaît dans la console du navigateur lors de la navigation client-side entre pages. Pas au premier chargement, pas sur…",
    headings: [
      {
        id: "le-symptome",
        text: "Le symptôme",
        level: 2,
      },
      {
        id: "ce-que-tout-le-monde-essaie-et-qui-ne-marche-pas",
        text: "Ce que tout le monde essaie (et qui ne marche pas)",
        level: 2,
      },
      {
        id: "patcher-nodeprototyperemovechild",
        text: "Patcher Node.prototype.removeChild",
        level: 3,
      },
      {
        id: "suppresshydrationwarning",
        text: "suppressHydrationWarning",
        level: 3,
      },
      {
        id: "supprimer-framer-motion",
        text: "Supprimer Framer Motion",
        level: 3,
      },
      {
        id: "la-cause-racine-hosthoistable-case-26",
        text: "La cause racine : HostHoistable (case 26)",
        level: 2,
      },
      {
        id: "les-script-dangerouslysetinnerhtml-sont-aussi-touches",
        text: "Les <script dangerouslySetInnerHTML> sont aussi touchés",
        level: 3,
      },
      {
        id: "ce-qui-ne-marche-pas-non-plus-addeventlistenererror",
        text: 'Ce qui ne marche pas non plus : addEventListener("error")',
        level: 2,
      },
      {
        id: "la-solution-definitive-patcher-le-getter-parentnode",
        text: "La solution définitive : patcher le getter parentNode",
        level: 2,
      },
      {
        id: "pourquoi-cest-safe",
        text: "Pourquoi c'est safe",
        level: 3,
      },
      {
        id: "pourquoi-pas-un-error-boundary",
        text: "Pourquoi pas un Error Boundary ?",
        level: 3,
      },
      {
        id: "comment-jai-trouve",
        text: "Comment j'ai trouvé",
        level: 2,
      },
      {
        id: "en-resume",
        text: "En résumé",
        level: 2,
      },
    ],
  },
  "service-worker-nextjs-navigation-cassee": {
    wordCount: 1333,
    readTime: "~6 min",
    bodyPreview:
      "Le bug parfait : la navigation fonctionne en dev, les 18 tests Playwright passent au vert, mais en production il faut cliquer deux fois sur les liens du menu. Retour sur un diagnostic en 3 couches — Service Worker, Lenis, et un error handler trop zélé — et pourquoi vos tests E2E ne peuvent pas tout attraper. Le symptôme En production, sur vincenthirtz.fr, la navigation client-side plante de manière intermittente. Le premier clic sur un lien du menu ne fait rien. Le deuxième fonctionne. Pas…",
    headings: [
      {
        id: "le-symptome",
        text: "Le symptôme",
        level: 2,
      },
      {
        id: "la-piste-service-worker-le-coupable-principal",
        text: "La piste Service Worker : le coupable principal",
        level: 2,
      },
      {
        id: "pourquoi-ca-casse-la-navigation",
        text: "Pourquoi ça casse la navigation",
        level: 3,
      },
      {
        id: "le-fix",
        text: "Le fix",
        level: 3,
      },
      {
        id: "la-couche-lenis-scroll-desynchronise",
        text: "La couche Lenis : scroll désynchronisé",
        level: 2,
      },
      {
        id: "le-fix-supprimer-lenis",
        text: "Le fix : supprimer Lenis",
        level: 3,
      },
      {
        id: "la-couche-error-handler-trop-de-zele",
        text: "La couche error handler : trop de zèle",
        level: 2,
      },
      {
        id: "le-fix-1",
        text: "Le fix",
        level: 3,
      },
      {
        id: "pourquoi-les-tests-ne-voyaient-rien",
        text: "Pourquoi les tests ne voyaient rien",
        level: 2,
      },
      {
        id: "le-service-worker-nexiste-quen-production",
        text: "Le Service Worker n'existe qu'en production",
        level: 3,
      },
      {
        id: "waitforurl-est-trop-indulgent",
        text: "waitForURL est trop indulgent",
        level: 3,
      },
      {
        id: "les-nouveaux-tests",
        text: "Les nouveaux tests",
        level: 3,
      },
      {
        id: "checklist-pour-les-service-workers-avec-nextjs-app-router",
        text: "Checklist pour les Service Workers avec Next.js App Router",
        level: 2,
      },
      {
        id: "en-resume",
        text: "En résumé",
        level: 2,
      },
    ],
  },
  "vue-laravel-retour-experience": {
    wordCount: 961,
    readTime: "~4 min",
    bodyPreview:
      "Pendant 4 ans, j'ai été Lead Front-End chez SAPIENDO sur une plateforme SaaS de gestion de la retraite. Stack : Vue.js côté front, Laravel côté back. Voici ce que cette stack m'a appris — le bon, le moins bon, et ce que je referais autrement. Pourquoi Vue + Laravel et pas autre chose Quand j'ai rejoint l'équipe, le choix avait déjà été fait. Ma première réaction a été : « Pourquoi pas Next ou Nuxt ? Pourquoi pas un mono-repo TypeScript ? » Avec le recul, je trouve que ce choix était plus malin…",
    headings: [
      {
        id: "pourquoi-vue-laravel-et-pas-autre-chose",
        text: "Pourquoi Vue + Laravel et pas autre chose",
        level: 2,
      },
      {
        id: "les-pieges-quon-a-decouverts-a-nos-depens",
        text: "Les pièges qu'on a découverts à nos dépens",
        level: 2,
      },
      {
        id: "1-la-double-validation",
        text: "1. La double validation",
        level: 3,
      },
      {
        id: "2-letat-partage-entre-back-et-front",
        text: "2. L'état partagé entre back et front",
        level: 3,
      },
      {
        id: "3-le-couplage-des-routes",
        text: "3. Le couplage des routes",
        level: 3,
      },
      {
        id: "les-wins-qui-ont-vraiment-compte",
        text: "Les wins qui ont vraiment compté",
        level: 2,
      },
      {
        id: "cypress-comme-filet-de-securite",
        text: "Cypress comme filet de sécurité",
        level: 3,
      },
      {
        id: "storybook-pour-onboarder-les-juniors",
        text: "Storybook pour onboarder les juniors",
        level: 3,
      },
      {
        id: "la-discipline-du-code-review",
        text: "La discipline du code review",
        level: 3,
      },
      {
        id: "ce-que-je-referais-differemment",
        text: "Ce que je referais différemment",
        level: 2,
      },
      {
        id: "typescript-des-le-jour-1",
        text: "TypeScript dès le jour 1",
        level: 3,
      },
      {
        id: "investir-plus-tot-sur-le-design-system",
        text: "Investir plus tôt sur le design system",
        level: 3,
      },
      {
        id: "decoupler-back-et-front-plus-tot",
        text: "Découpler back et front plus tôt",
        level: 3,
      },
      {
        id: "conclusion",
        text: "Conclusion",
        level: 2,
      },
    ],
  },
};

export function getArticleStats(slug: string): ArticleStats | undefined {
  return ARTICLE_STATS[slug];
}
