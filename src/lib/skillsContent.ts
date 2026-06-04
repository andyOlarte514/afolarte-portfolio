import type { SkillGroup } from "@/types/skills";

export const skillsContent: readonly SkillGroup[] = [
  {
    domain: "Frontend",
    domainKey: "frontend",
    primary: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Radix UI / shadcn/ui"],
    secondary: ["Angular", "Vue.js", "Redux", "CSS Modules"],
  },
  {
    domain: "Backend",
    domainKey: "backend",
    primary: ["Python", "FastAPI", "Node.js"],
    secondary: ["REST API design", "Clean Architecture", "ESLint plugin authoring"],
  },
  {
    domain: "Mobile",
    domainKey: "mobile",
    primary: ["React Native"],
    secondary: ["Expo", "iOS/Android native bridge"],
  },
  {
    domain: "DevOps/CI",
    domainKey: "devops",
    primary: ["GitHub Actions", "Vercel"],
    secondary: ["Docker", "CI/CD pipelines"],
  },
  {
    domain: "Testing",
    domainKey: "testing",
    primary: ["Jest", "React Testing Library", "Playwright"],
    secondary: ["E2E testing", "TDD", "coverage tooling"],
  },
] as const;
