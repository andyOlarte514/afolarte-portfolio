import { render } from "@testing-library/react";

// Placeholder — replace with actual page component import once built
describe("Portfolio", () => {
  it("renders without crashing", () => {
    const { container } = render(<div>Hello</div>);
    expect(container).toBeInTheDocument();
  });
});
