import type * as ReactNS from "react";

import { act, render, screen } from "@testing-library/react";

import Navbar from "./Navbar";

// Mock DownloadCVButton to avoid resolving next/dynamic and @react-pdf/renderer in unit test context
jest.mock("@/components/atoms/DownloadCVButton", () => function MockDownloadCVButton() {
  return <div data-testid="download-cv-button" />;
});

// Mock useActiveSection so we can control which section is "active"
jest.mock("@/hooks/useActiveSection", () => ({
  useActiveSection: jest.fn().mockReturnValue(""),
}));

// Mock useTheme so ThemeToggle renders without localStorage/matchMedia
jest.mock("@/hooks/useTheme", () => ({
  useTheme: jest.fn().mockReturnValue({ theme: "dark", toggleTheme: jest.fn() }),
}));

// Mock Sheet components to avoid jsdom portal issues (same pattern as MobileNav.test.tsx)
jest.mock("@/components/ui/sheet", () => {
  const React = jest.requireActual("react") as typeof ReactNS;

  const SheetContext = React.createContext<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }>({ open: false, onOpenChange: (): void => {} });

  function Sheet({
    open,
    onOpenChange,
    children,
  }: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
  }): React.ReactElement | null {
    const contextValue = { open: open ?? false, onOpenChange: onOpenChange ?? ((): void => {}) };
    return <SheetContext.Provider value={contextValue}>{children}</SheetContext.Provider>;
  }

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

describe("Navbar", () => {
  it("renders 'Andy Olarte' wordmark", () => {
    render(<Navbar />);

    expect(screen.getByText("Andy Olarte")).toBeInTheDocument();
  });

  it("renders Experience, Skills, Contact nav links", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Skills" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  it("renders ThemeToggle button", () => {
    render(<Navbar />);

    expect(screen.getByRole("button", { name: /toggle dark mode/i })).toBeInTheDocument();
  });

  it("renders MobileNav hamburger", () => {
    render(<Navbar />);

    expect(screen.getByRole("button", { name: /open navigation menu/i })).toBeInTheDocument();
  });

  it("starts with transparent background", () => {
    render(<Navbar />);

    const header = screen.getByRole("banner");
    expect(header.className).toContain("bg-transparent");
    expect(header.className).not.toContain("bg-background");
  });

  it("becomes solid after scrolling past 80px", () => {
    render(<Navbar />);

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 100, writable: true, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });

    const header = screen.getByRole("banner");
    expect(header.className).toContain("bg-background");
    expect(header.className).not.toContain("bg-transparent");
  });

  it("returns to transparent when scrolled back to top", () => {
    render(<Navbar />);

    // First scroll past 80px
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 100, writable: true, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });

    // Then scroll back to top
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });

    const header = screen.getByRole("banner");
    expect(header.className).toContain("bg-transparent");
    expect(header.className).not.toContain("bg-background");
  });

  it("highlights active section link", () => {
    const { useActiveSection } = jest.requireMock("@/hooks/useActiveSection") as {
      useActiveSection: jest.Mock;
    };
    useActiveSection.mockReturnValue("experience");

    render(<Navbar />);

    const experienceLink = screen.getByRole("link", { name: "Experience" });
    expect(experienceLink.className).toContain("text-indigo-500");
  });

  it("removes scroll listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = render(<Navbar />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("renders the DownloadCVButton atom", () => {
    render(<Navbar />);

    expect(screen.getByTestId("download-cv-button")).toBeInTheDocument();
  });
});
