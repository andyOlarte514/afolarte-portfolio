import type React from "react";

import ContactSection from "@/components/organisms/ContactSection";
import ExperienceTimeline from "@/components/organisms/ExperienceTimeline";
import HeroSection from "@/components/organisms/HeroSection";
import SkillsSection from "@/components/organisms/SkillsSection";

export default function Home(): React.ReactNode {
  return (
    <>
      <section id="hero" className="scroll-mt-20 min-h-screen">
        <h2 className="sr-only">Hero</h2>
        <HeroSection />
      </section>
      <section id="experience" className="scroll-mt-20 min-h-screen px-4 py-16">
        <ExperienceTimeline />
      </section>
      <section id="skills" className="scroll-mt-20 min-h-screen px-4 py-16">
        <SkillsSection />
      </section>
      <section id="contact" className="scroll-mt-20 min-h-screen px-4 py-16">
        <h2 className="sr-only">Contact</h2>
        <ContactSection />
      </section>
    </>
  );
}
