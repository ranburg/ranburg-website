import { notFound } from "next/navigation";
import { getMessages, getTranslations } from "next-intl/server";
import { BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getToolBySlug, getCategoryById } from "@/lib/toolsConfig";
import { localizeTool } from "@/lib/i18n/localizeTool";
import { localizedPath, type AppLocale } from "@/i18n/routing";
import { getBlogForTool } from "@/lib/blogConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { getPrimarySeoCategoryForTool } from "@/lib/toolSeoCategories";
import { generateToolSeoSections } from "@/lib/toolSeoGenerator";
import {
  buildLocalizedToolDescription,
  buildToolPageH1,
  getSoftwareApplicationCategory,
} from "@/lib/toolPageSeo";
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
import ToolNextSteps from "@/components/tools/ToolNextSteps";
import WorkedExampleBanner from "@/components/tools/WorkedExampleBanner";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import ToolProcessFlow from "@/components/tools/ToolProcessFlow";
import ToolViewTracker from "@/components/tools/ToolViewTracker";
import RecentlyViewed from "@/components/tools/RecentlyViewed";
import ToolInternalLinks from "@/components/tools/ToolInternalLinks";
import ToolRenderer from "@/components/tools/ToolRenderer";
import ToolUiMessages from "@/components/i18n/ToolUiMessages";
import AffiliateCta from "@/components/ui/AffiliateCta";
import { iconWell } from "@/components/tools/iconWell";

interface ToolPageProps {
  slug: string;
  locale: AppLocale;
}

export default async function ToolPageShell({ slug, locale }: ToolPageProps) {
  const configuredTool = getToolBySlug(slug);
  if (!configuredTool) notFound();
  const [tShell, messages] = await Promise.all([
    getTranslations("tools.shell"),
    getMessages(),
  ]);
  const tool = localizeTool(
    configuredTool,
    (messages as { tools?: { meta?: Record<string, object> } }).tools?.meta
  );

  const Icon = getToolIcon(tool.icon, tool.slug);
  const category = getCategoryById(tool.category);
  const seoCategory = getPrimarySeoCategoryForTool(slug);
  const seoSections = generateToolSeoSections(tool);
  const toolUrl = `${SITE.url}${localizedPath(locale, `/tools/${slug}`)}`;
  const h1 = buildToolPageH1(tool, locale);
  const pageDescription = buildLocalizedToolDescription(tool, locale);

  const hubCrumb =
    tool.category === "salesforce"
      ? { label: "Salesforce Tools", href: "/tools/salesforce" }
      : seoCategory
        ? { label: seoCategory.label, href: `/tools/${seoCategory.slug}` }
        : { label: tShell("breadcrumbTools"), href: "/tools" };

  const breadcrumbs = [
    { label: tShell("breadcrumbHome"), href: "/" },
    { label: tShell("breadcrumbTools"), href: "/tools" },
    hubCrumb,
    { label: h1 },
  ];

  const schema = [
    breadcrumbJsonLd([
      { name: tShell("breadcrumbHome"), url: `${SITE.url}${localizedPath(locale, "/")}` },
      { name: tShell("breadcrumbTools"), url: `${SITE.url}${localizedPath(locale, "/tools")}` },
      { name: hubCrumb.label, url: `${SITE.url}${localizedPath(locale, hubCrumb.href)}` },
      { name: h1, url: toolUrl },
    ]),
    softwareApplicationJsonLd(h1, pageDescription, toolUrl, getSoftwareApplicationCategory(tool.category)),
    howToJsonLd(h1, tool.shortDescription, toolUrl, tool.howToUse),
    faqJsonLd(seoSections.faq),
  ];

  const guideBlog = getBlogForTool(slug);

  return (
    <div className="pb-24">
      <ToolViewTracker slug={slug} />
      <JsonLd data={schema} />

      <section className="pt-8 sm:pt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} />

          <header className="mt-6 flex items-start gap-4">
            <div {...iconWell(tool.gradient, "mt-0.5 h-11 w-11 rounded-xl sm:h-12 sm:w-12")}>
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.25} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                {category && (
                  <Link href={hubCrumb.href} className="font-semibold uppercase tracking-wider text-accent hover:underline">
                    {seoCategory?.label ?? category.label}
                  </Link>
                )}
                <Link href="/tools" className="text-theme-subtle hover:text-accent">
                  {tShell("allTools")}
                </Link>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-theme-heading sm:text-3xl">{h1}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-theme-muted sm:text-[15px]">
                {pageDescription}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-theme-muted">
                <li className="rounded-full border border-theme bg-[var(--surface-elevated)] px-2.5 py-1">
                  {tShell("freeOnline")}
                </li>
                <li className="rounded-full border border-theme bg-[var(--surface-elevated)] px-2.5 py-1">
                  {tShell("noSignupNeeded")}
                </li>
                <li className="rounded-full border border-theme bg-[var(--surface-elevated)] px-2.5 py-1">
                  {tShell("inBrowser")}
                </li>
              </ul>
              {guideBlog && (
                <Link
                  href={`/blog/${guideBlog.slug}`}
                  prefetch={false}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                >
                  <BookOpen className="h-3.5 w-3.5 shrink-0" />
                  Guide
                </Link>
              )}
            </div>
          </header>

          <div className="mt-8 min-w-0" data-tool-interactive>
            <ToolUiMessages>
              <ToolRenderer slug={slug} />
            </ToolUiMessages>
          </div>

          <WorkedExampleBanner slug={slug} />
          <ToolProcessFlow tool={tool} />
          <ToolNextSteps currentSlug={slug} limit={3} />

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
          <ToolSeoContent tool={tool} locale={locale} />
        </div>
      </section>
    </div>
  );
}
