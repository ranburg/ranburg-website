"use client";

import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import ToolSearch from "@/components/tools/ToolSearch";
import { iconWell } from "@/components/tools/iconWell";

export default function ToolsPromo() {
  const featuredTools = TOOLS_CONFIG.filter((t) => t.popular).slice(0, 6);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-theme-heading sm:text-4xl">
            Free <span className="text-gradient-accent">Online Tools</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-theme-muted">
            Calculators, converters, formatters, and Salesforce utilities — fast, free, and SEO-friendly tools for developers and businesses.
          </p>
        </div>

        <div className="mx-auto mb-10 max-w-2xl">
          <ToolSearch showSuggestions showTags maxResults={6} placeholder="Search 30+ free tools…" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => {
            const Icon = getToolIcon(tool.icon, tool.slug);
            return (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-[var(--surface-elevated)] p-5 shadow-[0_10px_24px_-16px_rgba(12,31,26,0.4)] transition-all hover:-translate-y-0.5 hover:border-accent/80 hover:shadow-[0_0_0_2px_rgba(15,118,110,0.25),0_18px_36px_-16px_rgba(15,118,110,0.45)] dark:border-white/10">
                <div {...iconWell(tool.gradient, "h-11 w-11 rounded-xl")}>
                  <Icon className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-theme-heading group-hover:text-accent">{tool.title}</p>
                  <p className="truncate text-xs text-theme-subtle">{tool.badge}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-accent" />
              </Link>
            );
          })}
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/tools/salesforce" className="inline-flex items-center gap-2 rounded-xl border border-theme px-6 py-3 text-sm font-semibold text-theme-heading hover:border-accent/40 hover:text-accent">
            <Wrench className="h-4 w-4" /> Salesforce Tool Hub
          </Link>
          <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
            All {TOOLS_CONFIG.length} tools →
          </Link>
        </div>
      </div>
    </section>
  );
}
