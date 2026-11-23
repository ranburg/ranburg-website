import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import ToolCard from "@/components/tools/ToolCard";
import { getCatalogTools } from "@/lib/catalogDirectory";
import { NEW_TOOL_SLUGS } from "@/lib/toolsHubConfig";

/** Showcase of the most recently launched tools. */
export default async function NewToolsSection() {
  const t = await getTranslations("home");
  const tools = getCatalogTools(NEW_TOOL_SLUGS).slice(0, 8);
  if (tools.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6" data-reveal="up">
          <div>
            <p className="eyebrow">
              <span className="status-dot" aria-hidden />
              {t("newEyebrow")}
            </p>
            <h2 className="section-heading mt-5 max-w-3xl">{t("newTitle")}</h2>
            <p className="section-lede mt-3 max-w-2xl">{t("newSub")}</p>
          </div>
          <Link href="/tools" className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            {t("ctaTools")}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool, i) => (
            <div
              key={tool.slug}
              data-reveal="up"
              style={{ "--reveal-delay": `${(i % 4) * 80}ms` } as CSSProperties}
              className="h-full"
            >
              <ToolCard slug={tool.slug} showUseCount={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
