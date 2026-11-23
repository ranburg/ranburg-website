import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/siteConfig";
import { PRIORITY_INDEX_TOOL_SLUGS } from "@/lib/seoGrowthConfig";
import { getToolBySlug } from "@/lib/toolsConfig";

export default function NotFound() {
  const tools = PRIORITY_INDEX_TOOL_SLUGS.slice(0, 8)
    .map((slug) => getToolBySlug(slug))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6 sm:pt-20 lg:px-8">
      <p className="rise float-slow w-fit select-none text-[7rem] font-light leading-none tracking-[-0.06em] text-gradient-accent sm:text-[11rem]">
        404
      </p>
      <h1 className="rise mt-4 text-4xl font-light leading-[1.08] tracking-[-0.035em] text-theme-heading sm:text-5xl">
        Page not found
      </h1>
      <p className="rise-soft mt-5 text-lg leading-relaxed text-theme-muted">
        That URL is not on {SITE.brand}. Try a free tool below or go back to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-on-accent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_44px_color-mix(in_srgb,var(--accent)_45%,transparent)]"
        >
          Home
        </Link>
        <Link
          href="/tools"
          className="rounded-xl border border-theme-subtle bg-theme-surface px-6 py-3 text-sm font-medium text-theme-heading transition-colors hover:border-accent"
        >
          All tools
        </Link>
      </div>
      <h2 className="mt-14 text-2xl font-medium tracking-tight text-theme-heading">Popular free tools</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {tools.map(
          (tool) =>
            tool && (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="card block px-4 py-3.5 text-sm font-medium text-theme-heading transition-colors duration-300 hover:border-accent/60 hover:text-accent"
                >
                  {tool.title}
                </Link>
              </li>
            )
        )}
      </ul>
    </div>
  );
}
