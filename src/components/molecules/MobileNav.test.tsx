import type * as React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MobileNav from "./MobileNav";

// Mock DownloadCVButton to avoid resolving next/dynamic and @react-pdf/renderer in unit test context
jest.mock("@/components/atoms/DownloadCVButton", () => function MockDownloadCVButton() {
  return <div data-testid="download-cv-button" />;
});

// Mock Sheet components — @base-ui/react/dialog uses portals that rely on
// FloatingPortal which can cause issues in jsdom. We mock at the module boundary
// to render children inline when open=true, matching the component's behavior contract.
jest.mock("@/components/ui/sheet", () => {
  const React = jest.requireActual("react") as typeof React;

  function Sheet({
    open,
    onOpenChange,
    children,
  }: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
  }): React.ReactElement | null {
    // Attach onOpenChange to a context so SheetContent can call it
    const contextValue = { open: open ?? false, onOpenChange: onOpenChange ?? ((): void => {}) };
    return (
      <SheetContext.Provider value={contextValue}>
        {children}
      </SheetContext.Provider>
    );
  }

  const SheetContext = React.createContext<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }>({ open: false, onOpenChange: (): void => {} });

  function SheetContent({
    children,
  }: {
    children?: React.ReactNode;
    side?: string;
    className?: string;
  }): React.ReactElement | null {
    const ctx = React.useContext(SheetContext);
    if (!ctx.open) return null;
    return <div data-testid="sheet-content">{children}</div>;
  }

  function SheetTitle({
    children,
    className,
  }: {
    children?: React.ReactNode;
    className?: string;
  }): React.ReactElement {
    return <h2 className={className}>{children}</h2>;
  }

  return { Sheet, SheetContent, SheetTitle };
});

// Mock document.querySelector for NavLink scroll behavior
beforeEach(() => {
  jest.spyOn(document, "querySelector").mockReturnValue({
    scrollIntoView: jest.fn(),
  } as unknown as Element);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("MobileNav", () => {
  it("renders a hamburger button with aria-label 'Open navigation menu'", () => {
    render(<MobileNav activeSection="" />);

    const button = screen.getByRole("button", { name: /open navigation menu/i });
    expect(button).toBeInTheDocument();
  });

  it("Sheet is closed initially — sheet content not in DOM", () => {
    render(<MobileNav activeSection="" />);

    expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();
  });

  it("clicking hamburger opens the Sheet", async () => {
    render(<MobileNav activeSection="" />);

    const hamburger = screen.getByRole("button", { name: /open navigation menu/i });
    await userEvent.click(hamburger);

    expect(screen.getByTestId("sheet-content")).toBeInTheDocument();
  });

  it("renders Experience, Skills, Contact links when Sheet is open", async () => {
    render(<MobileNav activeSection="" />);

    const hamburger = screen.getByRole("button", { name: /open navigation menu/i });
    await userEvent.click(hamburger);

    expect(screen.getByRole("link", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Skills" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  it("clicking a nav link closes the Sheet", async () => {
    render(<MobileNav activeSection="" />);

    // Open the sheet
    const hamburger = screen.getByRole("button", { name: /open navigation menu/i });
    await userEvent.click(hamburger);
    expect(screen.getByTestId("sheet-content")).toBeInTheDocument();

    // Click a nav link
    const experienceLink = screen.getByRole("link", { name: "Experience" });
    await userEvent.click(experienceLink);

    // Sheet should close
    expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();
  });

  it("passes isActive=true to the matching NavLink", async () => {
    render(<MobileNav activeSection="experience" />);

    const hamburger = screen.getByRole("button", { name: /open navigation menu/i });
    await userEvent.click(hamburger);

    // The active NavLink should have indigo-500 text class
    const experienceLink = screen.getByRole("link", { name: "Experience" });
    expect(experienceLink.className).toContain("text-indigo-500");
  });

  it("passes isActive=false to non-matching NavLinks", async () => {
    render(<MobileNav activeSection="experience" />);

    const hamburger = screen.getByRole("button", { name: /open navigation menu/i });
    await userEvent.click(hamburger);

    // Skills and Contact links should not have indigo-500 text class
    const skillsLink = screen.getByRole("link", { name: "Skills" });
    expect(skillsLink.className).not.toContain("text-indigo-500");
    expect(skillsLink.className).toContain("text-foreground");
  });

  it("renders DownloadCVButton inside the Sheet drawer when open", async () => {
    render(<MobileNav activeSection="" />);

    // Button not visible before Sheet is opened
    expect(screen.queryByTestId("download-cv-button")).not.toBeInTheDocument();

    const hamburger = screen.getByRole("button", { name: /open navigation menu/i });
    await userEvent.click(hamburger);

    expect(screen.getByTestId("download-cv-button")).toBeInTheDocument();
  });
});
