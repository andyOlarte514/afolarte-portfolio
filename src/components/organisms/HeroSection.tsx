import type React from "react";

import CTAButton from "@/components/atoms/CTAButton";
import HeroPhoto from "@/components/atoms/HeroPhoto";
import RoleBadge from "@/components/atoms/RoleBadge";
import { heroContent } from "@/lib/heroContent";

export default function HeroSection(): React.ReactNode {
  return (
    <div className="flex items-center pt-24 pb-20">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5 lg:gap-16">
          {/* Text column */}
          <div className="order-1 flex flex-col lg:col-span-3">
            <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
              {heroContent.name}
            </h1>
            <p className="mt-2 text-xl font-normal text-muted-foreground">{heroContent.title}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {heroContent.roles.map((role) => (
                <RoleBadge key={role.company} company={role.company} role={role.role} />
              ))}
            </div>
            <p className="mt-5 text-base font-normal leading-relaxed text-muted-foreground">
              {heroContent.bio}
            </p>
            <div className="mt-6">
              <CTAButton label={heroContent.ctaLabel} targetId={heroContent.ctaTargetId} />
            </div>
          </div>

          {/* Photo column */}
          <div className="order-2 flex justify-center lg:col-span-2">
            <HeroPhoto
              src={heroContent.photo.src}
              alt={heroContent.photo.alt}
              initials={heroContent.photo.initials}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
