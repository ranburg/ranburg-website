"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, Mail, MapPin, Phone, Linkedin, Twitter, Facebook, Instagram, Youtube } from "lucide-react";
import { SITE } from "@/lib/siteConfig";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import { SEO_CATEGORY_HUBS } from "@/lib/toolSeoCategories";
import { POPULAR_TOOL_SLUGS, RECENT_TOOL_SLUGS } from "@/lib/toolsHubConfig";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import BrandLogo from "@/components/brand/BrandLogo";
import Marquee from "@/components/motion/Marquee";

const SOCIAL_LINKS = [
  { href: SITE.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: SITE.social.twitter, label: "X (Twitter)", Icon: Twitter },
  { href: SITE.social.facebook, label: "Facebook", Icon: Facebook },
  { href: SITE.social.instagram, label: "Instagram", Icon: Instagram },
  { href: SITE.social.youtube, label: "YouTube", Icon: Youtube },
] as const;

const headingClass = "mb-4 text-xs font-medium uppercase tracking-[0.18em] text-theme-subtle";
const linkClass = "link-underline text-sm text-theme-muted transition-colors hover:text-theme-heading";

export default function Footer() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");

  // Use canonical English titles from TOOLS_CONFIG — avoids shipping tools.meta (~153KB) to every page.
  const popularTools = POPULAR_TOOL_SLUGS.slice(0, 6)
    .map((s) => TOOLS_CONFIG.find((item) => item.slug === s))
    .filter(Boolean);
  const recentTools = RECENT_TOOL_SLUGS.slice(0, 5)
    .map((s) => TOOLS_CONFIG.find((item) => item.slug === s))
    .filter(Boolean);

  return (
    <footer className="relative mt-24">
      <div className="border-y border-theme-subtle py-5" aria-hidden>
        <Marquee duration={48} gap="2.5rem">
          {SEO_CATEGORY_HUBS.map((cat) => (
            <span key={cat.slug} className="flex items-center gap-10 whitespace-nowrap text-sm uppercase tracking-[0.22em] text-theme-subtle">
              {cat.label}
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="space-y-5 lg:col-span-2" data-reveal="up">
            <Link href="/" className="flex items-center" aria-label="Ranburg home">
              <BrandLogo />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-theme-muted">{t("tagline")}</p>
            <LanguageSwitcher className="max-w-[11rem]" />
            <div className="flex flex-wrap gap-2">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-theme-subtle bg-theme-surface text-theme-muted transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:text-accent"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div data-reveal="up" style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
            <h3 className={headingClass}>{tCommon("tools")}</h3>
            <p className="mb-2 text-xs font-medium text-theme-subtle">{t("popularTools")}</p>
            <ul className="space-y-2">
              {popularTools.map((tool) => tool && (
                <li key={tool.slug}>
                  <Link href={`/tools/${tool.slug}`} className={linkClass}>
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mb-2 mt-5 text-xs font-medium text-theme-subtle">{t("recentTools")}</p>
            <ul className="space-y-2">
              {recentTools.map((tool) => tool && (
                <li key={tool.slug}>
                  <Link href={`/tools/${tool.slug}`} className={linkClass}>
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal="up" style={{ "--reveal-delay": "160ms" } as React.CSSProperties}>
            <h3 className={headingClass}>{tCommon("allCategories")}</h3>
            <ul className="space-y-2">
              {SEO_CATEGORY_HUBS.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/tools/${cat.slug}`} className={linkClass}>{cat.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/tools" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                  {t("allTools")} →
                </Link>
              </li>
            </ul>
          </div>

          <div data-reveal="up" style={{ "--reveal-delay": "240ms" } as React.CSSProperties}>
            <h3 className={headingClass}>{t("company")}</h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: t("about") },
                { href: "/case-studies", label: t("caseStudies") },
                { href: "/contact", label: t("contact") },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal="up" style={{ "--reveal-delay": "320ms" } as React.CSSProperties}>
            <h3 className={headingClass}>{t("resources")}</h3>
            <ul className="space-y-2">
              {[
                { href: "/blog", label: t("blog") },
                { href: "/privacy", label: t("privacy") },
                { href: "/terms", label: t("terms") },
                { href: "/disclaimer", label: t("disclaimer") },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>{link.label}</Link>
                </li>
              ))}
            </ul>
            <h3 className={`${headingClass} mt-7`}>{t("contact")}</h3>
            <address className="not-italic">
              <ul className="space-y-2.5 text-sm text-theme-muted">
                <li>
                  <Link href="/contact" className="flex items-center gap-2 transition-colors hover:text-theme-heading">
                    <Mail className="h-3.5 w-3.5 text-accent" />{t("contact")}
                  </Link>
                </li>
                <li>
                  <a href={`tel:${SITE.phoneTel}`} className="flex items-center gap-2 transition-colors hover:text-theme-heading">
                    <Phone className="h-3.5 w-3.5 text-accent" />{SITE.phone}
                  </a>
                </li>
                <li>
                  <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 transition-colors hover:text-theme-heading">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                    <span>{SITE.address.formatted}</span>
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-theme-subtle pt-8 text-xs text-theme-subtle sm:flex-row">
          <p>{t("rights", { year: new Date().getFullYear() })}</p>
          <a href="#main-content" className="group inline-flex items-center gap-1.5 transition-colors hover:text-theme-heading">
            Back to top
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
