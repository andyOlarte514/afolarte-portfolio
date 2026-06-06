import type React from "react";

import { skillsContent } from "@/lib/skillsContent";
import SkillGroup from "@/components/molecules/SkillGroup";

export default function SkillsSection(): React.ReactNode {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <h2 className="text-foreground mb-8 text-3xl font-bold">Skills</h2>
      <div className="flex flex-col gap-6">
        {skillsContent.map((group) => (
          <SkillGroup
            key={group.domainKey}
            domain={group.domain}
            domainKey={group.domainKey}
            primary={group.primary}
            secondary={group.secondary}
          />
        ))}
      </div>
    </div>
  );
}
