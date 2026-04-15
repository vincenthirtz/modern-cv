import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import TableOfContents from "@/components/TableOfContents";

afterEach(cleanup);

beforeEach(() => {
  // jsdom n'implémente pas IntersectionObserver
  class IO {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
    takeRecords = vi.fn(() => []);
    root = null;
    rootMargin = "";
    thresholds = [];
  }
  // @ts-expect-error attache le polyfill au global
  globalThis.IntersectionObserver = IO;
});

function mountArticle(headings: { id: string; text: string; level: 2 | 3 }[]) {
  document.body.innerHTML = "";
  const article = document.createElement("article");
  for (const h of headings) {
    const el = document.createElement(h.level === 2 ? "h2" : "h3");
    el.textContent = h.text;
    article.appendChild(el);
  }
  document.body.appendChild(article);
}

describe("TableOfContents", () => {
  it("ne rend rien si aucun heading n'est fourni et aucun n'existe en DOM", () => {
    mountArticle([]);
    const { container } = render(<TableOfContents />);
    expect(container.firstChild).toBeNull();
  });

  it("rend les headings fournis et applique leurs ids au DOM", () => {
    const headings = [
      { id: "intro", text: "Introduction", level: 2 as const },
      { id: "details", text: "Détails", level: 3 as const },
    ];
    mountArticle(headings);
    render(<TableOfContents headings={headings} />);

    // Le texte apparaît dans le <article> ET dans le <nav> → on cible le bouton
    expect(screen.getByRole("button", { name: "Introduction" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Détails" })).toBeInTheDocument();
    expect(document.querySelectorAll("article h2")[0].id).toBe("intro");
    expect(document.querySelectorAll("article h3")[0].id).toBe("details");
  });

  it("applique la classe toc-link--h3 aux headings de niveau 3", () => {
    const headings = [
      { id: "a", text: "A", level: 2 as const },
      { id: "b", text: "B", level: 3 as const },
    ];
    mountArticle(headings);
    render(<TableOfContents headings={headings} />);

    const links = screen.getAllByRole("button");
    expect(links[0].className).not.toContain("toc-link--h3");
    expect(links[1].className).toContain("toc-link--h3");
  });

  it("scrolle vers le heading au clic", () => {
    const headings = [{ id: "target", text: "Cible", level: 2 as const }];
    mountArticle(headings);
    const scrollSpy = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollSpy;
    render(<TableOfContents headings={headings} />);

    fireEvent.click(screen.getByRole("button", { name: "Cible" }));
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });

  it("fallback : scrape les headings du DOM si aucune prop", () => {
    mountArticle([
      { id: "", text: "Auto 1", level: 2 },
      { id: "", text: "Auto 2", level: 3 },
    ]);
    render(<TableOfContents />);
    expect(screen.getByRole("button", { name: "Auto 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Auto 2" })).toBeInTheDocument();
    // Les ids sont auto-générés
    expect(document.querySelector("article h2")?.id).toBe("heading-0");
  });
});
