import { Fragment, type CSSProperties } from "react";

/**
 * Mini coloration syntaxique pour les snippets affichés dans les Story.
 * Volontairement minimaliste — pas de Shiki/Prism : pur regex, zéro JS
 * supplémentaire côté client. Pour des cas plus complexes (autres langages,
 * highlight précis), passer sur Shiki en SSR.
 */

const TOKEN_COLORS: Record<string, CSSProperties> = {
  comment: { color: "#6b7280", fontStyle: "italic" },
  string: { color: "#a3e635" },
  tag: { color: "#7dd3fc" },
  attr: { color: "#fca5a5" },
  keyword: { color: "#c4b5fd" },
  number: { color: "#fcd34d" },
  punct: { color: "#94a3b8" },
  atrule: { color: "#c4b5fd" },
  selector: { color: "#fca5a5" },
  prop: { color: "#7dd3fc" },
  hex: { color: "#fcd34d" },
  cssvar: { color: "#a3e635" },
  plain: { color: "inherit" },
};

const JSX_RE =
  /(?<comment>\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(?<string>`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(?<tag><\/?[A-Za-z][\w.]*|\/?>)|(?<attr>\b[a-zA-Z_][\w-]*(?==))|(?<keyword>\b(?:const|let|var|function|return|import|from|export|default|if|else|true|false|null|undefined|async|await|new|class|for|while|typeof|in|of|this)\b)|(?<number>\b\d+(?:\.\d+)?\b)|(?<punct>[{}()[\];,.=])/g;

const CSS_RE =
  /(?<comment>\/\*[\s\S]*?\*\/)|(?<atrule>@[\w-]+)|(?<string>"[^"]*"|'[^']*')|(?<hex>#[0-9a-fA-F]{3,8}\b)|(?<number>-?\d+(?:\.\d+)?(?:px|em|rem|ms|s|%|vh|vw|fr|deg)?)|(?<cssvar>--[\w-]+|\bvar\b)|(?<selector>(?:^|\n)\s*[.#&:][\w:\-.&[\]]*)|(?<prop>\b[a-z-]+(?=\s*:))|(?<punct>[{};])/g;

export type CodeLang = "jsx" | "css";

interface Token {
  t: string;
  v: string;
}

function tokenize(src: string, re: RegExp): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const m of src.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ t: "plain", v: src.slice(last, i) });
    const g = m.groups ?? {};
    const t = Object.keys(g).find((k) => g[k] !== undefined) ?? "plain";
    out.push({ t, v: m[0] });
    last = i + m[0].length;
  }
  if (last < src.length) out.push({ t: "plain", v: src.slice(last) });
  return out;
}

export function Highlighted({ code, lang }: { code: string; lang: CodeLang }) {
  const tokens = tokenize(code, lang === "jsx" ? JSX_RE : CSS_RE);
  return (
    <>
      {tokens.map((tok, i) => (
        <Fragment key={i}>
          <span style={TOKEN_COLORS[tok.t] ?? TOKEN_COLORS.plain}>{tok.v}</span>
        </Fragment>
      ))}
    </>
  );
}
