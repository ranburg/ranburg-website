import type { BlogPost, BlogCategoryId } from "./blogTypes";
import { inferBlogCategory } from "./blogCategories";

/**
 * Verified Unsplash photo IDs (HTTP 200 as of 2026).
 * Format: images.unsplash.com/photo-{id}
 */
const VERIFIED_PHOTOS = {
  workspace: "1504384308090-c894fdcc538d",
  macbook: "1486312338219-ce68d2c6f44d",
  laptopDesk: "1504868584819-f8e8b4b6d7e3",
  laptopsRow: "1547658719-da2b51169166",
  codeScreen: "1555066931-4365d14bab8c",
  codeMatrix: "1526374965328-7f61d4dc18c5",
  typing: "1516321318423-f06f85e504b3",
  codeEditor: "1627398242454-45a1465c2479",
  analytics: "1460925895917-afdab827c52f",
  dashboard: "1551288049-bebda4e38f71",
  teamLaptop: "1551434678-e076c223a692",
  collaboration: "1522071820081-009f0129c71c",
  meeting: "1600880292203-757bb62b4baf",
  office: "1556761175-b413da4baf72",
  officeWide: "1517245386807-bb43f82c33c4",
  startup: "1553877522-43269d4ea984",
  teamwork: "1552664730-d307ca884978",
  group: "1529156069898-49953e39b3ac",
  team: "1522202176988-66273c2fd55f",
  socialPhone: "1563986768609-322da13575f3",
  mobile: "1551650975-87deedd944c3",
  portrait: "1507003211169-0a1dd7228f2d",
  social: "1534528741775-53994a69daeb",
  finance: "1554224154-26032ffc0d07",
  payment: "1556742049-0cfed4f6a45d",
  coins: "1554224155-6726b3ff858f",
  design: "1504639725590-34d0984388bd",
  aiAbstract: "1677442136019-21780ecad995",
  aiBrain: "1620712943543-bcc4688e7485",
  aiChip: "1633356122544-f134324a6cee",
  cyber: "1550751827-4bd374c3f58b",
  globeTech: "1451187580459-43490279c0fa",
} as const;

const CATEGORY_IMAGE_POOLS: Record<BlogCategoryId, string[]> = {
  creators: [
    VERIFIED_PHOTOS.social,
    VERIFIED_PHOTOS.group,
    VERIFIED_PHOTOS.socialPhone,
    VERIFIED_PHOTOS.mobile,
    VERIFIED_PHOTOS.portrait,
  ],
  monetization: [
    VERIFIED_PHOTOS.dashboard,
    VERIFIED_PHOTOS.analytics,
    VERIFIED_PHOTOS.finance,
    VERIFIED_PHOTOS.payment,
    VERIFIED_PHOTOS.coins,
  ],
  calculators: [
    VERIFIED_PHOTOS.coins,
    VERIFIED_PHOTOS.finance,
    VERIFIED_PHOTOS.payment,
    VERIFIED_PHOTOS.dashboard,
    VERIFIED_PHOTOS.analytics,
  ],
  generators: [
    VERIFIED_PHOTOS.codeScreen,
    VERIFIED_PHOTOS.typing,
    VERIFIED_PHOTOS.codeMatrix,
    VERIFIED_PHOTOS.design,
    VERIFIED_PHOTOS.codeEditor,
  ],
  "digital-marketing": [
    VERIFIED_PHOTOS.teamwork,
    VERIFIED_PHOTOS.startup,
    VERIFIED_PHOTOS.analytics,
    VERIFIED_PHOTOS.socialPhone,
    VERIFIED_PHOTOS.dashboard,
  ],
  "small-business": [
    VERIFIED_PHOTOS.office,
    VERIFIED_PHOTOS.teamLaptop,
    VERIFIED_PHOTOS.collaboration,
    VERIFIED_PHOTOS.meeting,
    VERIFIED_PHOTOS.officeWide,
  ],
  seo: [
    VERIFIED_PHOTOS.analytics,
    VERIFIED_PHOTOS.dashboard,
    VERIFIED_PHOTOS.laptopDesk,
    VERIFIED_PHOTOS.laptopsRow,
    VERIFIED_PHOTOS.workspace,
  ],
  development: [
    VERIFIED_PHOTOS.codeScreen,
    VERIFIED_PHOTOS.laptopsRow,
    VERIFIED_PHOTOS.codeMatrix,
    VERIFIED_PHOTOS.codeEditor,
    VERIFIED_PHOTOS.typing,
  ],
  "business-productivity": [
    VERIFIED_PHOTOS.macbook,
    VERIFIED_PHOTOS.workspace,
    VERIFIED_PHOTOS.collaboration,
    VERIFIED_PHOTOS.office,
    VERIFIED_PHOTOS.team,
  ],
  "ai-tools": [
    VERIFIED_PHOTOS.aiAbstract,
    VERIFIED_PHOTOS.aiBrain,
    VERIFIED_PHOTOS.aiChip,
    VERIFIED_PHOTOS.cyber,
    VERIFIED_PHOTOS.codeScreen,
  ],
  salesforce: [
    VERIFIED_PHOTOS.globeTech,
    VERIFIED_PHOTOS.dashboard,
    VERIFIED_PHOTOS.cyber,
    VERIFIED_PHOTOS.analytics,
    VERIFIED_PHOTOS.teamLaptop,
  ],
};

const CATEGORY_GRADIENTS: Record<BlogCategoryId, string> = {
  creators: "from-rose-600/80 via-pink-600/40 to-transparent",
  monetization: "from-emerald-600/80 via-green-600/40 to-transparent",
  calculators: "from-blue-600/80 via-indigo-600/40 to-transparent",
  generators: "from-violet-600/80 via-purple-600/40 to-transparent",
  "digital-marketing": "from-orange-600/80 via-amber-600/40 to-transparent",
  "small-business": "from-slate-700/80 via-slate-600/40 to-transparent",
  seo: "from-cyan-600/80 via-teal-600/40 to-transparent",
  development: "from-sky-600/80 via-blue-600/40 to-transparent",
  "business-productivity": "from-indigo-600/80 via-blue-700/40 to-transparent",
  "ai-tools": "from-fuchsia-600/80 via-violet-600/40 to-transparent",
  salesforce: "from-blue-700/80 via-indigo-600/40 to-transparent",
};

const CATEGORY_ACCENT: Record<BlogCategoryId, string> = {
  creators: "from-rose-500 to-pink-600",
  monetization: "from-emerald-500 to-green-600",
  calculators: "from-blue-500 to-indigo-600",
  generators: "from-violet-500 to-purple-600",
  "digital-marketing": "from-orange-500 to-amber-600",
  "small-business": "from-slate-500 to-slate-700",
  seo: "from-cyan-500 to-teal-600",
  development: "from-sky-500 to-blue-600",
  "business-productivity": "from-indigo-500 to-blue-700",
  "ai-tools": "from-fuchsia-500 to-violet-600",
  salesforce: "from-blue-600 to-indigo-700",
};

/** Solid gradient fallback when an image fails to load */
const CATEGORY_FALLBACK_BG: Record<BlogCategoryId, string> = {
  creators: "bg-gradient-to-br from-rose-600 via-pink-600 to-orange-500",
  monetization: "bg-gradient-to-br from-emerald-600 via-green-600 to-teal-500",
  calculators: "bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-500",
  generators: "bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500",
  "digital-marketing": "bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500",
  "small-business": "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800",
  seo: "bg-gradient-to-br from-cyan-600 via-teal-600 to-blue-600",
  development: "bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700",
  "business-productivity": "bg-gradient-to-br from-indigo-600 via-blue-700 to-violet-700",
  "ai-tools": "bg-gradient-to-br from-fuchsia-600 via-violet-600 to-purple-700",
  salesforce: "bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-800",
};

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pickFromPool(category: BlogCategoryId, seed: string): string {
  const pool = CATEGORY_IMAGE_POOLS[category];
  const index = hashString(seed) % pool.length;
  return pool[index];
}

export function buildUnsplashUrl(photoId: string, width = 1200, height = 675): string {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

export function getBlogCoverImage(post: BlogPost): string {
  if (post.coverImage) return post.coverImage;
  const category = inferBlogCategory(post);
  const photoId = pickFromPool(category, post.slug);
  return buildUnsplashUrl(photoId, 1200, 675);
}

export function getBlogSectionImage(post: BlogPost, sectionIndex: number): string {
  const category = inferBlogCategory(post);
  const photoId = pickFromPool(category, `${post.slug}-section-${sectionIndex}`);
  return buildUnsplashUrl(photoId, 960, 540);
}

export function getBlogCategoryGradient(category: BlogCategoryId): string {
  return CATEGORY_GRADIENTS[category];
}

export function getBlogCategoryAccent(category: BlogCategoryId): string {
  return CATEGORY_ACCENT[category];
}

export function getBlogCategoryFallbackBg(category: BlogCategoryId): string {
  return CATEGORY_FALLBACK_BG[category];
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
