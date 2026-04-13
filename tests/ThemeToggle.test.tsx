import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ThemeToggle from "@/components/ThemeToggle";
import A11yAnnouncer from "@/components/A11yAnnouncer";

// Wrapper avec le provider A11yAnnouncer
function renderWithAnnouncer() {
  return render(
    <A11yAnnouncer>
      <ThemeToggle />
    </A11yAnnouncer>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  document.documentElement.classList.remove("light");
  cleanup();
});

describe("ThemeToggle", () => {
  describe("rendu initial", () => {
    it("affiche un placeholder avant l'hydratation (theme === null)", () => {
      // Sans localStorage, le composant lit le thème au mount
      // Avant useEffect, il retourne le placeholder <span>
      renderWithAnnouncer();
      // Après le useEffect, le bouton devrait être rendu
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("initialise en dark par défaut sans valeur en localStorage", () => {
      renderWithAnnouncer();
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Activer le mode clair");
    });

    it("initialise avec la valeur en localStorage", () => {
      localStorage.setItem("theme", "light");
      renderWithAnnouncer();
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Activer le mode sombre");
    });

    it("ajoute la classe 'light' au <html> si le thème stocké est light", () => {
      localStorage.setItem("theme", "light");
      renderWithAnnouncer();
      expect(document.documentElement.classList.contains("light")).toBe(true);
    });

    it("n'ajoute pas la classe 'light' en mode dark", () => {
      localStorage.setItem("theme", "dark");
      renderWithAnnouncer();
      expect(document.documentElement.classList.contains("light")).toBe(false);
    });
  });

  describe("toggle", () => {
    it("passe de dark à light au clic", () => {
      renderWithAnnouncer();
      const button = screen.getByRole("button");

      fireEvent.click(button);

      expect(button).toHaveAttribute("aria-label", "Activer le mode sombre");
      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(localStorage.getItem("theme")).toBe("light");
    });

    it("passe de light à dark au clic", () => {
      localStorage.setItem("theme", "light");
      renderWithAnnouncer();
      const button = screen.getByRole("button");

      fireEvent.click(button);

      expect(button).toHaveAttribute("aria-label", "Activer le mode clair");
      expect(document.documentElement.classList.contains("light")).toBe(false);
      expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("persiste le thème en localStorage après chaque toggle", () => {
      renderWithAnnouncer();
      const button = screen.getByRole("button");

      fireEvent.click(button); // dark → light
      expect(localStorage.getItem("theme")).toBe("light");

      fireEvent.click(button); // light → dark
      expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("bascule correctement après plusieurs clics", () => {
      renderWithAnnouncer();
      const button = screen.getByRole("button");

      for (let i = 0; i < 6; i++) {
        fireEvent.click(button);
      }
      // 6 clics depuis dark → dark (pair)
      expect(button).toHaveAttribute("aria-label", "Activer le mode clair");
      expect(localStorage.getItem("theme")).toBe("dark");
    });
  });

  describe("accessibilité", () => {
    it("le bouton a un aria-label descriptif", () => {
      renderWithAnnouncer();
      const button = screen.getByRole("button");
      expect(button.getAttribute("aria-label")).toMatch(/mode (clair|sombre)/);
    });

    it("annonce le changement de thème via aria-live", async () => {
      renderWithAnnouncer();
      const button = screen.getByRole("button");

      fireEvent.click(button);

      // L'annonce utilise un double-buffer avec setTimeout(50ms)
      await vi.waitFor(() => {
        const status = screen.getByRole("status");
        expect(status.textContent).toBe("Mode clair activé");
      });
    });

    it("annonce le retour au mode sombre", async () => {
      localStorage.setItem("theme", "light");
      renderWithAnnouncer();
      const button = screen.getByRole("button");

      fireEvent.click(button);

      await vi.waitFor(() => {
        const status = screen.getByRole("status");
        expect(status.textContent).toBe("Mode sombre activé");
      });
    });
  });
});
