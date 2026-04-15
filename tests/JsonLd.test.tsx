import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import JsonLd from "@/components/JsonLd";

afterEach(() => {
  cleanup();
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach((n) => n.remove());
});

describe("JsonLd", () => {
  it("injecte un script JSON-LD dans <head>", () => {
    render(<JsonLd data={{ "@type": "Person", name: "Vincent" }} />);
    const script = document.head.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(JSON.parse(script!.textContent!)).toEqual({ "@type": "Person", name: "Vincent" });
  });

  it("ne rend rien dans le DOM React", () => {
    const { container } = render(<JsonLd data={{ a: 1 }} />);
    expect(container.innerHTML).toBe("");
  });

  it("retire le script au démontage", () => {
    const { unmount } = render(<JsonLd data={{ a: 1 }} />);
    expect(document.head.querySelectorAll('script[type="application/ld+json"]').length).toBe(1);
    unmount();
    expect(document.head.querySelectorAll('script[type="application/ld+json"]').length).toBe(0);
  });

  it("met à jour le script quand les données changent", () => {
    const { rerender } = render(<JsonLd data={{ v: 1 }} />);
    rerender(<JsonLd data={{ v: 2 }} />);
    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(1);
    expect(JSON.parse(scripts[0].textContent!)).toEqual({ v: 2 });
  });
});
