import { notFound } from "next/navigation";
import ServicePageShell, { getServiceMetadata } from "@/components/services/ServicePageShell";
import { SERVICES_CONFIG } from "@/lib/servicesConfig";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SERVICES_CONFIG.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return getServiceMetadata(slug);
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const exists = SERVICES_CONFIG.some((s) => s.slug === slug);
  if (!exists) notFound();
  return <ServicePageShell slug={slug} />;
}
