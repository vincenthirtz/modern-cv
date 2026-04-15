import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Crée un faux NextRequest avec juste les headers utilisés par rateLimit().
 * Évite d'importer next/server (lourd, pas dispo en jsdom sans setup).
 */
function makeReq(ip: string, headerName = "x-forwarded-for") {
  return {
    headers: {
      get(name: string) {
        return name.toLowerCase() === headerName ? ip : null;
      },
    },
  } as unknown as Parameters<typeof rateLimit>[0];
}

describe("lib/rate-limit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("autorise jusqu'à `limit` requêtes dans la fenêtre", () => {
    const req = makeReq("1.1.1.1");
    for (let i = 0; i < 3; i++) {
      const r = rateLimit(req, { limit: 3, windowMs: 1000, key: "t1" });
      expect(r.ok).toBe(true);
      expect(r.remaining).toBe(2 - i);
    }
  });

  it("bloque la requête au-delà du seuil et retourne retryAfter", () => {
    const req = makeReq("2.2.2.2");
    for (let i = 0; i < 3; i++) {
      rateLimit(req, { limit: 3, windowMs: 5000, key: "t2" });
    }
    const blocked = rateLimit(req, { limit: 3, windowMs: 5000, key: "t2" });
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(5);
  });

  it("réinitialise après la fenêtre glissante", () => {
    const req = makeReq("3.3.3.3");
    for (let i = 0; i < 2; i++) rateLimit(req, { limit: 2, windowMs: 1000, key: "t3" });
    expect(rateLimit(req, { limit: 2, windowMs: 1000, key: "t3" }).ok).toBe(false);

    vi.advanceTimersByTime(1100);
    expect(rateLimit(req, { limit: 2, windowMs: 1000, key: "t3" }).ok).toBe(true);
  });

  it("isole les buckets par IP", () => {
    const a = makeReq("4.4.4.4");
    const b = makeReq("5.5.5.5");
    rateLimit(a, { limit: 1, windowMs: 1000, key: "t4" });
    expect(rateLimit(a, { limit: 1, windowMs: 1000, key: "t4" }).ok).toBe(false);
    expect(rateLimit(b, { limit: 1, windowMs: 1000, key: "t4" }).ok).toBe(true);
  });

  it("isole les buckets par key", () => {
    const req = makeReq("6.6.6.6");
    rateLimit(req, { limit: 1, windowMs: 1000, key: "alpha" });
    expect(rateLimit(req, { limit: 1, windowMs: 1000, key: "alpha" }).ok).toBe(false);
    expect(rateLimit(req, { limit: 1, windowMs: 1000, key: "beta" }).ok).toBe(true);
  });

  it("utilise x-real-ip en fallback si x-forwarded-for absent", () => {
    const req = makeReq("7.7.7.7", "x-real-ip");
    const r = rateLimit(req, { limit: 1, windowMs: 1000, key: "t6" });
    expect(r.ok).toBe(true);
    expect(rateLimit(req, { limit: 1, windowMs: 1000, key: "t6" }).ok).toBe(false);
  });

  it("retombe sur 'unknown' si aucun header IP", () => {
    const req = { headers: { get: () => null } } as unknown as Parameters<typeof rateLimit>[0];
    const r = rateLimit(req, { limit: 1, windowMs: 1000, key: "t7" });
    expect(r.ok).toBe(true);
  });

  it("déclenche le GC des buckets expirés quand le Map dépasse 10 000 entrées", () => {
    // Génère 10_001 IPs distinctes : le 10_001ᵉ hit doit traverser la branche GC
    // (ligne 48-53) qui nettoie les buckets dont la fenêtre est expirée.
    for (let i = 0; i < 10_000; i++) {
      rateLimit(makeReq(`10.0.${(i >> 8) & 0xff}.${i & 0xff}`), {
        limit: 5,
        windowMs: 100,
        key: "gc",
      });
    }
    // Avance au-delà de la fenêtre pour rendre tous les buckets expirés
    vi.advanceTimersByTime(500);
    // Le 10_001ᵉ hit franchit le seuil 10_000 et déclenche le GC
    const r = rateLimit(makeReq("255.255.255.255"), { limit: 5, windowMs: 100, key: "gc" });
    expect(r.ok).toBe(true);
  });

  it("ne prend que la première IP de x-forwarded-for", () => {
    const req = makeReq("8.8.8.8, 9.9.9.9, 10.10.10.10");
    rateLimit(req, { limit: 1, windowMs: 1000, key: "t8" });
    // Une seconde requête depuis la même chaîne hits le même bucket
    expect(rateLimit(req, { limit: 1, windowMs: 1000, key: "t8" }).ok).toBe(false);
    // Mais l'IP isolée 9.9.9.9 a son propre bucket
    expect(rateLimit(makeReq("9.9.9.9"), { limit: 1, windowMs: 1000, key: "t8" }).ok).toBe(true);
  });
});
