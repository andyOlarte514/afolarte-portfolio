"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import NavLink from "@/components/atoms/NavLink";

const NAV_LINKS = [
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
] as const;

interface MobileNavProps {
  activeSection: string;
}

export default function MobileNav({ activeSection }: MobileNavProps): React.ReactNode {
  const [isOpen, setIsOpen] = useState(false);

  function handleLinkClick(): void {
    setIsOpen(false);
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        className="size-9"
      >
        <Menu className="size-4" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-72 bg-card">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <nav className="flex flex-col gap-1 pt-8">
            {NAV_LINKS.map(({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                isActive={activeSection === href.slice(1)}
                onClick={handleLinkClick}
              />
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
