import { TOOLS_CONFIG } from "./toolsConfig";
import type { SeoCategorySlug } from "./toolSeoCategories";

export interface CatalogChip {
  slug: string;
  label: string;
}

export interface CatalogSection {
  id: string;
  label: string;
  description: string;
  icon: string;
  gradient: string;
  hubSlug: SeoCategorySlug;
  slugs: string[];
}

/** Hero quick-jump chips — high-intent tools. */
export const FEATURED_QUICK_CHIPS: CatalogChip[] = [
  { slug: "home-loan-vs-mutual-fund", label: "Home vs SIP" },
  { slug: "emi", label: "EMI Calculator" },
  { slug: "sip", label: "SIP Calculator" },
  { slug: "gst-calculator", label: "GST Calculator" },
  { slug: "pdf-merge", label: "PDF Merge" },
  { slug: "invoice-generator", label: "Invoice Generator" },
  { slug: "json-formatter", label: "JSON Formatter" },
];

/** Featured “pick a tool” strip on the homepage. */
export const HOMEPAGE_FEATURED_SLUGS = [
  "home-loan-vs-mutual-fund",
  "ctc-in-hand-calculator",
  "invoice-generator",
  "pdf-merge",
  "json-formatter",
  "image-compressor",
  "qr-generator",
  "emi",
  "sip",
  "gst-calculator",
  "password-generator",
  "resume-builder",
  "text-diff-checker",
] as const;

export const CATALOG_SECTIONS: CatalogSection[] = [
  {
    id: "financial",
    label: "Financial & Tax Calculators",
    description:
      "Salary, GST, loans, SIPs, and retirement math — instant estimates for India and global planning.",
    icon: "Calculator",
    gradient: "from-cyan-500 to-blue-600",
    hubSlug: "calculators",
    slugs: [
      "ctc-in-hand-calculator",
      "gst-calculator",
      "emi",
      "sip",
      "swp",
      "lic-maturity-calculator",
      "pf-calculator",
      "ppf-calculator",
      "loan-foreclosure-calculator",
      "home-loan-vs-mutual-fund",
      "rent-vs-buy-calculator",
      "tds-calculator",
      "hra-exemption-calculator",
      "gratuity-calculator",
    ],
  },
  {
    id: "business",
    label: "Business & Professional Documents",
    description:
      "Invoices, resumes, signatures, and ROI tools for freelancers and growing teams.",
    icon: "Receipt",
    gradient: "from-amber-500 to-orange-600",
    hubSlug: "business",
    slugs: [
      "invoice-generator",
      "resume-builder",
      "pdf-signer",
      "roi-calculator",
      "profit-margin-calculator",
      "break-even-calculator",
      "freelancer-hourly-rate-calculator",
      "burn-rate-runway-calculator",
      "hsn-sac-finder",
      "ifsc-finder",
    ],
  },
  {
    id: "pdf",
    label: "PDF & Document Utilities",
    description:
      "Merge, split, compress, reorder, and extract text — all in your browser, no uploads.",
    icon: "Files",
    gradient: "from-red-500 to-orange-500",
    hubSlug: "pdf",
    slugs: [
      "pdf-merge",
      "pdf-split",
      "pdf-compressor",
      "pdf-page-extractor",
      "pdf-page-reorder",
      "pdf-to-text",
      "pdf-to-jpg",
      "jpg-to-pdf",
      "pdf-page-remover",
      "word-to-pdf",
    ],
  },
  {
    id: "developer",
    label: "Developer & Data Tools",
    description:
      "Format JSON, compare text, test regex, encode payloads, and preview Markdown.",
    icon: "Code2",
    gradient: "from-blue-500 to-indigo-600",
    hubSlug: "developer",
    slugs: [
      "json-formatter",
      "text-diff-checker",
      "regex-tester",
      "base64-encoder",
      "markdown-preview",
      "password-generator",
      "jwt-decoder",
      "csv-to-json",
      "sql-formatter",
      "uuid-generator",
    ],
  },
  {
    id: "media",
    label: "Media & Image Utilities",
    description:
      "Compress photos, convert formats, generate branded QR codes, and key out backgrounds.",
    icon: "Images",
    gradient: "from-pink-500 to-rose-600",
    hubSlug: "image",
    slugs: [
      "image-compressor",
      "image-resizer",
      "heic-to-jpg",
      "qr-generator",
      "color-background-remover",
      "jpg-to-png",
      "png-to-webp",
      "crop-image",
      "remove-exif",
      "svg-to-png",
    ],
  },
  {
    id: "productivity",
    label: "Productivity & Everyday Tools",
    description:
      "Word counts, passwords, screen recording, and unit conversion for daily work.",
    icon: "Wand",
    gradient: "from-violet-500 to-purple-600",
    hubSlug: "generators",
    slugs: [
      "word-counter",
      "password-generator",
      "screen-recorder",
      "unit-converter",
      "age-calculator",
      "currency-converter",
      "case-converter",
      "lorem-ipsum",
      "slug-generator",
      "sleep-calculator",
    ],
  },
];

export function getCatalogTools(slugs: readonly string[]) {
  return slugs
    .map((slug) => TOOLS_CONFIG.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
}

export const TOOL_CATALOG_COUNT = TOOLS_CONFIG.length;
