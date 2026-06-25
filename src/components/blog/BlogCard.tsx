import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/blogTypes";
import { BLOG_CATEGORIES, inferBlogCategory } from "@/lib/blogCategories";
import { getBlogCategoryAccent } from "@/lib/blogImages";
import BlogCoverImage from "@/components/blog/BlogCoverImage";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "horizontal" | "compact";
  priority?: boolean;
  className?: string;
}

export default function BlogCard({ post, variant = "default", priority = false, className }: BlogCardProps) {
  const category = inferBlogCategory(post);
  const categoryLabel = BLOG_CATEGORIES.find((c) => c.id === category)?.label;
  const accent = getBlogCategoryAccent(category);

  if (variant === "horizontal") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "group grid overflow-hidden rounded-2xl border border-theme-subtle bg-[var(--glass-bg)] shadow-sm transition-all hover:border-accent/30 hover:shadow-lg md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]",
          className
        )}
      >
        <BlogCoverImage
          post={post}
          priority={priority}
          overlay="strong"
          className="aspect-[16/10] md:aspect-auto md:min-h-[280px]"
          sizes="(max-width: 768px) 100vw, 55vw"
        />
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <span
            className={cn(
              "inline-flex w-fit rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white",
              accent
            )}
          >
            {categoryLabel}
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-theme-heading transition-colors group-hover:text-accent sm:text-3xl">
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-base leading-relaxed text-theme-muted">{post.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-theme-subtle">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatBlogDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            Read article
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "group flex gap-4 overflow-hidden rounded-xl border border-theme-subtle bg-[var(--glass-bg)] p-3 transition-all hover:border-accent/30 hover:shadow-md",
          className
        )}
      >
        <BlogCoverImage
          post={post}
          className="h-20 w-28 shrink-0 rounded-lg"
          sizes="112px"
          overlay="strong"
        />
        <div className="min-w-0 flex-1 py-0.5">
          <p className="line-clamp-2 font-semibold text-theme-heading group-hover:text-accent">{post.title}</p>
          <p className="mt-1 text-xs text-theme-subtle">{post.readTime}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-theme-subtle bg-[var(--glass-bg)] shadow-sm transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg",
        className
      )}
    >
      <BlogCoverImage post={post} priority={priority} className="aspect-[16/10]" sizes="(max-width: 768px) 100vw, 33vw" />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">{categoryLabel}</span>
        <h2 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-theme-heading group-hover:text-accent sm:text-xl">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-theme-muted">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-theme-subtle pt-4 text-xs text-theme-subtle">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatBlogDate(post.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function formatBlogDate(date: string): string {
  try {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return date;
  }
}
