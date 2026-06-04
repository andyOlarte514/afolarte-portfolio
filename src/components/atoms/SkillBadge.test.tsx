import { render, screen } from "@testing-library/react";

import SkillBadge from "./SkillBadge";

describe("SkillBadge", () => {
  it("renders label text", () => {
    render(<SkillBadge label="React" domain="frontend" variant="primary" />);
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("root element is a span", () => {
    const { container } = render(
      <SkillBadge label="React" domain="frontend" variant="primary" />,
    );
    expect(container.firstChild?.nodeName).toBe("SPAN");
  });

  it("has rounded-full class", () => {
    const { container } = render(
      <SkillBadge label="React" domain="frontend" variant="primary" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("rounded-full");
  });

  it("primary variant has no border class", () => {
    const { container } = render(
      <SkillBadge label="React" domain="frontend" variant="primary" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).not.toHaveClass("border");
  });

  it("secondary variant has border class", () => {
    const { container } = render(
      <SkillBadge label="Angular" domain="frontend" variant="secondary" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("border");
  });

  it("primary frontend has bg-indigo-100 class", () => {
    const { container } = render(
      <SkillBadge label="React" domain="frontend" variant="primary" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("bg-indigo-100");
  });

  it("secondary frontend has border-indigo-400 class", () => {
    const { container } = render(
      <SkillBadge label="Angular" domain="frontend" variant="secondary" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("border-indigo-400");
  });

  it("primary backend has bg-emerald-100 class", () => {
    const { container } = render(
      <SkillBadge label="Python" domain="backend" variant="primary" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("bg-emerald-100");
  });

  it("primary mobile has bg-violet-100 class", () => {
    const { container } = render(
      <SkillBadge label="React Native" domain="mobile" variant="primary" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("bg-violet-100");
  });

  it("primary devops has bg-amber-100 class", () => {
    const { container } = render(
      <SkillBadge label="GitHub Actions" domain="devops" variant="primary" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("bg-amber-100");
  });

  it("primary testing has bg-rose-100 class", () => {
    const { container } = render(
      <SkillBadge label="Jest" domain="testing" variant="primary" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("bg-rose-100");
  });
});
