"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  getSeoCategoryHub,
  getToolsForSeoCategory,
  PRIMARY_CATEGORY_SLUGS,
} from "@/lib/toolSeoCategories";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { cn } from "@/lib/utils";

const SALESFORCE_TOOLS = TOOLS_CONFIG.filter((t) => t.category === "salesforce");

function CategoryDropdown({
  label,
  tools,
  hubHref,
  active,
  onClose,
}: {
  label: string;
  tools: { slug: string; title: string; icon: string }[];
  hubHref: string;
  active: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm",
          active || open
            ? "bg-accent/10 text-accent"
            : "text-theme-muted hover:bg-theme-surface hover:text-theme-heading"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute left-0 top-full z-[70] min-w-[220px] max-w-[280px] pt-1"
          >
            <div className="dropdown-panel max-h-[min(360px,50dvh)] overflow-y-auto rounded-xl py-2 shadow-xl">
              <ul className="space-y-0.5 px-1">
                {tools.map((tool) => {
                  const Icon = getToolIcon(tool.icon);
                  return (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        onClick={() => {
                          setOpen(false);
                          onClose();
                        }}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-theme-muted hover:bg-theme-surface hover:text-accent"
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{tool.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-1 border-t border-theme-subtle px-2 pt-1">
                <Link
                  href={hubHref}
                  onClick={() => {
                    setOpen(false);
                    onClose();
                  }}
                  className="block rounded-lg px-2.5 py-2 text-xs font-medium text-accent hover:bg-theme-surface"
                >
                  View all {label} →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ToolsSubNavProps {
  className?: string;
  onNavigate?: () => void;
  variant?: "bar" | "stack";
}

export default function ToolsSubNav({ className, onNavigate, variant = "bar" }: ToolsSubNavProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);

  const isStack = variant === "stack";

  if (isStack) {
    return (
      <div className={cn("space-y-1", className)}>
        {PRIMARY_CATEGORY_SLUGS.map((slug) => {
          const hub = getSeoCategoryHub(slug);
          if (!hub) return null;
          const tools = getToolsForSeoCategory(slug);
          const isOpen = expanded === slug;
          const isActive = pathname === `/tools/${slug}` || tools.some((t) => pathname === `/tools/${t.slug}`);

          return (
            <div key={slug}>
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : slug)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium",
                  isActive ? "bg-theme-hover text-theme-heading" : "text-theme-muted"
                )}
              >
                {hub.label}
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <div className="ml-2 space-y-0.5 border-l border-theme-subtle py-1 pl-3">
                  {tools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      onClick={onNavigate}
                      className="block rounded-lg px-3 py-2 text-sm text-theme-muted hover:text-accent"
                    >
                      {tool.title}
                    </Link>
                  ))}
                  <Link
                    href={`/tools/${slug}`}
                    onClick={onNavigate}
                    className="block px-3 py-2 text-xs font-medium text-accent"
                  >
                    View all →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
        <div>
          <button
            type="button"
            onClick={() => setExpanded(expanded === "salesforce" ? null : "salesforce")}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium",
              pathname.startsWith("/tools/salesforce") || SALESFORCE_TOOLS.some((t) => pathname === `/tools/${t.slug}`)
                ? "bg-theme-hover text-theme-heading"
                : "text-theme-muted"
            )}
          >
            Salesforce Tools
            <ChevronDown className={cn("h-4 w-4 transition-transform", expanded === "salesforce" && "rotate-180")} />
          </button>
          {expanded === "salesforce" && (
            <div className="ml-2 space-y-0.5 border-l border-theme-subtle py-1 pl-3">
              {SALESFORCE_TOOLS.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  onClick={onNavigate}
                  className="block rounded-lg px-3 py-2 text-sm text-theme-muted hover:text-accent"
                >
                  {tool.title}
                </Link>
              ))}
              <Link href="/tools/salesforce" onClick={onNavigate} className="block px-3 py-2 text-xs font-medium text-accent">
                View hub →
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-t border-theme-subtle bg-[var(--background)]/90 backdrop-blur-sm",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-1.5 scrollbar-none sm:gap-2 sm:px-6 lg:px-8">
        {PRIMARY_CATEGORY_SLUGS.map((slug) => {
          const hub = getSeoCategoryHub(slug);
          if (!hub) return null;
          const tools = getToolsForSeoCategory(slug);
          const isActive =
            pathname === `/tools/${slug}` || tools.some((t) => pathname === `/tools/${t.slug}`);

          return (
            <CategoryDropdown
              key={slug}
              label={hub.label.replace(/ Tools$/, "")}
              tools={tools.map((t) => ({ slug: t.slug, title: t.title, icon: t.icon }))}
              hubHref={`/tools/${slug}`}
              active={isActive}
              onClose={() => onNavigate?.()}
            />
          );
        })}
        <CategoryDropdown
          label="Salesforce"
          tools={SALESFORCE_TOOLS.map((t) => ({ slug: t.slug, title: t.title, icon: t.icon }))}
          hubHref="/tools/salesforce"
          active={
            pathname.startsWith("/tools/salesforce") ||
            SALESFORCE_TOOLS.some((t) => pathname === `/tools/${t.slug}`)
          }
          onClose={() => onNavigate?.()}
        />
      </div>
    </div>
  );
}
