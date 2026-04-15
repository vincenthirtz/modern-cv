import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotesFilters from "@/components/NotesFilters";
import type { ArticleMeta } from "@/lib/articles";

const ARTICLES: ArticleMeta[] = [
  {
    slug: "react-hooks",
    title: "Les hooks React",
    excerpt: "Guide complet",
    category: "React",
    tags: ["react", "frontend"],
    date: "2026-03-01",
    dateLabel: "Mars 2026",
    readTime: "~5 min",
  },
  {
    slug: "vue-intro",
    title: "Découverte de Vue",
    excerpt: "Composition API",
    category: "Vue",
    tags: ["vue", "frontend"],
    date: "2026-02-01",
    dateLabel: "Fev 2026",
    readTime: "~4 min",
  },
  {
    slug: "ts-strict",
    title: "TypeScript strict",
    excerpt: "Mode strict",
    category: "TypeScript",
    tags: ["typescript"],
    date: "2026-01-01",
    dateLabel: "Jan 2026",
    readTime: "~3 min",
  },
];

describe("NotesFilters", () => {
  it("affiche tous les articles par défaut", () => {
    render(<NotesFilters articles={ARTICLES} />);
    expect(screen.getByText("Les hooks React")).toBeInTheDocument();
    expect(screen.getByText("Découverte de Vue")).toBeInTheDocument();
    expect(screen.getByText("TypeScript strict")).toBeInTheDocument();
  });

  it("filtre par catégorie", async () => {
    const user = userEvent.setup();
    render(<NotesFilters articles={ARTICLES} />);

    await user.click(screen.getByRole("button", { name: "React" }));

    expect(screen.getByText("Les hooks React")).toBeInTheDocument();
    expect(screen.queryByText("Découverte de Vue")).toBeNull();
    expect(screen.queryByText("TypeScript strict")).toBeNull();
  });

  it("désactive le filtre catégorie au re-clic", async () => {
    const user = userEvent.setup();
    render(<NotesFilters articles={ARTICLES} />);

    const reactBtn = screen.getByRole("button", { name: "React" });
    await user.click(reactBtn);
    await user.click(reactBtn);

    expect(screen.getByText("Découverte de Vue")).toBeInTheDocument();
  });

  it("filtre par tag", async () => {
    const user = userEvent.setup();
    render(<NotesFilters articles={ARTICLES} />);

    await user.click(screen.getByRole("button", { name: "frontend" }));

    expect(screen.getByText("Les hooks React")).toBeInTheDocument();
    expect(screen.getByText("Découverte de Vue")).toBeInTheDocument();
    expect(screen.queryByText("TypeScript strict")).toBeNull();
  });

  it("recherche full-text via l'input", async () => {
    const user = userEvent.setup();
    render(<NotesFilters articles={ARTICLES} />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "hooks");

    expect(screen.getByText("Les hooks React")).toBeInTheDocument();
    expect(screen.queryByText("TypeScript strict")).toBeNull();
  });

  it("affiche un message quand aucun article ne correspond", async () => {
    const user = userEvent.setup();
    render(<NotesFilters articles={ARTICLES} />);

    await user.type(screen.getByRole("searchbox"), "zzzzzzzzz");
    expect(screen.getByText(/aucun article trouvé/i)).toBeInTheDocument();
  });

  it("affiche le compteur quand un filtre est actif", async () => {
    const user = userEvent.setup();
    render(<NotesFilters articles={ARTICLES} />);

    await user.click(screen.getByRole("button", { name: "frontend" }));
    expect(screen.getByText(/2 articles trouvés/i)).toBeInTheDocument();
  });

  it("produit des liens vers /notes/:slug", () => {
    render(<NotesFilters articles={ARTICLES} />);
    const list = screen.getByRole("list");
    const firstLink = within(list).getAllByRole("link")[0] as HTMLAnchorElement;
    expect(firstLink.getAttribute("href")).toMatch(/^\/notes\//);
  });

  describe("recherche full-text sur le contenu (searchIndex)", () => {
    const searchIndex: Record<string, string> = {
      "react-hooks": "useEffect useState et la gestion des effets de bord en React",
      "vue-intro": "reactivity ref et computed dans Vue 3 composition",
      "ts-strict": "noImplicitAny strictNullChecks et autres options de compilation",
    };

    it("trouve un article via un mot qui n'est que dans le body", async () => {
      const user = userEvent.setup();
      render(<NotesFilters articles={ARTICLES} searchIndex={searchIndex} />);

      // "strictNullChecks" n'apparaît que dans searchIndex["ts-strict"]
      await user.type(screen.getByRole("searchbox"), "strictNullChecks");

      expect(screen.getByText("TypeScript strict")).toBeInTheDocument();
      expect(screen.queryByText("Les hooks React")).toBeNull();
      expect(screen.queryByText("Découverte de Vue")).toBeNull();
    });

    it("continue de privilégier le titre quand le terme y apparaît", async () => {
      const user = userEvent.setup();
      render(<NotesFilters articles={ARTICLES} searchIndex={searchIndex} />);

      await user.type(screen.getByRole("searchbox"), "hooks");
      // "hooks" est dans le titre de react-hooks et dans le body
      expect(screen.getByText("Les hooks React")).toBeInTheDocument();
    });

    it("fonctionne sans searchIndex (rétrocompatibilité)", async () => {
      const user = userEvent.setup();
      render(<NotesFilters articles={ARTICLES} />);

      await user.type(screen.getByRole("searchbox"), "hooks");
      expect(screen.getByText("Les hooks React")).toBeInTheDocument();
    });
  });
});
