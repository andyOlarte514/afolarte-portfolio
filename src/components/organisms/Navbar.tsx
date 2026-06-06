"use client";

import { useEffect, useState } from "react";

import DownloadCVButton from "@/components/atoms/DownloadCVButton";
import NavLink from "@/components/atoms/NavLink";
import ThemeToggle from "@/components/atoms/ThemeToggle";
import MobileNav from "@/components/molecules/MobileNav";
import { useActiveSection } from "@/hooks/useActiveSection";

const NAV_LINKS = [
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
] as const;

const SECTIONS = NAV_LINKS.map(({ href }) => href.slice(1)) as unknown as readonly string[];

export default function Navbar(): React.ReactNode {
  const [isScrolled, setIsScrolled] = useState(false);
  const activeSection = useActiveSection(SECTIONS);

  useEffect(() => {
    function handleScroll(): void {
      setIsScrolled(window.scrollY >= 80);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 z-50 h-16 w-full transition-all duration-300",
        isScrolled ? "border-b border-border bg-background backdrop-blur-md" : "bg-transparent",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <nav className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 md:px-8">
        <span className="text-xl font-semibold">Andy Olarte</span>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              isActive={activeSection === href.slice(1)}
            />
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <DownloadCVButton />
          <ThemeToggle />
          <MobileNav activeSection={activeSection} />
        </div>
      </nav>
    </header>
  );
}
