import ToolCard from "@/components/tools/ToolCard";
import { RECENT_TOOL_SLUGS } from "@/lib/toolsHubConfig";

export default function RecentlyAddedTools() {
  return (
    <section className="border-y border-theme-subtle bg-theme-surface/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-theme-heading sm:text-4xl">
              Recently <span className="text-gradient-accent">Added</span>
            </h2>
            <p className="mt-3 max-w-xl text-theme-muted">
              New calculators, converters, and developer utilities added to Ranburg.
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {RECENT_TOOL_SLUGS.slice(0, 8).map((slug) => (
            <ToolCard key={slug} slug={slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
