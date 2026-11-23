import { setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import { BLOG_POSTS } from "@/lib/blogConfig";
import BlogList from "@/components/blog/BlogList";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

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

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  setRequestLocale(isAppLocale(raw) ? raw : "en");
  return (
    <div className="pb-24">
      <PageHero
        eyebrow="Insights & guides"
        title={
          <>
            The Ranburg <span className="text-gradient-accent font-semibold">Blog</span>
          </>
        }
        lede={
          <>
            Practical guides on creators, SEO, calculators, developer tools, and business growth — each paired with
            free tools you can use right away.
          </>
        }
      >
        <div className="flex flex-wrap gap-2 text-sm text-theme-muted">
          <span className="rounded-full border border-theme-subtle bg-theme-surface px-4 py-1.5">
            {BLOG_POSTS.length}+ articles
          </span>
          <span className="rounded-full border border-theme-subtle bg-theme-surface px-4 py-1.5">
            Free tool guides
          </span>
          <span className="rounded-full border border-theme-subtle bg-theme-surface px-4 py-1.5">
            Updated regularly
          </span>
        </div>
      </PageHero>

      <AdPlaceholder placement="between-sections" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      <section className="py-6 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlogList posts={BLOG_POSTS} />
        </div>
      </section>
    </div>
  );
}
