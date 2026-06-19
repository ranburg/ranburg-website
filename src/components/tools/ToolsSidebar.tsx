"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { TOOL_CATEGORIES, type ToolCategoryId } from "@/lib/toolsConfig";

interface ToolsSidebarProps {
  activeCategory: ToolCategoryId | "all";
  onCategoryChange: (category: ToolCategoryId | "all") => void;
}

export default function ToolsSidebar({
  activeCategory,
  onCategoryChange,
}: ToolsSidebarProps) {
  return (
    <aside className="space-y-2">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Filter by Category
      </p>
      <Link
        href="/tools/salesforce"
        className="mb-2 block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-accent transition-all hover:bg-accent/10"
      >
        Salesforce Tool Hub
      </Link>
      <button
        type="button"
        onClick={() => onCategoryChange("all")}
        className={cn(
          "w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all",
          activeCategory === "all"
            ? "bg-accent/10 text-accent"
            : "text-theme-muted hover:bg-theme-surface hover:text-slate-900 dark:hover:text-white"
        )}
      >
        All Tools
      </button>
      {TOOL_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onCategoryChange(cat.id)}
          className={cn(
            "w-full rounded-xl px-4 py-3 text-left transition-all",
            activeCategory === cat.id
              ? "bg-accent/10 text-accent"
              : "text-theme-muted hover:bg-theme-surface hover:text-slate-900 dark:hover:text-white"
          )}
        >
          <p className="text-sm font-medium">{cat.label}</p>
          <p className="mt-0.5 text-xs text-slate-600">{cat.description}</p>
        </button>
      ))}
    </aside>
  );
}
