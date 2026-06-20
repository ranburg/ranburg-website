"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Grid3X3 } from "lucide-react";
import { usePathname } from "next/navigation";
import { SEO_CATEGORY_HUBS, PRIMARY_CATEGORY_SLUGS } from "@/lib/toolSeoCategories";
import { getToolIcon } from "@/lib/toolIcons";
import { cn } from "@/lib/utils";

export default function CategoriesDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isActive = SEO_CATEGORY_HUBS.some((c) => pathname === `/tools/${c.slug}`);

  const close = () => setOpen(false);

  useEffect(() => {
    close();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "relative flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          isActive ? "text-slate-900 dark:text-white" : "text-theme-muted hover:text-slate-900 dark:hover:text-white"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Categories
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute left-0 top-full z-[60] w-[min(520px,calc(100vw-2rem))] pt-2"
          >
            <div className="dropdown-panel rounded-2xl p-4 shadow-2xl">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                <Grid3X3 className="h-3.5 w-3.5" /> Browse by category
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {PRIMARY_CATEGORY_SLUGS.map((slug) => {
                  const cat = SEO_CATEGORY_HUBS.find((c) => c.slug === slug);
                  if (!cat) return null;
                  const Icon = getToolIcon(cat.icon);
                  return (
                    <Link
                      key={cat.slug}
                      href={`/tools/${cat.slug}`}
                      onClick={close}
                      className={cn(
                        "flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-theme-surface",
                        pathname === `/tools/${cat.slug}` && "bg-accent/10"
                      )}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${cat.gradient}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-theme-heading">{cat.label}</p>
                        <p className="mt-0.5 text-xs text-theme-subtle line-clamp-2">{cat.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Link
                href="/tools"
                onClick={close}
                className="mt-3 block rounded-lg border border-theme-subtle py-2.5 text-center text-sm font-medium text-accent hover:bg-theme-surface"
              >
                View all tools →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
