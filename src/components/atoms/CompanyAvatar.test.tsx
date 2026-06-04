import { render, screen } from "@testing-library/react";

import CompanyAvatar from "./CompanyAvatar";

describe("CompanyAvatar", () => {
  it("renders the initials string passed as prop", () => {
    render(<CompanyAvatar initials="NV" color="#16a34a" />);
    expect(screen.getByText("NV")).toBeInTheDocument();
  });

  it("applies backgroundColor from color prop via inline style", () => {
    const { container } = render(<CompanyAvatar initials="NV" color="#16a34a" />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.backgroundColor).toBe("rgb(22, 163, 74)");
  });

  it("root element has aria-hidden true", () => {
    const { container } = render(<CompanyAvatar initials="NV" color="#16a34a" />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("aria-hidden", "true");
  });

  it("default size renders w-10 h-10 classes (md variant)", () => {
    const { container } = render(<CompanyAvatar initials="NV" color="#16a34a" />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("w-10");
    expect(root).toHaveClass("h-10");
  });

  it("size='sm' renders w-8 h-8 classes (sm variant)", () => {
    const { container } = render(<CompanyAvatar initials="NV" color="#16a34a" size="sm" />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("w-8");
    expect(root).toHaveClass("h-8");
  });

  it("renders rounded-lg class", () => {
    const { container } = render(<CompanyAvatar initials="NV" color="#16a34a" />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("rounded-lg");
  });

  it("root element has data-testid='company-avatar'", () => {
    const { container } = render(<CompanyAvatar initials="NV" color="#16a34a" />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("data-testid", "company-avatar");
  });
});
