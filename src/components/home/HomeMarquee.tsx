import Marquee from "@/components/motion/Marquee";
import { getCatalogTools } from "@/lib/catalogDirectory";
import { POPULAR_TOOL_SLUGS } from "@/lib/toolsHubConfig";

/** Scrolling strip of popular tool names — decorative; the same tools are linked in the catalog below. */
export default function HomeMarquee() {
  const tools = getCatalogTools(POPULAR_TOOL_SLUGS.slice(0, 14));
  return (
    <div className="border-y border-theme-subtle py-5" aria-hidden>
      <Marquee duration={55} gap="2.75rem">
        {tools.map((tool) => (
          <span
            key={tool.slug}
            className="flex items-center gap-11 whitespace-nowrap text-sm uppercase tracking-[0.22em] text-theme-subtle"
          >
            {tool.title}
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
