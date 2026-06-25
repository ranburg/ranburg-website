import type { BlogPost } from "@/lib/blogTypes";
import { slugifyHeading } from "@/lib/blogImages";
import { cn } from "@/lib/utils";

interface BlogTableOfContentsProps {
  post: BlogPost;
  className?: string;
}

export default function BlogTableOfContents({ post, className }: BlogTableOfContentsProps) {
  const headings = post.sections.filter((s) => s.type === "h2");
  if (headings.length < 3) return null;

  return (
    <nav className={cn("rounded-2xl border border-theme-subtle bg-[var(--glass-bg)] p-5", className)} aria-label="Table of contents">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">On this page</p>
      <ol className="mt-3 space-y-2">
        {headings.map((heading, index) => (
          <li key={index}>
            <a
              href={`#${slugifyHeading(heading.text)}`}
              className="block text-sm leading-snug text-theme-muted transition-colors hover:text-accent"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
