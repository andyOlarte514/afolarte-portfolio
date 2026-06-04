import type React from "react";

interface EntryBadgeProps {
  label: string;
}

export default function EntryBadge({ label }: EntryBadgeProps): React.ReactNode {
  return (
    <span className="inline-flex items-center rounded-full border border-primary px-2.5 py-0.5 text-xs font-medium text-primary">
      {label}
    </span>
  );
}
