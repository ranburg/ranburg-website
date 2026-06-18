"use client";

const techStacks = [
  "React & Next.js",
  "AWS & Azure",
  "Kubernetes",
  "Salesforce",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Docker",
  "Terraform",
  "FinTech",
  "Enterprise CRM",
  "Mobile Apps",
  "DevOps CI/CD",
  "Microservices",
  "AI/ML Integration",
];

export default function TrustTicker() {
  const items = [...techStacks, ...techStacks];

  return (
    <section className="relative border-y border-white/[0.06] bg-slate-900/30 py-6">
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-slate-950 to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-slate-950 to-transparent" />

      <div className="overflow-hidden">
        <div className="flex animate-ticker gap-8 whitespace-nowrap">
          {items.map((item, i) => (
            <div
              key={`${item}-${i}`}
              className="flex items-center gap-3 text-sm font-medium text-slate-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
