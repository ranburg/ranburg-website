import type { Metadata } from "next";
import { SITE } from "./siteConfig";

interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  ogType?: "website" | "article";
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  ogImage,
  noIndex = false,
  ogType = "website",
}: PageSeoInput): Metadata {
  const url = `${SITE.url}${path}`;
  const image = ogImage ?? SITE.defaultOgImage;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: ogType,
      images: [{ url: `${SITE.url}${image}`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE.url}${image}`],
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/opengraph-image`,
    email: SITE.email,
    telephone: SITE.phone,
    sameAs: [SITE.social.linkedin, SITE.social.twitter],
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    image: `${SITE.url}/opengraph-image`,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    areaServed: { "@type": "Country", name: "India" },
    serviceType: [
      "Salesforce Consulting",
      "Salesforce Development",
      "OmniStudio Development",
      "Revenue Cloud Implementation",
    ],
  };
}

export function serviceJsonLd(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
    areaServed: "IN",
    url,
  };
}

export function softwareApplicationJsonLd(
  name: string,
  description: string,
  url: string,
  category: string
) {
  return {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name,
    description,
    applicationCategory: category,
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    isAccessibleForFree: true,
    url,
    provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };
}

export function howToJsonLd(
  name: string,
  description: string,
  url: string,
  steps: string[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${name}`,
    description,
    url,
    totalTime: "PT2M",
    tool: [{ "@type": "HowToTool", name }],
    step: steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Step ${i + 1}`,
      text,
      url: `${url}#how-to-use`,
    })),
  };
}

export function faqJsonLd(faq: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function articleJsonLd(
  title: string,
  description: string,
  url: string,
  datePublished: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    author: { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/opengraph-image` },
    },
  };
}
