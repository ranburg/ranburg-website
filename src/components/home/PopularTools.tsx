import ToolCard from "@/components/tools/ToolCard";
import { POPULAR_TOOL_SLUGS } from "@/lib/toolsHubConfig";

export default function PopularTools() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-theme-heading sm:text-4xl">
            Popular <span className="text-gradient-accent">Tools</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-theme-muted">
            Most-used free utilities — calculators, formatters, and generators trusted by thousands.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_TOOL_SLUGS.slice(0, 6).map((slug) => (
            <ToolCard key={slug} slug={slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
