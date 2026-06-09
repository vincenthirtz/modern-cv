import withBundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy statique.
 *
 * Choix : CSP sans nonce par requête. Un nonce imposait `await headers()` dans
 * le layout racine, ce qui basculait TOUT le site en rendu dynamique (aucune
 * page statique, TTFB élevé, pas de cache CDN). En la rendant statique, toutes
 * les pages redeviennent prérendues et servies depuis le CDN.
 *
 * `script-src 'unsafe-inline'` est nécessaire pour nos scripts inline (theme-flip,
 * patch React 19, dé-enregistrement SW) et ceux injectés par Next.js. On ne peut
 * pas utiliser `'strict-dynamic'` ici : il neutraliserait `'unsafe-inline'` et
 * bloquerait justement ces scripts inline désormais dépourvus de nonce.
 */
function buildCsp() {
  const directives = {
    "default-src": "'self'",
    // 'unsafe-eval' requis en dev pour le HMR / Fast Refresh de Next.
    "script-src": `'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ""}https://gc.zgo.at`,
    "style-src": "'self' 'unsafe-inline'",
    "img-src": "'self' data: blob: https:",
    "font-src": "'self' data:",
    "connect-src": `'self' https://gc.zgo.at https://*.goatcounter.com${isDev ? " ws: wss:" : ""}`,
    "frame-ancestors": "'none'",
    "base-uri": "'self'",
    "form-action": "'self'",
    "object-src": "'none'",
    "media-src": "'self'",
    "manifest-src": "'self'",
    "worker-src": "'self' blob:",
    ...(isDev ? {} : { "upgrade-insecure-requests": "" }),
  };
  return Object.entries(directives)
    .map(([k, v]) => (v ? `${k} ${v}` : k))
    .join("; ");
}

/**
 * Headers de sécurité OWASP-friendly. Ils s'appliquent à toutes les routes.
 * Strict-Transport-Security est géré par l'hébergeur (Netlify) automatiquement.
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: buildCsp() },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permet d'importer des .mdx via @next/mdx
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  // On ne veut pas leak la version Next.js dans les headers
  poweredByHeader: false,
  // Compression gzip côté serveur (Vercel le fait déjà mais utile en standalone)
  compress: true,
  // Pas de source maps en prod par défaut (taille bundle, sécurité)
  productionBrowserSourceMaps: false,

  // Tree-shaking agressif pour les gros packages d'animation
  experimental: {
    optimizePackageImports: ["fuse.js"],
  },

  // Formats d'image modernes auto si on ajoute des <Image>
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Hôtes autorisés pour les images distantes via next/image
    // (Unsplash pour les covers d'articles).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "/**" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Cache long pour les assets statiques
        source: "/(.*)\\.(svg|jpg|jpeg|png|webp|avif|ico|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Le Service Worker doit toujours être re-validé pour détecter les mises à jour
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

// Active l'analyse de bundle quand ANALYZE=true
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// Wrapper MDX (utilise mdx-components.tsx à la racine pour le mapping de composants)
const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withAnalyzer(withMDX(nextConfig));
