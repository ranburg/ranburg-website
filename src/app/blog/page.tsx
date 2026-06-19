import { buildMetadata } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/blogConfig";
import BlogList from "@/components/blog/BlogList";

export const metadata = buildMetadata({
  title: "Blog — SEO, Development, AI & Business Tips | Ranburg",
  description:
    "Articles on SEO, software development, AI tools, business productivity, and Salesforce from Ranburg LLP.",
  path: "/blog",
  keywords: ["SEO blog", "developer blog", "AI tools", "Salesforce blog", "business productivity"],
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
            SEO, development, AI tools, business productivity, and Salesforce insights.
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
