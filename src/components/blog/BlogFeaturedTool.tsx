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
    <div className="card spotlight relative mb-10 overflow-hidden border-accent/30 p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" aria-hidden />
      <div className="relative">
        <div className="flex items-start gap-4">
          <div {...iconWell(tool.gradient, "h-14 w-14 rounded-2xl")}>
            <Icon className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Featured free tool
            </p>
            <h2 className="mt-2 text-xl font-medium leading-snug tracking-tight text-theme-heading sm:text-2xl">{tool.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-theme-muted">{tool.shortDescription}</p>
            <span className="mt-3 inline-block rounded-full border border-theme-subtle bg-theme-surface px-3 py-1 text-xs font-medium text-theme-muted">
              {tool.badge}
            </span>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-4 border-t border-theme-subtle pt-5 sm:flex-row sm:flex-wrap sm:items-center">
          <Button href={`/tools/${tool.slug}`} icon size="sm" className="w-fit">
            Open tool
          </Button>
          <Link
            href={`/tools/${tool.slug}`}
            className="group/link inline-flex w-fit items-center gap-1 text-sm font-medium text-accent"
          >
            <span className="link-underline">View tool page</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
