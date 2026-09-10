import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ToolConfig } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import Button from "@/components/ui/Button";
import { iconWell } from "@/components/tools/iconWell";

interface BlogFeaturedToolProps {
  tool: ToolConfig;
}

export default function BlogFeaturedTool({ tool }: BlogFeaturedToolProps) {
  const Icon = getToolIcon(tool.icon, tool.slug);

  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/10 via-accent-emerald/5 to-transparent p-6 shadow-lg shadow-accent/5 sm:p-8">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
      <div className="relative">
        <div className="flex items-start gap-4">
          <div {...iconWell(tool.gradient, "h-14 w-14 rounded-2xl")}>
            <Icon className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Featured free tool
            </p>
            <h2 className="mt-1 text-lg font-bold leading-snug text-theme-heading sm:text-xl">{tool.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-theme-muted">{tool.shortDescription}</p>
            <span className="mt-3 inline-block rounded-full bg-accent-emerald/10 px-2.5 py-0.5 text-xs font-medium text-accent-emerald">
              {tool.badge}
            </span>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 border-t border-accent/15 pt-5 sm:flex-row sm:flex-wrap sm:items-center">
          <Button href={`/tools/${tool.slug}`} icon size="sm" className="w-fit">
            Open tool
          </Button>
          <Link
            href={`/tools/${tool.slug}`}
            className="inline-flex w-fit items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            View tool page
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
