import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import A11yAnnouncer, { useAnnounce } from "@/components/A11yAnnouncer";

/** Composant consommateur pour tester le hook useAnnounce */
function AnnounceButton({ message }: { message: string }) {
  const announce = useAnnounce();
  return <button onClick={() => announce(message)}>Annoncer</button>;
}

describe("A11yAnnouncer", () => {
  it("rend la live region avec les bons attributs ARIA", () => {
    render(
      <A11yAnnouncer>
        <span>contenu</span>
      </A11yAnnouncer>,
    );

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-atomic", "true");
  });

  it("rend les enfants", () => {
    render(
      <A11yAnnouncer>
        <span data-testid="child">enfant</span>
      </A11yAnnouncer>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("la live region est vide par défaut", () => {
    render(
      <A11yAnnouncer>
        <span />
      </A11yAnnouncer>,
    );

    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("la live region est visuellement masquée (sr-only)", () => {
    render(
      <A11yAnnouncer>
        <span />
      </A11yAnnouncer>,
    );

    const status = screen.getByRole("status");
    // Vérifie les styles de masquage visuel
    expect(status.style.position).toBe("absolute");
    expect(status.style.overflow).toBe("hidden");
  });

  it("affiche le message après le double-buffer (vide puis remplit)", async () => {
    render(
      <A11yAnnouncer>
        <AnnounceButton message="Navigation vers Projets" />
      </A11yAnnouncer>,
    );

    screen.getByText("Annoncer").click();

    // Le double-buffer vide d'abord puis remplit après 50ms
    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toBe("Navigation vers Projets");
    });
  });

  it("remplace le message précédent par un nouveau", async () => {
    function MultiAnnounce() {
      const announce = useAnnounce();
      return (
        <>
          <button onClick={() => announce("Premier")}>Premier</button>
          <button onClick={() => announce("Deuxième")}>Deuxième</button>
        </>
      );
    }

    render(
      <A11yAnnouncer>
        <MultiAnnounce />
      </A11yAnnouncer>,
    );

    screen.getByText("Premier").click();

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toBe("Premier");
    });

    screen.getByText("Deuxième").click();

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toBe("Deuxième");
    });
  });

  it("gère les appels rapides successifs (seul le dernier survit)", async () => {
    function RapidAnnounce() {
      const announce = useAnnounce();
      return (
        <button
          onClick={() => {
            announce("A");
            announce("B");
            announce("C");
          }}
        >
          Rapid
        </button>
      );
    }

    render(
      <A11yAnnouncer>
        <RapidAnnounce />
      </A11yAnnouncer>,
    );

    screen.getByText("Rapid").click();

    // Seul le dernier message doit apparaître (clearTimeout annule les précédents)
    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toBe("C");
    });
  });

  it("useAnnounce retourne une no-op en dehors du provider", () => {
    function Orphan() {
      const announce = useAnnounce();
      return <button onClick={() => announce("test")}>Orphan</button>;
    }

    // Ne devrait pas planter même sans provider
    render(<Orphan />);
    expect(() => screen.getByText("Orphan").click()).not.toThrow();
  });
});
