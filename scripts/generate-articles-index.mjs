/**
 * Génère automatiquement lib/articles/index.ts à partir des fichiers .mdx
 * présents dans lib/articles/. Exécuté avant chaque build.
 *
 * Usage : node scripts/generate-articles-index.mjs
 */
import { readdirSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";

const articlesDir = join(process.cwd(), "lib", "articles");
const outputFile = join(articlesDir, "index.ts");

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

const imports = [];
const entries = [];

for (const file of mdxFiles) {
  const slug = basename(file, ".mdx");
  const camel = toCamelCase(slug);
  const componentName = camel.charAt(0).toUpperCase() + camel.slice(1) + "Article";
  const metaName = camel + "Meta";

  imports.push(`import ${componentName}, { meta as ${metaName} } from "./${slug}.mdx";`);
  entries.push(`  { ...${metaName}, Content: ${componentName} },`);
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
console.log(
  `✓ lib/articles/index.ts généré avec ${mdxFiles.length} article(s) : ${mdxFiles.map((f) => basename(f, ".mdx")).join(", ")}`,
);
