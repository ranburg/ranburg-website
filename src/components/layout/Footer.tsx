import Link from "next/link";
import { Zap, Mail, MapPin, Phone, Linkedin, Twitter } from "lucide-react";
import { SITE } from "@/lib/siteConfig";
import { SERVICES_CONFIG } from "@/lib/servicesConfig";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/blog", label: "Blog" },
    { href: "/tools", label: "Tools" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

const MAPS_URL = "https://maps.app.goo.gl/Cm1m7Qv2vF5cS7vr7";
const salesforceTools = TOOLS_CONFIG.filter((t) => t.category === "salesforce").slice(0, 6);
const topServices = SERVICES_CONFIG.slice(0, 6);

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-theme-subtle">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
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
              Certified Salesforce consultants in Jaipur, India — OmniStudio, Revenue Cloud,
              Industries Cloud, LWC, integrations, and free developer tools.
            </p>
            <div className="flex gap-3">
              <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-theme bg-theme-surface text-theme-muted transition-all hover:border-accent/30 hover:text-accent" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href={SITE.social.twitter} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-theme bg-theme-surface text-theme-muted transition-all hover:border-accent/30 hover:text-accent" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-theme-body">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-theme-muted transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-theme-body">Salesforce Services</h3>
            <ul className="space-y-2">
              {topServices.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className="text-sm text-theme-muted transition-colors hover:text-accent">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-theme-body">Salesforce Tools</h3>
            <ul className="space-y-2">
              {salesforceTools.map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/tools/${tool.slug}`} className="text-sm text-theme-muted transition-colors hover:text-accent">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-theme-subtle pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5 transition-colors hover:text-accent">
              <Mail className="h-4 w-4" />
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phoneTel}`} className="flex items-center gap-1.5 transition-colors hover:text-accent">
              <Phone className="h-4 w-4" />
              {SITE.phone}
            </a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-accent">
              <MapPin className="h-4 w-4" />
              Jaipur, Rajasthan, India
            </a>
            {footerLinks.legal.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-accent">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Ranburg LLP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
