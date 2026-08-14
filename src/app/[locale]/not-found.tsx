import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/siteConfig";
import { PRIORITY_INDEX_TOOL_SLUGS } from "@/lib/seoGrowthConfig";
import { getToolBySlug } from "@/lib/toolsConfig";

export default function NotFound() {
  const tools = PRIORITY_INDEX_TOOL_SLUGS.slice(0, 8)
    .map((slug) => getToolBySlug(slug))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">404</p>
      <h1 className="mt-3 text-3xl font-extrabold text-theme-heading sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 text-theme-muted">
        That URL is not on {SITE.brand}. Try a free tool below or go back to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Home
        </Link>
        <Link
          href="/tools"
          className="rounded-lg border border-theme-subtle px-4 py-2 text-sm font-semibold text-theme-heading hover:border-accent"
        >
          All tools
        </Link>
      </div>
      <h2 className="mt-12 text-lg font-bold text-theme-heading">Popular free tools</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {tools.map(
          (tool) =>
            tool && (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="block rounded-lg border border-theme-subtle px-3 py-2.5 text-sm font-medium text-theme-heading hover:border-accent hover:text-accent"
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
