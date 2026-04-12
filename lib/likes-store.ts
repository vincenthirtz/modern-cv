import { getStore } from "@netlify/blobs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { env } from "@/lib/env";

/**
 * Store persistant pour les likes d'articles.
 *
 * - **Netlify (production)** : utilise Netlify Blobs (détecté automatiquement
 *   via la variable d'environnement NETLIFY). Persistant, gratuit, sans config.
 * - **Local (dev)** : fichier JSON dans data/likes.json.
 */

const isNetlify = !!env.NETLIFY;

// ---------------------------------------------------------------------------
// Netlify Blobs
// ---------------------------------------------------------------------------

const STORE_NAME = "likes";
const BLOB_KEY = "counts";

async function getNetlifyLikes(): Promise<Record<string, number>> {
  const store = getStore(STORE_NAME);
  const raw = await store.get(BLOB_KEY, { type: "text" });
  if (!raw) return {};
  return JSON.parse(raw) as Record<string, number>;
}

async function setNetlifyLikes(data: Record<string, number>): Promise<void> {
  const store = getStore(STORE_NAME);
  await store.set(BLOB_KEY, JSON.stringify(data));
}

// ---------------------------------------------------------------------------
// Fichier local (dev)
// ---------------------------------------------------------------------------

const DATA_DIR = join(process.cwd(), "data");
const LIKES_FILE = join(DATA_DIR, "likes.json");

async function getLocalLikes(): Promise<Record<string, number>> {
  try {
    const raw = await readFile(LIKES_FILE, "utf-8");
    return JSON.parse(raw) as Record<string, number>;
  } catch {
    return {};
  }
}

async function setLocalLikes(data: Record<string, number>): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(LIKES_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ---------------------------------------------------------------------------
// API publique
// ---------------------------------------------------------------------------

async function readAll(): Promise<Record<string, number>> {
  return isNetlify ? getNetlifyLikes() : getLocalLikes();
}

async function writeAll(data: Record<string, number>): Promise<void> {
  return isNetlify ? setNetlifyLikes(data) : setLocalLikes(data);
}

export async function getLikes(slug: string): Promise<number> {
  const data = await readAll();
  return data[slug] ?? 0;
}

export async function incrementLikes(slug: string): Promise<number> {
  const data = await readAll();
  const next = (data[slug] ?? 0) + 1;
  data[slug] = next;
  await writeAll(data);
  return next;
}
