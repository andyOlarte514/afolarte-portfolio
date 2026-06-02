"use client";

interface NavLinkProps {
  href: string;
  label: string;
  isActive?: boolean | undefined;
  onClick?: (() => void) | undefined;
}

export default function NavLink({
  href,
  label,
  isActive,
  onClick,
}: NavLinkProps): React.ReactNode {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: "smooth" });
    onClick?.();
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={[
        "relative py-1 text-base transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        isActive
          ? "text-indigo-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-indigo-500"
          : "text-foreground hover:text-muted-foreground",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </a>
  );
}
