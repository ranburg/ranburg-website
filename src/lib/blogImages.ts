import type { BlogPost, BlogCategoryId } from "./blogTypes";
import { inferBlogCategory } from "./blogCategories";

/** Unsplash photo IDs — tech & topic-relevant stock imagery */
const CATEGORY_IMAGE_POOLS: Record<BlogCategoryId, string[]> = {
  creators: [
    "1611162616475-24b65b0e751e",
    "1529156069898-49953e39b3ac",
    "1611162616305-c69b3fa7a2be",
    "1557804506-669a77965ee3",
  ],
  monetization: [
    "1551288049-bebda4e38f71",
    "1611974789855-9c2a4a4756a9",
    "1460925895917-afdab827c52f",
    "1554224154-26032ffc0d07",
  ],
  calculators: [
    "1554224155-6726b3ff858f",
    "1579621970563-ebec756d7782",
    "1556742049-0cfed4f6a45d",
    "1611224923851-80b023f02d96",
  ],
  generators: [
    "1555066931-4365d14bab8c",
    "1516321318423-f06f85e504b3",
    "1526374965328-7f61d4dc18c5",
    "1504639725590-34d0984388bd",
  ],
  "digital-marketing": [
    "1552664730-d307ca884978",
    "1533750349088-2226f88b786d",
    "1460925895917-afdab827c52f",
    "1557804506-669a77965ee3",
  ],
  "small-business": [
    "1556761175-b413da4baf72",
    "1551434678-e076c223a692",
    "1522071820081-009f0129c71c",
    "1600880292203-757bb62b4baf",
  ],
  seo: [
    "1432888498266-38ffec3eaf4a",
    "1460925895917-afdab827c52f",
    "1551288049-bebda4e38f71",
    "1504868584819-f8e8b4b6d7e3",
  ],
  development: [
    "1555066931-4365d14bab8c",
    "1498050108023-c5249f4df850",
    "1555949963-aa79dee941a8",
    "1516321318423-f06f85e504b3",
  ],
  "business-productivity": [
    "1486312338219-ce68d2c6f44d",
    "1504384308090-c894fdcc538d",
    "1522071820081-009f0129c71c",
    "1556761175-b413da4baf72",
  ],
  "ai-tools": [
    "1677442136019-21780ecad995",
    "1620712943543-bcc4688e7485",
    "1676297753962-41a8ae188a0b",
    "1535378917042-45dd3dd0146d",
  ],
  salesforce: [
    "1451187580459-43490279c0fa",
    "1551288049-bebda4e38f71",
    "1550751827-4bd374c3f58b",
    "1460925895917-afdab827c52f",
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

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
