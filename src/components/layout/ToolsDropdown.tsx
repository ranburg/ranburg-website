"use client";

import Link from "next/link";
import { useState } from "react";
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
  const pathname = usePathname();
  const isToolsActive = pathname.startsWith("/tools");

  const categories = MEGA_CATEGORY_ORDER.map(
    (id) => TOOL_CATEGORIES.find((c) => c.id === id)!
  ).filter(Boolean);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        href="/tools"
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
            className="absolute left-1/2 top-full z-[60] w-[min(920px,calc(100vw-2rem))] -translate-x-1/2 pt-2"
          >
            <div className="dropdown-panel overflow-hidden rounded-2xl shadow-2xl">
              <div className="border-b border-theme-subtle p-4">
                <ToolSearch onResultClick={() => setOpen(false)} maxResults={6} />
              </div>

              <div className="grid lg:grid-cols-[200px_1fr]">
                <div className="border-b border-theme-subtle bg-accent/5 p-4 lg:border-b-0 lg:border-r">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">Featured</p>
                  <Link
                    href="/tools/salesforce"
                    onClick={() => setOpen(false)}
                    className="mt-3 flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-theme-surface"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
                      <Cloud className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-theme-heading">Salesforce Tool Hub</p>
                      <p className="mt-0.5 text-xs text-theme-muted">Formula, SOQL, Apex & Revenue Cloud tools</p>
                    </div>
                  </Link>
                  <Link
                    href="/tools"
                    onClick={() => setOpen(false)}
                    className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-accent hover:bg-theme-surface"
                  >
                    <Wrench className="h-4 w-4" /> All {TOOLS_CONFIG.length} Tools
                  </Link>
                </div>

                <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => {
                    const tools = TOOLS_CONFIG.filter((t) => t.category === category.id);
                    const featured = category.id === "financial" ? tools.slice(0, 3) : tools.slice(0, 4);
                    return (
                      <div key={category.id} className="border-b border-r border-theme-subtle p-4 last:border-r-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent">{category.label}</p>
                        <p className="mt-1 text-xs text-theme-subtle line-clamp-2">{category.description}</p>
                        <ul className="mt-3 space-y-1">
                          {featured.map((tool) => {
                            const Icon = getToolIcon(tool.icon);
                            return (
                              <li key={tool.slug}>
                                <Link
                                  href={`/tools/${tool.slug}`}
                                  onClick={() => setOpen(false)}
                                  className={cn(
                                    "group flex items-start gap-2 rounded-lg px-2 py-1.5 transition-colors",
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
                          <Link href={category.id === "salesforce" ? "/tools/salesforce" : "/tools"} onClick={() => setOpen(false)} className="mt-2 flex items-center gap-1 text-xs font-medium text-accent hover:underline">
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
