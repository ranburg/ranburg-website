"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-lg border transition-all",
        "border-slate-200 bg-slate-100 text-slate-600 hover:border-accent/40 hover:text-accent",
        "dark:border-theme dark:bg-theme-surface dark:text-theme-muted dark:hover:text-slate-900 dark:hover:text-white",
        className
      )}
    >
      {mounted ? (
        theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4 opacity-0" />
      )}
    </button>
  );
}
