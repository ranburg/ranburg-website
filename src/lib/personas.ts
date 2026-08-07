import type { ToolCategoryId, ToolConfig } from "./toolsConfig";
import { TOOLS_CONFIG, getToolBySlug } from "./toolsConfig";
import type { SeoCategorySlug } from "./toolSeoCategories";
import { getToolsForSeoCategory } from "./toolSeoCategories";

export const PERSONA_STORAGE_KEY = "user_persona";

export interface PersonaTheme {
  /** Primary accent (maps to --accent) */
  accent: string;
  /** Soft accent (maps to --accent-soft) */
  accentSoft: string;
  /** Secondary accent (maps to --accent-emerald) */
  accentEmerald: string;
  /** Light-mode page tint overlays */
  tintFrom: string;
  tintTo: string;
  /** Dark-mode page tint overlays */
  tintFromDark: string;
  tintToDark: string;
  /** Hero section gradient classes */
  heroGradient: string;
  /** Optional display font hint for landing hero */
  fontHint?: "sans" | "mono";
}

export interface Persona {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortLabel: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  theme: PersonaTheme;
  /** Tool slugs featured at the top of the persona landing page */
  featuredToolIds: string[];
  /** Primary taxonomy categories for this persona */
  recommendedCategories: ToolCategoryId[];
  /** Optional SEO hub categories for broader tool discovery */
  recommendedSeoCategories?: SeoCategorySlug[];
}

export const PERSONAS: Persona[] = [
  {
    id: "content-creator",
    title: "Content Creator",
    slug: "content-creators",
    shortLabel: "Creator",
    description:
      "YouTube, Instagram, and social growth tools — thumbnails, hashtags, revenue estimates, and image workflows built for creators.",
    seo: {
      title: "Free Web & Content Tools for Content Creators | Ranburg",
      description:
        "Free YouTube, Instagram, image, and social media tools for content creators. Check thumbnails, generate hashtags, estimate revenue, and compress assets — no signup.",
      keywords: [
        "content creator tools",
        "youtube tools",
        "instagram tools",
        "hashtag generator",
        "thumbnail checker",
        "creator revenue calculator",
      ],
    },
    theme: {
      accent: "#c026d3",
      accentSoft: "#e879f9",
      accentEmerald: "#d946ef",
      tintFrom: "rgba(192, 38, 211, 0.14)",
      tintTo: "rgba(236, 72, 153, 0.08)",
      tintFromDark: "rgba(232, 121, 249, 0.16)",
      tintToDark: "rgba(236, 72, 153, 0.08)",
      heroGradient: "from-fuchsia-500/20 via-pink-500/10 to-transparent",
      fontHint: "sans",
    },
    featuredToolIds: [
      "youtube-thumbnail-checker",
      "youtube-channel-insights",
      "youtube-revenue-calculator",
      "instagram-hashtag-generator",
      "instagram-profile-insights",
      "instagram-revenue-calculator",
      "safe-zone-checker",
      "social-image-size-checker",
      "image-compressor",
      "youtube-chapter-generator",
      "youtube-tags-generator",
      "adsense-revenue-calculator",
    ],
    recommendedCategories: ["productivity", "design"],
    recommendedSeoCategories: ["social-media", "image", "pdf", "seo"],
  },
  {
    id: "developer",
    title: "Developer",
    slug: "developers",
    shortLabel: "Developer",
    description:
      "Formatters, encoders, Salesforce helpers, and everyday engineering utilities — fast, private, and browser-based.",
    seo: {
      title: "Free Developer & Salesforce Tools | Ranburg",
      description:
        "Free developer tools: JSON/SQL formatters, Base64, JWT decoder, regex tester, UUID generator, and Salesforce formula/SOQL helpers. No signup required.",
      keywords: [
        "developer tools",
        "json formatter",
        "salesforce tools",
        "jwt decoder",
        "regex tester",
        "soql builder",
      ],
    },
    theme: {
      accent: "#10b981",
      accentSoft: "#34d399",
      accentEmerald: "#059669",
      tintFrom: "rgba(16, 185, 129, 0.12)",
      tintTo: "rgba(5, 150, 105, 0.06)",
      tintFromDark: "rgba(52, 211, 153, 0.14)",
      tintToDark: "rgba(16, 185, 129, 0.06)",
      heroGradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      fontHint: "mono",
    },
    featuredToolIds: [
      "json-formatter",
      "sql-formatter",
      "regex-tester",
      "jwt-decoder",
      "base64-encoder",
      "uuid-generator",
      "minifier",
      "csv-to-json",
      "formula-generator",
      "soql-builder",
      "cron-generator",
      "password-generator",
    ],
    recommendedCategories: ["developer", "salesforce"],
    recommendedSeoCategories: ["developer", "generators", "text"],
  },
  {
    id: "finance-pro",
    title: "Finance Professional",
    slug: "finance-professionals",
    shortLabel: "Finance",
    description:
      "SIP, EMI, GST, salary, and investment calculators for advisors, analysts, and anyone planning money decisions.",
    seo: {
      title: "Free Finance & Investment Calculators | Ranburg",
      description:
        "Free SIP, SWP, EMI, GST, CTC, TDS, and investment calculators for finance professionals. Plan loans, returns, and take-home pay instantly.",
      keywords: [
        "finance calculators",
        "sip calculator",
        "emi calculator",
        "gst calculator",
        "investment tools",
        "ctc calculator",
      ],
    },
    theme: {
      accent: "#1d4ed8",
      accentSoft: "#3b82f6",
      accentEmerald: "#0f766e",
      tintFrom: "rgba(29, 78, 216, 0.12)",
      tintTo: "rgba(15, 118, 110, 0.08)",
      tintFromDark: "rgba(59, 130, 246, 0.14)",
      tintToDark: "rgba(45, 212, 191, 0.06)",
      heroGradient: "from-blue-600/20 via-teal-600/10 to-transparent",
      fontHint: "sans",
    },
    featuredToolIds: [
      "sip",
      "swp",
      "emi",
      "gst-calculator",
      "compound-interest-calculator",
      "ctc-in-hand-calculator",
      "tds-calculator",
      "loan-foreclosure-calculator",
      "currency-converter",
      "profit-margin-calculator",
      "roi-calculator",
      "pf-calculator",
    ],
    recommendedCategories: ["financial"],
    recommendedSeoCategories: ["calculators", "business"],
  },
  {
    id: "small-business",
    title: "Small Business Owner",
    slug: "small-business-owners",
    shortLabel: "Business",
    description:
      "Invoices, margins, QR codes, PDFs, and growth calculators — practical tools to run and market a small business.",
    seo: {
      title: "Free Business Tools for Small Business Owners | Ranburg",
      description:
        "Free invoice generator, profit margin, break-even, QR code, PDF, and marketing tools for small business owners. No signup required.",
      keywords: [
        "small business tools",
        "invoice generator",
        "profit margin calculator",
        "qr code generator",
        "break even calculator",
        "pdf tools",
      ],
    },
    theme: {
      accent: "#0f766e",
      accentSoft: "#14b8a6",
      accentEmerald: "#b45309",
      tintFrom: "rgba(15, 118, 110, 0.12)",
      tintTo: "rgba(180, 83, 9, 0.06)",
      tintFromDark: "rgba(45, 212, 191, 0.14)",
      tintToDark: "rgba(245, 158, 11, 0.06)",
      heroGradient: "from-teal-600/20 via-amber-600/10 to-transparent",
      fontHint: "sans",
    },
    featuredToolIds: [
      "invoice-generator",
      "profit-margin-calculator",
      "break-even-calculator",
      "roi-calculator",
      "qr-generator",
      "pdf-compressor",
      "pdf-merge",
      "ltv-cac",
      "burn-rate-runway-calculator",
      "freelancer-hourly-rate-calculator",
      "meta-tag-generator",
      "word-to-pdf",
    ],
    recommendedCategories: ["financial", "productivity"],
    recommendedSeoCategories: ["business", "pdf", "seo", "calculators"],
  },
];

export function getPersonaById(id: string | null | undefined): Persona | undefined {
  if (!id) return undefined;
  return PERSONAS.find((p) => p.id === id);
}

export function getPersonaBySlug(slug: string | null | undefined): Persona | undefined {
  if (!slug) return undefined;
  return PERSONAS.find((p) => p.slug === slug);
}

export function getFeaturedTools(persona: Persona): ToolConfig[] {
  return persona.featuredToolIds.map(getToolBySlug).filter((t): t is ToolConfig => Boolean(t));
}

/** Featured slugs plus tools from recommended taxonomy/SEO categories (deduped). */
export function getPersonaToolSlugs(persona: Persona): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];

  const push = (slug: string) => {
    if (seen.has(slug)) return;
    if (!getToolBySlug(slug)) return;
    seen.add(slug);
    ordered.push(slug);
  };

  persona.featuredToolIds.forEach(push);

  TOOLS_CONFIG.filter((t) => persona.recommendedCategories.includes(t.category)).forEach((t) =>
    push(t.slug)
  );

  persona.recommendedSeoCategories?.forEach((seoSlug) => {
    getToolsForSeoCategory(seoSlug).forEach((t) => push(t.slug));
  });

  return ordered;
}

export function getRecommendedToolsBeyondFeatured(persona: Persona): ToolConfig[] {
  const featured = new Set(persona.featuredToolIds);
  return getPersonaToolSlugs(persona)
    .filter((slug) => !featured.has(slug))
    .map(getToolBySlug)
    .filter((t): t is ToolConfig => Boolean(t));
}

export function isToolRelevantToPersona(toolSlug: string, persona: Persona | null | undefined): boolean {
  if (!persona) return false;
  return getPersonaToolSlugs(persona).includes(toolSlug);
}
