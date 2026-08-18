"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, MapPin, Phone, Linkedin, Twitter, Facebook, Instagram, Youtube } from "lucide-react";
import { SITE } from "@/lib/siteConfig";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import { SEO_CATEGORY_HUBS } from "@/lib/toolSeoCategories";
import { POPULAR_TOOL_SLUGS, RECENT_TOOL_SLUGS } from "@/lib/toolsHubConfig";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import BrandLogo from "@/components/brand/BrandLogo";

const SOCIAL_LINKS = [
  { href: SITE.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: SITE.social.twitter, label: "X (Twitter)", Icon: Twitter },
  { href: SITE.social.facebook, label: "Facebook", Icon: Facebook },
  { href: SITE.social.instagram, label: "Instagram", Icon: Instagram },
  { href: SITE.social.youtube, label: "YouTube", Icon: Youtube },
] as const;

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
    <footer className="relative mt-24 border-t border-theme-subtle">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <BrandLogo />
              <span className="text-xl font-bold text-theme-heading">
                Ranburg<span className="text-accent">.com</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-theme-muted">{t("tagline")}</p>
            <LanguageSwitcher />
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-theme bg-theme-surface text-theme-muted hover:border-accent/30 hover:text-accent"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-theme-body">{tCommon("tools")}</h3>
            <p className="mb-2 text-xs font-medium text-theme-subtle">{t("popularTools")}</p>
            <ul className="space-y-2">
              {popularTools.map((tool) => tool && (
                <li key={tool.slug}>
                  <Link href={`/tools/${tool.slug}`} className="text-sm text-theme-muted hover:text-accent">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mb-2 mt-4 text-xs font-medium text-theme-subtle">{t("recentTools")}</p>
            <ul className="space-y-2">
              {recentTools.map((tool) => tool && (
                <li key={tool.slug}>
                  <Link href={`/tools/${tool.slug}`} className="text-sm text-theme-muted hover:text-accent">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-theme-body">{tCommon("allCategories")}</h3>
            <ul className="space-y-2">
              {SEO_CATEGORY_HUBS.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/tools/${cat.slug}`} className="text-sm text-theme-muted hover:text-accent">{cat.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/tools" className="text-sm font-medium text-accent hover:underline">{t("allTools")} →</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-theme-body">{t("company")}</h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: t("about") },
                { href: "/case-studies", label: t("caseStudies") },
                { href: "/contact", label: t("contact") },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-theme-muted hover:text-accent">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-theme-body">{t("resources")}</h3>
            <ul className="space-y-2">
              {[
                { href: "/blog", label: t("blog") },
                { href: "/privacy", label: t("privacy") },
                { href: "/terms", label: t("terms") },
                { href: "/disclaimer", label: t("disclaimer") },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-theme-muted hover:text-accent">{link.label}</Link>
                </li>
              ))}
            </ul>
            <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-theme-body">{t("contact")}</h3>
            <address className="not-italic">
              <ul className="space-y-2 text-sm text-theme-muted">
                <li>
                  <Link href="/contact" className="flex items-center gap-1.5 hover:text-accent">
                    <Mail className="h-3.5 w-3.5" />{t("contact")}
                  </Link>
                </li>
                <li>
                  <a href={`tel:${SITE.phoneTel}`} className="flex items-center gap-1.5 hover:text-accent">
                    <Phone className="h-3.5 w-3.5" />{SITE.phone}
                  </a>
                </li>
                <li>
                  <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5 hover:text-accent">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{SITE.address.formatted}</span>
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>

        <div className="mt-12 border-t border-theme-subtle pt-8 text-center text-xs text-slate-500">
          {t("rights", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
