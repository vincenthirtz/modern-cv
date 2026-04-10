/**
 * Calcule le temps de lecture estimé à partir d'un texte brut.
 *
 * @param text - Contenu texte de l'article (HTML/MDX accepté, les balises sont ignorées)
 * @param wordsPerMinute - Vitesse de lecture moyenne (défaut : 230 mots/min)
 * @returns Chaîne formatée, ex: "~5 min"
 */
export function computeReadTime(text: string, wordsPerMinute = 230): string {
  // Retirer les balises HTML/JSX et les blocs de code
  const clean = text
    .replace(/<[^>]+>/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/import\s.*?from\s.*?;/g, "")
    .replace(/export\s.*?=\s*\{[\s\S]*?\};/g, "")
    .replace(/[#*_~\[\](){}|]/g, " ");

  const words = clean.split(/\s+/).filter((w) => w.length > 0);

  const minutes = Math.max(1, Math.ceil(words.length / wordsPerMinute));
  return `~${minutes} min`;
}
