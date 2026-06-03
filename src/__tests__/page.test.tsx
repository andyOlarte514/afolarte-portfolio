import React from "react";

import { render } from "@testing-library/react";

// require is used instead of static import to avoid Next.js SWC stripping App Router page imports
// in the test environment. See: https://nextjs.org/docs/app/building-your-application/testing/jest
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Home = require("@/app/page").default as React.ComponentType;

describe("Portfolio", () => {
  it("renders without crashing", () => {
    const { container } = render(<Home />);
    // Verify all four main page sections are mounted
    expect(container.querySelector("#hero")).toBeInTheDocument();
    expect(container.querySelector("#experience")).toBeInTheDocument();
    expect(container.querySelector("#skills")).toBeInTheDocument();
    expect(container.querySelector("#contact")).toBeInTheDocument();
  });
});
