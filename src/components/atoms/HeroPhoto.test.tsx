import { render, screen } from "@testing-library/react";

import HeroPhoto from "./HeroPhoto";

describe("HeroPhoto", () => {
  it("renders AO initials placeholder when src is not provided", () => {
    render(<HeroPhoto alt="Andy Olarte" initials="AO" />);
    expect(screen.getByText("AO")).toBeInTheDocument();
  });

  it("renders an img element with alt text when src is provided", () => {
    render(<HeroPhoto src="/photo.jpg" alt="Andy Olarte" initials="AO" />);
    expect(screen.getByAltText("Andy Olarte")).toBeInTheDocument();
  });

  it("placeholder container has rounded-2xl class", () => {
    render(<HeroPhoto alt="Andy Olarte" initials="AO" />);
    const container = screen.getByText("AO").closest("div");
    expect(container).toHaveClass("rounded-2xl");
  });

  it("img rendered when src is provided does not use deprecated priority prop", () => {
    render(<HeroPhoto src="/photo.jpg" alt="Andy Olarte" initials="AO" />);
    const imgElement = screen.getByAltText("Andy Olarte");
    expect(imgElement).not.toHaveAttribute("priority");
  });
});
