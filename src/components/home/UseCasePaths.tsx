import Link from "next/link";
import { ArrowRight, Briefcase, Code2, IndianRupee, Video } from "lucide-react";

const PATHS = [
  {
    title: "Creators",
    description: "Revenue estimates, safe zones, thumbnails, tags, and engagement math.",
    href: "/tools/social-media",
    links: [
      { label: "YouTube revenue", href: "/tools/youtube-revenue-calculator" },
      { label: "Safe zone checker", href: "/tools/safe-zone-checker" },
      { label: "Thumbnail checker", href: "/tools/youtube-thumbnail-checker" },
    ],
    icon: Video,
  },
  {
    title: "India money",
    description: "CTC to in-hand, GST, EMI, SIP, HRA, TDS, and gratuity — FY-aware.",
    href: "/tools/calculators",
    links: [
      { label: "CTC to in-hand", href: "/tools/ctc-in-hand-calculator" },
      { label: "LIC maturity", href: "/tools/lic-maturity-calculator" },
      { label: "PF calculator", href: "/tools/pf-calculator" },
    ],
    icon: IndianRupee,
  },
  {
    title: "Business invoices",
    description: "Multi-country invoices with logo, colors, GST/VAT fields, and PDF download.",
    href: "/tools/business",
    links: [
      { label: "Invoice generator", href: "/tools/invoice-generator" },
      { label: "Profit margin", href: "/tools/profit-margin-calculator" },
      { label: "Runway calculator", href: "/tools/burn-rate-runway-calculator" },
    ],
    icon: Briefcase,
  },
  {
    title: "Developers",
    description: "JSON, JWT, CSV/Excel, regex, Base64, and Salesforce helpers.",
    href: "/tools/developer",
    links: [
      { label: "JSON formatter", href: "/tools/json-formatter" },
      { label: "JWT decoder", href: "/tools/jwt-decoder" },
      { label: "CSV to JSON", href: "/tools/csv-to-json" },
    ],
    icon: Code2,
  },
];

export default function UseCasePaths() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-theme-heading sm:text-4xl">
            Start from what you <span className="text-gradient-accent">need</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-theme-muted">
            Pick a job — not a random grid. Each path jumps into a curated set of tools.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PATHS.map((path) => {
            const Icon = path.icon;
            return (
              <div
                key={path.title}
                className="flex flex-col rounded-3xl border border-theme bg-theme-surface/80 p-5 transition hover:border-accent/35"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-theme-heading">{path.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-theme-muted">{path.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {path.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm font-medium text-accent hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={path.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-theme-heading hover:text-accent"
                >
                  Browse all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
