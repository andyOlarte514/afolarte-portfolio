export interface ContactLink {
  readonly href: string;
  readonly ariaLabel: string;
  readonly type: "mail" | "github" | "linkedin";
}

export interface ContactContent {
  readonly headline: string;
  readonly pitch: string;
  readonly location: string;
  readonly availability: string;
  readonly phone: string;
  readonly links: readonly [ContactLink, ContactLink, ContactLink];
}
