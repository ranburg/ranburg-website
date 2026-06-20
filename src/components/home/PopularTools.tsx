import ToolCard from "@/components/tools/ToolCard";
import { POPULAR_TOOL_SLUGS } from "@/lib/toolsHubConfig";
import { HERO_TOOL_SLUGS } from "@/lib/toolPopularity";

const displaySlugs = [
  ...HERO_TOOL_SLUGS,
  ...POPULAR_TOOL_SLUGS.filter((s) => !HERO_TOOL_SLUGS.includes(s)),
].slice(0, 6);

export default function PopularTools() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-theme-heading sm:text-4xl">
            Popular <span className="text-gradient-accent">Tools</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-theme-muted">
            YouTube & Instagram analytics lead the pack — plus calculators, formatters, and generators.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displaySlugs.map((slug) => (
            <ToolCard key={slug} slug={slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
