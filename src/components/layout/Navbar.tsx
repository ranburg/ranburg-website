"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import ToolsDropdown from "@/components/layout/ToolsDropdown";
import CategoriesDropdown from "@/components/layout/CategoriesDropdown";
import ServicesDropdown from "@/components/layout/ServicesDropdown";
import ThemeToggle from "@/components/theme/ThemeToggle";
import ToolSearch from "@/components/tools/ToolSearch";
import { SEO_CATEGORY_HUBS } from "@/lib/toolSeoCategories";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import { SERVICES_CONFIG } from "@/lib/servicesConfig";
import { getServiceIcon } from "@/lib/serviceIcons";
import { getToolIcon } from "@/lib/toolIcons";

const navLinksAfterTools = [
  { href: "/blog", label: "Blog" },
  { href: "/case-studies", label: "Case Studies" },
];

const navLinkClass = (active: boolean) =>
  cn(
    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:px-4",
    active
      ? "text-slate-900 dark:text-white"
      : "text-theme-muted hover:text-slate-900 dark:hover:text-white"
  );

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isToolsActive = pathname.startsWith("/tools");
  const isServicesActive = pathname.startsWith("/services");
  const isCategoriesActive = SEO_CATEGORY_HUBS.some((c) => pathname === `/tools/${c.slug}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "border-theme-subtle bg-[var(--background)]/95 shadow-lg shadow-black/5 backdrop-blur-md"
            : "glass border-theme-subtle"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-emerald shadow-glow transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-theme-heading">
              Ranburg<span className="text-accent">.com</span>
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            <Link href="/" className={navLinkClass(pathname === "/")}>
              Home
            </Link>
            <ToolsDropdown />
            <CategoriesDropdown />
            {navLinksAfterTools.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClass(pathname === link.href || pathname.startsWith(link.href + "/"))}
              >
                {link.label}
              </Link>
            ))}
            <ServicesDropdown />
            <Link href="/contact" className={navLinkClass(pathname === "/contact")}>
              Contact
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <kbd className="hidden rounded border border-theme-subtle px-2 py-1 text-xs text-theme-subtle lg:inline">⌘K</kbd>
            <ThemeToggle />
            <Link
              href="/tools"
              className="hidden rounded-xl border border-theme px-4 py-2 text-sm font-semibold text-theme-heading hover:border-accent/40 hover:text-accent sm:inline-flex"
            >
              All Tools
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="rounded-lg p-2 text-theme-muted hover:bg-theme-surface hover:text-theme-heading"
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
              className="max-h-[85vh] overflow-y-auto border-t border-theme-subtle bg-[var(--dropdown-bg)] lg:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-4">
                <Link href="/" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-theme-muted hover:bg-theme-surface">
                  Home
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium",
                    isToolsActive && !isCategoriesActive ? "bg-theme-hover text-theme-heading" : "text-theme-muted"
                  )}
                >
                  Tools
                  <ChevronDown className={cn("h-4 w-4 transition-transform", mobileToolsOpen && "rotate-180")} />
                </button>
                {mobileToolsOpen && (
                  <div className="ml-2 space-y-3 border-l border-theme-subtle pl-4">
                    <ToolSearch onResultClick={() => setMobileOpen(false)} maxResults={5} />
                    <Link href="/tools" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-accent">
                      All Tools →
                    </Link>
                    <Link href="/tools/salesforce" onClick={() => setMobileOpen(false)} className="block text-sm text-theme-muted">
                      Salesforce Hub
                    </Link>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium",
                    isCategoriesActive ? "bg-theme-hover text-theme-heading" : "text-theme-muted"
                  )}
                >
                  Categories
                  <ChevronDown className={cn("h-4 w-4 transition-transform", mobileCategoriesOpen && "rotate-180")} />
                </button>
                {mobileCategoriesOpen && (
                  <div className="ml-2 space-y-1 border-l border-theme-subtle pl-4">
                    {SEO_CATEGORY_HUBS.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/tools/${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-theme-muted hover:text-theme-heading"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}

                {navLinksAfterTools.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-theme-muted hover:bg-theme-surface"
                  >
                    {link.label}
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium",
                    isServicesActive ? "bg-theme-hover text-theme-heading" : "text-theme-muted"
                  )}
                >
                  Services
                  <ChevronDown className={cn("h-4 w-4 transition-transform", mobileServicesOpen && "rotate-180")} />
                </button>
                {mobileServicesOpen && (
                  <div className="ml-2 space-y-1 border-l border-theme-subtle pl-4">
                    {SERVICES_CONFIG.map((service) => {
                      const Icon = getServiceIcon(service.icon);
                      return (
                        <Link
                          key={service.slug}
                          href={`/services/${service.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-theme-muted"
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {service.title}
                        </Link>
                      );
                    })}
                  </div>
                )}

                <Link href="/contact" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-theme-muted">
                  Contact
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
