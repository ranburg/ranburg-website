"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import PersonaSelector from "@/components/persona/PersonaSelector";
import BrandLogo from "@/components/brand/BrandLogo";
import { useCommandPaletteOptional } from "@/components/search/CommandPaletteProvider";
import { getSeoCategoryHub, PRIMARY_CATEGORY_SLUGS } from "@/lib/toolSeoCategories";

const iconButtonClass =
  "flex h-10 w-10 items-center justify-center rounded-xl border border-theme-subtle bg-theme-surface text-theme-muted transition-colors hover:border-accent/40 hover:text-theme-heading";

export default function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const palette = useCommandPaletteOptional();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const links = [
    { href: "/", label: t("home") },
    { href: "/tools", label: t("tools") },
    { href: "/blog", label: t("blog") },
    { href: "/case-studies", label: t("caseStudies") },
    { href: "/contact", label: t("contact") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const openSearch = () => {
    setMobileOpen(false);
    palette?.setOpen(true);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        className={cn(
          "glass mx-auto max-w-7xl overflow-visible rounded-2xl transition-[box-shadow,background-color,border-color] duration-500",
          scrolled || mobileOpen
            ? "shadow-[0_18px_50px_-24px_rgb(var(--shadow-color)/0.7)]"
            : "shadow-none"
        )}
      >
        <div className="flex h-[3.75rem] items-center justify-between gap-2 px-3 sm:px-4">
          <Link href="/" className="group flex min-w-0 shrink items-center" aria-label="Ranburg home">
            <BrandLogo className="transition-transform duration-300 group-hover:scale-[1.03]" />
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm transition-colors xl:px-4",
                    active ? "text-theme-heading" : "text-theme-muted hover:text-theme-heading"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-theme-surface"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <PersonaSelector />
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => palette?.setOpen(true)}
              className="flex h-10 items-center gap-2 rounded-xl border border-theme-subtle bg-theme-surface px-3 text-sm text-theme-muted transition-colors hover:border-accent/40 hover:text-theme-heading"
              aria-label={t("searchAria")}
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="hidden xl:inline">{t("search")}</span>
              <kbd className="ms-1 hidden rounded border border-theme-subtle px-1.5 py-0.5 text-[11px] xl:inline">⌘K</kbd>
            </button>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-1.5 lg:hidden">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <button type="button" onClick={openSearch} className={iconButtonClass} aria-label={t("searchAria")}>
              <Search className="h-[18px] w-[18px]" />
            </button>
            <ThemeToggle />
            <button
              type="button"
              className={iconButtonClass}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={mobileOpen}
            >
              <span className="relative block h-3.5 w-5" aria-hidden>
                <span
                  className={cn(
                    "absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out-expo",
                    mobileOpen ? "top-1.5 rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-current transition-all duration-300",
                    mobileOpen ? "opacity-0" : "opacity-100"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out-expo",
                    mobileOpen ? "top-1.5 -rotate-45" : "top-3"
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-theme-subtle lg:hidden"
            >
              <div className="px-3 py-3">
                <LanguageSwitcher className="mb-3 w-full" />
                <PersonaSelector variant="stack" onNavigate={closeMobile} className="mb-3" />
                <button
                  type="button"
                  onClick={openSearch}
                  className="flex w-full items-center gap-3 rounded-xl border border-theme-subtle bg-theme-surface px-4 py-3 text-left text-sm text-theme-subtle hover:border-accent/30 hover:text-theme-heading"
                >
                  <Search className="h-4 w-4 shrink-0" />
                  {t("searchPlaceholder")}
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
                <div className="flex flex-col gap-1 px-3 pb-4">
                  {links.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i + 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMobile}
                        className={cn(
                          "block rounded-xl px-4 py-3 text-base",
                          isActive(link.href)
                            ? "bg-theme-surface text-theme-heading"
                            : "text-theme-muted hover:bg-theme-surface hover:text-theme-heading"
                        )}
                      >
                        {link.label}
                      </Link>
                      {link.href === "/tools" && (
                        <div className="grid grid-cols-2 gap-1 px-1 py-2">
                          {PRIMARY_CATEGORY_SLUGS.map((slug) => {
                            const hub = getSeoCategoryHub(slug);
                            if (!hub) return null;
                            return (
                              <Link
                                key={slug}
                                href={`/tools/${slug}`}
                                onClick={closeMobile}
                                className="rounded-lg px-3 py-2 text-xs font-medium text-theme-muted hover:bg-theme-surface hover:text-accent"
                              >
                                {hub.label.replace(/ Tools$/, "")}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
