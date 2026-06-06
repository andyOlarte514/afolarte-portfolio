import type { HeroContent } from "@/types/hero";

export const heroContent: HeroContent = {
  name: "Andy Francisco Olarte Cardona",
  title: "Senior Frontend / Full-Stack Engineer",
  bio: "10+ years building scalable web applications — currently leading frontend at NVIDIA and Mekan, based in Medellín, Colombia and targeting senior roles at international companies.",
  roles: [
    { company: "NVIDIA", role: "Frontend Lead" },
    { company: "Mekan", role: "Senior Frontend" },
  ],
  ctaLabel: "Get in touch",
  ctaTargetId: "contact",
  photo: {
    alt: "Andy Francisco Olarte Cardona — profile photo",
    initials: "AO",
    src: "/andy-olarte.jpeg",
  },
} as const;
