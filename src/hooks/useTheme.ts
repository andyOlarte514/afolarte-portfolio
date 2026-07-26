import { useEffect, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const DEFAULT_THEME: Theme = "dark";

function resolveTheme(): Theme {
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

function getSnapshot(): Theme {
  return resolveTheme();
}

// SSR and the client's first render before hydration both use this value —
// it never touches window/localStorage, so it can never diverge from the
// server-rendered markup and cause a hydration mismatch. React automatically
// re-renders with the real client snapshot (via getSnapshot) right after
// hydration completes.
function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  function toggleTheme(): void {
    const next: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    notifyListeners();
  }

  return { theme, toggleTheme };
}
