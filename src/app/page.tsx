import type React from "react";

export default function Home(): React.ReactNode {
  return (
    <>
      <section id="hero" className="scroll-mt-20 min-h-screen">
        <h2 className="sr-only">Hero</h2>
      </section>
      <section id="experience" className="scroll-mt-20 min-h-screen px-4 py-16">
        <h2 className="text-xl font-semibold">Experience</h2>
      </section>
      <section id="skills" className="scroll-mt-20 min-h-screen px-4 py-16">
        <h2 className="text-xl font-semibold">Skills</h2>
      </section>
      <section id="contact" className="scroll-mt-20 min-h-screen px-4 py-16">
        <h2 className="text-xl font-semibold">Contact</h2>
      </section>
    </>
  );
}
