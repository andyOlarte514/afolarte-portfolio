import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isValidTheme = stored === "dark" || stored === "light";
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme = isValidTheme ? (stored as Theme) : systemDark ? "dark" : "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  function toggleTheme(): void {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }

  return { theme, toggleTheme };
}
