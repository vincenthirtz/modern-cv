import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleLayout from "@/components/ArticleLayout";
import {
  ARTICLES,
  getAllSlugs,
  getArticleBySlug,
  type Article,
  type ArticleMeta,
} from "@/lib/articles";

/** Extrait la partie sérialisable d'un article (sans le composant Content). */
function toMeta(article: Article): ArticleMeta {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { Content, ...meta } = article;
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
      authors: ["Vincent Hirtz"],
      tags: [article.category],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
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

  // Articles liés : tous les autres, max 2 — sérialisés en méta seulement
  const related = ARTICLES.filter((a) => a.slug !== slug)
    .slice(0, 2)
    .map(toMeta);

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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: {
      "@type": "Person",
      name: "Vincent Hirtz",
      url: "https://vincenthirtz.fr",
    },
    publisher: {
      "@type": "Person",
      name: "Vincent Hirtz",
    },
    mainEntityOfPage: `https://vincenthirtz.fr/notes/${article.slug}`,
  };

  return (
    <main className="relative z-[2]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <ArticleLayout article={toMeta(article)} related={related}>
        <Content />
      </ArticleLayout>
    </main>
  );
}
