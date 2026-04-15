import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware — Content-Security-Policy avec nonce par requête.
 *
 * Pourquoi un nonce ? Le layout injecte plusieurs `<script>` inline
 * (fix React 19 HostHoistable, theme-flip, JSON-LD). Sans nonce, il
 * faudrait `'unsafe-inline'` sur script-src — ce qui annule la moitié
 * de l'intérêt d'une CSP. Avec un nonce régénéré à chaque requête,
 * seuls nos scripts marqués passent, et toute injection XSS est bloquée.
 *
 * Le nonce est propagé à React via le header `x-nonce` que le layout
 * lit avec `headers()`. Next.js ajoute automatiquement ce nonce sur
 * ses scripts framework quand il détecte l'attribut sur la réponse.
 */

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // base64 sans padding, safe pour un attribut HTML
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/=+$/, "");
}

function buildCsp(nonce: string, isDev: boolean): string {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    // Dev : Next utilise eval() pour le HMR et Fast Refresh
    isDev ? "'unsafe-eval'" : "",
    // Fallback pour les navigateurs qui ignorent 'strict-dynamic'
    "https:",
  ].filter(Boolean);

  const connectSrc = [
    "'self'",
    // HMR WebSocket en dev
    isDev ? "ws:" : "",
    isDev ? "wss:" : "",
  ].filter(Boolean);

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": scriptSrc,
    // Tailwind + Next injectent des style="..." inline partout → 'unsafe-inline'
    // inévitable sur style-src (le nonce ne couvre pas les attributs style).
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "font-src": ["'self'", "data:"],
    "connect-src": connectSrc,
    "frame-ancestors": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "object-src": ["'none'"],
    "media-src": ["'self'"],
    "manifest-src": ["'self'"],
    "worker-src": ["'self'", "blob:"],
  };

  if (!isDev) {
    directives["upgrade-insecure-requests"] = [];
  }

  return Object.entries(directives)
    .map(([k, v]) => (v.length ? `${k} ${v.join(" ")}` : k))
    .join("; ");
}

export function middleware(request: NextRequest) {
  const nonce = generateNonce();
  const isDev = process.env.NODE_ENV !== "production";
  const csp = buildCsp(nonce, isDev);

  // Propager le nonce aux Server Components via request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set("content-security-policy", csp);
  return response;
}

export const config = {
  matcher: [
    /*
     * Applique la CSP à toutes les routes sauf :
     * - assets statiques (_next/static, _next/image, favicon, fichiers publics)
     * - routes API (la CSP HTML n'a pas de sens pour du JSON)
     *
     * On garde opengraph-image et twitter-image hors scope (image binaire).
     */
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|manifest.webmanifest|sw.js|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico|woff2|xml|txt|json)).*)",
    },
  ],
};
