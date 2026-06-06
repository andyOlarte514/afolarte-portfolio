import type React from "react";

interface RoleBadgeProps {
  company: string;
  role: string;
}

export default function RoleBadge({ company, role }: RoleBadgeProps): React.ReactNode {
  return (
    <span className="border-border bg-muted text-card-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-normal">
      <span className="bg-primary h-2 w-2 flex-shrink-0 rounded-full" aria-hidden="true" />
      <span>{company}</span>
      <span className="text-muted-foreground">·</span>
      <span>{role}</span>
    </span>
  );
}
