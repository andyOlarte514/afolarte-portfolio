import type React from "react";

import { Mail, GitBranch, ExternalLink, MapPin } from "lucide-react";

import { contactContent } from "@/lib/contactContent";
import ContactIconButton from "@/components/atoms/ContactIconButton";

const iconMap: Record<"mail" | "github" | "linkedin", React.ReactNode> = {
  mail: <Mail className="h-5 w-5" />,
  github: <GitBranch className="h-5 w-5" />,
  linkedin: <ExternalLink className="h-5 w-5" />,
};

export default function ContactSection(): React.ReactNode {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <h2 className="text-foreground mb-4 text-3xl font-bold">{contactContent.headline}</h2>
      <p className="text-muted-foreground mb-8 text-base leading-relaxed">{contactContent.pitch}</p>
      <div className="mb-8 flex flex-wrap items-center gap-6">
        <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {contactContent.location}
        </span>
        <span className="text-muted-foreground flex items-center gap-2 text-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
              aria-hidden="true"
            ></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </span>
          {contactContent.availability}
        </span>
      </div>
      <div className="flex items-center gap-4">
        {contactContent.links.map((link) => (
          <ContactIconButton
            key={link.type}
            href={link.href}
            ariaLabel={link.ariaLabel}
            icon={iconMap[link.type]}
          />
        ))}
      </div>
    </div>
  );
}
