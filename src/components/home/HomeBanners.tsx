import type { CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, FileText, Files, ShieldCheck } from "lucide-react";
import { CATALOG_SECTIONS } from "@/lib/catalogDirectory";
import { getToolIcon } from "@/lib/toolIcons";
import { iconWell } from "@/components/tools/iconWell";

const PROMOS = [
  {
    href: "/privacy",
    icon: ShieldCheck,
    gradient: "from-[#0D9B8A] to-[#0D0D0D]",
    title: "Private by design",
    body: "PDFs, photos, and invoices are processed on your device. Nothing is uploaded to Ranburg.",
    cta: "Read privacy",
  },
  {
    href: "/tools/invoice-generator",
    icon: FileText,
    gradient: "from-[#0D0D0D] to-[#0D9B8A]",
    title: "GST-ready invoices",
    body: "Logo, GST / VAT, and PDF download in about two minutes. No account required.",
    cta: "Create an invoice",
  },
  {
    href: "/tools/pdf-merge",
    icon: Files,
    gradient: "from-[#0D9B8A] to-[#2EE6C8]",
    title: "Merge PDF files in the browser",
    body: "Merge, split, compress, reorder, and extract text — drag and drop, then download.",
    cta: "Open PDF merge",
  },
] as const;

const stagger = (i: number, step = 90) => ({ "--reveal-delay": `${i * step}ms` }) as CSSProperties;

export default function HomeBanners() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {PROMOS.map((promo, i) => {
            const Icon = promo.icon;
            return (
              <Link
                key={promo.href}
                href={promo.href}
                data-reveal="up"
                style={stagger(i)}
                className="card spotlight group relative flex flex-col overflow-hidden p-6 transition-colors duration-300 hover:border-accent/40 sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <div {...iconWell(promo.gradient, "h-12 w-12 rounded-2xl transition-transform duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-110")}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-theme-subtle bg-theme-surface text-theme-muted transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <h2 className="mt-8 text-xl font-medium text-theme-heading sm:text-2xl">{promo.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-theme-muted sm:text-base">{promo.body}</p>
                <span className="mt-6 text-sm font-medium text-accent">{promo.cta}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATALOG_SECTIONS.map((section, i) => {
            const Icon = getToolIcon(section.icon);
            return (
              <Link
                key={section.id}
                href={`#${section.id}`}
                data-reveal="up"
                style={stagger(i, 60)}
                className="group flex items-center gap-3 rounded-2xl border border-theme-subtle bg-[var(--surface-elevated)] px-4 py-3.5 transition-colors duration-300 hover:border-accent/40"
              >
                <span {...iconWell(section.gradient, "h-10 w-10 rounded-xl")}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-theme-heading">{section.label}</span>
                  <span className="block truncate text-xs text-theme-muted">{section.slugs.length} tools</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 rotate-90 text-theme-subtle transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-accent" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
