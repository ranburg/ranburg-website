import Link from "next/link";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/blogTypes";
import { BLOG_CATEGORIES, inferBlogCategory } from "@/lib/blogCategories";
import BlogCoverImage from "@/components/blog/BlogCoverImage";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "horizontal" | "compact";
  priority?: boolean;
  className?: string;
  /** Use "h3" when the card sits under a section H2 (e.g. homepage preview). */
  headingLevel?: "h2" | "h3";
}

const arrowBadge =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-theme-subtle bg-theme-surface text-theme-muted transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent";

export default function BlogCard({
  post,
  variant = "default",
  priority = false,
  className,
  headingLevel = "h2",
}: BlogCardProps) {
  const category = inferBlogCategory(post);
  const categoryLabel = BLOG_CATEGORIES.find((c) => c.id === category)?.label;
  const Heading = headingLevel;

  if (variant === "horizontal") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        prefetch={false}
        className={cn(
          "card spotlight group grid overflow-hidden rounded-[1.75rem] p-2 transition-colors duration-500 hover:border-accent/40 sm:p-3 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]",
          className
        )}
      >
        <BlogCoverImage
          post={post}
          priority={priority}
          overlay="strong"
          className="aspect-[16/10] rounded-[1.25rem] md:aspect-auto md:min-h-[300px]"
          sizes="(max-width: 768px) 100vw, 55vw"
        />
        <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {categoryLabel}
            </span>
            <span className={arrowBadge}>
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
          <Heading className="mt-5 text-2xl font-medium leading-[1.15] tracking-tight text-theme-heading transition-colors duration-300 group-hover:text-accent sm:text-4xl">
            {post.title}
          </Heading>
          <p className="mt-4 line-clamp-3 text-base leading-relaxed text-theme-muted">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-theme-subtle">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatBlogDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>
          <span className="mt-6 text-sm font-medium text-accent">Read article</span>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        prefetch={false}
        className={cn(
          "group flex gap-4 overflow-hidden rounded-2xl border border-theme-subtle bg-[var(--surface-elevated)] p-3 transition-colors duration-300 hover:border-accent/40",
          className
        )}
      >
        <BlogCoverImage
          post={post}
          className="h-20 w-28 shrink-0 rounded-xl"
          sizes="112px"
          overlay="strong"
        />
        <div className="min-w-0 flex-1 py-0.5">
          <p className="line-clamp-2 font-medium text-theme-heading transition-colors group-hover:text-accent">{post.title}</p>
          <p className="mt-1 text-xs text-theme-subtle">{post.readTime}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={false}
      className={cn(
        "card spotlight group flex h-full flex-col overflow-hidden p-2 transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-accent/40",
        className
      )}
    >
      <div className="relative">
        <BlogCoverImage post={post} priority={priority} className="aspect-[16/10] rounded-[0.9rem]" sizes="(max-width: 768px) 100vw, 33vw" />
        <span className={cn(arrowBadge, "absolute end-3 top-3 bg-[var(--background)]/70 backdrop-blur")}>
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">{categoryLabel}</span>
        <Heading className="mt-2 line-clamp-2 text-lg font-medium leading-snug text-theme-heading transition-colors duration-300 group-hover:text-accent sm:text-xl">
          {post.title}
        </Heading>
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
