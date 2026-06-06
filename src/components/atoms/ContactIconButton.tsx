import type React from "react";

import { Button } from "@/components/ui/button";

interface ContactIconButtonProps {
  href: string;
  ariaLabel: string;
  icon: React.ReactNode;
}

export default function ContactIconButton({
  href,
  ariaLabel,
  icon,
}: ContactIconButtonProps): React.ReactNode {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Button variant="outline" size="icon" className="h-11 w-11 rounded-full" tabIndex={-1}>
        {icon}
      </Button>
    </a>
  );
}
