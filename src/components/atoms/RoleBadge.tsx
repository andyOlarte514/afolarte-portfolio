import type React from "react";

interface RoleBadgeProps {
  company: string;
  role: string;
}

export default function RoleBadge({ company, role }: RoleBadgeProps): React.ReactNode {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-sm font-normal text-card-foreground">
      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
      <span>{company}</span>
      <span className="text-muted-foreground">·</span>
      <span>{role}</span>
    </span>
  );
}
