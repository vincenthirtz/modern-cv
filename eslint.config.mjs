import nextConfig from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";

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
    },
  },
];

export default config;
