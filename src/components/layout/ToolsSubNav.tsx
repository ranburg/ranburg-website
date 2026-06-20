"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  id,
  label,
  tools,
  hubHref,
  active,
  open,
  onOpenChange,
  onNavigate,
}: {
  id: string;
  label: string;
  tools: { slug: string; title: string; icon: string }[];
  hubHref: string;
  active: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const panelWidth = 260;
    let left = rect.left;
    if (left + panelWidth > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - panelWidth - 12);
    }
    setPosition({ top: rect.bottom + 6, left });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      onOpenChange(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open, onOpenChange]);

  const close = () => {
    onOpenChange(false);
    onNavigate?.();
  };

  const panel =
    open && mounted ? (
      <div
        ref={panelRef}
        id={`tools-subnav-panel-${id}`}
        role="menu"
        className="dropdown-panel fixed z-[200] max-h-[min(360px,50dvh)] min-w-[220px] max-w-[280px] overflow-y-auto rounded-xl border border-theme-subtle py-2 shadow-2xl"
        style={{ top: position.top, left: position.left }}
      >
        <ul className="space-y-0.5 px-1">
          {tools.map((tool) => {
            const Icon = getToolIcon(tool.icon);
            return (
              <li key={tool.slug} role="none">
                <Link
                  href={`/tools/${tool.slug}`}
                  role="menuitem"
                  onClick={close}
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
            role="menuitem"
            onClick={close}
            className="block rounded-lg px-2.5 py-2 text-xs font-medium text-accent hover:bg-theme-surface"
          >
            View all {label} →
          </Link>
        </div>
      </div>
    ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        id={`tools-subnav-trigger-${id}`}
        onClick={() => {
          if (!open) updatePosition();
          onOpenChange(!open);
        }}
        className={cn(
          "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm",
          active || open
            ? "bg-accent/10 text-accent"
            : "text-theme-muted hover:bg-theme-surface hover:text-theme-heading"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? `tools-subnav-panel-${id}` : undefined}
      >
        {label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {panel && createPortal(panel, document.body)}
    </>
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
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    setOpenCategory(null);
  }, [pathname]);

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
    <div className={cn("overflow-visible border-t border-theme-subtle bg-[var(--background)]/90 backdrop-blur-sm", className)}>
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto overflow-y-visible px-4 py-1.5 scrollbar-none sm:gap-2 sm:px-6 lg:px-8">
        {PRIMARY_CATEGORY_SLUGS.map((slug) => {
          const hub = getSeoCategoryHub(slug);
          if (!hub) return null;
          const tools = getToolsForSeoCategory(slug);
          const isActive =
            pathname === `/tools/${slug}` || tools.some((t) => pathname === `/tools/${t.slug}`);

          return (
            <CategoryDropdown
              key={slug}
              id={slug}
              label={hub.label.replace(/ Tools$/, "")}
              tools={tools.map((t) => ({ slug: t.slug, title: t.title, icon: t.icon }))}
              hubHref={`/tools/${slug}`}
              active={isActive}
              open={openCategory === slug}
              onOpenChange={(next) => setOpenCategory(next ? slug : null)}
              onNavigate={onNavigate}
            />
          );
        })}
        <CategoryDropdown
          id="salesforce"
          label="Salesforce"
          tools={SALESFORCE_TOOLS.map((t) => ({ slug: t.slug, title: t.title, icon: t.icon }))}
          hubHref="/tools/salesforce"
          active={
            pathname.startsWith("/tools/salesforce") ||
            SALESFORCE_TOOLS.some((t) => pathname === `/tools/${t.slug}`)
          }
          open={openCategory === "salesforce"}
          onOpenChange={(next) => setOpenCategory(next ? "salesforce" : null)}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}
