import type React from "react";

interface CompanyAvatarProps {
  initials: string;
  color: string;
  size?: "sm" | "md" | undefined;
}

export default function CompanyAvatar({
  initials,
  color,
  size = "md",
}: CompanyAvatarProps): React.ReactNode {
  const sizeClasses = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg font-bold text-white ${sizeClasses}`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
      data-testid="company-avatar"
    >
      {initials}
    </div>
  );
}
