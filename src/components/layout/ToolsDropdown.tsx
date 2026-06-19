"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Wrench, Cloud, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { TOOL_CATEGORIES, TOOLS_CONFIG } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import ToolSearch from "@/components/tools/ToolSearch";
import { cn } from "@/lib/utils";

const MEGA_CATEGORY_ORDER = ["financial", "developer", "salesforce", "design", "productivity"] as const;

export default function ToolsDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isToolsActive = pathname.startsWith("/tools");

  const categories = MEGA_CATEGORY_ORDER.map(
    (id) => TOOL_CATEGORIES.find((c) => c.id === id)!
  ).filter(Boolean);

  const close = () => setOpen(false);

  useEffect(() => {
    close();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/tools"
        onClick={close}
        className={cn(
          "relative flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          isToolsActive ? "text-slate-900 dark:text-white" : "text-theme-muted hover:text-slate-900 dark:hover:text-white"
        )}
      >
        Tools
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        {isToolsActive && (
          <motion.span layoutId="nav-indicator" className="absolute inset-0 -z-10 rounded-lg bg-theme-hover" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
        )}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute left-1/2 top-full z-[60] w-[min(800px,calc(100vw-2rem))] -translate-x-1/2 pt-2"
          >
            <div className="dropdown-panel max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl shadow-2xl">
              <div className="sticky top-0 z-10 border-b border-theme-subtle bg-[var(--dropdown-bg)] p-4">
                <ToolSearch onResultClick={close} maxResults={6} compact placeholder="Search tools…" />
              </div>

              <div className="grid lg:grid-cols-[180px_1fr]">
                <div className="border-b border-theme-subtle bg-accent/5 p-4 lg:border-b-0 lg:border-r">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">Featured</p>
                  <Link
                    href="/tools/salesforce"
                    onClick={close}
                    className="mt-3 flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-theme-surface"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
                      <Cloud className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-theme-heading">Salesforce Tool Hub</p>
                      <p className="mt-0.5 text-xs text-theme-muted line-clamp-2">Formula, SOQL, Apex & Revenue Cloud</p>
                    </div>
                  </Link>
                  <Link
                    href="/tools"
                    onClick={close}
                    className="mt-2 flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-accent hover:bg-theme-surface"
                  >
                    <Wrench className="h-4 w-4 shrink-0" /> All {TOOLS_CONFIG.length} Tools
                  </Link>
                </div>

                <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => {
                    const tools = TOOLS_CONFIG.filter((t) => t.category === category.id);
                    const featured = tools.slice(0, 3);
                    return (
                      <div key={category.id} className="border-b border-r border-theme-subtle p-3 last:border-r-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent">{category.label}</p>
                        <p className="mt-0.5 text-xs text-theme-subtle line-clamp-1">{category.description}</p>
                        <ul className="mt-2 space-y-0.5">
                          {featured.map((tool) => {
                            const Icon = getToolIcon(tool.icon);
                            return (
                              <li key={tool.slug}>
                                <Link
                                  href={`/tools/${tool.slug}`}
                                  onClick={close}
                                  className={cn(
                                    "group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
                                    pathname === `/tools/${tool.slug}` ? "bg-accent/10 text-accent" : "hover:bg-theme-surface"
                                  )}
                                >
                                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                  <div className="min-w-0">
                                    <span className="block truncate text-sm font-medium text-theme-heading group-hover:text-accent">{tool.title}</span>
                                    <span className="block truncate text-xs text-theme-subtle">{tool.shortDescription}</span>
                                  </div>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                        {tools.length > featured.length && (
                          <Link
                            href={category.id === "salesforce" ? "/tools/salesforce" : "/tools"}
                            onClick={close}
                            className="mt-1.5 flex items-center gap-1 px-2 text-xs font-medium text-accent hover:underline"
                          >
                            +{tools.length - featured.length} more <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
