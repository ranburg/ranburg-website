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
      <section className="relative overflow-hidden pb-10 pt-14 sm:pb-12 sm:pt-16">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-b",
            persona.theme.heroGradient
          )}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="h-4 w-4" aria-hidden />
            Tools for {persona.title}s
          </p>
          <h1
            className={cn(
              "mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-theme-heading sm:text-4xl lg:text-5xl",
              persona.theme.fontHint === "mono" && "font-mono tracking-tight"
            )}
          >
            {persona.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-theme-muted sm:text-lg">{persona.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
            >
              Browse all tools
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={() => clearPersona()}
              className="inline-flex items-center rounded-xl border border-theme-subtle bg-theme-surface/60 px-4 py-2.5 text-sm font-medium text-theme-muted transition-colors hover:border-accent/30 hover:text-theme-heading"
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

      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8 sm:space-y-14">
        {featured.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-theme-heading sm:text-2xl">Featured for you</h2>
            <p className="mt-1.5 max-w-2xl text-sm text-theme-muted sm:text-base">
              High-impact tools we recommend first for {persona.title.toLowerCase()}s.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {featured.map((tool) => (
                <ToolCard key={tool.slug} slug={tool.slug} showCategory />
              ))}
            </div>
          </section>
        )}

        {recommended.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-theme-heading sm:text-2xl">More recommended tools</h2>
            <p className="mt-1.5 max-w-2xl text-sm text-theme-muted sm:text-base">
              Related utilities from your persona&apos;s categories. Search still covers every tool on Ranburg.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recommended.map((tool) => (
                <ToolCard key={tool.slug} slug={tool.slug} showCategory />
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-theme-subtle bg-theme-surface/40 px-6 py-8 text-center sm:px-10">
          <h2 className="text-lg font-bold text-theme-heading sm:text-xl">Need something else?</h2>
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
