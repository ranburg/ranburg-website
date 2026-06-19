"use client";

const techStacks = [
  "Salesforce Consulting",
  "OmniStudio",
  "Revenue Cloud",
  "Industries Cloud",
  "Experience Cloud",
  "Lightning Web Components",
  "Salesforce Integrations",
  "Managed Services",
  "Jaipur, India",
  "CPQ & Billing",
  "Vlocity",
  "API Integration",
];

export default function TrustTicker() {
  const items = [...techStacks, ...techStacks];

  return (
    <section className="relative border-y border-theme-subtle bg-slate-100/80 py-6 dark:bg-slate-900/30">
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--background)] to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--background)] to-transparent" />
      <div className="overflow-hidden">
        <div className="flex animate-ticker gap-8 whitespace-nowrap">
          {items.map((item, i) => (
            <div key={`${item}-${i}`} className="flex items-center gap-3 text-sm font-medium text-theme-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
