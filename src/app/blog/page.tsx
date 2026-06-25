import { BLOG_POSTS } from "@/lib/blogConfig";
import BlogList from "@/components/blog/BlogList";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog — Creator Tips, SEO, Calculators & Free Tools | Ranburg",
  description:
    "100+ articles on YouTube growth, Instagram analytics, AdSense, business calculators, SEO, developer tools, and small business resources — with free Ranburg tools.",
  path: "/blog",
  keywords: [
    "YouTube growth blog",
    "Instagram tips",
    "AdSense RPM",
    "GST calculator guide",
    "free developer tools",
    "SEO blog",
    "small business resources",
  ],
});

export default function BlogPage() {
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden border-b border-theme-subtle py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-accent-emerald/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Insights & guides</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-theme-heading sm:text-5xl lg:text-6xl">
            The Ranburg <span className="text-gradient-accent">Blog</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-theme-muted">
            Practical guides on creators, SEO, calculators, developer tools, and business growth — each paired with
            free tools you can use right away.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-theme-subtle">
            <span className="rounded-full border border-theme-subtle bg-[var(--glass-bg)] px-4 py-1.5">
              {BLOG_POSTS.length}+ articles
            </span>
            <span className="rounded-full border border-theme-subtle bg-[var(--glass-bg)] px-4 py-1.5">
              Free tool guides
            </span>
            <span className="rounded-full border border-theme-subtle bg-[var(--glass-bg)] px-4 py-1.5">
              Updated regularly
            </span>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlogList posts={BLOG_POSTS} />
        </div>
      </section>
    </div>
  );
}
