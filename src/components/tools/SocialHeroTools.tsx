import { Link } from "@/i18n/navigation";
import { getToolBySlug } from "@/lib/toolsConfig";
import { HERO_TOOL_SLUGS } from "@/lib/toolPopularity";
import { getToolIcon } from "@/lib/toolIcons";
import { ArrowRight, Sparkles } from "lucide-react";
import { iconWell } from "@/components/tools/iconWell";

export default function SocialHeroTools({ compact = false }: { compact?: boolean }) {
  const tools = HERO_TOOL_SLUGS.map(getToolBySlug).filter(Boolean);

  if (compact) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => {
          const Icon = getToolIcon(tool!.icon, tool!.slug);
          return (
            <Link
              key={tool!.slug}
              href={`/tools/${tool!.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-theme-subtle bg-theme-surface px-4 py-3 transition-colors duration-300 hover:border-accent/50"
            >
              <div {...iconWell(tool!.gradient, "h-9 w-9 rounded-lg")}>
                <Icon className="h-4 w-4" strokeWidth={2.25} />
              </div>
              <span className="text-sm font-semibold text-theme-heading group-hover:text-accent">{tool!.title}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <section className="card spotlight relative overflow-hidden rounded-[1.75rem] p-6 sm:p-10" data-reveal="up">
      <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" aria-hidden />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Creator toolkit
          </span>
          <span className="text-sm text-theme-muted">YouTube & Instagram analytics + revenue</span>
        </div>
        <h2 className="section-heading mt-5">
          Grow & monetize on <span className="text-gradient-accent">YouTube & Instagram</span>
        </h2>
        <p className="section-lede mt-3 max-w-2xl">
          Analyze any public channel or profile, estimate earnings, and get growth recommendations — free, no login.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {tools.map((tool) => {
            const Icon = getToolIcon(tool!.icon, tool!.slug);
            return (
              <Link
                key={tool!.slug}
                href={`/tools/${tool!.slug}`}
                className="group flex items-start gap-4 rounded-2xl border border-theme-subtle bg-theme-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50"
              >
                <div {...iconWell(tool!.gradient, "h-12 w-12 rounded-xl")}>
                  <Icon className="h-6 w-6" strokeWidth={2.25} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-theme-heading transition-colors group-hover:text-accent">{tool!.title}</p>
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
