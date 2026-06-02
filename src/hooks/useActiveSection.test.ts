import { act, renderHook } from "@testing-library/react";

import { useActiveSection } from "./useActiveSection";

type IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => void;

interface MockObserver {
  observe: jest.Mock;
  disconnect: jest.Mock;
  callback: IntersectionObserverCallback;
}

// Store created mock observers so tests can inspect and trigger them
let mockObservers: MockObserver[] = [];

function setupIntersectionObserverMock(): void {
  mockObservers = [];

  // jsdom does not provide IntersectionObserver — define it on global before each test
  Object.defineProperty(global, "IntersectionObserver", {
    configurable: true,
    writable: true,
    value: jest.fn().mockImplementation((callback: IntersectionObserverCallback) => {
      const mockObserver: MockObserver = {
        observe: jest.fn(),
        disconnect: jest.fn(),
        callback,
      };
      mockObservers.push(mockObserver);
      return mockObserver as unknown as IntersectionObserver;
    }),
  });
}

beforeEach(() => {
  mockObservers = [];
  // Clean up DOM
  document.body.innerHTML = "";
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("useActiveSection", () => {
  it("returns empty string initially", () => {
    setupIntersectionObserverMock();

    const div = document.createElement("div");
    div.id = "hero";
    document.body.appendChild(div);

    const { result } = renderHook(() => useActiveSection(["hero"]));

    expect(result.current).toBe("");
  });

  it("returns the id of the section that becomes intersecting", () => {
    setupIntersectionObserverMock();

    const div = document.createElement("div");
    div.id = "experience";
    document.body.appendChild(div);

    const { result } = renderHook(() => useActiveSection(["experience", "skills"]));

    // Simulate intersection for the experience section
    act(() => {
      const observer = mockObservers[0];
      observer?.callback([
        { isIntersecting: true, target: div } as unknown as IntersectionObserverEntry,
      ]);
    });

    expect(result.current).toBe("experience");
  });

  it("ignores sections that are not intersecting", () => {
    setupIntersectionObserverMock();

    const div = document.createElement("div");
    div.id = "skills";
    document.body.appendChild(div);

    const { result } = renderHook(() => useActiveSection(["skills"]));

    // Simulate non-intersecting event
    act(() => {
      const observer = mockObservers[0];
      observer?.callback([
        { isIntersecting: false, target: div } as unknown as IntersectionObserverEntry,
      ]);
    });

    // State should remain empty string
    expect(result.current).toBe("");
  });

  it("skips null elements gracefully", () => {
    setupIntersectionObserverMock();

    // Do not add any element to the DOM — getElementById returns null
    expect(() => {
      renderHook(() => useActiveSection(["nonexistent"]));
    }).not.toThrow();

    // No observer should have been created for the null element
    expect(mockObservers).toHaveLength(0);
  });

  it("disconnects all observers on unmount", () => {
    setupIntersectionObserverMock();

    const div1 = document.createElement("div");
    div1.id = "section1";
    const div2 = document.createElement("div");
    div2.id = "section2";
    document.body.appendChild(div1);
    document.body.appendChild(div2);

    const { unmount } = renderHook(() => useActiveSection(["section1", "section2"]));

    expect(mockObservers).toHaveLength(2);

    unmount();

    mockObservers.forEach((observer) => {
      expect(observer.disconnect).toHaveBeenCalledTimes(1);
    });
  });

  it("re-subscribes when sectionIds reference changes", () => {
    setupIntersectionObserverMock();

    const div1 = document.createElement("div");
    div1.id = "hero";
    document.body.appendChild(div1);

    const { rerender } = renderHook(
      ({ ids }: { ids: readonly string[] }) => useActiveSection(ids),
      { initialProps: { ids: ["hero"] as readonly string[] } }
    );

    expect(mockObservers).toHaveLength(1);
    const firstObserver = mockObservers[0];

    // Add a new section to DOM
    const div2 = document.createElement("div");
    div2.id = "contact";
    document.body.appendChild(div2);

    // Re-render with new array reference
    rerender({ ids: ["hero", "contact"] as readonly string[] });

    // Previous observer should be disconnected
    expect(firstObserver?.disconnect).toHaveBeenCalledTimes(1);
    // Two new observers should be created
    expect(mockObservers).toHaveLength(3); // 1 original + 2 new
  });
});
