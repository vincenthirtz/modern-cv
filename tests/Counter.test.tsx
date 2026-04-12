import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import Counter from "@/components/Counter";

// Mock useInView pour contrôler la visibilité
let mockInView = false;
vi.mock("@/hooks/useInView", () => ({
  useInView: () => mockInView,
}));

beforeEach(() => {
  mockInView = false;
  vi.restoreAllMocks();
});

describe("Counter", () => {
  it("affiche 0 avant d'entrer dans le viewport", () => {
    render(<Counter to={42} />);
    expect(screen.getByText("0+")).toBeInTheDocument();
  });

  it("affiche le suffix personnalisé", () => {
    render(<Counter to={10} suffix="%" />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("saute directement à la valeur finale si prefers-reduced-motion", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    mockInView = true;

    render(<Counter to={99} />);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("lance l'animation quand l'élément est visible", async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });

    // Mock requestAnimationFrame pour simuler le temps
    let rafCallback: FrameRequestCallback | null = null;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallback = cb;
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    mockInView = true;
    render(<Counter to={100} duration={1000} />);

    // Simuler la fin de l'animation
    if (rafCallback) {
      act(() => {
        rafCallback!(performance.now() + 1001);
      });
    }

    expect(screen.getByText("100+")).toBeInTheDocument();
  });
});
