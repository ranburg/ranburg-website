import { notFound } from "next/navigation";
import Link from "next/link";
import { getToolBySlug, getCategoryById } from "@/lib/toolsConfig";
import { getToolIcon } from "@/lib/toolIcons";
import { SITE } from "@/lib/siteConfig";
import { softwareApplicationJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ToolRecommendations from "@/components/tools/ToolRecommendations";
import ToolSeoContent from "@/components/tools/ToolSeoContent";
import { TOOL_COMPONENTS } from "@/components/tools/registry";

const SALESFORCE_SERVICE_LINKS: Record<string, { href: string; label: string }> = {
  salesforce: { href: "/services/salesforce-development", label: "Salesforce Development Services" },
};

interface ToolPageProps {
  slug: string;
}

export default function ToolPageShell({ slug }: ToolPageProps) {
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const ToolComponent = TOOL_COMPONENTS[slug];
  if (!ToolComponent) notFound();

  const Icon = getToolIcon(tool.icon);
  const category = getCategoryById(tool.category);
  const toolUrl = `${SITE.url}/tools/${slug}`;
  const hubCrumb =
    tool.category === "salesforce"
      ? { label: "Salesforce Tools", href: "/tools/salesforce" }
      : { label: "Tools", href: "/tools" };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    hubCrumb,
    { label: tool.title },
  ];

  const schema = [
    breadcrumbJsonLd([
      { name: "Home", url: SITE.url },
      { name: hubCrumb.label, url: `${SITE.url}${hubCrumb.href}` },
      { name: tool.title, url: toolUrl },
    ]),
    softwareApplicationJsonLd(tool.title, tool.seo.description, toolUrl, tool.badge),
    ...(tool.faq?.length ? [faqJsonLd(tool.faq)] : []),
  ];

  const serviceLink =
    tool.category === "salesforce"
      ? SALESFORCE_SERVICE_LINKS.salesforce
      : null;

  return (
    <div className="pb-24">
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
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">{category.label}</span>
              )}
              <h1 className="mt-1 text-3xl font-extrabold text-theme-heading sm:text-4xl">{tool.title}</h1>
              <p className="mt-3 max-w-2xl text-theme-muted">{tool.shortDescription}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
            <div>
              <ToolComponent />
              <div className="mt-12 lg:hidden">
                <ToolRecommendations currentSlug={slug} />
              </div>
              <ToolSeoContent tool={tool} />
              {serviceLink && (
                <div className="mt-12 rounded-xl border border-accent/20 bg-accent/5 p-6">
                  <p className="font-semibold text-theme-heading">Need expert Salesforce help?</p>
                  <p className="mt-2 text-sm text-theme-muted">
                    Ranburg LLP consultants build production OmniStudio, Revenue Cloud, and LWC solutions.
                  </p>
                  <Link href={serviceLink.href} className="mt-4 inline-flex text-sm font-medium text-accent hover:underline">
                    {serviceLink.label} →
                  </Link>
                </div>
              )}
            </div>
            <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
              <ToolRecommendations currentSlug={slug} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
