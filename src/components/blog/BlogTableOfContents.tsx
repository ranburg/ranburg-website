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
    <nav className={cn("card p-5", className)} aria-label="Table of contents">
      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-accent">
        <span className="status-dot" aria-hidden />
        On this page
      </p>
      <ol className="mt-4 space-y-1 border-s border-theme-subtle">
        {headings.map((heading, index) => (
          <li key={index}>
            <a
              href={`#${slugifyHeading(heading.text)}`}
              className="-ms-px block border-s border-transparent py-1.5 ps-4 text-sm leading-snug text-theme-muted transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
