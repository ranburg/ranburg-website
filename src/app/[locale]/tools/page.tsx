import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { TOOLS_CONFIG } from "@/lib/toolsConfig";
import ToolsHub from "@/components/tools/ToolsHub";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

const TOOL_COUNT = TOOLS_CONFIG.length;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : "en";
  setRequestLocale(locale);
  const t = await getTranslations("pages");
  return buildMetadata({
    title: `${t("toolsIndex.title")} — ${TOOL_COUNT}+ | Ranburg`,
    description: t("toolsIndex.description"),
    path: "/tools",
    locale,
  });
}

export default async function ToolsPage({ params }: Props) {
  const { locale: raw } = await params;
  setRequestLocale(isAppLocale(raw) ? raw : "en");
  const t = await getTranslations("pages");

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden pb-8 pt-16 sm:pt-20">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">{t("toolsIndex.title")}</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-theme-heading sm:text-4xl lg:text-5xl">
            {t("toolsIndex.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-theme-muted sm:text-lg">{t("toolsIndex.description")}</p>
        </div>
      </section>

      <AdPlaceholder placement="below-hero" className="mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ToolsHub />
      </div>
    </div>
  );
}
