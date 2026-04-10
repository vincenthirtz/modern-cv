import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Expertise from "@/components/Expertise";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Community from "@/components/Community";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ClientEffects from "@/components/ClientEffects";
import SectionDivider from "@/components/SectionDivider";
import SectionTransition from "@/components/SectionTransition";

export default function Home() {
  return (
    <div>
      {/* Effets globaux — lazy loaded côté client, non bloquants */}
      <ClientEffects />

      <Navigation />

      <main id="main" className="relative z-[2]">
        {/* Hero — pas de transition (déjà animé en entrée + premier rendu) */}
        <Hero />

        <SectionDivider number="01" next="à propos" />
        <SectionTransition>
          <About />
        </SectionTransition>

        <SectionDivider number="02" next="expertise" />
        <SectionTransition>
          <Expertise />
        </SectionTransition>

        <SectionDivider number="03" next="projets" />
        <SectionTransition>
          <Projects />
        </SectionTransition>

        <SectionDivider number="04" next="expérience" />
        <SectionTransition>
          <Experience />
        </SectionTransition>

        <SectionDivider number="05" next="communauté" />
        <SectionTransition>
          <Community />
        </SectionTransition>

        <SectionDivider number="06" next="notes" />
        <SectionTransition>
          <Blog />
        </SectionTransition>

        <SectionDivider number="07" next="contact" />
        <SectionTransition>
          <Contact />
        </SectionTransition>
      </main>

      <Footer />
    </div>
  );
}
