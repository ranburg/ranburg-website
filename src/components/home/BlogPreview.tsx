import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import { BLOG_POSTS } from "@/lib/blogConfig";
import { inferBlogCategory } from "@/lib/blogCategories";
import { shouldNoIndexBlogPost } from "@/lib/seoGrowthConfig";
import type { BlogPost } from "@/lib/blogTypes";

/** Latest indexable articles. Bodies are stripped so only card data crosses to the client. */
function latestPosts(limit: number): BlogPost[] {
  return BLOG_POSTS.filter((post) => !shouldNoIndexBlogPost(post))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map((post) => ({ ...post, category: inferBlogCategory(post), sections: [], faq: [] }));
}

export default async function BlogPreview() {
  const t = await getTranslations("home");
  const posts = latestPosts(3);
  if (posts.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6" data-reveal="up">
          <div>
            <p className="eyebrow">
              <span className="status-dot" aria-hidden />
              {t("blogEyebrow")}
            </p>
            <h2 className="section-heading mt-5 max-w-3xl">{t("blogTitle")}</h2>
            <p className="section-lede mt-3 max-w-2xl">{t("blogSub")}</p>
          </div>
          <Link href="/blog" className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            {t("blogCta")}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((post, i) => (
            <div
              key={post.slug}
              data-reveal="up"
              style={{ "--reveal-delay": `${i * 100}ms` } as CSSProperties}
              className="h-full"
            >
              <BlogCard post={post} headingLevel="h3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
