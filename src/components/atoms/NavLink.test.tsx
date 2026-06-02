import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NavLink from "./NavLink";

describe("NavLink", () => {
  it("renders anchor with correct href and label text", () => {
    render(<NavLink href="#experience" label="Experience" />);

    const link = screen.getByRole("link", { name: "Experience" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#experience");
  });

  it("applies active styles when isActive is true", () => {
    render(<NavLink href="#experience" label="Experience" isActive={true} />);

    const link = screen.getByRole("link", { name: "Experience" });
    expect(link.className).toContain("text-indigo-500");
  });

  it("applies inactive styles when isActive is false", () => {
    render(<NavLink href="#experience" label="Experience" isActive={false} />);

    const link = screen.getByRole("link", { name: "Experience" });
    expect(link.className).not.toContain("text-indigo-500");
    expect(link.className).toContain("text-foreground");
  });

  it("calls scrollIntoView on click", async () => {
    const mockScrollIntoView = jest.fn();
    const mockElement = { scrollIntoView: mockScrollIntoView };
    const querySelectorSpy = jest
      .spyOn(document, "querySelector")
      .mockReturnValue(mockElement as unknown as Element);

    render(<NavLink href="#experience" label="Experience" />);
    await userEvent.click(screen.getByRole("link", { name: "Experience" }));

    expect(querySelectorSpy).toHaveBeenCalledWith("#experience");
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });

    querySelectorSpy.mockRestore();
  });

  it("calls onClick callback when provided", async () => {
    const mockOnClick = jest.fn();
    jest.spyOn(document, "querySelector").mockReturnValue({
      scrollIntoView: jest.fn(),
    } as unknown as Element);

    render(<NavLink href="#skills" label="Skills" onClick={mockOnClick} />);
    await userEvent.click(screen.getByRole("link", { name: "Skills" }));

    expect(mockOnClick).toHaveBeenCalledTimes(1);

    jest.restoreAllMocks();
  });

  it("does not throw when onClick is undefined", async () => {
    jest.spyOn(document, "querySelector").mockReturnValue({
      scrollIntoView: jest.fn(),
    } as unknown as Element);

    render(<NavLink href="#contact" label="Contact" />);

    // Should not throw
    await expect(
      userEvent.click(screen.getByRole("link", { name: "Contact" }))
    ).resolves.not.toThrow();

    jest.restoreAllMocks();
  });

  it("handles null querySelector result gracefully", async () => {
    jest.spyOn(document, "querySelector").mockReturnValue(null);

    render(<NavLink href="#missing" label="Missing" />);

    // Should not throw even when element not found
    await expect(
      userEvent.click(screen.getByRole("link", { name: "Missing" }))
    ).resolves.not.toThrow();

    jest.restoreAllMocks();
  });
});
