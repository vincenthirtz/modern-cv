import { describe, it, expect } from "vitest";
import { computeReadTime } from "@/lib/readTime";

describe("computeReadTime", () => {
  it("retourne un minimum de 1 min pour un texte court", () => {
    expect(computeReadTime("un deux trois")).toBe("~1 min");
  });

  it("retourne 1 min pour une chaîne vide", () => {
    expect(computeReadTime("")).toBe("~1 min");
  });

  it("arrondit vers le haut le nombre de minutes", () => {
    const words = Array.from({ length: 231 }, (_, i) => `mot${i}`).join(" ");
    expect(computeReadTime(words, 230)).toBe("~2 min");
  });

  it("calcule les minutes en fonction du débit fourni", () => {
    const words = Array.from({ length: 1000 }, (_, i) => `w${i}`).join(" ");
    expect(computeReadTime(words, 200)).toBe("~5 min");
    expect(computeReadTime(words, 500)).toBe("~2 min");
  });

  it("ignore les balises HTML/JSX", () => {
    const html = "<p>un</p><strong>deux</strong>";
    expect(computeReadTime(html)).toBe("~1 min");
  });

  it("ignore les blocs de code fence", () => {
    const big = Array.from({ length: 1000 }, () => "code").join(" ");
    const text = "un deux\n```ts\n" + big + "\n```";
    expect(computeReadTime(text, 230)).toBe("~1 min");
  });

  it("ignore le code inline entre backticks", () => {
    expect(computeReadTime("un `foo bar baz qux` deux")).toBe("~1 min");
  });

  it("ignore les imports/exports", () => {
    const text = "import Foo from 'bar'; un deux trois";
    expect(computeReadTime(text)).toBe("~1 min");
  });
});
