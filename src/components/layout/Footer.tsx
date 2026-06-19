import Link from "next/link";
import { Zap, Mail, MapPin, Linkedin, Twitter, Github } from "lucide-react";
import { TOOL_CATEGORIES, TOOLS_CONFIG } from "@/lib/toolsConfig";

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/about", label: "LLP Registration" },
    { href: "/contact", label: "Privacy Policy" },
    { href: "/contact", label: "Terms of Service" },
  ],
};

const MAPS_URL = "https://maps.app.goo.gl/Cm1m7Qv2vF5cS7vr7";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-emerald">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Ranburg<span className="text-accent">.com</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              A registered Limited Liability Partnership delivering cutting-edge IT
              services, digital transformation, and innovative online tools.
            </p>
            <div className="flex gap-3">
              {[Linkedin, Twitter, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 transition-all hover:border-accent/30 hover:text-accent"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
              company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-400 transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {TOOL_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
                {cat.label.split(" ")[0]}
              </h3>
              <ul className="space-y-2">
                {TOOLS_CONFIG.filter((t) => t.category === cat.id).slice(0, 4).map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-sm text-slate-400 transition-colors hover:text-accent"
                    >
                      {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <a href="mailto:admin@ranburg.com" className="flex items-center gap-1.5 transition-colors hover:text-accent">
              <Mail className="h-4 w-4" />
              admin@ranburg.com
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-accent"
            >
              <MapPin className="h-4 w-4" />
              Find us on Google Maps
            </a>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Ranburg LLP. All rights reserved. Registered
            Limited Liability Partnership.
          </p>
        </div>
      </div>
    </footer>
  );
}
