import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, LayoutGrid } from "lucide-react";
import { getToolBySlug, getCategoryById } from "@/lib/toolsConfig";
import { getBlogForTool } from "@/lib/blogConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { getPrimarySeoCategoryForTool } from "@/lib/toolSeoCategories";
import { generateToolSeoSections } from "@/lib/toolSeoGenerator";
import { getSoftwareApplicationCategory } from "@/lib/toolPageSeo";
import { SITE } from "@/lib/siteConfig";
import {
  softwareApplicationJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  howToJsonLd,
} from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import ConsultingCTA from "@/components/ui/ConsultingCTA";
import ToolRecommendations from "@/components/tools/ToolRecommendations";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import ToolProcessFlow from "@/components/tools/ToolProcessFlow";
import ToolViewTracker from "@/components/tools/ToolViewTracker";
import RecentlyViewed from "@/components/tools/RecentlyViewed";
import ToolInternalLinks from "@/components/tools/ToolInternalLinks";
import ToolRenderer from "@/components/tools/ToolRenderer";
import AffiliateCta from "@/components/ui/AffiliateCta";

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
    softwareApplicationJsonLd(
      tool.title,
      tool.seo.description,
      toolUrl,
      getSoftwareApplicationCategory(tool.category)
    ),
    howToJsonLd(tool.title, tool.shortDescription, toolUrl, tool.howToUse),
    faqJsonLd(seoSections.faq),
  ];

  const guideBlog = getBlogForTool(slug);

  return (
    <div className="pb-24">
      <ToolViewTracker slug={slug} />
      <JsonLd data={schema} />

      <section className="border-b border-theme-subtle/60 pb-8 pt-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-5 flex items-start gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br sm:h-14 sm:w-14 sm:rounded-2xl ${tool.gradient}`}>
              <Icon className="h-6 w-6 text-white sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {category && (
                  <Link href={hubCrumb.href} prefetch className="text-xs font-semibold uppercase tracking-wider text-accent hover:underline">
                    {seoCategory?.label ?? category.label}
                  </Link>
                )}
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-theme-subtle transition-colors hover:text-accent"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Browse all tools
                </Link>
              </div>
              <h1 className="mt-1 break-words text-2xl font-extrabold text-theme-heading sm:text-3xl">{tool.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-theme-muted sm:text-base">{tool.shortDescription}</p>
              <p className="mt-2 text-xs text-theme-subtle sm:text-sm">
                Free online tool · Works in your browser · No account required
              </p>
              {guideBlog && (
                <Link
                  href={`/blog/${guideBlog.slug}`}
                  prefetch
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  Read the full guide
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ToolProcessFlow tool={tool} />

          <div className="min-w-0">
            <ToolRenderer slug={slug} />
          </div>

          <AdPlaceholder placement="after-tool-mobile" />
          <AdPlaceholder placement="between-content" className="hidden lg:flex" />

          <ToolRecommendations currentSlug={slug} layout="grid" limit={6} />
          <RecentlyViewed excludeSlug={slug} />

          <ConsultingCTA className="mt-12" />
          <AffiliateCta
            context={
              slug === "remove-exif"
                ? "privacy"
                : slug.includes("youtube") || slug.includes("instagram") || slug.includes("tiktok")
                  ? "creator"
                  : slug.includes("json") || slug.includes("regex") || tool.category === "developer"
                    ? "developer"
                    : "creator"
            }
          />
          <ToolInternalLinks slug={slug} />

          <AdPlaceholder placement="between-content" className="hidden lg:flex" />
          <ToolSeoContent tool={tool} />
        </div>
      </section>
    </div>
  );
}
