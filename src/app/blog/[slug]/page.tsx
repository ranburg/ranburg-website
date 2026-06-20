import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { BLOG_POSTS, getBlogBySlug, getFeaturedToolSlug } from "@/lib/blogConfig";
import { getRelatedBlogPosts } from "@/lib/blogCategories";
import { inferBlogCategory, BLOG_CATEGORIES } from "@/lib/blogCategories";
import { SERVICES_CONFIG } from "@/lib/servicesConfig";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import { SITE } from "@/lib/siteConfig";
import { articleJsonLd, faqJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import BlogFaq from "@/components/blog/BlogFaq";
import BlogFeaturedTool from "@/components/blog/BlogFeaturedTool";

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
  const categoryLabel = BLOG_CATEGORIES.find((c) => c.id === inferBlogCategory(post))?.label;

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
        <article className="py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
            />
            <h1 className="break-words text-2xl font-extrabold text-theme-heading sm:text-3xl lg:text-4xl">{post.title}</h1>
            {categoryLabel && (
              <span className="mt-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                {categoryLabel}
              </span>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-theme-subtle">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{post.date}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{post.readTime} read</span>
            </div>
            {featuredTool && <BlogFeaturedTool tool={featuredTool} />}
            <div className="mt-10 space-y-4">
              {post.sections.map((section, i) => {
                if (section.type === "h2") return <h2 key={i} className="pt-6 text-2xl font-bold text-theme-heading">{section.text}</h2>;
                if (section.type === "h3") return <h3 key={i} className="pt-4 text-xl font-semibold text-theme-heading">{section.text}</h3>;
                return <p key={i} className="leading-relaxed text-theme-muted">{section.text}</p>;
              })}
            </div>
            <BlogFaq faq={post.faq} />
            {(relatedServices.length > 0 || relatedTools.length > 0) && (
              <div className="mt-16 border-t border-theme-subtle pt-12">
                <h2 className="text-xl font-bold text-theme-heading">Continue Exploring</h2>
                {relatedServices.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-theme-body">Related Services</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {relatedServices.map((s) => (
                        <Link key={s.slug} href={`/services/${s.slug}`} className="rounded-lg bg-accent/10 px-3 py-1.5 text-sm text-accent hover:bg-accent/20">
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {relatedTools.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-theme-body">Free Tools</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {relatedTools.map((t) => (
                        <Link key={t.slug} href={`/tools/${t.slug}`} className="rounded-lg bg-accent-emerald/10 px-3 py-1.5 text-sm text-accent-emerald hover:bg-accent-emerald/20">
                          {t.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {relatedPosts.length > 0 && (
              <div className="mt-16 border-t border-theme-subtle pt-12">
                <h2 className="text-xl font-bold text-theme-heading">Related Articles</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((rp) => (
                    <Link key={rp.slug} href={`/blog/${rp.slug}`} className="glass-card block p-4 hover:border-accent/30">
                      <p className="font-medium text-theme-heading hover:text-accent">{rp.title}</p>
                      <p className="mt-1 text-xs text-theme-subtle">{rp.readTime}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div className="glass-card mt-16 p-8 text-center">
              <h2 className="text-xl font-bold text-theme-heading">Need custom software or Salesforce consulting?</h2>
              <p className="mt-3 text-theme-muted">Ranburg LLP helps teams build production Salesforce and web solutions.</p>
              <div className="mt-6"><Button href="/contact" icon>Talk to a Consultant</Button></div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
