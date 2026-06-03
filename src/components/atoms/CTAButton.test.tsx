import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CTAButton from "./CTAButton";

describe("CTAButton", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders a button with the label passed via props", () => {
    render(<CTAButton label="Get in touch" targetId="contact" />);

    expect(screen.getByRole("button", { name: "Get in touch" })).toBeInTheDocument();
  });

  it("clicking the button calls document.querySelector with the correct selector", async () => {
    const user = userEvent.setup();
    const mockScrollIntoView = jest.fn();
    const mockElement = { scrollIntoView: mockScrollIntoView };
    const querySelectorSpy = jest
      .spyOn(document, "querySelector")
      .mockReturnValue(mockElement as unknown as Element);

    render(<CTAButton label="Get in touch" targetId="contact" />);
    await user.click(screen.getByRole("button", { name: "Get in touch" }));

    expect(querySelectorSpy).toHaveBeenCalledWith("#contact");

    querySelectorSpy.mockRestore();
  });

  it("clicking the button calls scrollIntoView with behavior: smooth", async () => {
    const user = userEvent.setup();
    const mockScrollIntoView = jest.fn();
    const mockElement = { scrollIntoView: mockScrollIntoView };
    jest
      .spyOn(document, "querySelector")
      .mockReturnValue(mockElement as unknown as Element);

    render(<CTAButton label="Get in touch" targetId="contact" />);
    await user.click(screen.getByRole("button", { name: "Get in touch" }));

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("does not throw when querySelector returns null", async () => {
    const user = userEvent.setup();
    jest.spyOn(document, "querySelector").mockReturnValue(null);

    render(<CTAButton label="Get in touch" targetId="contact" />);

    await expect(
      user.click(screen.getByRole("button", { name: "Get in touch" }))
    ).resolves.not.toThrow();
  });

  it("is accessible by role button with the label as accessible name", () => {
    render(<CTAButton label="Get in touch" targetId="contact" />);

    const button = screen.getByRole("button", { name: "Get in touch" });
    expect(button).toBeInTheDocument();
  });
});
