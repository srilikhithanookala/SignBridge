import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("signbridge-theme");
      if (saved === "light" || saved === "dark") {
        return saved;
      }
    } catch {}

    // Default to Navy Dark Mode as requested
    return "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }

    try {
      localStorage.setItem("signbridge-theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => (current === "light" ? "dark" : "light"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-pressed={theme === "dark"}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition shadow-sm hover:opacity-90 active:scale-95"
      style={{
        backgroundColor: "var(--color-surface-alt)",
        color: "var(--color-text)",
        borderColor: "var(--color-border)"
      }}
    >
      {theme === "light" ? (
        <>
          <Moon className="w-4 h-4 text-slate-700" />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 text-amber-300" />
          <span style={{ color: "var(--color-heading)" }}>Light Mode</span>
        </>
      )}
    </button>
  );
}
