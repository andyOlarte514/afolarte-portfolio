"use client";

import { Button } from "@/components/ui/button";

interface CTAButtonProps {
  label: string;
  targetId: string;
}

export default function CTAButton({ label, targetId }: CTAButtonProps): React.ReactNode {
  function handleClick(): void {
    const target = document.querySelector(`#${targetId}`);
    target?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Button variant="default" size="default" onClick={handleClick} className="min-h-11">
      {label}
    </Button>
  );
}
