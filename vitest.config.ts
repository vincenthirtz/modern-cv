import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      // Scope volontairement restreint à ce qui est testable en unitaire :
      // logique pure (lib/), hooks, et composants interactifs avec état.
      // Les composants purement présentationnels (Hero, About, Projects,
      // BrandingGrid, etc.) sont validés par Playwright e2e + axe-core,
      // pas par des tests unitaires — les inclure ferait baisser la
      // couverture sans valeur ajoutée.
      include: [
        "lib/**/*.{ts,tsx}",
        "hooks/**/*.{ts,tsx}",
        "components/A11yAnnouncer.tsx",
        "components/AccentPicker.tsx",
        "components/AnimatedText.tsx",
        "components/BackToTopButton.tsx",
        "components/CopyButton.tsx",
        "components/Counter.tsx",
        "components/FooterClock.tsx",
        "components/JsonLd.tsx",
        "components/LikeButton.tsx",
        "components/Marquee.tsx",
        "components/NotesFilters.tsx",
        "components/ReadingProgress.tsx",
        "components/ScrollReset.tsx",
        "components/SectionTitle.tsx",
        "components/ServiceWorkerRegister.tsx",
        "components/ShareButtons.tsx",
        "components/TableOfContents.tsx",
        "components/ThemeToggle.tsx",
      ],
      exclude: [
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "lib/articles/index.ts",
        "lib/articles/stats.generated.ts",
        "lib/env.ts",
        "**/node_modules/**",
      ],
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 75,
        branches: 75,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
