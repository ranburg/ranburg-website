import Link from "next/link";
import { getPrimarySeoCategoryForTool } from "@/lib/toolSeoCategories";
import { POPULAR_TOOL_SLUGS, RECENT_TOOL_SLUGS } from "@/lib/toolsHubConfig";
import { getToolBySlug } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { ArrowRight } from "lucide-react";

interface ToolInternalLinksProps {
  slug: string;
}

export default function ToolInternalLinks({ slug }: ToolInternalLinksProps) {
  const tool = getToolBySlug(slug);
  const seoCat = getPrimarySeoCategoryForTool(slug);
  const popular = POPULAR_TOOL_SLUGS.filter((s) => s !== slug).slice(0, 4);
  const recent = RECENT_TOOL_SLUGS.filter((s) => s !== slug).slice(0, 4);

  return (
    <nav className="mt-12 rounded-xl border border-theme-subtle bg-theme-surface/30 p-6" aria-label="Related navigation">
      <h2 className="text-lg font-bold text-theme-heading">Explore More Tools</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {seoCat && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Category</p>
            <Link href={`/tools/${seoCat.slug}`} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-theme-heading hover:text-accent">
              {seoCat.label}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Popular</p>
          <ul className="mt-2 space-y-1">
            {popular.map((s) => {
              const t = getToolBySlug(s);
              if (!t) return null;
              return (
                <li key={s}>
                  <Link href={`/tools/${s}`} className="text-sm text-theme-muted hover:text-accent">
                    {t.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Recently Added</p>
          <ul className="mt-2 space-y-1">
            {recent.map((s) => {
              const t = getToolBySlug(s);
              if (!t) return null;
              return (
                <li key={s}>
                  <Link href={`/tools/${s}`} className="text-sm text-theme-muted hover:text-accent">
                    {t.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <Link href="/tools" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
        View all tools
        <ArrowRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
