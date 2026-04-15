import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import ReadingProgress from "@/components/ReadingProgress";

afterEach(cleanup);

describe("ReadingProgress", () => {
  it("rend une barre fixed avec scaleX(0) au mount", () => {
    const { container } = render(<ReadingProgress />);
    const bar = container.querySelector("div");
    expect(bar).not.toBeNull();
    expect(bar?.style.transform).toBe("scaleX(0)");
    // React rend `aria-hidden` (booléen JSX) en attribut "true"
    expect(bar?.getAttribute("aria-hidden")).toBe("true");
  });

  it("met à jour scaleX au scroll", () => {
    const { container } = render(<ReadingProgress />);
    const bar = container.querySelector("div") as HTMLElement;

    // Simule un document scrollable et un scroll à mi-hauteur
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 500,
      configurable: true,
    });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 2000,
      configurable: true,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      value: 1000,
      configurable: true,
    });

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(bar.style.transform).toBe("scaleX(0.5)");
  });

  it("force scaleX(0) si la page n'est pas scrollable", () => {
    const { container } = render(<ReadingProgress />);
    const bar = container.querySelector("div") as HTMLElement;

    Object.defineProperty(document.documentElement, "scrollTop", { value: 0, configurable: true });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 800,
      configurable: true,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      value: 1000,
      configurable: true,
    });

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(bar.style.transform).toBe("scaleX(0)");
  });
});
