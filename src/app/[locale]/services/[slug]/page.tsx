import { setRequestLocale } from "next-intl/server";
import { isAppLocale } from "@/i18n/routing";
import { notFound } from "next/navigation";
import ServicePageShell, { getServiceMetadata } from "@/components/services/ServicePageShell";
import { SERVICES_CONFIG } from "@/lib/servicesConfig";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return SERVICES_CONFIG.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  setRequestLocale(isAppLocale(raw) ? raw : "en");
  return getServiceMetadata(slug);
}

export default async function ServicePage({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  setRequestLocale(isAppLocale(raw) ? raw : "en");
  const exists = SERVICES_CONFIG.some((s) => s.slug === slug);
  if (!exists) notFound();
  return <ServicePageShell slug={slug} />;
}
