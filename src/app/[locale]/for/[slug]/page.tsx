import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isAppLocale } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/siteConfig";
import { PERSONAS, getPersonaBySlug } from "@/lib/personas";
import PersonaLanding from "@/components/persona/PersonaLanding";
import JsonLd from "@/components/seo/JsonLd";
import { localizedPath } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return PERSONAS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = isAppLocale(raw) ? raw : "en";
  setRequestLocale(locale);
  const persona = getPersonaBySlug(slug);
  if (!persona) {
    return buildMetadata({
      title: "Persona not found | Ranburg",
      description: "This persona page does not exist.",
      path: `/for/${slug}`,
      locale,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: persona.seo.title,
    description: persona.seo.description,
    path: `/for/${persona.slug}`,
    keywords: persona.seo.keywords,
    locale,
  });
}

export default async function PersonaPage({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  const locale = isAppLocale(raw) ? raw : "en";
  setRequestLocale(locale);

  const persona = getPersonaBySlug(slug);
  if (!persona) notFound();

  const path = `/for/${persona.slug}`;
  const crumbs = breadcrumbJsonLd([
    { name: "Home", url: `${SITE.url}${localizedPath(locale, "/")}` },
    { name: "Tools", url: `${SITE.url}${localizedPath(locale, "/tools")}` },
    { name: persona.title, url: `${SITE.url}${localizedPath(locale, path)}` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      <PersonaLanding slug={slug} />
    </>
  );
}
