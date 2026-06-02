import { act, renderHook } from "@testing-library/react";

import { useTheme } from "./useTheme";

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

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock matchMedia
const matchMediaMock = jest.fn();
Object.defineProperty(window, "matchMedia", {
  value: matchMediaMock,
  writable: true,
});

function setupMatchMedia(prefersDark: boolean): void {
  matchMediaMock.mockImplementation((query: string) => ({
    matches: prefersDark,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

beforeEach(() => {
  localStorageMock.clear();
  document.documentElement.classList.remove("dark");
  jest.clearAllMocks();
});

describe("useTheme", () => {
  it("initializes to dark theme when localStorage is empty and system prefers dark", () => {
    setupMatchMedia(true);
    const { result } = renderHook(() => useTheme());

    // After effect runs, theme should be dark
    act(() => {});

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("initializes to light theme when localStorage is empty and system prefers light", () => {
    setupMatchMedia(false);
    const { result } = renderHook(() => useTheme());

    act(() => {});

    expect(result.current.theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("restores theme from localStorage when stored value is 'dark'", () => {
    setupMatchMedia(false); // system is light but stored is dark
    localStorageMock.setItem("theme", "dark");
    const { result } = renderHook(() => useTheme());

    act(() => {});

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("restores theme from localStorage when stored value is 'light'", () => {
    setupMatchMedia(true); // system is dark but stored is light
    localStorageMock.setItem("theme", "light");
    const { result } = renderHook(() => useTheme());

    act(() => {});

    expect(result.current.theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("toggleTheme switches from dark to light and persists to localStorage", () => {
    setupMatchMedia(true);
    const { result } = renderHook(() => useTheme());

    act(() => {});
    expect(result.current.theme).toBe("dark");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
    expect(localStorageMock.getItem("theme")).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("toggleTheme switches from light to dark and persists to localStorage", () => {
    setupMatchMedia(false);
    const { result } = renderHook(() => useTheme());

    act(() => {});
    expect(result.current.theme).toBe("light");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
    expect(localStorageMock.getItem("theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("toggleTheme removes dark class when switching to light", () => {
    setupMatchMedia(true);
    const { result } = renderHook(() => useTheme());

    act(() => {});
    // Start in dark mode
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    act(() => {
      result.current.toggleTheme();
    });

    // After toggling to light, dark class should be removed
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
