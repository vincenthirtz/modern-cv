import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LikeButton from "@/components/LikeButton";

const mockStorage = new Map<string, string>();

beforeEach(() => {
  mockStorage.clear();
  vi.restoreAllMocks();

  vi.stubGlobal("localStorage", {
    getItem: (key: string) => mockStorage.get(key) ?? null,
    setItem: (key: string, value: string) => mockStorage.set(key, value),
    removeItem: (key: string) => mockStorage.delete(key),
  });

  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation((url: string, options?: RequestInit) => {
      const isPost = options?.method === "POST";
      return Promise.resolve({
        json: () => Promise.resolve({ likes: isPost ? 6 : 5 }),
        ok: true,
      });
    }),
  );
});

describe("LikeButton", () => {
  it("affiche le compteur de likes depuis l'API", async () => {
    render(<LikeButton slug="test-article" />);

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });

  it("a le bon aria-label avant le like", async () => {
    render(<LikeButton slug="test-article" />);

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Aimer cet article (5)");
    });
  });

  it("incrémente le compteur au clic", async () => {
    const user = userEvent.setup();
    render(<LikeButton slug="test-article" />);

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("désactive le bouton après le like", async () => {
    const user = userEvent.setup();
    render(<LikeButton slug="test-article" />);

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("persiste le like dans localStorage", async () => {
    const user = userEvent.setup();
    render(<LikeButton slug="mon-article" />);

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button"));
    expect(mockStorage.get("liked:mon-article")).toBe("1");
  });

  it("est désactivé si déjà liké (localStorage)", async () => {
    mockStorage.set("liked:test-article", "1");
    render(<LikeButton slug="test-article" />);

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  it("met à jour l'aria-label après le like", async () => {
    const user = userEvent.setup();
    render(<LikeButton slug="test-article" />);

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        expect.stringContaining("Vous avez aimé"),
      );
    });
  });

  it("envoie un POST à l'API au clic", async () => {
    const user = userEvent.setup();
    render(<LikeButton slug="test-article" />);

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button"));

    expect(fetch).toHaveBeenCalledWith("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "test-article" }),
    });
  });

  it("ne double-like pas au double clic", async () => {
    const user = userEvent.setup();
    render(<LikeButton slug="test-article" />);

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button"));
    // Le bouton est disabled, le second clic ne fait rien
    expect(screen.getByText("6")).toBeInTheDocument();
  });
});
