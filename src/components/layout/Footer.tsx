import Link from "next/link";
import { Zap, Mail, MapPin, Phone, Linkedin, Twitter } from "lucide-react";
import { SITE } from "@/lib/siteConfig";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import { SEO_CATEGORY_HUBS } from "@/lib/toolSeoCategories";
import { POPULAR_TOOL_SLUGS, RECENT_TOOL_SLUGS } from "@/lib/toolsHubConfig";

const MAPS_URL = "https://maps.app.goo.gl/Cm1m7Qv2vF5cS7vr7";

export default function Footer() {
  const popularTools = POPULAR_TOOL_SLUGS.slice(0, 6)
    .map((s) => TOOLS_CONFIG.find((t) => t.slug === s))
    .filter(Boolean);
  const recentTools = RECENT_TOOL_SLUGS.slice(0, 5)
    .map((s) => TOOLS_CONFIG.find((t) => t.slug === s))
    .filter(Boolean);

  return (
    <footer className="relative mt-24 border-t border-theme-subtle">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-emerald">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-theme-heading">
                Ranburg<span className="text-accent">.com</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-theme-muted">
              Free online tools for developers, businesses, and SEO professionals — calculators, formatters, and utilities from Ranburg.
            </p>
            <div className="flex gap-3">
              <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-theme bg-theme-surface text-theme-muted hover:border-accent/30 hover:text-accent" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href={SITE.social.twitter} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-theme bg-theme-surface text-theme-muted hover:border-accent/30 hover:text-accent" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-theme-body">Tools</h3>
            <p className="mb-2 text-xs font-medium text-theme-subtle">Popular</p>
            <ul className="space-y-2">
              {popularTools.map((tool) => tool && (
                <li key={tool.slug}>
                  <Link href={`/tools/${tool.slug}`} className="text-sm text-theme-muted hover:text-accent">{tool.title}</Link>
                </li>
              ))}
            </ul>
            <p className="mb-2 mt-4 text-xs font-medium text-theme-subtle">Recently Added</p>
            <ul className="space-y-2">
              {recentTools.map((tool) => tool && (
                <li key={tool.slug}>
                  <Link href={`/tools/${tool.slug}`} className="text-sm text-theme-muted hover:text-accent">{tool.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-theme-body">Categories</h3>
            <ul className="space-y-2">
              {SEO_CATEGORY_HUBS.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/tools/${cat.slug}`} className="text-sm text-theme-muted hover:text-accent">{cat.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/tools" className="text-sm font-medium text-accent hover:underline">All Tools →</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-theme-body">Company</h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About" },
                { href: "/case-studies", label: "Case Studies" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-theme-muted hover:text-accent">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-theme-body">Resources</h3>
            <ul className="space-y-2">
              {[
                { href: "/blog", label: "Blog" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/disclaimer", label: "Disclaimer" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-theme-muted hover:text-accent">{link.label}</Link>
                </li>
              ))}
            </ul>
            <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-theme-body">Contact</h3>
            <ul className="space-y-2 text-sm text-theme-muted">
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5 hover:text-accent">
                  <Mail className="h-3.5 w-3.5" />{SITE.email}
                </a>
              </li>
              <li>
                <a href={`tel:${SITE.phoneTel}`} className="flex items-center gap-1.5 hover:text-accent">
                  <Phone className="h-3.5 w-3.5" />{SITE.phone}
                </a>
              </li>
              <li>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent">
                  <MapPin className="h-3.5 w-3.5" />Jaipur, India
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-theme-subtle pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Ranburg LLP. All rights reserved. Free tools are provided as-is; see Disclaimer.
        </div>
      </div>
    </footer>
  );
}
