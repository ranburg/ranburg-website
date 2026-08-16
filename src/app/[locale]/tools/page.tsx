import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import { buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import { SITE } from "@/lib/siteConfig";
import JsonLd from "@/components/seo/JsonLd";
import ToolsHub from "@/components/tools/ToolsHub";

const TOOL_COUNT = TOOLS_CONFIG.length;

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : "en";
  setRequestLocale(locale);
  const t = await getTranslations("pages");
  return buildMetadata({
    title: `${t("toolsIndex.title")} — ${TOOL_COUNT}+ Calculators & Converters | Ranburg`,
    description: t("toolsIndex.description"),
    path: "/tools",
    locale,
    keywords: [
      "free online tools",
      "online calculators",
      "image converter",
      "PDF tools",
      "EMI calculator",
      "JSON formatter",
    ],
  });
}

export default async function ToolsPage({ params, searchParams }: Props) {
  const { locale: raw } = await params;
  setRequestLocale(isAppLocale(raw) ? raw : "en");
  const t = await getTranslations("pages");
  const { q } = await searchParams;
  const initialQuery = (q ?? "").trim();

  return (
    <div className="pb-24 pt-16 sm:pt-20">
      <JsonLd
        data={collectionPageJsonLd(
          "Free online tools",
          t("toolsIndex.description"),
          `${SITE.url}/tools`,
          TOOLS_CONFIG.slice(0, 40).map((tool) => ({
            name: tool.title,
            url: `${SITE.url}/tools/${tool.slug}`,
          }))
        )}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ToolsHub
          initialQuery={initialQuery}
          title={t("toolsIndex.title")}
          description={t("toolsIndex.description")}
        />
      </div>
    </div>
  );
}
