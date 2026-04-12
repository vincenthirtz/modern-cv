import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccentPicker from "@/components/AccentPicker";
import A11yAnnouncer from "@/components/A11yAnnouncer";

const mockStorage = new Map<string, string>();

beforeEach(() => {
  mockStorage.clear();
  vi.restoreAllMocks();

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
});
