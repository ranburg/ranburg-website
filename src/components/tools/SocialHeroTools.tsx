import Link from "next/link";
import { getToolBySlug } from "@/lib/toolsConfig";
import { HERO_TOOL_SLUGS } from "@/lib/toolPopularity";
import { getToolIcon } from "@/lib/toolIcons";
import { ArrowRight, Sparkles } from "lucide-react";

export default function SocialHeroTools({ compact = false }: { compact?: boolean }) {
  const tools = HERO_TOOL_SLUGS.map(getToolBySlug).filter(Boolean);

  if (compact) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => {
          const Icon = getToolIcon(tool!.icon);
          return (
            <Link
              key={tool!.slug}
              href={`/tools/${tool!.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 transition-all hover:border-accent/40 hover:bg-accent/10"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tool!.gradient}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-theme-heading group-hover:text-accent">{tool!.title}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/8 via-transparent to-emerald-500/8 p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-accent-emerald/10 blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Creator toolkit
          </span>
          <span className="text-sm text-theme-muted">YouTube & Instagram analytics + revenue</span>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-theme-heading sm:text-3xl">
          Grow & monetize on <span className="text-gradient-accent">YouTube & Instagram</span>
        </h2>
        <p className="mt-2 max-w-2xl text-theme-muted">
          Analyze any public channel or profile, estimate earnings, and get growth recommendations — free, no login.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {tools.map((tool) => {
            const Icon = getToolIcon(tool!.icon);
            return (
              <Link
                key={tool!.slug}
                href={`/tools/${tool!.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-theme-subtle bg-theme-surface/50 p-4 transition-all hover:border-accent/40 hover:bg-theme-surface/80"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool!.gradient}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-theme-heading group-hover:text-accent">{tool!.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-theme-muted">{tool!.shortDescription}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-theme-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
