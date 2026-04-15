/**
 * Génère automatiquement lib/articles/index.ts à partir des fichiers .mdx
 * présents dans lib/articles/. Exécuté avant chaque build.
 *
 * Extrait aussi wordCount et un articleBody résumé depuis chaque MDX
 * pour enrichir le JSON-LD BlogPosting (rich snippets Google).
 *
 * Usage : node scripts/generate-articles-index.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";

const articlesDir = join(process.cwd(), "lib", "articles");
const outputFile = join(articlesDir, "index.ts");
const statsFile = join(articlesDir, "stats.generated.ts");

const mdxFiles = readdirSync(articlesDir)
  .filter((f) => f.endsWith(".mdx"))
  .sort();

if (mdxFiles.length === 0) {
  console.warn("⚠ Aucun fichier .mdx trouvé dans lib/articles/");
  process.exit(0);
}

/** Convertit un nom de fichier en identifiant JS valide : "vue-laravel" → "vueLaravel" */
function toCamelCase(slug) {
  return slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/** Extrait le texte lisible d'un MDX : supprime frontmatter, JSX, code, directives. */
function extractPlainText(source) {
  let s = source;
  // Retire l'export meta en tête
  s = s.replace(/export\s+const\s+meta\s*=\s*\{[\s\S]*?\};?/m, "");
  // Retire les imports
  s = s.replace(/^import\s+.*$/gm, "");
  // Retire les blocs de code ``` ... ```
  s = s.replace(/```[\s\S]*?```/g, " ");
  // Retire le code inline `...`
  s = s.replace(/`[^`\n]*`/g, " ");
  // Retire les balises JSX auto-fermantes <Foo ... />
  s = s.replace(/<[A-Z][^>]*\/>/g, " ");
  // Retire les balises JSX ouvrantes/fermantes (composants MDX) mais garde le contenu
  s = s.replace(/<\/?[A-Za-z][^>]*>/g, " ");
  // Retire les liens markdown en gardant le texte : [label](url) → label
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  // Retire les images ![alt](url)
  s = s.replace(/!\[[^\]]*\]\([^)]+\)/g, " ");
  // Retire les marques markdown restantes (#, *, _, >, etc.)
  s = s.replace(/^[#>\-*]+\s*/gm, "");
  s = s.replace(/[*_~]/g, "");
  // Normalise les espaces
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

/** Slugify simple : "Pourquoi Vue + Laravel" → "pourquoi-vue-laravel" */
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Extrait les headings markdown ## et ### du MDX (en ignorant les blocs de code). */
function extractHeadings(raw) {
  // Retire les blocs de code pour éviter les faux positifs sur # commentaire
  const noCode = raw.replace(/```[\s\S]*?```/g, "");
  const lines = noCode.split("\n");
  const headings = [];
  const idCounts = new Map();
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (!m) continue;
    const level = m[1].length;
    const text = m[2].replace(/[*_`]/g, "").trim();
    let id = slugify(text);
    if (!id) continue;
    const count = idCounts.get(id) ?? 0;
    if (count > 0) id = `${id}-${count}`;
    idCounts.set(slugify(text), count + 1);
    headings.push({ id, text, level });
  }
  return headings;
}

function computeStats(filePath) {
  const raw = readFileSync(filePath, "utf-8");
  const text = extractPlainText(raw);
  const words = text ? text.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  // Lecture : 230 mots/min (français), arrondi sup, min 1 min
  const minutes = Math.max(1, Math.round(wordCount / 230));
  const readTime = `~${minutes} min`;
  // Résumé : 500 premiers caractères propres (coupés sur un mot)
  const MAX = 500;
  let bodyPreview = text.slice(0, MAX);
  if (text.length > MAX) {
    const lastSpace = bodyPreview.lastIndexOf(" ");
    if (lastSpace > 200) bodyPreview = bodyPreview.slice(0, lastSpace) + "…";
    else bodyPreview += "…";
  }
  const headings = extractHeadings(raw);
  // Texte complet pour l'index de recherche full-text (Fuse.js).
  // Normalisé et borné à ~8000 caractères pour garder le bundle raisonnable.
  const SEARCH_MAX = 8000;
  const searchText = text.length > SEARCH_MAX ? text.slice(0, SEARCH_MAX) : text;
  return { wordCount, readTime, bodyPreview, headings, searchText };
}

const imports = [];
const entries = [];
const stats = {};

for (const file of mdxFiles) {
  const slug = basename(file, ".mdx");
  const camel = toCamelCase(slug);
  const componentName = camel.charAt(0).toUpperCase() + camel.slice(1) + "Article";
  const metaName = camel + "Meta";

  imports.push(`import ${componentName}, { meta as ${metaName} } from "./${slug}.mdx";`);
  entries.push(`  { ...${metaName}, Content: ${componentName} },`);

  const { wordCount, readTime, bodyPreview, headings, searchText } = computeStats(
    join(articlesDir, file),
  );
  const metaSlugMatch = readFileSync(join(articlesDir, file), "utf-8").match(
    /slug:\s*["']([^"']+)["']/,
  );
  const metaSlug = metaSlugMatch ? metaSlugMatch[1] : slug;
  stats[metaSlug] = { wordCount, readTime, bodyPreview, headings, searchText };
}

const content = `import type { ComponentType } from "react";
${imports.join("\n")}

export interface ArticleMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** Tags pour le filtrage et les recommandations d'articles liés */
  tags: string[];
  /** Date ISO pour le tri et schema.org */
  date: string;
  /** Date affichée au format français */
  dateLabel: string;
  /** Date ISO de dernière révision (optionnel, pour schema.org/dateModified) */
  updatedAt?: string;
  /** Date de révision affichée au format français */
  updatedAtLabel?: string;
  readTime: string;
}

export interface Article extends ArticleMeta {
  Content: ComponentType;
}

/**
 * Manifest d'articles — généré automatiquement par scripts/generate-articles-index.mjs.
 * Ne pas modifier manuellement : ajouter un fichier .mdx dans lib/articles/ puis
 * relancer \`node scripts/generate-articles-index.mjs\` ou \`npm run build\`.
 */
export const ARTICLES: Article[] = [
${entries.join("\n")}
].sort((a, b) => (a.date < b.date ? 1 : -1));

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getAllSlugs(): string[] {
  return ARTICLES.map((article) => article.slug);
}

/**
 * Renvoie les articles les plus proches par tags communs.
 * Score = nombre de tags partagés. À score égal, l'article le plus récent gagne.
 */
export function getRelatedArticles(slug: string, max = 2): Article[] {
  const current = getArticleBySlug(slug);
  if (!current) return [];

  const currentTags = new Set(current.tags);

  return ARTICLES.filter((a) => a.slug !== slug)
    .map((a) => ({
      article: a,
      score: a.tags.filter((t) => currentTags.has(t)).length,
    }))
    .sort((a, b) => b.score - a.score || (a.article.date < b.article.date ? 1 : -1))
    .slice(0, max)
    .map((r) => r.article);
}
`;

writeFileSync(outputFile, content, "utf-8");

/**
 * Stats générées (wordCount, bodyPreview) — injectées dans le JSON-LD BlogPosting.
 * Fichier séparé pour garder index.ts stable côté diff quand seul le contenu change.
 */
const statsContent = `/**
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

export const ARTICLE_STATS: Record<string, ArticleStats> = ${JSON.stringify(stats, null, 2)};

export function getArticleStats(slug: string): ArticleStats | undefined {
  return ARTICLE_STATS[slug];
}
`;

writeFileSync(statsFile, statsContent, "utf-8");

console.log(
  `✓ lib/articles/index.ts généré avec ${mdxFiles.length} article(s) : ${mdxFiles.map((f) => basename(f, ".mdx")).join(", ")}`,
);
console.log(`✓ lib/articles/stats.generated.ts généré (wordCount + bodyPreview)`);
