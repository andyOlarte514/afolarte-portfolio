import React from "react";

import { render, screen } from "@testing-library/react";

import ContactSection from "./ContactSection";

jest.mock("@/components/atoms/ContactIconButton", () => {
  return function MockContactIconButton({
    ariaLabel,
  }: {
    ariaLabel: string;
  }): React.ReactElement {
    return (
      <a data-testid="contact-icon-button" aria-label={ariaLabel} href="#">
        {ariaLabel}
      </a>
    );
  };
});

describe("ContactSection", () => {
  it("renders headline text", () => {
    render(<ContactSection />);
    expect(screen.getByText(/Let's build something great/)).toBeInTheDocument();
  });

  it("renders pitch text containing '10+ years'", () => {
    render(<ContactSection />);
    expect(screen.getByText(/10\+ years/)).toBeInTheDocument();
  });

  it("renders location 'Medellín, Colombia'", () => {
    render(<ContactSection />);
    expect(screen.getByText("Medellín, Colombia")).toBeInTheDocument();
  });

  it("renders availability text", () => {
    render(<ContactSection />);
    expect(screen.getByText("Open to remote opportunities")).toBeInTheDocument();
  });

  it("renders exactly 3 ContactIconButton atoms", () => {
    render(<ContactSection />);
    expect(screen.getAllByTestId("contact-icon-button")).toHaveLength(3);
  });

  it("renders Mail button with correct aria-label", () => {
    render(<ContactSection />);
    expect(screen.getByRole("link", { name: "Send Andy an email" })).toBeInTheDocument();
  });

  it("renders pulsing dot with aria-hidden", () => {
    render(<ContactSection />);
    const pingEl = document.querySelector("span[aria-hidden='true']");
    expect(pingEl).not.toBeNull();
    expect(pingEl).toHaveClass("animate-ping");
  });
});
