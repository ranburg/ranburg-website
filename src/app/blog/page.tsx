import { buildMetadata } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/blogConfig";
import BlogList from "@/components/blog/BlogList";

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
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Resources</p>
          <h1 className="mt-4 text-4xl font-extrabold text-theme-heading sm:text-5xl">
            Ranburg <span className="text-gradient-accent">Blog</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-theme-muted">
            Creator growth, AdSense monetization, calculators, SEO, developer utilities, and small business guides — each linked to free Ranburg tools.
          </p>
        </div>
      </section>
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlogList posts={BLOG_POSTS} />
        </div>
      </section>
    </div>
  );
}
