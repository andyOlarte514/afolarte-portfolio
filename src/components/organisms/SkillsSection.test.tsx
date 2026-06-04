import React from "react";

import { render, screen } from "@testing-library/react";

import SkillsSection from "./SkillsSection";

jest.mock("@/components/molecules/SkillGroup", () => {
  return function MockSkillGroup({ domain }: { domain: string }): React.ReactElement {
    return <div data-testid="skill-group">{domain}</div>;
  };
});

describe("SkillsSection", () => {
  it("renders h2 heading with text 'Skills'", () => {
    render(<SkillsSection />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Skills");
  });

  it("renders exactly 5 SkillGroup molecules", () => {
    render(<SkillsSection />);
    expect(screen.getAllByTestId("skill-group")).toHaveLength(5);
  });

  it("renders 'Frontend' as the first group", () => {
    render(<SkillsSection />);
    const groups = screen.getAllByTestId("skill-group");
    expect(groups[0]).toHaveTextContent("Frontend");
  });

  it("renders 'Testing' as the last group", () => {
    render(<SkillsSection />);
    const groups = screen.getAllByTestId("skill-group");
    expect(groups[4]).toHaveTextContent("Testing");
  });
});
