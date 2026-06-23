import type { Metadata } from "next";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Expertise from "@/components/Expertise";

export const metadata: Metadata = {
  title: "Vincent Hirtz — Lead Full-Stack Developer à Lyon | Portfolio",
  description:
    "Portfolio de Vincent Hirtz, Lead Full-Stack Developer basé à Lyon. Du front (React, Vue) au back (Node.js, NestJS, Laravel). Créateur de Pulse JS Framework. Découvrez mes projets et mon parcours.",
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
