import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Highlighted } from "@/lib/syntax-highlight";

describe("lib/syntax-highlight — Highlighted", () => {
  describe("langage jsx", () => {
    it("rend le code sans perdre de caractères", () => {
      const { container } = render(<Highlighted code="const x = 42;" lang="jsx" />);
      expect(container.textContent).toBe("const x = 42;");
    });

    it("colore les mots-clés JS", () => {
      const { container } = render(<Highlighted code="const x = 42;" lang="jsx" />);
      const spans = container.querySelectorAll("span");
      const constSpan = Array.from(spans).find((s) => s.textContent === "const");
      expect(constSpan).toBeDefined();
      // Couleur keyword = #c4b5fd (violet) — jsdom peut normaliser en rgb()
      expect(constSpan?.getAttribute("style")).toMatch(/c4b5fd|196,\s*181,\s*253/i);
    });

    it("colore les strings en simple/double quotes et backticks", () => {
      const code = `const a = "hi"; const b = 'yo'; const c = \`tpl\`;`;
      const { container } = render(<Highlighted code={code} lang="jsx" />);
      const spans = Array.from(container.querySelectorAll("span"));
      const strings = spans.filter((s) => /^["'`]/.test(s.textContent ?? ""));
      expect(strings.length).toBeGreaterThanOrEqual(3);
    });

    it("colore les commentaires // et /* */", () => {
      const code = "// line\n/* block */";
      const { container } = render(<Highlighted code={code} lang="jsx" />);
      const spans = Array.from(container.querySelectorAll("span"));
      const comments = spans.filter(
        (s) => (s.textContent ?? "").startsWith("//") || (s.textContent ?? "").startsWith("/*"),
      );
      expect(comments.length).toBeGreaterThanOrEqual(2);
    });

    it("identifie les tags JSX (<Component>, </Component>, />)", () => {
      const { container } = render(<Highlighted code="<Button>{text}</Button>" lang="jsx" />);
      const spans = Array.from(container.querySelectorAll("span"));
      const tagLike = spans.filter((s) => /^<\/?|>$/.test(s.textContent ?? ""));
      expect(tagLike.length).toBeGreaterThan(0);
    });

    it("identifie les nombres", () => {
      const { container } = render(<Highlighted code="const x = 3.14;" lang="jsx" />);
      const spans = Array.from(container.querySelectorAll("span"));
      const num = spans.find((s) => s.textContent === "3.14");
      expect(num?.getAttribute("style")).toMatch(/fcd34d|252,\s*211,\s*77/i);
    });
  });

  describe("langage css", () => {
    it("rend le CSS sans perdre de caractères", () => {
      const code = ".btn { color: red; }";
      const { container } = render(<Highlighted code={code} lang="css" />);
      expect(container.textContent).toBe(code);
    });

    it("colore les at-rules (@media, @keyframes)", () => {
      const { container } = render(<Highlighted code="@media screen { }" lang="css" />);
      const spans = Array.from(container.querySelectorAll("span"));
      const atRule = spans.find((s) => s.textContent === "@media");
      expect(atRule).toBeDefined();
    });

    it("colore les couleurs hex", () => {
      const { container } = render(<Highlighted code="color: #c8ff00;" lang="css" />);
      const spans = Array.from(container.querySelectorAll("span"));
      const hex = spans.find((s) => s.textContent === "#c8ff00");
      expect(hex?.getAttribute("style")).toMatch(/fcd34d|252,\s*211,\s*77/i);
    });

    it("colore les variables CSS (--name)", () => {
      const { container } = render(<Highlighted code="color: var(--color-accent);" lang="css" />);
      const spans = Array.from(container.querySelectorAll("span"));
      const cssvar = spans.find((s) => s.textContent === "--color-accent");
      expect(cssvar).toBeDefined();
    });

    it("colore les unités numériques (px, rem, %)", () => {
      const { container } = render(<Highlighted code="padding: 16px 1rem 50%;" lang="css" />);
      const spans = Array.from(container.querySelectorAll("span"));
      expect(spans.some((s) => s.textContent === "16px")).toBe(true);
      expect(spans.some((s) => s.textContent === "1rem")).toBe(true);
      expect(spans.some((s) => s.textContent === "50%")).toBe(true);
    });
  });

  it("gère une chaîne vide sans crasher", () => {
    const { container } = render(<Highlighted code="" lang="jsx" />);
    expect(container.textContent).toBe("");
  });

  it("gère du texte sans aucun token reconnu", () => {
    const { container } = render(<Highlighted code="plain text" lang="jsx" />);
    expect(container.textContent).toBe("plain text");
  });
});
