import type { BlogPost, BlogCategoryId } from "./blogTypes";
import { BLOG_POSTS } from "./blogConfig";

export type { BlogCategoryId } from "./blogTypes";

export const BLOG_CATEGORIES = [
  { id: "creators" as const, label: "Creators" },
  { id: "monetization" as const, label: "Monetization" },
  { id: "calculators" as const, label: "Calculators" },
  { id: "generators" as const, label: "Generators" },
  { id: "digital-marketing" as const, label: "Digital Marketing" },
  { id: "small-business" as const, label: "Small Business" },
  { id: "seo" as const, label: "SEO" },
  { id: "development" as const, label: "Development" },
  { id: "business-productivity" as const, label: "Business" },
  { id: "ai-tools" as const, label: "AI Tools" },
  { id: "salesforce" as const, label: "Salesforce" },
];

export function inferBlogCategory(post: BlogPost): BlogCategoryId {
  if (post.category) return post.category;
  const s = `${post.slug} ${post.title}`.toLowerCase();
  if (s.includes("claude") || s.includes("cursor") || s.includes("ai ")) return "ai-tools";
  if (s.includes("salesforce") || s.includes("omnistudio") || s.includes("revenue cloud") || s.includes("soql") || s.includes("apex")) return "salesforce";
  if (s.includes("youtube") || s.includes("instagram") || s.includes("twitch") || s.includes("creator")) return "creators";
  if (s.includes("adsense") || s.includes("rpm") || s.includes("monetiz")) return "monetization";
  if (s.includes("gst") || s.includes("emi") || s.includes("sip") || s.includes("loan") || s.includes("invoice") || s.includes("calculator")) return "calculators";
  if (s.includes("password") || s.includes("uuid") || s.includes("qr code") || s.includes("generator")) return "generators";
  if (s.includes("json") || s.includes("sql") || s.includes("regex") || s.includes("developer") || s.includes("base64")) return "development";
  if (s.includes("seo") || s.includes("linkedin") || s.includes("lorem")) return "seo";
  return "business-productivity";
}

export function getRelatedBlogPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = BLOG_POSTS.find((p) => p.slug === currentSlug);
  if (!current) return BLOG_POSTS.slice(0, limit);
  const cat = inferBlogCategory(current);
  const same = BLOG_POSTS.filter((p) => p.slug !== currentSlug && inferBlogCategory(p) === cat);
  const relatedTools = new Set(current.relatedTools);
  const byTool = BLOG_POSTS.filter(
    (p) =>
      p.slug !== currentSlug &&
      !same.includes(p) &&
      p.relatedTools.some((t) => relatedTools.has(t))
  );
  const rest = BLOG_POSTS.filter((p) => p.slug !== currentSlug && !same.includes(p) && !byTool.includes(p));
  return [...same, ...byTool, ...rest].slice(0, limit);
}
