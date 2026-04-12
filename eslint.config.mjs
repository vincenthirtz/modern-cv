import nextConfig from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";
import tsPlugin from "@typescript-eslint/eslint-plugin";

const config = [
  { ignores: [".history/", ".next/", "node_modules/"] },
  ...nextConfig,
  prettierConfig,
  {
    rules: {
      // Les setState dans useEffect sont légitimes pour lire localStorage au mount
      // et s'abonner à des événements externes (souris, média queries).
      "react-hooks/set-state-in-effect": "off",
      // Site en français — les apostrophes dans le JSX sont omniprésentes et lisibles.
      "react/no-unescaped-entities": "off",
      // Préférer next/image à <img> (warning, pas bloquant pour les cas légitimes)
      "@next/next/no-img-element": "warn",
      // Pas d'accolades inutiles dans le JSX
      "react/jsx-curly-brace-presence": ["warn", { props: "never", children: "never" }],
      // Balises auto-fermantes quand pas d'enfants
      "react/self-closing-comp": "warn",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      // Variables inutilisées : warning sauf préfixe _
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Imports de type explicites (import type { ... })
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  },
];

export default config;
