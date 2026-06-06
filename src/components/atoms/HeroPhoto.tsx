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
      <div className="bg-primary ring-primary ring-offset-background relative flex aspect-square w-full max-w-[320px] items-center justify-center rounded-2xl ring-2 ring-offset-2">
        <span className="text-primary-foreground text-4xl font-bold">{initials}</span>
      </div>
    );
  }

  return (
    <div className="ring-primary ring-offset-background relative aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl ring-2 ring-offset-2">
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
