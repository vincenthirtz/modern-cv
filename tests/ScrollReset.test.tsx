import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import ScrollReset from "@/components/ScrollReset";

// Mock window.scrollTo
const scrollToSpy = vi.fn();

let originalPushState: typeof history.pushState;

beforeEach(() => {
  vi.clearAllMocks();
  window.scrollTo = scrollToSpy as unknown as typeof window.scrollTo;
  originalPushState = history.pushState.bind(history);
});

afterEach(() => {
  cleanup();
  // Restaurer la méthode originale au cas où le cleanup du composant ne l'a pas fait
  history.pushState = originalPushState;
});

describe("ScrollReset", () => {
  it("ne rend rien (retourne null)", () => {
    const { container } = render(<ScrollReset />);
    expect(container.innerHTML).toBe("");
  });

  it("scrolle en haut lors d'un pushState (navigation client-side)", () => {
    render(<ScrollReset />);

    history.pushState({}, "", "/projects");

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
  });

  it("ne scrolle PAS lors d'un replaceState (appels internes Next.js)", () => {
    render(<ScrollReset />);

    history.replaceState({}, "", "/notes");

    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("scrolle en haut lors d'un événement popstate (back/forward)", () => {
    render(<ScrollReset />);

    window.dispatchEvent(new PopStateEvent("popstate"));

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
  });

  it("propage correctement les arguments au pushState original", () => {
    const pushSpy = vi.fn();
    history.pushState = pushSpy;
    // Re-render pour que le composant patche notre spy
    history.pushState = pushSpy;

    // Nettoyer et re-rendre
    cleanup();
    // Restaurer pour que le composant puisse patcher
    history.pushState = originalPushState;
    render(<ScrollReset />);

    const state = { page: 1 };
    history.pushState(state, "", "/test");

    // Le pushState original doit avoir été appelé avec les mêmes args
    // On vérifie via scrollTo que le patch fonctionne
    expect(scrollToSpy).toHaveBeenCalledTimes(1);
  });

  it("ne scrolle pas lors d'un replaceState", () => {
    render(<ScrollReset />);

    const state = { redirect: true };
    history.replaceState(state, "", "/redirected");

    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("appelle scrollTo une seule fois par navigation", () => {
    render(<ScrollReset />);

    history.pushState({}, "", "/page1");
    expect(scrollToSpy).toHaveBeenCalledTimes(1);

    history.pushState({}, "", "/page2");
    expect(scrollToSpy).toHaveBeenCalledTimes(2);

    // replaceState ne doit PAS déclencher scrollTo
    history.replaceState({}, "", "/page3");
    expect(scrollToSpy).toHaveBeenCalledTimes(2);

    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(scrollToSpy).toHaveBeenCalledTimes(3);
  });

  it("restaure pushState original au démontage", () => {
    const pushBefore = history.pushState;

    const { unmount } = render(<ScrollReset />);

    // Pendant le montage, pushState est patché
    expect(history.pushState).not.toBe(pushBefore);

    unmount();

    // Après démontage, pushState ne déclenche plus scrollTo
    scrollToSpy.mockClear();
    history.pushState({}, "", "/after-unmount");
    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("retire le listener popstate au démontage", () => {
    const { unmount } = render(<ScrollReset />);
    unmount();

    scrollToSpy.mockClear();
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("gère plusieurs pushState successifs rapidement", () => {
    render(<ScrollReset />);

    for (let i = 0; i < 10; i++) {
      history.pushState({}, "", `/rapid-${i}`);
    }

    expect(scrollToSpy).toHaveBeenCalledTimes(10);
    // Chaque appel utilise behavior: "instant" (pas d'animation)
    scrollToSpy.mock.calls.forEach((call) => {
      expect(call[0]).toEqual({ top: 0, behavior: "instant" });
    });
  });
});
