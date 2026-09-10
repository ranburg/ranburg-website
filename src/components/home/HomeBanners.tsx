import { Link } from "@/i18n/navigation";
import { ArrowRight, FileText, Files, ShieldCheck } from "lucide-react";
import { CATALOG_SECTIONS } from "@/lib/catalogDirectory";
import { getToolIcon } from "@/lib/toolIcons";
import { iconWell } from "@/components/tools/iconWell";

const PROMOS = [
  {
    href: "/privacy",
    icon: ShieldCheck,
    gradient: "from-[#0D9B8A] to-[#0B1220]",
    title: "Private by design",
    body: "PDFs, photos, and invoices are processed on your device. Nothing is uploaded to Ranburg.",
    cta: "Read privacy",
  },
  {
    href: "/tools/invoice-generator",
    icon: FileText,
    gradient: "from-[#0B1220] to-[#0D9B8A]",
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

export default function HomeBanners() {
  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {PROMOS.map((promo) => {
            const Icon = promo.icon;
            return (
              <Link
                key={promo.href}
                href={promo.href}
                className="group relative overflow-hidden rounded-2xl border border-theme bg-[var(--surface-elevated)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <div className={`absolute -right-8 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${promo.gradient} opacity-20 blur-2xl group-hover:opacity-35`} />
                <div {...iconWell(promo.gradient, "relative mb-3 h-11 w-11 rounded-xl")}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="relative text-lg font-bold text-theme-heading">{promo.title}</h2>
                <p className="relative mt-1.5 text-sm leading-relaxed text-theme-muted">{promo.body}</p>
                <span className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  {promo.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATALOG_SECTIONS.map((section) => {
            const Icon = getToolIcon(section.icon);
            return (
              <Link
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 rounded-2xl border border-theme bg-[var(--surface-elevated)]/80 px-4 py-3 transition hover:border-accent/35 hover:bg-accent/5"
              >
                <span {...iconWell(section.gradient, "h-10 w-10 rounded-xl")}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-theme-heading">{section.label}</span>
                  <span className="block truncate text-xs text-theme-muted">{section.slugs.length} tools</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
