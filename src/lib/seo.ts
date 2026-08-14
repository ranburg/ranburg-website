import type { Metadata } from "next";
import { SITE } from "./siteConfig";
import {
  localeOgMap,
  localizedPath,
  locales,
  type AppLocale,
} from "@/i18n/routing";

interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  ogType?: "website" | "article";
  locale?: AppLocale;
  publishedTime?: string;
  modifiedTime?: string;
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  ogImage,
  noIndex = false,
  ogType = "website",
  locale = "en",
  publishedTime,
  modifiedTime,
}: PageSeoInput): Metadata {
  const localized = localizedPath(locale, path);
  const url = `${SITE.url}${localized}`;
  const image = ogImage ?? SITE.defaultOgImage;
  const imageUrl = `${SITE.url}${image}`;

  const languages: Record<string, string> = { "x-default": `${SITE.url}${path}` };
  for (const loc of locales) {
    languages[loc] = `${SITE.url}${localizedPath(loc, path)}`;
  }

  const alternateLocales = locales
    .filter((loc) => loc !== locale)
    .map((loc) => localeOgMap[loc]);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url, languages },
    // Thin / coming-soon URLs stay out of the index but still pass link equity.
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.brand,
      locale: localeOgMap[locale] ?? SITE.locale,
      alternateLocale: alternateLocales,
      type: ogType,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...(ogType === "article" && publishedTime
        ? { publishedTime, modifiedTime: modifiedTime ?? publishedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: "@ranburg",
      creator: "@ranburg",
      title,
      description,
      images: [imageUrl],
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

/** Stable @id so Organization / WebSite / LocalBusiness link as one brand entity. */
export const ORGANIZATION_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

/**
 * Brand entity for Knowledge Graph / spelling disambiguation.
 * Helps Google treat "Ranburg" as a company (not a typo of "Randburg").
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE.name,
    legalName: "Ranburg LLP",
    alternateName: ["Ranburg", "ranburg.com", "Ranburg Tools"],
    brand: {
      "@type": "Brand",
      name: SITE.brand,
      alternateName: ["Ranburg LLP", "ranburg.com"],
    },
    description: SITE.description,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    image: `${SITE.url}/opengraph-image`,
    email: SITE.email,
    telephone: SITE.phone,
    sameAs: [SITE.social.linkedin, SITE.social.twitter, SITE.url],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      email: SITE.email,
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: [
      "Free online tools",
      "EMI calculator",
      "SIP calculator",
      "GST calculator",
      "YouTube analytics",
      "Salesforce consulting",
    ],
  };
}

/** Site-level entity — name "Ranburg" is intentional for brand queries. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE.brand,
    alternateName: [SITE.name, "ranburg.com", "Ranburg free tools"],
    url: SITE.url,
    description: SITE.description,
    inLanguage: "en-IN",
    publisher: { "@id": ORGANIZATION_ID },
    about: { "@id": ORGANIZATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/tools?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#localbusiness`,
    name: SITE.name,
    alternateName: SITE.brand,
    image: `${SITE.url}/opengraph-image`,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "$$",
    parentOrganization: { "@id": ORGANIZATION_ID },
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
      "Free Online Tools",
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
    applicationSubCategory: "WebApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works on Chrome, Edge, Firefox, Safari.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    isAccessibleForFree: true,
    url,
    image: `${SITE.url}/opengraph-image`,
    inLanguage: "en-IN",
    isPartOf: { "@id": WEBSITE_ID },
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    provider: { "@id": ORGANIZATION_ID },
    potentialAction: {
      "@type": "UseAction",
      target: url,
    },
    featureList: [
      "Free to use",
      "No account required",
      "Works in the browser",
      "Mobile friendly",
    ],
  };
}

export function collectionPageJsonLd(
  name: string,
  description: string,
  url: string,
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    inLanguage: "en-IN",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    mainEntity: {
      "@type": "ItemList",
      name,
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: item.url,
      })),
    },
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
  datePublished: string,
  dateModified?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title.slice(0, 110),
    description,
    url,
    image: `${SITE.url}${SITE.defaultOgImage}`,
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: "en-IN",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}
