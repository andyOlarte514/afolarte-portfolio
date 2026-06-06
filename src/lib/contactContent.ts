import type { ContactContent } from "@/types/contact";

export const contactContent: ContactContent = {
  headline: "Let's build something great together.",
  pitch:
    "Senior engineer with 10+ years delivering production-grade frontends and full-stack systems. Currently leading at NVIDIA and Mekan. Looking for senior remote roles at international companies where craft and scale matter.",
  location: "Medellín, Colombia",
  availability: "Open to remote opportunities",
  phone: "+57 3013928467",
  links: [
    {
      href: "mailto:andy.olarte514@gmail.com",
      ariaLabel: "Send Andy an email",
      type: "mail",
    },
    {
      href: "https://github.com/andyOlarte514",
      ariaLabel: "Andy's GitHub profile",
      type: "github",
    },
    {
      // TODO: Replace with real LinkedIn URL before shipping
      href: "https://www.linkedin.com/in/andyolarte",
      ariaLabel: "Andy's LinkedIn profile",
      type: "linkedin",
    },
  ],
} as const;
