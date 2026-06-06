import { render, screen } from "@testing-library/react";

import ContactIconButton from "./ContactIconButton";

describe("ContactIconButton", () => {
  const testIcon = <span data-testid="test-icon">icon</span>;

  it("root element is an anchor", () => {
    const { container } = render(
      <ContactIconButton href="mailto:test@test.com" ariaLabel="Test label" icon={testIcon} />,
    );
    expect(container.firstChild?.nodeName).toBe("A");
  });

  it("href attribute matches prop", () => {
    const { container } = render(
      <ContactIconButton href="mailto:test@test.com" ariaLabel="Test label" icon={testIcon} />,
    );
    const anchor = container.firstChild as HTMLAnchorElement;
    expect(anchor).toHaveAttribute("href", "mailto:test@test.com");
  });

  it("aria-label attribute matches ariaLabel prop", () => {
    const { container } = render(
      <ContactIconButton href="mailto:test@test.com" ariaLabel="Test label" icon={testIcon} />,
    );
    const anchor = container.firstChild as HTMLAnchorElement;
    expect(anchor).toHaveAttribute("aria-label", "Test label");
  });

  it("target is _blank", () => {
    const { container } = render(
      <ContactIconButton href="mailto:test@test.com" ariaLabel="Test label" icon={testIcon} />,
    );
    const anchor = container.firstChild as HTMLAnchorElement;
    expect(anchor).toHaveAttribute("target", "_blank");
  });

  it("rel is noopener noreferrer", () => {
    const { container } = render(
      <ContactIconButton href="mailto:test@test.com" ariaLabel="Test label" icon={testIcon} />,
    );
    const anchor = container.firstChild as HTMLAnchorElement;
    expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders icon child in the DOM", () => {
    render(
      <ContactIconButton
        href="mailto:test@test.com"
        ariaLabel="Test label"
        icon={testIcon}
      />,
    );
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("inner button has tabIndex -1 to prevent double focus stop", () => {
    const { container } = render(
      <ContactIconButton href="mailto:test@test.com" ariaLabel="Test label" icon={testIcon} />,
    );
    const anchor = container.firstChild as HTMLAnchorElement;
    const button = anchor.querySelector("button");
    expect(button).toHaveAttribute("tabindex", "-1");
  });
});
