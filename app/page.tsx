import Hero from "@/components/Hero";
import About from "@/components/About";
import Expertise from "@/components/Expertise";

export default function Home() {
  return (
    <main id="main" className="relative z-[2]">
      <Hero />
      <About />
      <Expertise />
    </main>
  );
}
