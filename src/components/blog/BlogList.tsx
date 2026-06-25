"use client";

import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import type { BlogPost } from "@/lib/blogTypes";
import { BLOG_CATEGORIES, inferBlogCategory, type BlogCategoryId } from "@/lib/blogCategories";
import BlogCard from "@/components/blog/BlogCard";
import { cn } from "@/lib/utils";

interface BlogListProps {
  posts: BlogPost[];
}

function sortByDate(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function BlogList({ posts }: BlogListProps) {
  const [active, setActive] = useState<BlogCategoryId | "all">("all");
  const [query, setQuery] = useState("");

  const sorted = useMemo(() => sortByDate(posts), [posts]);

  const filtered = useMemo(() => {
    let list = active === "all" ? sorted : sorted.filter((p) => inferBlogCategory(p) === active);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.seo.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return list;
  }, [sorted, active, query]);

  const featured = filtered[0];
  const gridPosts = filtered.slice(1);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-subtle" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="w-full rounded-xl border border-theme-subtle bg-[var(--input-bg)] py-2.5 pl-10 pr-4 text-sm text-theme-heading placeholder:text-theme-subtle outline-none transition-colors focus:border-accent/40"
          />
        </div>
        <p className="flex items-center gap-2 text-sm text-theme-muted">
          <BookOpen className="h-4 w-4 text-accent" />
          {filtered.length} article{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
            active === "all"
              ? "bg-accent text-white shadow-glow"
              : "border border-theme-subtle text-theme-muted hover:border-accent/30 hover:text-theme-heading"
          )}
        >
          All topics
        </button>
        {BLOG_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActive(cat.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
              active === cat.id
                ? "bg-accent text-white shadow-glow"
                : "border border-theme-subtle text-theme-muted hover:border-accent/30 hover:text-theme-heading"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-theme-subtle py-16 text-center">
          <p className="text-theme-muted">No articles match your search.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {featured && (
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent">Featured</p>
              <BlogCard post={featured} variant="horizontal" priority />
            </div>
          )}

          {gridPosts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {gridPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
