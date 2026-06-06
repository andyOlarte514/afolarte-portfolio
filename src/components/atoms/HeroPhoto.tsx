import type React from "react";

import Image from "next/image";

interface HeroPhotoProps {
  src?: string | undefined;
  alt: string;
  initials: string;
}

export default function HeroPhoto({ src, alt, initials }: HeroPhotoProps): React.ReactNode {
  if (!src) {
    return (
      <div className="relative aspect-square w-full max-w-[320px] rounded-2xl bg-primary ring-2 ring-primary ring-offset-2 ring-offset-background flex items-center justify-center">
        <span className="text-4xl font-bold text-primary-foreground">{initials}</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full max-w-[320px] rounded-2xl ring-2 ring-primary ring-offset-2 ring-offset-background overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        preload={true}
        loading="eager"
        sizes="(max-width: 320px) 100vw, 320px"
        className="object-cover object-top"
      />
    </div>
  );
}
