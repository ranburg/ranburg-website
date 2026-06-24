import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getToolBySlug, getCategoryById } from "@/lib/toolsConfig";
import { getBlogForTool } from "@/lib/blogConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { getPrimarySeoCategoryForTool } from "@/lib/toolSeoCategories";
import { generateToolSeoSections } from "@/lib/toolSeoGenerator";
import { SITE } from "@/lib/siteConfig";
import { softwareApplicationJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import ConsultingCTA from "@/components/ui/ConsultingCTA";
import ToolRecommendations from "@/components/tools/ToolRecommendations";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import AllToolsNav from "@/components/tools/AllToolsNav";
import ToolViewTracker from "@/components/tools/ToolViewTracker";
import RecentlyViewed from "@/components/tools/RecentlyViewed";
import ToolInternalLinks from "@/components/tools/ToolInternalLinks";
import ToolRenderer from "@/components/tools/ToolRenderer";

interface ToolPageProps {
  slug: string;
}

export default function ToolPageShell({ slug }: ToolPageProps) {
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const Icon = getToolIcon(tool.icon);
  const category = getCategoryById(tool.category);
  const seoCategory = getPrimarySeoCategoryForTool(slug);
  const seoSections = generateToolSeoSections(tool);
  const toolUrl = `${SITE.url}/tools/${slug}`;

  const hubCrumb =
    tool.category === "salesforce"
      ? { label: "Salesforce Tools", href: "/tools/salesforce" }
      : seoCategory
        ? { label: seoCategory.label, href: `/tools/${seoCategory.slug}` }
        : { label: "Tools", href: "/tools" };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    hubCrumb,
    { label: tool.title },
  ];

  const schema = [
    breadcrumbJsonLd([
      { name: "Home", url: SITE.url },
      { name: "Tools", url: `${SITE.url}/tools` },
      { name: hubCrumb.label, url: `${SITE.url}${hubCrumb.href}` },
      { name: tool.title, url: toolUrl },
    ]),
    softwareApplicationJsonLd(tool.title, tool.seo.description, toolUrl, tool.badge),
    faqJsonLd(seoSections.faq),
  ];

  const guideBlog = getBlogForTool(slug);

  return (
    <div className="pb-24">
      <ToolViewTracker slug={slug} />
      <JsonLd data={schema} />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex items-start gap-4">
            <div className={`hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br sm:flex ${tool.gradient}`}>
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
              {category && (
                <Link href={hubCrumb.href} prefetch className="text-xs font-semibold uppercase tracking-wider text-accent hover:underline">
                  {seoCategory?.label ?? category.label}
                </Link>
              )}
              <h1 className="mt-1 break-words text-2xl font-extrabold text-theme-heading sm:text-3xl lg:text-4xl">{tool.title}</h1>
              <p className="mt-3 max-w-2xl text-sm text-theme-muted sm:text-base">{tool.shortDescription}</p>
              {guideBlog && (
                <Link
                  href={`/blog/${guideBlog.slug}`}
                  prefetch
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-accent/25 bg-accent/5 px-3 py-2 text-sm font-medium text-accent hover:border-accent/40 hover:bg-accent/10"
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  Read the guide: {guideBlog.title}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdPlaceholder placement="below-hero" className="hidden md:flex" />
      </div>

      <section className="py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AllToolsNav activeSlug={slug} variant="compact" className="mb-6" />
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <div className="hidden lg:block">
              <AllToolsNav activeSlug={slug} />
              <div className="mt-6">
                <AdPlaceholder placement="sidebar" />
              </div>
            </div>
            <div className="min-w-0">
              <ToolRenderer slug={slug} />
              <AdPlaceholder placement="after-tool-mobile" />
              <AdPlaceholder placement="between-content" className="hidden md:block" />
              <ToolSeoContent tool={tool} />
              <AdPlaceholder placement="between-content" className="hidden md:block" />
              <ConsultingCTA className="mt-12" />
              <ToolInternalLinks slug={slug} />
              <ToolRecommendations currentSlug={slug} layout="grid" limit={8} />
              <RecentlyViewed excludeSlug={slug} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
