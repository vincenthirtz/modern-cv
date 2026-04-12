import { z } from "zod";

/**
 * Validation des variables d'environnement au démarrage.
 *
 * Les variables optionnelles ont des valeurs par défaut.
 * Les variables obligatoires en production (NETLIFY) ne sont pas requises
 * en dev — on valide uniquement le format quand elles sont présentes.
 */

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  /** Présent automatiquement sur Netlify — active Netlify Blobs pour les likes */
  NETLIFY: z.string().optional(),
  /** Active le bundle analyzer (npm run analyze) */
  ANALYZE: z.string().optional(),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("Variables d'environnement invalides :", parsed.error.format());
    throw new Error("Variables d'environnement invalides");
  }

  return parsed.data;
}

export const env = validateEnv();
