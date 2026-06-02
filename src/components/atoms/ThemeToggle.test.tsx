import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ThemeToggle from "./ThemeToggle";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => store[key] ?? null,
    setItem: (key: string, value: string): void => {
      store[key] = value;
    },
    clear: (): void => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock matchMedia
function setupMatchMedia(prefersDark: boolean): void {
  Object.defineProperty(window, "matchMedia", {
    value: jest.fn().mockImplementation((query: string) => ({
      matches: prefersDark,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
    writable: true,
  });
}

beforeEach(() => {
  localStorageMock.clear();
  document.documentElement.classList.remove("dark");
  jest.clearAllMocks();
});

describe("ThemeToggle", () => {
  it("renders a button with aria-label 'Toggle dark mode'", () => {
    setupMatchMedia(true);
    render(<ThemeToggle />);

    expect(screen.getByRole("button", { name: /toggle dark mode/i })).toBeInTheDocument();
  });

  it("shows Sun icon when theme is dark (system prefers dark)", () => {
    setupMatchMedia(true);
    localStorageMock.setItem("theme", "dark");
    const { container } = render(<ThemeToggle />);

    // Wait for useEffect to run and set theme to dark
    // After effect: theme is "dark", Sun icon should render
    // Sun icon has a circle element (distinguishes it from Moon)
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);

    // Initial render before useEffect: theme starts as "dark" (useState default)
    // so Sun should be present immediately
    const hasSunCircle = Array.from(svgs).some((svg) => svg.querySelector("circle") !== null);
    expect(hasSunCircle).toBe(true);
  });

  it("shows Moon icon when theme is light", () => {
    setupMatchMedia(false);
    localStorageMock.setItem("theme", "light");

    // Before useEffect runs, theme defaults to "dark" — we need to test after effect
    // Re-render after setting up light preference
    const { container, rerender } = render(<ThemeToggle />);

    // After re-render triggered by state change (useEffect will have run)
    rerender(<ThemeToggle />);

    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
    // With light theme, Moon icon renders (no circle)
    const hasSunCircle = Array.from(svgs).some((svg) => svg.querySelector("circle") !== null);
    expect(hasSunCircle).toBe(false);
  });

  it("calls toggleTheme when button is clicked", async () => {
    setupMatchMedia(true);
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /toggle dark mode/i });
    await userEvent.click(button);

    // After clicking, localStorage should have been updated (proving toggleTheme was called)
    expect(localStorageMock.getItem("theme")).not.toBeNull();
  });
});
