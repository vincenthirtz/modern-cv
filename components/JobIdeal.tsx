import SectionTitle from "./SectionTitle";
import JobSkillsTags from "./job-ideal/JobSkillsTags";
import JobCriteriaGrid from "./job-ideal/JobCriteriaGrid";
import JobHybridSkills from "./job-ideal/JobHybridSkills";
import JobIconList from "./job-ideal/JobIconList";
import JobCTA from "./job-ideal/JobCTA";
import { BONUS, DEALBREAKERS } from "@/lib/job-ideal-data";

/**
 * Page "Mon job idéal" — orchestrateur. Chaque section vit dans son
 * propre fichier sous job-ideal/ et gère sa propre animation au scroll.
 */
export default function JobIdeal() {
  return (
    <section className="relative scroll-mt-32">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          number="01"
          label="Mon job idéal"
          title="Ce que je cherche vraiment."
          highlight="vraiment"
          description="Après 10+ ans dans le front-end, je sais ce qui me fait avancer — et ce qui me freine. Voici ce que je recherche dans mon prochain poste de Lead Developer."
          bigSymbol="~/"
        />

        <JobSkillsTags />
        <JobCriteriaGrid />
        <JobHybridSkills />

        <div className="mt-24 grid gap-16 md:grid-cols-2">
          <JobIconList title="Rédhibitoire" symbol="✕" tone="red" items={DEALBREAKERS} />
          <JobIconList title="Gros bonus" symbol="♥" tone="accent" items={BONUS} delay={0.15} />
        </div>

        <JobCTA />
      </div>
    </section>
  );
}
