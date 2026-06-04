import type React from "react";

import type { SkillDomain } from "@/types/skills";
import SkillBadge from "@/components/atoms/SkillBadge";

interface SkillGroupProps {
  domain: string;
  domainKey: SkillDomain;
  primary: readonly string[];
  secondary: readonly string[];
}

export default function SkillGroup({
  domain,
  domainKey,
  primary,
  secondary,
}: SkillGroupProps): React.ReactNode {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-base font-bold text-foreground">{domain}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {primary.map((skill) => (
          <SkillBadge key={skill} label={skill} domain={domainKey} variant="primary" />
        ))}
        {secondary.map((skill) => (
          <SkillBadge key={skill} label={skill} domain={domainKey} variant="secondary" />
        ))}
      </div>
    </div>
  );
}
