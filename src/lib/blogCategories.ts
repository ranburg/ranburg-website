import type { BlogPost } from "./blogTypes";
import { BLOG_POSTS } from "./blogConfig";

export const BLOG_CATEGORIES = [
  { id: "seo", label: "SEO" },
  { id: "development", label: "Development" },
  { id: "business-productivity", label: "Business Productivity" },
  { id: "ai-tools", label: "AI Tools" },
  { id: "salesforce", label: "Salesforce" },
] as const;

export type BlogCategoryId = (typeof BLOG_CATEGORIES)[number]["id"];

export function inferBlogCategory(post: BlogPost): BlogCategoryId {
  if (post.category) return post.category;
  const s = `${post.slug} ${post.title}`.toLowerCase();
  if (s.includes("claude") || s.includes("cursor") || s.includes("ai ")) return "ai-tools";
  if (s.includes("salesforce") || s.includes("omnistudio") || s.includes("revenue cloud") || s.includes("soql") || s.includes("apex")) return "salesforce";
  if (s.includes("seo") || s.includes("json") || s.includes("developer")) return "development";
  return "business-productivity";
}

export function getRelatedBlogPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = BLOG_POSTS.find((p) => p.slug === currentSlug);
  if (!current) return BLOG_POSTS.slice(0, limit);
  const cat = inferBlogCategory(current);
  const same = BLOG_POSTS.filter((p) => p.slug !== currentSlug && inferBlogCategory(p) === cat);
  const rest = BLOG_POSTS.filter((p) => p.slug !== currentSlug && !same.includes(p));
  return [...same, ...rest].slice(0, limit);
}
