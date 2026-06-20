"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import ServicesDropdown from "@/components/layout/ServicesDropdown";
import ToolsSubNav from "@/components/layout/ToolsSubNav";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useCommandPaletteOptional } from "@/components/search/CommandPaletteProvider";
import { SERVICES_CONFIG } from "@/lib/servicesConfig";
import { getServiceIcon } from "@/lib/serviceIcons";

const navLinks = [
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
  const palette = useCommandPaletteOptional();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isToolsActive = pathname.startsWith("/tools");
  const isServicesActive = pathname.startsWith("/services");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const openSearch = () => {
    setMobileOpen(false);
    palette?.setOpen(true);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className={cn(
          "overflow-visible border-b transition-all duration-300",
          scrolled
            ? "border-theme-subtle bg-[var(--background)]/95 shadow-lg shadow-black/5 backdrop-blur-md"
            : "glass border-theme-subtle"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex min-w-0 shrink items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-emerald shadow-glow transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="truncate text-lg font-bold tracking-tight text-theme-heading sm:text-xl">
              Ranburg
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            <Link href="/" className={navLinkClass(pathname === "/")}>
              Home
            </Link>
            <Link href="/tools" className={navLinkClass(isToolsActive)}>
              Tools
            </Link>
            {navLinks.map((link) => (
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

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => palette?.setOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-theme-subtle bg-theme-surface/50 px-3 py-2 text-sm text-theme-subtle transition-colors hover:border-accent/30 hover:text-theme-heading"
              aria-label="Search tools and blogs"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="ml-1 hidden rounded border border-theme-subtle px-1.5 py-0.5 text-xs xl:inline">⌘K</kbd>
            </button>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:hidden">
            <button
              type="button"
              onClick={openSearch}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-theme-muted hover:bg-theme-surface hover:text-theme-heading"
              aria-label="Search tools and blogs"
            >
              <Search className="h-5 w-5" />
            </button>
            <ThemeToggle />
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-theme-muted hover:bg-theme-surface hover:text-theme-heading"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div className="hidden lg:block">
          <ToolsSubNav />
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-theme-subtle bg-[var(--dropdown-bg)] lg:hidden"
            >
              <div className="px-4 py-3">
                <button
                  type="button"
                  onClick={openSearch}
                  className="flex w-full items-center gap-3 rounded-xl border border-theme-subtle bg-theme-surface/50 px-4 py-3 text-left text-sm text-theme-subtle hover:border-accent/30 hover:text-theme-heading"
                >
                  <Search className="h-4 w-4 shrink-0" />
                  Search tools & blogs…
                </button>
              </div>
              <div className="max-h-[65vh] overflow-y-auto overscroll-contain">
                <div className="flex flex-col gap-1 px-4 pb-4">
                  <Link href="/" onClick={closeMobile} className="rounded-lg px-4 py-3 text-sm font-medium text-theme-muted hover:bg-theme-surface">
                    Home
                  </Link>
                  <Link
                    href="/tools"
                    onClick={closeMobile}
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm font-medium",
                      isToolsActive ? "bg-theme-hover text-theme-heading" : "text-theme-muted"
                    )}
                  >
                    Tools
                  </Link>

                  <p className="px-4 pt-2 text-xs font-semibold uppercase tracking-wider text-accent">Tool categories</p>
                  <ToolsSubNav variant="stack" onNavigate={closeMobile} className="px-1" />

                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobile}
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
                            onClick={closeMobile}
                            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-theme-muted"
                          >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            <span className="min-w-0 truncate">{service.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  <Link href="/contact" onClick={closeMobile} className="rounded-lg px-4 py-3 text-sm font-medium text-theme-muted">
                    Contact
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
