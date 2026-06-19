"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Wrench } from "lucide-react";
import { usePathname } from "next/navigation";
import { TOOL_CATEGORIES, TOOLS_CONFIG } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { cn } from "@/lib/utils";

export default function ToolsDropdown() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isToolsActive = pathname.startsWith("/tools");

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/tools"
        className={cn(
          "relative flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          isToolsActive ? "text-white" : "text-slate-400 hover:text-white"
        )}
      >
        Tools
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
        />
        {isToolsActive && (
          <motion.span
            layoutId="nav-indicator"
            className="absolute inset-0 -z-10 rounded-lg bg-white/[0.06]"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 w-[520px] pt-2"
          >
            <div className="glass overflow-hidden rounded-2xl border border-white/[0.1] shadow-2xl">
              <div className="grid grid-cols-2 gap-0">
                {TOOL_CATEGORIES.map((category) => {
                  const tools = TOOLS_CONFIG.filter((t) => t.category === category.id);
                  return (
                    <div
                      key={category.id}
                      className="border-b border-r border-white/[0.06] p-4 last:border-r-0 odd:last:border-b-0"
                    >
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
                        {category.label}
                      </p>
                      <ul className="space-y-1">
                        {tools.map((tool) => {
                          const Icon = getToolIcon(tool.icon);
                          return (
                            <li key={tool.slug}>
                              <Link
                                href={`/tools/${tool.slug}`}
                                onClick={() => setOpen(false)}
                                className={cn(
                                  "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors",
                                  pathname === `/tools/${tool.slug}`
                                    ? "bg-accent/10 text-accent"
                                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                )}
                              >
                                <Icon className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{tool.title}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <Link
                href="/tools"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 border-t border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-white/[0.04]"
              >
                <Wrench className="h-4 w-4" />
                Browse All Tools
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
