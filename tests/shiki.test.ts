import { describe, it, expect } from "vitest";
import { highlightCode } from "@/lib/shiki";

describe("lib/shiki", () => {
  it('produit du HTML <pre class="shiki"> pour un langage connu', async () => {
    const html = await highlightCode("const x = 1;", "typescript");
    expect(html).toContain("<pre");
    expect(html).toContain("shiki");
    expect(html).toContain("x");
  });

  it("émet des variables CSS --shiki-light et --shiki-dark (dual theme)", async () => {
    const html = await highlightCode("const x = 1;", "typescript");
    expect(html).toMatch(/--shiki-light/);
    expect(html).toMatch(/--shiki-dark/);
  });

  it("accepte les alias de langage (js, ts, sh)", async () => {
    const js = await highlightCode("const x = 1;", "js");
    const ts = await highlightCode("const x = 1;", "ts");
    const sh = await highlightCode("echo hello", "sh");
    expect(js).toContain("<pre");
    expect(ts).toContain("<pre");
    expect(sh).toContain("<pre");
  });

  it("retombe sur text quand la langue est inconnue ou absente", async () => {
    const unknown = await highlightCode("some text", "klingon");
    const absent = await highlightCode("some text");
    expect(unknown).toContain("<pre");
    expect(absent).toContain("<pre");
  });

  it("normalise la casse et les espaces du lang", async () => {
    const html = await highlightCode("const x = 1;", "  TypeScript  ");
    expect(html).toContain("<pre");
    expect(html).toContain("shiki");
  });

  it("échappe correctement le HTML dangereux dans le code source", async () => {
    const html = await highlightCode("<script>alert(1)</script>", "html");
    // Le contenu ne doit pas apparaître comme un vrai <script> exécutable :
    // Shiki découpe chaque token en <span>, donc on vérifie simplement que
    // les chevrons d'ouverture du script source ont été échappés.
    expect(html).not.toMatch(/<script>alert\(1\)<\/script>/);
    expect(html).toMatch(/&lt;|&#x3C;/);
  });
});
