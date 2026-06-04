import React from "react";

import { render, screen } from "@testing-library/react";

import SkillGroup from "./SkillGroup";

jest.mock("@/components/atoms/SkillBadge", () => {
  return function MockSkillBadge({ label }: { label: string }): React.ReactElement {
    return <span data-testid="skill-badge">{label}</span>;
  };
});

const frontendGroup = {
  domain: "Frontend",
  domainKey: "frontend" as const,
  primary: ["React", "TypeScript"],
  secondary: ["Angular", "Vue.js"],
};

const mobileGroup = {
  domain: "Mobile",
  domainKey: "mobile" as const,
  primary: ["React Native"],
  secondary: [],
};

describe("SkillGroup", () => {
  describe("Frontend group (primary + secondary)", () => {
    it("renders h3 heading with domain name 'Frontend'", () => {
      render(<SkillGroup {...frontendGroup} />);
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Frontend");
    });

    it("renders 4 skill badges total (2 primary + 2 secondary)", () => {
      render(<SkillGroup {...frontendGroup} />);
      expect(screen.getAllByTestId("skill-badge")).toHaveLength(4);
    });

    it("renders 'React' as a badge", () => {
      render(<SkillGroup {...frontendGroup} />);
      expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("renders 'Angular' as a badge", () => {
      render(<SkillGroup {...frontendGroup} />);
      expect(screen.getByText("Angular")).toBeInTheDocument();
    });

    it("renders primary badges before secondary badges in DOM order", () => {
      render(<SkillGroup {...frontendGroup} />);
      const badges = screen.getAllByTestId("skill-badge");
      expect(badges[0]).toHaveTextContent("React");
      expect(badges[2]).toHaveTextContent("Angular");
    });
  });

  describe("Mobile group (empty secondary)", () => {
    it("renders exactly 1 skill badge when secondary is empty", () => {
      render(<SkillGroup {...mobileGroup} />);
      expect(screen.getAllByTestId("skill-badge")).toHaveLength(1);
    });

    it("renders 'React Native' badge", () => {
      render(<SkillGroup {...mobileGroup} />);
      expect(screen.getByText("React Native")).toBeInTheDocument();
    });
  });
});
