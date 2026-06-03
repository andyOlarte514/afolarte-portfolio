import { render, screen } from "@testing-library/react";

import RoleBadge from "./RoleBadge";

describe("RoleBadge", () => {
  it("renders company name in DOM", () => {
    render(<RoleBadge company="NVIDIA" role="Frontend Lead" />);
    expect(screen.getByText("NVIDIA")).toBeInTheDocument();
  });

  it("renders role title in DOM", () => {
    render(<RoleBadge company="NVIDIA" role="Frontend Lead" />);
    expect(screen.getByText("Frontend Lead")).toBeInTheDocument();
  });

  it("renders indigo dot element with aria-hidden", () => {
    render(<RoleBadge company="NVIDIA" role="Frontend Lead" />);
    const dot = document.querySelector("[aria-hidden='true']");
    expect(dot).toBeInTheDocument();
  });

  it("renders different content when given different props", () => {
    render(<RoleBadge company="Mekan" role="Senior Frontend" />);
    expect(screen.getByText("Mekan")).toBeInTheDocument();
    expect(screen.getByText("Senior Frontend")).toBeInTheDocument();
  });
});
