/**
 * Augmente la déclaration par défaut de `*.mdx` (fournie par @types/mdx)
 * pour exposer le `meta` que chaque article exporte via
 * `export const meta = { ... }`.
 */
declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { ArticleMeta } from "@/lib/articles";

  export const meta: ArticleMeta;
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
