export interface RoleBadgeData {
  readonly company: string;
  readonly role: string;
}

export interface HeroContent {
  readonly name: string;
  readonly title: string;
  readonly bio: string;
  readonly roles: readonly [RoleBadgeData, RoleBadgeData];
  readonly ctaLabel: string;
  readonly ctaTargetId: string;
  readonly photo: {
    readonly src?: string | undefined;
    readonly alt: string;
    readonly initials: string;
  };
}
