import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import FooterClock from "@/components/FooterClock";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-04-14T10:30:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("FooterClock", () => {
  it("affiche l'heure formatée fr-FR sur Europe/Paris", () => {
    render(<FooterClock />);
    // 10:30 UTC -> 12:30 Paris (heure d'été)
    expect(screen.getByText(/— 12:30/)).toBeInTheDocument();
  });

  it("rend un élément <time> avec dateTime ISO", () => {
    render(<FooterClock />);
    const el = screen.getByText(/— /).closest("time");
    expect(el).not.toBeNull();
    expect(el!.getAttribute("datetime")).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("met à jour l'heure toutes les 30 secondes", () => {
    render(<FooterClock />);
    expect(screen.getByText(/— 12:30/)).toBeInTheDocument();

    act(() => {
      vi.setSystemTime(new Date("2026-04-14T10:35:00Z"));
      vi.advanceTimersByTime(30_000);
    });

    expect(screen.getByText(/— 12:35/)).toBeInTheDocument();
  });
});
