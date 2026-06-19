"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/blogTypes";
import { BLOG_CATEGORIES, inferBlogCategory, type BlogCategoryId } from "@/lib/blogCategories";
import { cn } from "@/lib/utils";

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  const [active, setActive] = useState<BlogCategoryId | "all">("all");

  const filtered =
    active === "all" ? posts : posts.filter((p) => inferBlogCategory(p) === active);

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition",
            active === "all" ? "bg-accent text-white" : "border border-theme-subtle text-theme-muted hover:text-theme-heading"
          )}
        >
          All
        </button>
        {BLOG_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActive(cat.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              active === cat.id ? "bg-accent text-white" : "border border-theme-subtle text-theme-muted hover:text-theme-heading"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="glass-card group block p-6 hover:border-accent/30">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              {BLOG_CATEGORIES.find((c) => c.id === inferBlogCategory(post))?.label}
            </span>
            <h2 className="mt-2 text-xl font-bold text-theme-heading group-hover:text-accent">{post.title}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-theme-muted">{post.excerpt}</p>
            <div className="mt-4 flex items-center gap-4 text-xs text-theme-subtle">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
            </div>
            <span className="mt-4 flex items-center gap-2 text-sm font-medium text-accent">
              Read Article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
