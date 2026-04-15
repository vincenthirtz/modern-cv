import { describe, it, expect, vi, beforeEach } from "vitest";

// Force le chemin "local" (pas Netlify)
vi.mock("@/lib/env", () => ({ env: { NETLIFY: undefined } }));

const files = new Map<string, string>();

const fsMock = {
  readFile: vi.fn(async (path: string) => {
    if (!files.has(path)) {
      const err = new Error("ENOENT") as NodeJS.ErrnoException;
      err.code = "ENOENT";
      throw err;
    }
    return files.get(path)!;
  }),
  writeFile: vi.fn(async (path: string, data: string) => {
    files.set(path, data);
  }),
  mkdir: vi.fn(async () => undefined),
};

vi.mock("node:fs/promises", () => ({ ...fsMock, default: fsMock }));

beforeEach(() => {
  files.clear();
  vi.resetModules();
});

describe("lib/likes-store (local FS)", () => {
  it("retourne 0 pour un slug inconnu quand le fichier n'existe pas", async () => {
    const { getLikes } = await import("@/lib/likes-store");
    expect(await getLikes("absent")).toBe(0);
  });

  it("incrémente à partir de 0 et persiste", async () => {
    const { incrementLikes, getLikes } = await import("@/lib/likes-store");
    expect(await incrementLikes("foo")).toBe(1);
    expect(await incrementLikes("foo")).toBe(2);
    expect(await getLikes("foo")).toBe(2);
  });

  it("incrémente plusieurs slugs indépendamment", async () => {
    const { incrementLikes, getLikes } = await import("@/lib/likes-store");
    await incrementLikes("a");
    await incrementLikes("b");
    await incrementLikes("b");
    expect(await getLikes("a")).toBe(1);
    expect(await getLikes("b")).toBe(2);
  });

  it("crée le répertoire data avant d'écrire", async () => {
    const { incrementLikes } = await import("@/lib/likes-store");
    await incrementLikes("slug");
    expect(fsMock.mkdir).toHaveBeenCalled();
  });
});
