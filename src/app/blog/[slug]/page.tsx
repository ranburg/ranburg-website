import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, User } from "lucide-react";
import { BLOG_POSTS, getBlogBySlug, getFeaturedToolSlug } from "@/lib/blogConfig";
import { getRelatedBlogPosts } from "@/lib/blogCategories";
import { inferBlogCategory, BLOG_CATEGORIES } from "@/lib/blogCategories";
import { SERVICES_CONFIG } from "@/lib/servicesConfig";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import { SITE } from "@/lib/siteConfig";
import { getBlogCategoryAccent } from "@/lib/blogImages";
import { articleJsonLd, faqJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { shouldNoIndexBlogPost } from "@/lib/seoGrowthConfig";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import BlogFaq from "@/components/blog/BlogFaq";
import BlogFeaturedTool from "@/components/blog/BlogFeaturedTool";
import BlogCoverImage from "@/components/blog/BlogCoverImage";
import BlogContent from "@/components/blog/BlogContent";
import BlogTableOfContents from "@/components/blog/BlogTableOfContents";
import BlogRelatedPosts from "@/components/blog/BlogRelatedPosts";
import { formatBlogDate } from "@/components/blog/BlogCard";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seo.title,
    description: post.seo.description,
    path: `/blog/${slug}`,
    keywords: post.seo.keywords,
    ogType: "article",
    noIndex: shouldNoIndexBlogPost(post),
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  const url = `${SITE.url}/blog/${slug}`;
  const relatedServices = SERVICES_CONFIG.filter((s) => post.relatedServices.includes(s.slug));
  const relatedTools = TOOLS_CONFIG.filter((t) => post.relatedTools.includes(t.slug));
  const featuredToolSlug = getFeaturedToolSlug(post);
  const featuredTool = featuredToolSlug ? TOOLS_CONFIG.find((t) => t.slug === featuredToolSlug) : undefined;
  const relatedPosts = getRelatedBlogPosts(slug, 3);
  const category = inferBlogCategory(post);
  const categoryLabel = BLOG_CATEGORIES.find((c) => c.id === category)?.label;
  const accent = getBlogCategoryAccent(category);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: SITE.url },
            { name: "Blog", url: `${SITE.url}/blog` },
            { name: post.title, url },
          ]),
          articleJsonLd(post.title, post.excerpt, url, post.date),
          faqJsonLd(post.faq),
        ]}
      />
      <div className="pb-24">
        {/* Hero */}
        <header className="relative">
          <BlogCoverImage
            post={post}
            priority
            overlay="strong"
            className="aspect-[21/9] min-h-[240px] max-h-[420px] w-full sm:min-h-[320px]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-4xl px-4 pb-8 pt-16 sm:px-6 sm:pb-10 lg:px-8">
              {categoryLabel && (
                <span
                  className={cn(
                    "inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white",
                    accent
                  )}
                >
                  {categoryLabel}
                </span>
              )}
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-theme-heading sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-theme-muted">{post.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-theme-subtle">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  Ranburg Team
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatBlogDate(post.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.readTime} read
                </span>
              </div>
            </div>
          </div>
        </header>

        <article>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl pt-6">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Blog", href: "/blog" },
                  { label: post.title },
                ]}
              />
            </div>

            <div className="mx-auto grid max-w-7xl gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_260px]">
              <div className="mx-auto min-w-0 max-w-4xl">
                {featuredTool && <BlogFeaturedTool tool={featuredTool} />}
                <BlogContent post={post} />
                <BlogFaq faq={post.faq} />

                {(relatedServices.length > 0 || relatedTools.length > 0) && (
                  <div className="mt-16 rounded-2xl border border-theme-subtle bg-[var(--glass-bg)] p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-theme-heading">Continue exploring</h2>
                    {relatedTools.length > 0 && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-theme-body">Free tools</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {relatedTools.map((t) => (
                            <Link
                              key={t.slug}
                              href={`/tools/${t.slug}`}
                              className="rounded-lg bg-accent-emerald/10 px-3 py-1.5 text-sm text-accent-emerald hover:bg-accent-emerald/20"
                            >
                              {t.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    {relatedServices.length > 0 && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-theme-body">Related services</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {relatedServices.map((s) => (
                            <Link
                              key={s.slug}
                              href={`/services/${s.slug}`}
                              className="rounded-lg bg-accent/10 px-3 py-1.5 text-sm text-accent hover:bg-accent/20"
                            >
                              {s.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <BlogRelatedPosts posts={relatedPosts} />

                <div className="mt-16 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 to-accent-emerald/5 p-8 text-center sm:p-10">
                  <h2 className="text-xl font-bold text-theme-heading sm:text-2xl">Explore more free tools</h2>
                  <p className="mx-auto mt-3 max-w-lg text-theme-muted">
                    Browse calculators, formatters, SEO utilities, and Salesforce admin tools on Ranburg.
                  </p>
                  <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button href="/tools" icon>
                      Browse Tools
                    </Button>
                    <Button href="/blog" variant="outline">
                      More Articles
                    </Button>
                  </div>
                </div>
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-[calc(var(--nav-height)+1.5rem)] space-y-6">
                  <BlogTableOfContents post={post} />
                </div>
              </aside>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
