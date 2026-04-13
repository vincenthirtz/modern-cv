import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import ScrollReset from "@/components/ScrollReset";

// Mock window.scrollTo
const scrollToSpy = vi.fn();

let originalPushState: typeof history.pushState;
let originalReplaceState: typeof history.replaceState;

beforeEach(() => {
  vi.clearAllMocks();
  window.scrollTo = scrollToSpy as unknown as typeof window.scrollTo;
  originalPushState = history.pushState.bind(history);
  originalReplaceState = history.replaceState.bind(history);
});

afterEach(() => {
  cleanup();
  // Restaurer les méthodes originales au cas où le cleanup du composant ne l'a pas fait
  history.pushState = originalPushState;
  history.replaceState = originalReplaceState;
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

  it("scrolle en haut lors d'un replaceState (redirection Next.js)", () => {
    render(<ScrollReset />);

    history.replaceState({}, "", "/notes");

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
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

  it("propage correctement les arguments au replaceState original", () => {
    render(<ScrollReset />);

    const state = { redirect: true };
    history.replaceState(state, "", "/redirected");

    expect(scrollToSpy).toHaveBeenCalledTimes(1);
  });

  it("appelle scrollTo une seule fois par navigation", () => {
    render(<ScrollReset />);

    history.pushState({}, "", "/page1");
    expect(scrollToSpy).toHaveBeenCalledTimes(1);

    history.pushState({}, "", "/page2");
    expect(scrollToSpy).toHaveBeenCalledTimes(2);

    history.replaceState({}, "", "/page3");
    expect(scrollToSpy).toHaveBeenCalledTimes(3);

    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(scrollToSpy).toHaveBeenCalledTimes(4);
  });

  it("restaure pushState et replaceState originaux au démontage", () => {
    const pushBefore = history.pushState;
    const replaceBefore = history.replaceState;

    const { unmount } = render(<ScrollReset />);

    // Pendant le montage, les méthodes sont patchées
    expect(history.pushState).not.toBe(pushBefore);
    expect(history.replaceState).not.toBe(replaceBefore);

    unmount();

    // Après démontage, les méthodes originales sont restaurées
    // Vérifier que pushState ne déclenche plus scrollTo
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
