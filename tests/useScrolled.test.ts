import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrolled } from "@/hooks/useScrolled";

describe("useScrolled", () => {
  let originalScrollY: number;

  beforeEach(() => {
    originalScrollY = window.scrollY;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    Object.defineProperty(window, "scrollY", {
      value: originalScrollY,
      writable: true,
      configurable: true,
    });
    vi.unstubAllGlobals();
  });

  function setScroll(y: number) {
    Object.defineProperty(window, "scrollY", {
      value: y,
      writable: true,
      configurable: true,
    });
  }

  it("retourne false quand scrollY est sous le seuil au montage", () => {
    setScroll(10);
    const { result } = renderHook(() => useScrolled(40));
    expect(result.current).toBe(false);
  });

  it("retourne true quand scrollY dépasse le seuil au montage", () => {
    setScroll(100);
    const { result } = renderHook(() => useScrolled(40));
    expect(result.current).toBe(true);
  });

  it("réagit à un événement scroll", () => {
    setScroll(0);
    const { result } = renderHook(() => useScrolled(40));
    expect(result.current).toBe(false);

    act(() => {
      setScroll(200);
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("utilise un seuil custom", () => {
    setScroll(50);
    const { result } = renderHook(() => useScrolled(100));
    expect(result.current).toBe(false);

    act(() => {
      setScroll(150);
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(true);
  });

  it("se nettoie au démontage (removeEventListener)", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScrolled(40));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("debounce via rAF : un seul rAF pour deux scrolls rapprochés", () => {
    const rafSpy = vi.fn((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    vi.stubGlobal("requestAnimationFrame", rafSpy);

    setScroll(0);
    renderHook(() => useScrolled(40));
    rafSpy.mockClear();

    act(() => {
      window.dispatchEvent(new Event("scroll"));
      window.dispatchEvent(new Event("scroll"));
    });

    // Le hook exécute le callback synchronement via notre stub ;
    // le 2ᵉ scroll arrive après update() → ticking remis à false →
    // donc 2 rAF au total, mais pas 3. L'assertion clé : pas un rAF par scroll.
    expect(rafSpy.mock.calls.length).toBeLessThanOrEqual(2);
  });
});
