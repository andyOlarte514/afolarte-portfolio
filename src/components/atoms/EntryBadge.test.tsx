import { render, screen } from "@testing-library/react";

import EntryBadge from "./EntryBadge";

describe("EntryBadge", () => {
  it("renders the label string passed as prop", () => {
    render(<EntryBadge label="Tech Lead" />);
    expect(screen.getByText("Tech Lead")).toBeInTheDocument();
  });

  it("renders a different label string correctly", () => {
    render(<EntryBadge label="Concurrent Role" />);
    expect(screen.getByText("Concurrent Role")).toBeInTheDocument();
  });

  it("root element is a span", () => {
    const { container } = render(<EntryBadge label="Tech Lead" />);
    expect(container.firstChild?.nodeName).toBe("SPAN");
  });

  it("root span has the rounded-full class", () => {
    const { container } = render(<EntryBadge label="Tech Lead" />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("rounded-full");
  });
});
