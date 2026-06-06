import type React from "react";

import { experienceContent } from "@/lib/experienceContent";
import TimelineEntry from "@/components/molecules/TimelineEntry";

export default function ExperienceTimeline(): React.ReactNode {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <h2 className="text-foreground mb-8 text-3xl font-bold">Experience</h2>
      <ol className="border-primary relative border-l-2">
        {experienceContent.map((entry) => (
          <TimelineEntry key={entry.company} entry={entry} />
        ))}
      </ol>
    </div>
  );
}
