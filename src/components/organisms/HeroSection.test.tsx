import React from "react";

import { render, screen } from "@testing-library/react";

import HeroSection from "./HeroSection";

jest.mock("@/components/atoms/CTAButton", () => {
  return function MockCTAButton({ label }: { label: string }): React.ReactElement {
    return <button data-testid="cta-button">{label}</button>;
  };
});

jest.mock("@/components/atoms/HeroPhoto", () => {
  return function MockHeroPhoto({ initials }: { initials: string }): React.ReactElement {
    return <div data-testid="hero-photo">{initials}</div>;
  };
});

jest.mock("@/components/atoms/RoleBadge", () => {
  return function MockRoleBadge({
    company,
    role,
  }: {
    company: string;
    role: string;
  }): React.ReactElement {
    return (
      <span>
        {company} {role}
      </span>
    );
  };
});

describe("HeroSection", () => {
  it("renders h1 heading containing the name", () => {
    render(<HeroSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Andy");
  });

  it("renders title text matching /Senior Frontend/", () => {
    render(<HeroSection />);
    expect(screen.getByText(/Senior Frontend/)).toBeInTheDocument();
  });

  it("renders NVIDIA role badge company text", () => {
    render(<HeroSection />);
    expect(screen.getByText(/NVIDIA/)).toBeInTheDocument();
  });

  it("renders Mekan role badge company text", () => {
    render(<HeroSection />);
    expect(screen.getByText(/Mekan/)).toBeInTheDocument();
  });

  it("renders bio paragraph containing '10+'", () => {
    render(<HeroSection />);
    expect(screen.getByText(/10\+/)).toBeInTheDocument();
  });

  it("renders the CTA button via CTAButton atom", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("cta-button")).toBeInTheDocument();
  });
});
