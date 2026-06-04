import type React from "react";

import type { WorkEntry } from "@/types/experience";
import CompanyAvatar from "@/components/atoms/CompanyAvatar";
import EntryBadge from "@/components/atoms/EntryBadge";

interface TimelineEntryProps {
  entry: WorkEntry;
}

export default function TimelineEntry({ entry }: TimelineEntryProps): React.ReactNode {
  return (
    <li className="relative mb-6 pl-8">
      {/* Timeline dot overlapping the vertical line */}
      <div className="absolute -left-1.5 top-5 h-3 w-3 rounded-full bg-primary" />

      {/* Entry content: avatar on left, text on right */}
      <div className="flex items-start gap-4">
        <CompanyAvatar initials={entry.companyInitials} color={entry.avatarColor} />

        <div className="flex flex-col gap-1">
          {/* Company name */}
          <p className="text-sm text-muted-foreground">{entry.company}</p>

          {/* Role title */}
          <p className="text-lg font-bold text-foreground">{entry.role}</p>

          {/* Role badges (conditional) */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <EntryBadge key={tag} label={tag} />
              ))}
            </div>
          )}

          {/* Date range */}
          <time
            dateTime=""
            className="font-mono text-sm text-muted-foreground"
          >
            {entry.dateRange}
          </time>

          {/* Impact bullets */}
          <ul className="mt-2 flex flex-col gap-1 text-base text-foreground">
            {entry.bullets.map((bullet, i) => (
              <li key={`${entry.company}-bullet-${i}`}>{bullet}</li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}
