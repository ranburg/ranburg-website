import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Calendar, Clock, User } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
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
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import { formatBlogDate } from "@/components/blog/BlogCard";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  setRequestLocale(isAppLocale(raw) ? raw : "en");
  const post = getBlogBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seo.title,
    description: post.seo.description,
    path: `/blog/${slug}`,
    locale: isAppLocale(raw) ? raw : "en",
    keywords: post.seo.keywords,
    ogType: "article",
    noIndex: shouldNoIndexBlogPost(post),
    publishedTime: post.date,
    modifiedTime: post.date,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  setRequestLocale(isAppLocale(raw) ? raw : "en");
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
        <header className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
          <div className="max-w-4xl">
            {categoryLabel && (
              <span
                className={cn(
                  "rise-soft inline-flex rounded-full bg-gradient-to-r px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-white",
                  accent
                )}
              >
                {categoryLabel}
              </span>
            )}
            <h1 className="rise mt-6 text-3xl font-light leading-[1.1] tracking-[-0.035em] text-theme-heading sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="rise-soft mt-6 max-w-2xl text-lg leading-relaxed text-theme-muted">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-theme-muted">
              <span className="flex items-center gap-1.5 rounded-full border border-theme-subtle bg-theme-surface px-3.5 py-1.5">
                <User className="h-4 w-4 text-accent" />
                Ranburg Team
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-theme-subtle bg-theme-surface px-3.5 py-1.5">
                <Calendar className="h-4 w-4 text-accent" />
                {formatBlogDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-theme-subtle bg-theme-surface px-3.5 py-1.5">
                <Clock className="h-4 w-4 text-accent" />
                {post.readTime} read
              </span>
            </div>
          </div>
          <BlogCoverImage
            post={post}
            priority
            overlay="light"
            className="mt-10 aspect-[21/9] min-h-[200px] w-full rounded-[1.75rem] border border-theme-subtle"
            sizes="(max-width: 1280px) 100vw, 1216px"
          />
        </header>

        <article>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_260px]">
              <div className="mx-auto min-w-0 max-w-4xl">
                {featuredTool && <BlogFeaturedTool tool={featuredTool} />}
                <BlogContent post={post} />
                <AdPlaceholder placement="in-article" />
                <BlogFaq faq={post.faq} />

                {(relatedServices.length > 0 || relatedTools.length > 0) && (
                  <div className="card mt-16 p-6 sm:p-8" data-reveal="up">
                    <h2 className="text-2xl font-medium tracking-tight text-theme-heading">Continue exploring</h2>
                    {relatedTools.length > 0 && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-theme-body">Free tools</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {relatedTools.map((t) => (
                            <Link
                              key={t.slug}
                              href={`/tools/${t.slug}`}
                              className="rounded-full border border-theme-subtle bg-theme-surface px-3.5 py-1.5 text-sm text-theme-body transition-colors duration-300 hover:border-accent/60 hover:text-accent"
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
                              className="rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-sm text-accent transition-colors duration-300 hover:bg-accent/20"
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

                <div className="card spotlight relative mt-16 overflow-hidden rounded-[1.75rem] px-6 py-12 text-center sm:px-10 sm:py-14" data-reveal="scale">
                  <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" aria-hidden />
                  <h2 className="relative text-3xl font-light leading-[1.1] tracking-[-0.03em] text-theme-heading sm:text-4xl">Explore more free tools</h2>
                  <p className="section-lede relative mx-auto mt-3 max-w-lg">
                    Browse calculators, formatters, SEO utilities, and Salesforce admin tools on Ranburg.
                  </p>
                  <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button href="/tools" size="lg" icon>
                      Browse Tools
                    </Button>
                    <Button href="/blog" size="lg" variant="secondary">
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
