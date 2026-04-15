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
  /** Texte nettoyé complet (borné à ~8000 caractères) pour l'index de recherche full-text. */
  searchText: string;
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
    searchText:
      "Les tests E2E ont une réputation de cauchemar à maintenir. Lents, flaky, cassés à la moindre refonte UI. Voici tout ce que j'ai appris en faisant tourner des suites Cypress en production sur plusieurs projets — et ce que je voudrais qu'on m'ait dit le premier jour. Pourquoi tant de monde déteste les E2E Quand un junior écrit son premier test E2E, il est conquis : il voit son application cliquée par une machine, c'est magique. Six mois plus tard, il les déteste. Parce qu'à 50 tests, ils prennent 25 minutes, ils échouent aléatoirement, et chaque refonte d'écran en casse la moitié. Le problème vient rarement de Cypress. Il vient de comment on l'utilise. Les 5 règles que je m'impose sur tout projet 1. Sélecteurs explicites uniquement Le piège #1 : sélectionner un élément par son texte ou par son . Ça marche, jusqu'à la prochaine refonte UI où le texte change ou la classe disparaît. Tes tests cassent et tu ne comprends pas pourquoi. La règle : chaque élément testable a un dédié. C'est un contrat entre l'UI et la suite de tests. Tu peux refondre tout ce que tu veux, tant que tu gardes le , tes tests passent. {`<!-- ❌ Mauvais : couplé au texte et au style --> Valider cy.contains(\"Valider\").click(); <!-- ✅ Bon : couplé à un contrat explicite --> Valider cy.get('[data-cy=\"submit-form\"]').click();`} 2. pour tout ce qui sort Si ton test E2E dépend de l'API réelle, tu n'as pas un test E2E. Tu as un test d'intégration entre ton front, ton back, ton réseau, ta base, et le réseau Cloudflare entre les deux. Quand ça pète, bonne chance pour diagnostiquer. La règle : intercepte tous les appels réseau et fournis des fixtures. Tes tests deviennent reproductibles, rapides, et tu testes vraiment ton front et pas l'infra. {`// Intercepte la liste de produits avec une fixture stable cy.intercept(\"GET\", \"/api/products\", { fixture: \"products/empty-list.json\", }).as(\"getProducts\"); cy.visit(\"/shop\"); cy.wait(\"@getProducts\"); cy.get('[data-cy=\"empty-state\"]').should(\"be.visible\");`} Cette règle a une exception : un seul \"smoke test\" qui tape la vraie API en CI, sur un parcours critique. Juste pour s'assurer que back et front peuvent encore se parler. Mais c'est un test, pas 200. 3. Custom commands pour tout ce qui se répète Si tu écris suivi de dans 30 tests, t'as raté quelque chose. Crée une commande et arrête de copier-coller. {`// cypress/support/commands.ts Cypress.Commands.add(\"login\", (email = \"demo@test.fr\", password = \"demo\") => { cy.session([email, password], () => { cy.request(\"POST\", \"/api/login\", { email, password }); }); }); // Dans un test cy.login(); cy.visit(\"/dashboard\");`} Bonus : permet de mettre en cache l'auth entre les tests. Tu gagnes 80% du temps d'exécution sur une suite qui a beaucoup de tests authentifiés. 4. Pas d'attentes arbitraires Le pire pattern que je vois : . Ça marche en local, ça flake en CI. Cypress a déjà des assertions auto-retry. Utilise-les. {`// ❌ Mauvais : pari sur un délai fixe cy.get('[data-cy=\"submit\"]').click(); cy.wait(2000); cy.get('[data-cy=\"success\"]').should(\"be.visible\"); // ✅ Bon : attend l'état attendu, peu importe le temps cy.get('[data-cy=\"submit\"]').click(); cy.get('[data-cy=\"success\"]', { timeout: 10000 }).should(\"be.visible\");`} 5. Un test ne dépend jamais d'un autre Chaque doit pouvoir tourner en isolation. Si ton test « édition » dépend que le test « création » ait tourné avant, tu as une dette technique cachée qui va exploser dès que tu paralléliseras. La règle : chaque test crée ses propres données via (idéalement par appel API direct, pas en cliquant dans l'UI), tourne, et nettoie après lui. L'organisation des fichiers Voici la structure que j'utilise sur tous mes projets : {`cypress/ ├── e2e/ │ ├── auth/ │ │ ├── login.cy.ts │ │ └── logout.cy.ts │ ├── checkout/ │ │ ├── add-to-cart.cy.ts │ │ └── payment.cy.ts │ └── smoke/ │ └── critical-paths.cy.ts ├── fixtures/ │ ├── users/ │ ├── products/ │ └── orders/ └── support/ ├── commands.ts └── e2e.ts`} Le dossier est spécial : il contient les 3-5 tests qui tapent la vraie API, lancés uniquement en CI sur un environnement de staging. Le reste est mocké. Faire tenir tout ça en CI Parallélisation Cypress Cloud (ex-Dashboard) permet la parallélisation native. Si ce n'est pas dans le budget, il y a des actions GitHub gratuites comme qui acceptent un paramètre . Découpe ta suite en 4 chunks, fais 4 jobs parallèles, gagne 75% du temps. Retry sur les flaky tests Par défaut, configure . Si un test échoue, Cypress le retente jusqu'à 2 fois. Pas pour cacher des bugs, mais pour absorber les flakes réseau et CI. Vidéos et screenshots à la demande Active les vidéos en CI uniquement, et seulement pour les tests qui échouent. Sinon ça remplit ton stockage et ralentit le runner pour rien. Conclusion Une suite Cypress qui tient la route, ce n'est pas une question de couverture maximale. C'est une question de discipline : sélecteurs explicites, mocks systématiques, custom commands, isolation stricte. Les tests E2E ne devraient pas être un jeu de quantité (« on a 800 tests ! ») mais de qualité (« nos 50 tests couvrent les 10 parcours qui font tomber l'entreprise quand ils cassent »). Choisis bien tes batailles. Et rappelle-toi cette règle d'or : Un test qui flake une fois sur 20 est un test en lequel personne ne croit. Un test en lequel personne ne croit ne sera pas regardé quand il échoue. Un test qui n'est pas regardé quand il échoue est pire qu'aucun test : il donne une fausse confiance.",
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
    searchText:
      "Il y a deux ans, j'ai installé un nouveau projet Next.js. Trois minutes plus tard, pesait 380 Mo. Je me suis dit qu'il devait y avoir mieux. C'est de là qu'est né Pulse JS. Le contexte : la fatigue des frameworks En 12 ans de carrière, j'ai construit des SPA avec à peu près tous les frameworks du marché. React, Vue, Angular, Svelte, Solid. Chacun avec ses forces, chacun avec sa courbe d'apprentissage, et chacun avec son écosystème gravitant autour : routeurs, stores, validateurs, builders. Le résultat : pour afficher un bouton qui incrémente un compteur, il faut 47 dépendances et un bundler de 200 Mo. Pour quelqu'un qui a commencé à coder en jQuery, c'est devenu un peu absurde. Pulse JS est ma tentative de répondre à une question simple : Et si on pouvait construire des SPA modernes en n'utilisant que ce que le navigateur sait déjà faire ? L'idée centrale : déclaratif via sélecteurs CSS La plupart des frameworks modernes — React en tête — partent d'un postulat : le DOM est lent, on va le virtualiser. Cette décision technique a permis des choses fantastiques, mais elle a aussi imposé un coût : tu dois maintenant décrire ton UI en JSX, transpiler ton code, et accepter que la moindre mutation passe par un diff. Le DOM moderne n'est plus lent. Il est même incroyablement rapide si tu l'utilises bien. Pulse JS part de cette observation et propose une autre voie : décrire les comportements directement dans le HTML, via des sélecteurs CSS, et laisser le navigateur faire le travail. Un exemple vaut mieux qu'un long discours {` − 0 + `} {`Pulse.component(\"counter\", { state: { count: 0 }, actions: { increment(state) { state.count++; }, decrement(state) { state.count--; }, }, });`} Pas de build. Pas de JSX. Pas de transpilation. Tu poses le script dans une balise , et ça marche. Le navigateur fait ce qu'il sait faire : observer le DOM, écouter des événements, mettre à jour des éléments via leur sélecteur. Les principes que je me suis fixés Zéro dépendance. Si Pulse JS dépend d'un seul package, il a perdu son pari. Tout est écrit en JavaScript moderne, sans polyfills ni helpers tiers. Pas de build step. Tu télécharges un fichier, tu l'inclus, c'est tout. Compatible avec n'importe quel back-end (Laravel, Rails, Django, statique...). Sélecteurs CSS comme API publique. Tu connais déjà . C'est suffisant pour décrire presque tout. Réactivité opt-in. Tu n'as pas besoin de réactivité ? N'en utilise pas. Tu en as besoin sur 3 éléments ? Tu en as sur 3 éléments. Petit. Le bundle minifié pèse moins de 8 Ko gzippé. C'est moins qu'une image de hero mal compressée. Ce que Pulse JS n'essaie pas d'être Soyons honnêtes : Pulse JS ne va pas remplacer React pour ton application SaaS de 200k lignes de code. Ce n'est pas son objectif. Il vise plutôt : Les sites institutionnels qui ont besoin d'un peu d'interactivité. Les pages produit qui veulent un panier ou un sélecteur sans embarquer un framework. Les MVP qu'on veut shipper en deux jours sans avoir à configurer Webpack. Les développeurs back-end qui veulent ajouter du dynamique sans changer de mental model. Pulse JS est inspiré de projets comme Alpine.js et HTMX, à qui je dois beaucoup. La différence ? Pulse mise plus fort sur les sélecteurs CSS et moins sur les attributs personnalisés, ce qui rend le markup plus lisible à mon goût. Les leçons apprises en construisant un framework 1. Le diff est plus dur qu'il n'y paraît Au début, je voulais éviter tout diff. « Le DOM est rapide, suffit de tout re-render ». Faux. Quand tu as une liste de 500 éléments et que tu changes un seul item, refaire tout l'innerHTML coûte cher (et casse le focus, les sélections, les states de formulaires). J'ai fini par implémenter un mini diff DOM basé sur les clés — 200 lignes, mais essentielles. 2. L'API publique est sacrée Quand tu écris ton premier framework, tu as envie d'en explorer toutes les idées. C'est une erreur. Une API publique est un contrat. Chaque méthode que tu exposes, tu vas devoir la maintenir pendant des années. J'ai jeté la moitié de ce que j'avais écrit en v0.1 pour ne garder que ce qui passait le test du « est-ce qu'un dev qui découvre Pulse va comprendre ça en 30 secondes ? ». 3. La doc compte autant que le code Personne n'utilise un framework qu'il ne comprend pas. J'ai passé presque autant de temps sur le site que sur le framework lui-même. Avec des exemples interactifs, des recettes, et une section « pourquoi pas X » qui explique honnêtement quand utiliser autre chose. La suite Pulse JS est en v0.4 au moment où j'écris ces lignes. La v1 stable est prévue pour cet été, avec un système de routing déclaratif et des composants encapsulés. Le code est ouvert, les contributions bienvenues, et je suis toujours preneur de retours d'utilisation — même négatifs. Si tu veux jouer avec : pulse-js.fr. Si tu veux contribuer, le repo est sur GitHub.",
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
    searchText:
      "Si vous utilisez Next.js 15+ avec React 19 et le App Router, vous avez probablement vu cette erreur en naviguant entre vos pages : `Uncaught TypeError: Cannot read properties of null (reading 'removeChild')`. Voici le résultat de plusieurs jours d'investigation, la cause racine exacte dans le code de React, et la solution qui fait passer tous les tests. Le symptôme L'erreur apparaît dans la console du navigateur lors de la navigation client-side entre pages. Pas au premier chargement, pas sur un refresh — uniquement quand React swap les pages via le routeur Next.js. Le pattern est régulier : environ une navigation sur deux déclenche l'erreur. La page fonctionne visuellement, mais l'erreur uncaught pollue la console et peut casser des Error Boundaries. Ce que tout le monde essaie (et qui ne marche pas) Patcher La première idée — et celle qu'on retrouve partout sur Stack Overflow et les discussions GitHub : {`// ❌ Ne fonctionne PAS pour ce bug const original = Node.prototype.removeChild; Node.prototype.removeChild = function(child) { if (child.parentNode !== this) return child; return original.call(this, child); };`} Ça ne marche pas parce que React n'appelle pas sur un mauvais parent. Il l'appelle sur . L'erreur est , pas . Le patch n'est jamais invoqué. Ça traite les warnings d'hydratation, pas les erreurs de reconciliation. Deux problèmes différents. Supprimer Framer Motion C'est une bonne hygiène, mais si vous avez ce bug sans Framer Motion, ce n'est pas la cause. On a retiré les 23 composants Framer Motion du projet et l'erreur persistait. La cause racine : HostHoistable (case 26) En lisant le code source de , la stack trace pointe systématiquement vers la même ligne dans : {`// react-dom — commitDeletionEffectsOnFiber case 26: // HostHoistable // ... deletedFiber.stateNode.parentNode.removeChild(deletedFiber.stateNode); // ^^^^^^^^^^ // parentNode est null → crash`} Case 26, c'est HostHoistable — le type de fiber React pour les éléments \"hoistables\" : , , , , . Ce sont les éléments que le navigateur est autorisé à déplacer dans le , même si React les a rendus dans le . Quand Next.js génère les metadata d'une page (via l'export ), il crée des éléments , , etc. Au premier rendu, le navigateur les hoist dans . Quand l'utilisateur navigue vers une autre page, React essaie de supprimer ces éléments de leur parent d'origine — mais le parent n'existe plus (il a été remplacé par le nouveau contenu de page). est . Crash. Les sont aussi touchés Si vous mettez des dans vos pages pour le SEO (JSON-LD), ils subissent le même sort. Le navigateur les hoist, React ne les retrouve plus. La solution pour ceux-là : les injecter via un composant client qui manipule le DOM directement, hors de l'arbre React : {`// components/JsonLd.tsx \"use client\"; export default function JsonLd({ data }: { data: Record }) { const id = useId(); useEffect(() => { const script = document.createElement(\"script\"); script.type = \"application/ld+json\"; script.id = \\ ; script.textContent = JSON.stringify(data); document.head.appendChild(script); return () => { script.remove(); }; }, [data, id]); return null; }`} Ce qui ne marche pas non plus : La deuxième fausse piste (que j'ai moi-même suivie) : intercepter l'erreur avec un event listener en capture : {`<!-- ❌ NE RÉSOUT PAS le crash de navigation --> window.addEventListener(\"error\", function(e) { if (e.message && e.message.includes(\"removeChild\")) { e.preventDefault(); return false; } }, true); `} Ça masque l'erreur dans la console, mais ça n'empêche pas le crash. L'erreur est un synchrone dans le commit phase de React. Quand throw, la call stack se déroule immédiatement — le commit phase est avorté, le fiber tree reste dans un état incohérent, et la transition de page n'aboutit jamais. Le event listener ne s'exécute qu'après, quand le mal est fait. Résultat : l'URL change (pushState a déjà été appelé), mais le contenu de la page ne se met pas à jour. L'erreur est silencieuse dans la console. On perd des heures à chercher ailleurs. La solution définitive : patcher le getter Le bug est dans React lui-même — on ne peut pas le corriger sans patcher . Mais on peut empêcher l'erreur d'être lancée en interceptant l'accès à sur les éléments hoistable. L'idée : quand retourne pour un , , ou , on retourne un objet no-op avec des méthodes / qui ne font rien. React appelle — au lieu de crasher sur , il appelle qui retourne silencieusement. {`<!-- Dans le du layout racine, AVANT tout script React --> (function() { // Seuls les éléments hoistable sont concernés var H = { TITLE: 1, LINK: 1, META: 1, STYLE: 1 }; var noop = { removeChild: function(c) { return c; }, insertBefore: function(n) { return n; } }; // 1. Patcher le getter parentNode pour les hoistables var desc = Object.getOwnPropertyDescriptor(Node.prototype, \"parentNode\"); if (desc && desc.get) { var originalGet = desc.get; Object.defineProperty(Node.prototype, \"parentNode\", { get: function() { var p = originalGet.call(this); // Si parentNode est null ET c'est un élément hoistable → no-op if (p === null && this.nodeName && H[this.nodeName]) return noop; return p; }, configurable: true }); } // 2. Patcher removeChild pour le cas \"wrong parent\" (NotFoundError) var origRemove = Node.prototype.removeChild; Node.prototype.removeChild = function(c) { if (c.parentNode !== this) return c; return origRemove.call(this, c); }; // 3. Patcher insertBefore pour le même cas var origInsert = Node.prototype.insertBefore; Node.prototype.insertBefore = function(n, r) { if (r && r.parentNode !== this) return n; return origInsert.call(this, n, r); }; })(); `} Pourquoi c'est safe 1. Ciblé — Le getter ne retourne le no-op que pour , , et dont le est . Tous les autres éléments gardent le comportement natif. 2. Prévient le crash — L'erreur n'est jamais lancée, donc le commit phase de React continue normalement et la transition de page aboutit. 3. Pas d'effet de bord visible — Les éléments concernés sont déjà détachés du DOM. Le no-op ne fait que \"réussir\" une suppression qui a déjà eu lieu. Pourquoi pas un Error Boundary ? Un Error Boundary React attraperait l'erreur mais démonterait tout l'arbre et afficherait un fallback. C'est pire que l'erreur elle-même. Comment j'ai trouvé Playwright a été décisif. J'ai créé une suite de tests qui navigue entre toutes les pages et collecte les erreurs console : {`// tests/navigation.spec.ts (extrait) test(\"navigation séquentielle sans erreur removeChild\", async ({ page }) => { const errors: string[] = []; page.on(\"pageerror\", (err) => errors.push(err.message)); await page.goto(\"/\"); for (const route of [\"/projects\", \"/experience\", \"/community\", \"/notes\"]) { await page.click(\\ ); await page.waitForURL(\\ ); await page.waitForTimeout(500); } const err = errors.find(e => e.includes(\"removeChild\")); expect(err).toBeUndefined(); });`} Le test de diagnostic avec qui patch avant React a prouvé que le patch seul n'interceptait jamais l'erreur — confirmant que React appelait sur , pas sur un Node. C'est ce qui a orienté vers le patch du getter . La lecture du code source de bundlé (ligne 8045 du chunk) a révélé le case 26 (HostHoistable) et la ligne fautive . En résumé | Ce qui ne marche pas | Pourquoi | | ---------------------------------------------- | ----------------------------------------------------------- | | Patcher seul | React appelle sur , pas sur un Node | | + | Masque l'erreur mais n'empêche pas le crash du commit phase | | | Traite l'hydratation, pas la réconciliation | | Retirer Framer Motion | Bonne idée, mais pas la cause ici | | Error Boundary | Démonte tout l'arbre pour une erreur invisible | | Ce qui marche | | | --------------------------------------------------------------- | -------------------------------------------------------- | | Patcher le getter + + | Empêche l'erreur d'être lancée, le commit phase continue | | Composant via DOM direct | Évite les HostHoistable dans les pages | | Supprimer les des pages | Réduit les HostHoistable orphelins | Le bug est ouve",
  },
  "service-worker-nextjs-navigation-cassee": {
    wordCount: 1339,
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
    searchText:
      'Le bug parfait : la navigation fonctionne en dev, les 18 tests Playwright passent au vert, mais en production il faut cliquer deux fois sur les liens du menu. Retour sur un diagnostic en 3 couches — Service Worker, Lenis, et un error handler trop zélé — et pourquoi vos tests E2E ne peuvent pas tout attraper. Le symptôme En production, sur vincenthirtz.fr, la navigation client-side plante de manière intermittente. Le premier clic sur un lien du menu ne fait rien. Le deuxième fonctionne. Pas d\'erreur visible dans la console, pas de crash, pas de page blanche. Juste un clic perdu dans le vide. Le plus frustrant : 18 tests Playwright couvrent la navigation de long en large — séquentielle, rapide, back/forward, mobile, stress test. Tous passent. La piste Service Worker : le coupable principal Le site utilise un Service Worker pour le support offline (PWA). Voici la règle qui posait problème : {`// ❌ AVANT — sw.js intercepte TOUT self.addEventListener("fetch", (event) => { // ... // App shell — stale-while-revalidate if (isShellUrl(url.pathname)) { event.respondWith(staleWhileRevalidate(request, SHELLCACHE)); return; } // Next.js data/chunks — cache-first if (url.pathname.startsWith("/\\next/")) { event.respondWith(cacheFirst(request, ASSETSCACHE)); return; } });`} Pourquoi ça casse la navigation Quand l\'utilisateur clique un lien dans Next.js App Router, le framework ne fait pas un chargement de page classique. Il envoie une requête vers l\'URL de destination avec des headers spéciaux : — indique que le serveur doit renvoyer un payload React Server Component, pas du HTML — l\'état actuel de l\'arbre de routes — pour le prefetching Le serveur répond avec un flux binaire RSC que le router interprète pour mettre à jour le DOM de manière granulaire. C\'est ce qui rend la navigation quasi-instantanée. Mais le Service Worker ne connaît pas ces headers. Quand il voit un ou , il pense que c\'est un chargement de page normal et renvoie le HTML complet depuis le cache. Le router Next.js reçoit du HTML au lieu d\'un payload RSC. Il ne sait pas quoi en faire. La navigation échoue silencieusement. Au deuxième clic, le router détecte l\'échec et fait un fallback vers un chargement complet de page, ce qui fonctionne. Le fix {`// ✅ APRÈS — sw.js laisse passer les requêtes RSC self.addEventListener("fetch", (event) => { const { request } = event; const url = new URL(request.url); if (request.method !== "GET") return; if (url.origin !== self.location.origin) return; // Ne JAMAIS intercepter les requêtes RSC if ( request.headers.get("RSC") === "1" || request.headers.get("Next-Router-State-Tree") || request.headers.get("Next-Router-Prefetch") || url.searchParams.has("\\rsc") ) { return; // Laisser la requête aller au serveur } // ... reste du routing SW });`} 4 vérifications, une seule suffit. La ceinture et les bretelles, parce que les versions de Next.js n\'envoient pas toujours les mêmes headers. La couche Lenis : scroll désynchronisé Le site utilisait Lenis pour le smooth scroll. L\'instance était créée une seule fois au mount du layout : {`// ❌ AVANT — Lenis ne sait pas qu\'on a changé de page useEffect(() => { const lenis = new Lenis({ duration: 1.2, smoothWheel: true }); // ... boucle rAF return () => lenis.destroy(); }, []); // ← tableau vide, ne réagit jamais aux navigations`} Lenis maintient un état de scroll interne ( , ). Quand Next.js navigue vers une autre page, le contenu change mais Lenis pense être toujours en train de scroller l\'ancien contenu. Le scroll ne revient pas en haut, l\'utilisateur arrive au milieu du néant, et ça ressemble à une navigation cassée. Le fix : supprimer Lenis Plutôt que de patcher Lenis pour chaque changement de route, on l\'a supprimé. Le smooth scroll natif du navigateur ( en CSS) fait le même travail sans couche d\'abstraction, sans rAF loop, sans désynchronisation avec le router. Pour garantir le scroll-to-top sur chaque navigation — y compris quand les erreurs de React 19 cassent les hooks — on utilise un patch natif sur : {`// ✅ APRÈS — scroll reset au niveau navigateur, immunisé React useEffect(() => { const scrollToTop = () => { window.scrollTo({ top: 0, behavior: "instant" }); }; const originalPushState = history.pushState.bind(history); history.pushState = function (...args) { originalPushState(...args); scrollToTop(); }; window.addEventListener("popstate", scrollToTop); return () => { history.pushState = originalPushState; window.removeEventListener("popstate", scrollToTop); }; }, []);`} Ce patch fonctionne même quand ne se met plus à jour (ce qui arrive quand React 19 corrompt son arbre interne via les erreurs ). est important — sans ça, si Lenis est dans un état "stoppé" (par exemple à cause d\'un sur le body pendant l\'ouverture du menu mobile), le est ignoré. La couche error handler : trop de zèle L\'article précédent expliquait comment on gère le bug de React 19. Voici le handler qu\'on avait en place : {`// ❌ AVANT — stopImmediatePropagation bloque tout le monde window.addEventListener("error", function(e) { if (e.message && e.message.includes("removeChild")) { e.preventDefault(); e.stopImmediatePropagation(); // ← le problème return false; } }, true);`} empêche tous les autres error handlers de voir l\'erreur. Y compris ceux de Next.js qui pourraient déclencher un retry ou un fallback de navigation. En bloquant la propagation, on empêchait le router de se remettre d\'une erreur de réconciliation. Le fix {`// ✅ APRÈS — preventDefault seul, pas de blocage de propagation window.addEventListener("error", function(e) { if (e.message && (e.message.includes("removeChild") || e.message.includes("insertBefore"))) { e.preventDefault(); return false; } }, true);`} suffit pour empêcher l\'erreur d\'apparaître dans la console. Les autres handlers reçoivent toujours l\'événement et peuvent réagir. Et on ajoute au passage — même famille de bugs React 19. Pourquoi les tests ne voyaient rien C\'est la leçon la plus importante de ce debug. Le Service Worker n\'existe qu\'en production {`// components/ServiceWorkerRegister.tsx useEffect(() => { if ("serviceWorker" in navigator && process.env.NODEENV === "production") { navigator.serviceWorker.register("/sw.js"); } }, []);`} En dev, pas de SW. Les tests Playwright lancent . Le bug n\'existe littéralement pas dans l\'environnement de test. est trop indulgent {`// Le test attend patiemment que l\'URL change — même si ça prend 5 secondes await page.click(\\ ); await page.waitForURL(\\ ); // timeout par défaut : 30s`} Si le premier clic échoue et que le router retente automatiquement, finit par passer. Le test ne sait pas que ça a pris 2 clics — il voit juste que l\'URL a fini par changer. Les nouveaux tests {`// Test 19 : UN SEUL clic doit suffire — timeout agressif await page.click(\\ ); await page.waitForURL(\\ , { timeout: 2000 }); // ↑ Échoue si la navigation ne se produit pas en < 2s // Test 20 : Le scroll doit revenir à 0 après navigation await page.evaluate(() => window.scrollTo(0, 600)); await page.click(\'nav >> a[href="/projects"]\'); // ... const scrollY = await page.evaluate(() => window.scrollY); expect(scrollY).toBeLessThanOrEqual(10); // Test 21 : Les requêtes RSC ne doivent pas être bloquées page.on("response", (response) => { const req = response.request(); if (req.headers()["rsc"] === "1") { rscResponses.push({ url: response.url(), ok: response.ok() }); } });`} Checklist pour les Service Workers avec Next.js App Router Si vous avez un Service Worker sur un site Next.js App Router, vérifiez ces points : Requêtes RSC — Le SW doit détecter les headers , , et les laisser passer au serveur Scope — Ne cacher que (assets hashés). Ne pas cacher (Pages Router) ou les RSC payloads Versioning — Incrémenter la version du cache à chaque déploiement pour éviter les chunks JS obsolètes Tests en production — Au minimum un smoke test sur un build de production avec le SW actif En résumé | Couche | Problème | Impact | | --------------------------- | -------------------------------------------------------- | --------------',
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
    searchText:
      "Pendant 4 ans, j'ai été Lead Front-End chez SAPIENDO sur une plateforme SaaS de gestion de la retraite. Stack : Vue.js côté front, Laravel côté back. Voici ce que cette stack m'a appris — le bon, le moins bon, et ce que je referais autrement. Pourquoi Vue + Laravel et pas autre chose Quand j'ai rejoint l'équipe, le choix avait déjà été fait. Ma première réaction a été : « Pourquoi pas Next ou Nuxt ? Pourquoi pas un mono-repo TypeScript ? » Avec le recul, je trouve que ce choix était plus malin qu'il n'y paraissait. Le contexte : un cabinet d'expertise retraite avec une équipe back PHP historique, des règles métier complexes, et une obligation de pouvoir livrer rapidement de nouvelles fonctionnalités sans casser l'existant. Dans ce contexte : Laravel apporte une boîte à outils complète (queues, mailing, auth, validation) sans avoir à les recoder. Vue a une courbe d'apprentissage plus douce que React pour des devs back qui font occasionnellement du front. L'écosystème Inertia.js permet de bypasser une bonne partie de la complexité d'une SPA classique. Pour une équipe de 6 développeurs avec deux profils full-stack et un seul spécialiste front, c'était la bonne décision. Les pièges qu'on a découverts à nos dépens 1. La double validation Premier piège classique : tu valides côté front (UX) et côté back (sécurité). C'est nécessaire, mais ça veut dire que tu écris deux fois les mêmes règles. Au début, on les laissait dériver. Six mois plus tard, certains formulaires acceptaient en front ce que le back refusait — ou l'inverse. Ce qu'on a fini par faire : exposer les règles de validation Laravel via une route qui renvoie le schéma. Le front les utilise pour configurer Vee-Validate. Une seule source de vérité. {`// Côté Laravel — règles centralisées class RetirementCalcRequest extends FormRequest { public function rules(): array { return [ 'birthdate' => ['required', 'date', 'before:today'], 'salary' => ['required', 'numeric', 'min:0'], 'years' => ['required', 'integer', 'between:1,50'], ]; } } // Route exposant les règles Route::get('/api/validation/{form}', [ValidationController::class, 'show']);`} 2. L'état partagé entre back et front Avec Inertia, tu hydrates ton composant Vue avec des props venant directement du contrôleur Laravel. Pratique, mais dangereux : tu n'as plus de boundary nette entre l'état serveur et l'état client. Symptôme : un dev modifie une propriété côté front, oubliant qu'elle vient du back. À la prochaine navigation, sa modification disparaît. Confusion garantie. Notre règle : tout ce qui vient du back est readonly côté front. Si tu veux le modifier, tu fais un clone local et tu envoies une mutation au back. Pas de magie. C'est plus verbeux, mais c'est explicite. 3. Le couplage des routes Inertia fait que tes routes sont définies dans Laravel, mais consommées depuis Vue. Renomme une route Laravel, et trois écrans Vue cassent silencieusement (pas d'erreur de build, juste un 404 au runtime). Solution : on a généré un fichier à chaque build, depuis les routes Laravel via Ziggy. TypeScript voit les routes, autocomplete marche, et un changement back casse le build front. Mieux qu'un 404 en prod. Ziggy est génial mais peu utilisé. Si tu fais du Laravel + JS, c'est probablement la pépite cachée que tu cherches. Les wins qui ont vraiment compté Cypress comme filet de sécurité On a misé sur Cypress dès le départ. Pas pour faire 1000 tests E2E exhaustifs, mais pour couvrir les 10 parcours critiques — ceux qui font de l'argent. Connexion, simulation retraite, génération du rapport PDF, paiement, etc. Résultat : on a refactoré l'auth de fond en comble en deux semaines, sans régression visible côté client. Sans ces tests, on aurait reporté ce chantier de 6 mois par peur de tout casser. Storybook pour onboarder les juniors Quand un nouveau dev arrive, il commence par lire Storybook avant de toucher au code. Il voit en 30 minutes tous les composants qu'il aura à composer, leurs variants, leurs props. C'est un investissement énorme à mettre en place, mais tu le rentabilises au troisième onboarding. La discipline du code review Pas un commit n'a été mergé sans review pendant 4 ans. Pas un. Ça paraît bête, mais c'est ce qui a maintenu la qualité quand l'équipe a doublé. Et accessoirement, c'est aussi ce qui a permis aux juniors de progresser le plus vite. Le truc qui m'a le plus appris, c'est pas les tutos. C'est les commentaires de Vincent sur mes PR. Ce que je referais différemment TypeScript dès le jour 1 On a commencé en JavaScript pur. On est passé à TypeScript en année 2. Migrer 30k lignes a été douloureux. Si je recommençais : TypeScript partout, dès le jour 1, sans négociation. Investir plus tôt sur le design system Notre Storybook est arrivé en année 3. Avant ça, on avait des composants dupliqués partout, des variants inconsistants, des couleurs hardcodées. Si je recommençais : une semaine de design system avant le premier écran. Token CSS, composants de base, variants documentés. Découpler back et front plus tôt Inertia est génial pour démarrer vite, mais à un moment ça devient un couteau suisse qui te limite. Si je recommençais sur un produit aussi complexe, je passerais probablement à une vraie API REST/GraphQL en année 2, en gardant Inertia uniquement pour les écrans simples (admin, settings). Conclusion Vue + Laravel n'est pas la stack la plus hype de 2026, mais c'est une stack solide. Elle privilégie la productivité d'équipe à la nouveauté. Elle te permet de livrer un MVP en 3 semaines et de le scaler à un produit mature en 4 ans, avec une équipe qui n'a pas besoin d'avoir suivi 200 tutoriels avant d'être productive. Et quelque part, c'est exactement ce qu'on demande à un Lead Dev : choisir des outils que l'équipe peut tenir, pas seulement ceux que toi tu trouves brillants.",
  },
};

export function getArticleStats(slug: string): ArticleStats | undefined {
  return ARTICLE_STATS[slug];
}
