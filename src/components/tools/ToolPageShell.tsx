import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getToolBySlug } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import ToolRecommendations from "@/components/tools/ToolRecommendations";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { TOOL_COMPONENTS } from "@/components/tools/registry";

interface ToolPageProps {
  slug: string;
}

export default function ToolPageShell({ slug }: ToolPageProps) {
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const ToolComponent = TOOL_COMPONENTS[slug];
  if (!ToolComponent) notFound();

  const Icon = getToolIcon(tool.icon);

  return (
    <div className="pb-24">
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/tools"
            className="mb-6 inline-flex items-center gap-2 text-sm text-theme-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>
          <div className="flex items-start gap-4">
            <div
              className={`hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br sm:flex ${tool.gradient}`}
            >
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                {tool.badge}
              </span>
              <h1 className="mt-1 text-3xl font-extrabold text-theme-heading sm:text-4xl">
                {tool.title}
              </h1>
              <p className="mt-3 max-w-2xl text-theme-muted">{tool.shortDescription}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
            <div>
              <ToolComponent />
              <div className="mt-12 lg:hidden">
                <ToolRecommendations currentSlug={slug} />
              </div>
              <ToolSeoContent tool={tool} />
            </div>
            <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
              <ToolRecommendations currentSlug={slug} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
