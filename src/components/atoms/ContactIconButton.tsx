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
    <a href={href} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer">
      <Button variant="outline" size="icon" className="h-11 w-11 rounded-full">
        {icon}
      </Button>
    </a>
  );
}
