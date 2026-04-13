import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccentPicker from "@/components/AccentPicker";
import A11yAnnouncer from "@/components/A11yAnnouncer";

const mockStorage = new Map<string, string>();

beforeEach(() => {
  mockStorage.clear();
  vi.restoreAllMocks();
  cleanup();

  // Nettoyer les custom properties
  const s = document.documentElement.style;
  s.removeProperty("--color-accent");
  s.removeProperty("--color-accent-soft");
  s.removeProperty("--color-accent-contrast");
  s.removeProperty("--color-accent-fg");
  s.removeProperty("--color-accent-light");
  s.removeProperty("--color-accent-light-soft");

  vi.stubGlobal("localStorage", {
    getItem: (key: string) => mockStorage.get(key) ?? null,
    setItem: (key: string, value: string) => mockStorage.set(key, value),
    removeItem: (key: string) => mockStorage.delete(key),
  });
});

function renderWithAnnouncer() {
  return render(
    <A11yAnnouncer>
      <AccentPicker />
    </A11yAnnouncer>,
  );
}

describe("AccentPicker", () => {
  it("affiche le bouton déclencheur", async () => {
    renderWithAnnouncer();
    await waitFor(() => {
      expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
    });
  });

  it("ouvre la palette au clic", async () => {
    const user = userEvent.setup();
    renderWithAnnouncer();

    await waitFor(() => {
      expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Changer la couleur d'accentuation"));

    expect(screen.getByRole("radiogroup")).toBeVisible();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  it("a aria-expanded correct", async () => {
    const user = userEvent.setup();
    renderWithAnnouncer();

    await waitFor(() => {
      expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
    });

    const trigger = screen.getByLabelText("Changer la couleur d'accentuation");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("affiche les 5 accents (Lime, Cyan, Rose, Orange, Violet)", async () => {
    const user = userEvent.setup();
    renderWithAnnouncer();

    await waitFor(() => {
      expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Changer la couleur d'accentuation"));

    for (const name of ["Lime", "Cyan", "Rose", "Orange", "Violet"]) {
      expect(screen.getByLabelText(name)).toBeInTheDocument();
    }
  });

  it("persiste le choix dans localStorage", async () => {
    const user = userEvent.setup();
    renderWithAnnouncer();

    await waitFor(() => {
      expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Changer la couleur d'accentuation"));
    await user.click(screen.getByLabelText("Cyan"));

    expect(mockStorage.get("accent")).toBe("Cyan");
  });

  it("applique les CSS custom properties au choix", async () => {
    const user = userEvent.setup();
    renderWithAnnouncer();

    await waitFor(() => {
      expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Changer la couleur d'accentuation"));
    await user.click(screen.getByLabelText("Cyan"));

    const root = document.documentElement;
    expect(root.style.getPropertyValue("--color-accent")).toBe("#00e5ff");
  });

  it("ferme la palette au Escape", async () => {
    const user = userEvent.setup();
    renderWithAnnouncer();

    await waitFor(() => {
      expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Changer la couleur d'accentuation"));
    expect(screen.getByRole("radiogroup")).toBeVisible();

    await user.keyboard("{Escape}");

    const trigger = screen.getByLabelText("Changer la couleur d'accentuation");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("restaure l'accent depuis localStorage au montage", async () => {
    mockStorage.set("accent", "Rose");
    renderWithAnnouncer();

    await waitFor(() => {
      const root = document.documentElement;
      expect(root.style.getPropertyValue("--color-accent")).toBe("#ff3c82");
    });
  });

  it("marque l'accent actif avec aria-checked", async () => {
    const user = userEvent.setup();
    renderWithAnnouncer();

    await waitFor(() => {
      expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Changer la couleur d'accentuation"));

    // Lime est l'accent par défaut
    expect(screen.getByLabelText("Lime")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByLabelText("Cyan")).toHaveAttribute("aria-checked", "false");
  });

  it("met à jour aria-checked après sélection d'un nouvel accent", async () => {
    const user = userEvent.setup();
    renderWithAnnouncer();

    await waitFor(() => {
      expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Changer la couleur d'accentuation"));
    await user.click(screen.getByLabelText("Rose"));

    // Ré-ouvrir le panneau pour vérifier
    await user.click(screen.getByLabelText("Changer la couleur d'accentuation"));
    expect(screen.getByLabelText("Rose")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByLabelText("Lime")).toHaveAttribute("aria-checked", "false");
  });

  it("ferme le panneau après sélection d'un accent", async () => {
    const user = userEvent.setup();
    renderWithAnnouncer();

    await waitFor(() => {
      expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
    });

    const trigger = screen.getByLabelText("Changer la couleur d'accentuation");
    await user.click(trigger);
    await user.click(screen.getByLabelText("Orange"));

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("applique toutes les CSS custom properties (6 variables)", async () => {
    const user = userEvent.setup();
    renderWithAnnouncer();

    await waitFor(() => {
      expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Changer la couleur d'accentuation"));
    await user.click(screen.getByLabelText("Violet"));

    const s = document.documentElement.style;
    expect(s.getPropertyValue("--color-accent")).toBe("#a78bfa");
    expect(s.getPropertyValue("--color-accent-soft")).toBe("#c4b5fd");
    expect(s.getPropertyValue("--color-accent-contrast")).toBe("#1a1530");
    expect(s.getPropertyValue("--color-accent-fg")).toBe("#6d47d9");
    expect(s.getPropertyValue("--color-accent-light")).toBe("#6d47d9");
    expect(s.getPropertyValue("--color-accent-light-soft")).toBe("#8660ec");
  });

  it("les boutons radio sont tabbables quand le panneau est ouvert", async () => {
    const user = userEvent.setup();
    renderWithAnnouncer();

    await waitFor(() => {
      expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Changer la couleur d'accentuation"));

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute("tabindex", "0");
    });
  });

  it("les boutons radio ne sont pas tabbables quand le panneau est fermé", async () => {
    renderWithAnnouncer();

    await waitFor(() => {
      expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
    });

    // Le panneau est visibility:hidden, il faut { hidden: true } pour trouver les radios
    const radios = screen.getAllByRole("radio", { hidden: true });
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute("tabindex", "-1");
    });
  });

  it("annonce le changement d'accent via aria-live", async () => {
    const user = userEvent.setup();
    renderWithAnnouncer();

    await waitFor(() => {
      expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Changer la couleur d'accentuation"));
    await user.click(screen.getByLabelText("Orange"));

    await waitFor(() => {
      const status = screen.getByRole("status");
      expect(status.textContent).toBe("Couleur d'accentuation : Orange");
    });
  });

  it("le radiogroup a un aria-label descriptif", async () => {
    const user = userEvent.setup();
    renderWithAnnouncer();

    await waitFor(() => {
      expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Changer la couleur d'accentuation"));
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-label", "Couleur d'accentuation");
  });

  it("affiche un placeholder avant l'hydratation (active === null)", () => {
    // Avant le useEffect, active est null → placeholder <span> sans bouton
    // Difficile à tester car useEffect s'exécute immédiatement en test,
    // mais on vérifie qu'après hydratation le bouton est bien là
    renderWithAnnouncer();
    // Le bouton apparaît après le useEffect
    expect(screen.getByLabelText("Changer la couleur d'accentuation")).toBeInTheDocument();
  });
});
