"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TOOL_CATEGORIES, TOOLS_CONFIG, getCategoryById, getToolBySlug } from "@/lib/toolsConfig";
import { COMING_SOON_TOOLS } from "@/lib/toolComingSoonConfig";
import { FEATURED_TOOL_SLUGS, POPULAR_TOOL_SLUGS, RECENT_TOOL_SLUGS } from "@/lib/toolsHubConfig";
import { getToolIcon } from "@/lib/toolIcons";
import ToolSearch from "@/components/tools/ToolSearch";
import { searchTools } from "@/lib/toolSearch";
import { useState } from "react";

function ToolCard({ slug, showCategory = false }: { slug: string; showCategory?: boolean }) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;
  const Icon = getToolIcon(tool.icon);
  const cat = getCategoryById(tool.category);
  return (
    <Link href={`/tools/${tool.slug}`} className="group block h-full">
      <div className="glass-card relative h-full overflow-hidden p-6 transition-all group-hover:border-accent/30">
        <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${tool.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-25`} />
        <div className="relative">
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {showCategory && cat && (
            <span className="text-xs font-semibold uppercase tracking-wider text-theme-subtle">{cat.label}</span>
          )}
          <h3 className="mt-1 text-lg font-bold text-theme-heading transition-colors group-hover:text-accent">{tool.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-theme-muted">{tool.shortDescription}</p>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-accent">
            Open Tool
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function ToolSection({ title, description, slugs }: { title: string; description?: string; slugs: string[] }) {
  const tools = slugs.map(getToolBySlug).filter(Boolean);
  if (tools.length === 0) return null;
  return (
    <section>
      <h2 className="text-2xl font-bold text-theme-heading">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-theme-muted">{description}</p>}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {slugs.map((slug) => (
          <ToolCard key={slug} slug={slug} showCategory />
        ))}
      </div>
    </section>
  );
}

export default function ToolsHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = searchQuery.trim() ? searchTools(searchQuery) : null;

  const salesforceSlugs = TOOLS_CONFIG.filter((t) => t.category === "salesforce").map((t) => t.slug);
  const financialSlugs = TOOLS_CONFIG.filter((t) => t.category === "financial").map((t) => t.slug);
  const developerSlugs = TOOLS_CONFIG.filter((t) => t.category === "developer").map((t) => t.slug);

  return (
    <div className="space-y-16">
      <div className="sticky top-[4.5rem] z-30 -mx-4 border-b border-theme-subtle bg-[var(--background)]/95 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <ToolSearch
          placeholder="Search tools, calculators, Salesforce utilities…"
          showResults={false}
          showSuggestions
          showTags
          value={searchQuery}
          onQueryChange={setSearchQuery}
        />
      </div>

      {searchResults ? (
        <section>
          <h2 className="text-xl font-bold text-theme-heading">
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
          </h2>
          {searchResults.length === 0 ? (
            <p className="mt-6 text-theme-muted">No tools found. Try another keyword.</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {searchResults.map((t) => (
                <ToolCard key={t.slug} slug={t.slug} showCategory />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <ToolSection title="Featured Tools" description="Our most useful calculators and Salesforce utilities." slugs={FEATURED_TOOL_SLUGS} />
          <ToolSection title="Salesforce Tools" description="Free generators for admins and developers." slugs={salesforceSlugs} />
          <ToolSection title="Financial Tools" slugs={financialSlugs} />
          <ToolSection title="Developer Tools" slugs={developerSlugs} />
          <ToolSection title="Recently Added" slugs={RECENT_TOOL_SLUGS.filter((s) => getToolBySlug(s))} />
          <ToolSection title="Popular Tools" slugs={POPULAR_TOOL_SLUGS} />

          {COMING_SOON_TOOLS.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-theme-heading">Coming Soon</h2>
              <p className="mt-2 text-theme-muted">New Salesforce utilities in development — join the waitlist.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {COMING_SOON_TOOLS.map((t) => (
                  <Link key={t.slug} href={`/tools/${t.slug}`} className="glass-card flex items-center justify-between p-5 hover:border-accent/30">
                    <div>
                      <p className="font-semibold text-theme-heading">{t.title}</p>
                      <p className="mt-1 text-sm text-theme-muted">{t.shortDescription}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-600 dark:text-amber-400">Soon</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
