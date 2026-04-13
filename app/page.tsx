import type { Metadata } from "next";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Expertise from "@/components/Expertise";

export const metadata: Metadata = {
  title: "Vincent Hirtz — Lead Developer Front-End à Lyon | Portfolio",
  description:
    "Portfolio de Vincent Hirtz, Lead Developer Front-End basé à Lyon. Créateur de Pulse JS Framework. Découvrez mes projets, mon expertise React, Vue, TypeScript et mon parcours.",
  alternates: { canonical: "https://vincenthirtz.fr" },
};

export default function Home() {
  return (
    <main id="main" className="relative z-[2]">
      <Hero />
      <About />
      <Expertise />
    </main>
  );
}
