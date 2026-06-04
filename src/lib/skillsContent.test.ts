import { skillsContent } from "./skillsContent";

describe("skillsContent", () => {
  it("exports exactly 5 skill domain groups", () => {
    expect(skillsContent).toHaveLength(5);
  });

  it("has domainKeys in the correct order: frontend, backend, mobile, devops, testing", () => {
    const keys = skillsContent.map((g) => g.domainKey);
    expect(keys).toEqual(["frontend", "backend", "mobile", "devops", "testing"]);
  });

  it("has domain display names in the correct order", () => {
    const domains = skillsContent.map((g) => g.domain);
    expect(domains).toEqual(["Frontend", "Backend", "Mobile", "DevOps/CI", "Testing"]);
  });

  it("frontend entry has correct primary skills", () => {
    const frontend = skillsContent[0];
    expect(frontend?.primary).toEqual([
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Radix UI / shadcn/ui",
    ]);
  });

  it("frontend entry has correct secondary skills", () => {
    const frontend = skillsContent[0];
    expect(frontend?.secondary).toEqual(["Angular", "Vue.js", "Redux", "CSS Modules"]);
  });

  it("backend entry has correct primary skills", () => {
    const backend = skillsContent[1];
    expect(backend?.primary).toEqual(["Python", "FastAPI", "Node.js"]);
  });

  it("backend entry has correct secondary skills", () => {
    const backend = skillsContent[1];
    expect(backend?.secondary).toEqual([
      "REST API design",
      "Clean Architecture",
      "ESLint plugin authoring",
    ]);
  });

  it("mobile entry has correct primary skills", () => {
    const mobile = skillsContent[2];
    expect(mobile?.primary).toEqual(["React Native"]);
  });

  it("mobile entry has correct secondary skills", () => {
    const mobile = skillsContent[2];
    expect(mobile?.secondary).toEqual(["Expo", "iOS/Android native bridge"]);
  });

  it("devops entry has correct primary skills", () => {
    const devops = skillsContent[3];
    expect(devops?.primary).toEqual(["GitHub Actions", "Vercel"]);
  });

  it("devops entry has correct secondary skills", () => {
    const devops = skillsContent[3];
    expect(devops?.secondary).toEqual(["Docker", "CI/CD pipelines"]);
  });

  it("testing entry has correct primary skills", () => {
    const testing = skillsContent[4];
    expect(testing?.primary).toEqual(["Jest", "React Testing Library", "Playwright"]);
  });

  it("testing entry has correct secondary skills", () => {
    const testing = skillsContent[4];
    expect(testing?.secondary).toEqual(["E2E testing", "TDD", "coverage tooling"]);
  });

  it("every entry has non-empty primary and secondary arrays", () => {
    for (const group of skillsContent) {
      expect(group.primary.length).toBeGreaterThan(0);
      expect(group.secondary.length).toBeGreaterThan(0);
    }
  });
});
