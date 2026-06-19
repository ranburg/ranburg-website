"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import ToolsDropdown from "@/components/layout/ToolsDropdown";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { TOOL_CATEGORIES, TOOLS_CONFIG } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

const navLinkClass = (active: boolean) =>
  cn(
    "relative rounded-lg px-4 py-2 text-sm font-medium transition-colors",
    active
      ? "text-slate-900 dark:text-white"
      : "text-theme-muted hover:text-slate-900 dark:hover:text-slate-900 dark:hover:text-white"
  );

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const isToolsActive = pathname.startsWith("/tools");

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="glass border-b border-theme-subtle">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-emerald shadow-glow transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-theme-heading">
              Ranburg<span className="text-accent">.com</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.slice(0, 3).map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass(pathname === link.href)}>
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 -z-10 rounded-lg bg-theme-hover"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
            <ToolsDropdown />
            <Link href="/contact" className={navLinkClass(pathname === "/contact")}>
              Contact
              {pathname === "/contact" && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 -z-10 rounded-lg bg-theme-hover"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link
              href="/contact"
              className="rounded-xl bg-gradient-to-r from-accent to-blue-600 px-5 py-2.5 text-sm font-semibold text-theme-heading shadow-glow transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] active:scale-[0.98]"
            >
              Get a Free Consultation
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="rounded-lg p-2 text-theme-muted transition-colors hover:bg-theme-surface hover:text-slate-900 dark:hover:text-slate-900 dark:hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-h-[80vh] overflow-y-auto border-t border-theme-subtle bg-[var(--dropdown-bg)] md:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-theme-hover text-slate-900 dark:text-white"
                        : "text-theme-muted hover:bg-theme-surface hover:text-slate-900 dark:hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium",
                    isToolsActive
                      ? "bg-theme-hover text-slate-900 dark:text-white"
                      : "text-theme-muted"
                  )}
                >
                  Tools
                  <ChevronDown className={cn("h-4 w-4 transition-transform", mobileToolsOpen && "rotate-180")} />
                </button>

                {mobileToolsOpen && (
                  <div className="ml-2 space-y-4 border-l border-theme-subtle pl-4">
                    {TOOL_CATEGORIES.map((cat) => (
                      <div key={cat.id}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
                          {cat.label}
                        </p>
                        {TOOLS_CONFIG.filter((t) => t.category === cat.id).map((tool) => {
                          const Icon = getToolIcon(tool.icon);
                          return (
                            <Link
                              key={tool.slug}
                              href={`/tools/${tool.slug}`}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-theme-muted hover:text-slate-900 dark:hover:text-slate-900 dark:hover:text-white"
                            >
                              <Icon className="h-3.5 w-3.5" />
                              {tool.title}
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 rounded-xl bg-gradient-to-r from-accent to-blue-600 px-4 py-3 text-center text-sm font-semibold text-theme-heading"
                >
                  Get a Free Consultation
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
