import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SEO_CATEGORY_HUBS } from "@/lib/toolSeoCategories";
import { getToolsForSeoCategory } from "@/lib/toolSeoCategories";
import { getToolIcon } from "@/lib/toolIcons";

export default function ToolCategoryCards() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-theme-heading sm:text-4xl">
            Tool <span className="text-gradient-accent">Categories</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-theme-muted">
            Browse free tools by category — SEO, developer, text, business, calculators, and generators.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SEO_CATEGORY_HUBS.map((cat) => {
            const Icon = getToolIcon(cat.icon);
            const count = getToolsForSeoCategory(cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/tools/${cat.slug}`}
                className="glass-card group relative overflow-hidden p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40"
              >
                <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${cat.gradient} opacity-10 blur-2xl group-hover:opacity-20`} />
                <div className="relative">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.gradient}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-theme-heading group-hover:text-accent">{cat.label}</h3>
                  <p className="mt-2 text-sm text-theme-muted line-clamp-2">{cat.description}</p>
                  <p className="mt-3 text-xs font-medium text-theme-subtle">{count} tools</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Explore category <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
