export type SkillDomain = "frontend" | "backend" | "mobile" | "devops" | "testing";

export interface SkillGroup {
  readonly domain: string;
  readonly domainKey: SkillDomain;
  readonly primary: readonly string[];
  readonly secondary: readonly string[];
}
