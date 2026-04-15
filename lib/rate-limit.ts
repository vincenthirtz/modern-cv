import type { NextRequest } from "next/server";

/**
 * Rate limit en mémoire par IP, fenêtre glissante.
 *
 * Limite : stockage volatile (reset au redéploiement, non partagé entre
 * instances serverless). Suffisant pour freiner un abus basique sur une
 * route non critique. Pour du multi-instance, passer sur Upstash/Redis.
 */

type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfter: number;
}

export function rateLimit(
  request: NextRequest,
  { limit, windowMs, key }: { limit: number; windowMs: number; key?: string },
): RateLimitResult {
  const ip = getClientIp(request);
  const id = key ? `${key}:${ip}` : ip;
  const now = Date.now();
  const bucket = buckets.get(id) ?? { hits: [] };

  bucket.hits = bucket.hits.filter((ts) => now - ts < windowMs);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0];
    const retryAfter = Math.ceil((windowMs - (now - oldest)) / 1000);
    buckets.set(id, bucket);
    return { ok: false, remaining: 0, retryAfter };
  }

  bucket.hits.push(now);
  buckets.set(id, bucket);

  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) {
      if (b.hits.length === 0 || now - b.hits[b.hits.length - 1] > windowMs) {
        buckets.delete(k);
      }
    }
  }

  return { ok: true, remaining: limit - bucket.hits.length, retryAfter: 0 };
}
