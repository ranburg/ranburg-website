import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/blogConfig";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const metadata = buildMetadata({
  title: "Salesforce Blog & Insights | Ranburg LLP",
  description:
    "Expert articles on Salesforce Industries, OmniStudio, Revenue Cloud, LWC, integrations, and implementation best practices from Ranburg consultants in India.",
  path: "/blog",
  keywords: ["Salesforce blog", "OmniStudio best practices", "Revenue Cloud guide", "Salesforce India"],
});

export default function BlogPage() {
  return (
    <div className="pb-24">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Insights</p>
          <h1 className="mt-4 text-4xl font-extrabold text-theme-heading sm:text-5xl">
            Salesforce <span className="text-gradient-accent">Blog</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-theme-muted">
            Implementation guides, architecture patterns, and best practices from certified Salesforce consultants at Ranburg LLP.
          </p>
        </div>
      </section>
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="glass-card group block p-6 hover:border-accent/30">
                <h2 className="text-xl font-bold text-theme-heading group-hover:text-accent">{post.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-theme-muted line-clamp-3">{post.excerpt}</p>
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
        </div>
      </section>
    </div>
  );
}
