import { createHighlighter, type Highlighter, type BundledLanguage } from "shiki";

const LANGS: BundledLanguage[] = [
  "javascript",
  "typescript",
  "tsx",
  "jsx",
  "html",
  "css",
  "json",
  "bash",
  "shell",
];

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark-dimmed", "github-light"],
      langs: LANGS,
    });
  }
  return highlighterPromise;
}

/** Normalise une étiquette "JavaScript" / "TS" vers un id Shiki connu. */
function normalizeLang(lang?: string): BundledLanguage | "text" {
  if (!lang) return "text";
  const l = lang.toLowerCase().trim();
  const alias: Record<string, BundledLanguage> = {
    js: "javascript",
    javascript: "javascript",
    ts: "typescript",
    typescript: "typescript",
    tsx: "tsx",
    jsx: "jsx",
    html: "html",
    css: "css",
    json: "json",
    sh: "bash",
    bash: "bash",
    shell: "shell",
  };
  return alias[l] ?? "text";
}

/**
 * Coloration SSR : renvoie le HTML pré-coloré par Shiki.
 * Zero JS côté client — pur markup + styles inline.
 */
export async function highlightCode(code: string, lang?: string): Promise<string> {
  const highlighter = await getHighlighter();
  const resolved = normalizeLang(lang);
  return highlighter.codeToHtml(code, {
    lang: resolved,
    themes: {
      light: "github-light",
      dark: "github-dark-dimmed",
    },
    defaultColor: false,
  });
}
