import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const registerSpy = vi.fn(() => Promise.resolve({} as ServiceWorkerRegistration));

beforeEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe("ServiceWorkerRegister", () => {
  it("ne rend rien (retourne null)", () => {
    vi.stubGlobal("navigator", { ...navigator, serviceWorker: { register: registerSpy } });
    const { container } = render(<ServiceWorkerRegister />);
    expect(container.innerHTML).toBe("");
  });

  it("enregistre le SW en production", () => {
    const originalEnv = process.env.NODE_ENV;
    vi.stubEnv("NODE_ENV", "production");
    vi.stubGlobal("navigator", { ...navigator, serviceWorker: { register: registerSpy } });

    render(<ServiceWorkerRegister />);

    expect(registerSpy).toHaveBeenCalledWith("/sw.js");
    vi.stubEnv("NODE_ENV", originalEnv);
  });

  it("n'enregistre pas le SW en développement", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubGlobal("navigator", { ...navigator, serviceWorker: { register: registerSpy } });

    render(<ServiceWorkerRegister />);

    expect(registerSpy).not.toHaveBeenCalled();
  });

  it("n'enregistre pas le SW si l'API n'est pas disponible", () => {
    vi.stubEnv("NODE_ENV", "production");
    // Simuler un navigateur sans support SW
    const nav = { ...navigator };
    delete (nav as Record<string, unknown>).serviceWorker;
    vi.stubGlobal("navigator", nav);

    render(<ServiceWorkerRegister />);

    expect(registerSpy).not.toHaveBeenCalled();
  });

  it("ne plante pas si l'enregistrement échoue", () => {
    vi.stubEnv("NODE_ENV", "production");
    const failRegister = vi.fn(() => Promise.reject(new Error("SW failed")));
    vi.stubGlobal("navigator", { ...navigator, serviceWorker: { register: failRegister } });

    // Ne doit pas lancer d'erreur non gérée
    expect(() => render(<ServiceWorkerRegister />)).not.toThrow();
  });
});
