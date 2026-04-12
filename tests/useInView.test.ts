import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInView } from "@/hooks/useInView";

let observerCallback: IntersectionObserverCallback;
let observerOptions: IntersectionObserverInit | undefined;
const mockDisconnect = vi.fn();
const mockObserve = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal(
    "IntersectionObserver",
    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        observerCallback = callback;
        observerOptions = options;
      }
      observe = mockObserve;
      disconnect = mockDisconnect;
      unobserve = vi.fn();
    },
  );
});

function triggerIntersection(isIntersecting: boolean, ratio = 1) {
  act(() => {
    observerCallback(
      [{ isIntersecting, intersectionRatio: ratio } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
}

describe("useInView", () => {
  it("retourne false initialement", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useInView(ref));
    expect(result.current).toBe(false);
  });

  it("retourne true quand l'élément est visible", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useInView(ref));

    triggerIntersection(true);
    expect(result.current).toBe(true);
  });

  it("se déconnecte après la première intersection en mode once (défaut)", () => {
    const ref = { current: document.createElement("div") };
    renderHook(() => useInView(ref));

    triggerIntersection(true);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it("ne se déconnecte pas en mode once=false", () => {
    const ref = { current: document.createElement("div") };
    renderHook(() => useInView(ref, { once: false }));

    triggerIntersection(true);
    expect(mockDisconnect).not.toHaveBeenCalled();
  });

  it("repasse à false quand l'élément sort du viewport en mode once=false", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useInView(ref, { once: false }));

    triggerIntersection(true);
    expect(result.current).toBe(true);

    triggerIntersection(false);
    expect(result.current).toBe(false);
  });

  it("utilise le threshold par défaut de 0.3", () => {
    const ref = { current: document.createElement("div") };
    renderHook(() => useInView(ref));
    expect(observerOptions?.threshold).toBe(0.3);
  });

  it("accepte un threshold custom via amount", () => {
    const ref = { current: document.createElement("div") };
    renderHook(() => useInView(ref, { amount: 0.8 }));
    expect(observerOptions?.threshold).toBe(0.8);
  });

  it("n'observe pas si la ref est null", () => {
    const ref = { current: null };
    renderHook(() => useInView(ref));
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it("se nettoie au démontage", () => {
    const ref = { current: document.createElement("div") };
    const { unmount } = renderHook(() => useInView(ref));
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
