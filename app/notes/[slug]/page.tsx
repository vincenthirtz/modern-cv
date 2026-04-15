import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import {
  getAllSlugs,
  getArticleBySlug,
  getRelatedArticles,
  type Article,
  type ArticleMeta,
} from "@/lib/articles";
import { getArticleStats } from "@/lib/articles/stats.generated";

/** Convertit "~5 min" en durée ISO 8601 "PT5M" pour schema.org/timeRequired. */
function toIsoDuration(readTime: string): string | undefined {
  const m = readTime.match(/(\d+)/);
  return m ? `PT${m[1]}M` : undefined;
}

/** Extrait la partie sérialisable d'un article (sans le composant Content). */
function toMeta(article: Article): ArticleMeta {
  const { Content: _, ...meta } = article;
  return meta;
}

interface PageProps {
  // Next 15 : params est désormais async
  params: Promise<{ slug: string }>;
}

/**
 * Génère statiquement une page par article au build.
 */
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/**
 * Métadonnées par article : title, description, OG, canonical.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return { title: "Note introuvable" };
  }
  const url = `https://vincenthirtz.fr/notes/${article.slug}`;
  return {
    title: `${article.title} — Vincent Hirtz`,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.excerpt,
      siteName: "Vincent Hirtz",
      locale: "fr_FR",
      publishedTime: article.date,
      modifiedTime: article.updatedAt ?? article.date,
      authors: ["Vincent Hirtz"],
      tags: [article.category, ...article.tags],
      images: [
        {
          url: `/notes/${article.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [`/notes/${article.slug}/twitter-image`],
    },
  };
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  // Le composant Content est rendu côté serveur ici, puis passé en children.
  // Cela évite de passer une fonction (non sérialisable) en prop à un Client Component.
  const { Content } = article;

  // Articles liés par tags communs, max 2 — sérialisés en méta seulement
  const related = getRelatedArticles(slug, 2).map(toMeta);

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
        name: "Notes",
        item: "https://vincenthirtz.fr/notes",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://vincenthirtz.fr/notes/${article.slug}`,
      },
    ],
  };

  const stats = getArticleStats(article.slug);
  const timeRequired = toIsoDuration(article.readTime);

  const articleJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://vincenthirtz.fr/notes/${article.slug}#article`,
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.updatedAt ?? article.date,
    author: {
      "@id": "https://vincenthirtz.fr/#person",
    },
    publisher: {
      "@id": "https://vincenthirtz.fr/#person",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://vincenthirtz.fr/notes/${article.slug}`,
    },
    image: `https://vincenthirtz.fr/notes/${article.slug}/opengraph-image`,
    keywords: [article.category, ...article.tags],
    articleSection: article.category,
    inLanguage: "fr",
    isPartOf: {
      "@type": "Blog",
      "@id": "https://vincenthirtz.fr/notes#blog",
      name: "Vincent Hirtz — Notes",
      url: "https://vincenthirtz.fr/notes",
    },
  };

  if (stats) {
    articleJsonLd.wordCount = stats.wordCount;
    articleJsonLd.articleBody = stats.bodyPreview;
  }
  if (timeRequired) {
    articleJsonLd.timeRequired = timeRequired;
  }

  return (
    <main className="relative z-[2]">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />
      <ArticleLayout
        article={toMeta(article)}
        related={related}
        headings={stats?.headings}
        readTime={stats?.readTime}
      >
        <Content />
      </ArticleLayout>
    </main>
  );
}
