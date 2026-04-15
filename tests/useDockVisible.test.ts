import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDockVisible } from "@/hooks/useDockVisible";

const STORAGE_KEY = "dock-visible";

describe("useDockVisible", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retourne la valeur initiale par défaut (true)", () => {
    const { result } = renderHook(() => useDockVisible());
    expect(result.current[0]).toBe(true);
  });

  it("respecte la valeur initiale custom", () => {
    const { result } = renderHook(() => useDockVisible(false));
    expect(result.current[0]).toBe(false);
  });

  it("hydrate l'état depuis localStorage quand la clé vaut 'false'", () => {
    localStorage.setItem(STORAGE_KEY, "false");
    const { result } = renderHook(() => useDockVisible(true));
    expect(result.current[0]).toBe(false);
  });

  it("ignore localStorage quand la clé vaut 'true' (garde l'initial)", () => {
    localStorage.setItem(STORAGE_KEY, "true");
    const { result } = renderHook(() => useDockVisible(true));
    expect(result.current[0]).toBe(true);
  });

  it("toggle bascule l'état et le persiste dans localStorage", () => {
    const { result } = renderHook(() => useDockVisible(true));

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe("false");

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe("true");
  });

  it("survit à un localStorage indisponible (try/catch)", () => {
    const getSpy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const setSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    const { result } = renderHook(() => useDockVisible(true));
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(false);

    getSpy.mockRestore();
    setSpy.mockRestore();
  });

  it("fournit une référence de toggle stable entre renders", () => {
    const { result, rerender } = renderHook(() => useDockVisible());
    const firstToggle = result.current[1];
    rerender();
    expect(result.current[1]).toBe(firstToggle);
  });
});
