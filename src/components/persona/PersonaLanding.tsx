"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  getFeaturedTools,
  getPersonaBySlug,
  getRecommendedToolsBeyondFeatured,
} from "@/lib/personas";
import { getCategoryById } from "@/lib/toolsConfig";
import ToolCard from "@/components/tools/ToolCard";
import { usePersona } from "@/hooks/usePersona";
import { cn } from "@/lib/utils";

interface PersonaLandingProps {
  slug: string;
}

export default function PersonaLanding({ slug }: PersonaLandingProps) {
  const persona = getPersonaBySlug(slug);
  const { syncFromSlug, clearPersona } = usePersona();

  useEffect(() => {
    if (persona) syncFromSlug(persona.slug);
  }, [persona, syncFromSlug]);

  if (!persona) return null;

  const featured = getFeaturedTools(persona);
  const recommended = getRecommendedToolsBeyondFeatured(persona).slice(0, 24);
  const categoryLabels = persona.recommendedCategories
    .map((id) => getCategoryById(id)?.label)
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="pb-24" data-persona-page={persona.id}>
      <section className="relative pb-10 pt-12 sm:pb-14 sm:pt-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow rise-soft">
            <Sparkles className="h-4 w-4 text-accent" aria-hidden />
            Tools for {persona.title}s
          </p>
          <h1
            className={cn(
              "rise mt-6 max-w-4xl text-4xl font-light leading-[1.08] tracking-[-0.035em] text-theme-heading sm:text-6xl lg:text-7xl",
              persona.theme.fontHint === "mono" && "font-mono"
            )}
          >
            {persona.title}
          </h1>
          <p className="rise-soft mt-6 max-w-2xl text-lg leading-relaxed text-theme-muted">{persona.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_44px_color-mix(in_srgb,var(--accent)_45%,transparent)]"
            >
              Browse all tools
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={() => clearPersona()}
              className="inline-flex items-center rounded-xl border border-theme-subtle bg-theme-surface px-6 py-3 text-sm font-medium text-theme-muted transition-colors hover:border-accent/40 hover:text-theme-heading"
            >
              Reset / View all
            </button>
          </div>

          {categoryLabels && (
            <p className="mt-5 text-xs font-medium uppercase tracking-wider text-theme-subtle">
              Focused on {categoryLabels}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:space-y-20 sm:px-6 lg:px-8">
        {featured.length > 0 && (
          <section>
            <h2 className="section-heading" data-reveal="up">Featured for you</h2>
            <p className="section-lede mt-3 max-w-2xl">
              High-impact tools we recommend first for {persona.title.toLowerCase()}s.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((tool, i) => (
                <ToolCard key={tool.slug} slug={tool.slug} showCategory revealIndex={i} />
              ))}
            </div>
          </section>
        )}

        {recommended.length > 0 && (
          <section>
            <h2 className="section-heading" data-reveal="up">More recommended tools</h2>
            <p className="section-lede mt-3 max-w-2xl">
              Related utilities from your persona&apos;s categories. Search still covers every tool on Ranburg.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((tool, i) => (
                <ToolCard key={tool.slug} slug={tool.slug} showCategory revealIndex={i} />
              ))}
            </div>
          </section>
        )}

        <section className="card spotlight px-6 py-12 text-center sm:px-10" data-reveal="scale">
          <h2 className="text-2xl font-light tracking-tight text-theme-heading sm:text-4xl">Need something else?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-theme-muted">
            Your persona preference only highlights relevant tools. Direct URLs, the tools hub, and ⌘K search always
            stay available for the full catalog.
          </p>
          <Link
            href="/tools"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            Open full tools directory
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      </div>
    </div>
  );
}
