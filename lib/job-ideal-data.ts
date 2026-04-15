/**
 * Données statiques de la page Job idéal — séparées du rendu pour
 * permettre l'édition rapide des critères sans toucher aux composants.
 */

export interface CriteriaItem {
  icon: string;
  title: string;
  description: string;
}

export interface IconLabel {
  icon: string;
  label: string;
}

export interface HybridSkill {
  title: string;
  description: string;
}

export const CRITERIA: CriteriaItem[] = [
  {
    icon: "◆",
    title: "Produit ambitieux",
    description:
      "Un produit à forte valeur ajoutée, avec de vrais enjeux techniques — pas du CRUD habillé en SaaS. Je veux résoudre des problèmes complexes qui ont un impact concret sur les utilisateurs.",
  },
  {
    icon: "▲",
    title: "Autonomie & confiance",
    description:
      "La liberté de proposer des solutions, de challenger les choix et de porter la vision technique. Un environnement où le Lead n'est pas juste un dev senior qui fait des code reviews.",
  },
  {
    icon: "✦",
    title: "Stack moderne",
    description:
      "TypeScript, React/Vue/Svelte, testing solide, CI/CD, design system. Je veux travailler avec des outils qui permettent d'aller vite sans sacrifier la qualité.",
  },
  {
    icon: "●",
    title: "Culture technique forte",
    description:
      "Des pairs de qualité, du pair programming, des tech talks internes, du temps pour la veille. L'excellence technique n'est pas un luxe, c'est un investissement.",
  },
  {
    icon: "◇",
    title: "Équipe à taille humaine",
    description:
      "Une équipe front de 3 à 8 personnes où je peux avoir un vrai impact sur la montée en compétences, l'architecture et les process. Pas un rouage dans une machine de 200 devs.",
  },
  {
    icon: "▶",
    title: "Équilibre & flexibilité",
    description:
      "Télétravail hybride ou full remote, horaires flexibles, pas de présentéisme. La confiance se mesure aux résultats, pas aux heures de chaise.",
  },
];

export const DEALBREAKERS: IconLabel[] = [
  { icon: "✕", label: "Micro-management" },
  { icon: "✕", label: "Zéro tests en prod" },
  { icon: "✕", label: "Legacy sans roadmap de modernisation" },
  { icon: "✕", label: '"On a toujours fait comme ça"' },
  { icon: "✕", label: "Pas de budget formation / veille" },
];

export const BONUS: IconLabel[] = [
  { icon: "♥", label: "Open source encouragé" },
  { icon: "♥", label: "Conférences & meetups sponsorisés" },
  { icon: "♥", label: "Side projects tolérés" },
  { icon: "♥", label: "Impact social ou environnemental" },
  { icon: "♥", label: "Lyon ou full remote" },
];

export const HYBRID_SKILLS: string[] = [
  "Design Systems",
  "Figma → Code",
  "Design Tokens",
  "Prototypage",
  "Micro-interactions",
  "Motion design",
  "WCAG 2.2 AA",
  "Typographie",
  "Responsive & fluid design",
  "User research",
  "Wireframing",
  "Tests d'usabilité",
];

export const UI_SKILLS: HybridSkill[] = [
  {
    title: "Design systems & tokens",
    description:
      "Mise en place de systèmes cohérents (Figma + code), tokens CSS, thématisation, dark mode et accent colors. De la variable Figma au composant React.",
  },
  {
    title: "Micro-interactions & motion",
    description:
      "Animations CSS pures, IntersectionObserver, transitions fluides. Le détail qui transforme une interface correcte en interface mémorable.",
  },
  {
    title: "Typographie & hiérarchie",
    description:
      "Choix de fontes, rythme vertical, contraste, lisibilité. Une bonne typo, c'est 50 % du design réussi — et trop souvent négligé par les devs.",
  },
  {
    title: "Figma → Code fidèle",
    description:
      "Je lis un Figma comme je lis du code : je sais ce qui est un token, ce qui est une exception, et ce qui mérite d'être challengé avant l'intégration.",
  },
];

export const UX_SKILLS: HybridSkill[] = [
  {
    title: "Parcours & wireframes",
    description:
      "Avant de coder, je réfléchis au parcours. Storyboard, wireframes basse-fi, validation des flows. Éviter de construire la mauvaise chose proprement.",
  },
  {
    title: "Accessibilité (WCAG 2.2 AA)",
    description:
      "Focus management, sémantique HTML, ARIA, lecteurs d'écran. L'accessibilité n'est pas une option, c'est un pilier de l'UX — et de la qualité front.",
  },
  {
    title: "Tests d'usabilité & itération",
    description:
      "Observer de vrais utilisateurs, mesurer ce qui coince, itérer. La donnée bat l'intuition, surtout pour les parcours critiques.",
  },
  {
    title: "Dialogue designer ↔ dev",
    description:
      "Je parle les deux langues. Je challenge un design avec les bons arguments tech, et je défends un choix UX face à une contrainte technique.",
  },
];
