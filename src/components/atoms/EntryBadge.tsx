import type React from "react";

interface EntryBadgeProps {
  label: string;
}

export default function EntryBadge({ label }: EntryBadgeProps): React.ReactNode {
  return (
    <span className="border-primary text-primary inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
      {label}
    </span>
  );
}
