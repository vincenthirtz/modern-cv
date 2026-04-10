import type { MDXComponents } from "mdx/types";
import {
  CodeBlock,
  Divider,
  H2,
  H3,
  InlineCode,
  LI,
  Lead,
  Note,
  P,
  Quote,
  Strong,
  UList,
} from "@/components/ProseElements";

/**
 * Mapping des éléments rendus par MDX vers nos briques typographiques.
 *
 * - Les éléments markdown standard (h2, p, ul…) sont câblés ici.
 * - Les composants custom (Lead, Note, Quote, CodeBlock, InlineCode) sont
 *   également exposés pour pouvoir être utilisés en tant que JSX dans les .mdx
 *   sans avoir à les importer dans chaque fichier.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Markdown → ProseElements
    h2: ({ children }) => <H2>{children}</H2>,
    h3: ({ children }) => <H3>{children}</H3>,
    p: ({ children }) => <P>{children}</P>,
    strong: ({ children }) => <Strong>{children}</Strong>,
    ul: ({ children }) => <UList>{children}</UList>,
    li: ({ children }) => <LI>{children}</LI>,
    hr: () => <Divider />,
    // `code` peut être inline OU dans un <pre>. On rend l'inline ici ;
    // les blocs sont écrits via <CodeBlock> dans les .mdx (pas via ```).
    code: ({ children }) => <InlineCode>{children}</InlineCode>,
    // Liens : on garde le style cohérent avec les articles existants.
    a: ({ href, children }) => (
      <a
        href={href}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="underline decoration-[var(--color-accent)] underline-offset-4 hover:text-[var(--color-accent)]"
      >
        {children}
      </a>
    ),

    // Composants custom directement disponibles dans le MDX
    Lead,
    Note,
    Quote,
    CodeBlock,
    InlineCode,
    Strong,

    ...components,
  };
}
