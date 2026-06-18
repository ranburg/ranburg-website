import Link from "next/link";
import { Zap, Mail, MapPin, Linkedin, Twitter, Github } from "lucide-react";

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ],
  tools: [
    { href: "/tools/sip", label: "SIP Calculator" },
    { href: "/tools/swp", label: "SWP Calculator" },
    { href: "/tools/emi", label: "EMI Calculator" },
  ],
  legal: [
    { href: "/about", label: "LLP Registration" },
    { href: "/contact", label: "Privacy Policy" },
    { href: "/contact", label: "Terms of Service" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
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
              services, digital transformation, and innovative financial tools.
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

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Mail className="h-4 w-4" />
              hello@ranburg.com
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              India
            </span>
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
