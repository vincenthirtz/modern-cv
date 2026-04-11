/// <reference lib="webworker" />

/**
 * Service Worker — PWA offline pour vincenthirtz.fr
 *
 * Stratégies :
 *  - App Shell (/, /notes, /cv) : stale-while-revalidate
 *  - Articles (/notes/*) : cache-first (articles déjà lus disponibles offline)
 *  - Polices & assets statiques : cache-first, longue durée
 *  - API & autres : network-only (pas de cache)
 */

const CACHE_VERSION = "v1";
const SHELL_CACHE = `shell-${CACHE_VERSION}`;
const ARTICLES_CACHE = `articles-${CACHE_VERSION}`;
const ASSETS_CACHE = `assets-${CACHE_VERSION}`;

/** Pages pré-cachées à l'installation (app shell). */
const SHELL_URLS = ["/", "/notes", "/cv"];

// ---------------------------------------------------------------------------
// Installation — pré-cache de l'app shell
// ---------------------------------------------------------------------------

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting()),
  );
});

// ---------------------------------------------------------------------------
// Activation — nettoyage des anciens caches
// ---------------------------------------------------------------------------

self.addEventListener("activate", (event) => {
  const currentCaches = new Set([SHELL_CACHE, ARTICLES_CACHE, ASSETS_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names.filter((name) => !currentCaches.has(name)).map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ---------------------------------------------------------------------------
// Fetch — routage par stratégie
// ---------------------------------------------------------------------------

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET et les URLs externes
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // API — toujours réseau, pas de cache
  if (url.pathname.startsWith("/api/")) return;

  // Assets statiques (polices, images, CSS, JS) — cache-first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, ASSETS_CACHE));
    return;
  }

  // Articles déjà lus — cache-first avec mise à jour en arrière-plan
  if (url.pathname.startsWith("/notes/") && url.pathname !== "/notes") {
    event.respondWith(staleWhileRevalidate(request, ARTICLES_CACHE));
    return;
  }

  // App shell (/, /notes, /cv) — stale-while-revalidate
  if (isShellUrl(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, SHELL_CACHE));
    return;
  }

  // Next.js data/chunks — cache-first
  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(cacheFirst(request, ASSETS_CACHE));
    return;
  }
});

// ---------------------------------------------------------------------------
// Stratégies de cache
// ---------------------------------------------------------------------------

/**
 * Cache-first : retourne le cache si disponible, sinon fetch et met en cache.
 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline", { status: 503, statusText: "Service Unavailable" });
  }
}

/**
 * Stale-while-revalidate : retourne le cache immédiatement, puis met à jour
 * en arrière-plan pour la prochaine visite.
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isStaticAsset(pathname) {
  return /\.(js|css|woff2?|ttf|otf|svg|png|jpe?g|webp|avif|ico)$/.test(pathname);
}

function isShellUrl(pathname) {
  return pathname === "/" || pathname === "/notes" || pathname === "/cv";
}
