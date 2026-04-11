import withBundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";

/**
 * Headers de sécurité OWASP-friendly. Ils s'appliquent à toutes les routes.
 * Strict-Transport-Security est géré par Vercel automatiquement.
 */
const securityHeaders = [
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
    optimizePackageImports: ["motion", "lenis", "fuse.js"],
  },

  // Formats d'image modernes auto si on ajoute des <Image>
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
