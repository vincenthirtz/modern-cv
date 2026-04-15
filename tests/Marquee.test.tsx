import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Marquee from "@/components/Marquee";

describe("Marquee", () => {
  it("rend chaque item deux fois (pour le loop CSS)", () => {
    render(<Marquee items={["Un", "Deux", "Trois"]} />);
    expect(screen.getAllByText("Un")).toHaveLength(2);
    expect(screen.getAllByText("Deux")).toHaveLength(2);
    expect(screen.getAllByText("Trois")).toHaveLength(2);
  });

  it("applique la durée d'animation selon la prop speed", () => {
    const { container } = render(<Marquee items={["A"]} speed={60} />);
    const track = container.querySelector(".animate-marquee") as HTMLElement;
    expect(track).not.toBeNull();
    expect(track.style.animationDuration).toBe("60s");
  });

  it("marque le duplicata comme aria-hidden", () => {
    const { container } = render(<Marquee items={["X"]} />);
    const groups = container.querySelectorAll(".animate-marquee > div");
    expect(groups[0].getAttribute("aria-hidden")).toBe("false");
    expect(groups[1].getAttribute("aria-hidden")).toBe("true");
  });

  it("rend le séparateur personnalisé", () => {
    render(<Marquee items={["A", "B"]} separator={<span>•</span>} />);
    expect(screen.getAllByText("•").length).toBeGreaterThanOrEqual(2);
  });
});
