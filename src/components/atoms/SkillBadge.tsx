import type React from "react";

import type { SkillDomain } from "@/types/skills";

type SkillVariant = "primary" | "secondary";

interface SkillBadgeProps {
  label: string;
  domain: SkillDomain;
  variant: SkillVariant;
}

const domainClasses: Record<SkillDomain, { primary: string; secondary: string }> = {
  frontend: {
    primary: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    secondary: "border-indigo-400 text-indigo-600 dark:border-indigo-600 dark:text-indigo-400",
  },
  backend: {
    primary: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    secondary: "border-emerald-400 text-emerald-600 dark:border-emerald-600 dark:text-emerald-400",
  },
  mobile: {
    primary: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    secondary: "border-violet-400 text-violet-600 dark:border-violet-600 dark:text-violet-400",
  },
  devops: {
    primary: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    secondary: "border-amber-400 text-amber-600 dark:border-amber-600 dark:text-amber-400",
  },
  testing: {
    primary: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    secondary: "border-rose-400 text-rose-600 dark:border-rose-600 dark:text-rose-400",
  },
};

const variantBase: Record<SkillVariant, string> = {
  primary: "inline-flex items-center rounded-full border-0 px-3 py-1 text-sm font-normal",
  secondary:
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-normal bg-transparent",
};

export default function SkillBadge({ label, domain, variant }: SkillBadgeProps): React.ReactNode {
  return (
    <span className={`${variantBase[variant]} ${domainClasses[domain][variant]}`}>{label}</span>
  );
}
